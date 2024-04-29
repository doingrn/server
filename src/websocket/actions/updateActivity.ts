import type { Action } from '.';
import type { UpdateActivityEvent } from '../../types/events';

export default {
  name: 'update_activity',
  handle(client, data) {
    client.setActivity(data.presence);
  }
} as Action<UpdateActivityEvent>;
