import { Block, blockHash, genesis, mineBlock } from './block.ts';

export class BlockChain {
  chain: Block[];

  constructor() {
    this.chain = [genesis()];
  }

  async addBlock(data: any) {
    const block = await mineBlock(this.chain[this.chain.length - 1], data);
    this.chain.push(block);

    return block;
  }

  async replaceChain(chain: Block[]) {
    if ((await isValidChain(chain)) && chain.length > this.chain.length) {
      this.chain = chain;
    }
  }

  isValidChain() {
    return isValidChain(this.chain);
  }
}

export async function isValidChain(chain: Block[]) {
  if (JSON.stringify(chain[0]) !== JSON.stringify(genesis())) {
    return false;
  }

  for (let i = 1; i < chain.length; i++) {
    const block = chain[i];
    const lastBlock = chain[i - 1];

    if (block.lastHash !== lastBlock.hash) {
      return false;
    }
    if (block.hash !== (await blockHash(block))) {
      return false;
    }
  }

  return true;
}
