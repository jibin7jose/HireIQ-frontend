import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative gradient background blur */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Logo/Brand Area */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">CareerConnect AI</h1>
          <p className="text-neutral-400 mt-2 text-sm">Your next career move, powered by AI</p>
        </div>

        {/* The Auth Forms */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle inner highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-2xl" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
