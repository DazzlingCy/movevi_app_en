import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Play, Square, MapPin, ChevronLeft, Zap, Award } from 'lucide-react';
import { getRouteData, CITIES } from '../data/cities';

const MEDALS = [
  { id: 'm1', name: 'Maiden Voyage: Interstellar Start', color: 'from-amber-400 via-amber-200 to-yellow-600', text: '🏯' },
  { id: 'm2', name: 'River Wave: Ancient Awakening', color: 'from-emerald-400 via-teal-200 to-cyan-600', text: '⛩️' },
  { id: 'm3', name: 'Central Axis: Imperial Peak', color: 'from-rose-500 via-orange-300 to-red-700', text: '🏰' },
  { id: 'm4', name: 'Spark of Light: Energy Renewal', color: 'from-sky-400 via-indigo-200 to-purple-600', text: '🗼' },
  { id: 'm5', name: 'Beyond Gravity: Space Jump', color: 'from-fuchsia-500 via-pink-300 to-purple-700', text: '🛸' },
  { id: 'm6', name: 'Eternal Reflection: Mother Earth', color: 'from-cyan-400 via-blue-200 to-teal-600', text: '🌍' },
];

const getCityStoryText = (cityName: string, routeIndex: number) => {
  const stories: Record<string, string[]> = {
    'Beijing': [
      "Faint light passes over the snow-covered Hall of Supreme Harmony. The blue path from your run re-illuminates the ancient energy of the Forbidden City.",
      "This is the gentlest morning breeze by the Kunming Lake. The clean ripples become the pulse of the quantum engine, re-aligning the sleeping stellar orbits.",
      "Cybernetic neon sparks across the frozen Shichahai, locking the glowtrail engines into perfect alignment. The timeless scroll of history glows again."
    ],
    'Hangzhou': [
      "The Broken Bridge over West Lake sparkles with stellar ripples under gravitational waves, returning the resonance of the ancient Leifeng Pagoda to the mother star.",
      "As Qiantang River tides surge, digital lattices absorb your run energy spectrum, rekindling classic memories of the water town to reconnect with the blue sky.",
      "Wandering along the Su Causeway, your footsteps ignite the sleeping willow branches, completing a full holographic reset of this digital oasis."
    ],
    'Shanghai': [
      "The historical Bund skyline is woven into sparkling gold ribbons by your steps, as the gravity anchors of Lujiazui towers blast glorious colors into deep space.",
      "The vintage neon of the Huangpu River refracts in virtual windows, turning the breeze through shikumen alleys into a running resonance on the cosmic treadmill.",
      "As your glowtrail crosses Xujiahui, Shanghai's digital brain emits joyful echoes. From the deep stars, we feel the warmth of this glorious port once more."
    ],
    'Nanjing': [
      "The ancient stone bricks of the City Wall glisten in the sensors. Your runs under the shade of sycamore trees awaken the deep history of King Jinling's court.",
      "A soft breeze ripples across Xuanwu Lake. Your steps on the stone stairs activate ancient azure forces, sending waves of glowing light through the Qinhuai River.",
      "The Purple Mountain observatory locks onto your kinetic momentum. The sycamore leaves by Zhongshan Gate instantly grow into a beautiful digital canvas."
    ],
    'Xi\'an': [
      "The eternal lanterns atop the city walls ignite. Every tap on the ancient grey bricks channels sacred twilight glow back into the digital beacon tower.",
      "The quantum wind chimes hanging on the Giant Wild Goose Pagoda play elegant Tang Dynasty music which echoes across the void as the axis lights up.",
      "The holographic silk road channel is fully activated. The ruins of the Daming Palace are instantly reconstructed by nanotech auroras, reviving the immortal city."
    ],
    'Tokyo': [
      "Digital cherry blossoms drift above the Shibuya Crossing. Your rapid run sparks the majestic red Tokyo Tower, piercing the neon smog with columns of firewall light.",
      "The slate slopes of Kagurazaka glow with cyber-purple tides. Ancient shrines and modern alloy skyscrapers achieve absolute harmonic convergence.",
      "The current screen wall of Akihabara flashes colorful pulses to your heartbeat, as your feet press the ancient golden hues under virtual asphalt tracks."
    ],
    'Paris': [
      "A pale gold suspension bridge rises along the Seine. The Eiffel Tower transmitter streams romantic symphonies across the galaxy upon receiving your run energy.",
      "The brilliant verses of the Champs-Élysées are awakened by your steps. The Louvre's glass pyramid refracts glorious light, safeguarding the cultural core.",
      "The Arc de Triomphe awakens fully in the galaxy's tide. The Seine waters dance under quantum aurora, assembling the ultimate symphony of romantic arts."
    ],
    'London': [
      "The deep clock face of Big Ben emits a low-frequency resonance, announcing that London's foggy nights have successfully rejoined the galactic network.",
      "The Thames tide traces a sine wave across the screens with your steps, theatres play automated concertos, and the gravity lock of London Bridge is released.",
      "The heavy arms of Tower Bridge smoothly lift as the energy grid saturates. At this moment, the interstellar bay finally witnesses the sun that never sets."
    ],
    'New York': [
      "The skyscrapers of Manhattan shimmer with gorgeous holographic billboards. Cyber-ginkgoes in Central Park spread their golden leaves at your feet.",
      "Broadway's neon scrolls are fully awakened by your morning run. You pierce the steel-framed avenues like a beam of light, restarting the world-wide server hub.",
      "The gravity spire of the Empire State Building syncs with your pace, firing a bright crimson beam that illuminates the orbital tracks of the Western Hemisphere."
    ],
    'Sydney': [
      "The white sails of the Sydney Opera House glide gracefully under stellar glow, as deep blue particles in Darling Harbour splash waves of stardust.",
      "The Harbour Bridge receives fresh stellar energy through the aurora grid. The glowing Southern Cross points the way for global star-fleets."
    ],
    'Rio': [
      "The arms of the Christ the Redeemer statue emit cool blue rays, as passionate Samba rhythms transform into sparkling neon rings around your path.",
      "The fine white sand of Copacabana vibrates under your strides, turning into tiny golden fireflies that shimmer alongside Atlantic bioluminescent plankton."
    ],
    'Cairo': [
      "The Pyramids of Giza are surrounded by glowing aurora ribbons. These three-thousand-year-old structures align with our mother star at light-speed.",
      "Ancient energy buried beneath the Nile is detected. Hieroglyphs under the golden sands emerge in vibrant green pulse-like fluorescence."
    ]
  };

  const cityStories = stories[cityName] || [
    "Every drop of sweat is a heartfelt call to Mother Earth. While the stars remain silent, we hear her heart beat again in your stride.",
    "You are not just running; you are weaving gravitational threads to return to the blue star. Mother Earth's awakening is happening under your feet!"
  ];
  
  return cityStories[routeIndex % cityStories.length];
};

