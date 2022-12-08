import { BlockChain } from './blockchain.ts';

export class P2PServer {
  blockchain: BlockChain;
  sockets: WebSocket[];
  constructor(blockchain: BlockChain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  addWebSocket(socket: WebSocket) {
    this.registerEvents(socket);
    this.sockets.push(socket);
  }

  registerEvents(socket: WebSocket) {
    socket.addEventListener('open', () => {
      console.log(`connected to ${socket.url}`);
    });

    socket.addEventListener('close', () => {
      console.log(`disconnected from ${socket.url}`);
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      console.log(`received data from ${socket.url}: ${JSON.stringify(data)}`);
      this.blockchain.replaceChain(data);
    });
    this.syncChains();
  }

  connectToPeer(newPeer: string) {
    const socket = new WebSocket(newPeer);
    socket.addEventListener('open', () => {
      console.log(`connected to ${socket.url}`);
      this.addWebSocket(socket);
    });
  }

  connectToPeers(peers: string[]) {
    peers.forEach((peer) => {
      this.connectToPeer(peer);
    });
  }

  sendChain(socket: WebSocket) {
    console.log(`sending chain to ${socket.url}`);
    socket.send(JSON.stringify(this.blockchain.chain));
  }
  syncChains() {
    this.sockets.forEach((socket) => {
      this.sendChain(socket);
    });
  }
}
