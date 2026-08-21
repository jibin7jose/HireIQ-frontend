'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Building, MapPin, DollarSign, Clock, ArrowLeft, Loader2, CheckCircle2, Sparkles, FileText, X } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Apply state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  
  const [coverLetter, setCoverLetter] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load job details. The job might have been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?returnUrl=/jobs/${id}`);
      return;
    }
    if (user?.role !== 'Candidate') {
      alert('Only candidates can apply for jobs.');
      return;
    }
    setIsModalOpen(true);
  };

  const generateAiCoverLetter = async () => {
    try {
      setIsGeneratingAi(true);
      const res = await api.post(`/jobs/${id}/ai-cover-letter`);
      setCoverLetter(res.data.coverLetter);
    } catch (err: any) {
      console.error(err);
      alert('Failed to generate AI Cover Letter.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleFinalApply = async () => {
    setApplying(true);
    try {
      await api.post('/applications', { jobId: id, coverLetter });
      setApplied(true);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to apply', err);
      const msg = err.response?.data?.message || err.response?.data || 'Failed to apply. Please try again later.';
      alert(typeof msg === 'string' ? msg : 'Failed to apply.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-neutral-400 font-medium">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl max-w-md w-full">
          <h2 className="text-xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/jobs')}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            ← Back to Search
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(job.postedAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  const formatSalary = (salary?: number) => {
    if (!salary) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(salary);
  };

  const salaryDisplay = job.minSalary && job.maxSalary 
    ? `${formatSalary(job.minSalary)} - ${formatSalary(job.maxSalary)}`
    : job.minSalary 
      ? `${formatSalary(job.minSalary)}+`
      : 'Salary not specified';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans pb-20">
      {/* Header Banner */}
      <div className="bg-neutral-900 border-b border-neutral-800 pt-8 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-neutral-400 hover:text-white mb-8 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </button>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-neutral-400 text-sm">
                <span className="flex items-center bg-neutral-800 px-3 py-1.5 rounded-lg text-white font-medium">
                  <Building className="w-4 h-4 mr-2 text-neutral-400" />
                  {job.companyName || 'Company Name'}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  {job.location}
                </span>
                <span className="flex items-center bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg font-medium">
                  {job.jobType}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  Posted {formattedDate}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col md:items-end gap-3">
              <div className="flex items-center text-xl font-bold text-white bg-neutral-800/50 px-4 py-2 rounded-xl border border-neutral-700/50">
                <DollarSign className="w-5 h-5 text-green-400 mr-1" />
                {salaryDisplay}
              </div>
              
              {!applied ? (
                <button
                  onClick={handleApplyClick}
                  className="w-full md:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                  Apply Now
                </button>
              ) : (
                <div className="w-full md:w-auto flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold py-3 px-8 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Successfully Applied
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Job Description</h2>
          
          <div className="prose prose-invert max-w-none text-neutral-300 leading-relaxed whitespace-pre-wrap">
            {job.description}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6">Submit Application</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-neutral-300 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Cover Letter (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={generateAiCoverLetter}
                    disabled={isGeneratingAi}
                    className="flex items-center text-xs font-semibold text-purple-400 hover:text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingAi ? (
                      <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1.5" />
                    )}
                    {isGeneratingAi ? 'Generating...' : 'Auto-generate with AI'}
                  </button>
                </div>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write your cover letter here..."
                  rows={8}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-neutral-400 hover:text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalApply}
                  disabled={applying}
                  className="flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                >
                  {applying ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
