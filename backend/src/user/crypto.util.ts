import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';

const keyDir = path.join(process.cwd(), 'keys');
const privateKeyPath = path.join(keyDir, 'private.pem');
const publicKeyPath = path.join(keyDir, 'public.pem');

export function getKeys() {
  if (!fs.existsSync(keyDir)) fs.mkdirSync(keyDir);

  if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(publicKeyPath, publicKey);
  }

  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

  return { privateKey, publicKey };
}
