import { Settings, ChevronRight, Mail, SquarePen, Medal, Map as MapIcon, MonitorSmartphone, Wallet, HeadphonesIcon, FileText, BookOpen, ClipboardList, Crown } from 'lucide-react';
import { motion } from 'motion/react';

interface UserStats {
  completedCities: number;
  completedRoutes: number;
  totalDistance: number;
  totalTimeHours: number;
}

interface ProfileTabProps {
  userStats: UserStats;
  isSubscribed: boolean;
  onOpenSubscription: () => void;
  onCancelSubscription: () => void;
}

export default function ProfileTab({ userStats, isSubscribed, onOpenSubscription, onCancelSubscription }: ProfileTabProps) {
  const stats = [
    { label: 'Cities Completed', value: userStats.completedCities.toString() },
    { label: 'Routes Completed', value: userStats.completedRoutes.toString() },
    { label: 'Distance', value: userStats.totalDistance.toFixed(1), unit: 'km' },
    { label: 'Active Time', value: userStats.totalTimeHours.toFixed(1), unit: 'h' },
  ];

  const menuItems = [
    { icon: ClipboardList, label: 'Workout Records' },
    { icon: MonitorSmartphone, label: 'My Devices' },
    { icon: Wallet, label: 'My Wallet' },
    { icon: HeadphonesIcon, label: 'Customer Support' },
    { icon: FileText, label: 'Feedback' },
    { icon: BookOpen, label: 'User Instructions' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-full h-full bg-[#05070A] overflow-y-auto pb-24 text-slate-100 font-sans hide-scrollbar">
      {/* Header Profile Info */}
      <div className="relative pt-12 pb-16 px-6 bg-gradient-to-b from-cyan-900/20 via-cyan-900/5 to-transparent">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none blur-3xl" />
        
        {/* Top bar with icons */}
        <div className="flex justify-end gap-5 mb-2 relative z-10">
          <button className="text-slate-300 hover:text-cyan-400 transition-colors">
            <Mail size={22} />
          </button>
          <button className="text-slate-300 hover:text-cyan-400 transition-colors">
            <SquarePen size={22} />
          </button>
        </div>

        <div className="flex flex-col items-start gap-4 relative z-10 border-b border-white/5 pb-8">
          <div className="flex items-center gap-4 w-full">
            <div className="w-20 h-20 rounded-full border-2 border-cyan-400/50 p-1 relative shadow-[0_0_20px_rgba(34,211,238,0.2)] bg-[#05070A] shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200" 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-xl font-bold text-slate-100 tracking-wide mb-2">Chenyuan</h1>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-amber-950 text-xs font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                  LV.3
                </span>
                <span className="text-amber-400 text-sm font-semibold tracking-widest drop-shadow-[0_0_5px_rgba(251,191,36,0.4)]">
                  Gold
                </span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="w-full flex items-center justify-between mt-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-2xl font-bold text-slate-100 font-mono tracking-wider relative">
                  {stat.value}
                  {stat.unit && <span className="text-sm text-slate-400 ml-0.5 relative -top-1">{stat.unit}</span>}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6 -mt-8 relative z-20">
        {/* Premium Banner Section */}
        {isSubscribed ? (
          <div className="bg-gradient-to-r from-emerald-950/40 to-emerald-900/30 border border-emerald-500/20 rounded-3xl p-5 relative overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="absolute right-[-10px] top-[-10px] opacity-10 pointer-events-none">
              <Crown size={110} className="text-emerald-400 rotate-12" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Crown size={20} className="fill-emerald-450 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-extrabold">Active Status</span>
                <h3 className="text-slate-100 font-extrabold text-base leading-tight mt-0.5">Premium Road Explorer</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Premium subscription active. Feel free to run subsequent city routes!
            </p>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
              <span className="text-[10px] text-emerald-500 font-bold font-mono">Auto-renews: July 4, 10:26 AM</span>
              <button 
                onClick={onCancelSubscription}
                className="text-slate-500 hover:text-red-400 text-xs font-semibold transition-colors bg-white/5 hover:bg-red-500/10 px-3 py-1.5 rounded-xl border border-white/5 hover:border-red-500/10"
              >
                Cancel Member
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 rounded-3xl p-5 relative overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="absolute right-[-10px] top-[-15px] opacity-10 pointer-events-none">
              <Crown size={120} className="text-amber-400 rotate-12" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Crown size={20} className="fill-amber-400 text-amber-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold">Premium Unlocked</span>
                <h3 className="text-slate-100 font-extrabold text-base leading-tight mt-0.5">Unlock All 36+ Scenic Routes</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              The first route of each city is free. Upgrade for <strong className="text-amber-400 font-extrabold font-mono">$4.99/mo</strong> to unlock subsequent routes and get double track light outputs.
            </p>
            <div className="mt-4 pt-2">
              <button 
                onClick={onOpenSubscription}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl tracking-wide shadow-[0_4px_15px_rgba(245,158,11,0.15)] flex items-center justify-center gap-1.5 transition-all"
              >
                <Crown size={14} className="fill-slate-950" />
                <span>Subscribe to Premium — $4.99/mo</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-4 relative overflow-hidden backdrop-blur-xl shadow-lg cursor-pointer"
          >
            <div className="absolute right-[-10px] top-[-10px] opacity-20 pointer-events-none">
              <Medal size={80} className="text-amber-500" />
            </div>
            <div className="text-amber-400 mb-1">
              <Medal size={28} className="drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            </div>
            <h3 className="text-slate-100 font-bold mb-1 mt-3">My Badges</h3>
            <p className="text-[10px] text-amber-200/60 break-words whitespace-pre-wrap">A full harvest of honors & achievements</p>
          </motion.div>

          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-2xl p-4 relative overflow-hidden backdrop-blur-xl shadow-lg cursor-pointer"
          >
            <div className="absolute right-[-10px] top-[-10px] opacity-20 pointer-events-none">
              <MapIcon size={80} className="text-cyan-500" />
            </div>
            <div className="text-cyan-400 mb-1">
              <MapIcon size={28} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            </div>
            <h3 className="text-slate-100 font-bold mb-1 mt-3">City Cards</h3>
            <p className="text-[10px] text-cyan-200/60 break-words whitespace-pre-wrap">Serendipitous stories across the town</p>
          </motion.div>
        </div>

        {/* Menu Items */}
        <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={idx}
                whileTap={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                className={`w-full flex items-center justify-between p-5 transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={20} className="text-slate-400" />
                  <span className="text-slate-200 font-medium tracking-wide text-sm">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-slate-600" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
