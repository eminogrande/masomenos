import React from 'react';
import { NFT } from '../types';
import { calculateNFTPrice } from '../utils/bondingCurve';
import { formatSOL } from '../utils/format';
import { useNFTContract } from '../hooks/useNFTContract';
import { Ticket, Loader2 } from 'lucide-react';

interface NFTMintingProps {
  nfts: NFT[];
  onMint: () => void;
  walletConnected: boolean;
}

export function NFTMinting({ nfts, onMint, walletConnected }: NFTMintingProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { mintNFT } = useNFTContract();
  const currentPrice = calculateNFTPrice(nfts.length);

  const handleMint = async () => {
    if (!walletConnected) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await mintNFT(nfts.length);
      console.log('Minted NFT:', result);
      onMint();
    } catch (error: any) {
      console.error('Failed to mint:', error);
      setError(error.message || 'Failed to mint NFT');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-800 p-6 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <Ticket className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Membership NFT</h2>
      </div>

      <div className="mb-6">
        <p className="text-gray-400">Total Minted: {nfts.length}</p>
        <p className="text-lg font-semibold text-white">Current Price: {formatSOL(currentPrice)}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <button
        onClick={handleMint}
        disabled={!walletConnected || loading}
        className="primary-button"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Minting...
          </>
        ) : (
          'Mint NFT'
        )}
      </button>

      {nfts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-white">Your NFTs</h3>
          <div className="space-y-2">
            {nfts.map((nft) => (
              <div key={nft.id} className="token-card">
                <span className="text-white">NFT #{nft.id}</span>
                <span className="text-gray-400">{formatSOL(nft.mintPrice)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}