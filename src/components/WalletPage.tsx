import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  ReceiptText,
  ShieldCheck,
  WalletCards,
  X,
} from 'lucide-react';

interface WalletPageProps {
  userStats: {
    redPacketBalance?: number;
    checkInRewardHistory?: Array<{ day: number; amount: string; openedAt: string }>;
    medalLotteryDrawHistory?: Array<{ id: string; nickname: string; amount: string; createdAt: string }>;
  };
  onBack: () => void;
}

type WalletTab = 'earnings' | 'payouts';

const fallbackEarnings = [
  { id: 'sample-1', title: 'Run the World', detail: 'Route reward', date: 'Aug 23, 2026 12:15 AM', amount: 16.60 },
  { id: 'sample-2', title: 'Daily check-in', detail: 'Day 30 bonus', date: 'Aug 23, 2026 12:15 AM', amount: 2.66 },
  { id: 'sample-3', title: 'Daily check-in', detail: 'Day 21 bonus', date: 'Aug 23, 2026 12:15 AM', amount: 2.66 },
  { id: 'sample-4', title: 'Daily check-in', detail: 'Day 15 bonus', date: 'Aug 23, 2026 12:15 AM', amount: 2.66 },
  { id: 'sample-5', title: 'Daily check-in', detail: 'Route bonus', date: 'Aug 23, 2026 12:14 AM', amount: 0.06 },
  { id: 'sample-6', title: 'Daily check-in', detail: 'Route bonus', date: 'Aug 23, 2026 12:14 AM', amount: 0.06 },
];

const fallbackPayouts = [
  { id: 'payout-1', title: 'PayPal payout', detail: 'mia.liu@example.com', date: 'Aug 12, 2026 09:42 PM', amount: -24.00, status: 'Paid' },
  { id: 'payout-2', title: 'PayPal payout', detail: 'mia.liu@example.com', date: 'Jul 28, 2026 07:18 PM', amount: -18.50, status: 'Paid' },
  { id: 'payout-3', title: 'PayPal payout', detail: 'mia.liu@example.com', date: 'Jul 09, 2026 11:04 AM', amount: -12.00, status: 'Paid' },
];

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

const parseMoney = (value: string) => Number(value.replace(/[^0-9.]/g, '')) || 0;

