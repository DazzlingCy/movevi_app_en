export interface GlowRank {
  level: number;
  name: string;
  threshold: number;
  color: string;
}

export const GLOW_RANKS: GlowRank[] = [
  { level: 1, name: 'Bronze', threshold: 0, color: 'from-orange-300 to-amber-700' },
  { level: 2, name: 'Silver', threshold: 80, color: 'from-slate-100 to-slate-400' },
  { level: 3, name: 'Gold', threshold: 120, color: 'from-amber-200 to-yellow-500' },
  { level: 4, name: 'Diamond', threshold: 300, color: 'from-cyan-200 to-blue-500' },
  { level: 5, name: 'Starlight', threshold: 600, color: 'from-fuchsia-200 to-violet-500' },
  { level: 6, name: 'Crown', threshold: 1000, color: 'from-rose-200 to-amber-300' },
];

export const getGlowRank = (lifetimeLightValue = 0) => {
  const currentIndex = GLOW_RANKS.reduce((result, rank, index) => {
    return lifetimeLightValue >= rank.threshold ? index : result;
  }, 0);
  const current = GLOW_RANKS[currentIndex];
  const next = GLOW_RANKS[currentIndex + 1] || null;
  const currentBase = current.threshold;
  const nextBase = next?.threshold ?? current.threshold;
  const progress = next
    ? Math.min(100, Math.max(0, ((lifetimeLightValue - currentBase) / (nextBase - currentBase)) * 100))
    : 100;

  return {
    current,
    next,
    progress,
    remaining: next ? Math.max(0, next.threshold - lifetimeLightValue) : 0,
  };
};

export const getGlowWheelDailyExchangeLimit = (rankLevel = 1) => {
  if (rankLevel >= 5) return 3;
  if (rankLevel >= 3) return 2;
  return 1;
};

export const GLOW_WHEEL_EXCHANGE_RULE_TEXT =
  'Daily exchange limit: Bronze/Silver 1 draw, Gold/Diamond 2 draws, Starlight/Crown 3 draws.';
