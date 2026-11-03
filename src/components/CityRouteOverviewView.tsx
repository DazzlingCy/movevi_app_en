import StickyHeroNav from './StickyHeroNav';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Download,
  FileText,
  Flame,
  Images,
  MapPin,
  MessageCircle,
  Route,
  Share2,
  Timer,
  Trophy,
  X
} from 'lucide-react';
import type { CityData } from '../data/cities';
import { getRouteData } from '../data/cities';
import CityImage from './CityImage';
import type { CityRouteListItem } from './CityRoutesView';

interface CityRouteOverviewViewProps {
  city: CityData;
  routeItems?: CityRouteListItem[];
  onBack: () => void;
  browseOnly?: boolean;
}

type OverviewRoute = CityRouteListItem & {
  order: number;
  completed: boolean;
  unlocked: boolean;
  spotNames: string[];
  distanceKm: number;
  durationMinutes: number;
};

const durationToMinutes = (duration: string) => {
  const [minutes = 0, seconds = 0] = duration.split(':').map(Number);
  return minutes + seconds / 60;
};

const formatMinutes = (minutes: number) => {
  const rounded = Math.round(minutes);
  if (rounded < 60) return `${rounded}min`;
  const hours = Math.floor(rounded / 60);
  const rest = rounded % 60;
  return rest ? `${hours}Hours${rest}min` : `${hours}Hours`;
};

const formatDurationMetric = (minutes: number) => {
  const rounded = Math.round(minutes);
  if (rounded < 60) return { value: `${rounded}`, unit: "min" };
  const hours = Math.floor(rounded / 60);
  const rest = rounded % 60;
  return { value: `${hours}`, unit: rest ? `Hours${rest}min` : "Hours" };
};

