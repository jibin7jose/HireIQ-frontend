'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { Loader2, Briefcase, MapPin, DollarSign, X, Heart, Sparkles } from 'lucide-react';

// react-tinder-card is not SSR friendly, so we dynamically import it
const TinderCard = dynamic(() => import('react-tinder-card'), { ssr: false });

export default function DiscoverPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [swipeResult, setSwipeResult] = useState<{ action: string; jobTitle: string } | null>(null);

  // Store refs to the TinderCard components so we can trigger swipes programmatically if needed
  const childRefs = useMemo(() => Array(jobs.length).fill(0).map(() => React.createRef<any>()), [jobs.length]);

  useEffect(() => {
    const fetchDiscoverableJobs = async () => {
      try {
        const res = await api.get('/jobs/discover');
        const jobData = res.data || [];
        setJobs(jobData);
        setCurrentIndex(jobData.length - 1);
      } catch (err) {
        console.error('Failed to fetch discoverable jobs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscoverableJobs();
  }, []);

  const swiped = async (direction: string, jobToSwipe: any, index: number) => {
    setCurrentIndex(index - 1);
    
    if (direction === 'right') {
      try {
        await api.post('/applications', {
          jobId: jobToSwipe.id,
          coverLetter: 'Applied via Swipe Discover mode.'
        });
        setSwipeResult({ action: 'applied', jobTitle: jobToSwipe.title });
      } catch (err) {
        console.error('Failed to apply', err);
        setSwipeResult({ action: 'error', jobTitle: jobToSwipe.title });
      }
    } else if (direction === 'left') {
      setSwipeResult({ action: 'skipped', jobTitle: jobToSwipe.title });
    }
    
    // Clear toast after 2 seconds
    setTimeout(() => setSwipeResult(null), 2000);
  };

  const outOfFrame = (name: string, idx: number) => {
    console.log(`${name} (${idx}) left the screen!`);
  };

  const swipe = async (dir: string) => {
    if (currentIndex >= 0 && currentIndex < jobs.length) {
      const currentRef = childRefs[currentIndex];
      if (currentRef?.current) {
        await currentRef.current.swipe(dir);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-neutral-400">Finding opportunities for you...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8 px-4 relative max-w-lg mx-auto">
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-purple-400 mr-2" />
          Discover Jobs
        </h1>
        <p className="text-neutral-400 mt-2">Swipe right to apply instantly. Swipe left to pass.</p>
      </div>

      {/* Swipe Result Toast */}
      {swipeResult && (
        <div className={`absolute top-4 z-50 px-6 py-3 rounded-full text-white font-bold shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 ${
          swipeResult.action === 'applied' ? 'bg-emerald-500' :
          swipeResult.action === 'skipped' ? 'bg-neutral-600' : 'bg-red-500'
        }`}>
          {swipeResult.action === 'applied' ? `Applied to ${swipeResult.jobTitle}! 🎉` :
           swipeResult.action === 'skipped' ? `Passed on ${swipeResult.jobTitle}` : `Error applying to ${swipeResult.jobTitle}`}
        </div>
      )}

      {/* Card Stack Container */}
      <div className="relative w-full aspect-[3/4] max-h-[600px] perspective-1000">
        {jobs.map((job, index) => (
          <div key={job.id} className="absolute inset-0">
            <TinderCard
              ref={childRefs[index]}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              onSwipe={(dir) => swiped(dir, job, index)}
              onCardLeftScreen={() => outOfFrame(job.title, index)}
              preventSwipe={['up', 'down']}
            >
              <div 
                className="w-full h-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.1) inset'
                }}
              >
                {/* AI Score Badge */}
                {job.aiMatchScore && (
                  <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10 border border-emerald-400">
                    {job.aiMatchScore}% Match
                  </div>
                )}
                
                {/* Header / Banner Area */}
                <div className="h-1/3 bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-6 flex flex-col justify-end relative">
                  <div className="absolute inset-0 bg-neutral-900/50 mix-blend-overlay"></div>
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white leading-tight mb-1">{job.title}</h2>
                    <p className="text-lg text-blue-300 font-medium">{job.companyName}</p>
                  </div>
                </div>

                {/* Details Area */}
                <div className="flex-1 p-6 flex flex-col justify-between bg-neutral-900">
                  <div className="space-y-4">
                    <div className="flex items-center text-neutral-300">
                      <MapPin className="w-5 h-5 mr-3 text-neutral-500" />
                      <span className="text-lg">{job.location}</span>
                    </div>
                    
                    <div className="flex items-center text-neutral-300">
                      <DollarSign className="w-5 h-5 mr-3 text-neutral-500" />
                      <span className="text-lg">${job.minSalary?.toLocaleString() ?? 0} - ${job.maxSalary?.toLocaleString() ?? 0}</span>
                    </div>

                    <div className="flex items-center text-neutral-300">
                      <Briefcase className="w-5 h-5 mr-3 text-neutral-500" />
                      <span className="text-lg">{job.jobType}</span>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-800">
                      <p className="text-neutral-400 text-sm line-clamp-4 leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Visual swipe hints overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl border-4 border-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </TinderCard>
          </div>
        ))}
        
        {/* Empty State */}
        {currentIndex === -1 && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 border border-neutral-800 rounded-3xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-neutral-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">You're all caught up!</h2>
            <p className="text-neutral-400">We'll let you know when we find more opportunities that match your profile.</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center mt-8 space-x-6">
        <button 
          onClick={() => swipe('left')}
          disabled={currentIndex === -1}
          className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 active:scale-95 shadow-lg"
        >
          <X className="w-8 h-8" />
        </button>
        <button 
          onClick={() => swipe('right')}
          disabled={currentIndex === -1}
          className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-emerald-500 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 active:scale-95 shadow-lg"
        >
          <Heart className="w-8 h-8 fill-current" />
        </button>
      </div>

    </div>
  );
}
