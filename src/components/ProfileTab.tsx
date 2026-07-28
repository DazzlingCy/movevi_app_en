import { useState } from 'react';
import {
  Settings,
  ChevronRight,
  Mail,
  SquarePen,
  Medal,
  Map as MapIcon,
  MonitorSmartphone,
  Wallet,
  HeadphonesIcon,
  FileText,
  BookOpen,
  ClipboardList,
  Crown,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  SubscriptionState,
  formatBillingDate,
  getPlanName,
  getPlanPrice,
} from '../lib/subscription';

interface UserStats {
  completedCities: number;
  completedRoutes: number;
  totalDistance: number;
  totalTimeHours: number;
}

interface ProfileTabProps {
  userStats: UserStats;
  isSubscribed: boolean;
  subscription: SubscriptionState;
  onOpenSubscription: () => void;
  onCancelSubscription: () => void;
  onResumeSubscription: () => void;
  onUpdatePaymentMethod: () => void;
}

export default function ProfileTab({
  userStats,
  isSubscribed,
  subscription,
  onOpenSubscription,
  onCancelSubscription,
  onResumeSubscription,
  onUpdatePaymentMethod,
}: ProfileTabProps) {
  const [showManageModal, setShowManageModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const isCancellationPending = isSubscribed && subscription.status === 'canceled_at_period_end';
  const isGracePeriod = subscription.status === 'grace_period';
  const isBillingRetry = subscription.status === 'billing_retry';
  const isExpired = subscription.status === 'expired';
  const hasBillingIssue = isGracePeriod || isBillingRetry;
  const isInactiveMembership = isExpired;
  const billingDate = formatBillingDate(subscription.currentPeriodEnd);
  const membershipAccentClass = isSubscribed ? 'text-emerald-400' : 'text-slate-500';
  const membershipButtonClass = isSubscribed
    ? 'border-emerald-400/35 bg-emerald-500/12 text-emerald-300 shadow-[0_0_22px_rgba(52,211,153,0.16)]'
    : 'border-slate-500/30 bg-slate-500/10 text-slate-400';
  const membershipDotClass = isSubscribed ? 'bg-emerald-300' : 'bg-slate-500';
  const membershipLabel = isBillingRetry
    ? 'Premium paused'
    : isGracePeriod
      ? 'Payment issue'
      : isExpired
        ? 'Membership ended'
        : isCancellationPending
          ? 'Ending soon'
          : isSubscribed
            ? 'Active'
            : 'Free plan';

  const stats = [
    { label: 'Cities Completed', value: userStats.completedCities.toString() },
    { label: 'Routes Completed', value: userStats.completedRoutes.toString() },
    { label: 'Distance', value: userStats.totalDistance.toFixed(1), unit: 'km' },
    { label: 'Active Time', value: userStats.totalTimeHours.toFixed(1), unit: 'h' },
  ];

  const menuItems = [
    { icon: ClipboardList, label: 'Workout Records' },
    { icon: MonitorSmartphone, label: 'My Devices' },
    { icon: Wallet, label: 'My Wallet' },
    { icon: HeadphonesIcon, label: 'Customer Support' },
    { icon: FileText, label: 'Feedback' },
    { icon: BookOpen, label: 'User Instructions' },
    { icon: Settings, label: 'Settings' },
  ];

  const confirmCancelSubscription = () => {
    onCancelSubscription();
    setShowCancelConfirm(false);
    setShowManageModal(false);
  };

  return (
    <div className="w-full h-full bg-[#05070A] overflow-y-auto pb-24 text-slate-100 font-sans hide-scrollbar relative">
      {/* Header Profile Info */}
      <div className="relative pt-12 pb-10 px-6 bg-gradient-to-b from-cyan-900/20 via-cyan-900/5 to-transparent">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none blur-3xl" />
        
        {/* Top bar with icons */}
        <div className="flex justify-end gap-4 mb-2 relative z-10">
          <button
            type="button"
            onClick={onOpenSubscription}
            title={membershipLabel}
            aria-label={`Membership status: ${membershipLabel}. Open membership page.`}
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl border backdrop-blur-xl transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${membershipButtonClass}`}
          >
            <Crown size={18} className={`${membershipAccentClass} fill-current`} />
            <span className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-[#05070A] ${membershipDotClass}`} />
          </button>
          <button className="text-slate-300 hover:text-cyan-400 transition-colors">
            <Mail size={22} />
          </button>
          <button className="text-slate-300 hover:text-cyan-400 transition-colors">
            <SquarePen size={22} />
          </button>
        </div>

        <div className="flex flex-col items-start gap-4 relative z-10 border-b border-white/5 pb-5">
          <div className="flex items-center gap-4 w-full">
            <div className="w-20 h-20 rounded-full border-2 border-cyan-400/50 p-1 relative shadow-[0_0_20px_rgba(34,211,238,0.2)] bg-[#05070A] shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200" 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-xl font-bold text-slate-100 tracking-wide mb-2">Chenyuan</h1>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-amber-950 text-xs font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                  LV.3
                </span>
                <span className="text-amber-400 text-sm font-semibold tracking-widest drop-shadow-[0_0_5px_rgba(251,191,36,0.4)]">
                  Gold
                </span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="w-full flex items-center justify-between mt-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-2xl font-bold text-slate-100 font-mono tracking-wider relative">
                  {stat.value}
                  {stat.unit && <span className="text-sm text-slate-400 ml-0.5 relative -top-1">{stat.unit}</span>}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4 -mt-6 relative z-20">
        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-4 relative overflow-hidden backdrop-blur-xl shadow-lg cursor-pointer"
          >
            <div className="absolute right-[-10px] top-[-10px] opacity-20 pointer-events-none">
              <Medal size={80} className="text-amber-500" />
            </div>
            <div className="text-amber-400 mb-1">
              <Medal size={28} className="drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            </div>
            <h3 className="text-slate-100 font-bold mb-1 mt-3">My Badges</h3>
            <p className="text-[10px] text-amber-200/60 break-words whitespace-pre-wrap">A full harvest of honors & achievements</p>
          </motion.div>

          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-2xl p-4 relative overflow-hidden backdrop-blur-xl shadow-lg cursor-pointer"
          >
            <div className="absolute right-[-10px] top-[-10px] opacity-20 pointer-events-none">
              <MapIcon size={80} className="text-cyan-500" />
            </div>
            <div className="text-cyan-400 mb-1">
              <MapIcon size={28} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            </div>
            <h3 className="text-slate-100 font-bold mb-1 mt-3">City Cards</h3>
            <p className="text-[10px] text-cyan-200/60 break-words whitespace-pre-wrap">Serendipitous stories across the town</p>
          </motion.div>
        </div>

        {/* Menu Items */}
        <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={idx}
                whileTap={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                className={`w-full flex items-center justify-between p-5 transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={20} className="text-slate-400" />
                  <span className="text-slate-200 font-medium tracking-wide text-sm">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-slate-600" />
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showManageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] max-w-md mx-auto bg-black/75 backdrop-blur-sm flex items-end sm:rounded-[40px] sm:overflow-hidden"
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              className="w-full bg-[#090D14] border-t border-white/10 rounded-t-[28px] p-6 shadow-2xl max-h-[88vh] overflow-y-auto hide-scrollbar"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-black font-mono">Membership & Billing</span>
                  <h3 className="text-lg font-black text-slate-100 mt-1">Manage MOVEVI Premium</h3>
                </div>
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setShowManageModal(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10"
                >
                  <X size={16} className="text-slate-400" />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs text-slate-300">
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Current plan</span>
                      <h4 className="text-base font-black text-slate-100 mt-1">{getPlanName(subscription.plan)}</h4>
                      <p className="text-slate-400 mt-1">{getPlanPrice(subscription.plan)} · All global routes</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      isCancellationPending
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        : hasBillingIssue
                          ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    }`}>
                      {isCancellationPending ? 'Ending' : hasBillingIssue ? 'Payment issue' : 'Active'}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="bg-black/20 border border-white/5 rounded-xl p-3">
                      <span className="block text-slate-500">Billing date</span>
                      <strong className="block text-slate-100 mt-1">{billingDate}</strong>
                    </div>
                    <div className="bg-black/20 border border-white/5 rounded-xl p-3">
                      <span className="block text-slate-500">Managed by</span>
                      <strong className="block text-slate-100 mt-1">
                        {subscription.provider === 'mock_netflix' ? 'MOVEVI Account' : subscription.provider}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Payment method</span>
                      <p className="text-slate-100 font-bold mt-1">{subscription.paymentMethodLabel || 'Apple / Google Pay'}</p>
                    </div>
                    <button
                      onClick={onUpdatePaymentMethod}
                      className="px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 text-[11px] font-black transition-colors"
                    >
                      Update
                    </button>
                  </div>
                  {hasBillingIssue && (
                    <p className="mt-3 text-red-300 leading-relaxed">
                      {subscription.billingIssueMessage || 'We could not renew your membership. Update payment to keep Premium active.'}
                    </p>
                  )}
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Billing history</span>
                    <span className="text-slate-500">Latest</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {(subscription.billingHistory.length > 0
                      ? subscription.billingHistory.slice(0, 3)
                      : [{ id: 'upcoming', date: subscription.currentPeriodEnd || new Date().toISOString(), description: getPlanName(subscription.plan), amount: getPlanPrice(subscription.plan), status: 'upcoming' as const }]
                    ).map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 border-t border-white/5 pt-2 first:border-t-0 first:pt-0">
                        <div>
                          <p className="text-slate-200 font-semibold">{item.description}</p>
                          <p className="text-slate-500 text-[10px]">{formatBillingDate(item.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-100 font-bold">{item.amount}</p>
                          <p className={`text-[10px] uppercase font-black ${
                            item.status === 'failed'
                              ? 'text-red-300'
                              : item.status === 'upcoming'
                                ? 'text-cyan-300'
                                : 'text-emerald-300'
                          }`}>
                            {item.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Cancellation policy</span>
                  <p className="mt-2 leading-relaxed text-slate-400">
                    Canceling stops your next renewal. Premium remains available until {billingDate}.
                  </p>
                </div>
              </div>

              {showCancelConfirm && (
                <div className="mt-5 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                  <h4 className="text-sm font-black text-red-100">Cancel membership?</h4>
                  <p className="text-xs text-red-200/80 mt-2 leading-relaxed">
                    Your Premium routes stay unlocked until {billingDate}. After that, your account returns to the free plan unless you restart membership.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold rounded-xl transition-all"
                    >
                      Keep Premium
                    </button>
                    <button
                      onClick={confirmCancelSubscription}
                      className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-100 text-xs font-black rounded-xl transition-all"
                    >
                      Confirm cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setShowManageModal(false);
                  }}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold rounded-xl transition-all"
                >
                  Done
                </button>
                <button
                  onClick={onUpdatePaymentMethod}
                  className="flex-1 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 text-xs font-bold rounded-xl transition-all"
                >
                  Update payment
                </button>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={isCancellationPending}
                  className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 disabled:bg-white/5 disabled:text-slate-600 border border-red-500/20 disabled:border-white/5 text-red-300 text-xs font-bold rounded-xl transition-all"
                >
                  {isCancellationPending ? 'Canceled' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
