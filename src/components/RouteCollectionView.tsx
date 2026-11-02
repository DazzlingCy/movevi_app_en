import { useMemo, useState, type ReactNode } from 'react';
import {
  Award,
  BookOpen,
  Building2,
  Castle,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Globe2,
  LockKeyhole,
  MapPin,
  Route,
  Sparkles,
  Trees,
  Waves,
  X,
  type LucideIcon
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { CITIES, CONTINENTS_ORDER, getRouteData, type CityData } from '../data/cities';
import CityImage from './CityImage';

const viteBaseUrl = ((import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL || '/');

export type CollectionFilter = 'all' | 'collected' | 'uncollected';
export type CollectionViewMode = 'cards' | 'timeline';
export type RouteCollectionIntent = 'review' | 'collect';
export type RouteCollectibleStatus = 'collected' | 'available' | 'locked' | 'upcoming';
export type LandmarkMedalKind = 'heritage' | 'nature' | 'water' | 'city';

export interface RouteLandmarkMedal {
  name: string;
  kind: LandmarkMedalKind;
  index: number;
}

export interface CollectionViewState {
  viewMode: CollectionViewMode;
  filter: CollectionFilter;
  continent: 'all' | string;
  expandedCityId: string | null;
}

export interface RouteCollectible {
  city: CityData;
  routeIndex: number;
  routeData: ReturnType<typeof getRouteData>;
  status: RouteCollectibleStatus;
  collectedAt: number | null;
  medals: RouteLandmarkMedal[];
}

export interface CityPassportProgress {
  city: CityData;
  collectedCount: number;
  totalCount: number;
  status: 'collecting' | 'lit' | 'unstarted' | 'upcoming';
  latestCollectedAt: number;
  routes: RouteCollectible[];
}

interface RouteCollectionViewProps {
  viewState: CollectionViewState;
  newlyCollectedRouteKey: string | null;
  onViewStateChange: (nextState: CollectionViewState) => void;
  onBack: () => void;
  onOpenCityRoutes: (cityId: string) => void;
  onOpenRoute: (
    cityId: string,
    routeIndex: number,
    image: string,
    intent: RouteCollectionIntent
  ) => void;
  onCollectionCelebrationComplete: () => void;
}

function CollectionNavigationBar({
  title,
  onBack,
  backLabel,
  rightAction
}: {
  title: string;
  onBack: () => void;
  backLabel: string;
  rightAction?: {
    label: string;
    icon: ReactNode;
    onClick: () => void;
  };
}) {
  return (
    <header
      className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#05070A]/78 backdrop-blur-2xl"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="relative flex h-14 items-center justify-between px-4">
        <button
          type="button"
          onClick={onBack}
          className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.055] text-slate-200 transition-colors after:absolute after:-inset-1.5 after:rounded-full hover:bg-white/[0.1] active:bg-white/[0.13] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070A]"
          aria-label={backLabel}
        >
          <ChevronLeft size={20} strokeWidth={2.25} />
        </button>

        <h1 className="pointer-events-none absolute left-1/2 max-w-[48%] -translate-x-1/2 truncate text-center text-base font-bold tracking-[0.08em] text-white">
          {title}
        </h1>

        {rightAction ? (
          <button
            type="button"
            onClick={rightAction.onClick}
            className="relative flex h-8 items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 text-xs font-bold text-cyan-100 transition-colors after:absolute after:-inset-x-1 after:-inset-y-1.5 after:rounded-full hover:bg-cyan-400/20 active:bg-cyan-400/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070A]"
            aria-label={rightAction.label}
          >
            {rightAction.icon}
            <span>{rightAction.label}</span>
          </button>
        ) : (
          <div className="h-8 w-8" aria-hidden="true" />
        )}
      </div>
    </header>
  );
}

