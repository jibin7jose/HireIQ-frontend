'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { ApplicationStatus } from '@/types';
import Sidebar from '@/components/shared/Sidebar';

interface Application {
  id: string;
  jobId: string;
  userProfileId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateSkills: string[];
  coverLetter: string;
  resumeUrl: string;
  status: ApplicationStatus;
  aiMatchScore: number;
  appliedAt: string;
}

export default function JobApplicationsPage() {
  const { id } = useParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [id]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/applications/job/${id}`);
      setApplications(response.data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err: any) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Applicant Tracking</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Review and manage candidates who applied for this position.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
          )}

          {!loading && applications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applications yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                When candidates apply, their applications will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {applications.map((app) => (
                <div key={app.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* Candidate Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {app.candidateName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{app.candidateName}</h2>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {app.candidateEmail} • {app.candidatePhone}
                          </div>
                        </div>
                      </div>

                      {app.candidateSkills && app.candidateSkills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">AI Extracted Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {app.candidateSkills.map((skill, idx) => (
                              <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {app.coverLetter && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Cover Letter</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{app.coverLetter}"</p>
                        </div>
                      )}
                    </div>

                    {/* Right Side: Score & Actions */}
                    <div className="flex flex-col lg:items-end justify-between min-w-[200px]">
                      {/* Score Badge */}
                      <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg w-full">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">AI Match Score</span>
                        <div className={`text-4xl font-black mt-1 ${app.aiMatchScore >= 80 ? 'text-green-500' : app.aiMatchScore >= 60 ? 'text-yellow-500' : 'text-gray-500'}`}>
                          {app.aiMatchScore}%
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="mt-6 w-full flex flex-col gap-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Status:</span>
                          <span className={`font-medium ${
                            app.status === 'Shortlisted' ? 'text-green-600 dark:text-green-400' : 
                            app.status === 'Rejected' ? 'text-red-600 dark:text-red-400' : 
                            'text-amber-600 dark:text-amber-400'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        
                        <div className="flex gap-2 w-full">
                          {app.status !== 'Shortlisted' && (
                            <button
                              onClick={() => updateStatus(app.id, 'Shortlisted')}
                              className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Shortlist
                            </button>
                          )}
                          {app.status !== 'Rejected' && (
                            <button
                              onClick={() => updateStatus(app.id, 'Rejected')}
                              className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Reject
                            </button>
                          )}
                        </div>

                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl.startsWith('http') ? app.resumeUrl : `/${app.resumeUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full mt-2 block text-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            View Resume PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
