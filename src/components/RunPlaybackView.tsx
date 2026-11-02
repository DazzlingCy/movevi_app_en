import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Award, ChevronLeft, Clock3, Flame, MapPin, Pause, Play, Route, Square, Wifi, Zap } from 'lucide-react';
import { CITIES, getRouteData } from '../data/cities';
import CityImage from './CityImage';
import type { CityRouteListItem } from './CityRoutesView';

const MEDALS = [
  { id: 'm1', name: 'First Light', color: 'from-amber-400 via-amber-200 to-yellow-600', text: '🏯' },
  { id: 'm2', name: 'River Glow', color: 'from-emerald-400 via-teal-200 to-cyan-600', text: '⛩️' },
  { id: 'm3', name: 'City Guardian', color: 'from-rose-500 via-orange-300 to-red-700', text: '🏰' },
  { id: 'm4', name: 'Skyline Spark', color: 'from-sky-400 via-indigo-200 to-purple-600', text: '🗼' },
  { id: 'm5', name: 'Gravity Breaker', color: 'from-fuchsia-500 via-pink-300 to-purple-700', text: '🛸' },
  { id: 'm6', name: 'Earthlight', color: 'from-cyan-400 via-blue-200 to-teal-600', text: '🌍' },
];

const getCityStoryText = (cityName: string, routeIndex: number) => {
  const cityMoments: Record<string, string> = {
    Beijing: 'Ancient gates and the modern skyline glow along your path as another part of the city comes to life.',
    Hangzhou: 'West Lake catches the morning light while your footsteps carry the route from willow-lined paths to the riverfront.',
    Shanghai: 'The Huangpu reflects a bright skyline as historic streets and modern towers meet in your run.',
    "Xi'an": 'Every step across the old city reveals another layer of the Silk Road and its living history.',
    Tokyo: 'Shrines, cherry trees, and neon streets flow together as the city responds to your pace.',
    Paris: 'The Seine, stone bridges, and landmark rooftops frame a route with unmistakable Paris energy.',
    London: 'From the Thames to the city clock towers, your route connects old London with its restless present.',
    'New York': 'Manhattan rises around you as parks, avenues, and skyline landmarks mark every mile.',
    Sydney: 'Harbor light sweeps across the Opera House and bridge while your route follows the water.',
    'Rio de Janeiro': 'Ocean air, bright hills, and city rhythm carry you along Rio’s coastline.',
    Cairo: 'The Nile and ancient monuments meet the modern city as your route crosses thousands of years of history.',
  };
  const endings = ['Route complete. Another city memory is now part of your journey.', 'Your run lights up another path on the world map.', 'A new chapter of the city is now unlocked.'];
  return `${cityMoments[cityName] ?? 'Your run brings this city to life, one landmark at a time.'} ${endings[(routeIndex - 1) % endings.length]}`;
};

interface RunPlaybackViewProps {
  cityId: string;
  routeIndex: number;
  image: string;
  cityName?: string;
  routeOverride?: CityRouteListItem;
  onExit: () => void;
  requireFullRoute?: boolean;
  demoCompleteSignal?: number;
  onComplete: (stats: { distance: number; duration: number; calories: number }) => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
};

const parsePlannedDuration = (value: string) => {
  const [minutes = 0, seconds = 0] = value.split(':').map(Number);
  return minutes * 60 + seconds;
};