const formatCollectedDate = (timestamp: number | null) => {
  if (!timestamp) return "_Other Organiser";
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}Month${date.getDate()}Day`;
};

const getLandmarkMedalKind = (landmarkName: string): LandmarkMedalKind => {
  if (/[湖河江海湾港瀑泉]/.test(landmarkName)) return 'water';
  if (/[山林园谷峰岛]/.test(landmarkName)) return 'nature';
  if (/[宫寺塔门墙祠古钟]/.test(landmarkName)) return 'heritage';
  return 'city';
};

const getRouteLandmarkMedals = (spots: string, cityName: string): RouteLandmarkMedal[] => {
  const landmarks = spots.split(/\s*[—·]\s*/).filter(Boolean);
  return Array.from({ length: 3 }, (_, index) => {
    const name = landmarks[index] || `${cityName}Site${String.fromCharCode(65 + index)}`;
    return { name, kind: getLandmarkMedalKind(name), index: index + 1 };
  });
};

const getPassportStatus = (
  city: CityData,
  collectedCount: number
): CityPassportProgress['status'] => {
  if (city.status === 'upcoming') return 'upcoming';
  if (collectedCount >= city.routes) return 'lit';
  if (collectedCount > 0) return 'collecting';
  return 'unstarted';
};

const getRouteStatus = (
  city: CityData,
  routeIndex: number,
  completedRouteIndices: number[]
): RouteCollectibleStatus => {
  if (city.status === 'upcoming') return 'upcoming';
  if (completedRouteIndices.includes(routeIndex)) return 'collected';
  const lastCompletedRoute = completedRouteIndices.reduce((latest, current) => Math.max(latest, current), 0);
  if (routeIndex === 1 || routeIndex === lastCompletedRoute + 1) return 'available';
  return 'locked';
};

const PASSPORT_STATUS_META: Record<CityPassportProgress['status'], { label: string; tone: string }> = {
  collecting: { label: "Route collection ongoing", tone: 'border-cyan-200/30 bg-cyan-300/12 text-cyan-100' },
  lit: { label: "The card's unlocked.", tone: 'border-emerald-200/30 bg-emerald-300/12 text-emerald-100' },
  unstarted: { label: "To be explored", tone: 'border-white/10 bg-white/[0.06] text-slate-400' },
  upcoming: { label: "It's about to open.", tone: 'border-amber-200/20 bg-amber-300/10 text-amber-100' }
};

export default function RouteCollectionView({
  viewState,
  newlyCollectedRouteKey,
  onViewStateChange,
  onBack,
  onOpenCityRoutes,
  onOpenRoute,
  onCollectionCelebrationComplete
}: RouteCollectionViewProps) {
  const reduceMotion = useReducedMotion();
  const [previewCityId, setPreviewCityId] = useState<string | null>(null);

  const cityPassports = useMemo<CityPassportProgress[]>(() => {
    return CITIES.map(city => {
      const completedRouteIndices = city.completedRouteIndices || [];
      const routes = Array.from({ length: city.routes }, (_, index) => {
        const routeIndex = index + 1;
        const routeData = getRouteData(city.id, routeIndex);
        return {
          city,
          routeIndex,
          routeData,
          status: getRouteStatus(city, routeIndex, completedRouteIndices),
          collectedAt: city.completedRouteTimestamps?.[routeIndex] || null,
          medals: getRouteLandmarkMedals(routeData.spots, city.name)
        } satisfies RouteCollectible;
      });
      const latestCollectedAt = routes.reduce(
        (latest, route) => Math.max(latest, route.collectedAt || 0),
        0
      );
      return {
        city,
        collectedCount: completedRouteIndices.length,
        totalCount: city.routes,
        status: getPassportStatus(city, completedRouteIndices.length),
        latestCollectedAt,
        routes
      };
    }).sort((a, b) => {
      const priority = { lit: 0, collecting: 1, unstarted: 2, upcoming: 3 };
      const priorityDiff = priority[a.status] - priority[b.status];
      if (priorityDiff !== 0) return priorityDiff;
      return b.latestCollectedAt - a.latestCollectedAt;
    });
  }, []);

  const activePassports = cityPassports.filter(passport => passport.status !== 'upcoming');
  const totalCollectibleRoutes = activePassports.reduce((sum, passport) => sum + passport.totalCount, 0);
  const collectedRoutes = activePassports.reduce((sum, passport) => sum + passport.collectedCount, 0);
  const totalRouteMedals = totalCollectibleRoutes * 3;
  const collectedRouteMedals = collectedRoutes * 3;
  const litCities = activePassports.filter(passport => passport.status === 'lit').length;
  const progress = totalCollectibleRoutes > 0 ? Math.round((collectedRoutes / totalCollectibleRoutes) * 100) : 0;

  const availableContinents = CONTINENTS_ORDER.filter(continent =>
    cityPassports.some(passport => passport.city.continent === continent)
  );

  const visiblePassports = cityPassports.filter(passport => {
    if (viewState.continent !== 'all' && passport.city.continent !== viewState.continent) return false;
    return true;
  });

  const timelineRoutes = cityPassports
    .flatMap(passport => passport.routes)
    .filter(route => route.status === 'collected')
    .sort((a, b) => (b.collectedAt || 0) - (a.collectedAt || 0));

  const selectedPassport = cityPassports.find(passport => passport.city.id === viewState.expandedCityId);
  const previewPassport = cityPassports.find(passport => passport.city.id === previewCityId);

  if (selectedPassport) {
    return (
      <CityCollectionDetailPage
        passport={selectedPassport}
        newlyCollectedRouteKey={newlyCollectedRouteKey}
        reduceMotion={Boolean(reduceMotion)}
        onBack={() => onViewStateChange({ ...viewState, expandedCityId: null })}
        onOpenRoute={onOpenRoute}
        onCollectionCelebrationComplete={onCollectionCelebrationComplete}
      />
    );
  }

  if ((viewState.viewMode || 'cards') === 'timeline') {
    return (
      <div className="relative h-full w-full overflow-y-auto bg-[#05070A] pb-24 text-slate-100 hide-scrollbar">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.16),transparent_38%)]" />
        <CollectionNavigationBar
          title="Light up the record."
          onBack={() => onViewStateChange({ ...viewState, viewMode: 'cards', filter: 'all', continent: 'all', expandedCityId: null })}
          backLabel="Return to City Card"
        />
        <main className="relative z-10 px-5 py-1">
          <CompletionTimeline routes={timelineRoutes} onOpenRoute={onOpenRoute} />
        </main>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-y-auto bg-[#05070A] pb-24 text-slate-100 hide-scrollbar">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_95%_12%,rgba(251,191,36,0.12),transparent_35%)]" />

      <CollectionNavigationBar
        title="Urban map"
        onBack={onBack}
        backLabel="Back"
        rightAction={{
          label: "Light up the record.",
          icon: <Clock3 size={14} strokeWidth={2.25} />,
          onClick: () => onViewStateChange({ ...viewState, viewMode: 'timeline', filter: 'all', continent: 'all', expandedCityId: null })
        }}
      />

      <main className="relative z-10 px-5 py-4">
        <section className="relative overflow-hidden rounded-[30px] border border-cyan-200/20 bg-[#08131e]/95 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.08),transparent_38%),radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.18),transparent_38%)]" />
          <div className="pointer-events-none absolute bottom-4 left-4 top-4 border-l border-dashed border-cyan-100/15" />
          <div className="relative pl-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.24em] text-cyan-200/70">
                  <BookOpen size={13} />
                  MOVEVI ROUTE PASSPORT
                </div>
                <h2 className="mt-2 text-[28px] font-black tracking-[-0.05em] text-white">{"World Urban Collection"}</h2>
                <p className="mt-1 text-[11px] font-bold text-slate-500">{"Completion of the urban route, collection of site decorations, unlocking of the city-specific cards."}</p>
              </div>
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-cyan-200/40 bg-black shadow-[0_0_25px_rgba(34,211,238,0.18)]">
                <img
                  src={`${viteBaseUrl}globe/earth-passport.jpg`}
                  alt="Earth."
                  className="h-full w-full scale-110 object-cover"
                  decoding="async"
                />
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-3xl font-black tracking-[-0.06em] text-cyan-100">
                  {litCities}<span className="text-base text-slate-500">/{activePassports.length}</span>
                </p>
                <p className="mt-0.5 text-[10px] font-bold text-slate-500">{"City card"}</p>
              </div>
              <div className="grid grid-cols-2 gap-5 text-right">
                <div>
                  <p className="font-mono text-lg font-black text-white">{collectedRoutes}/{totalCollectibleRoutes}</p>
                  <p className="text-[9px] font-bold text-slate-600">{"Urban route"}</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-black text-white">{collectedRouteMedals}/{totalRouteMedals}</p>
                  <p className="text-[9px] font-bold text-slate-600">{"Order of Routes"}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950/80" aria-label={`Figure progress${progress}%`}>
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-cyan-300 to-emerald-300"
                initial={reduceMotion ? false : { width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: reduceMotion ? 0 : 0.55, ease: 'easeOut' }}
              />
            </div>
          </div>
        </section>

        <div className="-mx-5 mt-3 overflow-x-auto px-5 pb-1 hide-scrollbar" aria-label="Intercontinental Filter">
          <div className="flex w-max gap-2">
            {['all', ...availableContinents].map(continent => {
              const active = viewState.continent === continent;
              return (
                <button
                  key={continent}
                  type="button"
                  onClick={() => onViewStateChange({ ...viewState, continent })}
                  className={`min-h-10 rounded-full border px-4 text-[11px] font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                    active
                      ? 'border-cyan-200/35 bg-cyan-300/12 text-cyan-100'
                      : 'border-white/10 bg-white/[0.035] text-slate-500'
                  }`}
                >
                  {continent === 'all' ? "All regions" : continent}
                </button>
              );
            })}
          </div>
        </div>

        <section className="mt-4" aria-labelledby="passport-list-title">
          <div className="mb-3">
            <h2 id="passport-list-title" className="text-base font-black text-white">{"City and city cards"}</h2>
          </div>

          {visiblePassports.length === 0 ? (
            <EmptyCollectionState
              onReset={() => onViewStateChange({ viewMode: 'cards', filter: 'all', continent: 'all', expandedCityId: null })}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {visiblePassports.map(passport => (
                <CityCollectionTile
                  key={passport.city.id}
                  passport={passport}
                  onOpen={() => setPreviewCityId(passport.city.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {previewPassport && (
        <CityCardPreviewDialog
          passport={previewPassport}
          reduceMotion={Boolean(reduceMotion)}
          onClose={() => setPreviewCityId(null)}
          onOpenRoutes={() => {
            setPreviewCityId(null);
            if (previewPassport.status === 'lit') {
              onViewStateChange({ ...viewState, expandedCityId: previewPassport.city.id });
            } else {
              onOpenCityRoutes(previewPassport.city.id);
            }
          }}
        />
      )}
    </div>
  );
}

function CityCollectionTile({
  passport,
  onOpen
}: {
  key?: string;
  passport: CityPassportProgress;
  onOpen: () => void;
}) {
  const statusMeta = PASSPORT_STATUS_META[passport.status];
  const unlocked = passport.status === 'lit';
  const collecting = passport.status === 'collecting';

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onOpen}
      className={`group block w-full min-w-0 overflow-hidden rounded-[24px] border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
        unlocked
          ? 'border-amber-100/40 bg-[#12110d] shadow-[0_18px_46px_rgba(0,0,0,0.34),0_0_24px_rgba(251,191,36,0.08)] hover:border-amber-100/60'
          : collecting
            ? 'border-cyan-200/18 bg-[#081018]/96 shadow-[0_16px_42px_rgba(0,0,0,0.28)] hover:border-cyan-200/30'
            : 'border-white/[0.06] bg-[#080b10]/96 shadow-[0_14px_36px_rgba(0,0,0,0.22)] hover:border-white/12'
      }`}
      aria-label={`View${passport.city.name}Urban collection, completed${passport.collectedCount}/${passport.totalCount}A route.`}
    >
      <div className="relative h-[210px] overflow-hidden bg-slate-900">
        <CityImage
          src={passport.city.image}
          alt={passport.city.name}
          fallbackLabel={passport.city.name}
          className={`h-full w-full object-cover transition duration-500 ${
            unlocked
              ? 'opacity-90 saturate-125 contrast-105 group-hover:scale-105'
              : collecting
                ? 'grayscale-[0.45] opacity-48 group-hover:scale-105'
                : 'grayscale opacity-25 group-hover:scale-105'
          }`}
        />
        <div className={`absolute inset-0 ${unlocked ? 'bg-gradient-to-t from-[#12110d] via-transparent to-amber-950/15' : 'bg-gradient-to-t from-[#080b10] via-slate-950/20 to-black/45'}`} />
        <span className={`absolute left-3 top-3 rounded-full border px-2 py-1 text-[8px] font-black backdrop-blur-md ${statusMeta.tone}`}>{statusMeta.label}</span>
        {!unlocked && (
          <span className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md ${collecting ? 'border-cyan-100/25 bg-cyan-950/50 text-cyan-100/65' : 'border-slate-600/45 bg-slate-950/65 text-slate-500'}`} aria-label="City card un unlocked">
            <LockKeyhole size={14} />
          </span>
        )}
        <div className="absolute inset-x-3 bottom-3 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={`truncate text-[9px] font-black tracking-[0.15em] ${unlocked ? 'text-amber-100/75' : 'text-slate-500'}`}>{passport.city.continent}</p>
            {unlocked && (
              <span className="shrink-0 font-mono text-[7px] font-black tracking-[0.12em] text-white/35">NO.{passport.city.id.padStart(3, '0')}</span>
            )}
          </div>
          <h3 className={`mt-1 truncate text-[24px] font-black tracking-[-0.05em] ${unlocked ? 'text-white' : 'text-slate-300'}`}>{passport.city.name}</h3>
          <p className={`truncate font-mono text-[8px] uppercase tracking-[0.16em] ${unlocked ? 'text-amber-100/50' : 'text-slate-600'}`}>{passport.city.englishName}</p>
        </div>
      </div>

      <div className={`border-t px-3 py-3 ${unlocked ? 'border-amber-100/12 bg-amber-300/[0.035]' : 'border-white/[0.04]'}`}>
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[8px] font-black tracking-[0.12em] text-slate-600">{"City card"}</p>
            <p className={`mt-0.5 truncate text-[10px] font-black ${unlocked ? 'text-amber-100' : collecting ? 'text-cyan-100/70' : 'text-slate-500'}`}>
              {unlocked ? "Collected" : passport.status === 'upcoming' ? "Wait for the opening." : "To Unlock"}
            </p>
          </div>
          <div className={`flex shrink-0 items-center gap-0.5 ${unlocked ? 'text-amber-100/65' : 'text-slate-600'}`}>
            <span className="font-mono text-[9px] font-black">{"Route"} {passport.collectedCount}/{passport.totalCount}</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

