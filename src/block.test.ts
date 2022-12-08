import { assertEquals } from 'https://deno.land/std@0.159.0/testing/asserts.ts';
import {
  beforeEach,
  describe,
  it,
} from 'https://deno.land/std@0.159.0/testing/bdd.ts';
import { adjustDifficulty, Block, mineBlock } from './block.ts';
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

  it('generates a hash that matches difficulty', () => {
    assertEquals(
      block.hash.substring(0, block.difficulty),
      '0'.repeat(block.difficulty),
    );
  });

  it('lowers difficulty for slowly mined blocks', () => {
    assertEquals(
      adjustDifficulty(block, block.timestamp + 360000),
      block.difficulty - 1,
    );
  });

  it('raises difficulty for quickly mined blocks', () => {
    assertEquals(
      adjustDifficulty(block, block.timestamp + 1),
      block.difficulty + 1,
    );
  });
});
