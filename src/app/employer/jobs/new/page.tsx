'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, MapPin, DollarSign, AlignLeft, Loader2, Plus } from 'lucide-react';
import api from '@/lib/api';

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    jobType: 'Full-Time',
    location: '',
    minSalary: '',
    maxSalary: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        jobType: formData.jobType,
        location: formData.location,
        minSalary: formData.minSalary ? parseFloat(formData.minSalary) : null,
        maxSalary: formData.maxSalary ? parseFloat(formData.maxSalary) : null,
        description: formData.description
      };

      await api.post('/jobs', payload);
      router.push('/employer/dashboard'); // Redirect to dashboard on success
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.title || err.response?.data || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Post a New Job</h1>
        <p className="text-neutral-400 mt-2">Fill out the details below to attract top talent.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        {/* Subtle top border highlight */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-sm text-red-500">
              {typeof error === 'string' ? error : 'An error occurred'}
            </div>
          )}

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Job Title</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-neutral-950/50 border border-neutral-800 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Type & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Job Type</label>
                <select 
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full bg-neutral-950/50 border border-neutral-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input 
                    type="text" 
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Remote, New York, etc."
                    className="w-full bg-neutral-950/50 border border-neutral-800 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
                  />
                </div>
              </div>
            </div>

            {/* Salary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Minimum Salary (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input 
                    type="number" 
                    name="minSalary"
                    value={formData.minSalary}
                    onChange={handleChange}
                    placeholder="e.g. 80000"
                    className="w-full bg-neutral-950/50 border border-neutral-800 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Maximum Salary (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input 
                    type="number" 
                    name="maxSalary"
                    value={formData.maxSalary}
                    onChange={handleChange}
                    placeholder="e.g. 120000"
                    className="w-full bg-neutral-950/50 border border-neutral-800 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Job Description</label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <textarea 
                  name="description"
                  required
                  rows={8}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the responsibilities, requirements, and benefits..."
                  className="w-full bg-neutral-950/50 border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-neutral-800">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-xl text-neutral-400 hover:text-white font-medium transition-colors mr-4"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Post Job</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
