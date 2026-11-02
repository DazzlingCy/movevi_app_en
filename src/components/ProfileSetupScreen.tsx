import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Camera, Check, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AuthUser, updateAuthProfile } from '../lib/auth';

interface ProfileSetupScreenProps {
  user: AuthUser;
  onComplete: (user: AuthUser) => void;
}

const avatarPalettePool = [
  { id: 'cyan', from: '#19D4FF', to: '#2FE7B5', glow: 'rgba(34,211,238,0.28)' },
  { id: 'gold', from: '#FDBA22', to: '#FF6B2C', glow: 'rgba(251,191,36,0.30)' },
  { id: 'violet', from: '#8B5CF6', to: '#EC4899', glow: 'rgba(168,85,247,0.28)' },
  { id: 'coral', from: '#FF4F74', to: '#FF8A3D', glow: 'rgba(248,113,113,0.28)' },
  { id: 'blue', from: '#38BDF8', to: '#6366F1', glow: 'rgba(96,165,250,0.28)' },
  { id: 'lime', from: '#84CC16', to: '#22C55E', glow: 'rgba(132,204,22,0.28)' },
  { id: 'rose', from: '#FB7185', to: '#A855F7', glow: 'rgba(244,114,182,0.28)' },
  { id: 'amber', from: '#F59E0B', to: '#EF4444', glow: 'rgba(245,158,11,0.28)' },
];

const getAvatarInitial = (name: string) => {
  const cleanName = name.trim();
  if (!cleanName) return '';
  return cleanName.charAt(0).toUpperCase();
};

const getRandomAvatarPalettes = () => (
  [...avatarPalettePool]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
);

const escapeSvgText = (value: string) => (
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
);

const createInitialAvatarUrl = (initial: string, palette: typeof avatarPalettePool[number]) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
      <defs>
        <linearGradient id="avatarGradient" x1="20" y1="12" x2="220" y2="228" gradientUnits="userSpaceOnUse">
          <stop stop-color="${palette.from}"/>
          <stop offset="1" stop-color="${palette.to}"/>
        </linearGradient>
        <radialGradient id="avatarGlow" cx="32%" cy="24%" r="70%">
          <stop stop-color="rgba(255,255,255,0.55)"/>
          <stop offset="0.46" stop-color="rgba(255,255,255,0.04)"/>
          <stop offset="1" stop-color="rgba(0,0,0,0.32)"/>
        </radialGradient>
      </defs>
      <rect width="240" height="240" rx="120" fill="url(#avatarGradient)"/>
      <rect width="240" height="240" rx="120" fill="url(#avatarGlow)"/>
      <text x="120" y="138" text-anchor="middle" dominant-baseline="middle" fill="#F8FAFC" font-family="Inter, Arial, sans-serif" font-size="106" font-weight="900" letter-spacing="-4">${escapeSvgText(initial)}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default function ProfileSetupScreen({ user, onComplete }: ProfileSetupScreenProps) {
  const [nickname, setNickname] = useState('');
  const randomAvatarPalettes = useMemo(() => getRandomAvatarPalettes(), []);
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState(0);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedPalette = randomAvatarPalettes[selectedPaletteIndex] || randomAvatarPalettes[0] || avatarPalettePool[0];
  const avatarInitial = getAvatarInitial(nickname);
  const canSubmit = useMemo(() => nickname.trim().length >= 2, [nickname]);

  const handleAvatarFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedAvatarUrl(String(reader.result || ''));
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
        avatarUrl: uploadedAvatarUrl || createInitialAvatarUrl(getAvatarInitial(nickname), selectedPalette),
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
        <h1 className="mt-5 max-w-[360px] text-[36px] font-black leading-[1.14] tracking-normal text-white">
          Set up your runner profile
        </h1>
        <p className="mt-5 max-w-[370px] text-base font-semibold leading-[1.65] text-slate-400">
          Add your name, choose a color, or upload a profile photo before entering MOVEVI.
        </p>

        <div className="mt-8 flex flex-col items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex h-32 w-32 items-center justify-center rounded-full p-[3px]"
            style={{
              background: `linear-gradient(135deg, ${selectedPalette.from}, ${selectedPalette.to})`,
              boxShadow: `0 0 34px ${selectedPalette.glow}`,
            }}
            aria-label="Upload profile photo"
          >
            <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-950 text-[58px] font-black tracking-[-0.08em] text-white shadow-[inset_-20px_-24px_38px_rgba(0,0,0,0.24),inset_12px_10px_24px_rgba(255,255,255,0.22)]">
              {uploadedAvatarUrl ? (
                <img src={uploadedAvatarUrl} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <span
                  className="flex h-full w-full items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at 34% 24%, rgba(255,255,255,0.34), transparent 34%), linear-gradient(135deg, ${selectedPalette.from}, ${selectedPalette.to})`,
                  }}
                >
                  {avatarInitial}
                </span>
              )}
            </span>
            <span className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-cyan-400 text-slate-950 shadow-lg">
              <Camera size={20} />
            </span>
          </button>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />

          <div className="mt-5 flex gap-3">
            {randomAvatarPalettes.map((palette, index) => {
              const selected = selectedPaletteIndex === index;
              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => {
                    setSelectedPaletteIndex(index);
                    setUploadedAvatarUrl('');
                    setError('');
                  }}
                  className={`relative h-12 w-12 overflow-hidden rounded-full border-2 transition active:scale-95 ${
                    selected ? 'border-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.30)]' : 'border-white/10 opacity-80'
                  }`}
                  aria-label={`Choose ${palette.id} avatar color`}
                >
                  <span
                    className="block h-full w-full"
                    style={{
                      background: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
                    }}
                  />
                  {selected && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/18 text-white">
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
            placeholder="Enter your name"
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
