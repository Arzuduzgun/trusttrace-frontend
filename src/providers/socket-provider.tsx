//Sayfa başına tek bir socket bağlantısı kurar ve React context ile bütün bileşenlere dağıtır.
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { getWsTicketAction } from '@/endpoints/auth/actions';
import { WS_URL } from '@/lib/public-env';
import type { ConnectionState, SocketContextValue } from '@/types/chat.types';

//Context:React’te bir değeri, her bileşene tek tek prop olarak geçmeden alt bileşenlerin hepsine ulaştırmanın yolu.
const SocketContext = createContext<SocketContextValue>({ socket: null, connection: 'connecting' });

function createSocket(): Socket | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return io(WS_URL, {
    autoConnect: false,
    transports: ['websocket'],
    auth: (callback) => {
      getWsTicketAction()
        .then((ticket) => callback({ ticket }))
        .catch(() => callback({}));
    },
  });
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket] = useState(createSocket);
  const [connection, setConnection] = useState<ConnectionState>('connecting');

  useEffect(() => {
    if (!socket) {
      return;
    }
    const onConnect = () => setConnection('connected');
    const onDisconnect = () => setConnection('disconnected');
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onDisconnect);
    socket.connect();
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onDisconnect);
      socket.disconnect();
    };
  }, [socket]);

  return <SocketContext.Provider value={{ socket, connection }}>{children}</SocketContext.Provider>;
}

export function useSocket(): SocketContextValue {
  return useContext(SocketContext);
}