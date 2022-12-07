import { assertEquals } from 'https://deno.land/std@0.159.0/testing/asserts.ts';
import {
  beforeEach,
  describe,
  it,
} from 'https://deno.land/std@0.159.0/testing/bdd.ts';
import { Block, mineBlock } from './block.ts';
import { genesis } from './block.ts';

describe('Block', () => {
  let lastBlock: Block, block: Block, data: string;

  beforeEach(async () => {
    data = 'bar';
    lastBlock = genesis();
    block = await mineBlock(lastBlock, data);
  });

  it('sets data to block', () => {
    assertEquals(block.data, data);
  });

  it('sets lastHash to hash of last block', () => {
    assertEquals(block.lastHash, lastBlock.hash);
  });
});
