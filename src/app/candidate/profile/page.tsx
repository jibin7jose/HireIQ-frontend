'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import ResumeUpload from '@/components/candidate/ResumeUpload';
import { Loader2, Briefcase, GraduationCap, CheckCircle2, BellRing } from 'lucide-react';
import api from '@/lib/api';

export default function CandidateProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setProfile(res.data.profile);
    } catch (err) {
      console.error(err);
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUploadSuccess = (url: string) => {
    // When resume uploads, re-fetch profile to get new AI parsed data!
    fetchProfile();
  };

  const handleToggleAlerts = async () => {
    try {
      const newValue = !profile.receiveJobAlerts;
      await api.put('/users/me/profile', { receiveJobAlerts: newValue });
      setProfile({ ...profile, receiveJobAlerts: newValue });
    } catch (err) {
      console.error('Failed to update job alerts preference', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-neutral-400 mt-4">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Your Profile</h1>
        <p className="text-neutral-400 mt-2">Manage your career details and let AI match you to the best roles.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column - Resume Upload */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <h2 className="text-xl font-bold text-white mb-4">Resume</h2>
            <ResumeUpload 
              currentResumeUrl={profile?.resumeUrl} 
              onUploadSuccess={handleUploadSuccess} 
            />
            <p className="text-xs text-neutral-500 mt-4 leading-relaxed">
              When you upload a new resume, our AI will automatically parse it and update your profile!
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center">
              <BellRing className="w-5 h-5 mr-2 text-blue-400" /> Preferences
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-200">Daily AI Job Alerts</p>
                <p className="text-xs text-neutral-500 mt-1">Receive an email with top AI-matched jobs.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={profile?.receiveJobAlerts ?? false}
                  onChange={handleToggleAlerts} 
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - AI Parsed Data */}
        <div className="md:col-span-2 space-y-6">
          {/* AI Insights Card */}
          <div className="bg-neutral-900 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)] p-8 rounded-2xl relative overflow-hidden">
            
            <div className="flex items-center justify-between mb-6 border-b border-neutral-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                ✨ AI Profile Insights
              </h2>
              {profile?.skills?.length > 0 && (
                <span className="flex items-center text-xs font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Synced
                </span>
              )}
            </div>

            {!profile?.skills || profile.skills.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-neutral-400">Upload your resume to let AI generate your profile insights.</p>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Summary */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Experience Summary
                  </h3>
                  <p className="text-neutral-200 leading-relaxed bg-neutral-950/50 p-4 rounded-xl border border-neutral-800">
                    {profile.experienceSummary || "No summary extracted."}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Top Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string, idx: number) => (
                      <span 
                        key={idx}
                        className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Education
                  </h3>
                  <p className="text-neutral-200 leading-relaxed bg-neutral-950/50 p-4 rounded-xl border border-neutral-800">
                    {profile.education || "No education extracted."}
                  </p>
                </div>

              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}
