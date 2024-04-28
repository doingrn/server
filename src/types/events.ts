import type { Presence } from 'discord-rpc';

export interface BaseEvent {
  t: string;
  d?: unknown;
}

export interface UpdateActivityEvent extends BaseEvent {
  t: 'update_activity';
  d: {
    clientId: string;
    presence: Presence;
  };
}

export interface ClearActivityEvent extends BaseEvent {
  t: 'clear_activity';
  d: {
    clientId: string;
  };
}

export type AllReceiveEvents = UpdateActivityEvent | ClearActivityEvent;
