import { fetchPublicKey } from "./fetcher";

let cachedPublicKey: string | null = null;
let cryptoKey: CryptoKey | null = null;

function pemToArrayBuffer(pem: string) {
  const b64 = pem.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\n/g, '');
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

export async function getCachedPublicKey() {
  if (cryptoKey) return cryptoKey;

  if (!cachedPublicKey) {
    cachedPublicKey = await fetchPublicKey();
    
  }

  if (!cachedPublicKey) throw new Error('Public key not available');

  const keyBuffer = pemToArrayBuffer(cachedPublicKey);
  cryptoKey = await crypto.subtle.importKey(
    'spki',
    keyBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' },
    },
    false,
    ['verify']
  );

  return cryptoKey;
}

export async function verifyUser(user: { email: string; signature: string }): Promise<boolean> {
  const publicKey = await getCachedPublicKey();
  const emailBuffer = new TextEncoder().encode(user.email);
  const emailHash = await crypto.subtle.digest('SHA-384', emailBuffer);

  const signatureBytes = Uint8Array.from(atob(user.signature), c => c.charCodeAt(0));

  return await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    signatureBytes,
    emailHash
  );
}