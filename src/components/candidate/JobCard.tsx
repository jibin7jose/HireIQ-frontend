import React from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Clock, Building } from 'lucide-react';

export interface JobDto {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  minSalary?: number;
  maxSalary?: number;
  companyName?: string;
  createdAt: string;
  aiMatchScore?: number;
}

interface JobCardProps {
  job: JobDto;
}

export default function JobCard({ job }: JobCardProps) {
  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formatSalary = (salary?: number) => {
    if (!salary) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(salary);
  };

  const salaryDisplay = job.minSalary && job.maxSalary 
    ? `${formatSalary(job.minSalary)} - ${formatSalary(job.maxSalary)}`
    : job.minSalary 
      ? `${formatSalary(job.minSalary)}+`
      : 'Salary not specified';

  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 p-6 rounded-2xl transition-all duration-300 hover:border-blue-500/50 hover:bg-neutral-900 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden">
        {/* Subtle hover gradient */}
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center text-neutral-400 mt-2 space-x-4 text-sm">
              <span className="flex items-center">
                <Building className="w-4 h-4 mr-1.5" />
                {job.companyName || 'Company'}
              </span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1.5" />
                {job.location}
              </span>
            </div>
          </div>
            <div className="flex flex-col items-end space-y-2">
              {job.aiMatchScore && (
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20 flex items-center shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  ✨ {job.aiMatchScore}% Match
                </span>
              )}
              <span className="bg-blue-500/10 text-blue-400 text-xs font-medium px-3 py-1 rounded-full border border-blue-500/20">
                {job.jobType}
              </span>
            </div>
          </div>

        <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-sm text-neutral-500">
          <span className="flex items-center text-neutral-300 font-medium">
            <DollarSign className="w-4 h-4 mr-1" />
            {salaryDisplay}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Posted {formattedDate}
          </span>
        </div>
      </div>
    </Link>
  );
}
