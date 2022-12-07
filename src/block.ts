export class Block {
  timestamp: number;
  lastHash: string;
  hash: string;
  data: any;

  constructor(timestamp: number, lastHash: string, hash: string, data: any) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  toString() {
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Data      : ${this.data}`;
  }
}

export function genesis() {
  return new Block(Date.now(), '-----', 'f1r57-h45h', []);
}

export async function hashData(timestamp: number, lastHash: string, data: any) {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${timestamp}${lastHash}${data}`),
  );

  // return string
  return Array.from(new Uint8Array(buffer))
    .map((x) => ('00' + x.toString(16)).slice(-2))
    .join('');
}

export async function mineBlock(lastBlock: Block, data: any) {
  const timestamp = Date.now();
  const lastHash = lastBlock.hash;
  const hash = await hashData(timestamp, lastHash, data);

  return new Block(timestamp, lastHash, hash, data);
}
