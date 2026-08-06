'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Briefcase, Users, Plus, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function EmployerDashboard() {
  const user = useAuthStore((state) => state.user);
  const [jobs, setJobs] = useState<any[]>([]);
  const [statsData, setStatsData] = useState({ activeJobs: 0, totalApplicants: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const [jobsRes, statsRes] = await Promise.all([
          api.get('/jobs?pageSize=5'),
          api.get('/companies/stats')
        ]);
        setJobs(jobsRes.data.items || []);
        setStatsData(statsRes.data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyJobs();
  }, []);

  const stats = [
    { title: 'Active Jobs', value: statsData.activeJobs.toString(), icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Total Applicants', value: statsData.totalApplicants.toString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-neutral-400 mt-2">Manage your job postings and applicants</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
          <Plus className="w-5 h-5" />
          <span>Post a Job</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center justify-between hover:border-neutral-700 transition-colors">
              <div>
                <p className="text-sm font-medium text-neutral-400">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Jobs */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Your Recent Postings</h2>
          <Link href="/employer/jobs" className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center">
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-neutral-400">You haven't posted any jobs yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/50 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{job.title}</h3>
                  <div className="flex items-center text-sm text-neutral-400 mt-1 space-x-3">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="bg-neutral-800 px-2 py-0.5 rounded text-xs">{job.jobType}</span>
                  </div>
                </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <Link href={`/employer/jobs/${job.id}/applications`} className="text-blue-400 hover:text-blue-300 font-medium bg-blue-500/10 px-4 py-2 rounded-lg transition-colors">
                      View Applicants
                    </Link>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
