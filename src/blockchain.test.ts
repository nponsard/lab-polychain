import { assertEquals } from 'https://deno.land/std@0.159.0/testing/asserts.ts';
import {
  beforeEach,
  describe,
  it,
} from 'https://deno.land/std@0.159.0/testing/bdd.ts';
import { genesis } from './block.ts';
import { BlockChain } from './blockchain.ts';

describe('Blockchain', () => {
  let blockchain: BlockChain;

  beforeEach(() => {
    blockchain = new BlockChain();
  });

  it('starts with genesis block', () => {
    assertEquals(blockchain.chain[0], genesis());
  });

  it('adds a new block', async () => {
    const data = 'foo';
    await blockchain.addBlock(data);

    assertEquals(blockchain.chain[blockchain.chain.length - 1].data, data);
  });
});
