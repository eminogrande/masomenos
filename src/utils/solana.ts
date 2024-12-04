import { Connection, Transaction, clusterApiUrl, Commitment } from '@solana/web3.js';
import { COMMITMENT_LEVEL, TRANSACTION_TIMEOUT } from './constants';

const endpoint = clusterApiUrl('devnet');

export const connection = new Connection(endpoint, {
  commitment: COMMITMENT_LEVEL as Commitment,
  wsEndpoint: endpoint.replace('https', 'wss'),
  confirmTransactionInitialTimeout: TRANSACTION_TIMEOUT,
});

export const sendTransaction = async (
  wallet: Window['solana'],
  transaction: Transaction
): Promise<string> => {
  if (!wallet) throw new Error('Wallet not connected');

  try {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
    
    const signed = await wallet.signTransaction(transaction);
    const rawTransaction = signed.serialize();
    
    const signature = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: false,
      preflightCommitment: COMMITMENT_LEVEL,
      maxRetries: 5,
    });

    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    });

    return signature;
  } catch (error: any) {
    console.error('Transaction failed:', error);
    throw error;
  }
};