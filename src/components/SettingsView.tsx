import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FileText,
  LogOut,
  MonitorSmartphone,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserRound
} from 'lucide-react';
import type { AuthUser } from './AuthView';

type SettingsViewProps = {
  user: AuthUser | null;
  onBack: () => void;
  onLogout: () => void;
};

function Toggle({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${
        checked ? 'bg-cyan-300' : 'bg-white/10'
      }`}
    >
      <span className={`h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </span>
  );
}

export default function SettingsView({ user, onBack, onLogout }: SettingsViewProps) {
  const [messagePush, setMessagePush] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);
  const [cacheCleared, setCacheCleared] = useState(false);

  const rows = [
    { icon: UserRound, title: "Account numbers and security", desc: user ? `Cell phone number${user.phone.slice(0, 3)}****${user.phone.slice(-4)}` : "Manage accounts after login", action: 'arrow' },
    { icon: MonitorSmartphone, title: "Runner equipment", desc: autoConnect ? "Default Autolink Recent Devices" : "Manually select connector", action: 'toggle-auto' },
    { icon: Bell, title: "Organisation", desc: messagePush ? "Active, red bag and route alarm activated" : "Notification closed", action: 'toggle-message' },
    { icon: ShieldCheck, title: "Privacy rights", desc: "Location, motor data and equipment authorizations", action: 'arrow' },
    { icon: FileText, title: "User protocols and privacy policy", desc: "View service terms and data descriptions", action: 'arrow' },
    { icon: CircleHelp, title: "Help and feedback", desc: "Common issues, client service and feedback", action: 'arrow' }
  ];

  return (
    <div className="h-full w-full overflow-y-auto bg-[#05070A] px-5 pb-10 pt-safeb text-slate-100 hide-scrollbar">
      <div className="sticky top-0 z-20 -mx-5 flex items-center justify-between border-b border-white/10 bg-[#05070A]/80 px-5 py-3 backdrop-blur-xl">
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 active:scale-95"
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-lg font-black">{"Settings"}</h1>
        <div className="h-11 w-11" />
      </div>

      <section className="mt-5 overflow-hidden rounded-[30px] border border-cyan-200/15 bg-[#09111b] p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
            <SlidersHorizontal size={28} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200/70">MOVE VI</p>
            <h2 className="mt-1 text-2xl font-black">{user ? "Account connected" : "Basic Settings"}</h2>
            <p className="mt-1 text-xs font-bold text-slate-500">{user ? user.memberId : "Synchronize account numbers and device information after login"}</p>
          </div>
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04]">
        {rows.map((row, index) => {
          const Icon = row.icon;
          return (
            <button
              key={row.title}
              type="button"
              onClick={() => {
                if (row.action === 'toggle-auto') setAutoConnect(prev => !prev);
                if (row.action === 'toggle-message') setMessagePush(prev => !prev);
              }}
              aria-pressed={row.action === 'toggle-auto' ? autoConnect : row.action === 'toggle-message' ? messagePush : undefined}
              className={`flex w-full items-center gap-4 p-4 text-left transition-colors active:bg-white/[0.07] ${
                index !== rows.length - 1 ? 'border-b border-white/7' : ''
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-cyan-100">
                <Icon size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black text-slate-100">{row.title}</span>
                <span className="mt-1 block truncate text-xs font-bold text-slate-500">{row.desc}</span>
              </span>
              {row.action === 'toggle-auto' && <Toggle checked={autoConnect} />}
              {row.action === 'toggle-message' && <Toggle checked={messagePush} />}
              {row.action === 'arrow' && <ChevronRight size={18} className="text-slate-600" />}
            </button>
          );
        })}
      </section>

      <button
        type="button"
        onClick={() => setCacheCleared(true)}
        className="mt-4 flex w-full items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-left active:scale-[0.99]"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-slate-300">
            <Trash2 size={18} />
          </span>
          <span>
            <span className="block text-sm font-black">{"Clear Cache"}</span>
            <span className="mt-1 block text-xs font-bold text-slate-500">{cacheCleared ? "Cleared 28.6MB cache" : "Release temporary pictures and activity caches"}</span>
          </span>
        </span>
        <ChevronRight size={18} className="text-slate-600" />
      </button>

      {user && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={onLogout}
          className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-full border border-rose-300/20 bg-rose-500/10 text-sm font-black text-rose-100"
        >
          <LogOut size={18} />
          {"Exit Login"}
        </motion.button>
      )}

      <p className="mt-8 text-center text-[11px] font-bold text-slate-700">{"MOVE VI v4.2.1 Frontend Presentation"}</p>
    </div>
  );
}
