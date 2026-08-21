"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { Bell, X } from "lucide-react";
import type { Notification } from "@/store/notificationStore";

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuthStore();
  const { notifications } = useNotificationStore();
  
  // Local state for active toasts
  const [activeToasts, setActiveToasts] = useState<Notification[]>([]);
  // Keep track of which notifications we've already shown
  const [shownIds, setShownIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!token || !user) return;

    // Find new notifications that haven't been shown yet and are unread
    const newNotifications = notifications.filter(
      (n) => !n.read && !shownIds.has(n.id)
    );

    if (newNotifications.length > 0) {
      setActiveToasts((prev) => [...prev, ...newNotifications]);
      
      setShownIds((prev) => {
        const next = new Set(prev);
        newNotifications.forEach(n => next.add(n.id));
        return next;
      });

      // Auto-dismiss toasts after 5 seconds
      newNotifications.forEach(n => {
        setTimeout(() => {
          setActiveToasts((prev) => prev.filter((toast) => toast.id !== n.id));
        }, 5000);
      });
    }
  }, [notifications, token, user, shownIds]);

  return (
    <>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {activeToasts.map((notif) => (
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
              onClick={() => setActiveToasts((prev) => prev.filter((n) => n.id !== notif.id))}
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
