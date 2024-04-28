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

    ws.on('message', (msg) => {
      const parsedMessage = JSON.parse(msg.toString()) as AllReceiveEvents;

      switch (parsedMessage.t) {
        case 'clear_activity':
          rpc.clearActivity();
          break;
        case 'update_activity': {
          let client = presenceClients[parsedMessage.d.clientId];

          if (client) {
            client.setActivity(parsedMessage.d.presence);
            return;
          }

          client = new RPCClient({ transport: 'ipc' });
          presenceClients[parsedMessage.d.clientId] = client;

          client.login({ clientId: parsedMessage.d.clientId }).catch(console.error);
          client.once('ready', () => {
            client.setActivity(parsedMessage.d.presence);
          });

          break;
        }
        default:
          break;
      }
    });
  });
});
