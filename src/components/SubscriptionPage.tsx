import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  ChevronLeft,
  CreditCard,
  Crown,
  Lock,
  RefreshCcw,
  Wallet,
} from 'lucide-react';
import {
  SubscriptionPlan,
  SubscriptionState,
  formatBillingDate,
  getIntroOfferPrice,
  getPlanMonthlyAmount,
  getPlanName,
  getPlanPrice,
  getSubscriptionStatusLabel,
} from '../lib/subscription';

interface SubscriptionPageProps {
  subscription: SubscriptionState;
  isSubscribed: boolean;
  onBack: () => void;
  onSubscribe: (paymentMethodLabel: string, plan: SubscriptionPlan, mode: 'trial' | 'paid') => void;
  onCancelSubscription: () => void;
  onResumeSubscription: () => void;
  onUpdatePaymentMethod: (paymentMethodLabel?: string) => void;
}

type PaymentMethod = 'card' | 'wallet';
type ViewMode = 'overview' | 'checkout';
type PaymentErrors = {
  cardName?: string;
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
  wallet?: string;
};

const plan: SubscriptionPlan = 'premium_monthly';

const benefits = [
  'All global routes',
  'New route drops included',
  'Cancel anytime before renewal',
];

const cleanDigits = (value: string) => value.replace(/\D/g, '');

const formatCardNumber = (value: string) =>
  cleanDigits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

