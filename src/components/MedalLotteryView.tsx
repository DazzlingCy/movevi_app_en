import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Info,
  Medal,
  Route,
  Sparkles,
  Ticket,
  Trophy,
  Wallet
} from 'lucide-react';

interface MedalLotteryViewProps {
  tickets: number;
  onBack: () => void;
  onGoRun: () => void;
  onDraw: () => { success: boolean; message: string; amount?: string };
}

const rewardItems = [
  { level: 'Grand Prize', amount: '$2.66', count: '50 prizes', tone: 'from-amber-200 to-orange-300' },
  { level: 'Second Prize', amount: '$1.66', count: '50 prizes', tone: 'from-indigo-200 to-violet-300' },
  { level: 'Third Prize', amount: '6 bonus minutes', count: '50 prizes', tone: 'from-cyan-200 to-sky-300' },
  { level: 'Fourth Prize', amount: '$2.66', count: '50 prizes', tone: 'from-rose-200 to-orange-300' },
  { level: 'Fifth Prize', amount: '$1.66', count: '50 prizes', tone: 'from-lime-200 to-emerald-300' },
  { level: 'Sixth Prize', amount: '6 bonus minutes', count: '50 prizes', tone: 'from-fuchsia-200 to-pink-300' }
];

const stepItems = [
  { label: 'Complete a Route', title: 'Earn a medal when you finish a route.', action: 'Go Run', icon: Route },
  { label: 'Get a Draw Ticket', title: 'Exchange your medals for a draw ticket.', action: 'Exchange Medals', icon: Ticket },
  { label: 'Draw a Prize', title: 'Use one ticket for a chance to win.', action: 'Draw Now', icon: Gift },
  { label: 'Cash Out', title: 'Transfer eligible cash rewards to your linked PayPal account.', action: 'Open Wallet', icon: Wallet }
];

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/[0.09] bg-[#0d1118]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] ${className}`}>
      {children}
    </section>
  );
}

