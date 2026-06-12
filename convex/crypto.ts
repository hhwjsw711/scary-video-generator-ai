const ALGORITHM = "AES-GCM";
const IV_LENGTH = 12;

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const length = arrays.reduce((a, b) => a + b.length, 0);
  const result = new Uint8Array(length);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

async function getKey(): Promise<CryptoKey> {
  const rawKey = hexToBytes(process.env.ENCRYPTION_KEY ?? "");
  return await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: ALGORITHM, length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encrypt(text: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await getKey();
  const encoded = new TextEncoder().encode(text);
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoded,
  );
  return bytesToHex(concatBytes(iv, new Uint8Array(ciphertext)));
}

export async function decrypt(encrypted: string): Promise<string | null> {
  try {
    const data = hexToBytes(encrypted);
    const iv = data.slice(0, IV_LENGTH);
    const ciphertext = data.slice(IV_LENGTH);
    const key = await getKey();
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      ciphertext,
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
}
