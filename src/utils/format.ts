import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const formatSOL = (amount: number): string => {
  return `${amount.toFixed(3)} SOL`;
};

export const lamportsToSol = (lamports: number): number => {
  return lamports / LAMPORTS_PER_SOL;
};

export const solToLamports = (sol: number): number => {
  return Math.floor(sol * LAMPORTS_PER_SOL);
};