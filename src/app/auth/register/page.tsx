'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, Briefcase, GraduationCap, Loader2, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'Candidate' // Default role
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (role: 'Candidate' | 'Employer') => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', formData);
      // On successful registration, redirect to login
      router.push('/auth/login?registered=true');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.response?.data?.title || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Create an account</h2>
        <p className="text-sm text-neutral-400 mt-2">Join CareerConnect AI today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-sm text-red-500 text-center">
            {typeof error === 'string' ? error : 'An error occurred'}
          </div>
        )}

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole('Candidate')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
              formData.role === 'Candidate' 
                ? 'bg-blue-500/10 border-blue-500/50 text-white' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <GraduationCap className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Candidate</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('Employer')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
              formData.role === 'Employer' 
                ? 'bg-purple-500/10 border-purple-500/50 text-white' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <Briefcase className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Employer</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input 
              type="text" 
              name="fullName"
              placeholder="Full Name (or Company Name)"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-neutral-950/50 border border-neutral-800 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input 
              type="email" 
              name="email"
              placeholder="Email address"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-neutral-950/50 border border-neutral-800 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input 
              type="tel" 
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-neutral-950/50 border border-neutral-800 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input 
              type="password" 
              name="password"
              placeholder="Password (min 6 chars, 1 uppercase)"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-neutral-950/50 border border-neutral-800 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-white text-black font-medium py-2.5 rounded-xl hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-sm text-neutral-400 pt-2">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-white font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
