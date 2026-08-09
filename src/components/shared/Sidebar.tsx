'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Home, Briefcase, User, Settings, FileText, Users, Bell, Check, X, Sparkles } from 'lucide-react';
import { useSignalR } from '@/hooks/useSignalR';
import { useNotificationStore } from '@/store/notificationStore';

interface SidebarProps {
  role: 'Candidate' | 'Employer' | 'Admin';
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  useSignalR();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  const candidateLinks = [
    { name: 'Dashboard', href: '/candidate/dashboard', icon: Home },
    { name: 'Discover', href: '/candidate/discover', icon: Sparkles },
    { name: 'My Applications', href: '/candidate/applications', icon: FileText },
    { name: 'Find Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Profile', href: '/candidate/profile', icon: User },
    { name: 'Settings', href: '/candidate/settings', icon: Settings },
  ];

  const employerLinks = [
    { name: 'Dashboard', href: '/employer/dashboard', icon: Home },
    { name: 'Post a Job', href: '/employer/jobs/new', icon: Briefcase },
    { name: 'My Jobs', href: '/employer/jobs', icon: Briefcase },
    { name: 'Company Profile', href: '/employer/profile', icon: User },
    { name: 'Settings', href: '/employer/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Companies', href: '/admin/companies', icon: Briefcase },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const links = role === 'Admin' ? adminLinks : role === 'Candidate' ? candidateLinks : employerLinks;

  return (
    <div className="w-64 bg-neutral-950 border-r border-neutral-800 h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          CareerConnect <span className="text-blue-500">AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-blue-500/10 text-blue-500 font-medium' 
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white font-medium'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <div className="mb-4 px-4 py-3 bg-neutral-900 rounded-xl">
          <p className="text-sm font-medium text-white truncate">{user?.fullName || 'User'}</p>
          <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
        </div>
        <div className="relative mb-4">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-full flex items-center justify-between px-4 py-3 text-neutral-400 hover:bg-neutral-900 hover:text-white rounded-xl transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="font-medium">Notifications</span>
            </div>
          </button>

          {showNotifications && (
            <div className="absolute bottom-full left-0 w-72 mb-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                <button onClick={markAllAsRead} className="text-xs text-blue-400 hover:text-blue-300">
                  Mark all as read
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-neutral-500">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`p-3 border-b border-neutral-800/50 cursor-pointer hover:bg-neutral-800 transition-colors ${!n.read ? 'bg-blue-500/5' : ''}`}
                    >
                      <p className={`text-sm ${!n.read ? 'text-white font-medium' : 'text-neutral-400'}`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => logout()}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
