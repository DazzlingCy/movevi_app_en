import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  LockKeyhole,
  RefreshCw,
  Shield,
  UserCog,
} from 'lucide-react';
import { AuthUser } from '../lib/auth';

interface SettingsPageProps {
  user: AuthUser | null;
  onBack: () => void;
  onSignOut: () => void;
}

type SettingsDialog = {
  title: string;
  body: string;
};

const APP_VERSION = '4.2.2';

const maskEmail = (email?: string) => {
  if (!email) return 'Not signed in';
  const [name, domain] = email.split('@');
  if (!domain) return email;
  const visibleName = name.length <= 2 ? name[0] : name.slice(0, 2);
  return `${visibleName}***@${domain}`;
};

export default function SettingsPage({ user, onBack, onSignOut }: SettingsPageProps) {
  const [dialog, setDialog] = useState<SettingsDialog | null>(null);
  const [updateMessage, setUpdateMessage] = useState('');

  const rows = [
    {
      icon: UserCog,
      label: 'Account',
      value: maskEmail(user?.email),
      onClick: () => setDialog({
        title: 'Account',
        body: `Signed in as ${user?.name || 'MOVEVI Runner'}. You can manage email, linked sign-in methods, and account security here.`,
      }),
    },
    {
      icon: Shield,
      label: 'Privacy Policy',
      onClick: () => setDialog({
        title: 'Privacy Policy',
        body: 'MOVEVI uses account, workout, and reward activity to save your progress and provide app features. Payment details are handled by Apple Pay, Google Pay, or the payment provider.',
      }),
    },
    {
      icon: LockKeyhole,
      label: 'Terms of Service',
      onClick: () => setDialog({
        title: 'Terms of Service',
        body: 'By using MOVEVI, you agree to follow the route, reward, subscription, and community rules shown in the app.',
      }),
    },
    {
      icon: Info,
      label: 'About MOVEVI',
      onClick: () => setDialog({
        title: 'About MOVEVI',
        body: 'MOVEVI turns indoor runs into global scenic routes, city progress, check-in rewards, and Premium route access.',
      }),
    },
    {
      icon: RefreshCw,
      label: 'Check for Updates',
      value: APP_VERSION,
      onClick: () => {
        setUpdateMessage('You are using the latest version.');
        window.setTimeout(() => setUpdateMessage(''), 2200);
      },
    },
  ];

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#070D1C] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(30,64,175,0.22),transparent_36%),linear-gradient(180deg,#172840_0%,#070D1C_30%,#050918_100%)]" />

      <header className="relative z-10 flex h-[96px] shrink-0 items-end justify-center border-b border-white/10 bg-[#172840]/90 px-5 pb-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="absolute bottom-4 left-5 flex h-11 w-11 items-center justify-center rounded-full text-white transition active:scale-95"
        >
          <ChevronLeft size={34} strokeWidth={3} />
        </button>
        <h1 className="text-xl font-black tracking-tight text-white">Settings</h1>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col px-5 pt-8">
        <div className="space-y-4">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <button
                key={row.label}
                type="button"
                onClick={row.onClick}
                className="flex h-[74px] w-full items-center justify-between gap-3 rounded-[22px] border border-white/[0.035] bg-[#18283E] px-5 text-left shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition hover:bg-[#1D304A] active:scale-[0.99]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.045] text-slate-300">
                    <Icon size={18} />
                  </span>
                  <span className="truncate text-base font-black text-white">{row.label}</span>
                </span>
                <span className="flex min-w-0 shrink-0 items-center gap-3 text-right">
                  {row.value && <span className="max-w-[150px] truncate text-base font-semibold text-slate-100/90">{row.value}</span>}
                  {row.label !== 'Check for Updates' && <ChevronRight size={30} strokeWidth={3} className="text-slate-300/90" />}
                </span>
              </button>
            );
          })}
        </div>

        {updateMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-center text-xs font-bold text-cyan-100"
          >
            {updateMessage}
          </motion.div>
        )}

        <div className="mt-auto pb-9 pt-8">
          <button
            type="button"
            onClick={onSignOut}
            className="h-[64px] w-full rounded-[20px] bg-[#2C4261] text-lg font-black text-white shadow-[0_14px_30px_rgba(0,0,0,0.22)] transition hover:bg-[#365173] active:scale-[0.99]"
          >
            Sign out
          </button>
        </div>
      </main>

      <AnimatePresence>
        {dialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-end bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setDialog(null)}
          >
            <motion.div
              initial={{ y: 32 }}
              animate={{ y: 0 }}
              exit={{ y: 32 }}
              className="w-full rounded-[26px] border border-white/10 bg-[#10192A] p-5 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 className="text-lg font-black text-white">{dialog.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{dialog.body}</p>
              <button
                type="button"
                onClick={() => setDialog(null)}
                className="mt-5 h-12 w-full rounded-2xl bg-cyan-400 text-sm font-black text-[#05070A]"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
