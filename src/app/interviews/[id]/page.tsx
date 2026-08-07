'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useWebRTC } from '@/hooks/useWebRTC';
import { Mic, MicOff, Video, VideoOff, PhoneOff, AlertCircle, Loader2 } from 'lucide-react';

export default function VideoInterviewRoom() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user && token === null) {
      router.push('/login');
    }
  }, [user, token, router]);

  const {
    localVideoRef,
    remoteVideoRef,
    connectionState,
    error,
    isMuted,
    isVideoOff,
    toggleMute,
    toggleVideo,
    endCall
  } = useWebRTC({ roomId: id as string, token: token });

  if (!mounted || !user) return null;

  return (
    <div className="h-screen w-full bg-neutral-950 flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-10 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-3"></span>
            CareerConnect Interview
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Room ID: {id}</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-full bg-neutral-900/50 border border-neutral-700 backdrop-blur-md">
            <span className="text-xs font-medium text-neutral-300">
              State: <span className={connectionState === 'connected' ? 'text-emerald-400' : 'text-amber-400'}>{connectionState}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative bg-neutral-900">
        
        {/* Remote Video (Full Screen) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline
            className="w-full h-full object-cover"
          />
          {connectionState !== 'connected' && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/90 backdrop-blur-sm z-0">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-xl text-neutral-300 font-medium">Waiting for other participant to join...</p>
              <p className="text-neutral-500 text-sm mt-2">Make sure both parties have joined the room.</p>
            </div>
          )}
        </div>

        {/* Local Video (Picture in Picture) */}
        <div className="absolute bottom-28 right-8 w-64 h-48 bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-700 z-10">
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline
            muted 
            className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
              <div className="w-16 h-16 rounded-full bg-neutral-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-neutral-400">{user.fullName.charAt(0)}</span>
              </div>
            </div>
          )}
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs font-medium text-white">
            You {isMuted && '(Muted)'}
          </div>
        </div>

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            <div className="bg-neutral-900 p-8 rounded-2xl border border-red-500/30 max-w-md text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
              <p className="text-neutral-400">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Controls Footer */}
      <div className="h-24 bg-neutral-950 border-t border-neutral-800 flex items-center justify-center space-x-6 z-10">
        
        {/* Mic Toggle */}
        <button 
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            isMuted 
              ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30' 
              : 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700'
          }`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* Video Toggle */}
        <button 
          onClick={toggleVideo}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            isVideoOff 
              ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30' 
              : 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700'
          }`}
        >
          {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>

        {/* End Call */}
        <button 
          onClick={endCall}
          className="w-16 h-14 rounded-2xl bg-red-600 text-white hover:bg-red-700 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-colors"
        >
          <PhoneOff className="w-6 h-6" />
        </button>

      </div>
    </div>
  );
}
