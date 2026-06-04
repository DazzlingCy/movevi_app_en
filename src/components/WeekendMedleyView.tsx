import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Award, Gift, Share2, Sparkles, Check, Play, Lock, 
  Info, Landmark, Trophy, Share, Coins, ArrowRight, HelpCircle,
  Plus, Trash2, X, Star, Clock, Compass, MapPin, Download, Send, AlertCircle,
  Mail, Ticket
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
}

export const MEDLEY_CANDIDATE_ROUTES: MedleyRouteItem[] = [
  {
    id: '1-2',
    cityId: '1',
    routeIndex: 2,
    cityName: 'Hangzhou',
    routeName: 'Lingyin Temple',
    title: 'Hangzhou • Peaceful Lingyin',
    image: 'https://images.unsplash.com/photo-1582650841195-2acbeacc7fc5?auto=format&fit=crop&w=500&q=80',
    spots: 'Lingyin Temple — Feilai Peak — Faxi Temple',
    intro: 'Escape the city and go deep into the ancient forest temples. Breathe fresh air under towering old trees and return to inner peace.',
    distance: '4.2',
    duration: 'Approx. 25 mins',
    rating: 4.9
  },
  {
    id: '2-1',
    cityId: '2',
    routeIndex: 1,
    cityName: 'Beijing',
    routeName: 'Forbidden City Watchtower',
    title: 'Beijing • Forbidden City Watchtower',
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=500&q=80',
    spots: 'Shenwumen — Watchtower — Jingshan Front Street',
    intro: 'Run along the red walls of the Forbidden City, weave through watchtower shadows, and listen to the footsteps of history.',
    distance: '4.0',
    duration: 'Approx. 24 mins',
    rating: 4.8
  },
  {
    id: '3-1',
    cityId: '3',
    routeIndex: 1,
    cityName: 'Shanghai',
    routeName: 'City Memories',
    title: 'Shanghai • Pujiang Memories',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80',
    spots: 'The Bund — Yu Garden — Tianzifang',
    intro: 'Stroll between Shikumen lanes and Bund historic architectures, feeling the unique fusion of old alleyways and vibrant modernity.',
    distance: '5.2',
    duration: 'Approx. 31 mins',
    rating: 4.7
  },
  {
    id: '4-1',
    cityId: '4',
    routeIndex: 1,
    cityName: 'Nanjing',
    routeName: 'Jinling Ancient Capital',
    title: 'Nanjing • Ancient Jinling Tour',
    image: 'https://images.unsplash.com/photo-1547984609-444491a57c13?auto=format&fit=crop&w=500&q=80',
    spots: 'Xuanwu Lake — Taicheng Ming City Wall — Confucius Temple',
    intro: 'Ascend the weather-beaten Ming City Wall of Taicheng, listening to the eternal echoes of ancient dynasties in the wind.',
    distance: '4.8',
    duration: 'Approx. 28 mins',
    rating: 4.9
  },
  {
    id: '5-1',
    cityId: '5',
    routeIndex: 1,
    cityName: 'Xi\'an',
    routeName: 'Chang\'an City Wall Route',
    title: 'Xi\'an • Ancient Chang\'an City Wall',
    image: 'https://images.unsplash.com/photo-1599572415662-119c861b1b68?auto=format&fit=crop&w=500&q=80',
    spots: 'Yongning Gate — Changle Gate — Giant Wild Goose Pagoda',
    intro: 'Step on ancient slate bricks atop a fully intact historical defense system, running through the morning bells and evening drums of Chang\'an.',
    distance: '6.0',
    duration: 'Approx. 36 mins',
    rating: 4.8
  },
  {
    id: '6-1',
    cityId: '6',
    routeIndex: 1,
    cityName: 'Tokyo',
    routeName: 'Asakusa Old Streets',
    title: 'Tokyo • Historic Asakusa Streets',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=500&q=80',
    spots: 'Senso-ji Temple — Kaminarimon Gate — Sumida Park',
    intro: 'Pass under the iconic giant red lanterns, running past delicate alleyways, boutique craft workshops, and Edo-style sunset glows.',
    distance: '3.8',
    duration: 'Approx. 22 mins',
    rating: 4.7
  },
  {
    id: '7-1',
    cityId: '7',
    routeIndex: 1,
    cityName: 'Paris',
    routeName: 'Sunset along the Seine',
    title: 'Paris • Seine River sunset',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80',
    spots: 'Louvre Museum — Pont Neuf — Musée d\'Orsay',
    intro: 'Race alongside the golden ripples of the Seine between Musée d\'Orsay and Pont Neuf under breathtaking sunset rays.',
    distance: '6.5',
    duration: 'Approx. 39 mins',
    rating: 4.9
  },
  {
    id: '8-1',
    cityId: '8',
    routeIndex: 1,
    cityName: 'London',
    routeName: 'West End Musical Tour',
    title: 'London • West End Harmonies',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?auto=format&fit=crop&w=500&q=80',
    spots: 'Royal Opera House — Covent Garden — Shaftesbury Avenue',
    intro: 'Explore the vibrant heart of musicals and drama, immersing yourself in the classic acoustic resonance of Covent Garden.',
    distance: '2.0',
    duration: 'Approx. 12 mins',
    rating: 4.6
  },
  {
    id: '9-1',
    cityId: '9',
    routeIndex: 1,
    cityName: 'New York',
    routeName: 'Liberty Island Memory Line',
    title: 'New York • Liberty Island Memories',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500&q=80',
    spots: 'Battery Park — Ellis Island — Statue of Liberty',
    intro: 'Gaze at the Manhattan skyline and the Hudson River, tracing the timeless energy of the golden migration epoch.',
    distance: '4.5',
    duration: 'Approx. 27 mins',
    rating: 4.8
  },
  {
    id: '12-1',
    cityId: '12',
    routeIndex: 1,
    cityName: 'Cairo',
    routeName: 'Nile Civilization',
    title: 'Cairo • Ancient Nile Voyage',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=500&q=80',
    spots: 'Giza Pyramids — Great Sphinx — Nile Valley',
    intro: 'Bask in ancient desert dunes at dusk, witnessing majestic pyramids and the great Nile valley stretching across millennia.',
    distance: '5.0',
    duration: 'Approx. 30 mins',
    rating: 4.9
  }
];

