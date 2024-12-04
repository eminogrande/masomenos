import React, { createContext, useContext, useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';

interface WalletContextType {
  connected: boolean;
  publicKey: PublicKey | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: any;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

declare global {
  interface Window {
    solana?: {
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signTransaction: any;
      publicKey: PublicKey | null;
      isConnected: boolean;
      on: (event: string, callback: Function) => void;
      removeListener: (event: string, callback: Function) => void;
    };
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      if (window.solana?.publicKey) {
        setConnected(true);
        setPublicKey(window.solana.publicKey);
      }
    };

    const handleDisconnect = () => {
      setConnected(false);
      setPublicKey(null);
    };

    if (window.solana) {
      window.solana.on('connect', handleConnect);
      window.solana.on('disconnect', handleDisconnect);

      if (window.solana.isConnected) {
        handleConnect();
      }
    }

    return () => {
      if (window.solana) {
        window.solana.removeListener('connect', handleConnect);
        window.solana.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  const connect = async () => {
    if (!window.solana) {
      alert('Please use Brave browser with Solana wallet enabled');
      return;
    }

    try {
      setConnecting(true);
      await window.solana.connect();
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if (!window.solana) return;

    try {
      await window.solana.disconnect();
    } catch (error) {
      console.error('Failed to disconnect:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        publicKey,
        connecting,
        connect,
        disconnect,
        signTransaction: window.solana?.signTransaction.bind(window.solana),
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);