'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, Filter, Map, List, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import JobCard, { JobDto } from '@/components/candidate/JobCard';
import dynamic from 'next/dynamic';

const JobMap = dynamic(() => import('@/components/jobs/JobMap'), { ssr: false, loading: () => <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-neutral-900 rounded-xl"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div> });

export default function JobSearchPage() {
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search state
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  
  // Semantic Search state
  const [isSemanticMode, setIsSemanticMode] = useState(false);
  const [semanticQuery, setSemanticQuery] = useState('');
  
  // View state
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      if (isSemanticMode && semanticQuery.trim() !== '') {
        const res = await api.get(`/jobs/semantic-search?query=${encodeURIComponent(semanticQuery)}`);
        setJobs(res.data.items || []);
      } else {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (location) params.append('location', location);
        if (jobType) params.append('jobType', jobType);

        const res = await api.get(`/jobs?${params.toString()}`);
        setJobs(res.data.items || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobType]); // Fetch automatically when jobType changes (if not in semantic mode)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans">
      {/* Hero Search Section */}
      <section className="relative py-20 px-4 overflow-hidden border-b border-neutral-800">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[80%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 flex items-center justify-center">
            {isSemanticMode ? (
              <><Sparkles className="w-10 h-10 text-purple-400 mr-4" /> AI Job Match</>
            ) : (
              <>Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 ml-2">opportunity</span></>
            )}
          </h1>
          <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
            {isSemanticMode 
              ? "Describe your dream job naturally. Our AI will understand and find the perfect matches." 
              : "Search thousands of jobs from verified companies and let our AI match you with the perfect role."}
          </p>

          <div className="flex justify-center mb-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-full p-1 inline-flex">
              <button 
                onClick={() => setIsSemanticMode(false)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!isSemanticMode ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Standard Search
              </button>
              <button 
                onClick={() => setIsSemanticMode(true)}
                className={`flex items-center px-6 py-2 rounded-full text-sm font-bold transition-all ${isSemanticMode ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'text-neutral-400 hover:text-white'}`}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Semantic AI
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-2 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto shadow-2xl">
            
            {isSemanticMode ? (
              <div className="flex-1 relative flex items-center px-4 py-2">
                <Sparkles className="w-5 h-5 text-purple-500 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="e.g., I'm looking for a relaxed remote job working with React and TypeScript paying over $90k"
                  value={semanticQuery}
                  onChange={(e) => setSemanticQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder:text-neutral-500 text-lg"
                />
              </div>
            ) : (
              <>
                <div className="flex-1 relative flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-neutral-800">
                  <Search className="w-5 h-5 text-neutral-500 mr-3 shrink-0" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder:text-neutral-500 text-lg"
                  />
                </div>
                
                <div className="flex-1 relative flex items-center px-4 py-2">
                  <MapPin className="w-5 h-5 text-neutral-500 mr-3 shrink-0" />
                  <input
                    type="text"
                    placeholder="City, state, or Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder:text-neutral-500 text-lg"
                  />
                </div>
              </>
            )}

            <button 
              type="submit"
              disabled={loading}
              className={`${isSemanticMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-blue-600 hover:bg-blue-500'} text-white font-semibold py-3 px-8 rounded-xl transition-colors shrink-0 disabled:opacity-70`}
            >
              {loading && isSemanticMode ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
            </button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        {!isSemanticMode && (
          <aside className="w-full md:w-64 shrink-0 space-y-6">
            <div className="flex items-center space-x-2 text-white font-semibold text-lg mb-4">
              <Filter className="w-5 h-5" />
              <h2>Filters</h2>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Job Type</h3>
              <div className="space-y-2">
                {['Full-Time', 'Part-Time', 'Contract', 'Remote'].map((type) => (
                  <label key={type} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="jobType" 
                      value={type}
                      checked={jobType === type}
                      onChange={(e) => {
                        setJobType(e.target.value);
                      }}
                      className="w-4 h-4 rounded-full border-neutral-700 bg-neutral-900 text-blue-500 focus:ring-blue-500/50" 
                    />
                    <span className="text-neutral-300 group-hover:text-white transition-colors">{type}</span>
                  </label>
                ))}
                <label className="flex items-center space-x-3 cursor-pointer group mt-4">
                  <input 
                    type="radio" 
                    name="jobType" 
                    value=""
                    checked={jobType === ''}
                    onChange={(e) => {
                      setJobType('');
                    }}
                    className="w-4 h-4 rounded-full border-neutral-700 bg-neutral-900 text-blue-500 focus:ring-blue-500/50" 
                  />
                  <span className="text-neutral-400 text-sm">Clear Filter</span>
                </label>
              </div>
            </div>
          </aside>
        )}

        {/* Job Listings */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-white">
              {loading ? (isSemanticMode ? 'AI is thinking...' : 'Searching...') : `${jobs.length} jobs found`}
            </h2>
            <div className="flex items-center space-x-2 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}
              >
                <List className="w-4 h-4 mr-2" /> List
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}
              >
                <Map className="w-4 h-4 mr-2" /> Map
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className={`w-10 h-10 animate-spin mb-4 ${isSemanticMode ? 'text-purple-500' : 'text-blue-500'}`} />
              <p className="text-neutral-400">{isSemanticMode ? 'Translating intent into job matches...' : 'Finding the best matches...'}</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 border border-neutral-800 rounded-2xl bg-neutral-900/50">
              <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
              <p className="text-neutral-400">Try adjusting your search keywords or filters.</p>
              <button 
                onClick={() => {
                  setKeyword(''); setLocation(''); setJobType(''); setSemanticQuery('');
                  setTimeout(fetchJobs, 50);
                }}
                className="mt-6 text-blue-400 hover:text-blue-300 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            viewMode === 'map' ? (
              <JobMap jobs={jobs} />
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )
          )}
        </div>

      </section>
    </div>
  );
}
