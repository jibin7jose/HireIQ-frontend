'use client';

import React, { useState, useEffect } from 'react';
import { Building2, MapPin, AlignLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function EmployerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    about: '',
    location: '',
    logoUrl: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/companies/me');
      if (response.data) {
        setFormData({
          name: response.data.name || '',
          about: response.data.about || '',
          location: response.data.location || '',
          logoUrl: response.data.logoUrl || ''
        });
        setHasProfile(true);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setHasProfile(false);
      } else {
        setMessage('Failed to load company profile.');
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError(false);

    try {
      if (hasProfile) {
        await api.put('/companies/me', formData);
        setMessage('Company profile updated successfully!');
      } else {
        await api.post('/companies', formData);
        setMessage('Company profile created successfully!');
        setHasProfile(true);
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.detail || err.response?.data?.title || 'Failed to save company profile.');
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full pt-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Company Profile</h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-2">
          {hasProfile 
            ? 'Manage your company details and public presence.' 
            : 'Create your company profile to start posting jobs.'}
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${error ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'}`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-neutral-500" />
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corporation"
                  className="w-full bg-gray-50 dark:bg-neutral-950/50 border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Headquarters Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-neutral-500" />
                <input 
                  type="text" 
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full bg-gray-50 dark:bg-neutral-950/50 border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Company Logo</label>
              <div className="flex items-center space-x-4">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Company Logo" className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-neutral-800" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const formDataUpload = new FormData();
                        formDataUpload.append('file', file);
                        
                        try {
                          setMessage('');
                          const response = await api.post('/companies/me/logo', formDataUpload, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          });
                          setFormData({ ...formData, logoUrl: response.data.url });
                        } catch (err: any) {
                          setMessage(err.response?.data?.detail || 'Failed to upload logo.');
                          setError(true);
                        }
                      }
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-500/10 dark:file:text-blue-400 dark:hover:file:bg-blue-500/20 transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">About the Company</label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-4 w-5 h-5 text-gray-400 dark:text-neutral-500" />
                <textarea 
                  name="about"
                  required
                  rows={5}
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Tell candidates about your company's mission, culture, and benefits..."
                  className="w-full bg-gray-50 dark:bg-neutral-950/50 border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-neutral-800 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{hasProfile ? 'Save Changes' : 'Create Company Profile'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
