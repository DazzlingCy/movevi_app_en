import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import {
  Camera,
  Check,
  ChevronLeft,
  Loader2,
  Ruler,
  User,
  CalendarDays,
  Weight,
} from 'lucide-react';
import { AuthUser, updateAuthProfile } from '../lib/auth';

interface EditProfilePageProps {
  user: AuthUser;
  onBack: () => void;
  onSave: (user: AuthUser) => void;
}

const presetAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
];

export default function EditProfilePage({ user, onBack, onSave }: EditProfilePageProps) {
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || presetAvatars[0]);
  const [name, setName] = useState(user.name || '');
  const [heightCm, setHeightCm] = useState(user.heightCm || '');
  const [birthday, setBirthday] = useState(user.birthday || '');
  const [weightKg, setWeightKg] = useState(user.weightKg || '');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Enter a name with at least 2 characters.');
      return;
    }

    setIsSaving(true);
    window.setTimeout(() => {
      const result = updateAuthProfile(user.id, {
        name,
        avatarUrl,
        heightCm,
        birthday,
        weightKg,
      });

      setIsSaving(false);
      if (result.ok) {
        onSave(result.user);
        return;
      }

      setError('message' in result ? result.message : 'Unable to save profile.');
    }, 450);
  };

  return (
    <div className="relative h-full w-full overflow-y-auto bg-[#05070A] text-slate-100 hide-scrollbar">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.22),transparent_58%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.035)_1px,transparent_1px)] bg-[size:54px_54px]" />
      </div>

      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-[#05070A]/90 px-4 py-4 backdrop-blur-2xl">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </button>
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">Profile</span>
          <h1 className="text-lg font-black leading-tight">Edit information</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 px-5 py-6 pb-10">
        <section className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl">
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-28 w-28 rounded-full bg-gradient-to-br from-cyan-300 to-emerald-300 p-[3px] shadow-[0_0_34px_rgba(34,211,238,0.22)] active:scale-[0.98]"
              aria-label="Upload avatar"
            >
              <span className="block h-full w-full overflow-hidden rounded-full bg-slate-950">
                <img src={avatarUrl} alt="Profile avatar" className="h-full w-full object-cover" />
              </span>
              <span className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-cyan-400 text-slate-950 shadow-lg">
                <Camera size={18} />
              </span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />

            <div className="mt-5 flex gap-3">
              {presetAvatars.map((src) => {
                const isSelected = avatarUrl === src;
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setAvatarUrl(src)}
                    className={`relative h-11 w-11 overflow-hidden rounded-full border-2 transition ${
                      isSelected ? 'border-cyan-300' : 'border-white/10 opacity-70'
                    }`}
                    aria-label="Choose preset avatar"
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center bg-cyan-300/25 text-white">
                        <Check size={15} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-5 space-y-4 rounded-[28px] border border-white/10 bg-white/[0.045] p-5">
          <label className="block">
            <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Name</span>
            <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 focus-within:border-cyan-300/60">
              <User size={18} className="text-slate-500" />
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-base font-black text-white outline-none placeholder:text-slate-600"
                placeholder="Mia Liu"
              />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Height</span>
              <div className="flex h-14 items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 focus-within:border-cyan-300/60">
                <Ruler size={17} className="text-slate-500" />
                <input
                  type="number"
                  min="80"
                  max="240"
                  value={heightCm}
                  onChange={(event) => setHeightCm(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-base font-black text-white outline-none placeholder:text-slate-600"
                  placeholder="170"
                />
                <span className="text-xs font-bold text-slate-500">cm</span>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Weight</span>
              <div className="flex h-14 items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 focus-within:border-cyan-300/60">
                <Weight size={17} className="text-slate-500" />
                <input
                  type="number"
                  min="25"
                  max="250"
                  value={weightKg}
                  onChange={(event) => setWeightKg(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-base font-black text-white outline-none placeholder:text-slate-600"
                  placeholder="60"
                />
                <span className="text-xs font-bold text-slate-500">kg</span>
              </div>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Birthday</span>
            <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 focus-within:border-cyan-300/60">
              <CalendarDays size={18} className="text-slate-500" />
              <input
                type="date"
                value={birthday}
                onChange={(event) => setBirthday(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-base font-black text-white outline-none [color-scheme:dark]"
              />
            </div>
          </label>

          {error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
              {error}
            </div>
          )}
        </section>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-6 flex h-16 w-full items-center justify-center gap-3 rounded-full bg-cyan-400 text-lg font-black text-slate-950 shadow-[0_18px_38px_rgba(34,211,238,0.22)] transition active:scale-[0.99] disabled:bg-white/10 disabled:text-slate-500 disabled:shadow-none"
        >
          {isSaving ? <Loader2 size={22} className="animate-spin" /> : <Check size={22} />}
          Save profile
        </button>
      </form>
    </div>
  );
}
