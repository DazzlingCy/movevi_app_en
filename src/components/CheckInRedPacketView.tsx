import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  ChevronLeft,
  Flame,
  Gift,
  Lock,
  MapPin,
  Play,
  Route,
  Shuffle,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { CITIES, getRouteData } from '../data/cities';
import CityImage from './CityImage';

interface CheckInRedPacketViewProps {
  showHeader?: boolean;
  onBack?: () => void;
  onGoRun?: () => void;
  onNavigateToRouteDetail?: (cityId: string, routeIndex: number, image: string, day: number) => void;
  userStats: any;
  setUserStats: Dispatch<SetStateAction<any>>;
}

const PLAN_DAYS = 30;
const PLAN_START_DATE = new Date(2026, 6, 21);
const REWARD_AMOUNTS: Record<number, string> = {
  1: '$0.20',
  7: '$0.35',
  15: '$0.45',
  21: '$0.60',
  30: '$0.90',
};

const allDays = Array.from({ length: PLAN_DAYS }, (_, index) => index + 1);
const getRewardAmount = (day: number) => REWARD_AMOUNTS[day] || '$0.10';

const parseAmount = (amount: string) => Number(amount.replace(/[^0-9.]/g, ''));
const formatPlanDate = (day: number, format: 'short' | 'long' = 'short') => {
  const date = new Date(PLAN_START_DATE);
  date.setDate(PLAN_START_DATE.getDate() + day - 1);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(date.getDate()).padStart(2, '0');
  return format === 'long' ? `${date.getFullYear()}.${month}.${dayOfMonth}` : `${month}/${dayOfMonth}`;
};

