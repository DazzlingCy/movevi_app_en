import { motion } from 'motion/react';
import { Gift, Globe2, ChevronRight, Sparkles, MessageSquare, Calendar } from 'lucide-react';

interface EventsTabProps {
  onSelectMedley?: () => void;
}

export default function EventsTab({ onSelectMedley }: EventsTabProps) {
  return (
    <div className="w-full h-full bg-[#05070A] overflow-y-auto pb-24 text-slate-100 font-sans hide-scrollbar relative">
      <div className="sticky top-0 z-20 bg-black/40 backdrop-blur-md pt-safeb flex items-center justify-center p-3.5 border-b border-white/10">
        <h1 className="text-sm font-bold tracking-widest uppercase text-cyan-400">Popular Events</h1>
      </div>

      <div className="p-3.5 space-y-3.5">
        {/* Banner 0: Weekend City Memory Medley */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onSelectMedley}
          className="relative w-full h-[170px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group border border-emerald-500/30"
        >
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600&h=400" 
            alt="Weekend City Memory Medley" 
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-60" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-emerald-900/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent pointer-events-none" />
          
          <div className="absolute top-3 right-3 bg-emerald-500/30 backdrop-blur-md text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-full text-[#a1f2da] flex items-center gap-1 shadow-lg border border-emerald-500/50">
            <Calendar size={10} className="animate-pulse" />
            WEEKEND ONLY
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3.5">
            <div className="w-8 h-8 bg-emerald-500/20 backdrop-blur-md rounded-lg flex items-center justify-center mb-2 border border-emerald-500/30 shadow-inner">
               <Sparkles size={16} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <h2 className="text-base font-bold mb-0.5 tracking-wide text-emerald-100 flex items-center gap-2">
              <span>Weekend Memory Medley</span>
              <span className="text-[8px] bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold px-1.5 py-0.5 rounded-md uppercase font-mono tracking-normal leading-none scale-90 origin-left">3 of 10</span>
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-emerald-200/60 text-[11px] max-w-[65%] leading-relaxed line-clamp-2">
                Connect 3 classic city routes to unlock the jackpot lucky draw. Share with friends for bonus drawing chances!
              </p>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/25 border border-emerald-500/40 text-[#a2dfcb] text-[10px] font-semibold flex items-center gap-1.5 transition-colors shadow-lg active:scale-95 cursor-default"
                >
                  Discuss
                </button>
                <div className="w-7 h-7 rounded-full bg-emerald-500/10 backdrop-blur flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500/30 transition-colors">
                  <ChevronRight size={14} className="text-emerald-200" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Banner 1: Medal Blind Box Lucky Draw */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full h-[170px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group border border-amber-500/30"
        >
          <img 
            src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=600&h=400" 
            alt="Medal Lucky Draw" 
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-60" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-amber-900/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent pointer-events-none" />
          
          <div className="absolute top-3 right-3 bg-amber-500/20 backdrop-blur-sm text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full text-amber-200 flex items-center gap-1 shadow-lg border border-amber-500/50">
            <Sparkles size={10} className="animate-pulse" />
            ACTIVE
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3.5">
            <div className="w-8 h-8 bg-amber-500/20 backdrop-blur-md rounded-lg flex items-center justify-center mb-2 border border-amber-500/30 shadow-inner">
               <Gift size={16} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            </div>
            <h2 className="text-base font-bold mb-0.5 tracking-wide text-amber-100">Medal Blind Box Draw</h2>
            <div className="flex items-center justify-between">
              <p className="text-amber-200/60 text-[11px] max-w-[65%] line-clamp-2">Spend medals to unlock epic routes, claim customized trophies, and draw cash rewards!</p>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 text-[10px] font-semibold flex items-center gap-1.5 transition-colors shadow-lg active:scale-95 cursor-default"
                >
                  <MessageSquare size={11} />
                  Discuss
                </button>
                <div className="w-7 h-7 rounded-full bg-amber-500/10 backdrop-blur flex items-center justify-center border border-amber-500/30 group-hover:bg-amber-500/30 transition-colors">
                  <ChevronRight size={14} className="text-amber-200" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Banner 2: 100 Runners 100 Cities */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative w-full h-[200px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group border border-purple-500/30"
        >
          <img 
            src="https://images.unsplash.com/photo-1506501139174-099022df5260?auto=format&fit=crop&q=80&w=600&h=500" 
            alt="One Hundred Cities Project" 
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-60" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-purple-900/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent pointer-events-none" />
          
          <div className="absolute top-3 right-3 bg-purple-500/20 backdrop-blur-sm text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full text-purple-200 flex items-center gap-1 shadow-lg border border-purple-500/50">
            SEASON 1
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3.5">
            <div className="w-8 h-8 bg-purple-500/20 backdrop-blur-md rounded-lg flex items-center justify-center mb-2 border border-purple-500/30 shadow-inner">
               <Globe2 size={16} className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            </div>
            <h2 className="text-base font-bold mb-0.5 tracking-wide text-purple-100">100 Runs, 100 Cities</h2>
            <div className="flex items-center justify-between">
              <p className="text-purple-200/60 text-[11px] max-w-[65%] leading-relaxed line-clamp-2">Assemble runners worldwide to collectively unlock 100 iconic city tracks and split a million-dollar prize pool.</p>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="px-2.5 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/25 border border-purple-500/40 text-purple-200 text-[10px] font-semibold flex items-center gap-1.5 transition-colors shadow-lg active:scale-95 cursor-default"
                >
                  <MessageSquare size={11} />
                  Discuss
                </button>
                <div className="w-7 h-7 rounded-full bg-purple-500/10 backdrop-blur flex items-center justify-center border border-purple-500/30 group-hover:bg-purple-500/30 transition-colors">
                  <ChevronRight size={14} className="text-purple-200" />
                </div>
              </div>
            </div>

            <div className="w-full h-1 bg-white/5 mt-3 rounded-full overflow-hidden border border-white/5">
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: "13.68%" }} 
                 transition={{ duration: 1.5, delay: 0.5 }}
                 className="h-full bg-purple-400" 
               />
            </div>
            <p className="text-[9px] text-purple-300/50 font-mono mt-1 w-full text-right">Prize Pool 1368/10000</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