export default function CityRouteOverviewView({
  city,
  routeItems,
  onBack,
  browseOnly = false
}: CityRouteOverviewViewProps) {
  const [showReport, setShowReport] = useState(false);
  const overview = useMemo(() => {
    const routes: OverviewRoute[] = Array.from({ length: routeItems?.length ?? Math.max(city.routes, 3) }, (_, index) => {
      const order = index + 1;
      const item: CityRouteListItem = routeItems?.[index] ?? getRouteData(city.id, order);
      return {
        ...item,
        order,
        completed: browseOnly ? false : Boolean(item.isCompleted),
        unlocked: browseOnly || item.isUnlocked || order === 1,
        spotNames: item.spots.split(/\s*[—–]\s*/).filter(Boolean),
        distanceKm: Number.parseFloat(item.distance) || 0,
        durationMinutes: durationToMinutes(item.duration)
      };
    });

    const uniqueSpots = new Set(routes.flatMap(route => route.spotNames));
    const completedCount = routes.filter(route => route.completed).length;
    const currentRoute = routes.find(route => !route.completed && route.unlocked)
      ?? routes.find(route => !route.completed)
      ?? null;
    const totals = routes.reduce((sum, route) => ({
      distance: sum.distance + route.distanceKm,
      duration: sum.duration + route.durationMinutes,
      calories: sum.calories + (Number.parseFloat(route.calories) || 0),
    }), { distance: 0, duration: 0, calories: 0 });

    return {
      routes,
      completedCount,
      currentRoute,
      uniqueSpotCount: uniqueSpots.size,
      totals
    };
  }, [browseOnly, city, routeItems]);
  const totalDurationMetric = formatDurationMetric(overview.totals.duration);
  const cityCompleted = overview.routes.length > 0 && overview.completedCount === overview.routes.length;

  if (showReport && cityCompleted) {
    return <CityReportView city={city} overview={overview} onBack={() => setShowReport(false)} />;
  }

  return (
    <main className="h-full w-full overflow-y-auto bg-[#f2f4f7] text-slate-900 hide-scrollbar" id="main-content">
      <StickyHeroNav transparent>
        <button
          type="button"
          onClick={onBack}
          aria-label="List of return urban routes"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronLeft size={26} />
        </button>
      </StickyHeroNav>
      <header className="relative min-h-[272px] overflow-hidden bg-slate-950 text-white">
        <CityImage src={city.image} alt="" fallbackLabel={city.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,13,.36),rgba(5,8,13,.48)_40%,rgba(5,8,13,.94))]" />

        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-11">
          <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-orange-200"><Route size={14} /> {"Overview of routes"}</span>
          <p className="mt-3 max-w-[330px] text-[12px] leading-5 text-white/72">{"You can see the city's route, the attractions and the strength of your movement."}</p>
        </div>
      </header>

      <div className="relative z-20 -mt-7 space-y-4 px-4 pb-12">
        <section className="rounded-[24px] border border-white bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,.10)]" aria-label="Overview of the urban route plan">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-[24px] font-black tracking-[-.04em]">{city.name}{"Overview of routes"}</h1>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-500"><Route size={19} /></span>
          </div>
          <div className="mt-4 grid grid-cols-4 divide-x divide-slate-100">
            <OverviewMetric label="Route" value={`${overview.routes.length}`} unit="Article" />
            <OverviewMetric label="View" value={`${overview.uniqueSpotCount}`} unit="Location" />
            <OverviewMetric label="mileage" value={overview.totals.distance.toFixed(1)} unit="km" />
            <OverviewMetric label="Length" value={totalDurationMetric.value} unit={totalDurationMetric.unit} />
          </div>
          {!browseOnly && <div className="mt-4 border-t border-slate-100 pt-3" aria-label={`Currently completed${overview.completedCount} / ${overview.routes.length}Part of the route`}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-semibold text-slate-500">{"Current progress"} <strong className="ml-1 text-[12px] font-black text-slate-800">{overview.completedCount}/{overview.routes.length}</strong></span>
              <span className="min-w-0 truncate text-right text-[9px] font-semibold text-orange-600">{overview.currentRoute ? `Next paragraph...${String(overview.currentRoute.order).padStart(2, '0')} ${overview.currentRoute.title}` : "The city route is complete."}</span>
            </div>
            <div className="mt-2 grid grid-cols-10 gap-1" role="progressbar" aria-label="Progress in completion of urban routes" aria-valuemin={0} aria-valuemax={overview.routes.length} aria-valuenow={overview.completedCount}>
              {overview.routes.map(route => {
                const current = overview.currentRoute?.order === route.order;
                return <i key={route.order} className={`h-1.5 rounded-full ${route.completed ? 'bg-emerald-400' : current ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,.38)]' : 'bg-slate-200'}`} />;
              })}
            </div>
          </div>}
        </section>

        <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,.06)]" aria-labelledby="route-map-title">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[.12em] text-orange-500">{"Lines are clear."}</span>
              <h2 id="route-map-title" className="mt-1 text-xl font-black tracking-[-.03em]">{"How far is it going? Where are we going?"}</h2>
            </div>
            <span className="mt-1 shrink-0 rounded-full bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-500">{"Full"} {overview.routes.length} {"Paragraph"}</span>
          </div>
          {!browseOnly && <div className="mt-3 flex flex-wrap gap-2" aria-label="Course status statement">
            <RouteLegend color="bg-emerald-400" label="Completed" />
            <RouteLegend color="bg-orange-500" label="Next paragraph" />
            <RouteLegend color="bg-slate-300" label="To Unlock" />
          </div>}
          <ol className="mt-4 space-y-1">
            {overview.routes.map((route, index) => {
              const current = !browseOnly && overview.currentRoute?.order === route.order;
              return (
                <li key={route.order} className="grid grid-cols-[28px_minmax(0,1fr)] gap-2.5">
                  <div className="relative flex justify-center pt-3">
                    {index < overview.routes.length - 1 && <span className={`absolute bottom-[-8px] top-8 w-px ${!browseOnly && route.completed ? 'bg-emerald-200' : 'bg-slate-200'}`} aria-hidden="true" />}
                    <span className={`relative z-10 grid h-6 w-6 place-items-center rounded-full text-[9px] font-black tabular-nums ${!browseOnly && route.completed ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : current ? 'bg-orange-500 text-white shadow-[0_4px_12px_rgba(249,115,22,.28)]' : 'bg-white text-slate-400 ring-1 ring-slate-200'}`}>
                      {!browseOnly && route.completed ? <Check size={12} strokeWidth={3} /> : String(route.order).padStart(2, '0')}
                    </span>
                  </div>
                  <article className={`min-w-0 rounded-2xl border px-3 py-3 transition-colors ${current ? 'border-orange-200 bg-[linear-gradient(135deg,#fff7ed,#fffaf6)]' : route.completed ? 'border-transparent bg-white' : 'border-slate-100 bg-slate-50/70'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-2">
                          <h3 className={`min-w-0 truncate text-[13px] font-black ${current ? 'text-slate-900' : route.completed ? 'text-slate-600' : 'text-slate-700'}`}>{route.title}</h3>
                          {current && <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-[8px] font-black text-orange-600">{"Next paragraph"}</span>}
                        </div>
                        <span className="mt-1.5 block truncate text-[10px] text-slate-400">{route.spotNames.join(' → ')}</span>
                      </div>
                      <div className="shrink-0 text-right">
                        <strong className="block text-[10px] font-black text-slate-600">{route.distanceKm.toFixed(1)} km</strong>
                        <span className="mt-1.5 block text-[9px] text-slate-400">{formatMinutes(route.durationMinutes)}</span>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </section>

        <button type="button" onClick={cityCompleted ? () => setShowReport(true) : onBack} className={`flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-white transition active:scale-[.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${cityCompleted ? 'bg-[linear-gradient(135deg,#10b981,#059669)] shadow-[0_12px_28px_rgba(5,150,105,.24)] focus-visible:ring-emerald-500' : 'bg-[linear-gradient(135deg,#ff7b50,#ff5b2d)] shadow-[0_12px_28px_rgba(255,91,45,.25)] focus-visible:ring-orange-500'}`}>
          {browseOnly ? <>Back to routes <ArrowRight size={17} /></> : cityCompleted ? <><FileText size={17} /> {"View City Report"}</> : <>{"We're done. Keep moving."} <ArrowRight size={17} /></>}
        </button>
      </div>
    </main>
  );
}

type CityReportOverview = {
  routes: OverviewRoute[];
  completedCount: number;
  uniqueSpotCount: number;
  totals: { distance: number; duration: number; calories: number };
};

const SHARE_USER_NAME = "Shuu Xiaoqiao";
const SHARE_USER_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240&h=240';

const drawRoundedRect = (context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
};

const loadPosterBackground = (src: string) => new Promise<HTMLImageElement | null>(resolve => {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.referrerPolicy = 'no-referrer';
  image.onload = () => resolve(image);
  image.onerror = () => resolve(null);
  image.src = src;
});

const drawCoverImage = (context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number, x = 0, y = 0) => {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
};

const createCityReportPoster = async (city: CityData, overview: CityReportOverview) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1620;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error("Unable to generate city report");
  }

  const duration = formatDurationMetric(overview.totals.duration);
  const generatedAt = new Date();
  const padTimePart = (value: number) => String(value).padStart(2, '0');
  const reportTime = `${generatedAt.getFullYear()}.${padTimePart(generatedAt.getMonth() + 1)}.${padTimePart(generatedAt.getDate())} ${padTimePart(generatedAt.getHours())}:${padTimePart(generatedAt.getMinutes())}`;
  const [backgroundImage, avatarImage] = await Promise.all([
    loadPosterBackground(city.image),
    loadPosterBackground(SHARE_USER_AVATAR)
  ]);
  if (backgroundImage) drawCoverImage(context, backgroundImage, canvas.width, canvas.height);
  const longestRoute = overview.routes.reduce((longest, route) => route.distanceKm > longest.distanceKm ? route : longest, overview.routes[0]);
  const gradient = context.createLinearGradient(0, 0, 1080, 1620);
  gradient.addColorStop(0, backgroundImage ? 'rgba(2,18,14,.62)' : '#071713');
  gradient.addColorStop(0.48, backgroundImage ? 'rgba(4,28,22,.78)' : '#0d2d24');
  gradient.addColorStop(1, backgroundImage ? 'rgba(3,16,13,.96)' : '#0a1714');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1080, 1620);

  const avatarX = 80;
  const avatarY = 62;
  const avatarSize = 88;
  context.save();
  context.beginPath();
  context.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  context.clip();
  context.fillStyle = '#17352c';
  context.fillRect(avatarX, avatarY, avatarSize, avatarSize);
  if (avatarImage) {
    drawCoverImage(context, avatarImage, avatarSize, avatarSize, avatarX, avatarY);
  } else {
    context.fillStyle = '#d1fae5';
    context.font = '900 40px "Microsoft YaHei", sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText("Mu.", avatarX + avatarSize / 2, avatarY + avatarSize / 2);
    context.textAlign = 'start';
    context.textBaseline = 'alphabetic';
  }
  context.restore();
  context.strokeStyle = 'rgba(110,231,183,.72)';
  context.lineWidth = 4;
  context.beginPath();
  context.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  context.stroke();

  context.fillStyle = '#ffffff';
  context.font = '900 32px "Microsoft YaHei", sans-serif';
  context.fillText(SHARE_USER_NAME, 192, 104);
  context.fillStyle = 'rgba(255,255,255,.58)';
  context.font = '500 21px "Microsoft YaHei", sans-serif';
  context.fillText(reportTime, 192, 142);

  context.fillStyle = '#6ee7b7';
  context.font = '700 30px "Microsoft YaHei", sans-serif';
  context.fillText("City report", 80, 225);

  const headlinePrefix = "I've been everywhere.";
  let headlineSize = city.name.length > 4 ? 78 : 96;
  context.font = `900 ${headlineSize}px "Microsoft YaHei", sans-serif`;
  while (context.measureText(`${headlinePrefix}${city.name}`).width > 920 && headlineSize > 62) {
    headlineSize -= 2;
    context.font = `900 ${headlineSize}px "Microsoft YaHei", sans-serif`;
  }
  context.fillStyle = '#ffffff';
  context.fillText(headlinePrefix, 80, 390);
  const prefixWidth = context.measureText(headlinePrefix).width;
  context.fillStyle = '#6ee7b7';
  context.fillText(city.name, 80 + prefixWidth, 390);

  drawRoundedRect(context, 70, 530, 940, 350, 48);
  context.fillStyle = '#f7faf8';
  context.fill();
  context.fillStyle = '#0b1f19';
  context.font = '900 50px "Microsoft YaHei", sans-serif';
  context.fillText("Urban completion 100%", 120, 615);
  context.fillStyle = '#059669';
  drawRoundedRect(context, 120, 655, 840, 18, 9);
  context.fill();

  const metrics = [
    [`${overview.completedCount}`, "A route."],
    [`${overview.uniqueSpotCount}`, "Places"],
    [overview.totals.distance.toFixed(1), "Perigee"],
    [`${duration.value}${duration.unit}`, "Length of exercise"]
  ];
  metrics.forEach(([value, label], index) => {
    const x = 120 + index * 215;
    const y = 770;
    context.fillStyle = '#0b1f19';
    context.font = '900 38px "Microsoft YaHei", sans-serif';
    context.fillText(value, x, y);
    context.fillStyle = '#718078';
    context.font = '600 21px "Microsoft YaHei", sans-serif';
    context.fillText(label, x, y + 34);
  });

  drawRoundedRect(context, 70, 920, 940, 420, 48);
  context.fillStyle = '#0d1714';
  context.fill();
  context.fillStyle = '#6ee7b7';
  context.font = '700 25px "Microsoft YaHei", sans-serif';
  context.fillText("♪ The journey brightens ♪", 120, 1000);
  context.fillStyle = '#ffffff';
  context.font = '900 44px "Microsoft YaHei", sans-serif';
  context.fillText("The city footprint you ran.", 120, 1065);

  const highlights = [
    ["Maximum route", longestRoute.title.length > 12 ? `${longestRoute.title.slice(0, 12)}…` : longestRoute.title],
    ["The way to the place.", `${overview.uniqueSpotCount}Location`],
    ["Cumulative consumption", `${Math.round(overview.totals.calories)}kilocalories`],
    ["Cumulative exercise", `${duration.value}${duration.unit}`]
  ];
  highlights.forEach(([label, value], index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 120 + column * 445;
    const y = 1140 + row * 105;
    context.fillStyle = 'rgba(255,255,255,.48)';
    context.font = '600 21px "Microsoft YaHei", sans-serif';
    context.fillText(label, x, y);
    context.fillStyle = '#ffffff';
    context.font = '900 30px "Microsoft YaHei", sans-serif';
    context.fillText(value, x, y + 42);
  });

  context.fillStyle = 'rgba(255,255,255,.42)';
  context.font = '600 22px "Microsoft YaHei", sans-serif';
  context.fillText("MOREVEVI... MY THROUGH WOME", 82, 1535);

  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 0.95));
  if (!blob) throw new Error("Unable to generate city report");
  return new File([blob], `${city.name}-city-report.png`, { type: 'image/png' });
};

function CityReportView({ city, overview, onBack }: { city: CityData; overview: CityReportOverview; onBack: () => void }) {
  const longestRoute = overview.routes.reduce((longest, route) => route.distanceKm > longest.distanceKm ? route : longest, overview.routes[0]);
  const duration = formatDurationMetric(overview.totals.duration);
  const [shareNotice, setShareNotice] = useState('');
  const [sharing, setSharing] = useState<'wechat' | 'save' | 'moments' | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterUrl, setPosterUrl] = useState('');
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [posterGenerating, setPosterGenerating] = useState(false);

  useEffect(() => {
    if (!shareSheetOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      closeShareSheet();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shareSheetOpen]);

  const downloadPoster = (file: File) => {
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleShare = async (target: 'wechat' | 'save' | 'moments') => {
    if (sharing) return;
    setSharing(target);
    setShareNotice('');
    try {
      if (!posterFile) return;
      const poster = posterFile;
      if (target === 'wechat' && navigator.share && navigator.canShare?.({ files: [poster] })) {
        await navigator.share({ title: `${city.name}City finish report.`, text: `I'm done.${city.name}All routes`, files: [poster] });
        setShareNotice("Opened system share to select a micro-trust friend");
      } else {
        downloadPoster(poster);
        setShareNotice(target === 'moments' ? "Posters are saved. Open the circle of friends and select the pictures to release." : target === 'wechat' ? "Posters saved for delivery to our close friends" : "The city finish poster was saved locally.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareNotice("Failed to generate poster, please try again later");
    } finally {
      setSharing(null);
    }
  };

  const openShareSheet = async () => {
    setShareSheetOpen(true);
    setPosterGenerating(true);
    setShareNotice('');
    try {
      const poster = await createCityReportPoster(city, overview);
      if (posterUrl) URL.revokeObjectURL(posterUrl);
      setPosterFile(poster);
      setPosterUrl(URL.createObjectURL(poster));
    } catch {
      setShareNotice("Failed to share pictures generation, please try again later");
    } finally {
      setPosterGenerating(false);
    }
  };

  const closeShareSheet = () => {
    if (posterUrl) URL.revokeObjectURL(posterUrl);
    setPosterUrl('');
    setPosterFile(null);
    setShareNotice('');
    setShareSheetOpen(false);
  };

  return (
    <main className="h-full w-full overflow-y-auto bg-[#edf3f0] text-slate-900 hide-scrollbar" id="main-content">
      <StickyHeroNav>
        <button type="button" onClick={onBack} aria-label="Overview of return routes" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          <ChevronLeft size={26} />
        </button>
      </StickyHeroNav>
      <header className="relative min-h-[320px] overflow-hidden bg-emerald-950 text-white">
        <CityImage src={city.image} alt="" fallbackLabel={city.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,20,16,.34),rgba(2,20,16,.52)_42%,rgba(2,20,16,.96))]" />

        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-12">
          <span className="mb-2 flex items-center gap-1.5 text-xs font-bold text-emerald-300"><Trophy size={15} /> {"City report"}</span>
          <h1 className="text-[34px] font-black leading-none tracking-[-.045em]">{"I've been everywhere."}{city.name}</h1>
        </div>
      </header>

      <div className="relative z-20 -mt-7 space-y-4 px-4 pb-32">
        <section className="rounded-[24px] border border-white bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,.10)]" aria-label={`${city.name}Urban completion report`}>
          <div className="flex items-center justify-between gap-3">
            <div><span className="text-[10px] font-bold tracking-[.12em] text-emerald-600">{"Urban Completion"}</span><h2 className="mt-1 text-2xl font-black tracking-[-.04em]">100%</h2></div>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"><Trophy size={23} /></span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Urban Completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={100}><span className="block h-full w-full rounded-full bg-[linear-gradient(90deg,#34d399,#059669)]" /></div>
          <div className="mt-5 grid grid-cols-4 divide-x divide-slate-100">
            <OverviewMetric label="Route" value={`${overview.completedCount}`} unit="Article" />
            <OverviewMetric label="View" value={`${overview.uniqueSpotCount}`} unit="Location" />
            <OverviewMetric label="mileage" value={overview.totals.distance.toFixed(1)} unit="km" />
            <OverviewMetric label="Length" value={duration.value} unit={duration.unit} />
          </div>
        </section>

        <section className="rounded-[24px] bg-[#0d1714] p-4 text-white shadow-[0_12px_32px_rgba(4,24,18,.16)]" aria-labelledby="report-highlights-title">
          <span className="text-[10px] font-bold tracking-[.12em] text-emerald-300">{"♪ The journey brightens ♪"}</span>
          <h2 id="report-highlights-title" className="mt-1 text-xl font-black tracking-[-.03em]">{"The city footprint you ran."}</h2>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <ReportHighlight icon={<Route size={16} />} label="Maximum route" value={longestRoute.title} detail={`${longestRoute.distanceKm.toFixed(1)} km`} />
            <ReportHighlight icon={<MapPin size={16} />} label="The way to the place." value={`${overview.uniqueSpotCount}Location`} detail="City memory is collected" />
            <ReportHighlight icon={<Flame size={16} />} label="Cumulative consumption" value={`${Math.round(overview.totals.calories)}`} detail="kilocalories" />
            <ReportHighlight icon={<Timer size={16} />} label="Cumulative exercise" value={`${duration.value}${duration.unit}`} detail="All routes completed." />
          </div>
        </section>

      </div>

      <div className="fixed bottom-0 left-1/2 z-[90] w-full max-w-[430px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(237,243,240,0),rgba(237,243,240,.96)_34%,#edf3f0)] px-4 pt-8" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <button type="button" onClick={openShareSheet} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#10b981,#047857)] px-5 text-sm font-black !text-white shadow-[0_12px_28px_rgba(5,150,105,.30)] transition active:scale-[.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
          <Share2 size={18} /> {"Sharing of city reports"}
        </button>
      </div>

      {shareSheetOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/72 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="share-sheet-title">
          <button type="button" className="absolute inset-0" onClick={closeShareSheet} aria-label="Close shared bullet windows" />
          <section className="relative z-10 flex max-h-[calc(100dvh-16px)] w-full max-w-[430px] flex-col rounded-t-[28px] bg-[#0b1210] px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 text-white shadow-[0_-18px_50px_rgba(0,0,0,.36)]">
            <div className="mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-white/18" />
            <header className="mb-3 flex shrink-0 items-center justify-between">
              <h2 id="share-sheet-title" className="text-base font-black tracking-[-.02em]">{"Sharing of city reports"}</h2>
              <button type="button" onClick={closeShareSheet} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-white/[.07] text-white/65 transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"><X size={18} /></button>
            </header>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[20px] bg-black/20 p-2">
              {posterUrl ? (
                <img src={posterUrl} alt={`${city.name}City report shared pictures`} className="block max-h-[calc(100dvh-190px)] max-w-full rounded-[15px] object-contain shadow-[0_16px_38px_rgba(0,0,0,.3)]" />
              ) : (
                <div className="grid aspect-[2/3] max-h-[calc(100dvh-190px)] w-full place-items-center rounded-[15px] bg-white/[.05] text-emerald-300">
                  <div className="text-center"><span className="mx-auto block h-7 w-7 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" aria-hidden="true" /><p className="mt-3 text-[10px] font-semibold text-white/55">{posterGenerating ? "Generating city report..." : "Prepare to share pictures..."}</p></div>
                </div>
              )}
            </div>

            <div className="mt-3 grid shrink-0 grid-cols-3 gap-2" aria-label="Channels of sharing">
              <ShareAction icon={<MessageCircle size={18} />} label="We believe in friends." active={sharing === 'wechat'} disabled={!posterFile} tone="emerald" onClick={() => handleShare('wechat')} />
              <ShareAction icon={<Images size={18} />} label="Friends." active={sharing === 'moments'} disabled={!posterFile} tone="warm" onClick={() => handleShare('moments')} />
              <ShareAction icon={<Download size={18} />} label="Save Picture" active={sharing === 'save'} disabled={!posterFile} tone="dark" onClick={() => handleShare('save')} />
            </div>
            {shareNotice && <p className="mt-2 shrink-0 rounded-xl bg-white/[.06] px-3 py-2 text-center text-[10px] font-semibold text-white/68" role="status">{shareNotice}</p>}
          </section>
        </div>
      )}
    </main>
  );
}

function ShareAction({ icon, label, active, disabled = false, tone, onClick }: { icon: ReactNode; label: string; active: boolean; disabled?: boolean; tone: 'emerald' | 'dark' | 'warm'; onClick: () => void }) {
  const toneClass = tone === 'emerald'
    ? 'bg-emerald-500 !text-white shadow-[0_7px_16px_rgba(16,185,129,.18)]'
    : tone === 'warm'
      ? 'bg-[#183a2f] !text-emerald-100 ring-1 ring-emerald-300/10'
      : 'bg-white/[.08] !text-white ring-1 ring-white/10';
  return (
    <button type="button" onClick={onClick} disabled={active || disabled} className={`flex min-h-[70px] flex-col items-center justify-center gap-2 rounded-2xl px-2 text-[10px] font-bold transition active:scale-[.97] disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${toneClass}`}>
      {icon}
      <span>{active ? "Generating..." : label}</span>
    </button>
  );
}

function ReportHighlight({ icon, label, value, detail }: { icon: ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/8 bg-white/[.045] p-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">{icon}</span>
      <span className="mt-3 block text-[9px] font-medium text-white/45">{label}</span>
      <strong className="mt-1 block truncate text-[13px] font-black text-white">{value}</strong>
      <small className="mt-1 block truncate text-[9px] text-white/38">{detail}</small>
    </div>
  );
}

function RouteLegend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1.5 text-[9px] font-semibold text-slate-500">
      <i className={`h-1.5 w-1.5 rounded-full ${color}`} aria-hidden="true" />
      {label}
    </span>
  );
}

function OverviewMetric({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="min-w-0 px-2 text-center first:pl-0 last:pr-0">
      <strong className="block truncate text-lg font-black text-slate-800">{value}{unit && <small className="ml-0.5 text-[9px] font-bold text-slate-400">{unit}</small>}</strong>
      <span className="mt-1 block text-[9px] font-medium text-slate-400">{label}</span>
    </div>
  );
}
