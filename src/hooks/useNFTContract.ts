import { useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { createNFT } from '../utils/metaplex';
import { calculateNFTPrice } from '../utils/bondingCurve';

export function useNFTContract() {
  const { publicKey } = useWallet();

  const mintNFT = useCallback(async (totalMinted: number) => {
    if (!window.solana || !publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const price = calculateNFTPrice(totalMinted);
      
      const { signature, metadata } = await createNFT(
        window.solana,
        `Membership NFT #${totalMinted + 1}`,
        'MNFT',
        'A membership NFT for our exclusive community',
        `https://picsum.photos/seed/membership${totalMinted + 1}/400/400`,
        [
          { trait_type: 'Membership Level', value: 'Basic' },
          { trait_type: 'Mint Number', value: (totalMinted + 1).toString() },
          { trait_type: 'Mint Price', value: price.toString() }
        ]
      );

      return {
        signature,
        metadata,
        price,
      };
    } catch (error: any) {
      console.error('Failed to mint NFT:', error);
      throw error;
    }
  }, [publicKey]);

  return { mintNFT };
}