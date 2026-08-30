'use client';

import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useNotificationStore } from '@/hooks/ui/useNotificationStore';

import type { Notification } from '@/types/notifications.types';

import { socket } from '@/lib/socket';

interface SocketProviderProps {
  children: React.ReactNode;
}

export default function SocketProvider({ children }: SocketProviderProps) {
  const queryClient = useQueryClient();

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  useEffect(() => {
    const handleConnect = () => {
      console.log('🟢 Socket connected:', socket.id);
    };

    const handleConnectError = (error: Error) => {
      console.error('🔴 Socket connection error:', error.message);
    };

    const handleDisconnect = (reason: string) => {
      console.log('🟡 Socket disconnected:', reason);
    };

    const handleNotification = (notification: Notification) => {
      console.log('🔔 New notification:', notification);
      addNotification(notification);

      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    };

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);
    socket.on('notification:new', handleNotification);

    socket.connect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);
      socket.off('notification:new', handleNotification);

      socket.disconnect();
    };
  }, []);

  return children;
}
