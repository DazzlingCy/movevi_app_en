export type SubscriptionStatus =
  | 'free'
  | 'trialing'
  | 'active'
  | 'canceled_at_period_end'
  | 'grace_period'
  | 'billing_retry'
  | 'expired';
export type LegacySubscriptionStatus = SubscriptionStatus | 'canceled' | 'refunded';
export type SubscriptionPlan = 'premium_monthly';
export type SubscriptionProvider = 'mock_netflix' | 'mock_stripe' | 'app_store' | 'google_play' | 'stripe';

export interface BillingHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: 'paid' | 'upcoming' | 'failed';
}

export interface SubscriptionState {
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  hasUsedIntroOffer: boolean;
  provider: SubscriptionProvider;
  paymentMethodLabel: string | null;
  startedAt: string | null;
  trialEndsAt: string | null;
  billingIssueMessage: string | null;
  billingHistory: BillingHistoryItem[];
}

const SUBSCRIPTION_STORAGE_KEY = 'movevi_subscription_state';
const LEGACY_SUBSCRIPTION_STORAGE_KEY = 'movevi_is_subscribed';
const subscriptionStatuses: SubscriptionStatus[] = [
  'free',
  'trialing',
  'active',
  'canceled_at_period_end',
  'grace_period',
  'billing_retry',
  'expired',
];

const defaultSubscription: SubscriptionState = {
  status: 'free',
  plan: 'premium_monthly',
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  hasUsedIntroOffer: false,
  provider: 'mock_netflix',
  paymentMethodLabel: null,
  startedAt: null,
  trialEndsAt: null,
  billingIssueMessage: null,
  billingHistory: [],
};

const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const getPlanPeriodDays = (_plan: SubscriptionPlan) => 30;

export const getPlanName = (_plan: SubscriptionPlan) => 'Premium Monthly';

export const getPlanPrice = (_plan: SubscriptionPlan) => '$4.99/month';

export const getPlanMonthlyAmount = (_plan: SubscriptionPlan) => '$4.99';

export const getIntroOfferPrice = (_plan: SubscriptionPlan) => '$0.99';

export const getNextBillingDate = (plan: SubscriptionPlan = 'premium_monthly') => addDays(getPlanPeriodDays(plan));

const createBillingItem = (
  description: string,
  amount: string,
  status: BillingHistoryItem['status'] = 'paid',
  date = new Date().toISOString(),
): BillingHistoryItem => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  date,
  description,
  amount,
  status,
});

export const createActiveSubscription = (
  paymentMethodLabel: string,
  plan: SubscriptionPlan = 'premium_monthly',
  useIntroOffer = false,
): SubscriptionState => ({
  status: 'active',
  plan,
  currentPeriodEnd: getNextBillingDate(plan),
  cancelAtPeriodEnd: false,
  hasUsedIntroOffer: true,
  provider: 'mock_netflix',
  paymentMethodLabel,
  startedAt: new Date().toISOString(),
  trialEndsAt: null,
  billingIssueMessage: null,
  billingHistory: [
    createBillingItem(
      useIntroOffer ? `${getPlanName(plan)} - First month` : getPlanName(plan),
      useIntroOffer ? getIntroOfferPrice(plan) : getPlanPrice(plan),
    ),
  ],
});

export const createFreeSubscription = (): SubscriptionState => ({ ...defaultSubscription });

export const hasPremiumAccess = (subscription: SubscriptionState, now = Date.now()) => {
  if (
    subscription.status !== 'active' &&
    subscription.status !== 'canceled_at_period_end' &&
    subscription.status !== 'grace_period'
  ) {
    return false;
  }
  if (!subscription.currentPeriodEnd) return false;
  return new Date(subscription.currentPeriodEnd).getTime() > now;
};

export const resumeSubscription = (subscription: SubscriptionState): SubscriptionState => ({
  ...subscription,
  status: 'active',
  cancelAtPeriodEnd: false,
  billingIssueMessage: null,
});

export const markSubscriptionForCancellation = (subscription: SubscriptionState): SubscriptionState => ({
  ...subscription,
  status: 'canceled_at_period_end',
  cancelAtPeriodEnd: true,
  billingIssueMessage: null,
});

export const createBillingRetrySubscription = (subscription: SubscriptionState): SubscriptionState => ({
  ...subscription,
  status: 'grace_period',
  cancelAtPeriodEnd: false,
  billingIssueMessage: 'We could not renew your membership. Update your payment method to keep Premium active.',
  billingHistory: [
    createBillingItem(getPlanName(subscription.plan), getPlanPrice(subscription.plan), 'failed'),
    ...subscription.billingHistory,
  ],
});

