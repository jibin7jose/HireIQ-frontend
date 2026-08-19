"use client";

import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuthStore } from "@/store/authStore";
import { Bell, X } from "lucide-react";

type Notification = {
  id: string;
  message: string;
  type: string;
  timestamp: string;
};

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!token || !user) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5128/hubs/notifications", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (notification: any) => {
      const newNotification: Notification = {
        id: Math.random().toString(36).substring(7),
        message: notification.message,
        type: notification.type,
        timestamp: notification.timestamp,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
      }, 5000);
    });

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("Connected to NotificationHub");
      } catch (err) {
        console.error("Error connecting to NotificationHub", err);
      }
    };

    startConnection();

    return () => {
      connection.stop();
    };
  }, [token, user]);

  return (
    <>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="pointer-events-auto bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-start gap-3 w-80 transform transition-all duration-300 translate-y-0 opacity-100"
          >
            <div className="bg-primary/10 text-primary rounded-full p-2 flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Status Update
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-3">
                {notif.message}
              </p>
            </div>
            <button
              onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
