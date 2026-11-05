import type { ChatMessageView } from '@/types/chat.types';
import type { RoomMember } from '@/types/room.types';

export function seenMessageId(
  messages: ChatMessageView[],
  members: RoomMember[],
  viewerId: string,
): string | null {
  const customers = members.filter((member) => member.memberRole === 'CUSTOMER');
  const lastOwn = messages.findLast(
    (message) =>
      message.senderId === viewerId && (message.status === 'DELIVERED' || message.status === 'FLAGGED'),
  );
  if (!lastOwn || customers.length === 0) {
    return null;
  }
  const sentAt = Date.parse(lastOwn.createdAt);
  const seenByAll = customers.every(
    (customer) => customer.lastReadAt !== null && Date.parse(customer.lastReadAt) >= sentAt,
  );
  return seenByAll ? lastOwn.clientMessageId : null;
}