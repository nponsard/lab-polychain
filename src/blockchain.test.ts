import {
  assert,
  assertEquals,
  assertNotEquals,
} from 'https://deno.land/std@0.159.0/testing/asserts.ts';
import {
  beforeEach,
  describe,
  it,
} from 'https://deno.land/std@0.159.0/testing/bdd.ts';
import { genesis } from './block.ts';
import { BlockChain, isValidChain } from './blockchain.ts';

describe('Blockchain', () => {
  let blockchain: BlockChain;
  let blockchain2: BlockChain;

  beforeEach(() => {
    blockchain = new BlockChain();
    blockchain2 = new BlockChain();
  });

  it('starts with genesis block', () => {
    assertEquals(blockchain.chain[0], genesis());
  });

  it('adds a new block', async () => {
    const data = 'foo';
    await blockchain.addBlock(data);

    assertEquals(blockchain.chain[blockchain.chain.length - 1].data, data);
  });

  it('validates a valid chain', async () => {
    await blockchain2.addBlock('foo');
    assertEquals(await isValidChain(blockchain2.chain), true);
  });

  it('invalidates a chain with a corrupt genesis block', async () => {
    blockchain2.chain[0].data = 'bad data';
    assertEquals(await isValidChain(blockchain2.chain), false);
  });

  it('invalidates a corrupt chain', async () => {
    await blockchain2.addBlock('foo');
    blockchain2.chain[1].data = 'not foo';
    assertEquals(await isValidChain(blockchain2.chain), false);
  });

  it('replaces the chain with a valid chain', async () => {
    await blockchain2.addBlock('goo');
    await blockchain.replaceChain(blockchain2.chain);
    assertEquals(blockchain.chain, blockchain2.chain);
  });

  it('does not replace the chain with one of less than or equal to length', async () => {
    await blockchain.addBlock('foo');
    await blockchain.replaceChain(blockchain2.chain);
    assertNotEquals(blockchain.chain, blockchain2.chain);
  });
});
