import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Gift, Trophy, Check, ArrowLeft, Play, Coins, AlertCircle } from 'lucide-react';
import TimeSpaceWheelView from './TimeSpaceWheelView';

interface MedalDrawViewProps {
  onBack: () => void;
  onGoToRunning: () => void;
  isSubscribed: boolean;
  userStats: {
    completedCities: number;
    completedRoutes: number;
    totalDistance: number;
    totalTimeHours: number;
    lightValue: number;
  };
  setUserStats: React.Dispatch<React.SetStateAction<{
    completedCities: number;
    completedRoutes: number;
    totalDistance: number;
    totalTimeHours: number;
    lightValue: number;
  }>>;
}

export default function MedalDrawView({ onBack, onGoToRunning, isSubscribed, userStats, setUserStats }: MedalDrawViewProps) {
  // Simulator State so user can test both completed screen and drawing state!
  const [isPoolEmpty, setIsPoolEmpty] = useState(false); // Default false for running state
  const [showWheelView, setShowWheelView] = useState(false);
  const [availableChances, setAvailableChances] = useState(0);
  const [redeemedMedals, setRedeemedMedals] = useState(0);
  const [remainingPool, setRemainingPool] = useState(88.50); // Initialize with regular pool amount
  const [drawnPrizes, setDrawnPrizes] = useState<{ prizeName: string; amount: string; date: string }[]>([]);
  
  // Custom states for animations / modals
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showDrawAnimation, setShowDrawAnimation] = useState(false);
  const [drawnResult, setDrawnResult] = useState<{ tier: string; amount: string; icon: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRedeemChance = () => {
    // Treat completedRoutes as current medals earned (each route awards 3 medals)
    const totalMedals = userStats.completedRoutes * 3;
    const remainingMedals = totalMedals - redeemedMedals;

    if (remainingMedals <= 0) {
      showToast('❌ No medals available. Finish a route to earn medals first.');
      return;
    }

    setRedeemedMedals(prev => prev + 1);
    setAvailableChances(prev => prev + 1);
    showToast('🎉 1 route medal redeemed for 1 draw chance.');
  };



  const handleDraw = () => {
    if (availableChances <= 0) {
      showToast('💡 No draw chances yet. Redeem medals in Step 2 first.');
      return;
    }

    if (remainingPool <= 0) {
      showToast('⚠️ This prize pool is empty. Try again in the next issue.');
      return;
    }

    setAvailableChances(prev => prev - 1);
    setRemainingPool(prev => Math.max(0, prev - 0.88)); // subtract $0.88 or similar
    setShowDrawAnimation(true);

    // Mock draw probability corresponding to categories
    const r = Math.random();
    let result = { tier: 'Sixth Prize', amount: '$0.88', icon: '🧧' };
    
    if (r < 0.05) {
      result = { tier: 'First Prize', amount: '$38.80', icon: '🏆' };
    } else if (r < 0.15) {
      result = { tier: 'Second Prize', amount: '$18.80', icon: '🥈' };
    } else if (r < 0.30) {
      result = { tier: 'Third Prize', amount: '$8.88', icon: '🥉' };
    } else if (r < 0.50) {
      result = { tier: 'Fourth Prize', amount: '$3.88', icon: '🧧' };
    } else if (r < 0.75) {
      result = { tier: 'Fifth Prize', amount: '$1.88', icon: '🧧' };
    }

    setTimeout(() => {
      setDrawnResult(result);
      setDrawnPrizes(prev => [
        {
          prizeName: result.tier,
          amount: result.amount,
          date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        },
        ...prev
      ]);
      setShowDrawAnimation(false);
    }, 1800);
  };

  // Total medals calculation (each route awards 3 medals)
  const totalMedals = userStats.completedRoutes * 3;
  const availableMedalCount = Math.max(0, totalMedals - redeemedMedals);

  if (showWheelView) {
    return (
      <TimeSpaceWheelView 
        onBack={() => setShowWheelView(false)}
        availableChances={availableChances}
        setAvailableChances={setAvailableChances}
        drawnPrizes={drawnPrizes}
        isSubscribed={isSubscribed}
        onDrawSuccess={(prizeName, amount) => {
          setDrawnPrizes(prev => [
            {
              prizeName,
              amount,
              date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            },
            ...prev
          ]);
        }}
      />
    );
  }

  return (
    <div className="w-full h-full bg-[#f88636] flex flex-col overflow-hidden text-slate-800 font-sans relative">
      
      {/* 1. Header (Translucent White Sticky) */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#e5e7eb] pt-safeb flex items-center justify-between px-4 py-3 shrink-0">
        <button 
          onClick={onBack}
          className="w-10 h-10 -ml-1 flex items-center justify-center text-slate-800 active:scale-95 transition-transform"
        >
          <ChevronLeft size={26} className="stroke-[2.5]" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 tracking-wide text-center flex-1 pr-9">Medal Draw</h1>
      </div>

      {/* Main Column Scrollable Area */}
      <div className="flex-1 overflow-y-auto pb-12 hide-scrollbar">
        
        {/* Landmark Banner Vector & Background */}
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#ff833b] to-[#f8782a] pb-6 pt-2">
          
          {/* Subtle Sun / Cloud glow background elements */}
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-gradient-to-t from-amber-200/20 to-transparent rounded-full filter blur-xl pointer-events-none" />
          
          {/* Landmarks SVG Illustration Component */}
          <div className="w-full px-6 flex flex-col items-center justify-center pt-3 relative z-10 text-center">
            
            {/* STARS OF LIGHT Heading Banner */}
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ffeada] opacity-90">
              LIGHT STAR
            </span>
            <h2 className="text-xl font-black text-white italic tracking-wider mt-0.5" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              - STARS <span className="text-amber-200">OF</span> LIGHT -
            </h2>

            {/* Graphic campaign title */}
            <div className="relative mt-3 mb-2 px-10 py-2 bg-gradient-to-r from-transparent via-white/10 to-transparent">
              <span className="text-3xl font-extrabold text-white tracking-widest drop-shadow-[0_3px_5px_rgba(154,23,2,0.6)] font-serif block italic">
                RUN THE WORLD
              </span>
            </div>

            {/* Simulated Chinese landmarks vector illustration strictly aligned with theme */}
            <div className="w-full h-24 relative mt-2 opacity-90">
              <svg viewBox="0 0 400 100" className="w-full h-full text-amber-150 fill-current opacity-40">
                {/* Temple of Heaven and Pagoda Silhouettes */}
                <path d="M 40 100 L 40 85 L 43 85 L 43 78 L 47 78 L 47 70 L 49 70 L 49 60 L 51 60 L 51 45 L 49 45 L 49 40 L 51 40 L 51 32 C 55 32 55 15 57 15 C 59 15 59 32 63 32 L 63 40 L 65 40 L 65 45 L 63 45 L 63 60 L 65 60 L 65 70 L 67 70 L 67 78 L 71 78 L 71 85 L 74 85 L 74 100 Z" />
                <path d="M 120 L 120 75 Q 150 72 150 50 Q 150 35 160 35 Q 170 35 170 50 Q 170 72 200 75 L 200 100 Z" />
                {/* Eiffel Tower and Pearl Tower */}
                <path d="M 280 100 L 290 55 L 293 55 L 293 40 L 296 40 L 296 15 L 298 15 L 298 10 L 302 10 L 302 15 L 304 15 L 304 40 L 307 40 L 307 55 L 320 100 Z" />
                <circle cx="300" cy="50" r="8" />
                <circle cx="300" cy="28" r="4" />
                {/* Oriental Landmark Skyline Line */}
                <line x1="0" y1="98" x2="400" y2="98" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Golden badge row and rules entry */}
          <div className="mx-4 mt-2 bg-gradient-to-r from-[#fda262] to-[#fd924a] border border-white/20 rounded-2xl flex items-center justify-between px-4 py-2.5 text-white shadow-md">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-3.5 bg-white rounded-full" />
              <span className="text-xs text-[#ffeae0]">Issue 1 Light Star</span>
            </div>
            <button 
              onClick={() => setShowRuleModal(true)}
              className="text-xs text-[#fff3eb] hover:text-white flex items-center gap-0.5 font-semibold bg-white/10 px-2.5 py-1 rounded-full transition-colors"
            >
              <span>Rules</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* 2. Text Details Section */}
        <div className="mx-4 bg-white/10 border border-white/15 rounded-3xl p-5 text-white backdrop-blur-md mb-4 -mt-1 shadow-lg relative z-10">
          <h3 className="text-lg font-extrabold flex items-center gap-2">
            <span>Run the World</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">Issue 1</span>
          </h3>
          <p className="text-xs text-[#ffe1cc] mt-1.5 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse"></span>
            <span>3,225 runners joined and logged miles</span>
          </p>
          <div className="mt-4 pt-3.5 border-t border-white/10 space-y-1.5 text-xs text-[#ffdccc]">
            <p className="flex items-start">
              <span className="font-bold text-white shrink-0 mr-1">This issue:</span>
              <span>Jun 8-Jul 8, 2026 or until the pool ends</span>
            </p>
            <p className="flex items-start">
              <span className="font-bold text-white shrink-0 mr-1">Next issue:</span>
              <span>Starts 1-3 business days after this issue</span>
            </p>
          </div>
        </div>



        {/* 3. Steps Interactive Container */}
        <div className="mx-4 space-y-4">
          
          {/* STEP 1 */}
          <div className="bg-[#fffcf6] border border-orange-200/40 rounded-3xl p-4.5 flex items-center justify-between shadow-md">
            <div className="flex-1 pr-3">
              <div className="inline-flex py-0.5 px-2 bg-gradient-to-r from-[#ffa44a] to-[#ff8c20] text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-sm">
                Step 1
              </div>
              <h4 className="text-[13px] font-bold text-slate-800 mt-2 leading-relaxed">
                Finish a route and earn medals
              </h4>
              <p className="text-[11px] text-[#aa6c45] mt-1">
                Route medals earned: <strong className="text-[#f97316] text-sm font-black font-mono">{userStats.completedRoutes * 3}</strong>
              </p>
            </div>
            <button 
              onClick={onGoToRunning}
              className="bg-[#2fced6] hover:bg-[#20b6be] active:scale-95 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-[0_3px_12px_rgba(47,206,214,0.3)] transition-all shrink-0"
            >
              Run
            </button>
          </div>

          {/* STEP 2 */}
          <div className="bg-[#fffcf6] border border-orange-200/40 rounded-3xl p-4.5 flex items-center justify-between shadow-md">
            <div className="flex-1 pr-3">
              <div className="inline-flex py-0.5 px-2 bg-gradient-to-r from-[#ffa44a] to-[#ff8c20] text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-sm">
                Step 2
              </div>
              <h4 className="text-[13px] font-bold text-slate-800 mt-2 leading-relaxed">
                Redeem 1 draw chance per medal
              </h4>
              <div className="text-[11px] text-[#aa6c45] mt-1 space-y-0.5">
                <p>Medals to redeem: <strong className="text-orange-500 font-bold font-mono">{availableMedalCount}</strong></p>
                <p>Draw chances: <strong className="text-amber-500 font-bold font-mono">{availableChances}</strong></p>
              </div>
            </div>
            <button 
              onClick={handleRedeemChance}
              className="bg-[#ff8f29] hover:bg-[#e87a1c] active:scale-95 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-[0_3px_12px_rgba(255,143,41,0.3)] transition-all shrink-0"
            >
              Redeem
            </button>
          </div>

          {/* STEP 3 */}
          <div className="bg-[#fffcf6] border border-orange-200/40 rounded-3xl p-4.5 flex flex-col shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-3">
                <div className="inline-flex py-0.5 px-2 bg-gradient-to-r from-[#ffa44a] to-[#ff8c20] text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-sm">
                  Step 3
                </div>
                <h4 className="text-[13px] font-bold text-slate-800 mt-2 leading-relaxed">
                  Draw cash rewards
                </h4>
              </div>
              
              {isPoolEmpty ? (
                <button 
                  onClick={() => setShowWheelView(true)}
                  className="bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 active:scale-95 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-lg transition-all shrink-0"
                >
                  Draw ({availableChances})
                </button>
              ) : (
                <button 
                  onClick={() => setShowWheelView(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-lg transition-all shrink-0"
                >
                  Draw ({availableChances})
                </button>
              )}
            </div>

            {/* Red / Time Status Overlay as in Screenshot */}
            <div className="mt-2.5 pt-2 border-t border-orange-100/60 flex items-center justify-between">
              {isPoolEmpty ? (
                <>
                  <span className="text-[10px] text-[#f44336] font-bold font-sans">Prize pool empty</span>
                  <span className="text-[10px] text-[#ff8f29] font-bold font-sans">Next: Jun 10, 20:00</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] text-teal-600 font-bold font-sans">🎉 Live now</span>
                  <span className="text-[10px] text-orange-600 font-bold font-sans">Pool left: ${remainingPool.toFixed(2)}</span>
                </>
              )}
            </div>
          </div>

          {/* STEP 4 */}
          <div className="bg-[#fffcf6] border border-orange-200/40 rounded-3xl p-4.5 flex items-center justify-between shadow-md">
            <div className="flex-1 pr-3">
              <div className="inline-flex py-0.5 px-2 bg-gradient-to-r from-[#ffa44a] to-[#ff8c20] text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-sm">
                Step 4
              </div>
              <h4 className="text-[13px] font-bold text-slate-800 mt-2 leading-relaxed">
                Withdraw in MOVEVI
              </h4>
              <p className="text-[11px] text-[#aa6c45] mt-1">Fast cash payout</p>
            </div>
            <button 
              onClick={() => showToast('🏦 Test withdrawal complete. Real payouts are issued through MOVEVI.')}
              className="bg-[#2ecc71] hover:bg-[#27ae60] active:scale-95 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-[0_3px_12px_rgba(46,204,113,0.3)] transition-all shrink-0"
            >
              Withdraw
            </button>
          </div>

        </div>

        {/* 4. Detail blocks: event, prize pool, and reward list */}
        <div className="mt-6 mx-4 space-y-4">
          
          {/* Issue 1 event */}
          <div className="bg-[#fffbf6] rounded-3xl p-5 shadow-sm border border-orange-100/50">
            <div className="flex items-center justify-between pb-3.5 border-b border-orange-100">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded-lg bg-orange-100 text-orange-600">
                  <Trophy size={14} className="stroke-[2.5]" />
                </span>
                <span className="text-sm font-black text-slate-850">Issue 1 Event</span>
              </div>
            </div>
            <div className="mt-3 text-[12px] text-slate-650 space-y-2 leading-relaxed font-medium">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-[#d85c18] flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</span>
                <span>Complete Run the World routes to earn medals.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-[#d85c18] flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">2</span>
                <span>Redeem medals for draw chances.</span>
              </div>
            </div>
          </div>

          {/* Issue 1 prize pool */}
          <div className="bg-[#fffbf6] rounded-3xl p-5 shadow-sm border border-orange-100/50">
            <div className="flex items-center justify-between pb-3 border-b border-orange-100">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded-lg bg-orange-100 text-orange-600">
                  <Gift size={14} />
                </span>
                <span className="text-sm font-black text-slate-850">Issue 1 Prize Pool</span>
              </div>
              <button 
                onClick={() => {
                  if (drawnPrizes.length === 0) {
                    showToast('📜 No reward history yet. Start a draw to test the flow.');
                  } else {
                    showToast(`🏆 Test reward history: ${drawnPrizes.map(p => `${p.prizeName}(${p.amount})`).join(', ')}`);
                  }
                }}
                className="text-xs text-orange-500 font-bold hover:text-orange-600 flex items-center gap-0.5 bg-orange-50 px-2 py-1 rounded-full"
              >
                <span>Past rewards</span>
                <ChevronRight size={12} />
              </button>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs text-slate-500 font-bold mb-1.5">
                <span>Left: ${remainingPool.toFixed(2)}</span>
                <span>Total: $100.00</span>
              </div>
              <div className="w-full h-3 bg-[#f2e6db] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isPoolEmpty ? '0%' : `${(remainingPool / 100) * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-orange-400 to-[#f97316] rounded-full" 
                />
              </div>
            </div>
          </div>

          {/* Issue 1 rewards */}
          <div className="bg-[#fffbf6] rounded-3xl p-5 shadow-sm border border-orange-100/50">
            <div className="flex items-center justify-between pb-3.5 border-b border-orange-100">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded-lg bg-orange-100 text-orange-600">
                  <Coins size={14} />
                </span>
                <span className="text-sm font-black text-slate-850">Issue 1 Rewards</span>
              </div>
              <button 
                onClick={() => showToast('🎯 Odds: First Prize 1%, Second 2%, Third 4%, Fourth 13%, Fifth 35%, Sixth 45%.')}
                className="text-xs text-orange-500 font-bold hover:text-orange-600 flex items-center gap-0.5 bg-orange-50 px-2 py-1 rounded-full"
              >
                <span>Odds</span>
                <ChevronRight size={12} />
              </button>
            </div>

            {/* Grid display layout matching screenshot precisely */}
            <div className="mt-4 space-y-3">
              
              {/* First prize */}
              <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-4 border border-red-100 flex items-center justify-between overflow-hidden relative group">
                {/* Background Sparkles */}
                <div className="absolute right-2 bottom-0 opacity-10 pointer-events-none text-red-500 font-black text-6xl select-none">🧧</div>
                
                <div className="flex items-center gap-3 relative z-10">
                  {/* Glowing envelope box */}
                  <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-red-500/20 relative shrink-0">
                    🧧
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-bounce" />
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-red-100 border border-red-200 text-red-700 text-[10px] font-black rounded-lg mb-1">
                      First Prize
                    </span>
                    <h5 className="text-sm font-extrabold text-[#d32f2f] leading-tight">
                      Cash $38.80
                    </h5>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">Odds: 1%</p>
                  </div>
                </div>
                <div className="text-right font-black font-mono text-slate-800 text-xs shrink-0 bg-white/60 px-2.5 py-1.5 rounded-xl border border-black/5">
                  Qty * 1
                </div>
              </div>

              {/* Second and third prizes */}
              <div className="grid grid-cols-2 gap-3">
                {/* Second prize */}
                <div className="bg-gradient-to-b from-red-50 to-white rounded-2xl p-3 border border-red-50 flex flex-col items-center text-center relative overflow-hidden">
                  <span className="px-2 py-0.5 bg-red-100 border border-red-200 text-[#d32f2f] text-[9px] font-black rounded-lg mb-2">
                    Second Prize
                  </span>
                  <div className="text-3xl mb-1">🧧</div>
                  <h6 className="text-xs font-black text-[#d32f2f]">Cash $18.80</h6>
                  <p className="text-[10px] text-[#f43f5e] font-bold mt-0.5">Odds: 2%</p>
                  <p className="text-[10px] text-slate-400 font-bold font-mono mt-1">Qty * 2</p>
                </div>
                
                {/* Third prize */}
                <div className="bg-gradient-to-b from-red-50 to-white rounded-2xl p-3 border border-red-50 flex flex-col items-center text-center relative overflow-hidden">
                  <span className="px-2 py-0.5 bg-red-100 border border-red-200 text-[#d32f2f] text-[9px] font-black rounded-lg mb-2">
                    Third Prize
                  </span>
                  <div className="text-3xl mb-1">🧧</div>
                  <h6 className="text-xs font-black text-[#d32f2f]">Cash $8.88</h6>
                  <p className="text-[10px] text-[#f43f5e] font-bold mt-0.5">Odds: 4%</p>
                  <p className="text-[10px] text-slate-400 font-bold font-mono mt-1">Qty * 3</p>
                </div>
              </div>

              {/* Fourth, fifth, and sixth prizes */}
              <div className="grid grid-cols-3 gap-2 pb-2">
                {/* Fourth prize */}
                <div className="bg-white rounded-xl p-2.5 border border-slate-100 flex flex-col items-center justify-between text-center min-h-[125px]">
                  <div className="text-2xl mb-1 mt-1">🧧</div>
                  <p className="text-[11px] font-black text-rose-600 leading-tight">Cash $3.88</p>
                  <p className="text-[9px] text-[#f43f5e] font-bold mt-0.5">Odds: 13%</p>
                  <span className="w-full text-[9px] py-0.5 bg-orange-100/65 text-orange-850 rounded-lg text-center font-bold tracking-tight mt-2 select-none shrink-0 block">
                    Fourth
                  </span>
                </div>

                {/* Fifth prize */}
                <div className="bg-white rounded-xl p-2.5 border border-slate-100 flex flex-col items-center justify-between text-center min-h-[125px]">
                  <div className="text-2xl mb-1 mt-1">🧧</div>
                  <p className="text-[11px] font-black text-rose-600 leading-tight">Cash $1.88</p>
                  <p className="text-[9px] text-[#f43f5e] font-bold mt-0.5">Odds: 35%</p>
                  <span className="w-full text-[9px] py-0.5 bg-orange-100/65 text-orange-850 rounded-lg text-center font-bold tracking-tight mt-2 select-none shrink-0 block">
                    Fifth
                  </span>
                </div>

                {/* Sixth prize */}
                <div className="bg-white rounded-xl p-2.5 border border-slate-100 flex flex-col items-center justify-between text-center min-h-[125px]">
                  <div className="text-2xl mb-1 mt-1">🧧</div>
                  <p className="text-[11px] font-black text-rose-600 leading-tight">Cash $0.88</p>
                  <p className="text-[9px] text-[#f43f5e] font-bold mt-0.5">Odds: 45%</p>
                  <span className="w-full text-[9px] py-0.5 bg-orange-100/65 text-orange-850 rounded-lg text-center font-bold tracking-tight mt-2 select-none shrink-0 block">
                    Sixth
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>



      </div>

      {/* 5. Draw Interactive Pop-up / Celebration Modal */}
      <AnimatePresence>
        {drawnResult && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 z-[200] flex items-center justify-center p-6 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              className="w-full max-w-xs bg-gradient-to-b from-red-600 to-red-800 rounded-3xl p-6 text-center text-white border-2 border-yellow-400 shadow-[0_10px_35px_rgba(239,68,68,0.4)] relative"
            >
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setDrawnResult(null)}
                  className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>
              
              <div className="w-18 h-18 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto text-4xl mb-3 shadow-inner">
                {drawnResult.icon}
              </div>
              
              <p className="text-[11px] font-bold uppercase tracking-widest text-yellow-300">
                You won
              </p>
              
              <h3 className="text-2xl font-black text-white mt-1">
                {drawnResult.tier}
              </h3>
              
              <div className="my-5 bg-white/10 rounded-2xl p-4 border border-white/10">
                <span className="text-[10px] text-yellow-100 block">Cash reward saved to your pending balance</span>
                <span className="text-3xl font-black text-yellow-400 block mt-1">
                  {drawnResult.amount}
                </span>
              </div>
              
              <button
                onClick={() => {
                  setDrawnResult(null);
                  showToast('🎉 Reward added to your test balance. Go to Step 4 to withdraw.');
                }}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-red-950 font-black rounded-xl text-xs tracking-wider shadow-md active:scale-98 transition-all"
              >
                Claim reward
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Active Drawing Loading Animation Overlay */}
      <AnimatePresence>
        {showDrawAnimation && (
          <div className="absolute inset-0 bg-black/80 z-[200] flex flex-col items-center justify-center">
            {/* Spinning/pulsing red package box */}
            <motion.div 
              animate={{ 
                rotateY: [0, 180, 360],
                scale: [1, 1.15, 1],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="text-7xl drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] font-italic cursor-none"
            >
              🧧
            </motion.div>
            <p className="text-xs text-yellow-400 font-extrabold tracking-widest mt-6 animate-pulse">
              Drawing your cash reward...
            </p>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Detailed Activity Rules Modals */}
      <AnimatePresence>
        {showRuleModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-[200] flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-[#fffcf6] rounded-3xl p-5 text-slate-800 shadow-2xl relative"
            >
              <h3 className="text-base font-black text-[#d85c18] pb-3 border-b border-orange-100 flex items-center gap-1.5">
                <AlertCircle size={18} />
                <span>Activity Rules</span>
              </h3>
              
              <div className="mt-4 space-y-3.5 text-xs text-slate-600 leading-relaxed font-medium">
                <p>
                  <strong className="text-slate-850">1. Eligibility:</strong> All registered MOVEVI users can join.
                </p>
                <p>
                  <strong className="text-slate-850">2. Medal earning:</strong> Complete any city route to earn that route's medals. The first route in each city is free.
                </p>
                <p>
                  <strong className="text-slate-800">3. Redemption:</strong> During the event period, 1 route medal can be redeemed for 1 draw chance.
                </p>
                <p>
                  <strong className="text-slate-800">4. Cash withdrawal:</strong> Cash rewards are saved to your MOVEVI account and can be withdrawn after verification.
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowRuleModal(false)}
                  className="w-full py-3 bg-[#f88636] text-white font-black rounded-xl text-xs tracking-wider hover:bg-[#e17429] transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. Global Action Toast Messages */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute bottom-5 left-5 right-5 z-[250] bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl border border-white/5 flex items-center gap-2 "
          >
            <span className="text-sm">💡</span>
            <span className="flex-1 leading-normal">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
