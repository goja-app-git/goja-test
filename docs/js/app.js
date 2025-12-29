import { CFG } from "./config.js";
import { buildQuestions } from "./questions.js";
import { loadState, saveState, clearState, saveCipherString, loadCipherString } from "./storage.js";
import { encryptToBytes } from "./crypto.js";
import { bytesToDigits3 } from "./digits_codec.js";

const screenStart = document.getElementById("screenStart");
const screenQuiz  = document.getElementById("screenQuiz");
const screenDone  = document.getElementById("screenDone");

const btnStart = document.getElementById("btnStart");
const startMsg = document.getElementById("startMsg");

const qText = document.getElementById("qText");
const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const btnReset = document.getElementById("btnReset");
const saveLamp = document.getElementById("saveLamp");

const cipherOut = document.getElementById("cipherOut");
const btnCopy = document.getElementById("btnCopy");
const btnRestart = document.getElementById("btnRestart");
const copyMsg = document.getElementById("copyMsg");

const QUESTIONS = buildQuestions(); // 1500問

function show(el){
  screenStart.classList.add("hidden");
  screenQuiz.classList.add("hidden");
  screenDone.classList.add("hidden");
  el.classList.remove("hidden");
}

function lampTick(){
  saveLamp.textContent = "自動保存";
  saveLamp.style.opacity = "1";
  setTimeout(()=>{ saveLamp.style.opacity = "0.55"; }, 250);
}

function initState(){
  // counts[tag] = 選ばれた回数
  const counts = {};
  for (const q of QUESTIONS){
    counts[q.tagA] = 0;
    counts[q.tagB] = 0;
  }
  return {
    i: 0,           // 現在の質問index
    counts,         // タグごとの選択回数
    answered: 0     // 回答総数
  };
}

function renderQuestion(state){
  const q = QUESTIONS[state.i];
  if (!q) return;
  qText.textContent = q.text;
  btnA.textContent = q.choiceA;
  btnB.textContent = q.choiceB;
}

async function finalize(state){
  // 25軸×60問 = 1500問
  // 各タグは 0.0〜1.0 の選択率（対軸内の割合）としてweight化
  const weights = {};

  // まず軸ごとに分母を作る（60固定）
  const perAxis = CFG.QUESTIONS_PER_AXIS;

  // AXESはquestions.jsで定義されてるが、ここではQUESTIONSから集約する
  // タグの分母は「そのタグが出る回数」＝60
  const tagTotal = {};
  for (const q of QUESTIONS){
    tagTotal[q.tagA] = (tagTotal[q.tagA] || 0) + 1;
    tagTotal[q.tagB] = (tagTotal[q.tagB] || 0) + 1;
  }

  for (const [tag, c] of Object.entries(state.counts)){
    const tot = tagTotal[tag] || perAxis; // 念のため
    weights[tag] = tot > 0 ? (c / tot) : 0;
  }

  const payload = {
    weights,
    bias: 0,
    meta: {
      app: CFG.APP_NAME,
      answered: state.answered,
      created_at: new Date().toISOString()
    }
  };

  // 暗号化
  const enc = await encryptToBytes(payload, CFG.PASSPHRASE, CFG.PBKDF2_ITER);

  // 数字とドットだけにする
  const saltDigits = bytesToDigits3(enc.salt);
  const ivDigits   = bytesToDigits3(enc.iv);
  const ciphDigits = bytesToDigits3(enc.cipher);

  const out = `1.${saltDigits}.${ivDigits}.${ciphDigits}`;
  saveCipherString(out);
  cipherOut.value = out;

  show(screenDone);
}

function answer(state, picked){
  const q = QUESTIONS[state.i];
  if (!q) return;

  if (picked === "A") state.counts[q.tagA] += 1;
  if (picked === "B") state.counts[q.tagB] += 1;

  state.i += 1;
  state.answered += 1;

  saveState(state);
  lampTick();

  if (state.i >= QUESTIONS.length){
    finalize(state);
  }else{
    renderQuestion(state);
  }
}

function startOrResume(){
  const saved = loadState();
  const state = saved || initState();
  saveState(state);

  show(screenQuiz);

  // 既に完了してたらdoneへ
  if (state.i >= QUESTIONS.length){
    const c = loadCipherString();
    cipherOut.value = c || "";
    show(screenDone);
    return;
  }

  renderQuestion(state);

  // ボタン
  btnA.onclick = () => answer(state, "A");
  btnB.onclick = () => answer(state, "B");
}

btnStart.addEventListener("click", () => startOrResume());

btnReset.addEventListener("click", () => {
  clearState();
  const state = initState();
  saveState(state);
  renderQuestion(state);
  lampTick();
});

btnCopy.addEventListener("click", async () => {
  const text = cipherOut.value.trim();
  if (!text){
    copyMsg.textContent = "空です";
    return;
  }
  try{
    await navigator.clipboard.writeText(text);
    copyMsg.textContent = "コピーした";
  }catch{
    // iOSでclipboardが落ちる場合用
    cipherOut.focus();
    cipherOut.select();
    copyMsg.textContent = "選択した（手動でコピーして）";
  }
});

btnRestart.addEventListener("click", () => {
  clearState();
  cipherOut.value = "";
  copyMsg.textContent = "";
  show(screenStart);
});

// 起動時：保存があればそのまま続行できる（ただし勝手に開始はしない）
(() => {
  const saved = loadState();
  if (saved && saved.answered > 0){
    startMsg.textContent = "続きから再開できます（開始を押す）";
  }
})();