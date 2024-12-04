import { useCallback } from 'react';
import { Transaction, SystemProgram, PublicKey } from '@solana/web3.js';
import { useWallet } from '../contexts/WalletContext';
import { sendTransaction } from '../utils/solana';
import { calculateCurrencyPrice } from '../utils/bondingCurve';
import { CURRENCY_PROGRAM_ID } from '../utils/constants';
import { solToLamports } from '../utils/format';

export function useCurrencyContract() {
  const { publicKey } = useWallet();
  const currencyProgramId = new PublicKey(CURRENCY_PROGRAM_ID);

  const buyCurrency = useCallback(async (amount: number, totalSupply: number) => {
    if (!window.solana || !publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const price = calculateCurrencyPrice(totalSupply) * amount;
      const lamports = solToLamports(price);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: currencyProgramId,
          lamports,
        })
      );

      const signature = await sendTransaction(window.solana, transaction);
      return signature;
    } catch (error: any) {
      console.error('Failed to buy currency:', error);
      throw new Error(error.message || 'Failed to buy currency');
    }
  }, [publicKey, currencyProgramId]);

  const sellCurrency = useCallback(async (amount: number, totalSupply: number) => {
    if (!window.solana || !publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const price = calculateCurrencyPrice(totalSupply - amount) * amount;
      const lamports = solToLamports(price);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: currencyProgramId,
          toPubkey: publicKey,
          lamports,
        })
      );

      const signature = await sendTransaction(window.solana, transaction);
      return signature;
    } catch (error: any) {
      console.error('Failed to sell currency:', error);
      throw new Error(error.message || 'Failed to sell currency');
    }
  }, [publicKey, currencyProgramId]);

  return { buyCurrency, sellCurrency };
}