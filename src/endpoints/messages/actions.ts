'use server';

import type { MessagePage } from '../../types/messages.types';
import { getMessagePage } from './queries';

export async function loadOlderMessagesAction(roomId: string, cursor: string): Promise<MessagePage> {
  return getMessagePage(roomId, cursor);
}