const formatActivityDate = (value?: string) => {
  if (!value) return 'Today';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function WalletPage({ userStats, onBack }: WalletPageProps) {
  const [activeTab, setActiveTab] = useState<WalletTab>('earnings');
  const [showWithdrawSheet, setShowWithdrawSheet] = useState(false);
  const [toast, setToast] = useState('');

  const activityEarnings = useMemo(() => {
    const checkIn = (userStats.checkInRewardHistory || []).map((item, index) => ({
      id: `check-in-${item.day}-${index}`,
      title: 'Daily check-in',
      detail: `Day ${item.day} bonus`,
      date: formatActivityDate(item.openedAt),
      amount: parseMoney(item.amount),
    }));

    const medalDraw = (userStats.medalLotteryDrawHistory || []).map((item) => ({
      id: item.id,
      title: 'Prize draw',
      detail: item.nickname,
      date: formatActivityDate(item.createdAt),
      amount: parseMoney(item.amount),
    }));

    return [...checkIn, ...medalDraw];
  }, [userStats.checkInRewardHistory, userStats.medalLotteryDrawHistory]);

  const earnings = activityEarnings.length > 0 ? activityEarnings : fallbackEarnings;
  const earnedBalance = Number(userStats.redPacketBalance || 0);
  const availableBalance = earnedBalance > 0 ? earnedBalance : 28.94;
  const totalPaidOut = fallbackPayouts.reduce((total, item) => total + Math.abs(item.amount), 0) + 535.70;
  const visibleItems = activeTab === 'earnings' ? earnings : fallbackPayouts;

  const confirmWithdraw = () => {
    setShowWithdrawSheet(false);
    setToast('Withdrawal request sent to PayPal.');
    window.setTimeout(() => setToast(''), 2200);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#06101d] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(251,113,133,0.20),transparent_32%),radial-gradient(circle_at_90%_4%,rgba(251,191,36,0.20),transparent_34%),linear-gradient(180deg,#10223A_0%,#081322_42%,#050914_100%)]" />
      <div className="absolute inset-x-0 top-0 h-52 bg-[url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&q=70&w=900')] bg-cover bg-center opacity-[0.18] blur-sm" />

      <div className="relative z-10 flex h-full flex-col">
        <header className="shrink-0 px-5 pb-4 pt-5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition active:scale-95"
              aria-label="Back"
            >
              <ChevronLeft size={32} strokeWidth={2.7} />
            </button>
            <h1 className="text-lg font-black tracking-tight text-white">My Wallet</h1>
            <div className="w-10" />
          </div>
        </header>

        <main className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-8">
          <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#ff6c74] via-[#ff744c] to-[#ffa152] p-6 text-white shadow-[0_24px_54px_rgba(255,104,68,0.22)]">
            <div className="absolute -left-14 bottom-[-70px] h-52 w-52 rounded-full border-[34px] border-white/8" />
            <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/50 text-white/90">
              <CircleDollarSign size={25} />
            </div>

            <p className="text-sm font-black uppercase tracking-[0.14em] text-white/72">Available cash</p>
            <h2 className="mt-8 font-mono text-[52px] font-black leading-none tracking-[-0.06em] text-white">
              {formatMoney(availableBalance).replace('$', '')}
            </h2>

            <div className="mt-9 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white/70">Total paid out</p>
                <p className="mt-1 font-mono text-xl font-black text-white/90">{formatMoney(totalPaidOut)}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowWithdrawSheet(true)}
                className="h-12 rounded-full bg-white px-7 text-sm font-black text-[#ff4f60] shadow-[0_14px_28px_rgba(0,0,0,0.16)] active:scale-95"
              >
                Withdraw
              </button>
            </div>
          </section>

          <button
            type="button"
            onClick={() => setShowWithdrawSheet(true)}
            className="mt-4 flex h-[72px] w-full items-center justify-between rounded-[20px] border border-white/[0.07] bg-[#17263b]/90 px-4 text-left shadow-[0_14px_30px_rgba(0,0,0,0.22)] active:scale-[0.99]"
          >
            <span className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#003087] text-2xl font-black text-white shadow-[0_12px_28px_rgba(0,48,135,0.25)]">
                P
              </span>
              <span>
                <span className="block text-base font-black text-white">PayPal</span>
                <span className="mt-0.5 block text-xs font-semibold text-slate-400">mia.liu@example.com linked</span>
              </span>
            </span>
            <span className="flex items-center gap-2 text-sm font-bold text-slate-300">
              Manage
              <ChevronRight size={22} className="text-slate-500" />
            </span>
          </button>

          <section className="mt-4 overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#142238]/92 shadow-[0_16px_38px_rgba(0,0,0,0.24)]">
            <div className="flex items-center gap-7 px-5 pt-5">
              <button
                type="button"
                onClick={() => setActiveTab('earnings')}
                className={`relative pb-3 text-base font-black ${
                  activeTab === 'earnings' ? 'text-white' : 'text-slate-500'
                }`}
              >
                Rewards
                {activeTab === 'earnings' && <span className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-[#ff5366]" />}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('payouts')}
                className={`relative pb-3 text-base font-black ${
                  activeTab === 'payouts' ? 'text-white' : 'text-slate-500'
                }`}
              >
                Payouts
                {activeTab === 'payouts' && <span className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-[#ff5366]" />}
              </button>
            </div>

            <div className="px-5 pb-2">
              {visibleItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 border-b border-white/[0.055] py-5 last:border-b-0">
                  <div className="min-w-0">
                    <p className="truncate text-base font-black text-white">{item.title}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-500">{item.date}</p>
                    {'status' in item && (
                      <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-300">
                        <CheckCircle2 size={12} />
                        {item.status}
                      </p>
                    )}
                  </div>
                  <div className={`font-mono text-2xl font-black ${item.amount >= 0 ? 'text-[#ff4f60]' : 'text-slate-300'}`}>
                    {item.amount >= 0 ? '+' : '-'}{formatMoney(Math.abs(item.amount)).replace('$', '')}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-4 rounded-[22px] border border-cyan-300/12 bg-cyan-300/[0.045] p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-cyan-200" />
              <h3 className="text-sm font-black text-white">Payout review</h3>
            </div>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-400">
              Cash rewards are reviewed before payout. Most PayPal transfers arrive within 1-3 business days after approval.
            </p>
          </section>
        </main>
      </div>

      <AnimatePresence>
        {showWithdrawSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-end bg-black/65 p-4 backdrop-blur-sm"
            onClick={() => setShowWithdrawSheet(false)}
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              className="w-full rounded-[26px] border border-white/10 bg-[#0d1727] p-5 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">Cash payout</p>
                  <h2 className="mt-1 text-xl font-black text-white">Withdraw to PayPal</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWithdrawSheet(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <WalletCards size={18} className="text-amber-200" />
                  <p className="mt-3 text-[11px] font-bold text-slate-500">Available</p>
                  <p className="mt-1 font-mono text-xl font-black text-white">{formatMoney(availableBalance)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <Clock3 size={18} className="text-cyan-200" />
                  <p className="mt-3 text-[11px] font-bold text-slate-500">Timing</p>
                  <p className="mt-1 text-sm font-black text-white">1-3 business days</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003087] text-lg font-black text-white">P</span>
                    <div>
                      <p className="text-sm font-black text-white">PayPal</p>
                      <p className="text-xs font-semibold text-slate-500">mia.liu@example.com</p>
                    </div>
                  </div>
                  <ReceiptText size={20} className="text-slate-500" />
                </div>
              </div>

              <button
                type="button"
                onClick={confirmWithdraw}
                className="mt-5 h-12 w-full rounded-full bg-cyan-400 text-sm font-black text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,0.16)] active:scale-[0.98]"
              >
                Request payout
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-1/2 top-5 z-50 -translate-x-1/2 rounded-full border border-emerald-300/25 bg-emerald-500 px-4 py-2 text-xs font-black text-white shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
