import { CFG } from "./config.js";

/**
 * 50タグ（25軸）
 * - UIにはタグ名は出さない（裏側の重み計算用）
 * - choiceA/choiceB がボタン文言
 */
export const AXES = [
  { a:"money_save", b:"money_spend", choiceA:"節約したい", choiceB:"多少高くても満足を取りたい" },
  { a:"plan_strict", b:"plan_spontaneous", choiceA:"計画を固めたい", choiceB:"ノリで動きたい" },
  { a:"move_fast", b:"move_scenic", choiceA:"早く着きたい", choiceB:"景色や寄り道を優先したい" },
  { a:"move_public", b:"move_car", choiceA:"公共交通がいい", choiceB:"車移動がいい" },
  { a:"move_walk", b:"move_no_walk", choiceA:"歩くのOK", choiceB:"なるべく歩きたくない" },

  { a:"time_early", b:"time_late", choiceA:"早起き寄り", choiceB:"夜型寄り" },
  { a:"crowd_ok", b:"crowd_avoid", choiceA:"混んでてもOK", choiceB:"混雑は避けたい" },
  { a:"act_indoor", b:"act_outdoor", choiceA:"インドアが好き", choiceB:"アウトドアが好き" },
  { a:"act_active", b:"act_relax", choiceA:"体験/アクティブ重視", choiceB:"休養/ゆっくり重視" },
  { a:"place_onsen", b:"place_city", choiceA:"温泉/自然寄り", choiceB:"街/都会寄り" },

  { a:"mem_photo", b:"mem_no_photo", choiceA:"写真を撮りたい", choiceB:"写真は別にいい" },
  { a:"shop_yes", b:"shop_no", choiceA:"買い物もしたい", choiceB:"買い物は最小でいい" },
  { a:"food_local", b:"food_safe", choiceA:"現地の名物を攻めたい", choiceB:"安定の味がいい" },
  { a:"food_spicy", b:"food_mild", choiceA:"辛いのOK", choiceB:"辛いのは避けたい" },
  { a:"food_heavy", b:"food_light", choiceA:"こってりOK", choiceB:"あっさりがいい" },

  { a:"choice_new", b:"choice_stable", choiceA:"新しいの試したい", choiceB:"いつも通りが安心" },
  { a:"social_talk", b:"social_quiet", choiceA:"わいわいしたい", choiceB:"静かに過ごしたい" },
  { a:"pack_light", b:"pack_prepared", choiceA:"荷物は少なめ", choiceB:"装備は万全がいい" },
  { a:"time_morning", b:"time_night", choiceA:"朝に動きたい", choiceB:"夜に動きたい" },
  { a:"risk_adventure", b:"risk_safe", choiceA:"冒険してもOK", choiceB:"安全/確実がいい" },

  { a:"stay_budget", b:"stay_comfort", choiceA:"安い宿でいい", choiceB:"快適さ重視" },
  { a:"stay_shared", b:"stay_private", choiceA:"相部屋でもOK", choiceB:"個室がいい" },
  { a:"plan_tight", b:"plan_flexible", choiceA:"予定は詰めたい", choiceB:"余白がほしい" },
  { a:"money_equal", b:"money_usebased", choiceA:"割り勘で統一したい", choiceB:"使った分で分けたい" },
  { a:"souvenir_yes", b:"souvenir_no", choiceA:"お土産を買いたい", choiceB:"お土産は別にいい" }
];

// 60個の状況文（これ×25軸 = 1500問）
const CONTEXTS = [
  "旅行の初日",
  "旅行の2日目の朝",
  "旅行の2日目の夜",
  "旅行の最終日",
  "集合直後",
  "出発前日の夜",
  "宿に着いた直後",
  "チェックアウト直後",
  "昼ごはんの時間",
  "夜ごはんの時間",
  "小腹が空いたとき",
  "休憩したいとき",
  "雨が降ってる日",
  "晴れてる日",
  "寒い日",
  "暑い日",
  "疲れてるとき",
  "元気なとき",
  "時間がないとき",
  "時間に余裕があるとき",
  "お金がピンチのとき",
  "お金に余裕があるとき",
  "混んでる街中",
  "空いてる場所",
  "初めて行く土地",
  "何回も行った場所",
  "友達が乗り気のとき",
  "友達が疲れてるとき",
  "朝早く動けそうな日",
  "夜更かししたい日",
  "移動が長い日",
  "移動が短い日",
  "歩く距離が多い日",
  "歩きたくない日",
  "景色がきれいな場所",
  "観光地ど真ん中",
  "穴場っぽい場所",
  "駅の近く",
  "山/海の近く",
  "商店街の近く",
  "温泉が近い場所",
  "コンビニが近い場所",
  "予定が詰まってる日",
  "予定が空いてる日",
  "写真映えしそうな場所",
  "食べ物が多い場所",
  "買い物が多い場所",
  "アクティビティがある場所",
  "ゆっくりできる場所",
  "夜景がきれいな場所",
  "朝焼けがきれいな場所",
  "行列ができてる店の前",
  "サクッと入れる店の前",
  "予定外の寄り道が出たとき",
  "予定通り進めたいとき",
  "体力を温存したいとき",
  "ガッツリ動きたいとき",
  "みんなの意見が割れたとき",
  "最後に思い出作りしたいとき"
];

// CONTEXTSは60個であることを保証
if (CONTEXTS.length !== CFG.QUESTIONS_PER_AXIS) {
  console.warn("CONTEXTS length mismatch:", CONTEXTS.length);
}

/**
 * 1500問生成（表示テキストは最低限、タグ名は出さない）
 */
export function buildQuestions(){
  const qs = [];
  for (let axisIndex=0; axisIndex<AXES.length; axisIndex++){
    const ax = AXES[axisIndex];
    for (let i=0; i<CFG.QUESTIONS_PER_AXIS; i++){
      const ctx = CONTEXTS[i];
      qs.push({
        id: `${axisIndex}-${i}`,
        axisIndex,
        text: `${ctx}：どっちが近い？`,
        choiceA: ax.choiceA,
        choiceB: ax.choiceB,
        tagA: ax.a,
        tagB: ax.b
      });
    }
  }
  // 1500問
  return qs;
}