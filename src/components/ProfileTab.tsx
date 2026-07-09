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
  RefreshCcw,
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
  const hasBillingIssue = subscription.status === 'grace_period' || subscription.status === 'billing_retry';
  const billingDate = formatBillingDate(subscription.currentPeriodEnd);

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
        <div className="flex justify-end gap-5 mb-2 relative z-10">
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
        {/* Premium Banner Section */}
        {isSubscribed ? (
          <div className={`bg-gradient-to-r ${
            hasBillingIssue
              ? 'from-red-950/35 to-amber-950/20 border-red-500/25'
              : isCancellationPending
                ? 'from-amber-950/40 to-amber-900/20 border-amber-500/25'
                : 'from-emerald-950/40 to-emerald-900/30 border-emerald-500/20'
          } border rounded-3xl p-5 relative overflow-hidden backdrop-blur-xl shadow-lg transition-transform active:scale-[0.99]`}>
            <button
              type="button"
              onClick={onOpenSubscription}
              aria-label="Open membership details"
              className="absolute inset-0 z-10 rounded-3xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-inset"
            />
            <div className="absolute right-[-10px] top-[-10px] opacity-10 pointer-events-none">
              <Crown size={110} className={`${hasBillingIssue ? 'text-red-400' : isCancellationPending ? 'text-amber-400' : 'text-emerald-400'} rotate-12`} />
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl ${hasBillingIssue ? 'bg-red-500/10 border-red-500/30 text-red-400' : isCancellationPending ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'} border flex items-center justify-center`}>
                <Crown size={20} className={hasBillingIssue ? 'fill-red-400 text-red-400' : isCancellationPending ? 'fill-amber-400 text-amber-400' : 'fill-emerald-400 text-emerald-400'} />
              </div>
              <div>
                <span className={`text-[10px] uppercase font-mono tracking-widest font-extrabold ${hasBillingIssue ? 'text-red-300' : isCancellationPending ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {hasBillingIssue ? 'Payment issue' : isCancellationPending ? 'Ending soon' : 'Active'}
                </span>
                <h3 className="text-slate-100 font-extrabold text-base leading-tight mt-0.5">{getPlanName(subscription.plan)}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              {hasBillingIssue
                ? 'Update your payment method to keep Premium active.'
                : isCancellationPending
                  ? `Premium stays available until ${billingDate}.`
                  : 'All premium routes are unlocked.'}
            </p>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
              <span className={`text-[10px] font-bold font-mono ${hasBillingIssue ? 'text-red-300' : isCancellationPending ? 'text-amber-400' : 'text-emerald-500'}`}>
                {hasBillingIssue ? 'Action needed' : isCancellationPending ? 'Access remains active' : 'Premium enabled'}
              </span>
              {isCancellationPending ? (
                <button 
                  onClick={onResumeSubscription}
                  className="relative z-20 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5"
                >
                  <RefreshCcw size={12} />
                  Restart membership
                </button>
              ) : hasBillingIssue ? (
                <button
                  onClick={onUpdatePaymentMethod}
                  className="relative z-20 text-red-200 hover:text-white text-xs font-semibold transition-colors bg-red-500/15 hover:bg-red-500/25 px-3 py-1.5 rounded-xl border border-red-500/20"
                >
                  Update payment
                </button>
              ) : (
                <button 
                  onClick={onOpenSubscription}
                  className="relative z-20 text-slate-300 hover:text-white text-xs font-semibold transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5"
                >
                  Membership
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 rounded-3xl p-5 relative overflow-hidden backdrop-blur-xl shadow-lg transition-transform active:scale-[0.99]">
            <button
              type="button"
              onClick={onOpenSubscription}
              aria-label="View MOVEVI Premium"
              className="absolute inset-0 z-10 rounded-3xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-inset"
            />
            <div className="absolute right-[-10px] top-[-15px] opacity-10 pointer-events-none">
              <Crown size={120} className="text-amber-400 rotate-12" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Crown size={20} className="fill-amber-400 text-amber-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold">Free plan</span>
                <h3 className="text-slate-100 font-extrabold text-base leading-tight mt-0.5">Unlock All 36+ Scenic Routes</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Subscribe to unlock every premium route.
            </p>
            <div className="mt-4 pt-2">
              <button 
                onClick={onOpenSubscription}
                className="relative z-20 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl tracking-wide shadow-[0_4px_15px_rgba(245,158,11,0.15)] flex items-center justify-center gap-1.5 transition-all"
              >
                <Crown size={14} className="fill-slate-950" />
                <span>View Premium</span>
              </button>
            </div>
          </div>
        )}

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
                      <p className="text-slate-400 mt-1">{getPlanPrice(subscription.plan)} · All premium city routes</p>
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
                      <p className="text-slate-100 font-bold mt-1">{subscription.paymentMethodLabel || 'Card on file'}</p>
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
                                : item.status === 'refunded'
                                  ? 'text-amber-300'
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
                    Like Netflix-style membership management, canceling stops your next renewal but Premium remains available until {billingDate}. There is no prorated refund in this demo.
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
