'use client';

import React, { useEffect, useState } from 'react';
import { Users, Briefcase, Building2, FileText, Loader2, TrendingUp } from 'lucide-react';
import api from '@/lib/api';

interface DashboardMetrics {
  totalUsers: number;
  totalJobs: number;
  totalCompanies: number;
  totalApplications: number;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/admin/metrics');
        setMetrics(response.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400">
        {error}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: metrics?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Total Jobs',
      value: metrics?.totalJobs || 0,
      icon: Briefcase,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Total Companies',
      value: metrics?.totalCompanies || 0,
      icon: Building2,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Total Applications',
      value: metrics?.totalApplications || 0,
      icon: FileText,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Overview</h1>
          <p className="text-neutral-400 mt-2">Platform-wide statistics and activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-neutral-700 transition-colors">
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -mr-16 -mt-16 rounded-full ${stat.bg}`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-neutral-400 text-sm font-medium">{stat.title}</h3>
              <div className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for future charts */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <TrendingUp className="w-12 h-12 text-neutral-600 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Growth Charts</h3>
        <p className="text-neutral-400 max-w-sm">
          More detailed analytics and growth charts will appear here as the platform gathers more data.
        </p>
      </div>
    </div>
  );
}
