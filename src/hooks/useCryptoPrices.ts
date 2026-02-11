'use client';

import { useState, useEffect } from 'react';
import { CMC_API_KEY, CMC_API_URL } from '@/lib/constants';

interface CryptoPrices {
  BTC: number;
  ETH: number;
  BNB: number;
  USDT: number;
}

interface PriceChange {
  BTC: number;
  ETH: number;
  BNB: number;
  USDT: number;
}

interface CMCQuote {
  price: number;
  percent_change_24h: number;
}

interface CMCData {
  id: number;
  symbol: string;
  quote: {
    USD: CMCQuote;
  };
}

export const useCryptoPrices = () => {
  const [prices, setPrices] = useState<CryptoPrices>({
    BTC: 0,
    ETH: 0,
    BNB: 0,
    USDT: 0,
  });
  const [changes, setChanges] = useState<PriceChange>({
    BTC: 0,
    ETH: 0,
    BNB: 0,
    USDT: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Using Next.js API route to avoid CORS issues
        const res = await fetch('/api/crypto-prices');
        
        if (!res.ok) {
          throw new Error('Failed to fetch prices');
        }
        
        const data = await res.json();
        
        setPrices({
          BTC: data.BTC || 0,
          ETH: data.ETH || 0,
          BNB: data.BNB || 0,
          USDT: data.USDT || 0,
        });
        
        setChanges({
          BTC: data.BTC_change || 0,
          ETH: data.ETH_change || 0,
          BNB: data.BNB_change || 0,
          USDT: data.USDT_change || 0,
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch crypto prices:', error);
        // Set fallback prices for demo purposes
        setPrices({
          BTC: 45000,
          ETH: 2500,
          BNB: 320,
          USDT: 1.00,
        });
        setChanges({
          BTC: 2.5,
          ETH: -1.2,
          BNB: 3.8,
          USDT: 0.01,
        });
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return { prices, changes, loading };
};
