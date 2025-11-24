
import React, { useState } from 'react';
import { Transaction, User } from '../types';
import { ArrowDownLeft, ArrowUpRight, CreditCard, History, Lock, CheckCircle, X, Coins } from 'lucide-react';
import { useLanguage } from '../services/i18n';

interface WalletProps {
  credits: number;
  transactions: Transaction[];
  onAddCredits: (amount: number) => void;
  userSettings: Partial<User>;
}

// Currency Conversion Rates (Base USD)
const CURRENCY_RATES: Record<string, { rate: number, symbol: string, code: string }> = {
    'Morocco': { rate: 10, symbol: 'dh', code: 'MAD' },
    'USA': { rate: 1, symbol: '$', code: 'USD' },
    'France': { rate: 0.92, symbol: '€', code: 'EUR' },
    'Saudi Arabia': { rate: 3.75, symbol: 'SAR', code: 'SAR' },
    'UAE': { rate: 3.67, symbol: 'AED', code: 'AED' },
    'Egypt': { rate: 48, symbol: 'EGP', code: 'EGP' },
    'UK': { rate: 0.79, symbol: '£', code: 'GBP' },
    'Germany': { rate: 0.92, symbol: '€', code: 'EUR' },
    'Spain': { rate: 0.92, symbol: '€', code: 'EUR' },
    // Default fallback
    'Worldwide': { rate: 1, symbol: '$', code: 'USD' }
};

