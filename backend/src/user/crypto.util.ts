import crypto from 'crypto';

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

export function getKeys() {
  return { privateKey, publicKey };
}