interface RunPlaybackViewProps {
  cityId: string;
  routeIndex: number;
  image: string;
  onExit: () => void;
  onComplete: (stats: { distance: number, duration: number, calories: number }) => void;
}

export default function RunPlaybackView({ cityId, routeIndex, image, onExit, onComplete }: RunPlaybackViewProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const city = CITIES.find(c => c.id === cityId || String(c.id) === String(cityId));
  const cityName = city?.name || 'Beijing';
  const routeData = getRouteData(cityId, routeIndex);
  const routeTitle = routeData?.title || 'West Lake Cruise';
  
  const todayDateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '/');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
        setDistance(prev => prev + 0.003); // Simulate running speed
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculatePace = () => {
    if (distance === 0) return '0.00';
    const paceInMinutes = (time / 60) / distance;
    const paceMinutes = Math.floor(paceInMinutes);
    const paceSeconds = Math.floor((paceInMinutes - paceMinutes) * 60);
    return `${paceMinutes}'${paceSeconds.toString().padStart(2, '0')}"`;
  };

  const handleStop = () => {
    setIsPlaying(false);
    setShowCompletion(true);
  };

  return (
    <div className="w-full h-full bg-black relative overflow-hidden font-sans text-white">
      {/* Background simulating video */}
      <motion.div 
        className="absolute inset-0 z-0 origin-center"
        animate={{
          scale: isPlaying ? [1, 1.1, 1] : 1,
          transition: { duration: 20, repeat: Infinity, ease: 'linear' }
        }}
      >
        <img src={image} alt="Route scenery" className="w-full h-full object-cover opacity-80" />
      </motion.div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 pt-safet px-4 py-6 z-10 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={onExit} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-medium">
          <MapPin size={14} className="text-[#2ecc71]" />
          <span>Route {routeIndex}</span>
        </div>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      {/* Center Running Stats */}
      <div className="absolute top-[35%] left-0 right-0 z-10 flex flex-col items-center">
        <div className="text-[90px] font-bold font-mono tracking-tighter leading-none drop-shadow-2xl">
          {distance.toFixed(2)}
        </div>
        <div className="text-sm font-bold tracking-widest text-slate-300 uppercase mt-2 drop-shadow-md bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
          DISTANCE (KM)
        </div>
      </div>

      {/* Bottom Stats & Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-safeb bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-32">
        <div className="px-8 pb-10 flex justify-between items-end">
           <div className="flex flex-col items-center">
             <span className="text-3xl font-bold font-mono drop-shadow-md">{formatTime(time)}</span>
             <span className="text-xs text-slate-400 mt-1 font-medium">TIME</span>
           </div>
           
           <div className="flex flex-col items-center">
             <span className="text-3xl font-bold font-mono drop-shadow-md">{calculatePace()}</span>
             <span className="text-xs text-slate-400 mt-1 font-medium">PACE</span>
           </div>
           
           <div className="flex flex-col items-center">
             <span className="text-3xl font-bold font-mono drop-shadow-md">{Math.floor(distance * 65)}</span>
             <span className="text-xs text-slate-400 mt-1 font-medium">CALORIES</span>
           </div>
        </div>

        <div className="flex justify-center items-center gap-8 pb-10">
          <button 
            className="w-16 h-16 rounded-full bg-slate-800/80 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-lg active:scale-95 transition-transform"
            onClick={handleStop}
          >
            <Square size={20} className="fill-current text-rose-500" />
          </button>
          
          <button 
            className="w-24 h-24 rounded-full bg-[#2ecc71] shadow-[0_0_30px_rgba(46,204,113,0.5)] flex items-center justify-center text-white active:scale-95 transition-transform"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={36} className="fill-current" /> : <Play size={36} className="fill-current ml-2" />}
          </button>

          <button className="w-16 h-16 rounded-full bg-slate-800/80 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-lg active:scale-95 transition-transform">
            <MapPin size={24} />
          </button>
        </div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletion && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 z-50 bg-[#05070a]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 overflow-y-auto"
           >
              {/* Route Awakened Header Title */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs uppercase tracking-[0.25em] font-mono text-cyan-400 font-bold">ROUTE AWAKENED</span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-[0.15em] drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] flex items-center justify-center gap-2">
                  <Zap size={22} className="text-cyan-400 fill-cyan-400/20" />
                  Route Awakened
                </h2>
              </motion.div>

              {/* Outer Ticket-shaped Card Container */}
              <motion.div 
                 initial={{ scale: 0.92, y: 15 }}
                 animate={{ scale: 1, y: 0 }}
                 className="w-full max-w-sm flex flex-col relative rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(38,177,128,0.15)] border border-[#a3dfcb]/10 mb-8"
              >
                  {/* UPPER SECTION: Mint mint green card */}
                  <div className="bg-gradient-to-br from-[#d4f7ed] to-[#c2f4e6] p-5 pb-6 flex flex-col">
                     {/* User Profile Row */}
                     <div className="flex items-center gap-3 mb-5">
                       {/* Cat Avatar with yellow sunglasses */}
                       <div className="w-11 h-11 rounded-full bg-[#122e26] border border-[#a2dfcb] flex items-center justify-center text-3xl shadow-md select-none overflow-hidden relative">
                         <span className="text-2xl filter drop-shadow">🐈‍⬛</span>
                         <span className="absolute text-[8px] top-5 left-2 rotate-12 bg-black text-yellow-400 font-bold px-0.5 rounded leading-none border border-yellow-400 font-sans">🕶️</span>
                       </div>
                       
                       <div className="flex flex-col text-left">
                         <span className="text-sm font-bold text-[#103027] tracking-wide select-text">Alpha Runner</span>
                         <span className="text-[9px] text-[#2c6e5a] tracking-wider uppercase font-mono font-bold">ALPHA RUNNER</span>
                       </div>
                     </div>

                     {/* Three Stats Cards Grid */}
                     <div className="w-full grid grid-cols-3 gap-2.5 mb-5">
                       {/* Stat 1: Distance */}
                       <div className="bg-white/80 border border-[#b2e8da] rounded-2xl p-2.5 text-center shadow-sm flex flex-col justify-center">
                         <div className="text-2xl font-black font-mono text-[#0b3329]" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.7)' }}>
                           {distance.toFixed(2)}
                         </div>
                         <div className="text-[9.5px] text-[#206956] font-bold mt-1 tracking-tight">
                           Distance (KM)
                         </div>
                       </div>
                       
                       {/* Stat 2: Duration */}
                       <div className="bg-white/80 border border-[#b2e8da] rounded-2xl p-2.5 text-center shadow-sm flex flex-col justify-center">
                         <div className="text-2xl font-black font-mono text-[#0b3329]" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.7)' }}>
                           {formatTime(time)}
                         </div>
                         <div className="text-[9.5px] text-[#206956] font-bold mt-1 tracking-tight">
                           Duration
                         </div>
                       </div>
                       
                       {/* Stat 3: Calories */}
                       <div className="bg-white/80 border border-[#b2e8da] rounded-2xl p-2.5 text-center shadow-sm flex flex-col justify-center">
                         <div className="text-2xl font-black font-mono text-[#0b3329]" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.7)' }}>
                           {Math.floor(distance * 65)}
                         </div>
                         <div className="text-[9.5px] text-[#206956] font-bold mt-1 tracking-tight">
                           Calories (kcal)
                         </div>
                       </div>
                     </div>

                     {/* Rewards Row */}
                     <div className="w-full flex items-center gap-2.5 bg-[#f4fcf9]/40 border border-[#b2e8da]/40 p-2 rounded-2xl backdrop-blur-sm shadow-sm">
                       <div className="bg-[#e4ffa1] text-[#2c3d00] font-extrabold text-[10px] tracking-wide px-2.5 py-1.5 rounded-xl uppercase transform -skew-x-6 shadow-sm border border-[#c5e66b] shrink-0 flex items-center gap-1">
                         <Award size={11} className="text-[#2c3d00] animate-pulse" />
                         <span>Earned Medals</span>
                       </div>
                       
                       <div className="flex-1 flex items-center gap-1.5 justify-start overflow-x-auto hide-scrollbar py-0.5">
                         {MEDALS.map((medal, i) => (
                           <div 
                             key={medal.id} 
                             className="relative shrink-0" 
                             title={medal.name}
                           >
                             <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${medal.color} p-[1.5px] shadow-sm flex items-center justify-center animate-pulse`} style={{ animationDelay: `${i * 120}ms` }}>
                               <div className="w-full h-full rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center text-sm shadow-inner">
                                 {medal.text}
                               </div>
                             </div>
                             {i === 0 && (
                               <div className="absolute inset-0 rounded-full border border-yellow-300 animate-ping opacity-55 pointer-events-none" />
                             )}
                           </div>
                         ))}
                       </div>
                     </div>
                  </div>

                  {/* DASHED SEPARATOR & PHYSICAL TICKET NOTCH DESIGN */}
                  <div className="relative h-px bg-transparent">
                     {/* Concave Notches Masking behind screen backdrop */}
                     <div className="absolute left-[-12px] top-[-12px] w-6 h-6 rounded-full bg-[#05070a] z-20 shadow-inner" />
                     <div className="absolute right-[-12px] top-[-12px] w-6 h-6 rounded-full bg-[#05070a] z-20 shadow-inner" />
                     {/* Alignment dashed dividing line */}
                     <div className="absolute left-4 right-4 top-[-1px] border-t-2 border-dashed border-[#a1dfcc] z-10 opacity-70" />
                  </div>

                  {/* LOWER SECTION: White minty tea paper sheet overlay */}
                  <div className="bg-[#f2fbf7] p-6 pt-8 flex text-left relative">
                     {/* Text details fully take lower container width */}
                     <div className="w-full text-left">
                       <h3 className="text-sm font-black text-[#103027] mb-1 tracking-tight select-text">
                         {cityName} Route {routeIndex}: {routeTitle}
                       </h3>
                       <div className="text-[10px] text-[#427365] font-mono tracking-wider font-extrabold mb-3">
                         {todayDateStr}
                       </div>
                       
                       {/* Unique Dynamic Lore Custom Text (在参考图的基础上加一句剧情文案) */}
                       <div className="border-l-2 border-[#80d0b8] pl-3 py-1">
                         <p className="text-[11px] text-[#1e5445] leading-relaxed italic font-medium select-text break-all">
                           {getCityStoryText(cityName, routeIndex)}
                         </p>
                       </div>
                     </div>
                  </div>
              </motion.div>

              {/* Action Buttons Row */}
              <div className="w-full max-w-sm flex items-center gap-4 px-1">
                 {/* Left Button of Screenshot: Red font button (结束训练) */}
                 <button 
                   onClick={() => onComplete({ distance, duration: time, calories: Math.floor(distance * 65) })}
                   className="flex-1 py-3.5 px-6 rounded-2xl bg-[#cb2027] hover:bg-[#b0161c] text-white text-base font-extrabold tracking-wide transition-all shadow-[0_4px_15px_rgba(203,32,39,0.3)] active:scale-95"
                 >
                   End Workout
                 </button>
                 
                 {/* Right Button of Screenshot: Teal/Green button (继续下一路线) */}
                 <button 
                   onClick={() => onComplete({ distance, duration: time, calories: Math.floor(distance * 65) })}
                   className="flex-1 py-3.5 px-6 rounded-2xl bg-[#26b180] hover:bg-[#1f936a] text-white text-base font-extrabold tracking-wide transition-all shadow-[0_4px_15px_rgba(38,177,128,0.3)] active:scale-95"
                 >
                   Next Route
                 </button>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
