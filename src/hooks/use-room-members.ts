'use client';

import { useEffect, useState } from 'react';
import { getRoomMembersAction } from '@/endpoints/rooms/actions';
import { useSocket } from '@/providers/socket-provider';
import type { ReadUpdatedEvent } from '@/types/chat.types';
import type { RoomMember } from '@/types/room.types';

const MEMBERS_POLL_MS = 20_000;

export function useRoomMembers(roomId: string, initial: RoomMember[]): RoomMember[] {
  const { socket } = useSocket();
  const [members, setMembers] = useState(initial);

  useEffect(() => {
    const timer = setInterval(() => {
      getRoomMembersAction(roomId)
        .then(setMembers)
        .catch(() => undefined);
    }, MEMBERS_POLL_MS);
    return () => clearInterval(timer);
  }, [roomId]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    const onReadUpdated = (event: ReadUpdatedEvent) => {
      if (event.roomId !== roomId) {
        return;
      }
      setMembers((list) =>
        list.map((member) =>
          member.userId === event.userId ? { ...member, lastReadAt: event.lastReadAt } : member,
        ),
      );
    };
    socket.on('room:read-updated', onReadUpdated);
    return () => {
      socket.off('room:read-updated', onReadUpdated);
    };
  }, [socket, roomId]);

  return members;
}