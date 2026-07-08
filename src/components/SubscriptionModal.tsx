import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, Crown, ShieldCheck, CreditCard, 
  Sparkles, Lock, Landmark, 
  CheckCircle, AlertCircle, ChevronRight 
} from 'lucide-react';
import { SubscriptionPlan, getPlanName, getPlanPrice } from '../lib/subscription';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribeSuccess: (paymentMethodLabel: string, plan: SubscriptionPlan, mode: CheckoutMode) => void;
}

type PaymentMethod = 'card' | 'applepay';
type CheckoutMode = 'trial' | 'paid';

export default function SubscriptionModal({ isOpen, onClose, onSubscribeSuccess }: SubscriptionModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [step, setStep] = useState<'benefits' | 'checkout' | 'processing' | 'success'>('benefits');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('premium_monthly');
  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>('trial');
  
  // Card forms
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  // Form Errors
  const [errors, setErrors] = useState<{
    cardNumber?: string;
    expiry?: string;
    cvv?: string;
    cardName?: string;
  }>({});

  // Processing indicators
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = [
    'Opening secure checkout...',
    'Confirming payment method...',
    `Authorizing ${getPlanPrice(selectedPlan)}...`,
    `Creating your ${getPlanName(selectedPlan).toLowerCase()} membership...`,
    'Premium access is ready.'
  ];

  // Auto-format card number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add spaces every 4 digits
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    // Clear error
    if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: undefined }));
  };

  // Auto-format expiry date MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiry(value);
    if (errors.expiry) setErrors(prev => ({ ...prev, expiry: undefined }));
  };

  // Handle CVV
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(value);
    if (errors.cvv) setErrors(prev => ({ ...prev, cvv: undefined }));
  };

  // Card brand resolver based on first digit
  const getCardBrandName = () => {
    const cleanNum = cardNumber.replace(/\D/g, '');
    if (cleanNum.startsWith('4')) return 'Visa';
    if (cleanNum.startsWith('5')) return 'Mastercard';
    if (cleanNum.startsWith('3')) return 'Amex';
    if (cleanNum.startsWith('6')) return 'Discover';
    return 'Unknown';
  };

  const getPaymentMethodLabel = () => {
    if (paymentMethod === 'applepay') return 'Apple Pay / Google Pay';

    const cleanCard = cardNumber.replace(/\D/g, '');
    const last4 = cleanCard.slice(-4) || '4242';
    const brandName = getCardBrandName() === 'Unknown' ? 'Card' : getCardBrandName();
    return `${brandName} ending in ${last4}`;
  };

  // Validate form and start payment
  const handleStartCheckout = () => {
    if (paymentMethod !== 'card') {
      // Direct fast payments skip step details for mockup
      setStep('processing');
      return;
    }

    const newErrors: typeof errors = {};
    const cleanCard = cardNumber.replace(/\D/g, '');
    
    if (cleanCard.length < 16) {
      newErrors.cardNumber = 'Invalid card number (16 digits required)';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      newErrors.expiry = 'Use MM/YY format';
    } else {
      const parts = expiry.split('/');
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10);
      if (month < 1 || month > 12) {
        newErrors.expiry = 'Invalid month';
      }
    }
    
    if (cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }
    if (cardName.trim().length < 3) {
      newErrors.cardName = 'Enter full name';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Go to animated server processing phase
    setStep('processing');
  };

  // Fake processing flow with delays
  useEffect(() => {
    if (step === 'processing') {
      setLoadingStep(0);
      const timer1 = setTimeout(() => setLoadingStep(1), 800);
      const timer2 = setTimeout(() => setLoadingStep(2), 1700);
      const timer3 = setTimeout(() => setLoadingStep(3), 2600);
      const timer4 = setTimeout(() => setLoadingStep(4), 3400);
      const timer5 = setTimeout(() => {
        setStep('success');
        onSubscribeSuccess(getPaymentMethodLabel(), selectedPlan, checkoutMode);
      }, 4200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [step]);

  // Reset modal state on opening
  useEffect(() => {
    if (isOpen) {
      setStep('benefits');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setCardName('');
      setErrors({});
      setPaymentMethod('card');
      setSelectedPlan('premium_monthly');
      setCheckoutMode('trial');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] max-w-md mx-auto bg-black/85 backdrop-blur-md flex flex-col justify-end sm:rounded-[40px] sm:overflow-hidden overflow-hidden h-full">
      <div className="bg-[#090D14] border-t border-white/10 rounded-t-[32px] w-full max-h-[92%] flex flex-col relative overflow-hidden">
        
        {/* Glow behind modal */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header / Close */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            <Crown size={20} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <h3 className="text-base font-extrabold text-slate-100 tracking-wider">MOVEVI PREMIUM</h3>
          </div>
          {step !== 'processing' && step !== 'success' && (
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors"
            >
              <X size={16} className="text-slate-400" />
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 hide-scrollbar relative z-10">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: BENEFITS */}
            {step === 'benefits' && (
              <motion.div
                key="benefits"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_35px_rgba(245,158,11,0.3)] border border-amber-400/30">
                    <Crown size={32} className="text-slate-950 fill-slate-950" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-100 tracking-wide">Explore Without Boundaries</h2>
                  <p className="text-xs text-amber-400 mt-1 font-mono tracking-widest font-semibold uppercase">WORLD LIGHT PROJECT ACCESS</p>
                </div>

                {/* Premium Benefits Checklist */}
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-cyan-950 flex items-center justify-center shrink-0 border border-cyan-500/30 text-cyan-400 mt-0.5">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">Unlock All 36+ Urban Trails</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Run subsequent courses in Paris, Tokyo, London, Shanghai, and New York. No more lockouts.</p>
                    </div>
                  </div>
                </div>

                {/* Compare tiers */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 text-xs text-slate-400 space-y-2">
                  <div className="flex justify-between border-b border-white/5 pb-2 font-semibold text-slate-200">
                    <span>Feature Availability</span>
                    <span>Free Experience</span>
                    <span className="text-amber-400">Premium Explorer</span>
                  </div>
                  <div className="flex justify-between">
                    <span>First route of each city</span>
                    <span className="text-[#2ecc71] font-semibold">Free</span>
                    <span className="text-slate-100 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subsequent routes (Route 2+3)</span>
                    <span className="text-slate-600">Locked</span>
                    <span className="text-[#2ecc71] font-semibold">Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overseas City Expansion</span>
                    <span className="text-slate-600">Basic</span>
                    <span className="text-[#2ecc71] font-semibold">Full Access</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-slate-200">Membership plan</h4>
                    <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest">One simple price</span>
                  </div>
                  <div className="text-left p-4 rounded-xl border border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.12)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-100">{getPlanName(selectedPlan)}</span>
                      <Check size={14} className="text-amber-400 stroke-[3]" />
                    </div>
                    <div className="mt-2 text-lg font-black text-slate-100">$4.99</div>
                    <p className="text-[10px] text-slate-500 mt-1">Monthly Premium access</p>
                  </div>
                </div>

                {/* Subscription Action footer */}
                <div className="pt-2 text-center">
                  <div className="text-2xl font-black text-slate-100 flex items-center justify-center gap-2">
                    <span>{getPlanPrice(selectedPlan).split('/')[0]}</span>
                    <span className="text-sm font-normal text-slate-500">/month</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Renews monthly. Cancel anytime from Profile before your next billing date.</p>
                  
                  <button
                    onClick={() => {
                      setCheckoutMode('paid');
                      setStep('checkout');
                    }}
                    className="w-full mt-4 py-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl tracking-wide shadow-[0_0_25px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <span>Subscribe - $4.99/month</span>
                    <ChevronRight size={18} className="stroke-[3]" />
                  </button>
                  <button
                    onClick={() => {
                      setCheckoutMode('paid');
                      setStep('checkout');
                    }}
                    className="w-full mt-3 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold rounded-xl transition-all"
                  >
                    Subscribe now without trial
                  </button>
                  <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-slate-500 font-semibold">
                    <button className="hover:text-cyan-300 transition-colors">Restore Purchases</button>
                    <button className="hover:text-cyan-300 transition-colors">Terms</button>
                    <button className="hover:text-cyan-300 transition-colors">Privacy</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CHECKOUT DETAILS */}
            {step === 'checkout' && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Secure checkout</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your payment details for {getPlanName(selectedPlan)}. {checkoutMode === 'trial' ? `Your first charge is after the trial: ${getPlanPrice(selectedPlan)}.` : `You will be charged ${getPlanPrice(selectedPlan)} today.`}
                  </p>
                </div>

                {/* Global Payment Methods Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 border rounded-xl flex items-center gap-2.5 transition-all text-xs font-bold ${paymentMethod === 'card' ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-slate-300'}`}
                  >
                    <CreditCard size={16} />
                    <span>Credit Card</span>
                    <span className="ml-auto text-[8px] uppercase tracking-widest text-amber-400">Default</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('applepay')}
                    className={`p-3.5 border rounded-xl flex items-center gap-2.5 transition-all text-xs font-bold ${paymentMethod === 'applepay' ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-slate-300'}`}
                  >
                    <Landmark size={16} />
                    <span>Apple / Google Pay</span>
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                    
                    {/* Card type helper */}
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>SECURE CREDIT CARD FORM</span>
                      {cardNumber && (
                        <div className="text-cyan-400 font-mono font-bold bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded">
                          {getCardBrandName()} detected
                        </div>
                      )}
                    </div>

                    {/* Card Name */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 tracking-wider">CARDHOLDER NAME</label>
                      <input 
                        type="text" 
                        value={cardName}
                        onChange={(e) => {
                          setCardName(e.target.value);
                          if (errors.cardName) setErrors(prev => ({ ...prev, cardName: undefined }));
                        }}
                        placeholder="John Doe"
                        className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                      {errors.cardName && (
                        <div className="flex items-center gap-1 text-[11px] text-red-400 mt-0.5 font-medium">
                          <AlertCircle size={10} />
                          <span>{errors.cardName}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Number */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 tracking-wider">CARD NUMBER</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4000 1234 5678 9010"
                          className="w-full bg-[#05070a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-slate-100 placeholder:text-slate-600 tracking-widest focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                        <CreditCard size={16} className="absolute left-3.5 top-[15px] text-slate-500" />
                      </div>
                      {errors.cardNumber && (
                        <div className="flex items-center gap-1 text-[11px] text-red-400 mt-0.5 font-medium font-sans">
                          <AlertCircle size={10} />
                          <span>{errors.cardNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-300 tracking-wider">EXPIRY DATE</label>
                        <input 
                          type="text" 
                          value={expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-slate-100 placeholder:text-slate-600 text-center tracking-widest focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                        {errors.expiry && (
                          <div className="flex items-center gap-1 text-[11px] text-red-400 mt-0.5 font-medium">
                            <AlertCircle size={10} />
                            <span>{errors.expiry}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-300 tracking-wider">CVV / CVC</label>
                        <input 
                          type="password" 
                          value={cvv}
                          onChange={handleCvvChange}
                          placeholder="123"
                          className="w-full bg-[#05070a] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-100 placeholder:text-slate-600 text-center tracking-widest focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                        {errors.cvv && (
                          <div className="flex items-center gap-1 text-[11px] text-red-400 mt-0.5 font-medium">
                            <AlertCircle size={10} />
                            <span>{errors.cvv}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pt-2 text-[11px] text-slate-400">
                      <Lock size={12} className="text-cyan-400" />
                      <span>Demo checkout modeled after Stripe. No real card will be charged.</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950/40 p-6 rounded-2xl border border-white/5 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 text-slate-300">
                      <Sparkles size={24} className="text-cyan-400 animate-pulse" />
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      One-tap wallets let you confirm the monthly subscription with your saved payment method.
                    </p>
                    <div className="text-xs font-bold text-cyan-400 bg-cyan-950/40 py-2.5 rounded-xl border border-cyan-500/10">
                      Ready for wallet confirmation
                    </div>
                  </div>
                )}

                {/* Cost declaration */}
                <div className="flex justify-between items-center px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs">
                  <span className="text-slate-400 font-medium">{checkoutMode === 'trial' ? 'Due today, then after trial:' : 'Due today:'}</span>
                  <span className="text-slate-100 font-bold">{checkoutMode === 'trial' ? `$0.00, then ${getPlanPrice(selectedPlan)}` : getPlanPrice(selectedPlan)}</span>
                </div>

                {/* Back / Pay Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('benefits')}
                    className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold rounded-xl transition-all"
                  >
                    Back to Benefits
                  </button>
                  <button
                    onClick={handleStartCheckout}
                    className="flex-[2] py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black rounded-xl tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  >
                    {paymentMethod === 'card'
                      ? checkoutMode === 'trial'
                        ? 'Start trial with card'
                        : `Subscribe with card - ${getPlanPrice(selectedPlan)}`
                      : checkoutMode === 'trial'
                        ? 'Confirm wallet trial'
                        : `Confirm wallet - ${getPlanPrice(selectedPlan)}`}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: TRANSACTION PROCESSING */}
            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center text-center space-y-6"
              >
                {/* 3D spinning coin or loader */}
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck size={32} className="text-cyan-400 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-200">Starting your subscription</h3>
                  <p className="text-xs text-slate-500">Confirming payment and activating Premium access...</p>
                </div>

                {/* Realtime logs */}
                <div className="w-full bg-[#05070a] p-4 rounded-xl border border-white/5 max-h-[160px] overflow-y-auto text-left">
                  <div className="space-y-2.5">
                    {loadingSteps.map((log, index) => {
                      const isLogged = index <= loadingStep;
                      const isCurrent = index === loadingStep;
                      return (
                        <div 
                          key={index} 
                          className={`text-[11px] font-mono flex items-center gap-2 transition-opacity duration-300 ${isLogged ? 'opacity-100' : 'opacity-20'}`}
                        >
                          {isLogged && (
                            <span className={isCurrent ? 'text-cyan-400 animate-pulse font-bold' : 'text-emerald-500 font-bold'}>
                              {isCurrent ? '▶' : '✔'}
                            </span>
                          )}
                          <span className={isCurrent ? 'text-cyan-400 font-medium' : isLogged ? 'text-slate-400' : 'text-slate-600'}>
                            {log}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 flex flex-col items-center text-center space-y-6"
              >
                {/* Celebration Check */}
                <motion.div 
                  initial={{ rotate: -15, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] border border-emerald-300/30"
                >
                  <CheckCircle size={44} className="text-slate-950 fill-white border-none" />
                </motion.div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-100 tracking-wide">
                    {checkoutMode === 'trial' ? 'Premium trial started' : 'Premium is active'}
                  </h3>
                  <p className="text-xs text-emerald-400 font-medium font-mono">
                    {checkoutMode === 'trial' ? `7 days free, then ${getPlanPrice(selectedPlan)}` : `Renews at ${getPlanPrice(selectedPlan)}`}
                  </p>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 text-xs text-slate-400 leading-relaxed text-left space-y-2 w-full">
                  <p className="font-semibold text-slate-200">Your membership is ready:</p>
                  <ul className="space-y-1.5 list-disc pl-4">
                    <li>All premium city routes are unlocked.</li>
                    <li>You can manage, cancel, or restart membership from Profile.</li>
                    <li>Canceling stops renewal while keeping access until the current period ends.</li>
                  </ul>
                </div>

                <div className="pt-2 w-full">
                  <button
                    onClick={onClose}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black rounded-xl tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-shadow active:scale-98"
                  >
                    Begin Your Premium Exploration
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
