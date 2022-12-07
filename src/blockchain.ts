import { Block, genesis, mineBlock } from './block.ts';

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
}
