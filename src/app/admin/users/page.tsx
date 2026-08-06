'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadgeColor = (role: number | string) => {
    const roleMap: Record<string, string> = {
      '0': 'bg-neutral-500/10 text-neutral-400', // JobSeeker
      '1': 'bg-blue-500/10 text-blue-400', // Employer
      '2': 'bg-purple-500/10 text-purple-400', // Admin
      'JobSeeker': 'bg-neutral-500/10 text-neutral-400',
      'Employer': 'bg-blue-500/10 text-blue-400',
      'Admin': 'bg-purple-500/10 text-purple-400',
    };
    return roleMap[role.toString()] || 'bg-neutral-500/10 text-neutral-400';
  };

  const formatRole = (role: number | string) => {
    const roleMap: Record<string, string> = {
      '0': 'Job Seeker',
      '1': 'Employer',
      '2': 'Admin',
      'JobSeeker': 'Job Seeker',
      'Employer': 'Employer',
      'Admin': 'Admin',
    };
    return roleMap[role.toString()] || role.toString();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Users Management</h1>
        <p className="text-neutral-400 mt-2">View and manage platform users</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-neutral-400">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {formatRole(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
