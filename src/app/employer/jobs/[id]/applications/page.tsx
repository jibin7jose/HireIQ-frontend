'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { ApplicationStatus } from '@/types';
import Sidebar from '@/components/shared/Sidebar';
import ChatWindow from '@/components/shared/ChatWindow';
import { MessageCircle, Sparkles, Video } from 'lucide-react';
import Link from 'next/link';

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
  meetingLink?: string;
  interviewDate?: string;
}

interface RecommendedCandidate {
  candidateId: string;
  fullName: string;
  avatarUrl: string;
  experienceSummary: string;
  skills: string[];
  aiMatchScore: number;
}

export default function JobApplicationsPage() {
  const { id } = useParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [scheduleAppId, setScheduleAppId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [activeChatAppId, setActiveChatAppId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'Applications' | 'AI_Recommendations'>('Applications');
  const [recommendedCandidates, setRecommendedCandidates] = useState<RecommendedCandidate[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [id, statusFilter]);

  useEffect(() => {
    if (activeTab === 'AI_Recommendations' && recommendedCandidates.length === 0) {
      fetchRecommendations();
    }
  }, [activeTab]);

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const response = await api.get(`/jobs/${id}/recommended-candidates`);
      setRecommendedCandidates(response.data);
    } catch (err) {
      console.error('Failed to load recommended candidates', err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/applications/job/${id}?statusFilter=${statusFilter}` : `/applications/job/${id}`;
      const response = await api.get(url);
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
      alert(`Status updated to ${newStatus}. The candidate has been notified via email.`);
    } catch (err: any) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  const handleScheduleSubmit = async (appId: string) => {
    if (!scheduleDate || !scheduleTime) {
      alert('Please select date and time');
      return;
    }
    
    try {
      setScheduling(true);
      const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      await api.post('/interviews', {
        applicationId: appId,
        scheduledAt,
        durationMinutes: 45
      });
      
      // Update local status to Shortlisted
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: 'Shortlisted' } : app))
      );
      
      setScheduleAppId(null);
      alert('Interview scheduled successfully! An email with the meeting link has been sent to the candidate.');
    } catch (err) {
      console.error(err);
      alert('Failed to schedule interview.');
    } finally {
      setScheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar role="Employer" />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar role="Employer" />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Applicant Tracking</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Review and manage candidates who applied for this position.
            </p>
          </div>

          <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            <button
              onClick={() => setActiveTab('Applications')}
              className={`pb-2 px-1 text-sm font-medium ${
                activeTab === 'Applications'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('AI_Recommendations')}
              className={`pb-2 px-1 text-sm font-medium flex items-center ${
                activeTab === 'AI_Recommendations'
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              AI Recommendations
            </button>
          </div>

          {activeTab === 'Applications' ? (
            <>
              <div className="flex items-center space-x-4 mb-6">
                <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter by Status:
                </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | '')}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            >
              <option value="">All Applications</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
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
                              onClick={() => setScheduleAppId(scheduleAppId === app.id ? null : app.id)}
                              className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Shortlist & Schedule
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

                        {app.meetingLink && (
                          <div className="w-full mt-2">
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-1">
                              Scheduled for: {new Date(app.interviewDate!).toLocaleString()}
                            </p>
                            <Link
                              href={app.meetingLink}
                              target="_blank"
                              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Video className="w-4 h-4" />
                              Join Video Interview
                            </Link>
                          </div>
                        )}
                        
                        {scheduleAppId === app.id && (
                          <div className="mt-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-inner">
                            <h4 className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">Schedule Interview</h4>
                            <div className="flex flex-col gap-3">
                              <input 
                                type="date" 
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                              />
                              <input 
                                type="time" 
                                value={scheduleTime}
                                onChange={(e) => setScheduleTime(e.target.value)}
                                className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                              />
                              <button 
                                onClick={() => handleScheduleSubmit(app.id)}
                                disabled={scheduling}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium transition disabled:opacity-50"
                              >
                                {scheduling ? 'Scheduling...' : 'Confirm Schedule'}
                              </button>
                            </div>
                          </div>
                        )}

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

                        <button
                          onClick={() => setActiveChatAppId(activeChatAppId === app.id ? null : app.id)}
                          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 border border-blue-500/30 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-500/10 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {activeChatAppId === app.id ? 'Close Chat' : 'Chat with Candidate'}
                        </button>
                      </div>
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
          </>
          ) : (
            // AI Recommendations Tab
            <div className="grid gap-6">
              {loadingRecommendations ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : recommendedCandidates.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                  <Sparkles className="w-12 h-12 text-purple-500/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No AI Matches Found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    We couldn't find any candidates that strongly match this job description right now.
                  </p>
                </div>
              ) : (
                recommendedCandidates.map((candidate) => (
                  <div key={candidate.candidateId} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-purple-100 dark:border-purple-900/30 p-6 transition-all hover:shadow-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500" />
                    <div className="flex flex-col lg:flex-row justify-between gap-6 pl-4">
                      {/* Candidate Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                              {candidate.fullName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              {candidate.fullName}
                              <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full flex items-center">
                                <Sparkles className="w-3 h-3 mr-1" /> Top Match
                              </span>
                            </h2>
                          </div>
                        </div>

                        {candidate.skills && candidate.skills.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {candidate.skills.map((skill, idx) => (
                                <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {candidate.experienceSummary && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Experience Summary</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{candidate.experienceSummary}</p>
                          </div>
                        )}
                      </div>

                      {/* Right Side: Score & Actions */}
                      <div className="flex flex-col lg:items-end justify-between min-w-[200px]">
                        <div className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg w-full border border-purple-100 dark:border-purple-800/30">
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">AI Score</span>
                          <div className="text-4xl font-black mt-1 text-purple-600 dark:text-purple-400">
                            {candidate.aiMatchScore}%
                          </div>
                        </div>

                        <div className="mt-6 w-full flex flex-col gap-3">
                          <button
                            onClick={() => {
                              alert('Invitation sent! (This would send an email/notification to the candidate)');
                            }}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Invite to Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