export default function RunPlaybackView({ cityId, routeIndex, image, cityName: cityNameOverride, routeOverride, onExit, onComplete, requireFullRoute = false, demoCompleteSignal = 0 }: RunPlaybackViewProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const reduceMotion = useReducedMotion();

  const city = CITIES.find(item => String(item.id) === String(cityId));
  const route = routeOverride ?? getRouteData(cityId, routeIndex);
  const cityName = cityNameOverride ?? city?.name ?? 'City';
  const plannedDistance = Number(route.distance) || 0;
  const plannedDuration = parsePlannedDuration(route.duration);
  const routeFinished = !requireFullRoute || distance >= plannedDistance;
  useEffect(() => {
    if (!demoCompleteSignal) return;
    setDistance(plannedDistance); setTime(plannedDuration); setIsPlaying(false); setShowSummary(true);
  }, [demoCompleteSignal, plannedDistance, plannedDuration]);

  useEffect(() => {
    if (!isPlaying || showSummary) return;
    const timer = window.setInterval(() => {
      setTime(value => value + 1);
      setDistance(value => Math.min(plannedDistance, value + 0.003));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying, plannedDistance, showSummary]);

  const result = useMemo(() => {
    const resultDistance = requireFullRoute ? distance : distance >= 0.05 ? distance : plannedDistance;
    const resultDuration = requireFullRoute ? time : time >= 20 ? time : plannedDuration;
    return {
      distance: Number(resultDistance.toFixed(2)),
      duration: resultDuration,
      calories: Math.max(1, Math.round(resultDistance * 65))
    };
  }, [distance, plannedDistance, plannedDuration, time, requireFullRoute]);

  const pace = distance > 0.01
    ? `${Math.floor(time / 60 / distance)}'${String(Math.floor(((time / 60 / distance) % 1) * 60)).padStart(2, '0')}\"`
    : '--';
  const todayDateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '/');

  const finishRun = () => {
    setIsPlaying(false);
    setShowSummary(true);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05070A] font-sans text-white" aria-label={`${cityName} ${route.title} run`}>
      <motion.div
        className="absolute inset-0"
        animate={reduceMotion || !isPlaying ? { scale: 1 } : { scale: [1, 1.035, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <CityImage src={image} alt={`${cityName} route`} fallbackLabel={cityName} className="h-full w-full object-cover opacity-70" />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,12,.78)_0%,rgba(2,6,12,.12)_36%,rgba(2,6,12,.93)_100%)]" />
      <div className="absolute inset-x-0 top-[39%] h-40 -translate-y-1/2 bg-cyan-300/10 blur-3xl" aria-hidden="true" />

      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pb-5 pt-safet">
        <button onClick={onExit} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/35 backdrop-blur-md active:scale-95" aria-label="Back to route details">
          <ChevronLeft size={23} />
        </button>
        <div className="min-w-0 flex-1 px-3 text-center">
          <p className="truncate text-sm font-black">{route.title}</p>
          <p className="mt-1 flex items-center justify-center gap-1 text-[10px] font-bold text-cyan-100/70"><MapPin size={11} /> {cityName} · Route {routeIndex}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200/15 bg-emerald-300/10 text-emerald-200" aria-label="Treadmill connected">
          <Wifi size={18} />
        </div>
      </header>

      <main className="relative z-[1] flex h-full flex-col justify-between px-5 pb-[max(26px,env(safe-area-inset-bottom))] pt-28">
        <section className="flex flex-1 flex-col items-center justify-center pb-12" aria-live="polite">
          <motion.div
            className="relative flex h-64 w-64 items-center justify-center rounded-full border border-cyan-100/15 bg-black/20 backdrop-blur-[2px]"
            animate={reduceMotion || !isPlaying ? undefined : { boxShadow: ['0 0 0 rgba(34,211,238,0)', '0 0 54px rgba(34,211,238,.2)', '0 0 0 rgba(34,211,238,0)'] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          >
            <div className="absolute inset-3 rounded-full border border-dashed border-cyan-100/15" />
            <div className="text-center">
              <p className="font-mono text-[70px] font-black leading-none tracking-[-0.08em] tabular-nums">{distance.toFixed(2)}</p>
              <p className="mt-3 text-[10px] font-black tracking-[0.3em] text-cyan-100/65">KM</p>
            </div>
          </motion.div>
        </section>

        <section className="rounded-[28px] border border-white/12 bg-black/35 p-4 backdrop-blur-xl">
          <div className="grid grid-cols-3 divide-x divide-white/10 text-center">
            <div><Clock3 size={15} className="mx-auto text-cyan-200" /><b className="mt-2 block font-mono text-xl tabular-nums">{formatTime(time)}</b><span className="text-[10px] text-slate-400">{"Time"}</span></div>
            <div><Route size={15} className="mx-auto text-cyan-200" /><b className="mt-2 block font-mono text-xl tabular-nums">{pace}</b><span className="text-[10px] text-slate-400">Pace</span></div>
            <div><Flame size={15} className="mx-auto text-cyan-200" /><b className="mt-2 block font-mono text-xl tabular-nums">{Math.round(distance * 65)}</b><span className="text-[10px] text-slate-400">Calories</span></div>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_2fr] gap-3">
            <button onClick={finishRun} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] text-sm font-black text-slate-200 active:scale-[.98]">
              <Square size={15} className="fill-rose-400 text-rose-400" /> {"End"}
            </button>
            <button onClick={() => setIsPlaying(value => !value)} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#2ecc71] text-base font-black text-[#042012] shadow-[0_12px_35px_rgba(46,204,113,.26)] active:scale-[.98]">
              {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current" />}
              {isPlaying ? 'Pause Run' : 'Resume Run'}
            </button>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {showSummary && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-[#05070a]/95 p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="mb-6 text-center"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.1 }}
            >
              <div className="mb-1.5 flex items-center justify-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 motion-safe:animate-ping" />
                <span className="font-mono text-xs font-bold tracking-[0.25em] text-cyan-400">{requireFullRoute ? routeFinished ? 'ROUTE COMPLETE' : 'RUN PAUSED' : 'CITY ROUTE COMPLETE'}</span>
              </div>
              <h2 id="run-summary-title" className="flex items-center justify-center gap-2 text-2xl font-black tracking-[0.15em] text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                <Zap size={22} className="fill-cyan-400/20 text-cyan-400" />
                {requireFullRoute ? routeFinished ? 'Route Complete' : 'Route Incomplete' : 'City Route Complete'}
              </h2>
            </motion.div>

            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="run-summary-title"
              className="mb-8 flex w-full max-w-sm flex-col overflow-hidden rounded-[28px] border border-[#a3dfcb]/10 shadow-[0_20px_50px_rgba(38,177,128,0.15)]"
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.28 }}
            >
              <div className="flex flex-col bg-gradient-to-br from-[#d4f7ed] to-[#c2f4e6] p-5 pb-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="relative flex h-11 w-11 select-none items-center justify-center overflow-hidden rounded-full border border-[#a2dfcb] bg-[#122e26] text-3xl shadow-md">
                    <span className="text-2xl drop-shadow">🐈‍⬛</span>
                    <span className="absolute left-2 top-5 rotate-12 rounded border border-yellow-400 bg-black px-0.5 font-sans text-[8px] font-bold leading-none text-yellow-400">🕶️</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="select-text text-sm font-bold tracking-wide text-[#103027]">MOVEVI Runner</span>
                    <span className="font-mono text-[9px] font-bold tracking-wider text-[#2c6e5a]">CITY EXPLORER</span>
                  </div>
                </div>

                <div className="mb-5 grid w-full grid-cols-3 gap-2.5">
                  <div className="flex flex-col justify-center rounded-2xl border border-[#b2e8da] bg-white/80 p-2.5 text-center shadow-sm">
                    <div className="font-mono text-2xl font-black text-[#0b3329]" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.7)' }}>{result.distance.toFixed(2)}</div>
                    <div className="mt-1 text-[9.5px] font-bold tracking-tight text-[#206956]">Distance (km)</div>
                  </div>
                  <div className="flex flex-col justify-center rounded-2xl border border-[#b2e8da] bg-white/80 p-2.5 text-center shadow-sm">
                    <div className="font-mono text-2xl font-black text-[#0b3329]" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.7)' }}>{formatTime(result.duration)}</div>
                    <div className="mt-1 text-[9.5px] font-bold tracking-tight text-[#206956]">Active Time</div>
                  </div>
                  <div className="flex flex-col justify-center rounded-2xl border border-[#b2e8da] bg-white/80 p-2.5 text-center shadow-sm">
                    <div className="font-mono text-2xl font-black text-[#0b3329]" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.7)' }}>{result.calories}</div>
                    <div className="mt-1 text-[9.5px] font-bold tracking-tight text-[#206956]">Calories (kcal)</div>
                  </div>
                </div>

                <div className="flex w-full items-center gap-2.5 rounded-2xl border border-[#b2e8da]/40 bg-[#f4fcf9]/40 p-2 shadow-sm backdrop-blur-sm">
                  <div className="-skew-x-6 flex shrink-0 items-center gap-1 rounded-xl border border-[#c5e66b] bg-[#e4ffa1] px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#2c3d00] shadow-sm">
                    <Award size={11} className="text-[#2c3d00] motion-safe:animate-pulse" />
                    <span>Medal Earned</span>
                  </div>
                  <div className="hide-scrollbar flex flex-1 items-center justify-start gap-1.5 overflow-x-auto py-0.5">
                    {MEDALS.map((medal, index) => (
                      <div key={medal.id} className="relative shrink-0" title={medal.name}>
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${medal.color} p-[1.5px] shadow-sm motion-safe:animate-pulse`} style={{ animationDelay: `${index * 120}ms` }}>
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900/60 text-sm shadow-inner backdrop-blur-md">{medal.text}</div>
                        </div>
                        {index === 0 && <div className="pointer-events-none absolute inset-0 rounded-full border border-yellow-300 opacity-55 motion-safe:animate-ping" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative h-px bg-transparent">
                <div className="absolute left-[-12px] top-[-12px] z-20 h-6 w-6 rounded-full bg-[#05070a] shadow-inner" />
                <div className="absolute right-[-12px] top-[-12px] z-20 h-6 w-6 rounded-full bg-[#05070a] shadow-inner" />
                <div className="absolute left-4 right-4 top-[-1px] z-10 border-t-2 border-dashed border-[#a1dfcc] opacity-70" />
              </div>

              <div className="relative flex bg-[#f2fbf7] p-6 pt-8 text-left">
                <div className="w-full text-left">
                  <h3 className="mb-1 select-text text-sm font-black tracking-tight text-[#103027]">{cityName} · Route {routeIndex}: {route.title}</h3>
                  <div className="mb-3 font-mono text-[10px] font-extrabold tracking-wider text-[#427365]">{todayDateStr}</div>
                  <div className="border-l-2 border-[#80d0b8] py-1 pl-3">
                    <p className="select-text break-all text-[11px] font-medium italic leading-relaxed text-[#1e5445]">{getCityStoryText(cityName, routeIndex)}</p>
                  </div>
                </div>
              </div>
            </motion.section>

            <div className="flex w-full max-w-sm items-center gap-4 px-1">
              <button onClick={() => routeFinished ? onComplete(result) : onExit()} className="flex-1 rounded-2xl bg-[#cb2027] px-6 py-3.5 text-base font-extrabold tracking-wide text-white shadow-[0_4px_15px_rgba(203,32,39,0.3)] transition-all active:scale-95">
                {routeFinished ? 'Done' : 'Back to Details'}
              </button>
              <button onClick={() => { if (routeFinished) onComplete(result); else { setShowSummary(false); setIsPlaying(true); } }} className="flex-1 rounded-2xl bg-[#26b180] px-6 py-3.5 text-base font-extrabold tracking-wide text-white shadow-[0_4px_15px_rgba(38,177,128,0.3)] transition-all active:scale-95">
                {routeFinished ? 'Next Route' : 'Keep Running'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
