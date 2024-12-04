import React from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

export function WalletButton() {
  const { connected, connecting, connect, disconnect, publicKey } = useWallet();

  const handleConnect = async () => {
    if (connected) {
      await disconnect();
    } else {
      await connect();
    }
  };

  if (!window.solana) {
    return (
      <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
        <Wallet className="w-5 h-5" />
        <span>Please use Brave browser</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:bg-purple-400"
    >
      {connecting ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Wallet className="w-5 h-5" />
      )}
      {connected ? (
        <span>{publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}</span>
      ) : connecting ? (
        <span>Connecting...</span>
      ) : (
        <span>Connect Wallet</span>
      )}
    </button>
  );
}