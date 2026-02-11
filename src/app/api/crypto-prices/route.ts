import { NextResponse } from 'next/server';

const CMC_API_KEY = 'd6b9d2379d664c468dac6810bfb85ce1';
const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

// Symbol to CoinMarketCap ID mapping
const CRYPTO_IDS = {
  BTC: '1',
  ETH: '1027',
  BNB: '1839',
  USDT: '825',
};

export async function GET() {
  try {
    const symbols = Object.keys(CRYPTO_IDS).join(',');
    
    const response = await fetch(
      `${CMC_API_URL}?symbol=${symbols}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`CMC API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract prices and changes from response
    const prices = {
      BTC: data.data?.BTC?.quote?.USD?.price || 0,
      ETH: data.data?.ETH?.quote?.USD?.price || 0,
      BNB: data.data?.BNB?.quote?.USD?.price || 0,
      USDT: data.data?.USDT?.quote?.USD?.price || 0,
      BTC_change: data.data?.BTC?.quote?.USD?.percent_change_24h || 0,
      ETH_change: data.data?.ETH?.quote?.USD?.percent_change_24h || 0,
      BNB_change: data.data?.BNB?.quote?.USD?.percent_change_24h || 0,
      USDT_change: data.data?.USDT?.quote?.USD?.percent_change_24h || 0,
    };

    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    
    // Return fallback prices if API fails
    return NextResponse.json({
      BTC: 45000,
      ETH: 2500,
      BNB: 320,
      USDT: 1.00,
      BTC_change: 2.5,
      ETH_change: -1.2,
      BNB_change: 3.8,
      USDT_change: 0.01,
    });
  }
}
