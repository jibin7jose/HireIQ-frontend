import { create } from 'zustand';
import axios from 'axios';

export interface Notification {
  id: string;
  message: string;
  type: 'Info' | 'Success' | 'Warning' | 'Error';
  timestamp: string; // From backend: timestamp is created_at
  read: boolean;     // From backend: isRead
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read'> & { id?: string }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  fetchNotifications: (token: string) => Promise<void>;
  markAsReadAsync: (id: string, token: string) => Promise<void>;
  markAllAsReadAsync: (token: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) => set((state) => {
    // Avoid duplicates if id is provided
    if (notification.id && state.notifications.some(n => n.id === notification.id)) {
      return state;
    }
    const newNotification = {
      ...notification,
      id: notification.id || Math.random().toString(36).substring(7),
      read: false
    };
    return {
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    };
  }),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => 
      n.id === id ? { ...n, read: true } : n
    ),
    unreadCount: Math.max(0, state.notifications.filter(n => n.id !== id && !n.read).length)
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0
  })),

  // API Methods
  fetchNotifications: async (token: string) => {
    try {
      const response = await axios.get('http://localhost:5128/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Response is NotificationDto array: { id, message, type, isRead, timestamp }
      const fetched: Notification[] = response.data.map((n: any) => ({
        id: n.id,
        message: n.message,
        type: n.type,
        timestamp: n.timestamp,
        read: n.isRead
      }));
      set({ 
        notifications: fetched, 
        unreadCount: fetched.filter(n => !n.read).length 
      });
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  },

  markAsReadAsync: async (id: string, token: string) => {
    const state = get();
    // Optimistic update
    state.markAsRead(id);
    try {
      await axios.patch(`http://localhost:5128/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  },

  markAllAsReadAsync: async (token: string) => {
    const state = get();
    // Optimistic update
    state.markAllAsRead();
    try {
      await axios.patch('http://localhost:5128/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  }
}));
