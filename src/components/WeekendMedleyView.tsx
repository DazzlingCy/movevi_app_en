import StickyHeroNav from './StickyHeroNav';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Award, Gift, Share2, Sparkles, Check, Play, Lock,
  Info, Landmark, Trophy, Share, Coins, ArrowRight, HelpCircle,
  Plus, Trash2, X, Star, Clock, Compass, MapPin, Download, Send, AlertCircle,
  Mail, Ticket, RefreshCw
} from 'lucide-react';

export interface MedleyRouteItem {
  id: string; // "cityId-routeIndex"
  cityId: string;
  routeIndex: number;
  cityName: string;
  routeName: string;
  title: string;
  image: string;
  spots: string;
  intro: string;
  distance: string;
  duration: string; // "约 25 分钟"
  rating: number; // e.g. 4.9
  countryName: string;
}

export const MEDLEY_CANDIDATE_ROUTES: MedleyRouteItem[] = [
  { id: '1-2', cityId: '1', routeIndex: 2, cityName: 'Hangzhou', routeName: 'Lingyin Temple Trail', title: 'West Lake to Lingyin Temple', image: 'https://images.unsplash.com/photo-1582650841195-2acbeacc7fc5?auto=format&fit=crop&w=500&q=80', spots: 'Lingyin Temple · Feilai Peak · Faxi Temple', intro: 'Leave the city behind for a quiet run through wooded hills, temple paths, and fresh mountain air.', distance: '4.2', duration: 'About 25 minutes', rating: 4.9, countryName: 'China' },
  { id: '2-1', cityId: '2', routeIndex: 1, cityName: 'Beijing', routeName: 'Forbidden City Wall', title: 'Forbidden City Park Loop', image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=500&q=80', spots: 'Shenwu Gate · Corner Tower · Jingshan Front Street', intro: 'Run beside the red walls and corner towers of the Forbidden City while modern Beijing moves around you.', distance: '4.0', duration: 'About 24 minutes', rating: 4.8, countryName: 'China' },
  { id: '3-1', cityId: '3', routeIndex: 1, cityName: 'Shanghai', routeName: 'Urban Memory Route', title: 'Shanghai Riverfront Memories', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80', spots: 'The Bund · Yuyuan Garden · Shikumen', intro: 'Move between riverfront landmarks and historic lanes as old Shanghai meets its modern skyline.', distance: '5.2', duration: 'About 31 minutes', rating: 4.7, countryName: 'China' },
  { id: '15-1', cityId: '15', routeIndex: 1, cityName: 'Singapore', routeName: 'Marina Bay Loop', title: 'Singapore Marina Bay', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=500&q=80', spots: 'Marina Bay · Merlion Park · Gardens by the Bay', intro: 'Follow the waterfront through tropical gardens and a skyline shaped by the city-state’s global energy.', distance: '4.6', duration: 'About 28 minutes', rating: 4.8, countryName: 'Singapore' },
  { id: '5-1', cityId: '5', routeIndex: 1, cityName: "Xi'an", routeName: 'Ancient City Wall Route', title: "Xi'an City Wall Run", image: 'https://images.unsplash.com/photo-1599572415662-119c861b1b68?auto=format&fit=crop&w=500&q=80', spots: 'Yongning Gate · Changle Gate · Bell Tower', intro: 'Run above the old city on one of China’s best-preserved defensive walls.', distance: '6.0', duration: 'About 36 minutes', rating: 4.8, countryName: 'China' },
  { id: '6-1', cityId: '6', routeIndex: 1, cityName: 'Tokyo', routeName: 'Asakusa Old Town', title: 'Tokyo Asakusa Streets', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=500&q=80', spots: 'Senso-ji · Kaminarimon · Sumida Park', intro: 'Pass red lanterns, craft shops, and riverside paths where Edo history meets present-day Tokyo.', distance: '3.8', duration: 'About 22 minutes', rating: 4.7, countryName: 'Japan' },
  { id: '7-1', cityId: '7', routeIndex: 1, cityName: 'Paris', routeName: 'Seine Sunset Route', title: 'Paris Along the Seine', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80', spots: 'Louvre Museum · Pont Neuf · Musée d’Orsay', intro: 'Follow the Seine past landmark museums and bridges as evening light settles over Paris.', distance: '6.5', duration: 'About 39 minutes', rating: 4.9, countryName: 'France' },
  { id: '8-1', cityId: '8', routeIndex: 1, cityName: 'London', routeName: 'West End Route', title: 'London West End', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?auto=format&fit=crop&w=500&q=80', spots: 'Royal Opera House · Covent Garden · Shaftesbury Avenue', intro: 'Run through the heart of London theater, from Covent Garden to the bright streets of the West End.', distance: '2.0', duration: 'About 12 minutes', rating: 4.6, countryName: 'United Kingdom' },
  { id: '9-1', cityId: '9', routeIndex: 1, cityName: 'New York', routeName: 'Liberty Island Route', title: 'New York Harbor Memories', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500&q=80', spots: 'Battery Park · Ellis Island · Statue of Liberty', intro: 'Look across New York Harbor and trace the landmarks that welcomed generations to the city.', distance: '4.5', duration: 'About 27 minutes', rating: 4.8, countryName: 'United States' },
  { id: '12-1', cityId: '12', routeIndex: 1, cityName: 'Cairo', routeName: 'Nile Civilization Route', title: 'Cairo and the Nile', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=500&q=80', spots: 'Giza Pyramids · Sphinx · Nile Valley', intro: 'Cross a landscape where the Nile and desert monuments tell thousands of years of history.', distance: '5.0', duration: 'About 30 minutes', rating: 4.9, countryName: 'Egypt' },
  { id: '13-1', cityId: '13', routeIndex: 1, cityName: 'Bangkok', routeName: 'Chao Phraya Riverside', title: 'Bangkok Riverside Route', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=500&q=80', spots: 'Wat Arun · Grand Palace · Chao Phraya River', intro: 'Follow the river past golden temples and busy waterfront streets at the center of Bangkok.', distance: '3.6', duration: 'About 21 minutes', rating: 4.8, countryName: 'Thailand' },
  { id: '14-1', cityId: '14', routeIndex: 1, cityName: 'Chengdu', routeName: 'Old Lane Memories', title: 'Chengdu Local Life Route', image: 'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=500&q=80', spots: 'Wide Alley · Kuan Alley · People’s Park', intro: 'Take an easy route through shaded lanes, neighborhood tea houses, and the relaxed rhythm of Chengdu.', distance: '4.1', duration: 'About 25 minutes', rating: 4.9, countryName: 'China' },
  { id: '10-1', cityId: '10', routeIndex: 1, cityName: 'Sydney', routeName: 'Harbor Bridge Waterfront', title: 'Sydney Harbor Route', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=500&q=80', spots: 'Circular Quay · Mrs Macquarie’s Chair · Sydney Opera House', intro: 'Run beside the harbor with open water, the Opera House, and the bridge in view.', distance: '5.5', duration: 'About 33 minutes', rating: 4.9, countryName: 'Australia' },
  { id: '16-1', cityId: '16', routeIndex: 1, cityName: 'Berlin', routeName: 'Brandenburg Gate Route', title: 'Berlin Through Time', image: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=500&q=80', spots: 'Brandenburg Gate · Unter den Linden · Berlin Wall Memorial', intro: 'Move through landmarks that connect Berlin’s imperial past, divided history, and creative present.', distance: '4.6', duration: 'About 28 minutes', rating: 4.7, countryName: 'Germany' },
  { id: '17-1', cityId: '17', routeIndex: 1, cityName: 'Rio de Janeiro', routeName: 'Sunlit Coast Route', title: 'Rio Coast and Christ the Redeemer', image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=500&q=80', spots: 'Copacabana Beach · Sugarloaf Mountain · Christ the Redeemer Viewpoint', intro: 'Run between tropical hills and the Atlantic as Rio’s beaches and landmarks fill the horizon.', distance: '5.0', duration: 'About 30 minutes', rating: 4.8, countryName: 'Brazil' }
];const LOTTERY_POOL_CONFIG = [
  { value: 0.18, count: 80, probability: '26.67%' },
  { value: 0.38, count: 148, probability: '49.33%' },
  { value: 0.88, count: 40, probability: '13.33%' },
  { value: 1.88, count: 25, probability: '8.33%' },
  { value: 5.88, count: 5, probability: '1.67%' },
  { value: 8.88, count: 2, probability: '0.67%' }
];
const LOTTERY_PRIZES = LOTTERY_POOL_CONFIG.map(item => item.value);
const LOTTERY_TOTAL_CHANCES = LOTTERY_POOL_CONFIG.reduce((sum, item) => sum + item.count, 0);
const LOTTERY_TOTAL_AMOUNT = LOTTERY_POOL_CONFIG.reduce((sum, item) => sum + item.value * item.count, 0);
const LOTTERY_STORAGE_KEY = 'weekend_lottery_remaining_prizes_v4';
const LOTTERY_RECORDS_STORAGE_KEY = 'weekend_medley_global_draw_records_v2';

const buildLotteryPool = () => {
  return LOTTERY_POOL_CONFIG.flatMap(item => Array(item.count).fill(item.value));
};

export interface GlobalDrawRecord {
  id: string;
  nickname: string;
  amount: number;
  time: string;
  isCurrentUser?: boolean;
}

export const generateMockDrawRecords = (amounts?: number[]): GlobalDrawRecord[] => {
  const nicknames = [
    "Alex M.", "Jordan Lee", "Taylor R.", "Morgan K.", "Casey J.", "Jamie P.", "Riley S.", "Avery C.",
    "Miles Ahead", "Forest Runner", "Run With the Wind", "Steady Pace", "Happy Steps", "Rio Morning Runner",
    "City Strider", "Mountain Miles", "Coastal Runner"
  ];

  const getRandomPrize = () => {
    const ticketIndex = Math.floor(Math.random() * LOTTERY_TOTAL_CHANCES);
    let cursor = 0;
    for (const item of LOTTERY_POOL_CONFIG) {
      cursor += item.count;
      if (ticketIndex < cursor) return item.value;
    }
    return LOTTERY_POOL_CONFIG[LOTTERY_POOL_CONFIG.length - 1].value;
  };

  const times = [
    "1 min ago", "3 min ago", "5 min ago", "8 min ago", "12 min ago",
    "15 min ago", "22 min ago", "30 min ago", "45 min ago", "1 hr ago",
    "1.5 hr ago", "2 hr ago", "3 hr ago", "4 hr ago", "5 hr ago"
  ];

  return Array.from({ length: 15 }, (_, i) => {
    const rIdx = Math.floor(Math.random() * nicknames.length);
    const tStr = times[Math.min(i, times.length - 1)];
    const prize = amounts && amounts[i] !== undefined ? amounts[i] : getRandomPrize();
    return {
      id: `mock-${i}-${Math.random()}`,
      nickname: nicknames[(rIdx + i) % nicknames.length],
      amount: prize,
      time: tStr
    };
  });
};

const WHEEL_SECTORS = LOTTERY_POOL_CONFIG.map(item => ({ value: item.value, type: 'envelope' }));

function getSectorPath(startAngle: number, endAngle: number, r: number) {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = 100 + r * Math.cos(startRad);
  const y1 = 100 + r * Math.sin(startRad);
  const x2 = 100 + r * Math.cos(endRad);
  const y2 = 100 + r * Math.sin(endRad);

  return `M 100 100 L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#FFD700', '#FF4D4D', '#FF8E53', '#4CAF50', '#2196F3', '#E040FB', '#00E676', '#FFFF00'];
    const particles: Array<{
      x: number;
      y: number;
      r: number;
      color: string;
      vx: number;
      vy: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      shape: string;
    }> = [];

    // Powerful Initial Center-Burst Explosion
    for (let i = 0; i < 110; i++) {
      particles.push({
        x: width / 2,
        y: height / 2 - 30,
        r: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 14 - 4, // Shoot upwards
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'circle' : 'rect'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity
        p.vx *= 0.98;  // air resistance
        p.rotation += p.rotationSpeed;

        // Slowly fade out as they fall and float (fade completely over ~2.5 seconds)
        p.opacity -= 0.006 + Math.random() * 0.004;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-40"
    />
  );
}

interface WeekendMedleyViewProps {
  onBack: () => void;
  selectedRouteIds: string[];
  completedRouteIds: string[];
  lotteryChances: number;
  drawHistory: number[];
  shareBonusClaimed: boolean;
  activityStarted: boolean;
  onUpdateState: (newState: {
    selectedRouteIds?: string[];
    completedRouteIds?: string[];
    lotteryChances?: number;
    drawHistory?: number[];
    shareBonusClaimed?: boolean;
    activityStarted?: boolean;
  }) => void;
  onNavigateToRouteDetail: (cityId: string, routeIndex: number, image: string) => void;
}

export default function WeekendMedleyView({
  onBack,
  selectedRouteIds,
  completedRouteIds,
  lotteryChances,
  drawHistory,
  shareBonusClaimed,
  activityStarted,
  onUpdateState,
  onNavigateToRouteDetail
}: WeekendMedleyViewProps) {
  const [viewMode, setViewMode] = useState<'main' | 'selection' | 'lottery'>('main');
  const [draftRouteIds, setDraftRouteIds] = useState<string[]>([]);

  useEffect(() => {
    if (viewMode === 'selection') {
      setDraftRouteIds(selectedRouteIds);
    }
  }, [viewMode]);

  const [candidates, setCandidates] = useState<MedleyRouteItem[]>(() => {
    return MEDLEY_CANDIDATE_ROUTES.slice(0, 5);
  });
  const [selectError, setSelectError] = useState<string | null>(null);

  const [remainingPrizes, setRemainingPrizes] = useState<number[]>(() => {
    const saved = localStorage.getItem(LOTTERY_STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    const shuffled = buildLotteryPool().sort(() => Math.random() - 0.5);
    // 15 entries pre-drawn for mock global records
    const preDrawn = shuffled.slice(0, 15);
    const remaining = shuffled.slice(15);

    localStorage.setItem(LOTTERY_STORAGE_KEY, JSON.stringify(remaining));

    // Consistent mock data based on the 15 pre-drawn entries
    const mocks = generateMockDrawRecords(preDrawn);
    localStorage.setItem(LOTTERY_RECORDS_STORAGE_KEY, JSON.stringify(mocks));

    return remaining;
  });

  const [simulateEmptyLottery, setSimulateEmptyLottery] = useState<boolean>(false);
  const [simulateNotStarted, setSimulateNotStarted] = useState<boolean>(false);
  const activeRemainingPrizes = simulateEmptyLottery ? [] : remainingPrizes;
  const poolBalance = activeRemainingPrizes.reduce((sum, val) => sum + val, 0);

  const [globalRecords, setGlobalRecords] = useState<GlobalDrawRecord[]>(() => {
    const saved = localStorage.getItem(LOTTERY_RECORDS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    const initial = generateMockDrawRecords();
    localStorage.setItem(LOTTERY_RECORDS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [recentDrawReward, setRecentDrawReward] = useState<number | null>(null);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const lotteryTimeoutRef = useRef<any>(null);

  const handleRefreshCandidates = () => {
    // Pick 5 unique routes from MEDLEY_CANDIDATE_ROUTES that are NOT in the current candidates list
    const currentIds = candidates.map(c => c.id);
    const available = MEDLEY_CANDIDATE_ROUTES.filter(route => !currentIds.includes(route.id));

    // Shuffle the available ones and get 5 unique routes
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const nextFive = shuffled.slice(0, 5);
    setCandidates(nextFive);
  };

  useEffect(() => {
    return () => {
      if (lotteryTimeoutRef.current) {
        clearTimeout(lotteryTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectError) {
      const timer = setTimeout(() => {
        setSelectError(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [selectError]);

  // Poster sharing state
  const [showSharePosterModal, setShowSharePosterModal] = useState(false);
  const [isPosterGenerating, setIsPosterGenerating] = useState(false);
  const [posterDownloadUrl, setPosterDownloadUrl] = useState<string | null>(null);
  const [isSharingToWechat, setIsSharingToWechat] = useState(false);
  const [shareToastText, setShareToastText] = useState<string | null>(null);

  // Big Wheel/Turntable States
  const [wheelRotation, setWheelRotation] = useState<number>(0);

  // Helper check if selected
  const activeRouteIds = viewMode === 'selection' ? draftRouteIds : selectedRouteIds;
  const isRouteSelected = (id: string) => activeRouteIds.includes(id);

  const selectedItems = MEDLEY_CANDIDATE_ROUTES.filter(route => isRouteSelected(route.id));
  const completedCount = selectedItems.filter(item => completedRouteIds.includes(item.id)).length;
  const isMedleyAllCompleted = selectedRouteIds.length === 3 && completedCount === 3;

  const [hasShownCompletionAlert, setHasShownCompletionAlert] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    if (isMedleyAllCompleted && !hasShownCompletionAlert) {
      setHasShownCompletionAlert(true);
      setShowCompletionModal(true);
    } else if (!isMedleyAllCompleted) {
      setHasShownCompletionAlert(false);
    }
  }, [isMedleyAllCompleted, hasShownCompletionAlert]);

  // Total mileage calculator
  const totalMedleyDistance = selectedItems.reduce((acc, current) => {
    return acc + parseFloat(current.distance || '0');
  }, 0).toFixed(1);

  const handleToggleRoute = (route: MedleyRouteItem) => {
    if (activityStarted) return; // Cannot edit selection once started

    const isSelected = isRouteSelected(route.id);
    if (isSelected) {
      const updated = activeRouteIds.filter(id => id !== route.id);
      if (viewMode === 'selection') {
        setDraftRouteIds(updated);
      } else {
        onUpdateState({ selectedRouteIds: updated });
      }
      setSelectError(null);
    } else {
      if (activeRouteIds.length >= 3) {
        setSelectError("You can choose up to three routes.");
        return;
      }

      const updated = [...activeRouteIds, route.id];
      if (viewMode === 'selection') {
        setDraftRouteIds(updated);
      } else {
        onUpdateState({ selectedRouteIds: updated });
      }
      setSelectError(null);
    }
  };

  const startMedleyCombo = () => {
    if (selectedRouteIds.length !== 3) return;
    onUpdateState({ activityStarted: true });
  };

  // Generate poster onto the canvas and prepare the download URL
  const handleGeneratePoster = () => {
    setIsPosterGenerating(true);

    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 900;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Draw premium dark backing with gold hue gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, 900);
        bgGrad.addColorStop(0, '#090F1B');
        bgGrad.addColorStop(0.5, '#060A13');
        bgGrad.addColorStop(1, '#020305');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 600, 900);

        // 2. Draw gold decorative borders
        ctx.strokeStyle = '#D9A74E';
        ctx.lineWidth = 1;
        ctx.strokeRect(15, 15, 570, 870);
        ctx.strokeStyle = 'rgba(217, 167, 78, 0.3)';
        ctx.strokeRect(22, 22, 556, 856);

        // Corners circles deco
        const cornerPuntos = [
          [22, 22], [578, 22], [22, 878], [578, 878]
        ];
        ctx.fillStyle = '#D9A74E';
        cornerPuntos.forEach(([x, y]) => {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        // 3. Poster Title
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 4;

        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('・ WEEKEND ROAD MEDLEY ・', 300, 60);

        ctx.fillStyle = '#F5D06E';
        ctx.font = 'black 34px sans-serif';
        ctx.fillText("Weekend City Mix · Achievement Poster", 300, 110);

        ctx.strokeStyle = 'rgba(245, 208, 110, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(150, 140);
        ctx.lineTo(450, 140);
        ctx.stroke();

        // 4. Explorer Information Text
        // Draw decorative Profile Avatar Circle on Canvas representing 沐小六
        ctx.strokeStyle = '#D9A74E';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(300, 158, 22, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#22D3EE';
        ctx.beginPath();
        ctx.arc(300, 158, 19, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#090F1B';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("MOVEVI", 300, 164);

        ctx.font = 'bold 28px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText("MOVEVI Runner", 300, 220);

        // 5. Drawing stats grids (Distance / completed nodes)
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(80, 290, 440, 110);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.strokeRect(80, 290, 440, 110);

        // Grid stats lines
        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText("Total Distance", 190, 325);
        ctx.fillText("Routes Complete", 410, 325);

        ctx.fillStyle = '#22D3EE';
        ctx.font = 'bold 36px font-mono';
        ctx.fillText(`${totalMedleyDistance} KM`, 190, 375);

        ctx.fillStyle = '#10B981';
        ctx.fillText(`${completedCount} / 3`, 410, 375);

        // 6. Draw 3 Selected Route names with customized background tags
        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText("• Completed route:", 80, 445);

        selectedItems.forEach((route, idx) => {
          const yOffset = 475 + (idx * 75);

          // Outer rectangle
          ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
          ctx.fillRect(80, yOffset, 440, 60);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.strokeRect(80, yOffset, 440, 60);

          // Indicator Tag Left Accent
          ctx.fillStyle = idx === 0 ? '#F5D06E' : idx === 1 ? '#22D3EE' : '#EC4899';
          ctx.fillRect(80, yOffset, 6, 60);

          // Route Meta text
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(`Route${idx + 1} • ${route.cityName} · ${route.routeName}`, 105, yOffset + 24);

          ctx.fillStyle = '#94A3B8';
          ctx.font = '11px sans-serif';
          ctx.fillText(route.spots, 105, yOffset + 44);

          // Tag status right
          ctx.textAlign = 'right';
          const isComp = completedRouteIds.includes(route.id);
          if (isComp) {
            ctx.fillStyle = '#10B981';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText("• Perfect light into a chapter", 500, yOffset + 35);
          } else {
            ctx.fillStyle = '#64748B';
            ctx.font = '12px sans-serif';
            ctx.fillText("○In progress", 500, yOffset + 35);
          }
          // Reset alignment for iterations
          ctx.textAlign = 'left';
        });

        // 8. Footer Info & Pseudo Scan QR code
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.moveTo(80, 740);
        ctx.lineTo(520, 740);
        ctx.stroke();

        // Footer Brand typography
        ctx.textAlign = 'left';
        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText("Weekend City Mix", 80, 785);
        ctx.font = '11px sans-serif';
        ctx.fillText("Three cities, three routes, one weekend journey.", 80, 805);
        ctx.fillText("Counterfeit verification:" + Math.random().toString(36).substr(2, 9).toUpperCase(), 80, 825);

        // Simulate elegant QR Code
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(440, 760, 80, 80);
        // QR Code pixels patterns mock
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(444, 764, 24, 24);
        ctx.fillRect(492, 764, 24, 24);
        ctx.fillRect(444, 812, 24, 24);
        ctx.fillRect(472, 790, 16, 16);
        ctx.fillRect(484, 804, 12, 12);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(450, 770, 12, 12);
        ctx.fillRect(498, 770, 12, 12);
        ctx.fillRect(450, 818, 12, 12);

        // Convert page to canvas download url state
        const generatedUrl = canvas.toDataURL('image/png');
        setPosterDownloadUrl(generatedUrl);
        setIsPosterGenerating(false);

      } catch (err) {
        console.error('Canvas generate poster failed', err);
        setIsPosterGenerating(false);
      }
    }, 1500);
  };

  const handleSimulateWechatShare = (type: 'friend' | 'moments') => {
    setIsSharingToWechat(true);
    setShareToastText(type === 'friend' ? "Preparing to share..." : "Preparing your community post...");

    setTimeout(() => {
      setIsSharingToWechat(false);

      // Award extra lottery chance if they haven't claimed share bonus yet
      if (!shareBonusClaimed) {
        onUpdateState({
          shareBonusClaimed: true,
          lotteryChances: lotteryChances + 1
        });

        // Use nice elegant toast notification now!
        setShareToastText('Shared! You earned one bonus draw.');
        setTimeout(() => setShareToastText(null), 3500);
      } else {
        setShareToastText('Shared successfully.');
        setTimeout(() => setShareToastText(null), 2500);
      }
    }, 1200);
  };

  const handleSpinWheel = () => {
    if (lotteryChances <= 0 || isDrawing) return;
    if (activeRemainingPrizes.length === 0) {
      setSelectError("This round's prize pool is empty. Check back for the next event.");
      return;
    }

    setIsDrawing(true);

    // Roll random award value from pre-shuffled remainingPrizes pool / active pool
    const rolledValue = activeRemainingPrizes[0];
    const winnerIdx = Math.max(0, LOTTERY_PRIZES.indexOf(rolledValue));

    // Compute cumulative rotation to point winnerIdx at visual TOP
    const baseRotation = wheelRotation - (wheelRotation % 360);
    const newRotation = baseRotation + (5 * 360) + (360 - (winnerIdx * 60 + 30)); // 5 full loops + precise pointing index offset

    setWheelRotation(newRotation);

    if (lotteryTimeoutRef.current) {
      clearTimeout(lotteryTimeoutRef.current);
    }

    lotteryTimeoutRef.current = setTimeout(() => {
      setRecentDrawReward(rolledValue);
      setIsDrawing(false);

      // Deduct from remaining prizes pool
      const nextRemaining = remainingPrizes.slice(1);
      setRemainingPrizes(nextRemaining);
      localStorage.setItem(LOTTERY_STORAGE_KEY, JSON.stringify(nextRemaining));

      const newUserRecord: GlobalDrawRecord = {
        id: `user-${Date.now()}`,
        nickname: 'You',
        amount: rolledValue,
        time: "Just now",
        isCurrentUser: true
      };
      setGlobalRecords(prev => {
        const updated = [newUserRecord, ...prev];
        localStorage.setItem(LOTTERY_RECORDS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      onUpdateState({
        lotteryChances: Math.max(0, lotteryChances - 1),
        drawHistory: [rolledValue, ...drawHistory]
      });
      setShowDrawModal(true);
    }, 2050);
  };

  const handleCloseDrawModal = () => {
    setShowDrawModal(false);
  };

  const handleActionClick = () => {
    if (simulateNotStarted) {
      setSelectError("This event is not open yet. Check the event schedule and come back soon.");
      return;
    }
    if (selectedRouteIds.length < 3) {
      setViewMode('selection');
    } else if (activeRemainingPrizes.length === 0) {
      setSelectError("The prize pool is empty, so new challenges and draws are temporarily unavailable.");
      return;
    } else if (!activityStarted) {
      startMedleyCombo();
    } else {
      // Find first uncompleted route to run
      const uncompleted = selectedItems.find(item => !completedRouteIds.includes(item.id));
      if (uncompleted) {
        onNavigateToRouteDetail(uncompleted.cityId, uncompleted.routeIndex, uncompleted.image);
      } else {
        // All completed! Switch to lottery view directly
        setViewMode('lottery');
      }
    }
  };

  const renderSharePosterModal = () => {
    return (
      <AnimatePresence>
        {showSharePosterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4"
          >
            {/* Header section of poster modal - Clean and borderless with title removed as requested */}
            <div className="flex justify-end items-center py-2 shrink-0">
              <button
                onClick={() => setShowSharePosterModal(false)}
                className="p-1 px-2.5 hover:bg-white/10 rounded-full text-slate-400 font-medium text-xs flex items-center gap-1 active:scale-95 transition-all"
              >
                <span>{"Close"}</span>
                <X size={16} />
              </button>
            </div>

            {/* Middle: Container displaying the Poster Mock/Canvas */}
            <div className="flex-1 flex items-center justify-center overflow-hidden my-3">
              {isPosterGenerating ? (
                <div className="text-center p-6 space-y-3">
                  <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-bold">Creating your achievement poster...</p>
                </div>
              ) : (
                <div className="relative max-w-[290px] w-full max-h-[82vh] bg-gradient-to-b from-[#0d1527] via-[#050914] to-[#020306] rounded-3xl border border-amber-500/30 p-5 font-sans text-left overflow-y-auto hide-scrollbar shadow-[0_0_50px_rgba(0,0,0,0.85),0_0_25px_rgba(245,208,110,0.06)] relative overflow-hidden">
                  {/* Glowing ambient dots in background */}
                  <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

                  {/* Miniature Poster Simulation rendering identical output as canvas */}
                  <div className="text-center py-1">
                    <span className="text-[7.5px] text-amber-500/80 tracking-widest font-mono block font-black">WEEKEND CITY MIX</span>
                    <h3 className="text-sm font-black bg-gradient-to-r from-amber-200 via-amber-300 to-[#ffe285] bg-clip-text text-transparent mt-1 tracking-wider filter drop-shadow-[0_2px_4px_rgba(245,208,110,0.15)]">Weekend Route Achievement</h3>
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mx-auto mt-2" />
                  </div>

                  {/* Body textuals with avatar badge */}
                  <div className="mt-3.5 space-y-1.5 pt-1 text-center flex flex-col items-center">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                        alt="avatar"
                        className="w-11 h-11 rounded-full border-2 border-amber-500/40 object-cover shadow-lg shadow-amber-500/10"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-[6px] font-black text-slate-950 scale-90 border border-slate-950 leading-none">LV2</span>
                    </div>
                    <span className="text-xs font-black text-slate-100">{"MOVEVI Runner"}</span>
                  </div>

                  {/* Highlights statistics row */}
                  <div className="my-4 bg-gradient-to-r from-slate-950 to-[#0e1628] p-2.5 rounded-2xl grid grid-cols-2 text-center border border-white/5 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5" />
                    <div>
                      <span className="text-[8.5px] text-slate-400 block font-bold mb-0.5">Total Distance</span>
                      <strong className="text-xs font-black text-cyan-400 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(34,211,238,0.2)]">{totalMedleyDistance} KM</strong>
                    </div>
                    <div>
                      <span className="text-[8.5px] text-slate-400 block font-bold mb-0.5">{"Routes Complete"}</span>
                      <strong className="text-xs font-black text-emerald-400 tracking-tight drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]">{completedCount} / 3</strong>
                    </div>
                  </div>

                  {/* Mini cards for 3 roads */}
                  <div className="space-y-2 select-none">
                    <span className="text-[8.5px] text-slate-300 font-extrabold block tracking-wider">COMPLETED ROUTES</span>
                    {selectedItems.map((item, id) => {
                      const isDone = completedRouteIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-[8.5px] transition-all relative overflow-hidden ${
                            isDone
                              ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-100 shadow-[0_2px_8px_rgba(16,185,129,0.03)]'
                              : 'bg-black/30 border-white/5 text-slate-400'
                          }`}
                        >
                          {/* Accent Color Left Strip */}
                          <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${isDone ? 'bg-emerald-500' : 'bg-slate-700'}`} />

                          <div className="flex flex-col pl-1 text-left truncate w-full">
                            <span className={`font-black tracking-wide truncate ${isDone ? 'text-slate-100' : 'text-slate-400'}`}>
                              {"Route"} {id+1}: {item.cityName}·{item.routeName}
                            </span>
                            <span className="text-[7.5px] text-slate-500 truncate mt-0.5 font-medium">{item.spots}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* QR code footer sim */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                    <div className="max-w-[160px]">
                      <span className="text-[8.5px] text-slate-400 font-extrabold block">MOVEVI · Weekend City Mix</span>
                      <span className="text-[7.5px] text-slate-500 block leading-relaxed mt-1 font-semibold">Scan to explore more city routes in MOVEVI.</span>
                    </div>
                    {/* Simulated white pixel QR block */}
                    <div className="w-9 h-9 bg-gradient-to-br from-white to-slate-100 p-0.5 rounded-md shadow-lg flex flex-wrap gap-[1px] justify-between items-between">
                      <div className="w-3.5 h-3.5 bg-slate-900 rounded-[1px] m-[1px] border border-white" />
                      <div className="w-3.5 h-3.5 bg-slate-900 rounded-[1px] m-[1px] border border-white ml-auto" />
                      <div className="w-3.5 h-3.5 bg-slate-900 rounded-[1px] m-[1px] border border-white mt-auto" />
                      <div className="w-3.5 h-3.5 bg-slate-500 rounded-[1px] m-[1px] mt-auto ml-auto" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Poster bottom toolbar with interactive actions */}
            <div className="bg-[#0b0c10] border-t border-white/5 p-4 rounded-t-3xl space-y-3 shrink-0 text-left">
              <span className="text-[10px] text-slate-400 font-black block tracking-widest uppercase">SHARE YOUR POSTER</span>

              <div className="grid grid-cols-2 gap-3">
                {/* 1. DOWNLOAD OR SAVING LOCAL BUTTON */}
                {posterDownloadUrl ? (
                  <a
                    href={posterDownloadUrl}
                    download="weekend_memory_poster.png"
                    onClick={() => {
                      setShareToastText("Achievement poster saved to your Downloads folder.");
                      setTimeout(() => setShareToastText(null), 3000);
                    }}
                    className="flex items-center justify-center gap-1.5 bg-[#152e46] hover:bg-[#1f4568] text-cyan-300 font-bold py-3 px-4 rounded-xl text-xs transition-colors"
                  >
                    <Download size={14} />
                    <span>Save Poster</span>
                  </a>
                ) : (
                  <button
                    onClick={handleGeneratePoster}
                    className="flex items-center justify-center gap-1.5 bg-[#152e46]/60 text-cyan-400 font-bold py-3 px-4 rounded-xl text-xs"
                    disabled={isPosterGenerating}
                  >
                    <Download size={14} className="animate-bounce" />
                    <span>Generating...</span>
                  </button>
                )}

                {/* 2. SIMULATE WECHAT SHARE */}
                <button
                  onClick={() => handleSimulateWechatShare('friend')}
                  disabled={isSharingToWechat}
                  className="flex items-center justify-center gap-1.5 bg-[#26b180] hover:bg-[#1f936a] text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-colors"
                >
                  <Send size={13} />
                  <span>Share with Friends</span>
                </button>
              </div>

              {/* Extra trigger for Moments sharing */}
              <button
                onClick={() => handleSimulateWechatShare('moments')}
                disabled={isSharingToWechat}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-white/5 text-[10.5px] text-slate-300 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Share to Community</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const renderShareToast = () => {
    return (
      <AnimatePresence>
        {shareToastText && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute bottom-24 left-4 right-4 z-[110] bg-[#0d1527] border border-cyan-500/50 text-cyan-200 text-[10.5px] font-bold px-3 py-2.5 rounded-lg text-center flex items-center justify-center gap-2 shadow-2xl backdrop-blur-md"
          >
            <Sparkles size={13} className="text-cyan-400 animate-spin" />
            <span>{shareToastText}</span>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // -------------------------------------------------------------
  // VIEW MODE: SELECTION (STANDALONE SELECTION PAGE)
  // -------------------------------------------------------------
  if (viewMode === 'selection') {
    return (
      <div className="w-full h-full bg-[#03060a] text-slate-100 font-sans relative flex flex-col overflow-hidden">

        {/* Header Area */}
        <div className="relative z-20 flex justify-between items-center px-4 pt-5 pb-3 bg-black/80 backdrop-blur-md shrink-0 border-b border-white/5">
          <button
            onClick={() => {
              setViewMode('main');
              setSelectError(null);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            title="Back"
          >
            <ChevronLeft size={20} className="text-slate-200" />
          </button>

          <div className="text-center">
            <h2 className="text-sm font-black tracking-widest text-[#f5d06e] flex items-center justify-center gap-1.5">
              <Sparkles size={15} className="text-[#f5d06e]" />
              Build Your Weekend Route Set
            </h2>
          </div>

          <div className="w-10" />
        </div>

        {/* Scrollable Content */}
        <div id="selection-page-body" className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-4 hide-scrollbar">

          {/* Rules / Guide Banner */}
          <div className="bg-[#0b121e] rounded-2.5xl p-4 border border-cyan-500/10 text-left relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Compass size={48} className="text-cyan-400" />
            </div>
            <h4 className="text-xs font-black text-cyan-400 flex items-center gap-1.5">
              <span>🗺️</span> ROUTE SETUP
            </h4>
            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed font-semibold">
              Choose <strong className="text-[#f5d06e]">three</strong> routes below to create your weekend challenge.
            </p>
          </div>

          {/* Current Selection Progress Status */}
          <div className="bg-slate-900/40 border border-white/5 p-3 rounded-2xl text-left">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-bold block">SELECTED ROUTES</span>
              </div>
              <span className="font-mono text-sm font-black bg-cyan-950/80 text-cyan-400 px-3.5 py-1 rounded-xl border border-cyan-500/35 shrink-0">
                {activeRouteIds.length} / 3
              </span>
            </div>

            {/* Displaying actually selected items clearly so they can switch batches without confusion! */}
            {activeRouteIds.length > 0 ? (
              <div className="mt-2.5 pt-2.5 border-t border-white/5 flex flex-row overflow-x-auto whitespace-nowrap gap-1.5 pb-1 select-none overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {selectedItems.map((item) => (
                  <span
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRoute(item);
                    }}
                    className="text-[9.5px] font-black px-2.5 py-1 rounded-lg bg-cyan-950/50 hover:bg-red-950/30 border border-cyan-500/25 hover:border-red-500/30 text-cyan-300 hover:text-red-300 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    title="Click to remove selection"
                  >
                    📍 {item.cityName} · {item.routeName}
                    <X size={9} className="opacity-60" />
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-2.5 pt-2.5 border-t border-white/5 text-[10px] text-slate-500/90 border-dashed select-none leading-normal h-[34px] flex flex-col justify-center font-bold">
                <span className="opacity-75">No routes selected yet</span>
                <span className="opacity-50 text-[9px] mt-0.5">Choose three routes from the list below.</span>
              </div>
            )}
          </div>

          {/* Candidates Shuffling Header Row */}
          <div className="flex items-center justify-between px-1 mt-2">
            <span className="text-[11px] text-slate-400 font-bold">Recommended Routes · 5 at a time</span>
            <button
              onClick={handleRefreshCandidates}
              className="bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 border border-cyan-500/25 text-cyan-400 text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md"
            >
              <RefreshCw size={11} className="text-cyan-400 animate-pulse" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Beautiful Route List Column */}
          <div className="space-y-1.5 font-sans">
            {candidates.map((route) => {
              const isChecked = isRouteSelected(route.id);

              return (
                <div
                  key={route.id}
                  id={`route-card-${route.id}`}
                  onClick={() => handleToggleRoute(route)}
                  className={`group rounded-xl border px-3 py-2 transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] duration-200 ${
                    isChecked
                      ? 'bg-[#0a1829] border-cyan-500/60 shadow-[0_2px_12px_rgba(6,182,212,0.12)] ring-1 ring-cyan-500/10'
                      : 'bg-[#070c14] border-white/5 hover:border-white/10 hover:bg-[#0b1321]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Check mark badge */}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                      isChecked
                        ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                        : 'bg-black/40 border-slate-700 text-slate-500'
                    }`}>
                      {isChecked ? <Check size={11} className="stroke-[3.5] text-[#03060a]" /> : <Plus size={11} />}
                    </div>

                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {/* Country & City Badge */}
                      <span className="shrink-0 bg-slate-950/80 border border-white/10 text-slate-300 text-[10px] font-black px-2 py-0.5 rounded backdrop-blur-md">
                        📍 {route.countryName} · {route.cityName}
                      </span>
                      {/* Route Name */}
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {route.routeName}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Premium Keep-in-Place Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md pt-3 pb-6 px-4 border-t border-white/5 flex gap-3">

          <button
            onClick={() => {
              if (viewMode === 'selection') {
                setDraftRouteIds([]);
              } else {
                onUpdateState({ selectedRouteIds: [] });
              }
              setSelectError(null);
            }}
            className="px-4 py-3 bg-[#0d1624] border border-white/5 hover:border-white/10 hover:bg-[#142334] rounded-2xl text-xs font-bold text-slate-400 hover:text-slate-200 transition-all shrink-0 animate-pulse"
          >
            Clear
          </button>

          <button
            onClick={() => {
              if (activeRouteIds.length !== 3) {
                setSelectError("Choose exactly three routes before saving.");
                return;
              }
              // Commit the selection and start the activity loop
              onUpdateState({
                selectedRouteIds: activeRouteIds,
                activityStarted: true
              });
              setViewMode('main');
              setSelectError(null);
            }}
            className={`flex-1 py-3.5 rounded-2xl font-extrabold text-[13.5px] transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md ${
              activeRouteIds.length === 3
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-[0_4px_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Save Routes</span>
            <Check size={14} className="stroke-[3]" />
          </button>
        </div>

        {/* Floating Toast Alert notification for Selection errors */}
        <AnimatePresence>
          {selectError && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-28 left-6 right-6 z-50 bg-[#16060c]/95 border border-red-500/50 text-red-200 text-xs font-black px-4 py-3 rounded-xl text-center flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.8)] backdrop-blur-md"
            >
              <AlertCircle size={14} className="text-red-400 shrink-0 animate-bounce" />
              <span className="leading-snug text-left">{selectError}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW MODE: LOTTERY (STANDALONE LOTTERY PAGE - NO SCROLL COMPRESSED)
  // -------------------------------------------------------------
  if (viewMode === 'lottery') {
    return (
      <div className="w-full h-full bg-[#030408] text-slate-100 font-sans relative flex flex-col overflow-hidden">

        {/* Top Header layout mirroring mockup perfectly */}
        <div className="relative z-20 flex justify-between items-center px-4 pt-5 pb-3 bg-black/40 backdrop-blur-md shrink-0">
          <button
            onClick={() => {
              if (lotteryTimeoutRef.current) {
                clearTimeout(lotteryTimeoutRef.current);
              }
              setViewMode('main');
              setIsDrawing(false);
              setShowDrawModal(false);
              setRecentDrawReward(null);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 transition-colors"
            title="Return Home Page"
          >
            <ChevronLeft size={20} className="text-slate-200" />
          </button>

          <div className="text-center">
            <h2 className="text-base font-black tracking-wide text-white leading-tight">
              Prize Wheel
            </h2>
            <p className="text-[10px] text-[#8e8e93] mt-1 font-semibold">
              Spin the wheel for a chance to win cash rewards.
            </p>
          </div>

          <button
            onClick={() => setSimulateEmptyLottery(prev => !prev)}
            className={`px-2 py-1 rounded-lg text-[9px] font-black border transition-all active:scale-95 flex items-center gap-1 shrink-0 ${
              simulateEmptyLottery
                ? 'bg-rose-950/50 border-rose-500/40 text-rose-400'
                : 'bg-zinc-900 border-zinc-800 text-slate-400 hover:text-slate-200'
            }`}
            title="One-click cut: Simulation of the award pool is empty"
          >
            <span>{simulateEmptyLottery ? "Empty" : "Preview Mode"}</span>
          </button>
        </div>

        {/* Scrollable Sub-screen Inner */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 hide-scrollbar pb-8">

          {/* Main Card Container with premium design */}
          <div className="w-full bg-[#12131a] rounded-3xl p-5 border border-zinc-850 shadow-[0_12px_28px_rgba(0,0,0,0.55)] relative overflow-hidden text-center">

            {/* Sleek, simplified cash pool status row */}
            <div className="flex flex-col items-center mb-6 space-y-3">
              {activeRemainingPrizes.length === 0 ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/15 bg-rose-950/20 text-rose-400 text-[10px] font-black tracking-wider uppercase">
                  <AlertCircle size={10} className="text-rose-400 animate-pulse" />
                  <span>This round's {LOTTERY_TOTAL_CHANCES} draws have all been claimed.</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ffe082]/15 bg-[#1a1710]/80 text-[#f5cb4e] text-[10px] font-black tracking-wider uppercase">
                  <Sparkles size={10} className="text-[#f5cb4e] animate-pulse" />
                  <span>{LOTTERY_TOTAL_CHANCES} draws · Total prize pool {LOTTERY_TOTAL_AMOUNT.toFixed(0)}</span>
                </div>
              )}

              {(() => {
                const remainingChances = activeRemainingPrizes.length;
                const usedChances = LOTTERY_TOTAL_CHANCES - remainingChances;
                return (
                   <div className="w-full max-w-[240px] flex justify-between items-center text-[10px] text-zinc-400 bg-black/20 border border-white/5 rounded-xl px-3.5 py-2 font-bold shadow-inner">
                    <span className="flex items-center gap-1 text-zinc-500">
                      Draws Left:
                      <span className={`${remainingChances === 0 ? 'text-rose-400' : 'text-[#ffe285]'} font-black font-mono text-[11px]`}>{remainingChances} draws</span>
                    </span>
                    <div className="h-3 w-px bg-zinc-800" />
                    <span>Used {usedChances} draws</span>
                  </div>
                );
              })()}
            </div>

            {/* STUNNING 3D-GLOWING BIG TURNTABLE (DA ZHUAN PAN) */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto select-none mt-4 mb-4">

              {/* Prize Pool Completely Exhausted Overlay */}
              {activeRemainingPrizes.length === 0 && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-[3px] rounded-full z-30 flex flex-col items-center justify-center text-center p-6 border-4 border-rose-900/40 shadow-[0_0_25px_rgba(239,68,68,0.15)]">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-rose-950/90 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-3 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                  >
                    <AlertCircle size={32} className="text-rose-500 animate-pulse" />
                  </motion.div>
                  <motion.h4
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-base font-black text-rose-400 tracking-wide"
                  >
                    Prize Pool Empty
                  </motion.h4>
                  <motion.p
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-[10.5px] text-zinc-400 mt-2 max-w-[180px] leading-relaxed font-medium"
                  >
                    {LOTTERY_TOTAL_CHANCES} The next event is being prepared. Check back soon.
                  </motion.p>
                </div>
              )}

              {/* Outer Stereoscopic Metallic Gold Flaps/Tassels mimicking the mockup earmuffs */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-5 h-16 rounded-l-xl bg-gradient-to-r from-red-700 to-amber-500 border-l-2 border-y-2 border-[#ffdf7e]/55 shadow-lg z-15" />
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-5 h-16 rounded-r-xl bg-gradient-to-l from-red-700 to-amber-500 border-r-2 border-y-2 border-[#ffdf7e]/55 shadow-lg z-15" />

              {/* The Outer Gold/Metallic Frame with Blinking Lights */}
              <div className="absolute inset-0 rounded-full border-[10px] border-[#FFE7A5]/90 bg-gradient-to-b from-[#ff3c3c] to-[#990a0a] shadow-[0_12px_36px_rgba(0,0,0,0.65),_inset_0_2px_10px_rgba(255,255,255,0.4)] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-[1px] rounded-full border-2 border-amber-500/40 pointer-events-none" />
              </div>

              {/* ROTATING WHEEL CANVAS CONTAINER */}
              <motion.div
                animate={{ rotate: wheelRotation }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-[14px] rounded-full overflow-hidden shadow-inner bg-stone-100"
              >
                <svg viewBox="0 0 200 200" className="w-full h-full rotate-0">
                  <defs>
                    <radialGradient id="outerRedGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ff4d4d" />
                      <stop offset="60%" stopColor="#e52d27" />
                      <stop offset="100%" stopColor="#940b0e" />
                    </radialGradient>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fff9e6" />
                      <stop offset="30%" stopColor="#ffe082" />
                      <stop offset="70%" stopColor="#ffb300" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                    <linearGradient id="blackGoldCard" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4A4E69" />
                      <stop offset="40%" stopColor="#222431" />
                      <stop offset="100%" stopColor="#0B0C10" />
                    </linearGradient>
                    <linearGradient id="buttonRed" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ff8a8a" />
                      <stop offset="25%" stopColor="#ff3b30" />
                      <stop offset="80%" stopColor="#d51a1a" />
                      <stop offset="100%" stopColor="#800609" />
                    </linearGradient>
                    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodOpacity="0.45" />
                    </filter>
                  </defs>

                  {/* Slices representation (6 equal spaces) */}
                  {WHEEL_SECTORS.map((p, idx) => {
                    const startAngle = -90 + idx * 60;
                    const endAngle = startAngle + 60;
                    const d = getSectorPath(startAngle, endAngle, 99); // Fill inner area perfectly

                    const midAngle = startAngle + 30;
                    const midRad = (midAngle * Math.PI) / 180;
                    const tx = 100 + 54 * Math.cos(midRad);
                    const ty = 100 + 54 * Math.sin(midRad);

                    // Alternating sectors color exactly copying reference image's color scheme
                    const fill = idx % 2 === 0 ? '#FFFFFF' : '#FFF2EC';

                    return (
                      <g key={idx}>
                        {/* Sector shape */}
                        <path
                          d={d}
                          fill={fill}
                          stroke="#FFE8D5"
                          strokeWidth="1"
                          className="transition-colors duration-200"
                        />
                        {/* Golden dividers lines */}
                        <line
                          x1="100"
                          y1="100"
                          x2={(100 + 99 * Math.cos((startAngle * Math.PI) / 180)).toFixed(2)}
                          y2={(100 + 99 * Math.sin((startAngle * Math.PI) / 180)).toFixed(2)}
                          stroke="#FFA785"
                          strokeWidth="1"
                          strokeOpacity="0.55"
                        />

                        {/* Handcrafted Vector Red Envelope & Cash Amount strictly centered with smaller delicate scale */}
                        <g transform={`translate(${tx}, ${ty}) rotate(${midAngle + 90}) scale(0.72)`}>
                          <g transform="translate(0, -12) scale(1.1)" filter="url(#dropShadow)">
                            {/* Red Envelope 🧧 */}
                            <rect x="-9" y="-12" width="18" height="24" rx="2" fill="#E63F38" />
                            <path d="M -9 -12 L 0 -1 L 9 -12 Z" fill="#C92922" />
                            <circle cx="0" cy="3" r="3.5" fill="#FFD75E" />
                            <text x="0" y="4" textAnchor="middle" dominantBaseline="middle" fontSize="3.1" fill="#E63F38" fontWeight="black">$</text>
                          </g>

                          {/* Bottom Cash Amount styling */}
                          <text
                            x="0"
                            y="16"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-[#A11B15] font-mono font-black text-[13.5px] tracking-tight leading-none"
                          >
                            ${p.value.toFixed(2)}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* Subtle inner gold rim inside wheel sectors */}
                  <circle cx="100" cy="100" r="98" fill="none" stroke="#FFE2BC" strokeWidth="0.5" strokeOpacity="0.4" />
                </svg>
              </motion.div>

              {/* OUTSIDE GLOWING LED DOTS (Placed at outer edge border with dynamic chasing lighting on spin) */}
              <div className={`absolute inset-0 pointer-events-none z-10 ${isDrawing ? 'animate-[spin_2s_linear_infinite]' : ''}`}>
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = i * 30; // 12 lamps total
                    const rad = (angle * Math.PI) / 180;
                    const lx = 100 + 94.2 * Math.cos(rad);
                    const ly = 100 + 94.2 * Math.sin(rad);
                    const isOdd = i % 2 !== 0;
                    return (
                      <circle
                        key={i}
                        cx={lx}
                        cy={ly}
                        r="2.5"
                        className={`${
                          isOdd
                            ? "fill-white drop-shadow-[0_0_2px_#FFF] opacity-95"
                            : "fill-[#FFE285] drop-shadow-[0_0_2.5px_#FFE285] opacity-90"
                        }`}
                        style={{
                          animation: isDrawing
                            ? `pulse 0.15s infinite alternate ${i * 0.04}s`
                            : `pulse 0.5s infinite alternate ${i * 0.08}s`
                        }}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* CENTER 3D SPIN BUTTON (GO Red-Gold Dial layered on top perfectly - kept fully bright even at 0 chances) */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">

                  {/* Top Pointer - a beautifully extruded Red Triangle pointing at 12 o'clock */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[15px] border-b-[#E53E3E] filter drop-shadow-[0_-1px_2px_rgba(255,224,130,0.6)] z-25">
                    <div className="absolute top-1 -left-[4.5px] w-0 h-0 border-l-[4.5px] border-l-transparent border-r-[4.5px] border-r-transparent border-b-[10px] border-b-[#FFE895]" />
                  </div>

                  {/* Golden Base shadow disk */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#FFF5D9] via-[#E2A740] to-[#7F3E00] p-[3px] shadow-[0_8px_20px_rgba(0,0,0,0.7)]">
                    <button
                      disabled={isDrawing || lotteryChances <= 0}
                      onClick={handleSpinWheel}
                      className={`w-full h-full rounded-full flex flex-col items-center justify-center transition-all border-[2.2px] border-[#800709] active:scale-95 text-white ${
                        isDrawing
                          ? 'bg-gradient-to-b from-[#FFF5F5] via-[#E53E3E] to-[#990B0B] cursor-not-allowed opacity-90 scale-95 select-none'
                          : lotteryChances <= 0
                            ? 'bg-gradient-to-b from-[#FF7A7A] via-[#EF4444] to-[#B91C1C] cursor-not-allowed opacity-100 brightness-110 shadow-[0_0_12px_rgba(239,68,68,0.4)]' // Keep the festive red and gold button fully bright even with 0 chances! No darkness at all
                            : 'bg-gradient-to-b from-[#FFF5F5] via-[#E53E3E] to-[#990B0B] hover:scale-[1.03] hover:brightness-[1.05] cursor-pointer'
                      }`}
                      style={{
                        boxShadow: 'inset 0 2.2px 3px rgba(255, 255, 255, 0.45)',
                      }}
                    >
                      <span className={`text-[11.5px] sm:text-[13px] font-black tracking-wider -mb-0.5 select-none uppercase drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.85)] ${
                        lotteryChances <= 0 ? 'text-[#FFE895]' : 'text-[#FFEFCB]'
                      }`}>
                        Spin
                      </span>
                      <span className={`text-[10px] sm:text-[11px] font-black tracking-wide select-none drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.85)] ${
                        lotteryChances <= 0 ? 'text-[#FFE895]' : 'text-[#FFEFCB]'
                      }`}>
                        Draw
                      </span>
                    </button>
                  </div>

                </div>
              </div>

            </div>

            {/* 大转盘底部托板 (国潮金色双层拟物横条，1:1对应截图底条样式) */}
            <div className="relative mt-8 mb-3 mx-auto max-w-[280px]">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 rounded-full blur-sm opacity-25" />
              <div className="relative bg-gradient-to-b from-[#FFF3E5] via-[#FFE2C2] to-[#FFD5A1] text-[#9E1A03] text-[11.5px] font-black px-5 py-2.5 rounded-full border-2 border-[#E5A548] shadow-[0_8px_18px_rgba(0,0,0,0.45),_inset_0_2px_4px_rgba(255,255,255,0.8)] tracking-wide flex justify-center items-center gap-1.5 font-sans">
                <span>You have</span>
                <span className="text-red-600 text-sm font-extrabold font-mono bg-white/70 px-2 py-0.5 rounded-md min-w-[20px] text-center shadow-inner inline-block animate-pulse">
                  {lotteryChances}
                </span>
                <span>draws left</span>
              </div>
            </div>

            {/* 新增的分享即可获取抽奖次数按钮 */}
            <div className="mt-1.5 mb-2 mx-auto max-w-[240px]">
              <button
                onClick={() => {
                  setShowSharePosterModal(true);
                  handleGeneratePoster();
                }}
                className="w-full py-2 bg-slate-800/80 hover:bg-slate-700/80 text-yellow-300 font-bold rounded-full border border-yellow-400/40 text-[11px] flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
              >
                <Share2 size={12} className="text-yellow-400" />
                <span>Share your result to earn one bonus draw.</span>
              </button>
            </div>

          </div>

          {/* 🎁 奖池与概率 */}
          <div className="w-full bg-[#12131a]/60 rounded-3xl p-4.5 border border-zinc-850/60 shadow text-left space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
              <span className="text-[11.5px] font-black text-[#f5cb4e] flex items-center gap-1.5 leading-none">
                <Gift size={13} className="text-[#f5cb4e]/90" />
                Prize Pool & Odds
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#8e8e93] font-bold">Published odds</span>
              </div>
            </div>

            {/* Six column horizontal layout cards */}
            <div className="grid grid-cols-6 gap-1 pt-0.5">
              {LOTTERY_POOL_CONFIG.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-black/35 border border-[#ffe082]/5 rounded-xl py-2 px-0.5 text-center flex flex-col justify-between h-14"
                >
                  <span className="text-[10px] font-mono font-black text-[#ffe082] block tracking-tighter leading-none">
                    ${p.value.toFixed(2)}
                  </span>
                  <span className="text-[8px] text-[#8e8e93] font-bold block leading-none">
                    {p.probability}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ⏱️ 实时中奖记录 */}
          <div className="w-full bg-[#12131a]/60 rounded-3xl p-4.5 border border-zinc-850/60 shadow text-left space-y-3.5">
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
              <span className="text-[11.5px] font-black text-slate-200 flex items-center gap-1.5 leading-none">
                <Clock size={13} className="text-zinc-400" />
                Recent Winners
              </span>
              <span className="text-[10px] text-[#8e8e93] font-semibold leading-none">{globalRecords.length} records</span>
            </div>

            <div className="space-y-2 divide-y divide-zinc-800/50 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800/85">
              {globalRecords.map((record, i) => (
                <div key={record.id || i} className="flex justify-between items-center pt-2 first:pt-1 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10.5px] ${
                      record.isCurrentUser
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                        : 'bg-zinc-800/50 text-slate-300 border border-zinc-800/60'
                    }`}>
                      {record.isCurrentUser ? '🏆' : record.nickname.substring(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-bold ${
                          record.isCurrentUser ? 'text-amber-300' : 'text-zinc-200'
                        }`}>
                          {record.nickname}
                        </span>
                        {record.isCurrentUser && (
                          <span className="text-[8px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1 rounded-sm font-black scale-90 origin-left">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[9.5px] text-zinc-500 font-medium block">
                        {record.time} · Wallet balance
                      </span>
                    </div>
                  </div>
                  <span className={`font-mono font-black text-sm ${
                    record.isCurrentUser ? 'text-amber-400' : 'text-yellow-500/90'
                  }`}>
                    +{record.amount.toFixed(2)} USD
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>



        {/* ROLLED PRIZE RESULT MODAL OVERLAY INLINE TO LOTTERY VIEW */}
        <AnimatePresence>
          {showDrawModal && recentDrawReward !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            >
              {/* Premium particle scatter feedback */}
              <ConfettiCanvas active={showDrawModal} />

              <motion.div
                initial={{ scale: 0.9, rotateY: 90 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                className="bg-gradient-to-t from-[#c52c2c] to-[#aa2020] rounded-3xl p-6 w-full max-w-xs shadow-[0_0_50px_rgba(239,68,68,0.4)] border border-yellow-400/30 text-center relative flex flex-col items-center"
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl opacity-30">
                  <span className="absolute top-4 left-6 text-yellow-300 transform -rotate-12 select-none">✨</span>
                  <span className="absolute top-1/2 right-4 text-yellow-200 text-xl transform rotate-12 select-none">✨</span>
                  <span className="absolute bottom-6 left-12 text-yellow-400 transform -rotate-45 select-none">✨</span>
                </div>

                <h3 className="text-lg font-black text-yellow-200 tracking-widest mt-4">You Won a Cash Reward!</h3>
                <p className="text-[10px] text-yellow-100/50 mt-1 font-mono tracking-widest font-bold">REWARD UNLOCKED</p>

                <div className="my-6">
                  <span className="text-slate-100 font-sans text-xs font-bold leading-none pr-1">$</span>
                  <span className="text-5xl font-black font-mono text-yellow-300 select-all leading-none" style={{ textShadow: '2px 3px 0 rgba(0,0,0,0.15)' }}>
                    {recentDrawReward}
                  </span>
                  <span className="text-[11px] text-yellow-200 block mt-2.5 font-bold">Cash added to your wallet</span>
                </div>

                <button
                  onClick={handleCloseDrawModal}
                  className="w-full py-3 bg-gradient-to-r from-yellow-300 to-amber-400 hover:from-yellow-200 hover:to-amber-300 text-slate-900 font-extrabold rounded-xl text-xs transition-colors tracking-widest uppercase shadow-md"
                >
                  Claim Reward
                </button>

                <button
                  onClick={() => {
                    handleCloseDrawModal();
                    setShowSharePosterModal(true);
                    handleGeneratePoster();
                  }}
                  className="w-full mt-3 py-3 bg-white/10 hover:bg-white/20 text-yellow-300 border border-yellow-400/30 font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <Share2 size={13} className="text-yellow-400" />
                  <span>Share to earn one bonus draw</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {renderSharePosterModal()}
        {renderShareToast()}

      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW MODE: MAIN VIEW (WEEKEND EVENT HOME SCREEN)
  // -------------------------------------------------------------
  return (
    <div className="w-full h-full bg-[#03060a] text-slate-100 font-sans relative flex flex-col overflow-hidden">

      {/* Scrollable View Containment */}
      <div className="flex-1 overflow-y-auto pb-36 hide-scrollbar flex flex-col">

        <StickyHeroNav>
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md transition-colors"
            title="Back"
          >
            <ChevronLeft size={20} className="text-slate-200" />
          </button>

          <div className="flex items-center gap-2 select-none">
            <button
              onClick={() => setSimulateNotStarted(prev => !prev)}
              className={`px-2 py-1.5 rounded-full text-[9px] font-black border transition-all active:scale-95 flex items-center gap-1 shrink-0 shadow-md ${
                simulateNotStarted
                  ? 'bg-amber-950/50 border-amber-500/40 text-amber-400'
                  : 'bg-black/50 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
              title="One-key switch: Simulation activity is not open"
            >
              <span>{simulateNotStarted ? "Preview: Not Started" : "Preview Mode"}</span>
            </button>

            <div className="bg-[#12231c]/70 border border-emerald-500/20 px-3 py-1.5 rounded-full text-[10px] font-black text-emerald-400 tracking-wider flex items-center gap-1.5 shadow-[0_4px_12px_rgba(16,185,129,0.15)]">
              <span>WEEKEND EVENT</span>
            </div>
          </div>
        </StickyHeroNav>

        {/* 1. Header Hero Area (Poster Style with image backdrop) */}
        <div className="relative w-full shrink-0 overflow-hidden bg-[#03060a] pt-[calc(56px+max(16px,env(safe-area-inset-top)))]">
          {/* Unsplash beautiful high-quality image of sunset palace / backdrop */}
          <img
            src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80"
            alt="historical_backdrop"
            className="absolute inset-0 w-full h-[52vh] object-cover opacity-60 z-0"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1506501139174-099022df5260?auto=format&fit=crop&w=1000&q=80";
            }}
          />
          {/* Subtle vignette gradients to guarantee premium contrast and melt back into the page background */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#03060a] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-black/20 z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#03060a] via-[#03060a]/80 to-transparent z-10 pointer-events-none" />

          {/* Hero Content Block */}
          <div className="relative z-20 px-5 pt-12 pb-6 text-left">
            {/* Unified category tag */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/25 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                <span>WEEKEND CHALLENGE</span>
              </div>
              <div className="inline-flex items-center bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold px-2 py-1 rounded-md text-[9px] uppercase tracking-normal leading-none">
                <span>LIMITED EVENT</span>
              </div>
            </div>

            {/* Huge bold display title */}
            <h1 className="text-[25px] font-black text-white mt-3.5 tracking-wide leading-tight drop-shadow-sm select-none">
              Weekend City Mix
            </h1>

            {/* Explanatory introduction text */}
            <p className="text-[11.5px] text-slate-300 leading-relaxed font-semibold mt-3 max-w-[340px] drop-shadow-sm">
              🏃‍♂️ <b>Weekend City Mix</b>{": Custom cross-domain 3 fine routes, jogging or strolling between natural monuments. Unlocking 5 cash-drawing opportunities when all is achieved!"} {LOTTERY_TOTAL_CHANCES} draws · Prize pool ${LOTTERY_TOTAL_AMOUNT.toFixed(0)}。
            </p>

            {/* Integrated activity opening schedule banner with custom thin borders */}
            <div className="mt-5 bg-[#0b1213]/85 rounded-2xl p-4 border border-[#f5d06e]/15 max-w-sm shadow-xl">
              <div className="flex items-center gap-1.5 text-[#f5d06e] font-black text-[10.5px] tracking-widest">
                <span>Event Schedule</span>
              </div>
              <p className="text-[14px] font-mono font-black text-slate-100 mt-1.5 tracking-wider font-bold">
                2026.06.06 00:00 - 06.07 23:59
              </p>
            </div>
          </div>
        </div>

        {/* 2. Scrollable Body Content */}
        <div className="flex-1 px-4 space-y-4">

          {/* THREE COLUMNS STATS CARD BLOCK */}
          <div className="grid grid-cols-3 gap-3 text-left">
            {/* Card 1 */}
            <div className="bg-[#090e16]/80 rounded-2xl p-4 border border-white/5 flex flex-col justify-between shadow">
              <span className="text-xl font-black text-slate-100 font-mono tracking-tight leading-none">
                {selectedRouteIds.length}/3
              </span>
              <span className="text-[10px] text-slate-500 font-bold mt-2.5 leading-none">Routes Selected</span>
            </div>
            {/* Card 2 */}
            <div className="bg-[#090e16]/80 rounded-2xl p-4 border border-white/5 flex flex-col justify-between shadow">
              <span className="text-xl font-black text-emerald-400 font-mono tracking-tight leading-none">
                {completedCount}/3
              </span>
              <span className="text-[10px] text-slate-500 font-bold mt-2.5 leading-none">Routes Complete</span>
            </div>
            {/* Card 3 */}
            <div className="bg-[#090e16]/80 rounded-2xl p-4 border border-white/5 flex flex-col justify-between shadow">
              <span className="text-xl font-black text-[#f5d06e] font-mono tracking-tight leading-none">
                {lotteryChances}
              </span>
              <span className="text-[10px] text-slate-500 font-bold mt-2.5 leading-none">Prize Draws</span>
            </div>
          </div>

          {/* CORE CARD SECTION - 我的路线串烧 */}
          <div className="bg-[#080d15] rounded-2xl p-4 border border-white/5 space-y-4 text-left shadow-lg">
            {/* Section Header */}
            <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
              <span className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                <span className="text-base select-none leading-none">🗺️</span> My Weekend Routes
              </span>
            </div>

            {/* Dashed placeholder container if unselected or not started */}
            {simulateNotStarted ? (
              <div className="w-full py-10 rounded-2xl border border-dashed border-amber-500/20 bg-amber-950/5 flex flex-col items-center justify-center gap-2.5 select-none text-center">
                <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Clock size={20} className="animate-pulse" />
                </div>
                <span className="text-[13px] font-black tracking-wider text-amber-400">
                  This event has not started yet
                </span>
                <p className="text-[10px] text-slate-500 max-w-[220px] leading-normal font-bold">
                  Check the event schedule and come back when it opens.
                </p>
              </div>
            ) : selectedRouteIds.length === 0 ? (
              <button
                onClick={() => setViewMode('selection')}
                className="w-full py-8 focus:outline-none rounded-2xl border border-dashed border-[#f5d06e]/25 bg-[#060b13]/40 hover:bg-[#152e46]/10 flex flex-col items-center justify-center gap-2.5 group transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#1c1c15] border border-[#f5d06e]/15 group-hover:border-[#f5d06e]/30 flex items-center justify-center transition-all">
                  <Plus size={16} className="text-[#f5d06e]" />
                </div>
                <span className="text-[13px] font-black tracking-wider text-slate-200">
                  Choose Three City Routes
                </span>
                <p className="text-[10px] text-slate-400 max-w-[240px] text-center leading-normal font-semibold">
                  Open the route list and choose three routes. Your selection cannot be changed after saving.
                </p>
              </button>
            ) : (
              /* Selected items listing styling */
              <div className="space-y-3">
                {selectedItems.map((item, index) => {
                  const isCompleted = completedRouteIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="bg-[#05090f] rounded-xl border border-white/5 p-3 flex items-center gap-3 relative overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.cityName}
                        className="w-12 h-12 object-cover rounded-lg shrink-0"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1506501139174-099022df5260?auto=format&fit=crop&w=150&q=80";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-slate-800 text-[9px] text-[#f5d06e] font-black px-1.5 py-0.5 rounded shrink-0">
                            {"Route"} {index + 1}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">{item.cityName}</span>
                        </div>
                        <h5 className="text-[12px] font-black text-slate-100 truncate mt-1">
                          {item.title}
                        </h5>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10.5px] font-mono text-slate-400 font-bold">{item.distance} km</span>
                        {activityStarted ? (
                          isCompleted ? (
                            <span className="bg-emerald-950/80 border border-emerald-500/30 text-[#2ebd90] text-[9px] font-black px-2 py-0.5 rounded-md">{"Completed"}</span>
                          ) : (
                            <button
                              onClick={() => {
                                if (activeRemainingPrizes.length === 0) {
                                  setSelectError("The prize pool is empty, so this route cannot be started right now.");
                                  return;
                                }
                                onNavigateToRouteDetail(item.cityId, item.routeIndex, item.image);
                              }}
                              className={`text-[9.5px] font-black px-2.5 py-1 rounded-md flex items-center gap-0.5 transition-all ${
                                activeRemainingPrizes.length === 0
                                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                                  : 'bg-[#26b180] hover:bg-[#1f936a] text-white shadow-[0_2px_8px_rgba(38,177,128,0.2)] active:scale-95'
                              }`}
                              disabled={activeRemainingPrizes.length === 0}
                            >
                              <Play size={8} className={activeRemainingPrizes.length === 0 ? "fill-zinc-500 text-zinc-500" : "fill-white"} />
                              <span>{activeRemainingPrizes.length === 0 ? "Empty" : "Start"}</span>
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => {
                              onUpdateState({ selectedRouteIds: selectedRouteIds.filter(id => id !== item.id) });
                            }}
                            className="p-1 hover:bg-rose-950/20 text-rose-500 rounded-lg transition-colors"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {!activityStarted && selectedRouteIds.length < 3 && (
                  <button
                    onClick={() => setViewMode('selection')}
                    className="w-full py-3 bg-[#05090f] hover:bg-[#152e46]/10 rounded-xl border border-dashed border-slate-800 hover:border-cyan-500/30 text-left pl-3 text-xs font-bold text-slate-500 hover:text-cyan-400 transition-all flex items-center gap-2"
                  >
                    <Plus size={14} />
                    <span>Add more routes · {3 - selectedRouteIds.length} remaining</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Remove the completed banner card per request */}

          {/* ACTIVITY RULES CARD BLOCK */}
          <div className="bg-[#080d15] rounded-2xl p-4 border border-white/5 text-left space-y-3 shadow-lg">
            <span className="text-xs font-black text-slate-200 flex items-center gap-1.5">
              <span>✨</span> Event Rules
            </span>
            <ul className="text-[11px] text-slate-400 space-y-2.5 font-bold leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#f5d06e] shrink-0">1.</span>
                <span>1. After you save three routes, your weekend challenge is locked and cannot be edited.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#f5d06e] shrink-0">2.</span>
                <span>2. Complete all three routes to earn <strong className="text-[#f5d06e]">five</strong> prize draws.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#f5d06e] shrink-0">3.</span>
                <span>3. Share your achievement poster after the challenge to earn <strong className="text-cyan-400">one</strong> bonus draw.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#f5d06e] shrink-0">4.</span>
                <span className="text-rose-400/90">4. New entries and draws close when the prize pool is empty.</span>
              </li>
            </ul>
          </div>


        </div>

      </div>

      {/* FLOAT ALERTS PORTAL */}
      {renderShareToast()}

      {/* 4. KEEP-IN-PLACE PREMIUM FLOATING BOTTOM DOCK ACTION BAR */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md pt-3.5 pb-5 pb-safe px-4 border-t border-white/5 flex flex-col gap-2.5">
        <div className="flex gap-3">

          {/* Main Action Button */}
          <button
            onClick={handleActionClick}
            className={`flex-1 py-3.5 rounded-2xl font-black text-[13px] tracking-wide transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md ${
              simulateNotStarted
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5 shadow-inner'
                : activeRemainingPrizes.length === 0
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5 shadow-inner'
                  : selectedRouteIds.length < 3
                    ? 'bg-[#f5cb4e] hover:bg-[#dfb73c] text-slate-900 shadow-[0_4px_15px_rgba(245,203,78,0.25)]'
                    : !activityStarted
                      ? 'bg-[#26b180] hover:bg-[#1f936a] text-white shadow-[0_4px_15px_rgba(38,177,128,0.25)]'
                      : isMedleyAllCompleted
                        ? 'bg-gradient-to-r from-[#eab308] to-[#f59e0b] hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-black shadow-[0_4px_15px_rgba(234,179,8,0.3)] animate-pulse'
                        : 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black shadow-[0_4px_15px_rgba(6,182,212,0.25)]'
            }`}
            disabled={simulateNotStarted || activeRemainingPrizes.length === 0}
          >
            {simulateNotStarted ? (
              <>
                <Clock size={14} className="stroke-[2.5] text-zinc-500" />
                <span>Event Not Started</span>
              </>
            ) : activeRemainingPrizes.length === 0 ? (
              <>
                <Gift size={14} className="stroke-[2.5] text-zinc-500" />
                <span>Prize Pool Empty</span>
              </>
            ) : selectedRouteIds.length < 3 ? (
              <>
                <span>Choose Three Routes</span>
              </>
            ) : !activityStarted ? (
              <>
                <span>Save & Start Challenge</span>
              </>
            ) : isMedleyAllCompleted ? (
              <>
                <Gift size={14} className="stroke-[2.5]" />
                <span>Open Prize Wheel</span>
              </>
            ) : (
              <>
                <Play size={10} className="fill-slate-950" />
                <span>Start Weekend Challenge</span>
              </>
            )}
          </button>

          {/* Social Share Poster Trigger Button */}
          <button
            onClick={() => {
              if (simulateNotStarted) {
                setSelectError("The event has not started, so a poster is not available yet.");
                return;
              }
              setShowSharePosterModal(true);
              handleGeneratePoster();
            }}
            disabled={simulateNotStarted}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${
              simulateNotStarted
                ? 'bg-zinc-900/50 border-white/5 opacity-40 cursor-not-allowed text-zinc-600'
                : 'bg-[#0e1624] border-white/5 hover:bg-[#142234] text-slate-300 active:scale-95'
            }`}
            title={simulateNotStarted ? "Activity not started" : "Generate a final shared poster"}
          >
            <Share2 size={17} />
          </button>

          {/* Gift Box button (Exclusively triggers viewMode to LOTTERY) */}
          <button
            onClick={() => setViewMode('lottery')}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all relative ${
              viewMode === 'lottery'
                ? 'bg-[#1b122c] border-purple-500/50 text-purple-300'
                : 'bg-[#0e1624] border-white/5 text-slate-300 hover:text-amber-300 hover:border-amber-400/30'
            }`}
            title="Go to the independent draw card page"
          >
            {lotteryChances > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-[8px] font-black text-white flex items-center justify-center animate-bounce">
                {lotteryChances}
              </span>
            )}
            <Gift size={18} />
          </button>
        </div>


      </div>

      {/* EXQUISITE SHARE POSTER MODAL (WITH CODE CANVAS SUPPORT AND RAW PREVIEWS) */}
      {renderSharePosterModal()}

      {/* 🎉 WEEKEND MEDLEY COMPLETION CELEBRATION MODAL OVERLAY */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 18 }}
              className="bg-[#0f101a] border border-[#f5cb4e]/30 rounded-3xl p-6 w-full max-w-xs shadow-[0_0_50px_rgba(245,203,78,0.15)] text-center relative flex flex-col items-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCompletionModal(false)}
                className="absolute top-4 right-4 z-50 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5 active:scale-90 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X size={16} className="stroke-[2.5]" />
              </button>

              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl opacity-25">
                <span className="absolute top-4 left-6 text-yellow-300 transform -rotate-12 select-none">✨</span>
                <span className="absolute top-1/2 right-4 text-[#2ebd90] text-xl transform rotate-12 select-none">✨</span>
                <span className="absolute bottom-6 left-12 text-yellow-400 transform -rotate-45 select-none">✨</span>
              </div>

              {/* Glowing circular celebration Trophy icon container */}
              <div className="w-16 h-16 bg-gradient-to-tr from-[#ffe28a] to-[#df9d1d] rounded-full flex items-center justify-center mb-5 ring-4 ring-[#f5cb4e]/20 animate-bounce shadow-lg">
                <Trophy size={28} className="text-[#0a001a] stroke-[2.5]" />
              </div>

              <h3 className="text-base font-black text-white px-2 tracking-wide">Weekend City Mix Complete!</h3>
              <p className="text-[10px] text-yellow-400/80 font-black mt-1 font-mono tracking-widest">ALL THREE ROUTES COMPLETE</p>

              <div className="my-5 space-y-1.5 text-left bg-black/40 border border-white/5 p-4 rounded-2xl">
                <p className="text-xs text-slate-200 leading-relaxed font-bold">
                  Congratulations, <strong className="text-yellow-400">{"MOVEVI Runner"}</strong>！
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                  You completed all three routes in this weekend challenge.
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                  Five prize draws are now unlocked. Open the prize wheel to claim your rewards.
                </p>
              </div>

              <div className="w-full">
                {/* 🧧 Primary Action Button: Go to lottery */}
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    setViewMode('lottery');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
                >
                  <Gift size={14} className="stroke-[2.5]" />
                  <span>Open Prize Wheel</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
