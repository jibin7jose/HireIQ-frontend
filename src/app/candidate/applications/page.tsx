'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Sidebar from '@/components/shared/Sidebar';
import ChatWindow from '@/components/shared/ChatWindow';
import { MessageCircle, Video } from 'lucide-react';
import Link from 'next/link';
import { ApplicationStatus } from '@/types';

interface CandidateApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  appliedAt: string;
  meetingLink?: string;
  interviewDate?: string;
}

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeChatAppId, setActiveChatAppId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/candidate');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch your applications.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar role="Candidate" />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar role="Candidate" />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Applications</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track the status of jobs you have applied for and chat with employers.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
          )}

          {!loading && applications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applications yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                You haven't applied to any jobs yet. Start exploring and apply!
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {applications.map((app) => (
                <div key={app.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{app.jobTitle}</h2>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {app.companyName} • Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400 mr-2">Status:</span>
                          <span className={`font-medium ${
                            app.status === 'Shortlisted' ? 'text-green-600 dark:text-green-400' : 
                            app.status === 'Rejected' ? 'text-red-600 dark:text-red-400' : 
                            'text-amber-600 dark:text-amber-400'
                          }`}>
                            {app.status}
                          </span>
                      </div>
                    </div>

                    <div className="flex flex-col lg:items-end justify-start min-w-[200px] gap-2">
                      {app.meetingLink && (
                        <div className="w-full">
                          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-1">
                            Scheduled for: {new Date(app.interviewDate!).toLocaleString()}
                          </p>
                          <Link
                            href={app.meetingLink}
                            target="_blank"
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Video className="w-4 h-4" />
                            Join Interview
                          </Link>
                        </div>
                      )}
                      
                      <button
                        onClick={() => setActiveChatAppId(activeChatAppId === app.id ? null : app.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-500/30 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-500/10 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {activeChatAppId === app.id ? 'Close Chat' : 'Chat with Employer'}
                      </button>
                    </div>
                  </div>
                  
                  {activeChatAppId === app.id && (
                    <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6">
                      <ChatWindow applicationId={app.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
