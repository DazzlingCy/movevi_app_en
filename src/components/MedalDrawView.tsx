import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Gift, Trophy, Check, ArrowLeft, Play, Coins, AlertCircle } from 'lucide-react';
import TimeSpaceWheelView from './TimeSpaceWheelView';
import runTheWorldHero from '../assets/run-the-world-hero.webp';
import {
  PRIZE_POOL_TOTAL_AMOUNT,
  PRIZE_POOL_TOTAL_SPOTS,
  PRIZE_TIERS,
  formatPrizeAmount,
  pickPrizeTier,
} from '../lib/prizePool';

interface MedalDrawViewProps {
  onBack: () => void;
  onGoToRunning: () => void;
  showHeader?: boolean;
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

export default function MedalDrawView({
  onBack,
  onGoToRunning,
  showHeader = true,
  userStats,
  setUserStats,
}: MedalDrawViewProps) {
  // Simulator State so user can test both completed screen and drawing state!
  const [isPoolEmpty, setIsPoolEmpty] = useState(false); // Default false for running state
  const [showWheelView, setShowWheelView] = useState(false);
  const [availableChances, setAvailableChances] = useState(0);
  const [redeemedMedals, setRedeemedMedals] = useState(0);
  const [remainingPool, setRemainingPool] = useState(PRIZE_POOL_TOTAL_AMOUNT);
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
    setShowDrawAnimation(true);

    const selectedPrize = pickPrizeTier(drawnPrizes.length);
    const result = {
      tier: selectedPrize.tier,
      amount: formatPrizeAmount(selectedPrize.amount),
      icon: selectedPrize.tier === 'First Prize' ? '🏆' : '🧧',
    };
    setRemainingPool(prev => Math.max(0, Number((prev - selectedPrize.amount).toFixed(2))));

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
  const [sixthPrize, fifthPrize, fourthPrize, thirdPrize, secondPrize, firstPrize] = PRIZE_TIERS;

  if (showWheelView) {
    return (
      <TimeSpaceWheelView 
        onBack={() => setShowWheelView(false)}
        availableChances={availableChances}
        setAvailableChances={setAvailableChances}
        remainingPoolAmount={remainingPool}
        setRemainingPoolAmount={setRemainingPool}
        drawnPrizes={drawnPrizes}
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
    <div className="w-full h-full bg-[#05070A] flex flex-col overflow-hidden text-slate-100 font-sans relative">
      
      {/* 1. Header (only used when the activity opens as a full-screen overlay) */}
      {showHeader && (
        <div className="sticky top-0 z-30 bg-[#080b10]/95 border-b border-white/10 pt-safeb flex items-center justify-between px-4 py-3 shrink-0 backdrop-blur-xl">
          <button
            onClick={onBack}
            className="w-10 h-10 -ml-1 flex items-center justify-center text-slate-300 active:scale-95 transition-transform"
          >
            <ChevronLeft size={26} className="stroke-[2.5]" />
          </button>
          <h1 className="text-lg font-bold text-slate-100 tracking-wide text-center flex-1 pr-9">Medal Draw</h1>
        </div>
      )}

      {/* Main Column Scrollable Area */}
      <div className="flex-1 overflow-y-auto pb-12 hide-scrollbar">
        
        {/* Run the World image hero */}
        <div className="relative w-full min-h-[360px] overflow-hidden bg-[#071018] pb-6 pt-4 border-b border-white/5">
          <img
            src={runTheWorldHero}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-[center_62%]"
          />
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          
          <div className="w-full px-6 flex flex-col items-center justify-center pt-3 relative z-10 text-center">
            
            {/* STARS OF LIGHT Heading Banner */}
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
              LIGHT STAR
            </span>
            <h2 className="text-xl font-black text-slate-100 tracking-wider mt-1">
              STARS <span className="text-amber-300">OF</span> LIGHT
            </h2>

            {/* Graphic campaign title */}
            <div className="relative mt-3 mb-2 px-10 py-2 border-y border-white/5">
              <span className="text-3xl font-black text-white tracking-widest block">
                RUN THE WORLD
              </span>
            </div>

            <div className="w-full h-32 mt-2" aria-hidden="true" />
          </div>

          {/* Golden badge row and rules entry */}
          <div className="mx-4 mt-2 bg-[#101821]/90 border border-cyan-500/20 rounded-2xl flex items-center justify-between px-4 py-2.5 text-white shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.65)]" />
              <span className="text-xs text-slate-200">Issue 1 Light Star</span>
            </div>
            <button 
              onClick={() => setShowRuleModal(true)}
              className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-0.5 font-semibold bg-cyan-500/10 border border-cyan-500/15 px-2.5 py-1 rounded-full transition-colors"
            >
              <span>Rules</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* 2. Text Details Section */}
        <div className="mx-4 bg-[#0d141c] border border-white/10 rounded-3xl p-5 text-slate-100 mb-4 mt-1 shadow-lg relative z-10">
          <h3 className="text-lg font-extrabold flex items-center gap-2">
            <span>Run the World</span>
            <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">Issue 1</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse"></span>
            <span>3,225 runners joined and logged miles</span>
          </p>
          <div className="mt-4 pt-3.5 border-t border-white/5 space-y-1.5 text-xs text-slate-400">
            <p className="flex items-start">
              <span className="font-bold text-slate-200 shrink-0 mr-1">This issue:</span>
              <span>Jun 8-Jul 8, 2026 or until the pool ends</span>
            </p>
            <p className="flex items-start">
              <span className="font-bold text-slate-200 shrink-0 mr-1">Next issue:</span>
              <span>Starts 1-3 business days after this issue</span>
            </p>
          </div>
        </div>



        {/* 3. Steps Interactive Container */}
        <div className="mx-4 space-y-4">
          
          {/* STEP 1 */}
          <div className="bg-[#0d1219] border border-white/10 rounded-2xl p-4.5 flex items-center justify-between shadow-lg">
            <div className="flex-1 pr-3">
              <div className="inline-flex py-0.5 px-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-black rounded-lg uppercase tracking-wider">
                Step 1
              </div>
              <h4 className="text-[13px] font-bold text-slate-100 mt-2 leading-relaxed">
                Finish a route and earn medals
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Route medals earned: <strong className="text-amber-400 text-sm font-black font-mono">{userStats.completedRoutes * 3}</strong>
              </p>
            </div>
            <button 
              onClick={onGoToRunning}
              className="bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-[0_3px_12px_rgba(34,211,238,0.25)] transition-all shrink-0"
            >
              Run
            </button>
          </div>

          {/* STEP 2 */}
          <div className="bg-[#0d1219] border border-white/10 rounded-2xl p-4.5 flex items-center justify-between shadow-lg">
            <div className="flex-1 pr-3">
              <div className="inline-flex py-0.5 px-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-black rounded-lg uppercase tracking-wider">
                Step 2
              </div>
              <h4 className="text-[13px] font-bold text-slate-100 mt-2 leading-relaxed">
                Redeem 1 draw chance per medal
              </h4>
              <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
                <p>Medals to redeem: <strong className="text-amber-400 font-bold font-mono">{availableMedalCount}</strong></p>
                <p>Draw chances: <strong className="text-cyan-400 font-bold font-mono">{availableChances}</strong></p>
              </div>
            </div>
            <button 
              onClick={handleRedeemChance}
              className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-[0_3px_12px_rgba(251,191,36,0.22)] transition-all shrink-0"
            >
              Redeem
            </button>
          </div>

          {/* STEP 3 */}
          <div className="bg-[#0d1219] border border-amber-500/20 rounded-2xl p-4.5 flex flex-col shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-3">
                <div className="inline-flex py-0.5 px-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  Step 3
                </div>
                <h4 className="text-[13px] font-bold text-slate-100 mt-2 leading-relaxed">
                  Draw cash rewards
                </h4>
              </div>
              
              {isPoolEmpty ? (
                <button 
                  onClick={() => setShowWheelView(true)}
                  className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all shrink-0"
                >
                  Draw ({availableChances})
                </button>
              ) : (
                <button 
                  onClick={() => setShowWheelView(true)}
                  className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all shrink-0"
                >
                  Draw ({availableChances})
                </button>
              )}
            </div>

            {/* Red / Time Status Overlay as in Screenshot */}
            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
              {isPoolEmpty ? (
                <>
                  <span className="text-[10px] text-red-400 font-bold font-sans">Prize pool empty</span>
                  <span className="text-[10px] text-amber-400 font-bold font-sans">Next: Jun 10, 20:00</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] text-cyan-400 font-bold font-sans">Live now</span>
                  <span className="text-[10px] text-amber-400 font-bold font-sans">Pool left: ${remainingPool.toFixed(2)}</span>
                </>
              )}
            </div>
          </div>

          {/* STEP 4 */}
          <div className="bg-[#0d1219] border border-white/10 rounded-2xl p-4.5 flex items-center justify-between shadow-lg">
            <div className="flex-1 pr-3">
              <div className="inline-flex py-0.5 px-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-black rounded-lg uppercase tracking-wider">
                Step 4
              </div>
              <h4 className="text-[13px] font-bold text-slate-100 mt-2 leading-relaxed">
                Withdraw in MOVEVI
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">Fast cash payout</p>
            </div>
            <button 
              onClick={() => showToast('🏦 Test withdrawal complete. Real payouts are issued through MOVEVI.')}
              className="bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-[0_3px_12px_rgba(52,211,153,0.22)] transition-all shrink-0"
            >
              Withdraw
            </button>
          </div>

        </div>

        {/* 4. Detail blocks: event, prize pool, and reward list */}
        <div className="mt-6 mx-4 space-y-4">
          
          {/* Issue 1 event */}
          <div className="bg-[#0d1219] rounded-2xl p-5 shadow-lg border border-white/10">
            <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Trophy size={14} className="stroke-[2.5]" />
                </span>
                <span className="text-sm font-black text-slate-100">Issue 1 Event</span>
              </div>
            </div>
            <div className="mt-3 text-[12px] text-slate-400 space-y-2 leading-relaxed font-medium">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</span>
                <span>Complete Run the World routes to earn medals.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">2</span>
                <span>Redeem medals for draw chances.</span>
              </div>
            </div>
          </div>

          {/* Issue 1 prize pool */}
          <div className="bg-[#0d1219] rounded-2xl p-5 shadow-lg border border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
                  <Gift size={14} />
                </span>
                <span className="text-sm font-black text-slate-100">Issue 1 Prize Pool</span>
              </div>
              <button 
                onClick={() => {
                  if (drawnPrizes.length === 0) {
                    showToast('📜 No reward history yet. Start a draw to test the flow.');
                  } else {
                    showToast(`🏆 Test reward history: ${drawnPrizes.map(p => `${p.prizeName}(${p.amount})`).join(', ')}`);
                  }
                }}
                className="text-xs text-amber-300 font-bold hover:text-amber-200 flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/15 px-2 py-1 rounded-full"
              >
                <span>Past rewards</span>
                <ChevronRight size={12} />
              </button>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs text-slate-400 font-bold mb-1.5">
                <span>Left: ${remainingPool.toFixed(2)}</span>
                <span>${PRIZE_POOL_TOTAL_AMOUNT.toFixed(0)} · {PRIZE_POOL_TOTAL_SPOTS} prizes</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isPoolEmpty ? '0%' : `${(remainingPool / PRIZE_POOL_TOTAL_AMOUNT) * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Issue 1 rewards */}
          <div className="bg-[#0d1219] rounded-2xl p-5 shadow-lg border border-white/10">
            <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
                  <Coins size={14} />
                </span>
                <span className="text-sm font-black text-slate-100">Issue 1 Rewards</span>
              </div>
            </div>

            {/* Grid display layout matching screenshot precisely */}
            <div className="mt-4 space-y-3">
              
              {/* First prize */}
              <div className="bg-gradient-to-r from-red-950/30 to-amber-950/20 rounded-2xl p-4 border border-red-500/15 flex items-center justify-between overflow-hidden relative group">
                {/* Background Sparkles */}
                <div className="absolute right-2 bottom-0 opacity-10 pointer-events-none text-red-500 font-black text-6xl select-none">🧧</div>
                
                <div className="flex items-center gap-3 relative z-10">
                  {/* Glowing envelope box */}
                  <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-red-500/20 relative shrink-0">
                    🧧
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-bounce" />
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-300 text-[10px] font-black rounded-lg mb-1">
                      First Prize
                    </span>
                    <h5 className="text-sm font-extrabold text-red-300 leading-tight">
                      Cash {formatPrizeAmount(firstPrize.amount)}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Odds: {firstPrize.chance}%</p>
                  </div>
                </div>
                <div className="text-right font-black font-mono text-slate-200 text-xs shrink-0 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10">
                  Qty * {firstPrize.quantity}
                </div>
              </div>

              {/* Second and third prizes */}
              <div className="grid grid-cols-2 gap-3">
                {/* Second prize */}
                <div className="bg-[#111720] rounded-2xl p-3 border border-white/5 flex flex-col items-center text-center relative overflow-hidden">
                  <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-300 text-[9px] font-black rounded-lg mb-2">
                    Second Prize
                  </span>
                  <div className="text-3xl mb-1">🧧</div>
                  <h6 className="text-xs font-black text-red-300">Cash {formatPrizeAmount(secondPrize.amount)}</h6>
                  <p className="text-[10px] text-red-400 font-bold mt-0.5">Odds: {secondPrize.chance}%</p>
                  <p className="text-[10px] text-slate-500 font-bold font-mono mt-1">Qty * {secondPrize.quantity}</p>
                </div>
                
                {/* Third prize */}
                <div className="bg-[#111720] rounded-2xl p-3 border border-white/5 flex flex-col items-center text-center relative overflow-hidden">
                  <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-300 text-[9px] font-black rounded-lg mb-2">
                    Third Prize
                  </span>
                  <div className="text-3xl mb-1">🧧</div>
                  <h6 className="text-xs font-black text-red-300">Cash {formatPrizeAmount(thirdPrize.amount)}</h6>
                  <p className="text-[10px] text-red-400 font-bold mt-0.5">Odds: {thirdPrize.chance}%</p>
                  <p className="text-[10px] text-slate-500 font-bold font-mono mt-1">Qty * {thirdPrize.quantity}</p>
                </div>
              </div>

              {/* Fourth, fifth, and sixth prizes */}
              <div className="grid grid-cols-3 gap-2 pb-2">
                {/* Fourth prize */}
                <div className="bg-[#111720] rounded-xl p-2.5 border border-white/5 flex flex-col items-center justify-between text-center min-h-[125px]">
                  <div className="text-2xl mb-1 mt-1">🧧</div>
                  <p className="text-[11px] font-black text-red-300 leading-tight">Cash {formatPrizeAmount(fourthPrize.amount)}</p>
                  <p className="text-[9px] text-red-400 font-bold mt-0.5">Odds: {fourthPrize.chance}%</p>
                  <span className="w-full text-[9px] py-0.5 bg-amber-500/10 text-amber-300 rounded-lg text-center font-bold tracking-tight mt-2 select-none shrink-0 block">
                    Fourth · {fourthPrize.quantity}
                  </span>
                </div>

                {/* Fifth prize */}
                <div className="bg-[#111720] rounded-xl p-2.5 border border-white/5 flex flex-col items-center justify-between text-center min-h-[125px]">
                  <div className="text-2xl mb-1 mt-1">🧧</div>
                  <p className="text-[11px] font-black text-red-300 leading-tight">Cash {formatPrizeAmount(fifthPrize.amount)}</p>
                  <p className="text-[9px] text-red-400 font-bold mt-0.5">Odds: {fifthPrize.chance}%</p>
                  <span className="w-full text-[9px] py-0.5 bg-amber-500/10 text-amber-300 rounded-lg text-center font-bold tracking-tight mt-2 select-none shrink-0 block">
                    Fifth · {fifthPrize.quantity}
                  </span>
                </div>

                {/* Sixth prize */}
                <div className="bg-[#111720] rounded-xl p-2.5 border border-white/5 flex flex-col items-center justify-between text-center min-h-[125px]">
                  <div className="text-2xl mb-1 mt-1">🧧</div>
                  <p className="text-[11px] font-black text-red-300 leading-tight">Cash {formatPrizeAmount(sixthPrize.amount)}</p>
                  <p className="text-[9px] text-red-400 font-bold mt-0.5">Odds: {sixthPrize.chance}%</p>
                  <span className="w-full text-[9px] py-0.5 bg-amber-500/10 text-amber-300 rounded-lg text-center font-bold tracking-tight mt-2 select-none shrink-0 block">
                    Sixth · {sixthPrize.quantity}
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
              className="w-full max-w-sm bg-[#10151d] rounded-3xl p-5 text-slate-100 shadow-2xl border border-white/10 relative"
            >
              <h3 className="text-base font-black text-amber-300 pb-3 border-b border-white/10 flex items-center gap-1.5">
                <AlertCircle size={18} />
                <span>Activity Rules</span>
              </h3>
              
              <div className="mt-4 space-y-3.5 text-xs text-slate-400 leading-relaxed font-medium">
                <p>
                  <strong className="text-slate-200">1. Eligibility:</strong> All registered MOVEVI users can join.
                </p>
                <p>
                  <strong className="text-slate-200">2. Medal earning:</strong> Complete any city route with an active Premium membership to earn that route's medals.
                </p>
                <p>
                  <strong className="text-slate-200">3. Redemption:</strong> During the event period, 1 route medal can be redeemed for 1 draw chance.
                </p>
                <p>
                  <strong className="text-slate-200">4. Cash withdrawal:</strong> Cash rewards are saved to your MOVEVI account and can be withdrawn after verification.
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowRuleModal(false)}
                  className="w-full py-3 bg-cyan-400 text-slate-950 font-black rounded-xl text-xs tracking-wider hover:bg-cyan-300 transition-colors"
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