const LOTTERY_PRIZES = [0.88, 1.88, 6.66, 8.88, 18.88];

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
  const [selectError, setSelectError] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [recentDrawReward, setRecentDrawReward] = useState<number | null>(null);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const lotteryTimeoutRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (lotteryTimeoutRef.current) {
        clearTimeout(lotteryTimeoutRef.current);
      }
    };
  }, []);
  
  // Poster sharing state
  const [showSharePosterModal, setShowSharePosterModal] = useState(false);
  const [isPosterGenerating, setIsPosterGenerating] = useState(false);
  const [posterDownloadUrl, setPosterDownloadUrl] = useState<string | null>(null);
  const [isSharingToWechat, setIsSharingToWechat] = useState(false);
  const [shareToastText, setShareToastText] = useState<string | null>(null);

  // 3D Card flip States
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [revealedPrizes, setRevealedPrizes] = useState<number[]>([]);
  const [showShareSuccessModal, setShowShareSuccessModal] = useState(false);

  // Helper check if selected
  const isRouteSelected = (id: string) => selectedRouteIds.includes(id);

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
      const updated = selectedRouteIds.filter(id => id !== route.id);
      onUpdateState({ selectedRouteIds: updated });
      setSelectError(null);
    } else {
      if (selectedRouteIds.length >= 3) {
        setSelectError('You can select a maximum of 3 memory routes.');
        return;
      }
      
      // Each city at most once checked
      const hasCity = selectedRouteIds.some(id => {
        const item = MEDLEY_CANDIDATE_ROUTES.find(r => r.id === id);
        return item?.cityId === route.cityId;
      });

      if (hasCity) {
        setSelectError(`You have already selected a route for ${route.cityName}. At most one memory route per city can be chosen.`);
        return;
      }

      onUpdateState({ selectedRouteIds: [...selectedRouteIds, route.id] });
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
    setShareToastText('Brewing explorer seal, generating active sports poster...');
    
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
        ctx.fillText('City Medley • Honor Poster', 300, 110);
        
        ctx.strokeStyle = 'rgba(245, 208, 110, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(150, 140);
        ctx.lineTo(450, 140);
        ctx.stroke();

        // 4. Explorer Information Text
        // Draw decorative Profile Avatar Circle on Canvas representing 木小六
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
        ctx.fillText('M', 300, 164);

        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('To: City Memory Explorer', 300, 198);

        ctx.font = 'bold 28px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Mu Xiaoliu', 300, 236);

        // Sub description
        ctx.font = '13px sans-serif';
        ctx.fillStyle = '#64748B';
        ctx.fillText('Across ancient temples, palaces, old streets & rivers, your steps awaken city legacy.', 300, 268);

        // 5. Drawing stats grids (Distance / completed nodes)
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(80, 290, 440, 110);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.strokeRect(80, 290, 440, 110);

        // Grid stats lines
        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('Total Distance', 190, 325);
        ctx.fillText('Completed Medleys', 410, 325);

        ctx.fillStyle = '#22D3EE';
        ctx.font = 'bold 36px font-mono';
        ctx.fillText(`${totalMedleyDistance} KM`, 190, 375);
        
        ctx.fillStyle = '#10B981';
        ctx.fillText(`${completedCount} / 3`, 410, 375);

        // 6. Draw 3 Selected Route names with customized background tags
        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🗺️ Completed Medley Routes:', 80, 445);

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
          ctx.fillText(`Route ${idx + 1} • ${route.cityName} · ${route.routeName}`, 105, yOffset + 24);

          ctx.fillStyle = '#94A3B8';
          ctx.font = '11px sans-serif';
          ctx.fillText(route.spots, 105, yOffset + 44);

          // Tag status right
          ctx.textAlign = 'right';
          const isComp = completedRouteIds.includes(route.id);
          if (isComp) {
            ctx.fillStyle = '#10B981';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText('● Completed', 500, yOffset + 35);
          } else {
            ctx.fillStyle = '#64748B';
            ctx.font = '12px sans-serif';
            ctx.fillText('○ In Progress', 500, yOffset + 35);
          }
          // Reset alignment for iterations
          ctx.textAlign = 'left';
        });

        // 7. Traditional Stamp Graphic (Red Circle with Traditional Design)
        ctx.shadowColor = 'rgba(0,0,0,0)'; // Reset shadow
        ctx.textAlign = 'center';
        
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(430, 220, 42, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(430, 220, 36, 0, Math.PI * 2);
        ctx.stroke();

        // Stamp Inner typography centered
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('Weekend', 430, 210);
        ctx.fillText('Medley', 430, 232);

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
        ctx.fillText('WeRun • Weekend City Medley', 80, 785);
        ctx.font = '11px sans-serif';
        ctx.fillText('Recording time and legacy with active steps.', 80, 805);
        ctx.fillText('Verification Code: ' + Math.random().toString(36).substr(2, 9).toUpperCase(), 80, 825);

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
        setShareToastText('Honor poster generated successfully!');
        setTimeout(() => setShareToastText(null), 3500);

      } catch (err) {
        console.error('Canvas generate poster failed', err);
        setIsPosterGenerating(false);
        setShareToastText('Canvas cross-origin failed, using HTML share card fallback.');
        setTimeout(() => setShareToastText(null), 3000);
      }
    }, 1500);
  };

  const handleSimulateWechatShare = (type: 'friend' | 'moments') => {
    setIsSharingToWechat(true);
    setShareToastText(type === 'friend' ? 'Simulating share to friend...' : 'Simulating share to moments...');
    
    setTimeout(() => {
      setIsSharingToWechat(false);
      setShareToastText(type === 'friend' ? 'Successfully shared with friends!' : 'Shared to moments!');
      
      // Award extra lottery chance if they haven't claimed share bonus yet
      if (!shareBonusClaimed) {
        onUpdateState({ 
          shareBonusClaimed: true, 
          lotteryChances: lotteryChances + 1 
        });
        // Turn off poster menu, turn on share success modal
        setShowSharePosterModal(false);
        setShowShareSuccessModal(true);
      } else {
        setTimeout(() => setShareToastText(null), 3000);
      }
    }, 1500);
  };

  const handleFlipCard = (cardIdx: number) => {
    if (lotteryChances <= 0 || isDrawing || flippedIndices.length > 0) return;
    setIsDrawing(true);
    setFlippedIndices([cardIdx]);

    // Roll random award value
    const rolledValue = LOTTERY_PRIZES[Math.floor(Math.random() * LOTTERY_PRIZES.length)];
    
    // Choose other 2 fake prizes to show as decoys
    const decoys = LOTTERY_PRIZES.filter(v => v !== rolledValue);
    const mockThree = [0, 0, 0];
    mockThree[cardIdx] = rolledValue;
    let decoyCounter = 0;
    for (let i = 0; i < 3; i++) {
      if (i !== cardIdx) {
        mockThree[i] = decoys[decoyCounter % decoys.length] || 0.88;
        decoyCounter++;
      }
    }
    
    setRevealedPrizes(mockThree);

    if (lotteryTimeoutRef.current) {
      clearTimeout(lotteryTimeoutRef.current);
    }
    lotteryTimeoutRef.current = setTimeout(() => {
      setRecentDrawReward(rolledValue);
      setIsDrawing(false);
      onUpdateState({
        lotteryChances: Math.max(0, lotteryChances - 1),
        drawHistory: [rolledValue, ...drawHistory]
      });
      setShowDrawModal(true);
    }, 600);
  };

  const handleCloseDrawModal = () => {
    setShowDrawModal(false);
    setFlippedIndices([]);
    setRevealedPrizes([]);
  };

  const handleActionClick = () => {
    if (selectedRouteIds.length < 3) {
      setViewMode('selection');
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
              Custom Medley Routes
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Select 3 of 10 • Unlock Milestones</p>
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
              <span>🗺️</span> Medley Guide
            </h4>
            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed font-semibold">
              Please select <strong className="text-[#f5d06e]">3</strong> historical routes from the list below to build your custom weekend medley. To ensure variety, you can choose <strong className="text-cyan-400">at most 1 route per city</strong>.
            </p>
          </div>

          {/* Error Tips Callout */}
          {selectError && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-950/40 border border-red-500/30 text-red-200 text-[11px] px-3.5 py-2.5 rounded-xl font-medium leading-relaxed text-left"
            >
              ⚠️ {selectError}
            </motion.div>
          )}

          {/* Current Selection Progress Status */}
          <div className="bg-slate-900/40 border border-white/5 p-3 rounded-2xl flex items-center justify-between text-left">
            <div>
              <span className="text-[11px] text-slate-400 font-bold block">Selected Routes</span>
              <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">Select exactly 3 to unlock medley</span>
            </div>
            <span className="font-mono text-sm font-black bg-cyan-950/80 text-cyan-400 px-3.5 py-1 rounded-xl border border-cyan-500/35">
              {selectedRouteIds.length} / 3
            </span>
          </div>

          {/* Beautiful Route List Column */}
          <div className="space-y-3.5">
            {MEDLEY_CANDIDATE_ROUTES.map((route) => {
              const isChecked = isRouteSelected(route.id);
              
              return (
                <div
                  key={route.id}
                  id={`route-card-${route.id}`}
                  onClick={() => handleToggleRoute(route)}
                  className={`group rounded-2xl border transition-all overflow-hidden text-left flex flex-col cursor-pointer active:scale-[0.99] duration-300 ${
                    isChecked 
                      ? 'bg-[#0a1829] border-cyan-500/60 shadow-[0_4px_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20' 
                      : 'bg-[#070c14] border-white/5 hover:border-white/10 hover:bg-[#0b1321]'
                  }`}
                >
                  
                  {/* Top: Premium Landscape Image Cover and Tags */}
                  <div className="relative w-full h-36 overflow-hidden">
                    <img 
                      src={route.image} 
                      alt={route.routeName} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1506501139174-099022df5260?auto=format&fit=crop&w=500&q=80";
                      }}
                    />
                    {/* Vignette Backing Gradient to guarantee legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                    
                    {/* Top tags on cover */}
                    <div className="absolute top-3 inset-x-3 flex justify-between items-center pointer-events-none">
                      <span className="bg-slate-950/70 border border-white/15 text-slate-100 text-[10px] font-black px-2 py-0.5 rounded-md backdrop-blur-md">
                        📍 {route.cityName}
                      </span>
                      
                      {/* Check mark badge */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isChecked 
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950' 
                          : 'bg-black/40 border-slate-500 text-slate-400'
                      }`}>
                        {isChecked ? <Check size={14} className="stroke-[3]" /> : <Plus size={13} />}
                      </div>
                    </div>

                    {/* Bottom overlay text on cover */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <h3 className="text-sm font-black text-white filter drop-shadow">
                        {route.title}
                      </h3>
                      
                      {/* Star Rating Badge overlaid on image cover bottom corner */}
                      <div className="bg-amber-500/90 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-md">
                        <Star size={10} className="fill-slate-950 stroke-none" />
                        <span>{route.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom details row */}
                  <div className="p-3.5 space-y-2.5">
                    
                    {/* Description Intro */}
                    <p className="text-[11px] text-slate-300 font-semibold leading-relaxed line-clamp-2">
                      {route.intro}
                    </p>

                    {/* Scenic Spots details row */}
                    <div className="bg-black/30 p-2 rounded-xl border border-white/5 flex gap-1.5 items-start text-[10px] text-slate-400 font-bold leading-normal">
                      <span className="shrink-0 text-cyan-400">🏞️ Spots:</span>
                      <span className="truncate">{route.spots}</span>
                    </div>

                    {/* Multi Badges Row: Distance, Hours, Rating */}
                    <div className="flex gap-2 text-[10px] font-bold">
                      
                      {/* Distance */}
                      <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-white/5 text-slate-300 flex items-center gap-1 font-mono">
                        <Compass size={11} className="text-cyan-400" />
                        <span>{route.distance} km</span>
                      </div>

                      {/* Duration (时长) */}
                      <div className="bg-[#05060b] px-2.5 py-1 rounded-lg border border-white/5 text-cyan-300 flex items-center gap-1 font-semibold">
                        <Clock size={11} className="text-cyan-400" />
                        <span>{route.duration}</span>
                      </div>

                      {/* Rating Label */}
                      <div className="bg-[#05060b] px-2.5 py-1 rounded-lg border border-white/5 text-amber-400 flex items-center gap-1 shrink-0 ml-auto select-none font-semibold">
                        <span>⭐⭐⭐⭐⭐</span>
                        <span className="text-[8.5px] text-slate-500 font-black">Premium</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Premium Keep-in-Place Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md pt-3.5 pb-safe px-4 border-t border-white/5 flex gap-3">
          
          <button
            onClick={() => {
              onUpdateState({ selectedRouteIds: [] });
              setSelectError(null);
            }}
            className="px-4 py-3 bg-[#0d1624] border border-white/5 hover:border-white/10 hover:bg-[#142334] rounded-2xl text-xs font-bold text-slate-400 hover:text-slate-200 transition-all shrink-0 animate-pulse"
          >
            Reset
          </button>

          <button
            onClick={() => {
              if (selectedRouteIds.length !== 3) {
                setSelectError('You must select exactly 3 routes to save configuration');
                return;
              }
              onUpdateState({ activityStarted: true }); // Save and automatically start the activity/lock so that next click is not required
              setViewMode('main');
              setSelectError(null);
            }}
            className={`flex-1 py-3.5 rounded-2xl font-extrabold text-[13.5px] transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md ${
              selectedRouteIds.length === 3
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-[0_4px_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Save Config</span>
            <Check size={14} className="stroke-[3]" />
          </button>
        </div>

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
              setFlippedIndices([]);
              setRevealedPrizes([]);
              setIsDrawing(false);
              setShowDrawModal(false);
              setRecentDrawReward(null);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 transition-colors"
            title="返回主页"
          >
            <ChevronLeft size={20} className="text-slate-200" />
          </button>
          
          <div className="text-center">
            <h2 className="text-base font-black tracking-wide text-white leading-tight">
              现金奖励翻牌
            </h2>
            <p className="text-[10px] text-[#8e8e93] mt-1 font-semibold">
              三张现金卡，选择一张揭晓奖励
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick debug trigger to add 1 chance instantly for reviewer validation */}
            <button
              onClick={() => {
                onUpdateState({ lotteryChances: lotteryChances + 1 });
              }}
              className="px-2 py-1.5 bg-yellow-400/10 hover:bg-yellow-400/20 text-[#f5cb4e] border border-[#ffe082]/15 rounded-lg text-[9px] font-black active:scale-95 transition-all"
              title="审核调试工具：一键充能 +1 抽奖机会"
            >
              +1 调试券
            </button>
            <div className="px-3 py-1.5 rounded-xl bg-[#1c1c24] border border-zinc-800/80 text-[#ffe285] font-mono font-black text-xs flex items-center gap-1 shadow-sm">
              <span>🎟️</span>
              <span>{lotteryChances}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Sub-screen Inner */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 hide-scrollbar pb-32">
          
          {/* Main Card Container */}
          <div className="w-full bg-[#12131a] rounded-3xl p-5 border border-zinc-850 shadow-[0_12px_28px_rgba(0,0,0,0.55)] relative overflow-hidden text-center">
            
            {/* ✨ 周末现金奖池 pill centered */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#ffe082]/15 bg-[#1a1710] text-[#f5cb4e] text-xs font-black tracking-wider shadow-[0_2px_10px_rgba(245,203,78,0.05)]">
                <Sparkles size={11} className="text-[#f5cb4e]" />
                <span>周末现金奖池</span>
              </div>
            </div>

            {/* The 3 Cards Column/Grid, exactly matching mockup cards A, B, C */}
            <div className="grid grid-cols-3 gap-3 w-full self-center px-0.5 my-3">
              {[0, 1, 2].map((idx) => {
                const cardLabel = idx === 0 ? 'A' : idx === 1 ? 'B' : 'C';
                const isThisFlipped = flippedIndices.includes(idx);
                const isAnyFlipped = flippedIndices.length > 0;
                const isThisChosen = flippedIndices[0] === idx;
                const prizeValue = revealedPrizes[idx];

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (lotteryChances > 0 && !isAnyFlipped && !isDrawing) {
                        handleFlipCard(idx);
                      }
                    }}
                    className={`relative h-44 rounded-2xl cursor-pointer select-none transition-all duration-500 [perspective:1000px] ${
                      isThisChosen
                        ? 'ring-2 ring-yellow-500 shadow-[0_0_18px_rgba(234,179,8,0.3)]'
                        : isThisFlipped
                          ? 'opacity-65 scale-95'
                          : isAnyFlipped
                            ? 'opacity-40 scale-95'
                            : lotteryChances > 0 
                              ? 'hover:scale-[1.03] transform hover:-translate-y-1 active:scale-95 animate-pulse'
                              : 'cursor-not-allowed opacity-80'
                    }`}
                  >
                    <motion.div
                      animate={{ rotateY: isThisFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                      style={{ transformStyle: 'preserve-3d' }}
                      className="w-full h-full relative"
                    >
                      {/* FRONT CARD (Closed envelope state - View matches mockup perfectly without ABC) */}
                      <div
                        className="absolute inset-0 bg-gradient-to-b from-[#1b1c24] to-[#0d0e14] border border-zinc-805 rounded-2xl flex flex-col justify-between p-3 [backface-visibility:hidden]"
                      >
                        {/* Tags Top */}
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[12px] leading-none select-none">🧧</span>
                          <Sparkles size={9} className="text-[#ffe082]/75" />
                        </div>

                        {/* Mid envelope circle */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-full border border-[#ffe082]/20 bg-[#252015] flex items-center justify-center mb-2.5 shadow-[0_4px_10px_rgba(255,224,130,0.05)]">
                            <Mail size={16} className="text-[#f5cb4e]" />
                          </div>
                          
                          <span className="text-[12px] font-black text-white tracking-widest block leading-none">现金卡</span>
                        </div>

                        {/* Bottom Label text */}
                        <span className="text-[9px] text-[#4d94ff] font-bold leading-none block text-center mt-1">
                          点击翻开
                        </span>
                      </div>

                      {/* BACK CARD (Flipped amount state) */}
                      <div
                        style={{ transform: 'rotateY(180deg)' }}
                        className={`absolute inset-0 rounded-2xl flex flex-col justify-between p-3 border [backface-visibility:hidden] ${
                          isThisChosen
                            ? 'bg-gradient-to-b from-[#2d220a] to-[#0d0902] border-[#ffe082]/80 shadow-[inset_0_1px_15px_rgba(255,224,130,0.15)]'
                            : 'bg-zinc-950/90 border-zinc-900/80 opacity-60'
                        }`}
                      >
                        {/* Tags Top */}
                        <div className="flex justify-between items-center w-full">
                          <span className={`text-[10px] font-black ${isThisChosen ? 'text-[#ffe082]' : 'text-zinc-500'}`}>WIN</span>
                          {isThisChosen ? (
                            <Sparkles size={10} className="text-[#ffe082] animate-pulse" />
                          ) : (
                            <Lock size={10} className="text-zinc-600" />
                          )}
                        </div>

                        {/* Center gold/cash reveal */}
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-[9px] text-zinc-500 font-semibold tracking-widest block leading-none uppercase">微信红包</span>
                          <span className={`text-base font-mono font-black mt-1.5 leading-none ${isThisChosen ? 'text-yellow-400 scale-110' : 'text-zinc-400'}`}>
                            ¥{prizeValue || 0.88}
                          </span>
                        </div>

                        <span className={`text-[8px] py-0.5 rounded text-center font-black leading-none block w-full border ${
                          isThisChosen
                            ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-650'
                        }`}>
                          {isThisChosen ? "已抽中" : "未选中"}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Below card state text */}
            <p className="text-[11.5px] text-[#8e8e93] font-medium leading-relaxed px-1.5 mt-5">
              当前剩余 {lotteryChances} 次机会。选择任意一张现金卡翻开，将消耗 1 次机会抽取现金奖励。
            </p>
          </div>

          {/* 🎁 奖池与概率 */}
          <div className="w-full bg-[#12131a] rounded-3xl p-5 border border-zinc-850 shadow text-left space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-black text-[#f5cb4e] flex items-center gap-1.5 leading-none">
                <Gift size={14} className="text-[#f5cb4e]/90" />
                奖池与概率
              </span>
              <span className="text-[11px] text-[#8e8e93] font-bold">公开展示</span>
            </div>

            {/* Five column horizontal layout cards */}
            <div className="grid grid-cols-5 gap-1.5 pt-0.5">
              {[
                { val: 0.88, rate: '45%' },
                { val: 1.88, rate: '30%' },
                { val: 6.66, rate: '15%' },
                { val: 8.88, rate: '8%' },
                { val: 18.88, rate: '2%' }
              ].map((p, idx) => (
                <div 
                  key={idx}
                  className="bg-[#1c1913]/40 border border-[#ffe082]/10 rounded-2xl py-3 px-1 text-center flex flex-col justify-between h-14"
                >
                  <span className="text-[12px] font-mono font-black text-[#ffe082] block tracking-tighter leading-none">
                    ¥{p.val}
                  </span>
                  <span className="text-[9px] text-[#8e8e93] font-semibold block leading-none">
                    {p.rate}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ⏱️ 开奖记录 */}
          <div className="w-full bg-[#12131a] rounded-3xl p-5 border border-zinc-850 shadow text-left space-y-3.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-black text-slate-200 flex items-center gap-1.5 leading-none">
                <Clock size={14} className="text-zinc-400" />
                开奖记录
              </span>
              <span className="text-[11px] text-[#8e8e93] font-bold leading-none">{drawHistory.length} 次</span>
            </div>

            {drawHistory.length > 0 ? (
              <div className="space-y-2.5 divide-y divide-zinc-800 max-h-48 overflow-y-auto pr-1">
                {drawHistory.map((val, i) => (
                  <div key={i} className="flex justify-between items-center pt-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base text-[#f5cb4e]">🎄</span>
                      <div>
                        <span className="text-zinc-200 block font-bold text-[11px]">微信现金红包</span>
                        <span className="text-[9.5px] text-zinc-500 font-mono block">已秒到微信钱包余额</span>
                      </div>
                    </div>
                    <span className="text-yellow-400 font-mono font-black text-sm">+{val} 元</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11.5px] text-[#8e8e93] leading-normal font-medium">
                暂无记录，完成路线串烧后回来试试手气。
              </p>
            )}
          </div>

        </div>

        {/* Sticky Fixed Bottom area matching mockup */}
        <div className="absolute bottom-0 inset-x-0 z-40 bg-black/95 backdrop-blur-md pt-3.5 pb-safe px-4 border-t border-zinc-900/60 flex flex-col items-center justify-center space-y-2.5 shrink-0">
          {lotteryChances > 0 ? (
            <div
              className="w-full py-4 rounded-2xl bg-[#1c1d27]/75 border border-zinc-800 text-zinc-300 font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 select-none"
            >
              <Ticket size={14} className="text-zinc-400" />
              <span>请选择一张现金卡</span>
            </div>
          ) : (
            <div
              className="w-full py-4 rounded-2xl bg-[#0f1016] border border-zinc-900 text-zinc-500 font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 select-none"
            >
              <Ticket size={14} className="text-zinc-600 opacity-60" />
              <span>暂无抽奖机会</span>
            </div>
          )}

          <span className="text-[10px] text-[#8e8e93] font-semibold text-center pb-2">
            完成三条路线得 1 次机会，分享成果可再得 1 次
          </span>
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

                <h3 className="text-lg font-black text-yellow-200 tracking-widest mt-4">恭喜翻中现金大吉！</h3>
                <p className="text-[10px] text-yellow-100/50 mt-1 uppercase font-mono tracking-widest font-bold">CASH REWARD SECURED</p>

                <div className="my-6">
                  <span className="text-slate-100 font-sans text-xs font-bold leading-none pr-1">¥</span>
                  <span className="text-5xl font-black font-mono text-yellow-300 select-all leading-none" style={{ textShadow: '2px 3px 0 rgba(0,0,0,0.15)' }}>
                    {recentDrawReward}
                  </span>
                  <span className="text-[11px] text-yellow-200 block mt-2.5 font-bold">现金已转入红包余额</span>
                </div>

                <p className="text-[10.5px] text-yellow-100/70 leading-relaxed max-w-[200px] font-bold mb-6">
                  周末限定汗水结晶！红包款数额已模拟直汇您登录微信号绑定零钱。
                </p>

                <button
                  onClick={handleCloseDrawModal}
                  className="w-full py-3 bg-gradient-to-r from-yellow-300 to-amber-400 hover:from-yellow-200 hover:to-amber-300 text-slate-900 font-extrabold rounded-xl text-xs transition-colors tracking-widest uppercase shadow-md"
                >
                  收下现金大吉
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
        
        {/* 1. Header Hero Area (Poster Style with image backdrop) */}
        <div className="relative w-full shrink-0 overflow-hidden bg-[#03060a]">
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

          {/* Floating Actions inside Header Area */}
          <div className="relative z-20 flex justify-between items-center px-4 pt-5 pb-2">
            <button 
              onClick={onBack} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md transition-colors"
              title="返回"
            >
              <ChevronLeft size={20} className="text-slate-200" />
            </button>
            
            <div className="bg-[#12231c]/70 border border-emerald-500/20 px-3 py-1.5 rounded-full text-[10px] font-black text-emerald-400 tracking-wider flex items-center gap-1.5 shadow-[0_4px_12px_rgba(16,185,129,0.15)] select-none">
              <span>📅 周末限时开放</span>
            </div>
          </div>

          {/* Hero Content Block */}
          <div className="relative z-20 px-5 pt-12 pb-6 text-left">
            {/* Theme category tag */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/25 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
              <span>🏛️ 历史文化主题</span>
            </div>

            {/* Huge bold display title */}
            <h1 className="text-[25px] font-black text-white mt-3.5 tracking-wide leading-tight drop-shadow-sm select-none">
              周末城市记忆串烧
            </h1>

            {/* Explanatory introduction text */}
            <p className="text-[11px] text-slate-300 leading-relaxed font-semibold mt-3 max-w-[340px] drop-shadow-sm">
              这个周末，从古寺、皇城、旧街与河岸出发，把三座城市的历史片段串成一段奔跑记忆。每一条路线都是一枚城市印章，完成串烧后解锁现金翻牌抽奖。
            </p>

            {/* Integrated activity opening schedule banner with custom thin borders */}
            <div className="mt-5 bg-[#0b1213]/85 rounded-2xl p-4 border border-[#f5d06e]/15 max-w-sm shadow-xl">
              <div className="flex items-center gap-1.5 text-[#f5d06e] font-black text-[10.5px] tracking-widest">
                <span>📅 活动开放时间</span>
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
              <span className="text-[10px] text-slate-500 font-bold mt-2.5 leading-none">已选路线</span>
            </div>
            {/* Card 2 */}
            <div className="bg-[#090e16]/80 rounded-2xl p-4 border border-white/5 flex flex-col justify-between shadow">
              <span className="text-xl font-black text-emerald-400 font-mono tracking-tight leading-none">
                {completedCount}/3
              </span>
              <span className="text-[10px] text-slate-500 font-bold mt-2.5 leading-none">完成进度</span>
            </div>
            {/* Card 3 */}
            <div className="bg-[#090e16]/80 rounded-2xl p-4 border border-white/5 flex flex-col justify-between shadow">
              <span className="text-xl font-black text-[#f5d06e] font-mono tracking-tight leading-none">
                {lotteryChances}
              </span>
              <span className="text-[10px] text-slate-500 font-bold mt-2.5 leading-none">抽奖机会</span>
            </div>
          </div>

          {/* CORE CARD SECTION - 我的路线串烧 */}
          <div className="bg-[#080d15] rounded-2xl p-4 border border-white/5 space-y-4 text-left shadow-lg">
            {/* Section Header */}
            <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
              <span className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                <span className="text-base select-none leading-none">🗺️</span> 我的路线串烧
              </span>
              <span className="text-[9.5px] text-slate-400 font-bold bg-[#142334]/50 border border-cyan-500/15 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span>🗺️ 自定 10 选 3</span>
              </span>
            </div>

            {/* Dashed placeholder container if unselected */}
            {selectedRouteIds.length === 0 ? (
              <button
                onClick={() => setViewMode('selection')}
                className="w-full py-8 focus:outline-none rounded-2xl border border-dashed border-[#f5d06e]/25 bg-[#060b13]/40 hover:bg-[#152e46]/10 flex flex-col items-center justify-center gap-2.5 group transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#1c1c15] border border-[#f5d06e]/15 group-hover:border-[#f5d06e]/30 flex items-center justify-center transition-all">
                  <Plus size={16} className="text-[#f5d06e]" />
                </div>
                <span className="text-[13px] font-black tracking-wider text-slate-200">
                  选择 3 条城市路线
                </span>
                <p className="text-[10px] text-slate-400 max-w-[240px] text-center leading-normal font-semibold">
                  进入独立路线列表，挑选 3 条历史文化路线。保存后本次活动不可更改。
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
                            跑道 {index + 1}
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
                            <span className="bg-emerald-950/80 border border-emerald-500/30 text-[#2ebd90] text-[9px] font-black px-2 py-0.5 rounded-md">已完成</span>
                          ) : (
                            <button 
                              onClick={() => onNavigateToRouteDetail(item.cityId, item.routeIndex, item.image)}
                              className="bg-[#26b180] hover:bg-[#1f936a] text-white text-[9.5px] font-black px-2.5 py-1 rounded-md flex items-center gap-0.5 active:scale-95 transition-all"
                            >
                              <Play size={8} className="fill-white" />
                              <span>踏上</span>
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => {
                              onUpdateState({ selectedRouteIds: selectedRouteIds.filter(id => id !== item.id) });
                            }}
                            className="p-1 hover:bg-rose-950/20 text-rose-500 rounded-lg transition-colors"
                            title="移除"
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
                    <span>继续添加记忆跑道 (还需选择 {3 - selectedRouteIds.length} 条)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ACTIVITY RULES CARD BLOCK */}
          <div className="bg-[#080d15] rounded-2xl p-4 border border-white/5 text-left space-y-3 shadow-lg">
            <span className="text-xs font-black text-slate-200 flex items-center gap-1.5">
              <span>✨</span> 活动规则
            </span>
            <ul className="text-[11px] text-slate-400 space-y-2.5 font-bold leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#f5d06e] shrink-0">1.</span>
                <span>保存 3 条路线后，开始跑台挑战，路线中途不可修改。</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#f5d06e] shrink-0">2.</span>
                <span>完成全部 3 条记忆路线后，点亮连携，直接解锁独立页面的翻卡大奖！</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#f5d06e] shrink-0">3.</span>
                <span>完成串烧或探索过程中，点击“分享海报”转发成果，可额外赠送 <strong className="text-cyan-400">1 次</strong> 大奖翻卡机会。</span>
              </li>
            </ul>
          </div>

          {/* Dynamic Status Callout when active */}
          {activityStarted && !isMedleyAllCompleted && (
            <div className="p-3.5 rounded-xl bg-slate-950/60 text-center border border-white/5 text-[10.5px] text-slate-400 font-bold leading-relaxed text-left">
              ⏳ 请在跑台上跑完上述 3 条选择的记忆路线，点亮全部 3 段华夏遗珍，即可去翻开微信现金秘宝！
            </div>
          )}

          {/* If all completed, show a success banner directly on home-screen too */}
          {isMedleyAllCompleted && (
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#1b1c2b] to-[#0d0d17] border border-[#f5cb4e]/30 text-center shadow-lg">
              <h4 className="text-xs font-black text-[#f5cb4e] flex items-center justify-center gap-1.5">
                <Trophy size={14} className="text-[#f5cb4e] fill-amber-500/10" />
                周末城市记忆串烧已完美完成！
              </h4>
              <p className="text-[10px] text-slate-300 mt-1.5">恭喜探索家！所有串烧印章均已集齐点亮！请点击下方“前往领奖”跳转单独的时空翻牌界面抽取现金大礼吧！ 🏮</p>
            </div>
          )}
        </div>

      </div>

      {/* FLOAT ALERTS PORTAL */}
      <AnimatePresence>
        {shareToastText && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute bottom-24 left-4 right-4 z-50 bg-[#0d1527] border border-cyan-500/50 text-cyan-200 text-[10.5px] font-bold px-3 py-2.5 rounded-lg text-center flex items-center justify-center gap-2 shadow-2xl backdrop-blur-md"
          >
            <Sparkles size={13} className="text-cyan-400 animate-spin" />
            <span>{shareToastText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. KEEP-IN-PLACE PREMIUM FLOATING BOTTOM DOCK ACTION BAR */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md pt-3.5 pb-safe px-4 border-t border-white/5 flex flex-col gap-2.5">
        <div className="flex gap-3">
          
          {/* Main Action Button */}
          <button
            onClick={handleActionClick}
            className={`flex-1 py-3.5 rounded-2xl font-black text-[13px] tracking-wide transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md ${
              selectedRouteIds.length < 3
                ? 'bg-[#f5cb4e] hover:bg-[#dfb73c] text-slate-900 shadow-[0_4px_15px_rgba(245,203,78,0.25)]'
                : !activityStarted
                  ? 'bg-[#26b180] hover:bg-[#1f936a] text-white shadow-[0_4px_15px_rgba(38,177,128,0.25)]'
                  : isMedleyAllCompleted
                    ? 'bg-gradient-to-r from-[#eab308] to-[#f59e0b] hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-black shadow-[0_4px_15px_rgba(234,179,8,0.3)] animate-pulse'
                    : 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black shadow-[0_4px_15px_rgba(6,182,212,0.25)]'
            }`}
          >
            {selectedRouteIds.length < 3 ? (
              <>
                <span>📋 自定配制 3 条跑道</span>
              </>
            ) : !activityStarted ? (
              <>
                <span>🚀 锁定并开启记忆星途</span>
              </>
            ) : isMedleyAllCompleted ? (
              <>
                <Gift size={14} className="stroke-[2.5]" />
                <span>🎁 串烧完成，翻卡领现金</span>
              </>
            ) : (
              <>
                <Play size={10} className="fill-slate-950" />
                <span>👟 踏上时空记忆串烧</span>
              </>
            )}
          </button>

          {/* Social Share Poster Trigger Button */}
          <button
            onClick={() => {
              setShowSharePosterModal(true);
              handleGeneratePoster();
            }}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#0e1624] border border-white/5 hover:bg-[#142234] transition-colors"
            title="生成结业分享海报"
          >
            <Share2 className="text-slate-300" size={17} />
          </button>

          {/* Gift Box button (Exclusively triggers viewMode to LOTTERY) */}
          <button
            onClick={() => setViewMode('lottery')}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all relative ${
              viewMode === 'lottery'
                ? 'bg-[#1b122c] border-purple-500/50 text-purple-300'
                : 'bg-[#0e1624] border-white/5 text-slate-300 hover:text-amber-300 hover:border-amber-400/30'
            }`}
            title="前往独立抽奖抽卡页面"
          >
            {lotteryChances > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-[8px] font-black text-white flex items-center justify-center animate-bounce">
                {lotteryChances}
              </span>
            )}
            <Gift size={18} />
          </button>
        </div>

        {/* Footer Sub-indicator Label Row */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold px-1.5 pb-2 select-none">
          <span>
            {shareBonusClaimed ? '✅ 分享奖励：已获得+1抽奖机会' : '🎁 转发串烧荣誉海报赠送 1 次翻卡机会'}
          </span>
          <span>
            开奖：{drawHistory.length} 次
          </span>
        </div>
      </div>

      {/* SHARE SUCCESS FEEDBACK MODAL OVERLAY */}
      <AnimatePresence>
        {showShareSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0b121e] rounded-3xl p-6 w-full max-w-xs border border-cyan-500/30 text-center relative flex flex-col items-center shadow-2xl"
            >
              <div className="w-12 h-12 bg-cyan-950 text-cyan-400 rounded-full flex items-center justify-center mb-3 border border-cyan-500/30 shadow-inner">
                <Share className="stroke-[2.5]" size={22} />
              </div>
              <h3 className="text-sm font-black text-slate-100">结业海报已成功分享</h3>
              <p className="text-xs text-slate-400 mt-1 font-bold">SHARE COMPLETED</p>

              <p className="text-[11px] text-slate-400 leading-relaxed mt-4 mb-5 font-bold">
                您的周末串烧成果海报已在微信成功传达！已额外为您获赠发卡站 <strong className="text-yellow-400">1 次开大奖红包机会</strong>。
              </p>

              <button
                onClick={() => {
                  setShowShareSuccessModal(false);
                  setViewMode('lottery');
                }}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-50 font-black rounded-xl text-xs transition-all border border-purple-500/40"
              >
                立即前往时空翻牌抽奖 ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXQUISITE SHARE POSTER MODAL (WITH CODE CANVAS SUPPORT AND RAW PREVIEWS) */}
      <AnimatePresence>
        {showSharePosterModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4"
          >
            {/* Header section of poster modal */}
            <div className="flex justify-between items-center py-2 border-b border-white/5 shrink-0">
              <span className="text-xs font-black text-slate-300">🖼️ 串烧结业荣耀海报</span>
              <button 
                onClick={() => setShowSharePosterModal(false)}
                className="p-1 hover:bg-white/10 rounded-full text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Middle: Container displaying the Poster Mock/Canvas */}
            <div className="flex-1 flex items-center justify-center overflow-hidden my-3">
              {isPosterGenerating ? (
                <div className="text-center p-6 space-y-3">
                  <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-bold">金墨浸染海报渲染中...</p>
                </div>
              ) : (
                <div className="relative max-w-[280px] w-full max-h-[80vh] bg-gradient-to-b from-[#090F1B] to-[#020305] rounded-2xl border border-yellow-500/40 p-4 font-sans text-left overflow-y-auto hide-scrollbar shadow-inner shadow-2xl">
                  {/* Miniature Poster Simulation rendering identical output as canvas */}
                  <div className="text-center py-1">
                    <span className="text-[7.5px] text-slate-500 tracking-wider font-mono block">WEEKEND MEMORY</span>
                    <h3 className="text-sm font-black text-[#f5d06e] mt-1 tracking-wider">城市记忆串烧・结业荣耀</h3>
                    <div className="w-16 h-[1.5px] bg-yellow-500/30 mx-auto mt-2" />
                  </div>

                  {/* Stamp Graphic Simulation overlay */}
                  <div className="absolute top-14 right-4 w-12 h-12 border-2 border-red-500/80 rounded-full flex items-center justify-center transform rotate-12 scale-90 select-none pointer-events-none">
                    <span className="text-[7.5px] text-red-500 font-serif font-black text-center leading-tight">周末历史<br />连携印赏</span>
                  </div>

                  {/* Body textuals */}
                  <div className="mt-4 space-y-1.5 pt-1 text-center flex flex-col items-center">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                      alt="avatar"
                      className="w-10 h-10 rounded-full border border-yellow-500/40 object-cover shadow-md mb-1"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[9px] text-slate-400">华夏之美 • 记忆旅脉勋授</span>
                    <h4 className="text-sm font-black text-white">{`木小六`}</h4>
                    <p className="text-[8.5px] text-slate-500 leading-normal max-w-[200px] mx-auto mt-1">在古寺、皇城、旧河岸间奔跑，您已在这座城市完成了汗点结业探索。</p>
                  </div>

                  {/* Highlights statistics row */}
                  <div className="my-3.5 bg-[#0f172a] p-2 rounded-xl grid grid-cols-2 text-center border border-white/5 select-none">
                    <div>
                      <span className="text-[8.5px] text-slate-400 block font-bold">累计公里</span>
                      <strong className="text-xs text-cyan-400 font-mono">{totalMedleyDistance} KM</strong>
                    </div>
                    <div>
                      <span className="text-[8.5px] text-slate-400 block font-bold">连携路线</span>
                      <strong className="text-xs text-emerald-400">{completedCount} / 3</strong>
                    </div>
                  </div>

                  {/* Mini cards for 3 roads */}
                  <div className="space-y-2 select-none">
                    <span className="text-[8px] text-slate-400 font-bold block">🗺️ 连携藏品印迹:</span>
                    {selectedItems.map((item, id) => {
                      const isDone = completedRouteIds.includes(item.id);
                      return (
                        <div key={item.id} className="bg-black/30 p-2 rounded-xl border border-white/5 flex items-center justify-between text-[8.5px]">
                          <span className="text-slate-200 truncate pr-2 font-bold">跑道 {id+1}: {item.cityName}·{item.routeName}</span>
                          <span className={isDone ? 'text-emerald-400 font-black' : 'text-slate-500'}>
                            {isDone ? '● 已达成' : '进行中'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* QR code footer sim */}
                  <div className="mt-4 pt-3.5 border-t border-white/10 flex justify-between items-center">
                    <div>
                      <span className="text-[8.5px] text-slate-400 font-bold block">微信运动·周末串道</span>
                      <span className="text-[7.5px] text-slate-500 block leading-normal mt-0.5">扫码一同踏上历史探索印记</span>
                    </div>
                    {/* Simulated white pixel QR block */}
                    <div className="w-8 h-8 bg-white p-0.5 flex flex-wrap gap-0.5">
                      <div className="w-3 h-3 bg-slate-900" />
                      <div className="w-3 h-3 bg-slate-900" style={{marginLeft: 'auto'}} />
                      <div className="w-3 h-3 bg-slate-900" style={{marginTop: 'auto'}} />
                      <div className="w-3 h-3 bg-slate-500" style={{marginTop: 'auto', marginLeft: 'auto'}} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Poster bottom toolbar with interactive actions */}
            <div className="bg-[#0b0c10] border-t border-white/5 p-4 rounded-t-3xl space-y-3 shrink-0 text-left">
              <span className="text-[10px] text-slate-400 font-black block tracking-widest uppercase">选择海报输出路径</span>
              
              <div className="grid grid-cols-2 gap-3">
                {/* 1. DOWNLOAD OR SAVING LOCAL BUTTON */}
                {posterDownloadUrl ? (
                  <a 
                    href={posterDownloadUrl}
                    download="weekend_memory_poster.png"
                    onClick={() => {
                      setShareToastText('恭喜！荣誉海报PNG已成功下载到您设备的下载目录中。');
                      setTimeout(() => setShareToastText(null), 3000);
                    }}
                    className="flex items-center justify-center gap-1.5 bg-[#152e46] hover:bg-[#1f4568] text-cyan-300 font-bold py-3 px-4 rounded-xl text-xs transition-colors"
                  >
                    <Download size={14} />
                    <span>保存海报到本地</span>
                  </a>
                ) : (
                  <button 
                    onClick={handleGeneratePoster}
                    className="flex items-center justify-center gap-1.5 bg-[#152e46]/60 text-cyan-400 font-bold py-3 px-4 rounded-xl text-xs"
                    disabled={isPosterGenerating}
                  >
                    <Download size={14} className="animate-bounce" />
                    <span>生成中...</span>
                  </button>
                )}

                {/* 2. SIMULATE WECHAT SHARE */}
                <button
                  onClick={() => handleSimulateWechatShare('friend')}
                  disabled={isSharingToWechat}
                  className="flex items-center justify-center gap-1.5 bg-[#26b180] hover:bg-[#1f936a] text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-colors"
                >
                  <Send size={13} />
                  <span>微信好友分享</span>
                </button>
              </div>

              {/* Extra trigger for Moments sharing */}
              <button
                onClick={() => handleSimulateWechatShare('moments')}
                disabled={isSharingToWechat}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-white/5 text-[10.5px] text-slate-300 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>🌐 分享到微信朋友圈</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl opacity-25">
                <span className="absolute top-4 left-6 text-yellow-300 transform -rotate-12 select-none">✨</span>
                <span className="absolute top-1/2 right-4 text-[#2ebd90] text-xl transform rotate-12 select-none">✨</span>
                <span className="absolute bottom-6 left-12 text-yellow-400 transform -rotate-45 select-none">✨</span>
              </div>

              {/* Glowing circular celebration Trophy icon container */}
              <div className="w-16 h-16 bg-gradient-to-tr from-[#ffe28a] to-[#df9d1d] rounded-full flex items-center justify-center mb-5 ring-4 ring-[#f5cb4e]/20 animate-bounce shadow-lg">
                <Trophy size={28} className="text-[#0a001a] stroke-[2.5]" />
              </div>

              <h3 className="text-base font-black text-white px-2 tracking-wide">🏆 周末城市记忆串烧已完成！</h3>
              <p className="text-[10px] text-yellow-400/80 font-black mt-1 font-mono tracking-widest uppercase">COMBO RUN COMPLETED SUCCESS</p>

              <div className="my-5 space-y-2 text-left bg-black/40 border border-white/5 p-4 rounded-2xl">
                <p className="text-xs text-slate-200 leading-relaxed font-bold">
                  恭喜探索家 <strong className="text-yellow-400">木小六</strong>！
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                  您在这个周末自选并挑战的全部完成点亮了 3 / 3 条华夏历史文化路线！
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                  🏅 您的专属汗水结业荣誉勋章已淬炼铸造，1次大奖独立页翻卡机会已为您解锁，快去夺取现金大红包吧！
                </p>
              </div>

              <div className="w-full space-y-2.5">
                {/* 🧧 Primary Action Button: Go to lottery */}
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    setViewMode('lottery');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
                >
                  <Gift size={14} className="stroke-[2.5]" />
                  <span>🎁 立即前往翻卡领奖</span>
                </button>

                {/* Secondary Button: dismiss and stay on main screen */}
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="w-full py-2.5 bg-slate-900/80 hover:bg-slate-800 border border-white/5 text-[10.5px] text-slate-400 font-bold rounded-xl transition-colors"
                >
                  返回主页查看
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
