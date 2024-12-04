import React, { useState } from 'react';
import { WalletProvider } from './contexts/WalletContext';
import { WalletButton } from './components/WalletButton';
import { NFTMinting } from './components/NFTMinting';
import { CurrencyExchange } from './components/CurrencyExchange';
import { NFT, CurrencyBalance } from './types';
import { useWallet } from './contexts/WalletContext';

function AppContent() {
  const { connected, publicKey } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [currency, setCurrency] = useState<CurrencyBalance>({
    amount: 0,
    value: 0,
  });

  const mintNFT = () => {
    if (!publicKey) return;
    
    const newNFT: NFT = {
      id: nfts.length + 1,
      owner: publicKey.toBase58(),
      mintPrice: 0.1,
      mintedAt: new Date(),
    };

    setNfts([...nfts, newNFT]);
  };

  const buyCurrency = (amount: number) => {
    if (!publicKey) return;
    setCurrency({
      amount: currency.amount + amount,
      value: currency.value + (0.1 * amount),
    });
  };

  const sellCurrency = (amount: number) => {
    if (!publicKey || currency.amount < amount) return;
    setCurrency({
      amount: currency.amount - amount,
      value: currency.value - (0.1 * amount),
    });
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="border-b border-dark-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-400">NFT Membership</h1>
          <WalletButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <NFTMinting
            nfts={nfts}
            onMint={mintNFT}
            walletConnected={connected}
          />
          <CurrencyExchange
            balance={currency}
            onBuy={buyCurrency}
            onSell={sellCurrency}
            walletConnected={connected}
          />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

export default App;