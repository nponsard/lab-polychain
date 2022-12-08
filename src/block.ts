import { DIFFICULTY, MINE_RATE } from './config.ts';

export class Block {
  timestamp: number;
  lastHash: string;
  hash: string;
  data: any;
  nonce: number;
  difficulty: number;

  constructor(
    timestamp: number,
    lastHash: string,
    hash: string,
    data: any,
    difficulty = DIFFICULTY,
    nonce = 0,
  ) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  toString() {
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Data      : ${this.data}
      Nonce     : ${this.nonce}
      Difficulty: ${this.difficulty}`;
  }
}

export function genesis() {
  return new Block(1670410844616, '-----', 'f1r57-h45h', []);
}

export async function hashData(
  timestamp: number,
  lastHash: string,
  data: any,
  difficulty: number,
  nonce: number,
) {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(
      `${timestamp}${lastHash}${data}${nonce}${difficulty}`,
    ),
  );

  // return string
  return Array.from(new Uint8Array(buffer))
    .map((x) => ('00' + x.toString(16)).slice(-2))
    .join('');
}

export async function mineBlock(lastBlock: Block, data: any) {
  const timestamp = Date.now();
  const lastHash = lastBlock.hash;

  let nonce = 0;

  const newDifficulty = adjustDifficulty(lastBlock, timestamp);

  const zeros = '0'.repeat(newDifficulty);

  while (true) {
    const hash = await hashData(
      timestamp,
      lastHash,
      data,
      nonce,
      newDifficulty,
    );

    if (hash.substring(0, newDifficulty) === zeros) {
      return new Block(timestamp, lastHash, hash, data, newDifficulty, nonce);
    }

    nonce++;
  }
}

export function blockHash(block: Block) {
  const { timestamp, lastHash, data, nonce, difficulty } = block;

  return hashData(timestamp, lastHash, data, nonce, difficulty);
}

export function adjustDifficulty(lastBlock: Block, currentTime: number) {
  let { difficulty } = lastBlock;

  difficulty =
    lastBlock.timestamp + MINE_RATE > currentTime
      ? difficulty + 1
      : difficulty - 1;

  return difficulty;
}
