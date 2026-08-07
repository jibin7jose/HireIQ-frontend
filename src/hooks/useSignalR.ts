import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';

export const useSignalR = () => {
  const { token, isAuthenticated } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (connection) {
        connection.stop();
        setConnection(null);
      }
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/hubs/notifications', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('SignalR Connected!');
          
          connection.on('ReceiveNotification', (notification: { message: string, type: string, timestamp: string }) => {
            addNotification({
              message: notification.message,
              type: notification.type as 'Info' | 'Success' | 'Warning' | 'Error',
              timestamp: notification.timestamp
            });
            // Show browser alert for now, can be replaced with Toast
            console.log('New notification:', notification.message);
          });
        })
        .catch(e => console.log('SignalR Connection Error: ', e));
    }

    return () => {
      if (connection) {
        connection.off('ReceiveNotification');
      }
    };
  }, [connection, addNotification]);

  return connection;
};
