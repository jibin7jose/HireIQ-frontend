'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!email.toLowerCase().endsWith('@gmail.com')) {
        setError('Please use a valid Gmail address (@gmail.com).');
        setLoading(false);
        return;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }

      const response = await api.post('/auth/login', { email, password });
      const { token, userId, ...userData } = response.data;
      const user = { id: userId, ...userData };
      
      setAuth(user, token);
      
      // Redirect based on role
      if (user.role === 'Candidate') {
        router.push('/candidate/dashboard');
      } else if (user.role === 'Employer') {
        router.push('/employer/dashboard');
      } else if (user.role === 'Admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.response?.data?.title || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h2>
        <p className="text-sm text-neutral-400 mt-2">Enter your details to sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-sm text-red-500 text-center">
            {typeof error === 'string' ? error : 'An error occurred'}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input 
              type="email" 
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-950/50 border border-neutral-800 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input 
              type="password" 
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-950/50 border border-neutral-800 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-neutral-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 cursor-pointer text-neutral-400 hover:text-white transition-colors">
            <input type="checkbox" className="rounded border-neutral-700 bg-neutral-800 text-blue-500 focus:ring-blue-500/50" />
            <span>Remember me</span>
          </label>
          <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-white text-black font-medium py-2.5 rounded-xl hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-sm text-neutral-400 pt-2">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-white font-medium hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
