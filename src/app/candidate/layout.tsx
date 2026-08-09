'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/shared/Sidebar';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const [isHydrated, setIsHydrated] = React.useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    // If not authenticated or not a candidate, redirect
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user?.role !== 'Candidate') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  // Prevent rendering children briefly while redirecting or hydrating
  if (!isHydrated || !isAuthenticated || user?.role !== 'Candidate') {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex font-sans text-neutral-200">
      <Sidebar role="Candidate" />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
