export const CFG = {
  APP_NAME: "ごじゃ心理テスト",

  // 暗号（菜花ロイド側と一致必須）
  PASSPHRASE: "nabana",
  PBKDF2_ITER: 120000,

  // 質問数
  AXES: 25,             // 25軸 × 60問 = 1500問
  QUESTIONS_PER_AXIS: 60,

  // localStorage keys
  KEY_STATE: "goja_psy_state_v1",
  KEY_CIPHER: "goja_psy_cipher_v1"
};