const Wallet: React.FC<WalletProps> = ({ credits, transactions, onAddCredits, userSettings }) => {
  const { t } = useLanguage();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{amt: number, price: string, rawPrice: number} | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Determine currency based on user settings
  const userCountry = userSettings.country || 'USA';
  const currency = CURRENCY_RATES[userCountry] || CURRENCY_RATES['USA'];

  // Base Packages in USD
  const basePackages = [
    { amt: 100, basePrice: 4.99 },
    { amt: 500, basePrice: 19.99, popular: true },
    { amt: 1200, basePrice: 39.99 }
  ];

  const packages = basePackages.map(pkg => {
      const localPrice = (pkg.basePrice * currency.rate).toFixed(2);
      return {
          ...pkg,
          price: `${currency.symbol === '$' ? '$' : ''}${localPrice} ${currency.symbol !== '$' ? currency.symbol : ''}`,
          rawPrice: pkg.basePrice 
      };
  });

  const handleBuyClick = (pkg: {amt: number, price: string, rawPrice: number}) => {
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    if (!selectedPackage) return;
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      onAddCredits(selectedPackage.amt);
      setIsProcessing(false);
      setShowPaymentModal(false);
      setSelectedPackage(null);
    }, 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative">
      <h1 className="text-2xl font-bold text-slate-900">{t('wallet.title')}</h1>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 ltr:right-0 rtl:left-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <p className="text-slate-400 font-medium mb-2">{t('wallet.balance')}</p>
                <h2 className="text-5xl font-bold tracking-tight flex items-center gap-2">
                    <Coins className="w-10 h-10 text-yellow-500 fill-yellow-500" />
                    {credits} 
                    <span className="text-2xl text-slate-500 font-normal">{t('wallet.credits')}</span>
                </h2>
            </div>
            <div className="flex flex-col items-end">
               <div className="bg-white/10 px-3 py-1 rounded-lg text-xs font-bold text-slate-300 mb-2">
                    {t('wallet.billing')}: {userCountry} ({currency.code})
               </div>
            </div>
        </div>
      </div>

      {/* Packages */}
      <div>
        <h3 className="font-bold text-slate-800 mb-4 text-lg">{t('wallet.buy_title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.map((pkg) => (
                <button 
                    key={pkg.amt}
                    onClick={() => handleBuyClick(pkg)}
                    className={`relative p-6 rounded-2xl border transition-all hover:scale-[1.02] text-start ${
                        pkg.popular 
                        ? 'border-yellow-500 bg-yellow-50/50 ring-1 ring-yellow-500' 
                        : 'border-slate-200 bg-white hover:border-yellow-300'
                    }`}
                >
                    {pkg.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                            {t('wallet.best_value')}
                        </span>
                    )}
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                         <Coins className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                         {pkg.amt} {t('wallet.credits')}
                    </h3>
                    <p className="text-slate-500 font-medium">{pkg.price}</p>
                    <div className="mt-4 flex items-center text-yellow-600 text-sm font-bold">
                        {t('wallet.buy_now')} <ArrowUpRight className="w-4 h-4 ltr:ml-1 rtl:mr-1" />
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center">
            <History className="w-5 h-5 text-slate-400 ltr:mr-2 rtl:ml-2" />
            <h3 className="font-bold text-slate-900">{t('wallet.history')}</h3>
        </div>
        <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
            {transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                            tx.type === 'earn' ? 'bg-green-100 text-green-600' : 
                            tx.type === 'purchase' ? 'bg-blue-100 text-blue-600' : 
                            'bg-slate-100 text-slate-600'
                        }`}>
                            {tx.type === 'earn' ? <ArrowUpRight className="w-4 h-4" /> : 
                             tx.type === 'purchase' ? <CreditCard className="w-4 h-4" /> :
                             <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{tx.description}</p>
                            <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <span className={`font-bold flex items-center gap-1 ${
                        tx.type === 'spend' ? 'text-slate-900' : 'text-green-600'
                    }`}>
                        {tx.type === 'spend' ? '-' : '+'}{tx.amount} <Coins className="w-3 h-3" />
                    </span>
                </div>
            ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-slate-900 p-6 text-white flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold">{t('wallet.pay_modal')}</h3>
                        <p className="text-slate-400 text-sm flex items-center gap-1">
                            {selectedPackage.amt} <Coins className="w-3 h-3" /> for {selectedPackage.price}
                        </p>
                    </div>
                    <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">{t('wallet.pay_method')}</label>
                        <div className="grid grid-cols-3 gap-3">
                             <button 
                                onClick={() => setPaymentMethod('card')}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'}`}
                             >
                                <CreditCard className="w-6 h-6 mb-1" />
                                <span className="text-[10px] font-bold">Visa/MC</span>
                             </button>
                             <button 
                                onClick={() => setPaymentMethod('cmi')}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${paymentMethod === 'cmi' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'}`}
                             >
                                <div className="w-6 h-6 mb-1 font-bold text-xs border-2 border-current rounded flex items-center justify-center">CMI</div>
                                <span className="text-[10px] font-bold">CMI</span>
                             </button>
                             <button 
                                onClick={() => setPaymentMethod('paypal')}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'}`}
                             >
                                <div className="w-6 h-6 mb-1 text-blue-600 font-serif italic font-bold text-lg leading-none">P</div>
                                <span className="text-[10px] font-bold">PayPal</span>
                             </button>
                        </div>
                    </div>

                    {/* Payment Form / Details */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {paymentMethod === 'card' && (
                            <div className="space-y-3">
                                <input type="text" placeholder="Card Number" className="w-full px-3 py-2 border rounded-lg text-sm" />
                                <div className="flex gap-3">
                                    <input type="text" placeholder="MM/YY" className="w-1/2 px-3 py-2 border rounded-lg text-sm" />
                                    <input type="text" placeholder="CVC" className="w-1/2 px-3 py-2 border rounded-lg text-sm" />
                                </div>
                            </div>
                        )}
                         {paymentMethod === 'cmi' && (
                            <div className="text-center py-4 space-y-2">
                                <p className="text-sm text-slate-600">You will be redirected to the CMI secure gateway.</p>
                                <div className="flex justify-center gap-2 opacity-50">
                                     <div className="h-4 w-8 bg-slate-300 rounded"></div>
                                     <div className="h-4 w-8 bg-slate-300 rounded"></div>
                                </div>
                            </div>
                        )}
                        {paymentMethod === 'paypal' && (
                            <div className="text-center py-4">
                                <p className="text-sm text-slate-600">You will be redirected to PayPal to complete your purchase.</p>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={confirmPayment}
                        disabled={isProcessing}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 flex items-center justify-center transition-all"
                    >
                        {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Lock className="w-4 h-4 ltr:mr-2 rtl:ml-2" /> {t('wallet.pay_btn')} {selectedPackage.price}
                            </>
                        )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        <CheckCircle className="w-3 h-3" /> {t('wallet.pay_secure')}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