const formatExpiry = (value: string) => {
  const digits = cleanDigits(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const passesLuhnCheck = (value: string) => {
  let sum = 0;
  let shouldDouble = false;

  for (let index = value.length - 1; index >= 0; index -= 1) {
    let digit = Number(value[index]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

const getCardBrand = (cardNumber: string) => {
  const value = cleanDigits(cardNumber);
  if (value.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(value) || /^2[2-7]/.test(value)) return 'Mastercard';
  if (/^3[47]/.test(value)) return 'Amex';
  if (value.startsWith('6')) return 'Discover';
  return 'Card';
};

const isExpiryValid = (expiry: string) => {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return false;
  const [monthText, yearText] = expiry.split('/');
  const month = Number(monthText);
  const year = 2000 + Number(yearText);
  return new Date(year, month, 0, 23, 59, 59, 999).getTime() >= Date.now();
};

export default function SubscriptionPage({
  subscription,
  isSubscribed,
  onBack,
  onSubscribe,
  onCancelSubscription,
  onResumeSubscription,
  onUpdatePaymentMethod,
}: SubscriptionPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [walletVerified, setWalletVerified] = useState(false);
  const [errors, setErrors] = useState<PaymentErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const isCancellationPending = subscription.status === 'canceled_at_period_end' && isSubscribed;
  const isGracePeriod = subscription.status === 'grace_period';
  const isBillingRetry = subscription.status === 'billing_retry';
  const hasBillingIssue = isGracePeriod || isBillingRetry;
  const isEnded = subscription.status === 'expired';
  const isInactiveAfterHistory = isEnded;
  const isPaymentUpdate = isSubscribed || hasBillingIssue;
  const billingDate = formatBillingDate(subscription.currentPeriodEnd);
  const planName = getPlanName(plan);
  const planPrice = getPlanPrice(plan);
  const monthlyAmount = getPlanMonthlyAmount(plan);
  const introOfferPrice = getIntroOfferPrice(plan);
  const isIntroOfferEligible = !subscription.hasUsedIntroOffer && !isPaymentUpdate;
  const checkoutAmount = isIntroOfferEligible ? introOfferPrice : monthlyAmount;
  const checkoutPriceLabel = isIntroOfferEligible ? `${introOfferPrice} first month` : planPrice;
  const statusLabel = getSubscriptionStatusLabel(subscription);
  const shouldShowStatusBadge = subscription.status !== 'free';
  const visibleStatusLabel = statusLabel;
  const heroHeadline = isGracePeriod
    ? 'Update payment to keep Premium.'
    : isBillingRetry
      ? 'Update payment to restart Premium.'
      : isCancellationPending
        ? 'Premium ends soon.'
        : isEnded
          ? 'Restart Premium.'
          : isSubscribed
            ? 'Premium is active.'
            : 'Unlock all global routes.';
  const heroDescription = isGracePeriod
    ? 'Your payment needs attention. Premium stays available during the grace period.'
    : isBillingRetry
      ? 'Premium is paused until you update your payment method.'
      : isCancellationPending
        ? `Premium remains available until ${billingDate}.`
        : isEnded
          ? 'Your previous membership has ended. Subscribe again to unlock all global routes.'
          : isSubscribed
            ? 'All global routes are unlocked while your membership is active.'
            : isIntroOfferEligible
              ? `Start for ${introOfferPrice} today, then ${planPrice}. Cancel before renewal anytime.`
              : `Get every global route for ${planPrice}. Cancel before renewal anytime.`;
  const statusClassName = hasBillingIssue
    ? 'border-red-500/30 bg-red-500/10 text-red-200'
    : isCancellationPending
      ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
      : isSubscribed
        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
        : isInactiveAfterHistory
          ? 'border-slate-500/30 bg-slate-500/10 text-slate-200'
          : 'border-slate-500/30 bg-slate-500/10 text-slate-300';

  const paymentMethodLabel = useMemo(() => {
    if (paymentMethod === 'wallet') return 'Apple Pay / Google Pay';
    const digits = cleanDigits(cardNumber);
    return `${getCardBrand(cardNumber)} ending in ${digits.slice(-4) || '4242'}`;
  }, [cardNumber, paymentMethod]);

  const checkoutActionLabel = useMemo(() => {
    if (isProcessing) return processingStep || 'Processing...';
    if (isSubscribed || hasBillingIssue) return 'Save payment method';
    return paymentMethod === 'wallet' ? 'Pay with wallet' : 'Pay with card';
  }, [hasBillingIssue, isProcessing, isSubscribed, paymentMethod, processingStep]);

  const validatePayment = () => {
    const nextErrors: PaymentErrors = {};

    if (paymentMethod === 'wallet') {
      if (!walletVerified) nextErrors.wallet = 'Verify your wallet first.';
    } else {
      const digits = cleanDigits(cardNumber);
      if (cardName.trim().length < 2) nextErrors.cardName = 'Enter the cardholder name.';
      if (digits.length < 13 || digits.length > 16 || !passesLuhnCheck(digits)) nextErrors.cardNumber = 'Enter a valid card number.';
      if (!isExpiryValid(expiry)) nextErrors.expiry = 'Use a valid future date.';
      if (!/^\d{3,4}$/.test(cvc)) nextErrors.cvc = 'Enter a valid security code.';
    }

    return nextErrors;
  };

  const completeCheckout = () => {
    const validationErrors = validatePayment();
    setErrors(validationErrors);
    setLastAction(null);
    if (Object.keys(validationErrors).length > 0) return;

    setIsProcessing(true);
    setProcessingStep(paymentMethod === 'wallet' ? 'Opening wallet...' : 'Checking card...');
    window.setTimeout(() => setProcessingStep(paymentMethod === 'wallet' ? 'Confirming wallet...' : `Authorizing ${checkoutAmount}...`), 700);
    window.setTimeout(() => setProcessingStep('Activating Premium...'), 1400);
    window.setTimeout(() => {
      if (isSubscribed || hasBillingIssue) {
        onUpdatePaymentMethod(paymentMethodLabel);
        setLastAction('Payment method updated.');
      } else {
        onSubscribe(paymentMethodLabel, plan, 'paid');
        setLastAction('Premium is active. All global routes are unlocked.');
      }

      setIsProcessing(false);
      setProcessingStep('');
      setViewMode('overview');
    }, 2200);
  };

  const startCheckout = () => {
    setErrors({});
    setLastAction(null);
    setShowCancelConfirm(false);
    setViewMode('checkout');
  };

  return (
    <div className="relative w-full h-full bg-[#05070A] text-slate-100 font-sans overflow-y-auto hide-scrollbar pb-10">
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-[#05070A]/95 px-4 py-4 backdrop-blur-2xl">
        <button
          onClick={viewMode === 'checkout' ? () => setViewMode('overview') : onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
          aria-label="Back"
        >
          <ChevronLeft size={22} className="text-slate-200" />
        </button>
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Membership</span>
          <h1 className="text-lg font-black leading-tight text-slate-100">
            {viewMode === 'checkout' ? 'Checkout' : 'MOVEVI Premium'}
          </h1>
        </div>
      </div>

      {viewMode === 'overview' ? (
        <div className="px-5 py-6 space-y-5">
          <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-amber-950/20 p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {shouldShowStatusBadge && (
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${
                    statusClassName
                  }`}>
                    {hasBillingIssue && <AlertCircle size={12} />}
                    {visibleStatusLabel}
                  </span>
                )}
                <h2 className="mt-4 text-3xl font-black tracking-tight text-white">{heroHeadline}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {heroDescription}
                </p>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-[0_0_28px_rgba(251,191,36,0.35)]">
                <Crown size={30} className="fill-slate-950" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-amber-400/60 bg-amber-500/10 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-100">{planName}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {isIntroOfferEligible ? `First month ${introOfferPrice}, then ${planPrice}.` : 'One monthly plan. All global routes.'}
                </p>
              </div>
              <div className="text-right">
                <strong className="block text-xl font-black text-white">{isIntroOfferEligible ? introOfferPrice : monthlyAmount}</strong>
                <span className="text-xs text-slate-500">{isIntroOfferEligible ? 'first month' : '/month'}</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <h3 className="text-sm font-black text-slate-100">Included</h3>
            <div className="mt-3 space-y-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/15 text-emerald-300">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">{benefit}</p>
                </div>
              ))}
            </div>
          </section>

          {(isSubscribed || hasBillingIssue) && (
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <h3 className="text-sm font-black text-slate-100">Your membership</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                  <span className="block text-slate-500">{isCancellationPending ? 'Ends' : isBillingRetry ? 'Last period' : 'Renewal'}</span>
                  <strong className="mt-1 block text-slate-100">{billingDate}</strong>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                  <span className="block text-slate-500">Payment</span>
                  <strong className="mt-1 block text-slate-100">{subscription.paymentMethodLabel || 'Card on file'}</strong>
                </div>
              </div>
            </section>
          )}

          {lastAction && (
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs leading-relaxed text-cyan-200">
              {lastAction}
            </div>
          )}

          <section className="space-y-3">
            {isCancellationPending ? (
              <button
                onClick={() => {
                  onResumeSubscription();
                  setLastAction('Membership restarted. Your renewal is active again.');
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 py-4 text-sm font-black text-slate-950 transition-colors hover:bg-emerald-400"
              >
                <RefreshCcw size={17} />
                Restart membership
              </button>
            ) : (
              <button
                onClick={startCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 py-4 text-sm font-black text-slate-950 transition-colors hover:bg-amber-300"
              >
                <Lock size={17} />
                {hasBillingIssue ? 'Update payment method' : isSubscribed ? 'Manage payment' : `Subscribe for ${checkoutPriceLabel}`}
              </button>
            )}

            {isSubscribed && !isCancellationPending && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 text-xs font-bold text-slate-400 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200"
              >
                Cancel membership
              </button>
            )}

          </section>
        </div>
      ) : (
        <div className="px-5 py-6 space-y-5">
          <section className="rounded-[24px] border border-white/10 bg-[#0B1018] p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Order summary</span>
                <h2 className="mt-1 text-lg font-black text-slate-100">{isPaymentUpdate ? 'Update payment' : planName}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {isPaymentUpdate
                    ? 'No charge today in this demo.'
                    : isIntroOfferEligible
                      ? `First month ${introOfferPrice}, then ${planPrice} until canceled.`
                      : 'Billed today, then monthly until canceled.'}
                </p>
              </div>
              <div className="text-right">
                <strong className="block text-xl font-black text-white">{isPaymentUpdate ? '$0.00' : checkoutAmount}</strong>
                <span className="text-xs text-slate-500">USD</span>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-white/10 bg-[#0B1018] p-4">
            <h3 className="text-sm font-black text-slate-100">Payment method</h3>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('card');
                  setWalletVerified(false);
                  setErrors({});
                }}
                className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-amber-400 bg-amber-500/10 text-amber-100'
                    : 'border-white/10 bg-white/5 text-slate-300'
                }`}
              >
                <CreditCard size={16} />
                <span className="mt-2 block text-xs font-black">Credit Card</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('wallet');
                  setErrors({});
                }}
                className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                  paymentMethod === 'wallet'
                    ? 'border-amber-400 bg-amber-500/10 text-amber-100'
                    : 'border-white/10 bg-white/5 text-slate-300'
                }`}
              >
                <Wallet size={16} />
                <span className="mt-2 block text-xs font-black">Apple / Google Pay</span>
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Secure card form</span>
                  {cleanDigits(cardNumber).length > 0 && (
                    <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-cyan-300">
                      {getCardBrand(cardNumber)}
                    </span>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">Name on card</label>
                  <input
                    value={cardName}
                    onChange={(event) => {
                      setCardName(event.target.value);
                      setErrors((previous) => ({ ...previous, cardName: undefined }));
                    }}
                    className="w-full rounded-xl border border-white/10 bg-[#05070A] px-3 py-3 text-sm text-slate-100 outline-none focus:border-amber-400"
                    placeholder="Alex Chen"
                  />
                  {errors.cardName && <p className="mt-1.5 text-[11px] text-red-300">{errors.cardName}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">Card number</label>
                  <input
                    value={cardNumber}
                    onChange={(event) => {
                      setCardNumber(formatCardNumber(event.target.value));
                      setErrors((previous) => ({ ...previous, cardNumber: undefined }));
                    }}
                    inputMode="numeric"
                    className="w-full rounded-xl border border-white/10 bg-[#05070A] px-3 py-3 text-sm text-slate-100 outline-none focus:border-amber-400"
                    placeholder="4242 4242 4242 4242"
                  />
                  {errors.cardNumber && <p className="mt-1.5 text-[11px] text-red-300">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">Expiry</label>
                    <input
                      value={expiry}
                      onChange={(event) => {
                        setExpiry(formatExpiry(event.target.value));
                        setErrors((previous) => ({ ...previous, expiry: undefined }));
                      }}
                      inputMode="numeric"
                      className="w-full rounded-xl border border-white/10 bg-[#05070A] px-3 py-3 text-sm text-slate-100 outline-none focus:border-amber-400"
                      placeholder="MM/YY"
                    />
                    {errors.expiry && <p className="mt-1.5 text-[11px] text-red-300">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500">CVC</label>
                    <input
                      value={cvc}
                      onChange={(event) => {
                        setCvc(cleanDigits(event.target.value).slice(0, 4));
                        setErrors((previous) => ({ ...previous, cvc: undefined }));
                      }}
                      inputMode="numeric"
                      className="w-full rounded-xl border border-white/10 bg-[#05070A] px-3 py-3 text-sm text-slate-100 outline-none focus:border-amber-400"
                      placeholder="123"
                    />
                    {errors.cvc && <p className="mt-1.5 text-[11px] text-red-300">{errors.cvc}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-5 text-center">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border ${
                  walletVerified
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                    : 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300'
                }`}>
                  {walletVerified ? <Check size={24} className="stroke-[3]" /> : <Wallet size={24} />}
                </div>
                <h3 className="mt-4 text-sm font-black text-slate-100">
                  {walletVerified ? 'Wallet verified' : 'Verify wallet'}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {walletVerified
                    ? 'Your wallet is ready for authorization.'
                    : 'Confirm with Face ID, Touch ID, passcode, or Android screen lock.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setWalletVerified(true);
                    setErrors((previous) => ({ ...previous, wallet: undefined }));
                  }}
                  className={`mt-4 w-full rounded-xl border px-4 py-3 text-xs font-black transition-colors ${
                    walletVerified
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                      : 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
                  }`}
                >
                  {walletVerified ? 'Ready to pay' : 'Verify wallet'}
                </button>
                {errors.wallet && <p className="mt-2 text-[11px] text-red-300">{errors.wallet}</p>}
              </div>
            )}

          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs">
              <span className="text-slate-400">{isPaymentUpdate ? 'Charge today' : 'Due today'}</span>
              <strong className="text-slate-100">{isPaymentUpdate ? '$0.00 USD' : `${checkoutAmount} USD`}</strong>
            </div>

            <button
              onClick={completeCheckout}
              disabled={isProcessing}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 py-4 text-sm font-black text-slate-950 transition-colors hover:bg-amber-300 disabled:bg-white/5 disabled:text-slate-500"
            >
              {isProcessing ? (
                <span className="h-4 w-4 rounded-full border-2 border-slate-950/25 border-t-slate-950 animate-spin" />
              ) : (
                <Lock size={17} />
              )}
              {checkoutActionLabel}
            </button>
          </section>
        </div>
      )}

      {showCancelConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-premium-title"
            className="w-full max-w-sm rounded-[28px] border border-red-500/25 bg-[#16070B] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.48)]"
          >
            <h3 id="cancel-premium-title" className="text-lg font-black text-red-50">
              Cancel Premium?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-red-50/70">
              Premium stays active until {billingDate}. You will not be charged again.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-black text-slate-100 transition-colors hover:bg-white/10"
              >
                Keep Premium
              </button>
              <button
                onClick={() => {
                  onCancelSubscription();
                  setShowCancelConfirm(false);
                  setLastAction('Premium will end after the current billing period.');
                }}
                className="rounded-2xl border border-red-500/35 bg-red-500/20 py-3.5 text-sm font-black text-red-50 transition-colors hover:bg-red-500/30"
              >
                Confirm cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
