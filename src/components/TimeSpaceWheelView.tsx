import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Share2, Volume2, Trophy, Award, Gift, Clock, Sparkles } from 'lucide-react';

interface TimeSpaceWheelViewProps {
  onBack: () => void;
  availableChances: number;
  setAvailableChances: React.Dispatch<React.SetStateAction<number>>;
  onDrawSuccess: (prizeName: string, amount: string) => void;
  drawnPrizes: { prizeName: string; amount: string; date: string }[];
}

// 6个奖项，角度对应转盘上的扇区中心
const WHEEL_PRIZES = [
  { id: '0.88', name: '¥0.88', amount: '0.88元', colorText: '#da3a25', bg: '#ffffff', degCenter: 30 },
  { id: '1.88', name: '¥1.88', amount: '1.88元', colorText: '#da3a25', bg: '#fff2e8', degCenter: 90 },
  { id: '88.2', name: '88.2元', amount: '88.2元', colorText: '#b31505', bg: '#ffffff', degCenter: 150, isMega: true },
  { id: '99.9', name: '99.9元', amount: '99.9元', colorText: '#b31505', bg: '#fff2e8', degCenter: 210, isMega: true },
  { id: '8.88', name: '¥8.88', amount: '8.88元', colorText: '#da3a25', bg: '#ffffff', degCenter: 270 },
  { id: '18.88', name: '¥18.88', amount: '18.88元', colorText: '#da3a25', bg: '#fff2e8', degCenter: 330 }
];

