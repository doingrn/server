import { WebSocketServer } from 'ws';
import { rpc } from '..';
import { Client as RPCClient } from 'discord-rpc';
import type { AllReceiveEvents } from '../types/events';
import { actions } from './actions';

const presenceClients: Record<string, RPCClient> = {};

export class WSServer extends WebSocketServer {
  constructor() {
    super({ port: 5454, path: '/doingrn' });
  }

  setup() {
    this.on('connection', (ws) => {
      ws.send(
        JSON.stringify({
          t: 'init_state',
          d: { user: rpc.user }
        })
      );

      ws.on('message', async (msg) => {
        const parsedMessage = JSON.parse(msg.toString()) as AllReceiveEvents;

        let client = presenceClients[parsedMessage.d.clientId];

        if (!client) {
          client = new RPCClient({ transport: 'ipc' });
          await client.login({ clientId: parsedMessage.d.clientId });

          presenceClients[parsedMessage.d.clientId] = client;
        }

        actions.get(parsedMessage.t)?.handle(client, parsedMessage.d);
      });

      ws.on('close', () => {
        for (const clientId in presenceClients) {
          presenceClients[clientId].destroy();
          delete presenceClients[clientId];
        }
      });
    });
  }

  closeConnections() {
    for (const client in this.clients) {
      this.clients[client].close();
    }
  }
}
