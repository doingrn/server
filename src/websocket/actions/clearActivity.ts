import type { Action } from '.';
import type { ClearActivityEvent } from '../../types/events';

export default {
  name: 'clear_activity',
  handle(client) {
    client.clearActivity();
  }
} as Action<ClearActivityEvent>;
