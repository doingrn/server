import { WebSocketServer } from 'ws';
import { Client as RPCClient } from 'discord-rpc';
import type { AllReceiveEvents } from './types/events';

const wss = new WebSocketServer({ port: 5454, path: '/doingrn' });

const rpc = new RPCClient({ transport: 'ipc' });
rpc.login({ clientId: '1230554745484345367' }).catch(console.error);

const presenceClients: Record<string, RPCClient> = {};

rpc.once('ready', () => {
  wss.on('connection', (ws) => {
    ws.send(
      JSON.stringify({
        t: 'init_state',
        d: { user: rpc.user }
      })
    );

    ws.on('message', async (msg) => {
      const parsedMessage = JSON.parse(msg.toString()) as AllReceiveEvents;

      let client: RPCClient | null = null;

      if (parsedMessage.d.clientId) {
        client = presenceClients[parsedMessage.d.clientId];
        if (!client) {
          client = new RPCClient({ transport: 'ipc' });
          presenceClients[parsedMessage.d.clientId] = client;
          await client.login({ clientId: parsedMessage.d.clientId });
        }
      }

      switch (parsedMessage.t) {
        case 'clear_activity':
          client?.clearActivity();
          break;
        case 'update_activity': {
          client?.setActivity(parsedMessage.d.presence);
          break;
        }
        default:
          break;
      }
    });
  });
});
