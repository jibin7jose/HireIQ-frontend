'use client';

import React, { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { Wallet, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

interface Web3ConnectButtonProps {
  currentAddress?: string | null;
  onConnect: (address: string) => void;
}

export default function Web3ConnectButton({ currentAddress, onConnect }: Web3ConnectButtonProps) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setError(null);
    if (!(window as any).ethereum) {
      setError('MetaMask is not installed. Please install it to use Web3 features.');
      return;
    }

    setConnecting(true);
    try {
      // Connect to MetaMask
      const provider = new BrowserProvider((window as any).ethereum);
      
      // Request account access
      await provider.send("eth_requestAccounts", []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      // Update backend via API
      await api.put('/users/me/profile', {
        walletAddress: address
      });

      onConnect(address);
    } catch (err: any) {
      console.error("Failed to connect wallet", err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  if (currentAddress) {
    return (
      <div className="flex items-center space-x-3 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white">Web3 Verified</h4>
          <p className="text-xs text-blue-300 font-mono">
            {currentAddress.substring(0, 6)}...{currentAddress.substring(currentAddress.length - 4)}
          </p>
        </div>
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={connectWallet}
        disabled={connecting}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#F6851B] to-[#e2761b] hover:from-[#e2761b] hover:to-[#cd6a18] text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {connecting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Wallet className="w-5 h-5" />
        )}
        <span>{connecting ? 'Connecting...' : 'Connect MetaMask'}</span>
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
