import React, { useState } from 'react';
import { CurrencyBalance } from '../types';
import { calculateCurrencyPrice } from '../utils/bondingCurve';
import { formatSOL } from '../utils/format';
import { useCurrencyContract } from '../hooks/useCurrencyContract';
import { Coins, Loader2 } from 'lucide-react';

interface CurrencyExchangeProps {
  balance: CurrencyBalance;
  onBuy: (amount: number) => void;
  onSell: (amount: number) => void;
  walletConnected: boolean;
}

export function CurrencyExchange({ balance, onBuy, onSell, walletConnected }: CurrencyExchangeProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { buyCurrency, sellCurrency } = useCurrencyContract();
  const currentPrice = calculateCurrencyPrice(balance.amount);

  const handleBuy = async () => {
    try {
      setLoading(true);
      await buyCurrency(Number(amount), balance.amount);
      onBuy(Number(amount));
      setAmount('');
    } catch (error) {
      console.error('Failed to buy:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    try {
      setLoading(true);
      await sellCurrency(Number(amount), balance.amount);
      onSell(Number(amount));
      setAmount('');
    } catch (error) {
      console.error('Failed to sell:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-800 p-6 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <Coins className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Community Currency</h2>
      </div>

      <div className="mb-6">
        <p className="text-gray-400">Your Balance: {balance.amount} tokens</p>
        <p className="text-lg font-semibold text-white">Current Price: {formatSOL(currentPrice)}/token</p>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          disabled={loading}
          className="flex-1 px-4 py-3 bg-dark-700 border border-dark-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleBuy}
          disabled={!walletConnected || loading || !amount}
          className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            'Buy'
          )}
        </button>
        <button
          onClick={handleSell}
          disabled={!walletConnected || loading || !amount || Number(amount) > balance.amount}
          className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            'Sell'
          )}
        </button>
      </div>
    </div>
  );
}