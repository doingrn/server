import { Client as RPCClient } from 'discord-rpc';
import { WSServer } from './websocket';

const ws = new WSServer();

export let rpc: RPCClient;

async function connect() {
  try {
    rpc = new RPCClient({ transport: 'ipc' });
    console.log('Connecting...');

    rpc.on('connected', () => {
      console.log('Connected to Discord RPC');
      ws.setup();
    });

    rpc.on('disconnected', () => {
      console.log('Disconnected from Discord RPC');
      ws.closeConnections();
      connect(); // Reconnect on disconnection
    });

    await rpc.login({ clientId: '1230554745484345367' });
  } catch (error) {
    console.error('Error occurred while connecting to Discord RPC:', error);
    console.log('Retrying in 2 seconds...');
    setTimeout(connect, 2000);
  }
}

console.log('Starting connection process...');
connect();
