import { useState } from 'react';
import {
  AlertCircle,
  Apple,
  Check,
  ChevronLeft,
  Crown,
  CreditCard,
  Lock,
  RefreshCcw,
  X,
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

type WalletProvider = 'apple' | 'google';

const plan: SubscriptionPlan = 'premium_monthly';

const benefits = [
  'Unlock every global route',
  'New route drops included',
  'Cancel anytime before the next renewal',
];

export default function SubscriptionPage({
  subscription,
  isSubscribed,
  onBack,
  onSubscribe,
  onCancelSubscription,
  onResumeSubscription,
  onUpdatePaymentMethod,
}: SubscriptionPageProps) {
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [walletProvider, setWalletProvider] = useState<WalletProvider>(() => (
    typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent) ? 'google' : 'apple'
  ));
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [showSystemSubscriptionManager, setShowSystemSubscriptionManager] = useState(false);
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
              ? `Start for ${introOfferPrice} today, then ${planPrice}. Cancel anytime before the next renewal.`
              : `Get every global route for ${planPrice}. Cancel anytime before the next renewal.`;
  const statusClassName = hasBillingIssue
    ? 'border-red-500/30 bg-red-500/10 text-red-200'
    : isCancellationPending
      ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
      : isSubscribed
        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
        : isInactiveAfterHistory
          ? 'border-slate-500/30 bg-slate-500/10 text-slate-200'
          : 'border-slate-500/30 bg-slate-500/10 text-slate-300';

  const paymentMethodLabel = walletProvider === 'apple' ? 'Apple Pay' : 'Google Pay';
  const paymentSheetTitle = walletProvider === 'apple' ? 'Apple Pay' : 'Google Pay';
  const paymentSheetDomain = walletProvider === 'apple' ? 'apple.com' : 'pay.google.com';
  const paymentSheetConfirmLabel = walletProvider === 'apple' ? 'Confirm with Face ID' : 'Confirm payment';
  const systemProvider: WalletProvider = subscription.provider === 'google_play' ||
    subscription.paymentMethodLabel?.toLowerCase().includes('google')
    ? 'google'
    : 'apple';
  const systemManagerTitle = systemProvider === 'apple' ? 'Subscriptions' : 'Subscriptions';
  const systemManagerLabel = systemProvider === 'apple' ? 'Apple Account' : 'Google Play';
  const systemManagerDomain = systemProvider === 'apple' ? 'apps.apple.com' : 'play.google.com';
  const systemCancelLabel = systemProvider === 'apple' ? 'Cancel Subscription' : 'Cancel subscription';

  const completeWalletPayment = () => {
    setLastAction(null);

    setIsProcessing(true);
    setProcessingStep(`Opening ${paymentSheetTitle}...`);
    window.setTimeout(() => setProcessingStep('Confirming payment...'), 700);
    window.setTimeout(() => setProcessingStep('Activating Premium...'), 1400);
    window.setTimeout(() => {
      if (isSubscribed || hasBillingIssue) {
        onUpdatePaymentMethod(paymentMethodLabel);
        setLastAction('Payment method updated.');
      } else {
        onSubscribe(paymentMethodLabel, plan, 'paid');
        setLastAction(
          isIntroOfferEligible
            ? `Premium is active. Your first month is ${introOfferPrice}; after that it renews at ${planPrice}.`
            : 'Premium is active. All global routes are unlocked.'
        );
      }

      setIsProcessing(false);
      setProcessingStep('');
      setShowPaymentSheet(false);
    }, 2200);
  };

  const openPaymentSheet = () => {
    setLastAction(null);
    setShowCancelConfirm(false);
    setShowSystemSubscriptionManager(false);
    setShowPaymentSheet(true);
  };

  const openSystemSubscriptionManager = () => {
    setLastAction(null);
    setShowPaymentSheet(false);
    setShowCancelConfirm(false);
    setShowSystemSubscriptionManager(true);
  };

  return (
    <div className="relative w-full h-full bg-[#05070A] text-slate-100 font-sans overflow-y-auto hide-scrollbar pb-10">
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-[#05070A]/95 px-4 py-4 backdrop-blur-2xl">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
          aria-label="Back"
        >
          <ChevronLeft size={22} className="text-slate-200" />
        </button>
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Membership</span>
          <h1 className="text-lg font-black leading-tight text-slate-100">
            MOVEVI Premium
          </h1>
        </div>
      </div>

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
                  {isIntroOfferEligible ? `First month ${introOfferPrice}, then ${planPrice}.` : 'One monthly plan. Unlock every global route.'}
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
                  <strong className="mt-1 block text-slate-100">{subscription.paymentMethodLabel || 'Apple / Google Pay'}</strong>
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
                onClick={hasBillingIssue || !isSubscribed ? openPaymentSheet : openSystemSubscriptionManager}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 py-4 text-sm font-black text-slate-950 transition-colors hover:bg-amber-300"
              >
                <Lock size={17} />
                {hasBillingIssue ? 'Update payment method' : isSubscribed ? 'Manage subscription' : `Subscribe for ${checkoutPriceLabel}`}
              </button>
            )}

          </section>
        </div>

      {showPaymentSheet && (
        <div className="absolute inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-payment-title"
            className="w-full rounded-t-[32px] bg-[#F7F8FA] px-5 pb-6 pt-5 text-slate-950 shadow-[0_-24px_70px_rgba(0,0,0,0.45)]"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300" />
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentSheet(false)}
                disabled={isProcessing}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
                aria-label="Close payment sheet"
              >
                <X size={22} />
              </button>
              <div className="text-center">
                <p className="text-[11px] font-bold text-slate-500">{paymentSheetDomain}</p>
                <h2 id="wallet-payment-title" className="text-lg font-black">{paymentSheetTitle}</h2>
              </div>
              <div className="h-11 w-11" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setWalletProvider('apple')}
                disabled={isProcessing}
                className={`flex items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-black transition ${
                  walletProvider === 'apple'
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <Apple size={18} className="fill-current" />
                Apple Pay
              </button>
              <button
                type="button"
                onClick={() => setWalletProvider('google')}
                disabled={isProcessing}
                className={`flex items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-black transition ${
                  walletProvider === 'google'
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[13px] font-black text-[#4285F4]">G</span>
                Google Pay
              </button>
            </div>

            <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500">MOVEVI Premium</p>
                  <h3 className="mt-1 text-xl font-black">{isPaymentUpdate ? 'Update payment method' : planName}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {isPaymentUpdate
                      ? 'No charge today.'
                      : isIntroOfferEligible
                        ? `First month ${introOfferPrice}, then ${planPrice}.`
                        : `Renews monthly at ${planPrice}.`}
                  </p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
                  <Crown size={24} className="fill-current" />
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{isPaymentUpdate ? 'Charge today' : 'Due today'}</span>
                  <strong>{isPaymentUpdate ? '$0.00 USD' : `${checkoutAmount} USD`}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Renews</span>
                  <strong>{planPrice}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Payment</span>
                  <strong>{paymentSheetTitle}</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={completeWalletPayment}
              disabled={isProcessing}
              className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-slate-950 text-base font-black text-white transition hover:bg-black disabled:bg-slate-300"
            >
              {isProcessing ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : walletProvider === 'apple' ? (
                <Apple size={20} className="fill-current" />
              ) : (
                <CreditCard size={20} />
              )}
              {isProcessing ? processingStep || 'Processing...' : paymentSheetConfirmLabel}
            </button>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-500">
              This is a demo payment sheet. No real charge will be made.
            </p>
          </div>
        </div>
      )}

      {showSystemSubscriptionManager && (
        <div className="absolute inset-0 z-50 flex flex-col overflow-y-auto bg-[#F4F5F7] text-slate-950">
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-[#F4F5F7]/95 px-4 pb-4 pt-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowSystemSubscriptionManager(false);
                  setShowCancelConfirm(false);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"
                aria-label="Back to MOVEVI"
              >
                <ChevronLeft size={22} />
              </button>
              <div className="text-center">
                <p className="text-[11px] font-semibold text-slate-500">{systemManagerDomain}</p>
                <h2 className="text-lg font-black">{systemManagerTitle}</h2>
              </div>
              <div className="h-10 w-10" />
            </div>
          </div>

          <div className="px-5 py-5">
            <div className="mb-4 rounded-2xl bg-white px-4 py-3 text-center text-xs font-semibold text-slate-500 shadow-sm">
              Simulated {systemManagerLabel} subscription management
            </div>

            <section className="rounded-[28px] bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-amber-400 text-slate-950">
                  <Crown size={32} className="fill-current" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black">MOVEVI Premium</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{planName}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Unlock every global route. Managed by {systemManagerLabel}.
                  </p>
                </div>
              </div>

              <div className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-slate-500">Price</span>
                  <strong className="text-sm">{planPrice}</strong>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-slate-500">Renewal date</span>
                  <strong className="text-sm">{billingDate}</strong>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-slate-500">Payment method</span>
                  <strong className="text-sm">{subscription.paymentMethodLabel || systemManagerLabel}</strong>
                </div>
              </div>
            </section>

            <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm">
              <h3 className="text-sm font-black">What happens when you cancel</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                MOVEVI Premium stays active until {billingDate}. You will not be charged again after that date.
              </p>
            </section>

            <button
              type="button"
              onClick={() => setShowCancelConfirm(true)}
              className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-white text-sm font-black text-red-600 shadow-sm transition active:scale-[0.99]"
            >
              {systemCancelLabel}
            </button>
          </div>

          {showCancelConfirm && (
            <div className="absolute inset-0 z-20 flex items-end bg-black/35 px-4 pb-4 backdrop-blur-sm">
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="system-cancel-title"
                className="w-full rounded-[28px] bg-white p-5 text-slate-950 shadow-2xl"
              >
                <h3 id="system-cancel-title" className="text-xl font-black">
                  Confirm cancellation?
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Your Premium access remains available until {billingDate}. After that, your membership will end.
                </p>
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      onCancelSubscription();
                      setShowCancelConfirm(false);
                      setShowSystemSubscriptionManager(false);
                      setLastAction(`Subscription canceled in ${systemManagerLabel}. Premium remains active until ${billingDate}.`);
                    }}
                    className="flex h-14 w-full items-center justify-center rounded-2xl bg-red-600 text-sm font-black text-white"
                  >
                    Confirm cancellation
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex h-14 w-full items-center justify-center rounded-2xl bg-slate-100 text-sm font-black text-slate-800"
                  >
                    Not now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
