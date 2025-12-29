export function bytesToDigits3(bytes){
  let out = "";
  for (const b of bytes){
    const n = Number(b);
    if (!Number.isFinite(n) || n < 0 || n > 255) throw new Error("byte_range");
    out += String(n).padStart(3, "0");
  }
  return out;
}

export function digits3ToBytes(digits){
  const s = String(digits);
  if (s.length % 3 !== 0) throw new Error("digits_len");
  const out = new Uint8Array(s.length / 3);
  for (let i=0; i<s.length; i+=3){
    const n = Number(s.slice(i, i+3));
    if (!Number.isFinite(n) || n < 0 || n > 255) throw new Error("digits_range");
    out[i/3] = n;
  }
  return out;
}