export default function CheckInRedPacketView({
  showHeader = false,
  onBack,
  onGoRun,
  onNavigateToRouteDetail,
  userStats,
  setUserStats,
}: CheckInRedPacketViewProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [result, setResult] = useState<{ amount: string; description: string } | null>(null);
  const [routeOffset, setRouteOffset] = useState(0);
  const [routeDirection, setRouteDirection] = useState(1);

  const started = Boolean(userStats.checkInPlanStarted);
  const completedDays: number[] = userStats.checkInCompletedDays || [];
  const rewardDays: number[] = userStats.checkInRewardDays || [];
  const openedRewardDays: number[] = userStats.checkInOpenedRewardDays || [];
  const nextDay = Math.min(completedDays.length + 1, PLAN_DAYS);
  const todayCompleted = completedDays.includes(nextDay);
  const planComplete = completedDays.length >= PLAN_DAYS;
  const canSwitchRoute = started && !todayCompleted && !planComplete;
  const activationReady = Boolean(userStats.dailyTreadmillStarted || userStats.checkInActivationClaimed);
  const activationClaimed = Boolean(userStats.checkInActivationClaimed);
  const firstRouteReady = (userStats.completedRoutes || 0) > 0 || Boolean(userStats.checkInFirstRouteClaimed);
  const firstRouteClaimed = Boolean(userStats.checkInFirstRouteClaimed);

  const routeOptions = useMemo(() => {
    const cities = CITIES.filter(city => city.status !== 'upcoming');
    return cities.flatMap(city =>
      Array.from({ length: Math.max(city.routes, 1) }, (_, index) => {
        const routeIndex = index + 1;
        return {
          city,
          routeIndex,
          routeData: getRouteData(city.id, routeIndex),
        };
      })
    );
  }, []);

  const todayRoute = routeOptions[(nextDay - 1 + routeOffset) % Math.max(routeOptions.length, 1)] || {
    city: CITIES[0],
    routeIndex: 1,
    routeData: getRouteData(CITIES[0].id, 1),
  };

  useEffect(() => {
    setRouteOffset(0);
  }, [nextDay]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const addBalance = (amount: string) => {
    setUserStats((prev: any) => ({
      ...prev,
      redPacketBalance: Number(((prev.redPacketBalance || 0) + parseAmount(amount)).toFixed(2)),
    }));
  };

  const startPlan = () => {
    if (started) return;
    setUserStats((prev: any) => ({
      ...prev,
      checkInPlanStarted: true,
    }));
    showToast('30-day challenge started.');
  };

  const completeToday = () => {
    if (!started) {
      startPlan();
      return;
    }
    if (planComplete) {
      showToast('Challenge complete.');
      return;
    }
    if (completedDays.includes(nextDay)) {
      showToast('Today is already complete.');
      return;
    }

    setUserStats((prev: any) => ({
      ...prev,
      checkInCompletedDays: [...(prev.checkInCompletedDays || []), nextDay],
      checkInRewardDays: [...(prev.checkInRewardDays || []), nextDay],
      dailyCompletedRoutes: (prev.dailyCompletedRoutes || 0) + 1,
    }));
    showToast(`Day ${nextDay} complete. Cash bonus unlocked.`);
  };

  const switchTodayRoute = (direction = 1) => {
    if (!canSwitchRoute) return;
    const routeCount = Math.max(routeOptions.length, 1);
    setRouteDirection(direction);
    setRouteOffset(prev => (prev + direction + routeCount) % routeCount);
    showToast('Route updated.');
  };

  const handleRouteDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    if (!canSwitchRoute || Math.abs(info.offset.x) < 44) return;
    switchTodayRoute(info.offset.x < 0 ? 1 : -1);
  };

  const goToTodayRoute = () => {
    if (!started) {
      startPlan();
      return;
    }
    if (planComplete) {
      showToast('Challenge complete.');
      return;
    }
    if (todayCompleted) {
      showToast('Today is already complete.');
      return;
    }
    if (onNavigateToRouteDetail) {
      onNavigateToRouteDetail(todayRoute.city.id, todayRoute.routeIndex, todayRoute.city.image, nextDay);
      return;
    }
    completeToday();
  };

  const openReward = (day: number) => {
    if (!rewardDays.includes(day)) {
      showToast('Finish today\'s route to claim this bonus.');
      return;
    }
    if (openedRewardDays.includes(day)) {
      showToast('Already claimed.');
      return;
    }

    const amount = getRewardAmount(day);
    setUserStats((prev: any) => ({
      ...prev,
      checkInOpenedRewardDays: [...(prev.checkInOpenedRewardDays || []), day],
      checkInRewardHistory: [
        { day, amount, openedAt: new Date().toLocaleDateString() },
        ...(prev.checkInRewardHistory || []),
      ],
      redPacketBalance: Number(((prev.redPacketBalance || 0) + parseAmount(amount)).toFixed(2)),
    }));
    setResult({ amount, description: `Day ${day} cash bonus added to your balance.` });
    showToast(`Cash bonus claimed: ${amount}`);
  };

  const claimActivation = () => {
    if (activationClaimed) return;
    if (!activationReady) {
      setUserStats((prev: any) => ({
        ...prev,
        dailyTreadmillStarted: true,
      }));
      showToast('Treadmill activated. Bonus ready.');
      return;
    }

    setUserStats((prev: any) => ({
      ...prev,
      checkInActivationClaimed: true,
    }));
    const amount = '$0.99';
    addBalance(amount);
    setResult({ amount, description: 'First activation bonus added to your balance.' });
    showToast('Activation bonus claimed: $0.99');
  };

  const claimFirstRoute = () => {
    if (firstRouteClaimed) return;
    if (!firstRouteReady) {
      onGoRun?.();
      return;
    }

    setUserStats((prev: any) => ({
      ...prev,
      checkInFirstRouteClaimed: true,
    }));
    const amount = '$1.99';
    addBalance(amount);
    setResult({ amount, description: 'First route bonus added to your balance.' });
    showToast('First route bonus claimed: $1.99');
  };

  const completionPercent = Math.round((completedDays.length / PLAN_DAYS) * 100);
  const planButtonLabel = planComplete ? 'Challenge complete' : started ? 'Challenge active' : 'Start 30-day challenge';
  const planButtonDisabled = started || planComplete;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05070A] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(16,185,129,0.24),transparent_34%),radial-gradient(circle_at_88%_2%,rgba(251,191,36,0.18),transparent_32%),linear-gradient(180deg,#06110d_0%,#05070A_52%,#020304_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:28px_28px] opacity-[0.045]" />

      <div className="relative z-10 flex h-full flex-col">
        {showHeader && (
          <header className="shrink-0 px-4 pb-3 pt-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onBack}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-slate-200 backdrop-blur-md active:scale-95"
                aria-label="Back"
              >
                <ChevronLeft size={22} />
              </button>
              <h1 className="text-xl font-black tracking-tight text-white">Check-in Rewards</h1>
              <div className="w-10" />
            </div>
          </header>
        )}

        <main className="hide-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-24 pt-4">
          <section className="shrink-0 rounded-[26px] border border-white/[0.09] bg-white/[0.035] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-200/75">NEW USER BONUS</p>
                <h2 className="mt-1 text-lg font-black tracking-tight text-white">New user bonuses</h2>
              </div>
              <Gift size={18} className="text-amber-200" />
            </div>

            <div className="mt-4 grid gap-2">
              <button
                type="button"
                disabled={activationClaimed}
                onClick={claimActivation}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition active:scale-[0.99] ${
                  activationClaimed
                    ? 'border-emerald-200/12 bg-emerald-300/[0.055]'
                    : activationReady
                      ? 'border-amber-200/24 bg-amber-300/[0.08]'
                      : 'border-white/10 bg-black/20'
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-300/14 text-amber-200">
                  {activationClaimed ? <CheckCircle2 size={20} /> : <Flame size={19} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black text-white">First activation bonus</span>
                  <span className="mt-0.5 block truncate text-[11px] font-bold text-slate-500">Connect and activate your treadmill</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-mono text-sm font-black text-amber-200">$0.99</span>
                  <span className="mt-1 inline-flex rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-black text-slate-950">
                    {activationClaimed ? 'Claimed' : activationReady ? 'Claim' : 'Activate'}
                  </span>
                </span>
              </button>

              <button
                type="button"
                disabled={firstRouteClaimed}
                onClick={claimFirstRoute}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition active:scale-[0.99] ${
                  firstRouteClaimed
                    ? 'border-emerald-200/12 bg-emerald-300/[0.055]'
                    : firstRouteReady
                      ? 'border-amber-200/24 bg-amber-300/[0.08]'
                      : 'border-white/10 bg-black/20'
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-300/14 text-amber-200">
                  {firstRouteClaimed ? <CheckCircle2 size={20} /> : <Route size={19} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black text-white">First route bonus</span>
                  <span className="mt-0.5 block truncate text-[11px] font-bold text-slate-500">Complete any city route</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-mono text-sm font-black text-amber-200">$1.99</span>
                  <span className="mt-1 inline-flex rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-black text-slate-950">
                    {firstRouteClaimed ? 'Claimed' : firstRouteReady ? 'Claim' : 'Run'}
                  </span>
                </span>
              </button>
            </div>
          </section>

          <section className="relative mt-4 shrink-0 overflow-hidden rounded-[26px] border border-white/10 bg-[#0c1210]/85 p-4 shadow-[0_20px_64px_rgba(0,0,0,0.38)]">
            <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_25%_18%,rgba(52,211,153,0.26),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(250,204,21,0.22),transparent_34%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/20 bg-emerald-200/10 px-2.5 py-1 text-[10px] font-black text-emerald-100">
                <Sparkles size={12} />
                One route a day
              </div>
              <h2 className="mt-3 text-[28px] font-black leading-none tracking-[-0.04em] text-white">Complete 30 check-ins</h2>
              <p className="mt-2 max-w-[300px] text-sm font-semibold leading-5 text-slate-400">
                Finish the recommended route each day to unlock a fixed cash bonus.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-emerald-200/12 bg-emerald-200/[0.055] p-3">
                  <p className="text-[10px] font-bold text-emerald-100/55">Start date</p>
                  <p className="mt-1 font-mono text-sm font-black tabular-nums text-emerald-100">{started ? formatPlanDate(1, 'long') : '--'}</p>
                </div>
                <div className="rounded-2xl border border-amber-200/12 bg-amber-200/[0.055] p-3">
                  <p className="text-[10px] font-bold text-amber-100/55">End date</p>
                  <p className="mt-1 font-mono text-sm font-black tabular-nums text-amber-100">{started ? formatPlanDate(PLAN_DAYS, 'long') : '--'}</p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-amber-300" style={{ width: `${completionPercent}%` }} />
              </div>

              <button
                type="button"
                disabled={planButtonDisabled}
                onClick={startPlan}
                className={`mt-4 h-11 w-full rounded-full text-sm font-black shadow-[0_12px_28px_rgba(255,255,255,0.10)] active:scale-[0.98] ${
                  started
                    ? 'border border-emerald-200/18 bg-emerald-300/10 text-emerald-200'
                    : 'bg-white text-slate-950'
                }`}
              >
                {planButtonLabel}
              </button>
            </div>
          </section>

          {started && (
            <motion.section
              className="mt-4 shrink-0 cursor-grab rounded-2xl border border-emerald-300/15 bg-[#0d1412]/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] active:cursor-grabbing"
              drag={canSwitchRoute ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={handleRouteDragEnd}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300/70">
                    {planComplete ? 'PLAN COMPLETE' : `DAY ${nextDay}`}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black tracking-tight text-white">
                      {planComplete ? 'Challenge complete' : 'Today\'s route'}
                    </h2>
                    {!planComplete && (
                      <button
                        type="button"
                        disabled={!canSwitchRoute}
                        onClick={() => switchTodayRoute()}
                        className="inline-flex h-7 items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 text-[10px] font-black text-emerald-100 active:scale-95 disabled:opacity-45"
                      >
                        <Shuffle size={12} />
                        Switch
                      </button>
                    )}
                  </div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs font-black text-emerald-100">
                  {nextDay}/{PLAN_DAYS}
                </div>
              </div>

              {canSwitchRoute && (
                <p className="mt-2 text-[11px] font-bold text-slate-500">Swipe the card to switch routes</p>
              )}

              <AnimatePresence mode="wait" custom={routeDirection}>
              <motion.div
                key={`${todayRoute.city.id}-${todayRoute.routeIndex}-${nextDay}`}
                custom={routeDirection}
                initial={{ opacity: 0, x: routeDirection * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -routeDirection * 28 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/25"
              >
                <div className="relative h-32">
                  <CityImage src={todayRoute.city.image} alt={todayRoute.city.name} fallbackLabel={todayRoute.city.name} className="h-full w-full object-cover opacity-75" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-100">
                      <MapPin size={14} />
                      {todayRoute.city.name}
                    </div>
                    <h3 className="mt-1 text-xl font-black text-white">{todayRoute.routeData.title}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 p-3">
                  <div className="rounded-xl bg-white/[0.045] p-2">
                    <p className="text-[10px] text-slate-500">Distance</p>
                    <p className="font-mono text-sm font-black text-white">{todayRoute.routeData.distance} km</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.045] p-2">
                    <p className="text-[10px] text-slate-500">Time</p>
                    <p className="font-mono text-sm font-black text-white">{todayRoute.routeData.duration}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.045] p-2">
                    <p className="text-[10px] text-slate-500">Calories</p>
                    <p className="font-mono text-sm font-black text-white">{todayRoute.routeData.calories}</p>
                  </div>
                </div>
                <div className="mx-3 mb-3">
                  <button
                    type="button"
                    onClick={goToTodayRoute}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-300 text-sm font-black text-slate-950 shadow-[0_12px_28px_rgba(52,211,153,0.20)] active:scale-[0.98]"
                  >
                    {todayCompleted ? <CheckCircle2 size={18} /> : <Play size={17} className="fill-slate-950" />}
                    {todayCompleted ? 'Done today' : 'Start route'}
                  </button>
                </div>
              </motion.div>
              </AnimatePresence>
            </motion.section>
          )}

          <section className="relative mt-4 shrink-0 overflow-hidden rounded-[26px] border border-orange-200/18 bg-gradient-to-br from-[#111816] via-[#19140d] to-[#21120d] p-4 text-slate-100 shadow-[0_20px_54px_rgba(0,0,0,0.34)]">
            <div className="relative flex items-center justify-between gap-3">
              <h2 className="text-lg font-black tracking-tight text-white">
                Earn up to <span className="font-mono text-xl text-amber-300">$5.00</span> in 30 days
              </h2>
              <div className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-bold text-slate-300">
                {completedDays.length} days done
              </div>
            </div>

            <div className="hide-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
              {allDays.map(day => {
                const earned = rewardDays.includes(day);
                const opened = openedRewardDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={!earned || opened}
                    onClick={() => openReward(day)}
                    className={`flex w-[66px] shrink-0 flex-col items-center rounded-2xl border px-2 py-3 text-center transition active:scale-95 ${
                      opened
                        ? 'border-emerald-300/20 bg-emerald-300/10'
                        : earned
                          ? 'border-amber-300/35 bg-amber-300/14 shadow-[0_12px_22px_rgba(251,191,36,0.12)]'
                          : 'border-white/10 bg-white/[0.035] opacity-65'
                    }`}
                  >
                    <span className="text-[10px] font-black text-slate-400">{formatPlanDate(day)}</span>
                    <span className="mt-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg">
                      {opened ? <CheckCircle2 size={17} /> : earned ? <Gift size={16} /> : <Lock size={14} />}
                    </span>
                    <span className="mt-2 font-mono text-xs font-black text-amber-200">{getRewardAmount(day)}</span>
                    <span className="mt-1 text-[9px] font-bold text-slate-500">{opened ? 'Claimed' : earned ? 'Ready' : 'Locked'}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-4 shrink-0 rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center gap-2">
              <Wallet size={17} className="text-amber-200" />
              <h3 className="text-sm font-black text-white">How it works</h3>
            </div>
            <div className="mt-3 space-y-1.5 text-xs font-medium leading-relaxed text-slate-400">
              <p>1. New users can claim $0.99 after first treadmill activation.</p>
              <p>2. New users can claim $1.99 after completing their first route.</p>
              <p>3. The challenge runs for 30 days with one recommended route per day.</p>
              <p>4. Complete a daily route to unlock that day&apos;s fixed cash bonus.</p>
              <p>5. Cash rewards can be withdrawn from Wallet in Profile.</p>
            </div>
          </section>
        </main>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute left-1/2 top-5 z-50 -translate-x-1/2 rounded-full border border-emerald-300/25 bg-emerald-500/95 px-4 py-2 text-xs font-black text-white shadow-[0_12px_28px_rgba(16,185,129,0.25)]"
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
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
            onClick={() => setResult(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="w-full max-w-[300px] rounded-[28px] border border-amber-200/40 bg-gradient-to-b from-[#fff7df] to-[#ffe4b7] p-6 text-center text-slate-950 shadow-[0_30px_80px_rgba(0,0,0,0.38)]"
              onClick={event => event.stopPropagation()}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg">
                <Gift size={30} />
              </div>
              <p className="mt-5 text-[10px] font-black tracking-[0.24em] text-orange-600">CASH BONUS ADDED</p>
              <h3 className="mt-2 text-3xl font-black">{result.amount}</h3>
              <p className="mt-2 text-sm font-bold text-slate-600">{result.description}</p>
              <button
                type="button"
                onClick={() => setResult(null)}
                className="mt-6 h-11 w-full rounded-full bg-slate-950 text-sm font-black text-white"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
