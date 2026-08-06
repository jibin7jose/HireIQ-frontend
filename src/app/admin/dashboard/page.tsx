'use client';

import React, { useEffect, useState } from 'react';
import { Users, Briefcase, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: 'Total Companies', value: '0', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Total Users', value: '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [companiesRes, usersRes] = await Promise.all([
          api.get('/companies'),
          api.get('/users')
        ]);

        setStats([
          { title: 'Total Companies', value: companiesRes.data.length.toString(), icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { title: 'Total Users', value: usersRes.data.length.toString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        ]);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-neutral-400 mt-2">Platform overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center justify-between hover:border-neutral-700 transition-colors">
              <div>
                <p className="text-sm font-medium text-neutral-400">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin mt-1" /> : stat.value}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
