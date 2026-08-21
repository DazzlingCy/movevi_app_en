import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Camera, Check, Loader2, UserRound } from 'lucide-react';
import { motion } from 'motion/react';
import { AuthUser, updateAuthProfile } from '../lib/auth';

interface ProfileSetupScreenProps {
  user: AuthUser;
  onComplete: (user: AuthUser) => void;
}

const presetAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
];

export default function ProfileSetupScreen({ user, onComplete }: ProfileSetupScreenProps) {
  const [nickname, setNickname] = useState(user.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || presetAvatars[0]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canSubmit = useMemo(() => nickname.trim().length >= 2 && Boolean(avatarUrl), [avatarUrl, nickname]);

  const handleAvatarFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(String(reader.result || ''));
      setError('');
    };
    reader.onerror = () => setError('Could not load that image.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!canSubmit) {
      setError('Add a name and avatar to continue.');
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      const result = updateAuthProfile(user.id, {
        name: nickname,
        avatarUrl,
      });
      setIsSubmitting(false);
      if ('user' in result) {
        onComplete(result.user);
      } else {
        setError(result.message);
      }
    }, 320);
  };

  return (
    <motion.div
      className="absolute inset-0 z-[155] flex flex-col overflow-y-auto bg-[#05070A] px-7 pb-8 pt-10 text-slate-100 hide-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_88%_72%,rgba(250,204,21,0.10),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.045)_1px,transparent_1px)] bg-[size:58px_58px]" />
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 flex min-h-full flex-col">
        <p className="text-[11px] font-black uppercase tracking-[0.34em] text-cyan-300">Profile setup</p>
        <h1 className="mt-4 text-[38px] font-black leading-[1.05] tracking-[-0.04em] text-white">
          Set up your runner profile
        </h1>
        <p className="mt-4 text-base font-semibold leading-relaxed text-slate-400">
          Add a photo and name before entering MOVEVI.
        </p>

        <div className="mt-8 flex flex-col items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative h-32 w-32 rounded-full bg-gradient-to-br from-cyan-300 to-emerald-300 p-[3px] shadow-[0_0_34px_rgba(34,211,238,0.24)] active:scale-[0.98]"
            aria-label="Upload profile photo"
          >
            <span className="block h-full w-full overflow-hidden rounded-full bg-slate-950">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-slate-500">
                  <UserRound size={42} />
                </span>
              )}
            </span>
            <span className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-cyan-400 text-slate-950 shadow-lg">
              <Camera size={20} />
            </span>
          </button>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />

          <div className="mt-5 flex gap-3">
            {presetAvatars.map((src) => {
              const selected = avatarUrl === src;
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => {
                    setAvatarUrl(src);
                    setError('');
                  }}
                  className={`relative h-12 w-12 overflow-hidden rounded-full border-2 transition ${
                    selected ? 'border-cyan-300' : 'border-white/10 opacity-70'
                  }`}
                  aria-label="Choose preset avatar"
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  {selected && (
                    <span className="absolute inset-0 flex items-center justify-center bg-cyan-300/25 text-white">
                      <Check size={18} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <label className="mt-8 block">
          <span className="mb-3 block text-[11px] font-black uppercase tracking-[0.26em] text-slate-500">Name</span>
          <input
            value={nickname}
            onChange={(event) => {
              setNickname(event.target.value);
              setError('');
            }}
            placeholder="Mia Liu"
            maxLength={24}
            className="h-16 w-full rounded-2xl border border-white/10 bg-white/[0.055] px-5 text-xl font-black text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60 focus:bg-white/[0.08]"
          />
        </label>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="mt-auto flex h-16 w-full items-center justify-center gap-3 rounded-full bg-cyan-400 text-xl font-black text-slate-950 shadow-[0_18px_38px_rgba(34,211,238,0.22)] transition active:scale-[0.99] disabled:bg-white/10 disabled:text-slate-500 disabled:shadow-none"
        >
          {isSubmitting ? <Loader2 size={23} className="animate-spin" /> : null}
          Enter MOVEVI
        </button>
      </form>
    </motion.div>
  );
}
