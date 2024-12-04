import { Transaction, Connection, PublicKey } from '@solana/web3.js';
import { MAX_RETRIES, RETRY_DELAY } from './constants';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function confirmTransaction(
  connection: Connection,
  signature: string,
  blockhash: string,
  lastValidBlockHeight: number
): Promise<void> {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
      }

      return;
    } catch (error) {
      retries++;
      if (retries === MAX_RETRIES) throw error;
      await sleep(RETRY_DELAY);
    }
  }
}

export async function signAndSendTransaction(
  wallet: Window['solana'],
  connection: Connection,
  transaction: Transaction
): Promise<string> {
  if (!wallet?.signTransaction) {
    throw new Error('Wallet not connected or does not support signing');
  }

  try {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey as PublicKey;

    const signed = await wallet.signTransaction(transaction);
    const rawTransaction = signed.serialize();
    
    const signature = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
      maxRetries: 5,
    });

    await confirmTransaction(connection, signature, blockhash, lastValidBlockHeight);
    return signature;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}