function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: string }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8f9bff]">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-black tracking-tight text-white">{title}</h2>
      </div>
      {action && (
        <button className="flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold text-slate-300">
          {action}
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

export default function MedalLotteryView({ tickets, onBack, onGoRun, onDraw }: MedalLotteryViewProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const remainingPool = 999;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const handleStepAction = (index: number) => {
    if (index === 0) {
      onGoRun();
      return;
    }
    if (index === 1) return;
    if (index === 2) {
      const response = onDraw();
      if (response.success && response.amount) {
        setResult(response.amount);
      }
      showToast(response.message);
      return;
    }
    showToast('Open Wallet to cash out through PayPal.');
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#030407] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_-4%,rgba(255,138,48,0.24),transparent_30%),radial-gradient(circle_at_78%_0%,rgba(83,58,253,0.30),transparent_34%),radial-gradient(circle_at_50%_20%,rgba(255,214,96,0.16),transparent_28%),linear-gradient(180deg,#050711_0%,#030407_52%,#05070a_100%)]" />
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.26)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.26)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <div className="relative z-10 flex h-full flex-col">
        <header className="shrink-0 px-4 pb-3 pt-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-slate-200 backdrop-blur-md active:scale-95"
            >
              <ChevronLeft size={22} />
            </button>
            <div className="text-center">
              <p className="text-[10px] font-black tracking-[0.25em] text-slate-500">MEDAL DRAW</p>
              <h1 className="text-xl font-black tracking-tight text-white">Medal Prize Draw</h1>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-slate-300 backdrop-blur-md">
              <Info size={18} />
            </button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 hide-scrollbar">
          <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1018]/80 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_50%_18%,rgba(255,185,70,0.38),transparent_35%),linear-gradient(90deg,rgba(255,118,42,0.18),rgba(98,92,255,0.20),rgba(236,72,153,0.10))]" />
            <div className="relative grid gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/20 bg-amber-200/10 px-2.5 py-1 text-[10px] font-black text-amber-100">
                    <Sparkles size={12} />
                    ROUND 16
                  </div>
                  <h2 className="mt-3 max-w-[220px] text-[32px] font-black leading-[0.98] tracking-[-0.04em] text-white">
                    Run the World<br />Medal Prize Draw
                  </h2>
                  <p className="mt-3 text-sm font-semibold leading-5 text-slate-400">
                    Complete routes to earn medals, exchange them for draw tickets, and win cash or bonus time.
                  </p>
                </div>

                <div className="relative flex h-[126px] w-[126px] shrink-0 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_20deg,#ffcf5a,#ff7b2d,#665efd,#ffcf5a)] opacity-90 blur-[1px]" />
                  <div className="absolute inset-2 rounded-full border border-white/20 bg-[#080b12]" />
                  <div className="absolute inset-[18px] rounded-full bg-[conic-gradient(from_0deg,#ffe58a_0_25%,#ff8d32_25%_50%,#7c6cff_50%_75%,#ffcf5a_75%_100%)] opacity-95" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-[#080b12]/92 text-amber-100 shadow-[0_0_30px_rgba(255,187,69,0.25)]">
                    <Medal size={32} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/10 bg-black/24 p-3">
                  <p className="text-[10px] font-bold text-slate-500">ENTRIES</p>
                  <p className="mt-1 font-mono text-xl font-black tabular-nums text-white">1237</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/24 p-3">
                  <p className="text-[10px] font-bold text-slate-500">TICKETS</p>
                  <p className="mt-1 font-mono text-xl font-black tabular-nums text-amber-200">{tickets}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/24 p-3">
                  <p className="text-[10px] font-bold text-slate-500">PRIZES LEFT</p>
                  <p className="mt-1 font-mono text-xl font-black tabular-nums text-cyan-200">{remainingPool}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="h-11 cursor-default rounded-full border border-white/10 bg-white text-sm font-black text-slate-950 shadow-[0_12px_28px_rgba(255,255,255,0.12)]"
                >
                  Exchange Medals
                </button>
                <button
                  onClick={() => handleStepAction(2)}
                  className="h-11 rounded-full bg-[#635bff] text-sm font-black text-white shadow-[0_12px_30px_rgba(99,91,255,0.32)] active:scale-[0.98]"
                >
                  Draw Now
                </button>
              </div>
            </div>
          </section>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Panel className="p-4">
              <p className="text-[10px] font-black tracking-[0.18em] text-slate-500">CURRENT</p>
              <p className="mt-2 text-sm font-black text-white">Current Round</p>
              <div className="mt-3 space-y-1.5 font-mono text-xs font-bold tabular-nums text-slate-400">
                <p>Starts Sep 1, 2025</p>
                <p>Ends Sep 30, 2025</p>
              </div>
            </Panel>
            <Panel className="p-4">
              <p className="text-[10px] font-black tracking-[0.18em] text-slate-500">NEXT</p>
              <p className="mt-2 text-sm font-black text-white">Next Round</p>
              <p className="mt-3 text-xs font-bold leading-5 text-slate-400">Opens 1–3 business days after this round ends.</p>
            </Panel>
          </div>

          <Panel className="mt-4 p-4">
            <SectionHeader eyebrow="HOW IT WORKS" title="Four Simple Steps" />
            <div className="mt-4 space-y-2">
              {stepItems.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/24 text-slate-300">
                      <Icon size={19} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black tabular-nums text-slate-500">0{index + 1}</span>
                        <span className="truncate text-[11px] font-black text-[#8f9bff]">{step.label}</span>
                      </div>
                      <p className="mt-1 truncate text-sm font-bold text-white">{step.title}</p>
                    </div>
                    <button
                      type="button"
                      onClick={index === 1 ? undefined : () => handleStepAction(index)}
                      className={`h-9 shrink-0 rounded-full bg-white/[0.075] px-3 text-xs font-black text-slate-100 ring-1 ring-white/10 ${
                        index === 1 ? 'cursor-default' : 'active:scale-95'
                      }`}
                    >
                      {step.action}
                    </button>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel className="mt-4 p-4">
            <SectionHeader eyebrow="RULES" title="How to Enter" />
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300/12 text-amber-100 ring-1 ring-amber-200/15">
                  <Medal size={30} />
                </div>
                <p className="mt-3 text-xs font-bold leading-5 text-slate-300">Complete any Run the World route<br />to earn a medal.</p>
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <span className="h-1 w-1 rounded-full bg-current" />
                <span className="h-1 w-1 rounded-full bg-current" />
                <span className="h-1 w-1 rounded-full bg-current" />
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-300/12 text-indigo-100 ring-1 ring-indigo-200/15">
                  <Gift size={30} />
                </div>
                <p className="mt-3 text-xs font-bold leading-5 text-slate-300">Exchange medals<br />for draw tickets.</p>
              </div>
            </div>
          </Panel>

          <Panel className="mt-4 p-4">
            <SectionHeader eyebrow="PRIZE POOL" title="Round 16" action="Past Winners" />
            <div className="mt-5 grid grid-cols-[1fr_92px] gap-4">
              <div>
                <p className="text-sm font-bold text-slate-400"><span className="font-mono text-xl font-black tabular-nums text-white">1,000</span> total prizes</p>
                <p className="mt-2 text-sm font-bold text-slate-400">Remaining</p>
                <p className="font-mono text-[54px] font-black leading-none tracking-[-0.06em] text-amber-200 tabular-nums">{remainingPool}</p>
                <div className="mt-3 h-2 rounded-full bg-white/[0.07]">
                  <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-[#ff8a2b] via-[#f9d66a] to-[#8f9bff]" />
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-amber-200/20 bg-gradient-to-b from-[#ffb649] to-[#ff4f2d] shadow-[0_16px_34px_rgba(255,96,42,0.22)]">
                <div className="absolute inset-x-4 top-4 h-9 rounded-b-2xl bg-white/18" />
                <div className="absolute left-1/2 top-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-amber-100 text-orange-600">
                  <Wallet size={22} />
                </div>
                <div className="absolute bottom-4 left-3 right-3 h-2 rounded-full bg-black/12" />
              </div>
            </div>
          </Panel>

          <Panel className="mt-4 p-4">
            <SectionHeader eyebrow="REWARDS" title="Round 16 Prizes" action="Odds" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {rewardItems.map(item => (
                <div key={item.level} className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3">
                  <div className={`mb-3 h-1.5 rounded-full bg-gradient-to-r ${item.tone}`} />
                  <p className="text-xs font-black text-slate-400">Prize</p>
                  <p className="mt-2 font-mono text-2xl font-black tracking-[-0.04em] text-white tabular-nums">{item.amount}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[10px] font-black text-slate-300">{item.level}</span>
                    <span className="font-mono text-[11px] font-bold text-slate-500 tabular-nums">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </main>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute left-1/2 top-20 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950 shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-md"
            onClick={() => setResult(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-xs overflow-hidden rounded-[28px] border border-white/10 bg-[#0d1118] p-5 text-center shadow-[0_28px_90px_rgba(0,0,0,0.58)]"
              onClick={event => event.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_50%_0%,rgba(255,186,74,0.24),transparent_70%)]" />
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200/20 bg-amber-300/10 text-amber-100">
                <Trophy size={32} />
              </div>
              <p className="relative mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-amber-100">YOU WON</p>
              <p className="relative mt-2 text-5xl font-black tracking-[-0.06em] text-white">{result}</p>
              <button
                onClick={() => setResult(null)}
                className="relative mt-6 h-11 w-full rounded-full bg-[#635bff] text-sm font-black text-white shadow-[0_12px_28px_rgba(99,91,255,0.32)]"
              >
                Claim Reward
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
