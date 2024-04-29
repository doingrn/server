import type { Client as RPCClient } from 'discord-rpc';
import ClearActivityAction from './clearActivity';
import UpdateActivityAction from './updateActivity';
import type { AllReceiveEvents } from '../../types/events';

export interface BaseAction {
  name: string;
  handle(client: RPCClient, data: unknown): void;
}

export interface Action<Data extends AllReceiveEvents = AllReceiveEvents> extends BaseAction {
  name: Data['t'];
  handle: (client: RPCClient, data: Data['d']) => void;
}

export const actions = new Map<Action['name'], BaseAction>();
actions.set(ClearActivityAction.name, ClearActivityAction).set(UpdateActivityAction.name, UpdateActivityAction);
