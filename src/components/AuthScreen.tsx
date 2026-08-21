import { useMemo, useState } from 'react';
import type { FormEvent, MouseEvent, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  Apple,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Chrome,
  Loader2,
  Mail,
  Orbit,
  PanelTop,
  User,
  X,
} from 'lucide-react';
import {
  AuthProvider,
  AuthResult,
  AuthUser,
  requestEmailVerificationCode,
  signInWithProvider,
  verifyEmailCodeAndSignIn,
} from '../lib/auth';

interface AuthScreenProps {
  onAuthenticated: (user: AuthUser) => void;
}

type AuthScreenStep = 'choice' | 'email' | 'code' | 'provider';

type FieldErrors = {
  email?: string;
  code?: string;
};

const emailPattern = /^\S+@\S+\.\S+$/;

export default function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [step, setStep] = useState<AuthScreenStep>('choice');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Exclude<AuthProvider, 'email'> | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loadingProvider, setLoadingProvider] = useState<AuthProvider | 'email' | null>(null);

  const canContinue = useMemo(() => {
    if (step === 'email') return emailPattern.test(email.trim()) && acceptedTerms;
    if (step === 'code') return /^\d{6}$/.test(verificationCode.trim());
    return true;
  }, [acceptedTerms, email, step, verificationCode]);

  const clearFeedback = () => {
    setError('');
    setMessage('');
    setFieldErrors({});
  };

  const openEmailFlow = () => {
    clearFeedback();
    setStep('email');
    setVerificationCode('');
  };

  const openProviderFlow = (provider: Exclude<AuthProvider, 'email'>) => {
    clearFeedback();
    setSelectedProvider(provider);
    setStep('provider');
  };

  const goBack = () => {
    clearFeedback();
    if (step === 'code') {
      setStep('email');
      setVerificationCode('');
      return;
    }
    setSelectedProvider(null);
    setStep('choice');
  };

  const applyAuthResult = (result: AuthResult) => {
    if ('user' in result) {
      setMessage('Success. Opening MOVEVI...');
      window.setTimeout(() => {
        setLoadingProvider(null);
        onAuthenticated(result.user);
      }, 420);
    } else {
      setLoadingProvider(null);
      setError(result.message);
    }
  };

  const submitSocialAuth = (provider: Exclude<AuthProvider, 'email'>) => {
    clearFeedback();
    setLoadingProvider(provider);
    window.setTimeout(() => {
      applyAuthResult(signInWithProvider(provider));
    }, 420);
  };

  const submitEmail = (event?: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    clearFeedback();

    const cleanEmail = email.trim();
    if (!emailPattern.test(cleanEmail)) {
      setFieldErrors({ email: 'Enter a valid email address.' });
      return;
    }
    if (!acceptedTerms) {
      setError('Accept the Terms and Privacy Policy to continue.');
      return;
    }

    setLoadingProvider('email');
    window.setTimeout(() => {
      const result = requestEmailVerificationCode(cleanEmail);
      setLoadingProvider(null);
      if (result.ok) {
        setStep('code');
        setVerificationCode('');
        setMessage(`Code sent. Demo code: ${result.code}`);
      } else {
        setError(result.message);
      }
    }, 360);
  };

  const submitCode = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    clearFeedback();

    if (!/^\d{6}$/.test(verificationCode.trim())) {
      setFieldErrors({ code: 'Enter the 6-digit code.' });
      return;
    }

    setLoadingProvider('email');
    window.setTimeout(() => {
      applyAuthResult(verifyEmailCodeAndSignIn(email, verificationCode));
    }, 360);
  };

  const feedback = error || message;
  const isBusy = loadingProvider !== null;

  return (
    <motion.div
      className="absolute inset-0 z-[150] flex flex-col overflow-y-auto bg-white text-[#11170f] hide-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        {step === 'choice' ? (
          <motion.div
            key="choice"
            className="flex min-h-full flex-col px-7 pb-8 pt-14"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-1 flex-col items-center">
              <div className="mt-9 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#11170f] text-[#65F06D] shadow-[0_18px_34px_rgba(17,23,15,0.14)]">
                <Orbit size={46} strokeWidth={3} />
              </div>

              <h1 className="mt-11 text-center text-[46px] font-black leading-none tracking-[-0.055em] text-[#11170f]">
                MOVEVI
              </h1>
              <p className="mt-5 max-w-[320px] text-center text-[25px] font-black leading-[1.12] tracking-[-0.035em] text-[#11170f]">
                Put the world on your treadmill.
              </p>

              <div className="mt-16 w-full space-y-4">
                <AuthChoiceButton
                  icon={loadingProvider === 'apple' ? <Loader2 size={25} className="animate-spin" /> : <Apple size={34} className="fill-current" />}
                  label="Continue with Apple"
                  disabled={isBusy}
                  onClick={() => openProviderFlow('apple')}
                />
                <AuthChoiceButton
                  icon={loadingProvider === 'google' ? <Loader2 size={25} className="animate-spin" /> : <Chrome size={31} />}
                  label="Continue with Google"
                  disabled={isBusy}
                  onClick={() => openProviderFlow('google')}
                />
                <AuthChoiceButton
                  icon={<Mail size={30} />}
                  label="Continue with email"
                  disabled={isBusy}
                  onClick={openEmailFlow}
                />
              </div>
            </div>

            <p className="mx-auto mt-8 max-w-[330px] text-center text-sm font-semibold leading-relaxed text-neutral-500">
              By continuing to use MOVEVI, you agree to our <span className="underline">Terms of Service</span> and{' '}
              <span className="underline">Privacy Policy</span>.
            </p>
          </motion.div>
        ) : step === 'provider' && selectedProvider ? (
          selectedProvider === 'apple' ? (
            <AppleProviderMock
              isBusy={isBusy}
              loadingProvider={loadingProvider}
              onBack={goBack}
              onContinue={() => submitSocialAuth('apple')}
            />
          ) : (
            <GoogleProviderMock
              isBusy={isBusy}
              loadingProvider={loadingProvider}
              onBack={goBack}
              onContinue={() => submitSocialAuth('google')}
            />
          )
        ) : (
          <motion.div
            key={step}
            className="flex min-h-full flex-col px-7 pb-8 pt-14"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              onClick={goBack}
              className="mb-24 flex h-12 w-12 items-center justify-center rounded-full text-[#11170f] transition hover:bg-neutral-100"
              aria-label="Back"
            >
              <ArrowLeft size={34} strokeWidth={2.5} />
            </button>

            <div className="mb-24 grid grid-cols-2 gap-3">
              <div className="h-1.5 rounded-full bg-[#11170f]" />
              <div className={`h-1.5 rounded-full ${step === 'code' ? 'bg-[#11170f]' : 'bg-neutral-300'}`} />
            </div>

            {step === 'email' ? (
              <form onSubmit={submitEmail} className="flex flex-1 flex-col">
                <h2 className="mb-16 text-center text-[34px] font-black tracking-[-0.035em] text-[#11170f]">
                  Enter your email
                </h2>

                <label className="block">
                  <span className="mb-3 block text-[28px] font-medium leading-none text-[#11170f]">Email</span>
                  <input
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setFieldErrors((previous) => ({ ...previous, email: undefined }));
                      clearFeedback();
                    }}
                    placeholder="you@example.com"
                    inputMode="email"
                    autoComplete="email"
                    className={`h-[74px] w-full rounded-2xl border-[3px] bg-white px-5 text-2xl font-semibold text-[#11170f] outline-none transition placeholder:text-neutral-300 ${
                      fieldErrors.email ? 'border-red-400' : 'border-[#11170f] focus:border-[#65d86d]'
                    }`}
                  />
                  {fieldErrors.email && <p className="mt-3 text-sm font-bold text-red-500">{fieldErrors.email}</p>}
                </label>

                <label className="mt-7 flex items-start gap-3 text-sm font-semibold leading-relaxed text-neutral-500">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => {
                      setAcceptedTerms(event.target.checked);
                      setError('');
                    }}
                    className="mt-0.5 h-5 w-5 accent-[#65d86d]"
                  />
                  <span>
                    I agree to the <span className="underline">Terms of Service</span> and{' '}
                    <span className="underline">Privacy Policy</span>.
                  </span>
                </label>

                <AuthFeedback message={feedback} isError={Boolean(error)} />

                <button
                  type="submit"
                  disabled={isBusy || !canContinue}
                  className="mt-12 flex h-[74px] w-full items-center justify-center gap-3 rounded-full bg-[#11170f] text-2xl font-black text-white transition active:scale-[0.99] disabled:bg-neutral-100 disabled:text-neutral-300"
                >
                  {loadingProvider === 'email' ? <Loader2 size={24} className="animate-spin" /> : null}
                  Continue
                  {loadingProvider !== 'email' && <ArrowRight size={24} />}
                </button>
              </form>
            ) : (
              <form onSubmit={submitCode} className="flex flex-1 flex-col">
                <h2 className="mb-5 text-center text-[34px] font-black tracking-[-0.035em] text-[#11170f]">
                  Enter verification code
                </h2>
                <p className="mb-14 text-center text-base font-semibold leading-relaxed text-neutral-500">
                  We sent a 6-digit code to {email}.
                </p>

                <label className="block">
                  <span className="mb-3 block text-[28px] font-medium leading-none text-[#11170f]">Code</span>
                  <input
                    value={verificationCode}
                    onChange={(event) => {
                      setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6));
                      setFieldErrors((previous) => ({ ...previous, code: undefined }));
                      setError('');
                    }}
                    placeholder="000000"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className={`h-[74px] w-full rounded-2xl border-[3px] bg-white px-5 text-center text-3xl font-black tracking-[0.3em] text-[#11170f] outline-none transition placeholder:text-neutral-300 ${
                      fieldErrors.code ? 'border-red-400' : 'border-[#11170f] focus:border-[#65d86d]'
                    }`}
                  />
                  {fieldErrors.code && <p className="mt-3 text-sm font-bold text-red-500">{fieldErrors.code}</p>}
                </label>

                <button
                  type="button"
                  onClick={submitEmail}
                  disabled={isBusy}
                  className="mt-5 self-center text-sm font-black text-[#11170f] underline decoration-2 underline-offset-4 disabled:text-neutral-300"
                >
                  Send a new code
                </button>

                <AuthFeedback message={feedback} isError={Boolean(error)} />

                <button
                  type="submit"
                  disabled={isBusy || !canContinue}
                  className="mt-12 flex h-[74px] w-full items-center justify-center gap-3 rounded-full bg-[#11170f] text-2xl font-black text-white transition active:scale-[0.99] disabled:bg-neutral-100 disabled:text-neutral-300"
                >
                  {loadingProvider === 'email' ? <Loader2 size={24} className="animate-spin" /> : null}
                  Continue
                  {loadingProvider !== 'email' && <ArrowRight size={24} />}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface AuthChoiceButtonProps {
  icon: ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

function AuthChoiceButton({ icon, label, disabled, onClick }: AuthChoiceButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="grid h-16 w-full grid-cols-[52px_1fr_52px] items-center rounded-full bg-[#F3F3F3] px-5 text-[22px] font-black tracking-[-0.025em] text-[#11170f] transition hover:bg-[#ececec] active:scale-[0.99] disabled:opacity-60"
    >
      <span className="flex h-10 w-10 items-center justify-center justify-self-start">{icon}</span>
      <span className="min-w-0 text-center leading-none">{label}</span>
      <span aria-hidden="true" />
    </button>
  );
}