export const updatePaymentMethod = (subscription: SubscriptionState, paymentMethodLabel: string): SubscriptionState => ({
  ...subscription,
  status: 'active',
  cancelAtPeriodEnd: false,
  paymentMethodLabel,
  billingIssueMessage: null,
});

type StoredSubscriptionState = Partial<Omit<SubscriptionState, 'status'>> & {
  status?: LegacySubscriptionStatus;
};

export const normalizeSubscription = (subscription: StoredSubscriptionState | null): SubscriptionState => {
  if (!subscription || typeof subscription !== 'object') return createFreeSubscription();
  const rawStatus = subscription.status === 'canceled'
    ? 'canceled_at_period_end'
    : subscription.status === 'refunded'
      ? 'expired'
      : subscription.status || 'free';
  const status = subscriptionStatuses.includes(rawStatus as SubscriptionStatus)
    ? (rawStatus as SubscriptionStatus)
    : 'free';

  const normalized: SubscriptionState = {
    status,
    plan: 'premium_monthly',
    currentPeriodEnd: subscription.currentPeriodEnd || null,
    cancelAtPeriodEnd: Boolean(subscription.cancelAtPeriodEnd),
    hasUsedIntroOffer: Boolean(
      subscription.hasUsedIntroOffer ||
      subscription.startedAt ||
      (Array.isArray(subscription.billingHistory) && subscription.billingHistory.length > 0)
    ),
    provider: subscription.provider || 'mock_netflix',
    paymentMethodLabel: subscription.paymentMethodLabel || null,
    startedAt: subscription.startedAt || null,
    trialEndsAt: subscription.trialEndsAt || null,
    billingIssueMessage: subscription.billingIssueMessage || null,
    billingHistory: Array.isArray(subscription.billingHistory) ? subscription.billingHistory : [],
  };

  if (
    (normalized.status === 'trialing' ||
      normalized.status === 'active' ||
      normalized.status === 'canceled_at_period_end' ||
      normalized.status === 'grace_period' ||
      normalized.status === 'billing_retry') &&
    normalized.currentPeriodEnd &&
    new Date(normalized.currentPeriodEnd).getTime() <= Date.now()
  ) {
    return {
      ...normalized,
      status: 'expired',
      cancelAtPeriodEnd: false,
      billingIssueMessage: null,
    };
  }

  if (normalized.status === 'free' || normalized.status === 'expired') {
    return {
      ...normalized,
      cancelAtPeriodEnd: false,
      billingIssueMessage: null,
    };
  }

  return normalized;
};

export const saveSubscriptionState = (subscription: SubscriptionState) => {
  localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(normalizeSubscription(subscription)));
};

export const readSubscriptionState = (): SubscriptionState => {
  try {
    const storedSubscription = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    if (storedSubscription) {
      const normalized = normalizeSubscription(JSON.parse(storedSubscription));
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(normalized));
      localStorage.removeItem(LEGACY_SUBSCRIPTION_STORAGE_KEY);
      return normalized;
    }

    const legacySubscription = localStorage.getItem(LEGACY_SUBSCRIPTION_STORAGE_KEY);
    if (legacySubscription === 'true') {
      const migrated = createActiveSubscription('Legacy subscription');
      saveSubscriptionState(migrated);
      localStorage.removeItem(LEGACY_SUBSCRIPTION_STORAGE_KEY);
      return migrated;
    }

    localStorage.removeItem(LEGACY_SUBSCRIPTION_STORAGE_KEY);
  } catch {
    localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
    localStorage.removeItem(LEGACY_SUBSCRIPTION_STORAGE_KEY);
  }

  const freeSubscription = createFreeSubscription();
  saveSubscriptionState(freeSubscription);
  return freeSubscription;
};

export const resetSubscriptionState = (): SubscriptionState => {
  const freeSubscription = createFreeSubscription();
  localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(freeSubscription));
  localStorage.removeItem(LEGACY_SUBSCRIPTION_STORAGE_KEY);
  return freeSubscription;
};

export const formatBillingDate = (isoDate: string | null) => {
  if (!isoDate) return 'Not scheduled';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(isoDate));
};

export const getSubscriptionStatusLabel = (subscription: SubscriptionState) => {
  switch (subscription.status) {
    case 'trialing':
      return `Renews ${formatBillingDate(subscription.currentPeriodEnd)}`;
    case 'active':
      return `Renews ${formatBillingDate(subscription.currentPeriodEnd)}`;
    case 'canceled_at_period_end':
      return `Ends ${formatBillingDate(subscription.currentPeriodEnd)}`;
    case 'grace_period':
      return `Payment issue - access until ${formatBillingDate(subscription.currentPeriodEnd)}`;
    case 'billing_retry':
      return 'Payment update needed';
    case 'expired':
      return 'Membership ended';
    default:
      return 'Free plan';
  }
};
