import { CFG } from "./config.js";

export function loadState(){
  const raw = localStorage.getItem(CFG.KEY_STATE);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveState(state){
  localStorage.setItem(CFG.KEY_STATE, JSON.stringify(state));
}

export function clearState(){
  localStorage.removeItem(CFG.KEY_STATE);
  localStorage.removeItem(CFG.KEY_CIPHER);
}

export function saveCipherString(s){
  localStorage.setItem(CFG.KEY_CIPHER, s);
}

export function loadCipherString(){
  return localStorage.getItem(CFG.KEY_CIPHER) || "";
}