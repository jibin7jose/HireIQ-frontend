'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Briefcase, FileText, Bookmark, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function CandidateDashboard() {
  const user = useAuthStore((state) => state.user);
  const [jobs, setJobs] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        // Fetch recommended jobs from our new AI Matching endpoint!
        const res = await api.get('/jobs/recommended');
        setJobs(res.data || []);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      }
    };
    
    const fetchInterviews = async () => {
      try {
        const res = await api.get('/interviews/candidate');
        setInterviews(res.data || []);
      } catch (err) {
        console.error('Failed to fetch interviews', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedJobs();
    fetchInterviews();
  }, []);

  const stats = [
    { title: 'Applied Jobs', value: '12', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Saved Jobs', value: '4', icon: Bookmark, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Profile Views', value: '28', icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
        <p className="text-neutral-400 mt-2">Here is what is happening with your job search today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Upcoming Interviews */}
      {!loading && interviews.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Upcoming Interviews</h2>
          <div className="space-y-4">
            {interviews.filter(i => i.status === 'Scheduled').map(interview => (
              <div key={interview.id} className="p-5 rounded-xl border border-blue-500/30 bg-blue-500/5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white">{interview.jobTitle} at {interview.companyName}</h3>
                  <p className="text-sm text-neutral-400 mt-1">
                    Scheduled for: {new Date(interview.scheduledAt).toLocaleString()} ({interview.durationMinutes} mins)
                  </p>
                </div>
                <a 
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Join Meeting
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Jobs */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recommended for you</h2>
          <Link href="/jobs" className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center">
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-neutral-400">No recommended jobs found right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="block p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-950/50 transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                  <div className="flex items-center text-sm text-neutral-400 mt-1 space-x-3">
                    <span>{job.companyName || 'Company'}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="bg-neutral-800 px-2 py-0.5 rounded text-xs">{job.jobType}</span>
                  </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {job.aiMatchScore && (
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        ✨ {job.aiMatchScore}% Match
                      </span>
                    )}
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