const getLocalDateKey = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const getTimelineDateLabel = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (getLocalDateKey(timestamp) === getLocalDateKey(today.getTime())) return "Today";
  if (getLocalDateKey(timestamp) === getLocalDateKey(yesterday.getTime())) return "Yesterday.";
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', weekday: 'short' });
};

function CompletionTimeline({
  routes,
  onOpenRoute
}: {
  routes: RouteCollectible[];
  onOpenRoute: RouteCollectionViewProps['onOpenRoute'];
}) {
  const groups = routes.reduce<Array<{ key: string; label: string; routes: RouteCollectible[] }>>((result, route) => {
    const timestamp = route.collectedAt || 0;
    const key = timestamp ? getLocalDateKey(timestamp) : 'unknown';
    const existing = result.find(group => group.key === key);
    if (existing) {
      existing.routes.push(route);
    } else {
      result.push({ key, label: timestamp ? getTimelineDateLabel(timestamp) : "Time to Sync", routes: [route] });
    }
    return result;
  }, []);

  return (
    <section className="mt-5" aria-label="Light up the record.">
      {groups.length === 0 ? (
        <div className="rounded-[26px] border border-white/10 bg-white/[0.035] px-6 py-9 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
            <Clock3 size={24} />
          </div>
          <p className="mt-4 text-sm font-black text-white">{"There's no light yet."}</p>
          <p className="mt-2 text-[11px] font-bold text-slate-500">{"When the first route is completed, the corresponding time will be shown here."}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(group => (
            <section key={group.key} aria-label={`${group.label}Light up the route.`}>
              <div className="mb-2 flex items-center justify-between pl-1">
                <h3 className="text-xs font-black text-slate-300">{group.label}</h3>
                <span className="font-mono text-[9px] font-bold text-slate-600">{group.routes.length} {"Article Completed"}</span>
              </div>
              <div className="relative space-y-2 before:absolute before:bottom-5 before:left-[34px] before:top-5 before:w-px before:bg-gradient-to-b before:from-cyan-300/35 before:to-transparent">
                {group.routes.map(route => (
                  <button
                    key={`${route.city.id}-${route.routeIndex}-${route.collectedAt}`}
                    type="button"
                    onClick={() => onOpenRoute(route.city.id, route.routeIndex, route.city.image, 'review')}
                    className="relative flex min-h-[92px] w-full items-center gap-3 rounded-[22px] border border-white/[0.08] bg-[#091019]/92 p-3 text-left transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                    aria-label={`View${route.city.name}${route.routeData.title}The route of memory,${route.collectedAt ? new Date(route.collectedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : "Completion time to sync"}`}
                  >
                    <span className="relative z-10 flex w-11 shrink-0 flex-col items-center">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan-100/35 bg-cyan-950 text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.14)]">
                        <Clock3 size={12} />
                      </span>
                      <span className="mt-1 font-mono text-[9px] font-black text-cyan-100/70">
                        {route.collectedAt ? new Date(route.collectedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}
                      </span>
                    </span>

                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[16px] border border-white/10 bg-slate-900">
                      <CityImage src={route.city.image} alt="" fallbackLabel={route.city.name} className="h-full w-full object-cover opacity-70" />
                      <span className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                      <span className="absolute inset-x-1 bottom-1 truncate text-center text-[8px] font-black text-white">{route.city.name}</span>
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[9px] font-black tracking-[0.1em] text-amber-100/60">{"Route"} {String(route.routeIndex).padStart(2, '0')} {":: 3 medals"}</span>
                      <span className="mt-1 block truncate text-[13px] font-black text-white">{route.routeData.title}</span>
                      <span className="mt-2 flex items-center gap-2 text-[9px] font-bold text-slate-600">
                        <span>{route.routeData.distance} km</span>
                        <span className="h-1 w-1 rounded-full bg-slate-700" />
                        <span>{"Completed"}</span>
                      </span>
                    </span>
                    <ChevronRight size={16} className="shrink-0 text-slate-600" />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

function CityCardPreviewDialog({
  passport,
  reduceMotion,
  onClose,
  onOpenRoutes
}: {
  passport: CityPassportProgress;
  reduceMotion: boolean;
  onClose: () => void;
  onOpenRoutes: () => void;
}) {
  const unlocked = passport.status === 'lit';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/78 p-5 backdrop-blur-md"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      onKeyDown={event => {
        if (event.key === 'Escape') onClose();
      }}
      role="presentation"
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="city-card-dialog-title"
        initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
        onClick={event => event.stopPropagation()}
        className={`relative max-h-full w-full max-w-[340px] overflow-y-auto rounded-[30px] border p-3 shadow-[0_30px_90px_rgba(0,0,0,0.65)] hide-scrollbar ${unlocked ? 'border-amber-100/30 bg-[#12110d]' : 'border-white/12 bg-[#080b10]'}`}
      >
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          aria-label="Close City Card Details"
        >
          <X size={19} />
        </button>

        <div className={`relative h-[430px] overflow-hidden rounded-[23px] border bg-slate-950 ${unlocked ? 'border-amber-100/30' : 'border-white/[0.08]'}`}>
          <CityImage
            src={passport.city.image}
            alt={`${passport.city.name}City card details`}
            fallbackLabel={passport.city.name}
            className={`absolute inset-0 h-full w-full object-cover ${unlocked ? 'opacity-90 saturate-125 contrast-105' : 'grayscale opacity-22'}`}
          />
          <div className={`absolute inset-0 ${unlocked ? 'bg-[linear-gradient(0deg,rgba(18,17,13,0.96),rgba(18,17,13,0.02)_72%),linear-gradient(120deg,rgba(3,7,18,0.1),rgba(69,48,8,0.42))]' : 'bg-[linear-gradient(0deg,rgba(3,7,18,0.98),rgba(3,7,18,0.25)_72%),linear-gradient(120deg,rgba(3,7,18,0.45),rgba(3,7,18,0.82))]'}`} />
          <div className="relative flex h-full flex-col justify-between p-6">
            <div>
              <p className="text-[9px] font-black tracking-[0.24em] text-cyan-100/70">MOVEVI CITY CARD</p>
              {unlocked && (
                <p className="mt-1 font-mono text-[9px] tracking-[0.12em] text-white/40">NO. {passport.city.id.padStart(3, '0')}</p>
              )}
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-100/55">{passport.city.englishName}</p>
                  <h2 id="city-card-dialog-title" className="mt-1 truncate text-[38px] font-black tracking-[-0.06em] text-white">{passport.city.name}</h2>
                </div>
                <div className={`flex h-14 w-14 shrink-0 -rotate-6 flex-col items-center justify-center rounded-full border-2 ${unlocked ? 'border-amber-100/60 bg-amber-950/55 text-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.18)]' : 'border-slate-600/60 bg-slate-950/60 text-slate-500'}`}>
                  {unlocked ? <Sparkles size={18} /> : <LockKeyhole size={18} />}
                  <span className="mt-1 text-[7px] font-black">{unlocked ? "Collected" : "To Unlock"}</span>
                </div>
              </div>
              <p className="line-clamp-3 text-[10px] font-bold leading-5 text-slate-300/70">{passport.city.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-[9px] font-bold text-slate-400">{"Progress of urban routes"}</span>
                <span className="font-mono text-sm font-black text-white">{passport.collectedCount}/{passport.totalCount}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenRoutes}
          className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-[18px] bg-cyan-300 px-5 text-xs font-black text-slate-950 transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100"
          aria-label={unlocked ? `View${passport.city.name}Order of Routes` : `View${passport.city.name}Urban route`}
        >
          {unlocked ? "Look at the medals." : "View urban routes"}
          <ChevronRight size={16} />
        </button>
      </motion.section>
    </motion.div>
  );
}

function CityCollectionDetailPage({
  passport,
  newlyCollectedRouteKey,
  reduceMotion,
  onBack,
  onOpenRoute,
  onCollectionCelebrationComplete
}: {
  passport: CityPassportProgress;
  newlyCollectedRouteKey: string | null;
  reduceMotion: boolean;
  onBack: () => void;
  onOpenRoute: RouteCollectionViewProps['onOpenRoute'];
  onCollectionCelebrationComplete: () => void;
}) {
  return (
    <div className="relative h-full w-full overflow-y-auto bg-[#05070A] pb-24 text-slate-100 hide-scrollbar">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.2),transparent_36%),radial-gradient(circle_at_95%_8%,rgba(251,191,36,0.1),transparent_34%)]" />

      <CollectionNavigationBar title={`${passport.city.name}Collection`} onBack={onBack} backLabel="Return to City Collection" />

      <main className="relative z-10 px-5 py-4">
        {passport.status === 'upcoming' && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-200/10 bg-amber-300/[0.06] px-3 py-3 text-[10px] font-bold text-amber-100/65">
            <Clock3 size={14} />
            {"The route is being drawn up and, when open, can be added to the optical passport."}
          </div>
        )}

        <CityCardReward
          passport={passport}
          justUnlocked={passport.status === 'lit' && Boolean(newlyCollectedRouteKey?.startsWith(`${passport.city.id}-`))}
          reduceMotion={reduceMotion}
        />

        <section className="mt-5" aria-labelledby="city-routes-title">
          <div className="mb-3 flex items-end justify-between gap-3 px-1">
            <h2 id="city-routes-title" className="text-base font-black text-white">{"Order of the City Routes and Routes"}</h2>
            <span className="text-[10px] font-bold text-slate-500">{passport.collectedCount * 3}/{passport.totalCount * 3} {"Quantum"}</span>
          </div>
          <div className="space-y-2">
            {passport.routes.map(route => (
              <RouteVisa
                key={`${route.city.id}-${route.routeIndex}`}
                route={route}
                isNewlyCollected={newlyCollectedRouteKey === `${route.city.id}-${route.routeIndex}`}
                reduceMotion={reduceMotion}
                onOpenRoute={onOpenRoute}
                onCollectionCelebrationComplete={onCollectionCelebrationComplete}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const MEDAL_ICON_MAP: Record<LandmarkMedalKind, LucideIcon> = {
  heritage: Castle,
  nature: Trees,
  water: Waves,
  city: Building2
};

function CityCardReward({
  passport,
  justUnlocked,
  reduceMotion
}: {
  passport: CityPassportProgress;
  justUnlocked: boolean;
  reduceMotion: boolean;
}) {
  const unlocked = passport.status === 'lit';
  const upcoming = passport.status === 'upcoming';

  if (unlocked) {
    return (
      <section className="mb-3" aria-label={`${passport.city.name}City card`}>
        <div className="mb-2 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-[10px] font-black tracking-[0.14em] text-amber-100/80">
            <Award size={13} />
            {"City card prize"}
          </div>
          <span className="text-[9px] font-bold text-emerald-100/70">{"All urban routes completed"}</span>
        </div>
        <motion.div
          initial={justUnlocked && !reduceMotion ? { opacity: 0, scale: 0.88, rotateY: -12 } : false}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, ease: 'easeOut' }}
          className="relative min-h-[190px] overflow-hidden rounded-[24px] border border-amber-100/25 bg-slate-950 shadow-[0_18px_44px_rgba(0,0,0,0.35),0_0_28px_rgba(34,211,238,0.08)]"
        >
          <CityImage
            src={passport.city.image}
            alt={`${passport.city.name}City card`}
            fallbackLabel={passport.city.name}
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(3,7,18,0.18),rgba(3,7,18,0.88)_72%),linear-gradient(0deg,rgba(3,7,18,0.88),transparent_66%)]" />
          <div className="relative flex min-h-[190px] flex-col justify-between p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[9px] font-black tracking-[0.22em] text-amber-100/75">MOVEVI CITY CARD</p>
                <p className="mt-1 font-mono text-[9px] text-white/45">NO. {passport.city.id.padStart(3, '0')}</p>
              </div>
              <div className="flex h-12 w-12 -rotate-6 flex-col items-center justify-center rounded-full border-2 border-cyan-100/50 bg-cyan-950/35 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.2)]">
                <Sparkles size={15} />
                <span className="mt-0.5 text-[7px] font-black">{"A light badge."}</span>
              </div>
            </div>

            <div>
              <h4 className="text-[30px] font-black tracking-[-0.05em] text-white drop-shadow-lg">{passport.city.name}</h4>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/65">{passport.city.englishName}</p>
              <div className="mt-3 flex justify-end">
                <span className="rounded-full border border-emerald-200/25 bg-emerald-300/12 px-3 py-1.5 text-[9px] font-black text-emerald-100">{"Light the city up."}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="mb-3 overflow-hidden rounded-[20px] border border-dashed border-white/10 bg-white/[0.025] p-3" aria-label={`${passport.city.name}City card to be unlocked.`}>
      <div className="flex items-center gap-3">
        <div className="relative flex h-[76px] w-[64px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-white/10 bg-slate-950">
          <CityImage
            src={passport.city.image}
            alt=""
            fallbackLabel={passport.city.name}
            className="absolute inset-0 h-full w-full object-cover opacity-15 grayscale"
          />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/50 bg-slate-950/70 text-slate-500">
            {upcoming ? <Clock3 size={16} /> : <LockKeyhole size={16} />}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] font-black tracking-[0.16em] text-slate-600">{"City card prize"}</p>
              <h4 className="mt-0.5 text-[13px] font-black text-slate-300">{upcoming ? "It'll be open to explore." : `Completed${passport.totalCount}Unlocking a city route`}</h4>
            </div>
            <span className="font-mono text-[10px] font-black text-slate-500">{passport.collectedCount}/{passport.totalCount}</span>
          </div>
          <div className="mt-2 flex justify-end">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/60 text-slate-600" aria-label="The light badge hasn't been unlocked.">
              <Sparkles size={13} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandmarkMedal({
  route,
  medal,
  compact = false
}: {
  route: RouteCollectible;
  medal: RouteLandmarkMedal;
  compact?: boolean;
}) {
  const Icon = MEDAL_ICON_MAP[medal.kind];
  const collected = route.status === 'collected';
  const available = route.status === 'available';

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full border-2 ${compact ? 'h-8 w-8' : 'h-[66px] w-[66px]'} ${
        collected
          ? 'border-amber-200/55 bg-[radial-gradient(circle_at_35%_30%,rgba(254,240,138,0.32),rgba(15,23,42,0.96)_68%)] text-amber-100 shadow-[0_0_22px_rgba(251,191,36,0.14)]'
          : available
            ? 'border-cyan-200/35 bg-cyan-950/55 text-cyan-100'
            : 'border-slate-700/70 bg-slate-950 text-slate-600'
      }`}
      title={`${medal.name}Order of Routes${collected ? ", acquired" : "not obtained"}`}
      aria-hidden="true"
    >
      <span className={`absolute inset-1 rounded-full border ${collected ? 'border-amber-100/20' : 'border-white/[0.05]'}`} />
      <Icon size={compact ? 13 : 25} strokeWidth={collected ? 2.3 : 1.8} className="relative" />
      {!compact && (
        <span className={`absolute -bottom-1 flex h-5 min-w-5 items-center justify-center rounded-full border px-1 font-mono text-[8px] font-black ${
          collected ? 'border-amber-100/35 bg-amber-200 text-slate-950' : 'border-slate-700 bg-slate-900 text-slate-500'
        }`}>
          {medal.index}
        </span>
      )}
    </div>
  );
}

function RouteVisa({
  route,
  isNewlyCollected,
  reduceMotion,
  onOpenRoute,
  onCollectionCelebrationComplete
}: {
  key?: string;
  route: RouteCollectible;
  isNewlyCollected: boolean;
  reduceMotion: boolean;
  onOpenRoute: RouteCollectionViewProps['onOpenRoute'];
  onCollectionCelebrationComplete: () => void;
}) {
  const interactive = route.status === 'collected' || route.status === 'available';
  const intent: RouteCollectionIntent = route.status === 'collected' ? 'review' : 'collect';
  const content = (
    <span className="block min-w-0 w-full">
        <span className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-baseline gap-2">
            <span className={`shrink-0 font-mono text-[10px] font-black tracking-[0.08em] ${route.status === 'collected' ? 'text-amber-100/65' : 'text-slate-600'}`}>
              {String(route.routeIndex).padStart(2, '0')}
            </span>
            <span className={`truncate text-[13px] font-black ${interactive ? 'text-white' : 'text-slate-500'}`}>{route.routeData.title}</span>
          </span>
          {route.status === 'available' && (
            <span className="shrink-0 rounded-full border border-cyan-200/25 bg-cyan-300/10 px-2 py-1 text-[8px] font-black text-cyan-100">{"Explore"}</span>
          )}
        </span>

        <span className="mt-3 grid grid-cols-3 gap-2" aria-label={`${route.routeData.title}Including 3 Orders of Routes`}>
          {route.medals.map(medal => (
            <span key={`${route.city.id}-${route.routeIndex}-medal-${medal.index}`} className={`flex min-w-0 flex-col items-center rounded-[14px] border px-1.5 py-2 ${route.status === 'collected' ? 'border-amber-100/12 bg-amber-300/[0.035]' : route.status === 'available' ? 'border-cyan-100/10 bg-cyan-300/[0.025]' : 'border-white/[0.05] bg-black/10'}`}>
              <LandmarkMedal route={route} medal={medal} compact />
              <span title={medal.name} className={`mt-1.5 block w-full truncate text-center text-[8px] font-black ${route.status === 'collected' ? 'text-amber-100/75' : route.status === 'available' ? 'text-cyan-100/65' : 'text-slate-600'}`}>
                {medal.name}
              </span>
            </span>
          ))}
        </span>

        <span className="mt-3 flex items-center justify-between gap-3 text-[9px] font-bold text-slate-600">
          <span>
          {route.status === 'collected' && <span>{"Completed on"} {formatCollectedDate(route.collectedAt)}</span>}
          {route.status === 'locked' && <span>{"Finish the route."} {route.routeIndex - 1} {"Unlock After"}</span>}
          {route.status === 'upcoming' && <span>{"It's about to open."}</span>}
          </span>
          {interactive && (
            <span className={`flex items-center gap-1 font-black ${route.status === 'available' ? 'text-cyan-200' : 'text-slate-400'}`}>
              {route.status === 'available' ? "Go collect it." : "Check for memories"}
              {route.status === 'available' ? <Route size={13} /> : <ChevronRight size={13} />}
            </span>
          )}
        </span>
    </span>
  );

  const sharedClassName = `relative block min-h-[150px] w-full overflow-hidden rounded-[20px] border p-3.5 text-left ${
    route.status === 'collected'
      ? 'border-emerald-200/14 bg-emerald-300/[0.045]'
      : route.status === 'available'
        ? 'border-cyan-200/28 bg-cyan-300/[0.07] shadow-[0_10px_30px_rgba(34,211,238,0.07)]'
        : 'border-white/[0.06] bg-white/[0.025]'
  }`;

  return (
    <div className="relative">
      {interactive ? (
        <button
          type="button"
          onClick={() => onOpenRoute(route.city.id, route.routeIndex, route.city.image, intent)}
          className={`${sharedClassName} transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300`}
          aria-label={`${intent === 'review' ? "Checking course memories." : "Go collect the route."}：${route.routeData.title}`}
        >
          {content}
        </button>
      ) : (
        <div className={sharedClassName} aria-label={`${route.routeData.title}，${route.status === 'upcoming' ? "It's about to open." : "Not unlocked yet"}`}>
          {content}
        </div>
      )}

      {isNewlyCollected && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[20px] bg-cyan-950/35"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.35, rotate: -12 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [1.35, 0.92, 1, 1], rotate: [-12, -7, -7, -7] }}
          transition={{ duration: reduceMotion ? 0.01 : 1.25, times: [0, 0.28, 0.72, 1] }}
          onAnimationComplete={onCollectionCelebrationComplete}
          aria-hidden="true"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-cyan-100/80 text-center text-xs font-black leading-tight text-cyan-50 shadow-[0_0_32px_rgba(34,211,238,0.32)]">
            {"Light"}<br />{"Book"}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function EmptyCollectionState({
  onReset
}: {
  onReset: () => void;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.035] px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
        <Globe2 size={24} />
      </div>
      <p className="mt-4 text-sm font-black text-white">{"There are no cities in the region."}</p>
      <p className="mx-auto mt-2 max-w-[240px] text-[11px] font-bold leading-5 text-slate-500">
        {"The search for the next city continues by changing the area or checking all passports."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 min-h-11 rounded-full bg-cyan-300 px-5 text-xs font-black text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100"
      >
        {"Check all passports"}
      </button>
    </div>
  );
}
