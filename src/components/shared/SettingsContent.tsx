'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Shield, User, Globe, Moon, Sun } from 'lucide-react';
import api from '@/lib/api';

export default function SettingsContent() {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('system');

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme as 'dark' | 'light');
    }
  }, []);

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme);
    if (newTheme === 'system') {
      localStorage.removeItem('theme');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handlePasswordChange = async () => {
    setMessage('');
    setIsError(false);
    if (!oldPassword || !newPassword) {
      setMessage('Both fields are required.');
      setIsError(true);
      return;
    }
    setLoading(true);
    try {
      await api.put('/users/me/password', { oldPassword, newPassword });
      setMessage('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      setMessage(err.response?.data?.detail || err.response?.data?.message || 'Failed to change password.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState(false);

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
  }, [user]);

  const handleProfileUpdate = async () => {
    setProfileMessage('');
    setProfileError(false);
    setProfileLoading(true);
    try {
      await api.put('/users/me/profile', { 
        fullName,
        receiveJobAlerts: true // Default or from actual state
      });
      // Optionally update user store here if needed, but a page reload or auth sync handles it
      useAuthStore.getState().checkAuth(); // re-fetch user
      setProfileMessage('Profile updated successfully.');
    } catch (err: any) {
      setProfileMessage(err.response?.data?.detail || err.response?.data?.message || 'Failed to update profile.');
      setProfileError(true);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to completely delete your account? This action cannot be undone.")) {
      return;
    }
    
    try {
      await api.delete('/users/me');
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
    } catch (err: any) {
      alert(err.response?.data?.detail || err.response?.data?.message || 'Failed to delete account.');
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Moon },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-2">Manage your account preferences and settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMessage('');
                  setProfileMessage('');
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-500 font-medium'
                    : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xl">
            
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account Information</h2>
                  <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Update your basic profile details.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-neutral-950/50 border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email}
                      disabled
                      className="w-full bg-gray-50 dark:bg-neutral-950/50 border border-gray-300 dark:border-neutral-800 text-gray-400 dark:text-neutral-500 px-4 py-2.5 rounded-xl cursor-not-allowed"
                    />
                  </div>
                </div>

                {profileMessage && (
                  <div className={`text-sm p-3 rounded-lg max-w-md ${profileError ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'}`}>
                    {profileMessage}
                  </div>
                )}

                <button 
                  onClick={handleProfileUpdate}
                  disabled={profileLoading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>

                <div className="pt-4 border-t border-gray-200 dark:border-neutral-800">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Danger Zone</h3>
                  <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors text-sm font-medium">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security & Password</h2>
                  <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Keep your account secure.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Current Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full max-w-md bg-white dark:bg-neutral-950/50 border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full max-w-md bg-white dark:bg-neutral-950/50 border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  
                  {message && (
                    <div className={`text-sm p-3 rounded-lg max-w-md ${isError ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'}`}>
                      {message}
                    </div>
                  )}

                  <button 
                    onClick={handlePasswordChange}
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
                  <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Customize how CareerConnect looks.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button 
                    onClick={() => handleThemeChange('dark')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${
                      theme === 'dark' 
                        ? 'border-blue-500 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white' 
                        : 'border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-500' : ''}`} />
                    <span className="font-medium">Dark Mode</span>
                  </button>
                  
                  <button 
                    onClick={() => handleThemeChange('light')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${
                      theme === 'light' 
                        ? 'border-blue-500 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white' 
                        : 'border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-blue-500' : ''}`} />
                    <span className="font-medium">Light Mode</span>
                  </button>
                  
                  <button 
                    onClick={() => handleThemeChange('system')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${
                      theme === 'system' 
                        ? 'border-blue-500 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white' 
                        : 'border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <Globe className={`w-6 h-6 ${theme === 'system' ? 'text-blue-500' : ''}`} />
                    <span className="font-medium">System Default</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
