import { PublicKey } from '@solana/web3.js';

export interface NFT {
  id: number;
  owner: string;
  mintPrice: number;
  mintedAt: Date;
}

export interface CurrencyBalance {
  amount: number;
  value: number;
}

export interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  uri: string;
}

export interface NFTMintingProps {
  nfts: NFT[];
  onMint: () => void;
  walletConnected: boolean;
}

export interface CurrencyExchangeProps {
  balance: CurrencyBalance;
  onBuy: (amount: number) => void;
  onSell: (amount: number) => void;
  walletConnected: boolean;
}