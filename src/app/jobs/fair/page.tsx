'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Loader2, Users, Video } from 'lucide-react';

interface AvatarState {
  connectionId: string;
  fairId: string;
  name: string;
  role: string;
  userId: string;
  x: number;
  y: number;
}

const ROOM_ID = "main-fair";
const MOVEMENT_SPEED = 10;
const PROXIMITY_THRESHOLD = 100;

export default function JobFairPage() {
  const { user, token } = useAuthStore();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [avatars, setAvatars] = useState<Record<string, AvatarState>>({});
  const [myPos, setMyPos] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [activeCallWith, setActiveCallWith] = useState<string | null>(null);

  // Keyboard state
  const keys = useRef<{ [key: string]: boolean }>({});
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!user || !token) return;

    // Init starting pos based on role
    const startX = user.role === 'Employer' ? 100 : 400;
    const startY = user.role === 'Employer' ? 100 : 400;
    setMyPos({ x: startX, y: startY });

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5001'}/hubs/jobfair`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, [user, token]);

  useEffect(() => {
    if (!connection) return;

    connection.start()
      .then(() => {
        console.log('Connected to Job Fair Hub');
        connection.invoke('JoinFair', ROOM_ID, user?.fullName || 'Unknown', user?.role || 'Candidate', user?.id || '');
        setLoading(false);
      })
      .catch(e => console.error('Connection failed: ', e));

    connection.on('SyncAvatars', (existingAvatars: AvatarState[]) => {
      const state: Record<string, AvatarState> = {};
      existingAvatars.forEach(a => {
        if (a.connectionId !== connection.connectionId) {
          state[a.connectionId] = a;
        }
      });
      setAvatars(state);
    });

    connection.on('AvatarJoined', (avatar: AvatarState) => {
      if (avatar.connectionId === connection.connectionId) return;
      setAvatars(prev => ({ ...prev, [avatar.connectionId]: avatar }));
    });

    connection.on('AvatarMoved', (connectionId: string, x: number, y: number) => {
      setAvatars(prev => {
        if (!prev[connectionId]) return prev;
        return {
          ...prev,
          [connectionId]: { ...prev[connectionId], x, y }
        };
      });
    });

    connection.on('AvatarLeft', (connectionId: string) => {
      setAvatars(prev => {
        const next = { ...prev };
        delete next[connectionId];
        return next;
      });
    });

    return () => {
      connection.stop();
    };
  }, [connection, user]);

  // Movement loop
  const updatePosition = useCallback(() => {
    setMyPos(prev => {
      let dx = 0;
      let dy = 0;

      if (keys.current['w'] || keys.current['ArrowUp']) dy -= MOVEMENT_SPEED;
      if (keys.current['s'] || keys.current['ArrowDown']) dy += MOVEMENT_SPEED;
      if (keys.current['a'] || keys.current['ArrowLeft']) dx -= MOVEMENT_SPEED;
      if (keys.current['d'] || keys.current['ArrowRight']) dx += MOVEMENT_SPEED;

      if (dx !== 0 || dy !== 0) {
        // Clamp to screen bounds (approx)
        const newX = Math.max(0, Math.min(window.innerWidth - 100, prev.x + dx));
        const newY = Math.max(0, Math.min(window.innerHeight - 200, prev.y + dy));
        
        if (newX !== prev.x || newY !== prev.y) {
          connection?.invoke('UpdatePosition', ROOM_ID, newX, newY).catch(console.error);
          return { x: newX, y: newY };
        }
      }
      return prev;
    });

    requestRef.current = requestAnimationFrame(updatePosition);
  }, [connection]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    requestRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updatePosition]);


  // Find nearby users
  const nearbyUsers = Object.values(avatars).filter(a => {
    const dist = Math.sqrt(Math.pow(a.x - myPos.x, 2) + Math.pow(a.y - myPos.y, 2));
    // Only show connect button if roles are different
    return dist < PROXIMITY_THRESHOLD && a.role !== user?.role;
  });

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-950">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-neutral-400 text-lg">Entering the Virtual Job Fair...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-neutral-950 overflow-hidden relative">
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20" 
        style={{
          backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Header UI */}
      <div className="absolute top-0 left-0 right-0 p-6 z-40 pointer-events-none flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white shadow-sm flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-500" /> Virtual Job Fair
          </h1>
          <p className="text-neutral-300 mt-2 bg-neutral-900/80 p-2 rounded-lg inline-block shadow-lg">Use WASD or Arrow Keys to move</p>
        </div>
        <div className="bg-neutral-900/80 border border-neutral-700 px-4 py-2 rounded-xl flex items-center pointer-events-auto">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse mr-2" />
          <span className="text-sm font-medium text-white">{Object.keys(avatars).length + 1} Online</span>
        </div>
      </div>

      {/* Map Area */}
      <div className="absolute inset-0 z-10">
        
        {/* Draw Other Avatars */}
        {Object.values(avatars).map(avatar => (
          <div 
            key={avatar.connectionId}
            className={`absolute flex flex-col items-center transition-all duration-100 ease-linear`}
            style={{ transform: `translate(${avatar.x}px, ${avatar.y}px)` }}
          >
            <div className={`w-12 h-12 rounded-full border-4 shadow-xl flex items-center justify-center
              ${avatar.role === 'Employer' ? 'bg-purple-600 border-purple-400' : 'bg-blue-600 border-blue-400'}
            `}>
              <span className="text-white font-bold text-lg">{avatar.name.charAt(0)}</span>
            </div>
            <div className="mt-2 bg-neutral-900/80 border border-neutral-700 px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
              <p className="text-xs font-bold text-white">{avatar.name}</p>
              <p className="text-[10px] text-neutral-400 text-center">{avatar.role}</p>
            </div>
          </div>
        ))}

        {/* Draw My Avatar */}
        <div 
          className="absolute flex flex-col items-center z-30 transition-all duration-75 ease-linear"
          style={{ transform: `translate(${myPos.x}px, ${myPos.y}px)` }}
        >
          {/* Proximity Ring */}
          <div className="absolute w-[200px] h-[200px] border-2 border-blue-500/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <div className={`w-12 h-12 rounded-full border-4 shadow-xl flex items-center justify-center shadow-blue-500/50
            ${user?.role === 'Employer' ? 'bg-purple-500 border-white' : 'bg-blue-500 border-white'}
          `}>
            <span className="text-white font-bold text-lg">{user?.fullName?.charAt(0) || 'U'}</span>
          </div>
          <div className="mt-2 bg-blue-600 border border-blue-400 px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
            <p className="text-xs font-bold text-white">{user?.fullName} (You)</p>
          </div>
        </div>

      </div>

      {/* Proximity UI overlays */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex space-x-4">
        {nearbyUsers.map(u => (
          <button 
            key={u.connectionId}
            onClick={() => window.open(`/interviews/${u.userId}`, '_blank')}
            className="flex items-center px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all animate-in slide-in-from-bottom-10 border border-emerald-400"
          >
            <Video className="w-6 h-6 mr-3" />
            <div className="text-left">
              <p className="font-bold text-sm">Join Video Chat</p>
              <p className="text-xs text-emerald-100">with {u.name}</p>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
