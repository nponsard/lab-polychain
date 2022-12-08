import { Application, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { BlockChain } from './blockchain.ts';
import { P2PServer } from './p2pserver.ts';

const app = new Application();

const blockChain = new BlockChain();

const p2pServer = new P2PServer(blockChain);

const router = new Router();

router.get('/blocks', (ctx) => {
  ctx.response.body = blockChain.chain;
});

router.post('/mine', async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value;
  const block = await blockChain.addBlock(body.data);
  ctx.response.body = block;
});

router.get('/ws', (ctx) => {
  const sock = ctx.upgrade();

  p2pServer.addWebSocket(sock);
});

app.use(router.routes());

let port = 8000;

const env_port = Deno.env.get('PORT');

if (env_port) {
  const parsedPort = parseInt(env_port);
  if (!isNaN(parsedPort)) {
    port = parsedPort;
  }
}

const peers = Deno.env.get('PEERS')?.split(',');

app.addEventListener('listen', () => {
  console.log(`Listening on port ${port}...`);

  console.log(`http://localhost:${port}`);

  if (peers) {
    console.log(`Connecting to peers: ${peers.join(', ')}`);
    p2pServer.connectToPeers(peers);
  }
});

await app.listen({ port });