export default function TimeSpaceWheelView({ 
  onBack, 
  availableChances, 
  setAvailableChances, 
  onDrawSuccess,
  drawnPrizes
}: TimeSpaceWheelViewProps) {
  const [isRotating, setIsRotating] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [showResultModal, setShowResultModal] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ledActive, setLedActive] = useState(true);

  // Remaining and divided simulated values strictly resembling the photo details
  const [remainingPoolAmount, setRemainingPoolAmount] = useState(428.50);
  const [dividedPercentage, setDividedPercentage] = useState(14.3);

  // Alternating marquee lights on the outer edge of the wheel
  useEffect(() => {
    const timer = setInterval(() => {
      setLedActive(prev => !prev);
    }, 450);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = () => {
    setAvailableChances(prev => prev + 1);
    triggerToast('🎉 分享成功！已免费赠送您 1 次抽奖机会 🎁');
  };

  const handleDraw = () => {
    if (isRotating) return;

    if (availableChances <= 0) {
      triggerToast('💡 您当前没有抽奖机会哦，可以用勋章兑换或立即分享！');
      return;
    }

    setIsRotating(true);
    setAvailableChances(prev => prev - 1);

    // Dynamic random selection based on probabilities
    // Mega prizes (99.9 and 88.2) are slightly rarer but 100% win rate guarantees something
    const rand = Math.random();
    let selectedPrizeIndex = 0; // default 0.88

    if (rand < 0.45) {
      selectedPrizeIndex = 0; // ¥0.88
    } else if (rand < 0.80) {
      selectedPrizeIndex = 1; // ¥1.88
    } else if (rand < 0.93) {
      selectedPrizeIndex = 4; // ¥8.88
    } else if (rand < 0.97) {
      selectedPrizeIndex = 5; // ¥18.88
    } else if (rand < 0.99) {
      selectedPrizeIndex = 2; // 88.2元
    } else {
      selectedPrizeIndex = 3; // 99.9元
    }

    const prize = WHEEL_PRIZES[selectedPrizeIndex];

    // Calculation: Extra full rounds (5-8 rounds) + offset back to 0° pointer
    const targetDegCenter = prize.degCenter;
    const miniRounds = 5 + Math.floor(Math.random() * 4); // 5 to 8 full spins
    const finalRotation = miniRounds * 360 + (360 - targetDegCenter);

    setWheelRotation(finalRotation);

    setTimeout(() => {
      setIsRotating(false);
      setShowResultModal(prize);
      
      // Update the fake cash pool parameters slightly for realism
      const drawnAmount = parseFloat(prize.amount.replace('元', ''));
      setRemainingPoolAmount(prev => Math.max(0, Number((prev - drawnAmount).toFixed(2))));
      setDividedPercentage(prev => Number((prev + 0.3).toFixed(1)));

      onDrawSuccess(prize.name, prize.amount);
    }, 4000); // 4 seconds total transition rotation
  };

  return (
    <div id="timespace-wheel-root" className="w-full h-full bg-[#05070a] flex flex-col justify-between overflow-y-auto px-4 pb-12 pt-safeb text-white hide-scrollbar relative">
      
      {/* 1. Header Area with back arrow */}
      <div className="flex items-center justify-between w-full h-14 shrink-0 relative z-10 pt-2">
        <button 
          id="back-btn"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center active:scale-90 transition-transform"
        >
          <ChevronLeft size={22} className="text-slate-300" />
        </button>
        <div className="text-center">
          <h2 className="text-md font-extrabold tracking-wider text-slate-100 italic">时空大转盘</h2>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">转动幸运大转盘，100%抽取现金奖励</p>
        </div>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      {/* Main Wheel Canvas Block Container resembling aesthetic curves */}
      <div className="flex-1 w-full flex flex-col items-center justify-center py-4 relative">
        
        {/* Deep starry space radial blur backdrop */}
        <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-t from-amber-500/10 via-red-500/5 to-transparent filter blur-3xl pointer-events-none" />

        {/* Outer Fine Rounded White/Golden border framework */}
        <div className="w-full max-w-[348px] bg-[#12141c]/90 border-[1.5px] border-amber-500/30 rounded-[36px] flex flex-col items-center p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
          
          {/* Top Yellow Badge Info Indicator */}
          <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/35 rounded-full px-5 py-1.5 flex items-center gap-1.5 shrink-0 shadow-inner mt-1 mb-4">
            <span className="animate-ping w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-[10px] font-black tracking-widest text-amber-300 uppercase leading-none">
              ✨ 限时现金奖池 ¥500 (抽空即止)
            </span>
          </div>

          {/* Sub Row: Stats remaining */}
          <div className="w-[88%] bg-black/40 border border-white/5 rounded-2xl py-2 px-4 flex items-center justify-between text-[11px] text-slate-400 font-bold mb-6">
            <p>当前剩余: <span className="text-amber-400 font-extrabold font-mono text-xs">¥{remainingPoolAmount.toFixed(2)}</span></p>
            <div className="h-4 w-px bg-white/10" />
            <p className="flex items-center gap-1">
              <span>已瓜分:</span>
              <strong className="text-yellow-400 font-bold font-mono">{dividedPercentage}%</strong>
            </p>
          </div>

          {/* --------------------- WHEEL GRAPHIC VIEWPORT --------------------- */}
          <div className="relative w-[270px] h-[270px] flex items-center justify-center shrink-0 mb-6">
            
            {/* Symmetrical golden handle graphics on the left & right sides *exactly* like in photo */}
            <div className="absolute -left-2 w-3.5 h-14 bg-gradient-to-b from-amber-500 to-yellow-600 rounded-l-lg border-y border-l border-amber-400" />
            <div className="absolute -right-2 w-3.5 h-14 bg-gradient-to-b from-amber-500 to-yellow-600 rounded-r-lg border-y border-r border-amber-400" />

            {/* Glowing Golden outer disk frame */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#ffd39b] via-[#945f32] to-[#3a1d13] p-[6px] shadow-[0_10px_25px_rgba(0,0,0,0.6)] flex items-center justify-center">
              
              {/* Marquee led lamps dotted belt rings */}
              <div className="absolute inset-1 rounded-full border border-yellow-300/30" />
              
              {/* LED dots that toggle classes on interval for realistic carousel effect */}
              {[...Array(12)].map((_, i) => {
                const angle = i * 30;
                // Alternate state
                const isActive = ledActive ? (i % 2 === 0) : (i % 2 !== 0);
                return (
                  <div 
                    key={i}
                    className={`absolute w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-amber-300 shadow-[0_0_8px_rgba(253,224,71,1)]' : 'bg-amber-950'}`}
                    style={{
                      transform: `rotate(${angle}deg) translateY(-121px)`
                    }}
                  />
                );
              })}

              {/* ROTATING CONTENT CONTAINER (Pure SVG Sectors + HTML Overlay) */}
              <div 
                className="w-full h-full rounded-full bg-[#ffeed9] overflow-hidden relative shadow-inner"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: isRotating ? 'transform 4000ms cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
                }}
              >
                {/* Embedded dynamic SVG for background sectors */}
                <svg className="w-full h-full" viewBox="0 0 300 300">
                  <defs>
                    <radialGradient id="sectorGradOdd" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#fff8f2" />
                    </radialGradient>
                    <radialGradient id="sectorGradEven" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffeedd" />
                      <stop offset="100%" stopColor="#ffe4cc" />
                    </radialGradient>
                  </defs>

                  {/* Draw 6 background sector segments by rotation */}
                  {WHEEL_PRIZES.map((p, idx) => {
                    const startAngle = idx * 60;
                    const pathD = "M150,150 L150,0 A150,150 0 0,1 279.9,74.9 Z";
                    return (
                      <g key={p.id} transform={`rotate(${startAngle}, 150, 150)`}>
                        <path 
                          d={pathD} 
                          fill={idx % 2 === 0 ? "url(#sectorGradOdd)" : "url(#sectorGradEven)"} 
                          stroke="#ffdba1"
                          strokeWidth="1.2"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Highly-compatible HTML Absolute Radial Overlay representing envelopes and prizes */}
                <div className="absolute inset-0 pointer-events-none">
                  {WHEEL_PRIZES.map((p, idx) => {
                    const angle = idx * 60 + 30; // Center angle of each 60deg wedge
                    return (
                      <div 
                        key={p.id}
                        className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center pointer-events-none"
                        style={{
                          width: '80px',
                          height: '92px',
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-76px)`,
                        }}
                      >
                        {/* Red Packet Envelope container */}
                        <div className="w-[30px] h-[39px] bg-gradient-to-b from-[#e52a10] to-[#b31402] rounded-md relative flex flex-col items-center justify-center shadow-md border border-amber-300/30 overflow-hidden">
                          {/* Triangular gold envelope flap */}
                          <div className="absolute top-0 left-0 right-0 h-[10px] bg-[#990d00] rounded-b-lg border-b border-amber-400/25" />
                          {/* Semicircular seal badge */}
                          <div className="absolute top-[12px] w-[12px] h-[12px] rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 border border-yellow-300 flex items-center justify-center text-[6px] text-[#b31402] font-black select-none">
                            福
                          </div>
                        </div>

                        {/* Amount Text label in rich high contrast text shadow outline */}
                        <span 
                          className="text-[11px] font-black tracking-tight text-[#e52a10] mt-1 font-sans shrink-0"
                          style={{ textShadow: '1.2px 1.2px 0px #fff, -1.2px -1.2px 0px #fff, 1.2px -1.2px 0px #fff, -1.2px 1.2px 0px #fff' }}
                        >
                          {p.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ----------------- CENTER PRESS AND ARROW NEEDLE ----------------- */}
              {/* Orange triangular Pointer strictly overlapping the top center edge pointing down */}
              <div className="absolute top-[16px] z-20">
                <svg width="24" height="20" viewBox="0 0 24 20" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  <path d="M12 20 L0 0 L24 0 Z" fill="#da3a25" stroke="#fcd34d" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Circular Immediate Spin trigger representing central Red Bezel Button */}
              <button 
                id="spin-trigger-btn"
                onClick={handleDraw}
                disabled={isRotating}
                className="absolute w-20 h-20 rounded-full bg-gradient-to-b from-[#ff5438] via-[#e52a10] to-[#b31402] border-[3px] border-[#fff0d6] flex flex-col items-center justify-center cursor-pointer z-10 text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-95 transition-transform"
                style={{
                  boxShadow: '0 6px 16px rgba(179,20,2,0.4), inset 0 2px 4px rgba(255,255,255,0.4)'
                }}
              >
                <span className="text-sm font-black tracking-normal leading-tight select-none">立即</span>
                <span className="text-sm font-black tracking-normal leading-tight select-none">抽奖</span>
              </button>

            </div>
          </div>

          {/* Light Orange Capsule Banner telling remaining times */}
          <div className="w-[90%] bg-gradient-to-r from-[#ffe8d6] to-[#ffdcb8] rounded-full py-2.5 px-4 flex items-center justify-center gap-1.5 shadow-md">
            <span className="text-xs text-[#a25a1e] font-black">您还有</span>
            <span className="px-2.5 py-0.5 bg-white border border-[#fcb57c] rounded-md text-[#e11d48] font-black font-mono text-xs">
              {availableChances}
            </span>
            <span className="text-xs text-[#a25a1e] font-black">次抽奖机会</span>
          </div>

        </div>
      </div>

      {/* 4. Bottom Disclosure list (奖池与概率 / 公开展示) */}
      <div className="w-full max-w-[348px] mx-auto bg-[#12141c]/50 border border-white/5 rounded-3xl p-4.5 shrink-0">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <Trophy size={13} className="text-amber-400" />
            <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest">奖池与概率</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">公开展示</span>
        </div>

        {/* 6 Grid items displaying individual potential prizes and their frequency */}
        <div className="grid grid-cols-3 gap-2 mt-3.5">
          {WHEEL_PRIZES.map(p => (
            <div 
              key={p.id} 
              className="bg-slate-900/60 border border-white/5 rounded-2xl py-2 px-1 flex flex-col items-center justify-center text-center"
            >
              <span className="text-xs font-black text-[#fb7185] font-mono">{p.name}</span>
              <span className="text-[8px] text-slate-500 font-bold mt-0.5 uppercase tracking-wide">
                100%可抽
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 我的模拟抽中历史（仅本地保存） */}
      {drawnPrizes.length > 0 && (
        <div className="w-full max-w-[348px] mx-auto mt-4 bg-[#12141c]/50 border border-white/5 rounded-3xl p-4.5 shrink-0">
          <h4 className="text-[11px] font-black text-amber-400 tracking-widest flex items-center gap-1.5 pb-2.5 border-b border-white/5 uppercase">
            <span>🎁 我的模拟抽中历史（仅本地保存）</span>
          </h4>
          <div className="mt-3.5 space-y-2 max-h-40 overflow-y-auto hide-scrollbar">
            {drawnPrizes.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-slate-200 bg-slate-900/60 p-3 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🧧</span>
                  <span className="font-extrabold">{p.prizeName}</span>
                </div>
                <div className="text-right">
                  <p className="text-red-400 font-extrabold font-mono">{p.amount}</p>
                  <p className="text-[8px] text-slate-500 font-bold mt-0.5">{p.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winning Reward Flash Celebration Modal */}
      <AnimatePresence>
        {showResultModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 z-[300] flex items-center justify-center p-6 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.82, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.82, y: 30 }}
              className="w-full max-w-xs bg-gradient-to-b from-red-600 to-red-800 rounded-3xl p-6 text-center text-white border-2 border-yellow-400 shadow-[0_12px_45px_rgba(220,38,38,0.4)] relative"
            >
              {/* Back out handle */}
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setShowResultModal(null)}
                  className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto text-4xl mb-3 shadow-inner">
                🧧
              </div>

              <p className="text-[10px] font-black uppercase tracking-widest text-[#fef08a]">
                转盘开奖啦
              </p>

              <h3 className="text-xl font-black text-white mt-1">
                恭喜获得现金福利！
              </h3>

              <div className="my-5 bg-white/10 rounded-2xl p-4.5 border border-white/10 shadow-inner">
                <span className="text-[10px] text-yellow-200 block font-bold">现金红包已派发至您的运动记录账户</span>
                <span className="text-3xl font-black text-yellow-300 block mt-1.5 font-mono">
                  {showResultModal.amount}
                </span>
              </div>

              <button
                onClick={() => setShowResultModal(null)}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-300 hover:to-amber-200 text-red-950 font-black rounded-xl text-xs tracking-wider shadow-md active:scale-95 transition-all"
              >
                收下奖金
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Activity Toast Notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-5 left-5 right-5 z-[350] bg-slate-900 border border-white/10 text-white px-4 py-3 rounded-2xl text-[11px] font-black shadow-2xl flex items-center gap-1.5 justify-center"
          >
            <span className="animate-bounce">💡</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
