'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';

// Fix for default marker icon in leaflet with webpack/nextjs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Job {
  id: string;
  title: string;
  companyName?: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  minSalary?: number;
  maxSalary?: number;
}

interface JobMapProps {
  jobs: Job[];
}

export default function JobMap({ jobs }: JobMapProps) {
  // Default center to US if no jobs have coordinates, else center on the first job with coords
  const jobsWithCoords = jobs.filter(j => j.latitude && j.longitude);
  const center: [number, number] = jobsWithCoords.length > 0 
    ? [jobsWithCoords[0].latitude!, jobsWithCoords[0].longitude!] 
    : [39.8283, -98.5795]; // Center of US
    
  const zoom = jobsWithCoords.length > 0 ? 5 : 4;

  return (
    <div className="w-full h-full min-h-[600px] rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {jobsWithCoords.map(job => (
          <Marker key={job.id} position={[job.latitude!, job.longitude!]}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{job.companyName}</p>
                <p className="text-xs text-gray-500 mb-3">{job.location}</p>
                <div className="text-xs font-semibold text-indigo-600 mb-3">
                  ${job.minSalary?.toLocaleString() ?? 0} - ${job.maxSalary?.toLocaleString() ?? 0}
                </div>
                <Link 
                  href={`/candidate/jobs/${job.id}`}
                  className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2 rounded transition-colors"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
