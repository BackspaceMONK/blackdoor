'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { BTC_WALLET, TELEGRAM_URL } from '@/lib/constants';
import { Copy, Check, Bitcoin, Clock, MessageCircle } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export default function CheckoutPage() {
  const { isLoggedIn, username } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();
  
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [btcPrice, setBtcPrice] = useState<number>(0);
  const [loadingPrice, setLoadingPrice] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push('/login');
    }
    if (mounted && items.length === 0 && !orderComplete) {
      router.push('/cart');
    }
  }, [mounted, isLoggedIn, items, orderComplete, router]);

  // Fetch live BTC price
  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const res = await fetch('/api/crypto-prices');
        if (res.ok) {
          const data = await res.json();
          setBtcPrice(data.BTC || 45000);
        } else {
          setBtcPrice(45000); // Fallback price
        }
      } catch (error) {
        console.error('Failed to fetch BTC price:', error);
        setBtcPrice(45000); // Fallback price
      } finally {
        setLoadingPrice(false);
      }
    };

    if (mounted) {
      fetchBtcPrice();
      // Refresh price every 30 seconds
      const interval = setInterval(fetchBtcPrice, 30000);
      return () => clearInterval(interval);
    }
  }, [mounted]);

  const total = getTotal();
  const btcAmount = btcPrice > 0 ? (total / btcPrice).toFixed(8) : '0.00000000';

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(BTC_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaid = async () => {
    setProcessing(true);
    
    // Save order to database
    const order = {
      username: username || 'Guest',
      items: items,
      total: total,
      status: 'pending' as const,
    };
    
    // Import saveOrder from admin-db
    const { saveOrder } = await import('@/lib/admin-db');
    const success = await saveOrder(order);
    
    if (!success) {
      console.error('Failed to save order to database');
    }
    
    setTimeout(() => {
      setProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 2500);
  };

  const handleContactSupport = () => {
    window.open(TELEGRAM_URL, '_blank');
  };

  if (!mounted || !isLoggedIn) return null;

  if (orderComplete) {
    return (
      <div className="min-h-screen">
        <Navbar />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <GlassCard className="text-center">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="text-yellow-400" size={40} />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Order Processing</h1>
            
            <div className="max-w-xl mx-auto space-y-4 mb-8">
              <p className="text-gray-300">
                Your order is now being processed. This can take up to <span className="text-emerald-400 font-semibold">3 hours</span>.
              </p>
              
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6">
                <h3 className="font-bold text-emerald-400 mb-3 text-lg">
                  ⚡ Fast Track Confirmation (5 minutes)
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  For instant confirmation within 5 minutes, contact our customer support on Telegram with your payment proof.
                </p>
                <button
                  onClick={handleContactSupport}
                  className="flex items-center space-x-2 mx-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition"
                >
                  <MessageCircle size={20} />
                  <span>Contact Telegram Support</span>
                </button>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-sm text-red-400">
                  ⚠️ Please provide payment proof (screenshot) for cross-verification
                </p>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleContactSupport}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition"
              >
                Contact Support
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="text-center max-w-md">
          <div className="animate-spin w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-2">Processing Payment...</h2>
          <p className="text-gray-400">Please wait</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-text text-emerald-400">
            Checkout
          </h1>
          <p className="text-gray-400">Complete your payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <GlassCard>
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-white/10">
                    <div>
                      <div className="font-semibold">
                        {item.type === 'cookie' ? `${item.exchange} Cookie` : 'Card Load'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {item.type === 'cookie' 
                          ? `$${item.balance?.toLocaleString()} balance`
                          : `${item.cardName} - $${item.loadAmount?.toLocaleString()}`
                        }
                      </div>
                    </div>
                    <div className="font-semibold text-emerald-400">
                      ${item.price}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-4 text-xl font-bold">
                  <span>Total</span>
                  <span className="text-emerald-400">${total}</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="bg-blue-500/10 border-blue-500/30">
              <h3 className="font-bold mb-3 text-blue-400">📋 Payment Instructions</h3>
              <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                <li>Copy the Bitcoin wallet address below</li>
                <li>Send exactly <span className="text-emerald-400 font-semibold">${total}</span> worth of BTC</li>
                <li>Click "I Have Paid" button</li>
                <li>Contact Telegram support with payment proof</li>
              </ol>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard>
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Bitcoin className="text-orange-400" />
                <span>Bitcoin Payment</span>
              </h2>
              
              <div className="bg-white/5 rounded-lg p-6 mb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeCanvas
                      value={`bitcoin:${BTC_WALLET}?amount=${btcAmount}`}
                      size={200}
                      level="H"
                    />
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-400 mb-2">Send BTC to:</div>
                  <div className="bg-black/30 rounded-lg p-3 mb-3">
                    <code className="text-xs break-all text-emerald-400">
                      {BTC_WALLET}
                    </code>
                  </div>
                  <button
                    onClick={handleCopyWallet}
                    className="flex items-center space-x-2 mx-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition text-sm"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy Address'}</span>
                  </button>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Amount to Send</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    ${total} USD
                  </div>
                  {loadingPrice ? (
                    <div className="text-xs text-gray-500 mt-1">
                      Loading BTC price...
                    </div>
                  ) : (
                    <>
                      <div className="text-lg font-bold text-orange-400 mt-2">
                        {btcAmount} BTC
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        1 BTC = ${btcPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={handlePaid}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-lg transition"
              >
                I Have Paid
              </button>
            </GlassCard>

            <GlassCard className="bg-yellow-500/10 border-yellow-500/30">
              <h3 className="font-bold mb-2 text-yellow-400">⚠️ Important</h3>
              <p className="text-sm text-gray-300">
                Only Bitcoin (BTC) payments are accepted. Payments in other cryptocurrencies will not be processed.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
