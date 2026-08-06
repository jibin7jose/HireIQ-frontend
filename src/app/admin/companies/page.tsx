'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/api';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error('Failed to fetch companies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleApprove = async (companyId: string) => {
    try {
      await api.post(`/companies/${companyId}/approve`);
      // Update UI optimistically or refetch
      setCompanies(companies.map(c => 
        c.id === companyId ? { ...c, isVerified: true } : c
      ));
    } catch (err) {
      console.error('Failed to approve company', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Companies Management</h1>
        <p className="text-neutral-400 mt-2">View and approve registered companies</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : companies.length === 0 ? (
          <div className="py-12 text-center text-neutral-400">
            No companies found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Company Name</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      <div className="flex items-center space-x-3">
                        {company.logoUrl && (
                          <img src={company.logoUrl} alt={company.name} className="w-8 h-8 rounded bg-neutral-800 object-cover" />
                        )}
                        <span>{company.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">{company.location}</td>
                    <td className="px-6 py-4">
                      {company.isVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!company.isVerified && (
                        <button 
                          onClick={() => handleApprove(company.id)}
                          className="text-blue-400 hover:text-blue-300 font-medium bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors text-xs"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
