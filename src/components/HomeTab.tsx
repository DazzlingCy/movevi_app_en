import { useEffect, useState, type Dispatch, type MouseEvent, type SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Award,
  CheckCircle2,
  ChevronRight,
  Compass,
  Flame,
  Gift,
  Lock,
  Radio,
  RefreshCw,
  X,
  Zap,
} from 'lucide-react';
import { CITIES, CityData } from '../data/cities';
import { cn } from '../lib/utils';
import { getGlowRank } from '../lib/glow';
import WorldGlobe from './WorldGlobe';
import CityImage from './CityImage';

const SWITCH_CITY_COST = 30;

interface HomeTabProps {
  onNavigate?: (type: string, data: any) => void;
  completedChapters?: number[];
  targetFlight?: { fromCityId: string; toCityId: string } | null;
  onFlightComplete?: () => void;
  pendingSelectionFrom?: string | null;
  onCitySelected?: (cityId: string) => void;
  litCityIds?: string[];
  userStats?: any;
  setUserStats?: Dispatch<SetStateAction<any>>;
  taskPanelOpenSignal?: number;
  onTreadmillActivated?: () => void;
}

const numberWords = [
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
];

const getCityPreviewImage = (city?: CityData | null) => city?.image || '';

export default function HomeTab({
  onNavigate,
  targetFlight,
  onFlightComplete,
  pendingSelectionFrom,
  onCitySelected,
  litCityIds = [],
  userStats,
  setUserStats,
  taskPanelOpenSignal = 0,
  onTreadmillActivated,
}: HomeTabProps) {
  const [showStoryPanel, setShowStoryPanel] = useState(false);
  const [showCitySelection, setShowCitySelection] = useState(false);
  const [selectableCities, setSelectableCities] = useState<CityData[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);
  const [isTreadmillConnected, setIsTreadmillConnected] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [broadcastIndex, setBroadcastIndex] = useState(0);

  const availableCities = CITIES.filter(city => city.status !== 'upcoming');
  const litCount = CITIES.filter(city => city.status === 'lit').length;
  const inProgressCity = CITIES.find(city => city.status === 'in-progress');
  const nextFocusCity =
    inProgressCity ||
    CITIES.find(city => city.status !== 'lit' && city.status !== 'upcoming') ||
    availableCities[0];
  const currentProgress = inProgressCity
    ? Math.round((inProgressCity.completed / Math.max(inProgressCity.routes, 1)) * 100)
    : litCount > 0
      ? 100
      : 0;
  const unlockedRoutes = availableCities.reduce(
    (total, city) => total + (city.status === 'lit' || city.status === 'in-progress' ? city.routes : 0),
    0
  );
  const glowRank = getGlowRank(userStats?.lifetimeLightValue ?? userStats?.lightValue ?? 0);
  const lightValue = userStats?.lightValue ?? 0;

  const broadcastMessages = [
    { type: 'route', text: 'Mia completed Singapore Bay Loop and earned route medals.' },
    { type: 'prize', text: 'Alex redeemed medals and won a cash reward.' },
    { type: 'route', text: 'London and Tokyo route signals are ready to unlock.' },
    { type: 'prize', text: 'Check-in rewards are live. Finish your daily route to claim a reward.' },
  ];
  const activeBroadcast = broadcastMessages[broadcastIndex % broadcastMessages.length];

  useEffect(() => {
    if (userStats?.dailyTreadmillStarted) {
      setIsTreadmillConnected(true);
    }
  }, [userStats?.dailyTreadmillStarted]);

  useEffect(() => {
    if (pendingSelectionFrom) {
      openCitySelection(pendingSelectionFrom);
    }
  }, [pendingSelectionFrom]);

  useEffect(() => {
    if (taskPanelOpenSignal > 0) {
      showToast('Daily task panel is handled from Events.');
    }
  }, [taskPanelOpenSignal]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBroadcastIndex(prev => (prev + 1) % broadcastMessages.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [broadcastMessages.length]);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 2600);
  };

  const getSelectionPool = (excludeCityId?: string | null) => {
    return CITIES.filter(
      city =>
        city.status !== 'lit' &&
        city.status !== 'upcoming' &&
        city.id !== excludeCityId
    );
  };

  const openCitySelection = (excludeCityId?: string | null) => {
    const shuffled = [...getSelectionPool(excludeCityId)].sort(() => 0.5 - Math.random());
    setSelectableCities(shuffled.slice(0, 3));
    setShowCitySelection(true);
  };

  const handleConnectTreadmill = () => {
    setIsTreadmillConnected(true);
    onTreadmillActivated?.();
    setUserStats?.((prev: any) => ({
      ...prev,
      dailyTreadmillStarted: true,
    }));
    showToast('Treadmill connected.');
  };

  const handleCitySelect = (city: CityData) => {
    setShowCitySelection(false);
    CITIES.forEach(item => {
      if (item.status === 'in-progress') item.status = 'unlit';
    });
    city.status = 'in-progress';
    setSelectedCity(city);
    onCitySelected?.(city.id);
  };

  const handleShuffleCities = (event: MouseEvent) => {
    event.stopPropagation();
    const currentIds = new Set(selectableCities.map(city => city.id));
    let nextCities = getSelectionPool(pendingSelectionFrom).filter(city => !currentIds.has(city.id));
    if (nextCities.length < 3) {
      nextCities = getSelectionPool(pendingSelectionFrom);
    }
    setSelectableCities([...nextCities].sort(() => 0.5 - Math.random()).slice(0, 3));
  };

  const handleConfirmSwitch = () => {
    if (lightValue < SWITCH_CITY_COST) {
      showToast(`You need ${SWITCH_CITY_COST} Glow to switch cities.`);
      setShowSwitchConfirm(false);
      return;
    }

    setUserStats?.((prev: any) => ({
      ...prev,
      lightValue: Math.max(0, (prev.lightValue || 0) - SWITCH_CITY_COST),
    }));
    setShowSwitchConfirm(false);
    openCitySelection(inProgressCity?.id);
  };

  const openRoutes = (city?: CityData | null) => {
    if (!city || city.status === 'upcoming') return;
    onNavigate?.('cityRoutes', city);
  };

  const focusCityLabel = inProgressCity
    ? `${inProgressCity.name} signal receiving`
    : litCount > 0
      ? 'Choose the next city'
      : 'Start your first city';

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#081827]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#081827]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_32%,rgba(34,211,238,0.18),transparent_38%),radial-gradient(circle_at_24%_74%,rgba(20,184,166,0.14),transparent_32%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#081827]/80 via-[#081827]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#081827] via-[#081827]/64 to-transparent" />
      </div>

      <WorldGlobe
        cities={CITIES}
        targetFlight={targetFlight}
        onCityClick={setSelectedCity}
        onFlightComplete={onFlightComplete}
      />

      <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-start justify-between gap-3 bg-gradient-to-b from-[#081827]/70 to-transparent px-5 pt-5">
        <button
          type="button"
          onClick={() => onNavigate?.('litRecords', null)}
          className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/12 bg-slate-950/28 p-1.5 pr-4 text-left shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-md transition-colors hover:border-cyan-200/35 hover:bg-white/[0.075]"
        >
          <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${glowRank.current.color} p-[2px] shadow-[0_0_18px_rgba(34,211,238,0.28)]`}>
            <div className="h-full w-full overflow-hidden rounded-full bg-slate-950 p-[2px]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100"
                alt="Mia Liu avatar"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <div className="text-sm font-black tracking-wide text-slate-50">Mia Liu</div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold text-slate-300">
              <span>{glowRank.current.name}</span>
              <span className="text-slate-500">LV.{glowRank.current.level}</span>
            </div>
            <div className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-200 to-amber-200"
                style={{ width: `${glowRank.progress}%` }}
              />
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={handleConnectTreadmill}
          aria-label={isTreadmillConnected ? 'Treadmill connected' : 'Connect treadmill'}
          title={isTreadmillConnected ? 'Treadmill connected' : 'Connect treadmill'}
          className={cn(
            'pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 active:scale-95',
            isTreadmillConnected
              ? 'border-emerald-300/60 bg-emerald-500/20 text-emerald-300 shadow-[0_0_22px_rgba(52,211,153,0.24)]'
              : 'border-cyan-300/30 bg-slate-950/35 text-cyan-300 hover:border-cyan-200/70 hover:bg-cyan-400/15'
          )}
        >
          <Activity size={20} />
          {isTreadmillConnected && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.85)]" />
          )}
        </button>
      </div>

      <div className="pointer-events-auto absolute right-5 top-[42%] z-20 flex -translate-y-1/2 flex-col items-center gap-3">
        <button
          type="button"
          className="group flex flex-col items-center gap-1.5 text-[10px] font-black text-slate-200"
          onClick={() => onNavigate?.('litRecords', null)}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-slate-950/34 text-cyan-200 shadow-[0_12px_34px_rgba(0,0,0,0.26)] backdrop-blur-md transition group-hover:border-cyan-200/50 group-hover:bg-cyan-300/12">
            <Zap size={18} />
          </span>
          Records
        </button>
        <button
          type="button"
          className="group flex flex-col items-center gap-1.5 text-[10px] font-black text-slate-200"
          onClick={() => onNavigate?.('leaderboard', null)}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-slate-950/34 text-cyan-200 shadow-[0_12px_34px_rgba(0,0,0,0.26)] backdrop-blur-md transition group-hover:border-cyan-200/50 group-hover:bg-cyan-300/12">
            <Award size={18} />
          </span>
          Ranking
        </button>
        <button
          type="button"
          className="group flex flex-col items-center gap-1.5 text-[10px] font-black text-orange-100"
          onClick={() => onNavigate?.('checkInRedPacket', null)}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-200/24 bg-orange-300/12 text-orange-200 shadow-[0_12px_34px_rgba(0,0,0,0.26)] backdrop-blur-md transition group-hover:border-orange-200/50 group-hover:bg-orange-300/18">
            <Gift size={18} />
          </span>
          红包
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-4 right-4 z-20 flex flex-col gap-3">
        <button
          type="button"
          className="pointer-events-auto relative w-full overflow-hidden rounded-[22px] border border-cyan-100/16 bg-[#142538]/76 p-4 text-left shadow-[0_24px_70px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-colors hover:border-cyan-200/32"
          onClick={() => setShowStoryPanel(true)}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_18%_0%,rgba(103,232,249,0.18),transparent_48%),radial-gradient(circle_at_84%_0%,rgba(148,163,184,0.14),transparent_46%)]" />
          <div className="relative grid grid-cols-[0.92fr_1.08fr] gap-3">
            <div className="flex min-h-[126px] flex-col border-r border-white/10 pr-3">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black tracking-wide text-white">World Light Project</h3>
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/12 text-[10px] text-slate-400">i</span>
              </div>
              <p className="mt-4 flex items-end gap-1 leading-none text-cyan-100">
                <span className="pb-1 text-base font-black">Lit</span>
                <span className="font-mono text-[44px] font-black tracking-[-0.07em] tabular-nums">{litCount}</span>
                <span className="pb-1 text-base font-black">cities</span>
              </p>
              <div className="mt-auto text-[11px] font-bold leading-5 text-slate-400">
                <p>
                  Unlocked routes <span className="font-mono text-sm font-black text-slate-100">{unlockedRoutes}</span>
                </p>
              </div>
            </div>

            <div className="flex min-h-[126px] min-w-0 flex-col gap-3 pl-1">
              <div>
                <p className="text-[10px] font-bold text-slate-400">Current city</p>
                <div className="mt-2 flex items-start gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    {nextFocusCity && (
                      <CityImage
                        src={getCityPreviewImage(nextFocusCity)}
                        alt={nextFocusCity.name}
                        fallbackLabel={nextFocusCity.name}
                        className="h-full w-full object-cover object-center"
                        compactFallback
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-lg font-black leading-tight text-white">{nextFocusCity?.name || 'Next city'}</h4>
                    <p className="mt-0.5 truncate text-[11px] font-bold text-slate-400">{focusCityLabel}</p>
                    <div className="mt-1.5 flex items-center gap-0.5">
                      {Array.from({ length: 18 }).map((_, index) => (
                        <span
                          key={index}
                          className={cn(
                            'h-3 w-0.5 rounded-full',
                            index < Math.round((currentProgress / 100) * 18) ? 'bg-cyan-200' : 'bg-white/10'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <span
                className="mt-auto flex h-9 w-full items-center justify-center rounded-full border border-cyan-100/18 bg-cyan-100/[0.08] text-xs font-black text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                onClick={event => {
                  event.stopPropagation();
                  openRoutes(nextFocusCity);
                }}
              >
                Explore
              </span>
            </div>
          </div>
        </button>

        <div className="pointer-events-auto flex w-full items-center gap-3 rounded-[18px] border border-amber-200/18 bg-[#14283c]/74 px-3.5 py-3 text-left shadow-[0_16px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-200/18 bg-amber-200/10 text-amber-200">
            <Radio size={15} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-100/70">Signal Broadcast</span>
              <span className="h-1 w-1 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.7)]" />
            </div>
            <div className="relative h-4 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={`${activeBroadcast.type}-${broadcastIndex}`}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.26, ease: 'easeOut' }}
                  className="absolute inset-x-0 top-0 truncate text-[11px] font-bold text-slate-200"
                >
                  {activeBroadcast.text}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCity && !showStoryPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 p-6 backdrop-blur-[2px]"
            onClick={() => setSelectedCity(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-slate-900/92 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              onClick={event => event.stopPropagation()}
            >
              <div className="relative h-48 w-full">
                <CityImage src={selectedCity.image} alt={selectedCity.name} fallbackLabel={selectedCity.name} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedCity(null)}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                  aria-label="Close city preview"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-3xl font-black tracking-wide text-white drop-shadow-md">{selectedCity.name}</h3>
                  <p className="mt-1 text-sm font-bold uppercase tracking-widest text-cyan-300/80">{selectedCity.continent}</p>
                </div>
              </div>

              <div className="p-6 pt-3">
                {selectedCity.status === 'upcoming' ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Lock size={32} className="mb-4 text-slate-500" />
                    <p className="font-semibold text-slate-300">Coming in late 2026</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-5 grid grid-cols-3 rounded-xl border border-white/5 bg-white/5 p-4 text-center">
                      <div>
                        <span className="mb-1 block text-2xl font-black text-slate-100">{selectedCity.routes}</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500">Routes</span>
                      </div>
                      <div className="border-x border-white/10">
                        <span className="mb-1 block text-2xl font-black text-slate-100">{selectedCity.spots}</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500">Spots</span>
                      </div>
                      <div>
                        <span className="mb-1 block text-2xl font-black text-slate-100">
                          {selectedCity.status === 'lit' ? '100%' : `${Math.round((selectedCity.completed / selectedCity.routes) * 100)}%`}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500">Progress</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="mb-2 flex items-end justify-between">
                        <span className="text-[10px] text-slate-400">Awakening progress</span>
                        <span className="font-mono text-xs font-semibold text-amber-400">{selectedCity.completed} / {selectedCity.routes}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full border border-white/5 bg-white/5">
                        <div
                          className="h-full rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                          style={{ width: `${(selectedCity.completed / selectedCity.routes) * 100}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full rounded-xl bg-cyan-500 py-4 font-black tracking-wide text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-colors hover:bg-cyan-400"
                      onClick={() => {
                        setSelectedCity(null);
                        openRoutes(selectedCity);
                      }}
                    >
                      Enter city
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStoryPanel && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 z-50 flex flex-col bg-[#05070A]"
          >
            <div className="relative flex items-center justify-between border-b border-white/5 bg-gradient-to-b from-cyan-900/20 to-transparent p-6 pb-3">
              <div>
                <h2 className="mb-1 text-2xl font-black text-slate-100">World Light Project</h2>
                <p className="font-mono text-xs tracking-widest text-cyan-400/80">MOVEVI GLOBAL ROUTES</p>
              </div>
              <button
                type="button"
                onClick={() => setShowStoryPanel(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
                aria-label="Close project panel"
              >
                <X size={20} className="text-slate-300" />
              </button>
            </div>

            <div className="hide-scrollbar flex-1 overflow-y-auto px-6 py-6 pb-24">
              <div className="mb-8 rounded-xl border-l-2 border-cyan-500 bg-gradient-to-r from-cyan-950/40 to-transparent p-4 shadow-md">
                <p className="mb-3 text-xs font-semibold italic leading-relaxed text-slate-300">
                  Six hundred years from now, people live among the stars, but the memory of Earth is fading.
                </p>
                <p className="mb-3 text-xs font-semibold italic leading-relaxed text-slate-300">
                  Your runs recover those city signals, one scenic route at a time.
                </p>
                <p className="text-xs font-medium leading-relaxed text-slate-300">
                  You are a <span className="mx-1 font-bold text-cyan-400">Glowtrail Explorer</span>. Finish routes, light cities, and rebuild the global map.
                </p>
              </div>

              {!litCityIds.length ? (
                <div className="relative mb-6 flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/50 px-6 py-12 text-center shadow-inner">
                  <Compass size={32} className="relative z-10 mb-4 animate-pulse text-cyan-500" />
                  <h3 className="relative z-10 mb-2 text-lg font-black tracking-wide text-slate-200">Project not started</h3>
                  <p className="relative z-10 mb-4 text-sm leading-relaxed text-slate-400">
                    Pick a city, subscribe to run routes, and begin lighting the global route network.
                  </p>
                </div>
              ) : (
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-[15px] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-slate-700 before:to-slate-800">
                  {Array.from({ length: Math.min(litCityIds.length + 1, CITIES.length) }).map((_, index) => {
                    const cityId = litCityIds[index];
                    const city = cityId ? CITIES.find(item => item.id === cityId) : null;
                    const label = numberWords[index] || String(index + 1);

                    if (!city) {
                      return (
                        <div key={`locked-${index}`} className="relative flex items-center justify-between opacity-55">
                          <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-[#05070A] bg-slate-800 text-xs font-bold text-slate-500">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <div className="w-[calc(100%-3rem)] rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
                            <div className="mb-1 flex items-center justify-between">
                              <h3 className="font-bold text-slate-500">City {label}: Locked</h3>
                              <Lock size={14} className="text-slate-600" />
                            </div>
                            <p className="text-xs text-slate-600">Complete the current city to reveal the next signal.</p>
                          </div>
                        </div>
                      );
                    }

                    const isLit = city.status === 'lit';
                    const isInProgress = city.status === 'in-progress';
                    return (
                      <div key={city.id} className="relative flex items-center justify-between">
                        <div
                          className={cn(
                            'z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-[#05070A] text-xs font-bold',
                            isLit
                              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.65)]'
                              : isInProgress
                                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                                : 'bg-slate-800 text-slate-400'
                          )}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div
                          className={cn(
                            'w-[calc(100%-3rem)] rounded-2xl border bg-white/5 p-4 shadow-lg backdrop-blur-sm',
                            isLit ? 'border-emerald-400/40 bg-emerald-400/[0.03]' : isInProgress ? 'border-cyan-500/30' : 'border-white/5'
                          )}
                        >
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <div>
                              <h3 className={cn('text-lg font-black', isLit ? 'text-emerald-300' : isInProgress ? 'text-cyan-300' : 'text-slate-300')}>
                                City {label}: {city.name}
                              </h3>
                              <p className="mt-1 font-mono text-[13px] text-slate-400">{city.continent} - {city.englishName}</p>
                            </div>
                            {isInProgress && (
                              <button
                                type="button"
                                onClick={() => setShowSwitchConfirm(true)}
                                className="flex shrink-0 items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300 transition-all hover:border-cyan-400/40"
                              >
                                <RefreshCw size={12} />
                                Switch
                              </button>
                            )}
                          </div>
                          <p className="mb-4 text-[12px] leading-relaxed text-slate-300">{city.description}</p>
                          {isLit ? (
                            <div className="flex w-fit items-center rounded bg-emerald-500/10 px-2 py-1 font-mono text-[10px] text-emerald-300">
                              <CheckCircle2 size={12} className="mr-1" />
                              Completed. City card unlocked.
                            </div>
                          ) : isInProgress ? (
                            <div className="flex w-fit items-center rounded bg-cyan-950/40 px-2 py-1 font-mono text-[10px] text-cyan-300">
                              <Activity size={12} className="mr-1" />
                              In progress. {city.completed}/{city.routes} routes complete.
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-white/5 bg-black/80 p-4 backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  setShowStoryPanel(false);
                  if (nextFocusCity) openRoutes(nextFocusCity);
                  else openCitySelection(null);
                }}
                className="w-full rounded-xl bg-cyan-500 py-3 font-black tracking-wide text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-colors hover:bg-cyan-400"
              >
                {inProgressCity ? 'Continue exploring' : 'Choose a city'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCitySelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex flex-col bg-[#05070A]/95 p-6 backdrop-blur-xl"
          >
            <div className="mb-6 pt-8">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">Select target city</h2>
                <button
                  type="button"
                  onClick={() => setShowCitySelection(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300"
                  aria-label="Close city selection"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-slate-400">Choose the next city signal to awaken.</p>
            </div>

            <div className="hide-scrollbar flex-1 space-y-4 overflow-y-auto">
              {selectableCities.map(city => {
                const progress = Math.round((city.completed / Math.max(city.routes, 1)) * 100);
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleCitySelect(city)}
                    className="w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 text-left shadow-xl"
                  >
                    <div className="relative h-28">
                      <CityImage src={city.image} alt={city.name} fallbackLabel={city.name} className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        <div>
                          <h3 className="text-xl font-black text-white">{city.name}</h3>
                          <p className="text-xs font-semibold text-cyan-300">{city.continent}</p>
                        </div>
                        <ChevronRight size={20} className="text-white/70" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-1 flex justify-between text-[10px] font-mono text-slate-400">
                        <span>{city.routes} routes</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-700/80">
                        <div className="h-full rounded-full bg-cyan-400" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button type="button" onClick={handleShuffleCities} className="mt-4 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-slate-200">
              Shuffle cities
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSwitchConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[70] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              className="w-full max-w-xs rounded-2xl border border-white/10 bg-slate-900 p-6 text-center shadow-2xl"
            >
              <Flame size={32} className="mx-auto mb-3 text-cyan-300" />
              <h3 className="mb-2 text-lg font-black text-white">Switch city?</h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-400">
                Switching cities costs {SWITCH_CITY_COST} Glow. Your current route progress stays saved.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSwitchConfirm(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSwitch}
                  className="flex-1 rounded-xl bg-cyan-500 py-3 text-sm font-black text-slate-950"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute left-1/2 top-20 z-[90] -translate-x-1/2 rounded-full border border-emerald-300/25 bg-emerald-500/90 px-4 py-2 text-xs font-black text-white shadow-[0_12px_28px_rgba(16,185,129,0.25)]"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
