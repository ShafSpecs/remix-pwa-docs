import { createHash } from 'crypto';

export function generateETag(data: object) {
  const hash = createHash('md5');
  hash.update(JSON.stringify(data));
  return `"${hash.digest('hex')}"`;
}
