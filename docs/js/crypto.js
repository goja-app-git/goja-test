async function deriveKey(passphrase, saltBytes, iter){
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name:"PBKDF2", hash:"SHA-256", salt:saltBytes, iterations:iter },
    baseKey,
    { name:"AES-GCM", length:256 },
    false,
    ["encrypt"]
  );
}

export async function encryptToBytes(obj, passphrase, iter){
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(passphrase, salt, iter);

  const txt = JSON.stringify(obj);
  const pt = new TextEncoder().encode(txt);

  const ctBuf = await crypto.subtle.encrypt(
    { name:"AES-GCM", iv },
    key,
    pt
  );

  return {
    salt,
    iv,
    cipher: new Uint8Array(ctBuf)
  };
}