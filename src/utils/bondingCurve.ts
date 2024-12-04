import {
  BASE_NFT_PRICE,
  NFT_PRICE_MULTIPLIER,
  BASE_CURRENCY_PRICE,
  CURRENCY_PRICE_MULTIPLIER
} from './constants';

export const calculateNFTPrice = (totalMinted: number): number => {
  return BASE_NFT_PRICE * Math.pow(NFT_PRICE_MULTIPLIER, totalMinted);
};

export const calculateCurrencyPrice = (totalSupply: number): number => {
  return BASE_CURRENCY_PRICE * Math.pow(CURRENCY_PRICE_MULTIPLIER, totalSupply);
};