interface ProviderMockProps {
  isBusy: boolean;
  loadingProvider: AuthProvider | 'email' | null;
  onBack: () => void;
  onContinue: () => void;
}

function AppleProviderMock({ isBusy, loadingProvider, onBack, onContinue }: ProviderMockProps) {
  return (
    <motion.div
      key="apple-provider"
      className="relative min-h-full overflow-hidden bg-[#eeeeef] text-[#111111]"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.2 }}
    >
      <div className="pointer-events-none min-h-full px-7 pb-8 pt-14 opacity-40 blur-[1px]">
        <div className="flex flex-1 flex-col items-center">
          <div className="mt-9 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#11170f] text-[#65F06D]">
            <Orbit size={46} strokeWidth={3} />
          </div>
          <h1 className="mt-11 text-center text-[42px] font-black leading-none tracking-[-0.055em] text-[#11170f]">
            MOVEVI
          </h1>
          <p className="mt-5 max-w-[320px] text-center text-[25px] font-black leading-[1.12] tracking-[-0.035em] text-[#11170f]">
            Put the world on your treadmill.
          </p>
          <div className="mt-16 w-full space-y-4">
            <div className="h-16 rounded-full bg-[#f3f3f3]" />
            <div className="h-16 rounded-full bg-[#f3f3f3]" />
            <div className="h-16 rounded-full bg-[#f3f3f3]" />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-white/45" />

      <motion.div
        className="absolute inset-x-0 bottom-0 rounded-t-[34px] bg-white px-7 pb-8 pt-8 shadow-[0_-16px_42px_rgba(0,0,0,0.16)]"
        initial={{ y: 120 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-[26px] font-black tracking-[-0.035em] text-black">Sign in with Apple</h2>
          <button
            type="button"
            onClick={onBack}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f4f4f5] text-black transition active:scale-95"
            aria-label="Close Apple sign-in"
          >
            <X size={28} strokeWidth={2.4} />
          </button>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-[#11170f] text-[#65F06D] shadow-sm">
            <Orbit size={44} strokeWidth={3} />
          </div>
          <p className="pt-1 text-[18px] font-medium leading-snug tracking-[-0.02em] text-[#1f1f1f]">
            Use your Apple account <span className="whitespace-nowrap">(mia.privaterelay@icloud.com)</span> to create a MOVEVI account.
          </p>
        </div>

        <div className="mt-8 flex h-[74px] items-center gap-4 rounded-3xl bg-[#f1f1f2] px-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d8d8db] text-[#1f1f1f]">
            <User size={27} strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[20px] font-black text-black">Name</p>
            <p className="text-[18px] font-medium text-neutral-500">Mia Liu</p>
          </div>
        </div>

        <button
          type="button"
          disabled={isBusy}
          onClick={onContinue}
          className="mt-8 flex h-16 w-full items-center justify-center gap-3 rounded-full bg-black text-[21px] font-black text-white transition active:scale-[0.99] disabled:bg-neutral-200 disabled:text-neutral-400"
        >
          {loadingProvider === 'apple' ? <Loader2 size={23} className="animate-spin" /> : null}
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
}

function GoogleProviderMock({ isBusy, loadingProvider, onBack, onContinue }: ProviderMockProps) {
  return (
    <motion.div
      key="google-provider"
      className="flex min-h-full flex-col bg-[#f4f4f4] text-[#202124]"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mx-0 mt-12 flex flex-1 flex-col rounded-t-[34px] bg-white shadow-[0_-12px_34px_rgba(0,0,0,0.10)]">
        <div className="flex h-24 items-center justify-between px-8">
          <button
            type="button"
            onClick={onBack}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#202124] shadow-[0_4px_18px_rgba(0,0,0,0.08)] transition active:scale-95"
            aria-label="Close Google sign-in"
          >
            <X size={29} strokeWidth={2.2} />
          </button>
          <p className="text-[26px] font-black tracking-[-0.035em] text-[#202124]">accounts.google.com</p>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#202124] shadow-[0_4px_18px_rgba(0,0,0,0.08)]">
            <PanelTop size={29} strokeWidth={2.2} />
          </div>
        </div>

        <div className="flex h-24 items-center gap-5 border-b border-[#d4d4d4] px-8">
          <span className="flex h-11 w-11 items-center justify-center text-[44px] font-black leading-none tracking-[-0.08em]">
            <span className="text-[#4285f4]">G</span>
          </span>
          <p className="text-[22px] font-semibold text-[#3c4043]">Sign in with Google</p>
        </div>

        <div className="flex flex-1 flex-col px-8 pb-8 pt-16">
          <div className="mb-20">
            <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#11170f] text-[#65F06D]">
              <Orbit size={58} strokeWidth={3} />
            </div>
            <h2 className="text-[58px] font-normal leading-none tracking-[-0.055em] text-[#202124]">Sign in</h2>
            <p className="mt-8 text-[26px] font-normal leading-tight text-[#202124]">
              Continue to <span className="font-semibold text-[#1a73e8]">MOVEVI</span>
            </p>
          </div>

          <label className="block">
            <input
              placeholder="Email or phone"
              className="h-[82px] w-full rounded-none border-2 border-[#5f6368] bg-white px-5 text-[27px] font-normal text-[#202124] outline-none transition placeholder:text-[#5f6368] focus:border-[#1a73e8]"
            />
          </label>

          <button type="button" className="mt-8 self-start text-[23px] font-semibold text-[#1a73e8]">
            Forgot email?
          </button>

          <p className="mt-20 text-[21px] font-normal leading-relaxed text-[#3c4043]">
            Before using MOVEVI, review this app's <span className="font-semibold text-[#1a73e8]">Privacy Policy</span> and{' '}
            <span className="font-semibold text-[#1a73e8]">Terms of Service</span>.
          </p>

          <div className="mt-auto flex items-center justify-between pt-12">
            <button type="button" className="text-[23px] font-semibold text-[#1a73e8]">
              Create account
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={onContinue}
              className="flex h-16 min-w-[142px] items-center justify-center gap-3 rounded-full bg-[#0b57d0] px-8 text-[23px] font-semibold text-white transition active:scale-[0.99] disabled:bg-neutral-200 disabled:text-neutral-400"
            >
              {loadingProvider === 'google' ? <Loader2 size={23} className="animate-spin" /> : null}
              Next
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface AuthFeedbackProps {
  message: string;
  isError: boolean;
}

function AuthFeedback({ message, isError }: AuthFeedbackProps) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-6 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-bold ${
        isError ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {isError ? <AlertCircle size={17} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={17} className="mt-0.5 shrink-0" />}
      <span>{message}</span>
    </motion.div>
  );
}
