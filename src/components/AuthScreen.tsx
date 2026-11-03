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
  bindProviderEmailAndSignIn,
  requestEmailVerificationCode,
  signInWithProvider,
  verifyEmailCodeAndSignIn,
} from '../lib/auth';
import moveviLogo from '../assets/movevi-logo.png';

interface AuthScreenProps {
  onAuthenticated: (user: AuthUser) => void;
  onContinueAsGuest?: () => void;
}

type AuthScreenStep = 'choice' | 'email' | 'code' | 'provider' | 'bindEmail' | 'bindCode';

type FieldErrors = {
  email?: string;
  code?: string;
};

const emailPattern = /^\S+@\S+\.\S+$/;

export default function AuthScreen({ onAuthenticated, onContinueAsGuest }: AuthScreenProps) {
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
    if (step === 'bindEmail') return emailPattern.test(email.trim());
    if (step === 'code' || step === 'bindCode') return /^\d{6}$/.test(verificationCode.trim());
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
    if (step === 'bindCode') {
      setStep('bindEmail');
      setVerificationCode('');
      return;
    }
    if (step === 'bindEmail') {
      setStep('provider');
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
      const result = signInWithProvider(provider);
      if ('user' in result) {
        applyAuthResult(result);
        return;
      }

      setLoadingProvider(null);
      setEmail('');
      setVerificationCode('');
      setStep('bindEmail');
      setMessage('Link an email to keep your MOVEVI account secure.');
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
    if (step === 'email' && !acceptedTerms) {
      setError('Accept the Terms and Privacy Policy to continue.');
      return;
    }

    setLoadingProvider('email');
    window.setTimeout(() => {
      const result = requestEmailVerificationCode(cleanEmail);
      setLoadingProvider(null);
      if (result.ok) {
        setStep(step === 'bindEmail' ? 'bindCode' : 'code');
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
      if (step === 'bindCode' && selectedProvider) {
        applyAuthResult(bindProviderEmailAndSignIn(selectedProvider, email, verificationCode));
      } else {
        applyAuthResult(verifyEmailCodeAndSignIn(email, verificationCode));
      }
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
              <div className="mt-5 flex h-[86px] w-[86px] items-center justify-center overflow-hidden rounded-[26px] shadow-[0_18px_34px_rgba(255,90,64,0.18)]">
                <img src={moveviLogo} alt="MOVEVI" className="h-full w-full object-cover" />
              </div>

              <h1 className="mt-9 text-center text-[40px] font-black leading-[1.12] tracking-normal text-[#11170f]">
                MOVEVI
              </h1>
              <p className="mt-5 max-w-[300px] text-center text-[20px] font-black leading-[1.35] tracking-normal text-[#11170f]">
                Put the world on your treadmill.
              </p>

              <div className="mt-12 w-full space-y-3.5">
                <AuthChoiceButton
                  icon={loadingProvider === 'apple' ? <Loader2 size={22} className="animate-spin" /> : <Apple size={28} className="fill-current" />}
                  label="Continue with Apple"
                  disabled={isBusy}
                  onClick={() => openProviderFlow('apple')}
                />
                <AuthChoiceButton
                  icon={loadingProvider === 'google' ? <Loader2 size={22} className="animate-spin" /> : <Chrome size={26} />}
                  label="Continue with Google"
                  disabled={isBusy}
                  onClick={() => openProviderFlow('google')}
                />
                <AuthChoiceButton
                  icon={<Mail size={25} />}
                  label="Continue with Email"
                  disabled={isBusy}
                  onClick={openEmailFlow}
                />
                {onContinueAsGuest && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={onContinueAsGuest}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-[#11170f] bg-white text-[17px] font-black text-[#11170f] transition active:scale-[0.99] disabled:opacity-60"
                  >
                    Continue as guest <ArrowRight size={20} />
                  </button>
                )}
              </div>
              {onContinueAsGuest && (
                <p className="mt-4 max-w-[310px] text-center text-sm font-semibold leading-relaxed text-neutral-500">
                  Browse cities and routes now. Sign in when you are ready to run or save progress.
                </p>
              )}
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
              <div className={`h-1.5 rounded-full ${step === 'code' || step === 'bindCode' ? 'bg-[#11170f]' : 'bg-neutral-300'}`} />
            </div>

            {step === 'email' || step === 'bindEmail' ? (
              <form onSubmit={submitEmail} className="flex flex-1 flex-col">
                <h2 className={`${step === 'bindEmail' ? 'mb-6' : 'mb-14'} text-center text-[32px] font-black leading-[1.18] tracking-normal text-[#11170f]`}>
                  {step === 'bindEmail' ? 'Link your email' : 'Enter your email'}
                </h2>
                {step === 'bindEmail' && (
                  <p className="mb-12 text-center text-base font-semibold leading-[1.6] text-neutral-500">
                    Add an email so you can recover your account and receive important account updates.
                  </p>
                )}

                <label className="block">
                  <span className="mb-3 block text-[18px] font-bold leading-[1.3] text-[#11170f]">Email</span>
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
                    className={`h-16 w-full rounded-2xl border-2 bg-white px-5 text-xl font-semibold text-[#11170f] outline-none transition placeholder:text-neutral-300 ${
                      fieldErrors.email ? 'border-red-400' : 'border-[#11170f] focus:border-[#65d86d]'
                    }`}
                  />
                  {fieldErrors.email && <p className="mt-3 text-sm font-bold text-red-500">{fieldErrors.email}</p>}
                </label>

                {step === 'email' && (
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
                )}

                <AuthFeedback message={feedback} isError={Boolean(error)} />

                <button
                  type="submit"
                  disabled={isBusy || !canContinue}
                  className="mt-12 flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#11170f] text-xl font-black text-white transition active:scale-[0.99] disabled:bg-neutral-100 disabled:text-neutral-300"
                >
                  {loadingProvider === 'email' ? <Loader2 size={24} className="animate-spin" /> : null}
                  Continue
                  {loadingProvider !== 'email' && <ArrowRight size={24} />}
                </button>
              </form>
            ) : (
              <form onSubmit={submitCode} className="flex flex-1 flex-col">
                <h2 className="mb-5 text-center text-[32px] font-black leading-[1.18] tracking-normal text-[#11170f]">
                  {step === 'bindCode' ? 'Verify your email' : 'Enter your code'}
                </h2>
                <p className="mb-14 text-center text-base font-semibold leading-relaxed text-neutral-500">
                  We sent a 6-digit code to {email}.
                </p>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-bold leading-[1.3] text-[#11170f]">Code</span>
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
                    className={`h-16 w-full rounded-2xl border-2 bg-white px-5 text-center text-2xl font-black tracking-[0.22em] text-[#11170f] outline-none transition placeholder:text-neutral-300 ${
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
                  Resend code
                </button>

                <AuthFeedback message={feedback} isError={Boolean(error)} />

                <button
                  type="submit"
                  disabled={isBusy || !canContinue}
                  className="mt-12 flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#11170f] text-xl font-black text-white transition active:scale-[0.99] disabled:bg-neutral-100 disabled:text-neutral-300"
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
      className="grid h-14 w-full grid-cols-[46px_1fr_46px] items-center rounded-full bg-[#F3F3F3] px-4 text-[18px] font-black tracking-[-0.015em] text-[#11170f] transition hover:bg-[#ececec] active:scale-[0.99] disabled:opacity-60"
    >
      <span className="flex h-9 w-9 items-center justify-center justify-self-start">{icon}</span>
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
          <h1 className="mt-11 text-center text-[40px] font-black leading-[1.12] tracking-normal text-[#11170f]">
            MOVEVI
          </h1>
          <p className="mt-5 max-w-[320px] text-center text-[22px] font-black leading-[1.35] tracking-normal text-[#11170f]">
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
        className="absolute inset-x-0 bottom-0 rounded-t-[30px] bg-white px-6 pb-7 pt-7 shadow-[0_-16px_42px_rgba(0,0,0,0.16)]"
        initial={{ y: 120 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
      >
        <div className="mb-7 flex items-center justify-between">
          <h2 className="text-[22px] font-black leading-[1.25] tracking-normal text-black">Sign in with Apple</h2>
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f4f5] text-black transition active:scale-95"
            aria-label="Close Apple sign-in"
          >
            <X size={24} strokeWidth={2.4} />
          </button>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#11170f] text-[#65F06D] shadow-sm">
            <Orbit size={38} strokeWidth={3} />
          </div>
          <p className="pt-0.5 text-[16px] font-medium leading-[1.5] tracking-normal text-[#1f1f1f]">
            Use your Apple account to continue to MOVEVI. You may be asked to link an email after authorization.
          </p>
        </div>

        <div className="mt-7 flex h-16 items-center gap-3.5 rounded-3xl bg-[#f1f1f2] px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8d8db] text-[#1f1f1f]">
            <User size={23} strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-black text-black">Name</p>
            <p className="text-[15px] font-medium text-neutral-500">Mia Liu</p>
          </div>
        </div>

        <button
          type="button"
          disabled={isBusy}
          onClick={onContinue}
          className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-black text-[18px] font-black text-white transition active:scale-[0.99] disabled:bg-neutral-200 disabled:text-neutral-400"
        >
          {loadingProvider === 'apple' ? <Loader2 size={21} className="animate-spin" /> : null}
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
      <div className="mx-0 mt-12 flex flex-1 flex-col rounded-t-[32px] bg-white shadow-[0_-12px_34px_rgba(0,0,0,0.10)]">
        <div className="flex h-20 items-center justify-between px-6">
          <button
            type="button"
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#202124] shadow-[0_4px_18px_rgba(0,0,0,0.08)] transition active:scale-95"
            aria-label="Close Google sign-in"
          >
            <X size={24} strokeWidth={2.2} />
          </button>
          <p className="text-[18px] font-black tracking-normal text-[#202124]">accounts.google.com</p>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#202124] shadow-[0_4px_18px_rgba(0,0,0,0.08)]">
            <PanelTop size={24} strokeWidth={2.2} />
          </div>
        </div>

        <div className="flex h-20 items-center gap-4 border-b border-[#d4d4d4] px-6">
          <span className="flex h-9 w-9 items-center justify-center text-[36px] font-black leading-none tracking-[-0.08em]">
            <span className="text-[#4285f4]">G</span>
          </span>
          <p className="text-[18px] font-semibold text-[#3c4043]">Sign in with Google</p>
        </div>

        <div className="flex flex-1 flex-col px-7 pb-7 pt-12">
          <div className="mb-16">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#11170f] text-[#65F06D]">
              <Orbit size={48} strokeWidth={3} />
            </div>
            <h2 className="text-[42px] font-normal leading-[1.12] tracking-normal text-[#202124]">Sign in</h2>
            <p className="mt-6 text-[21px] font-normal leading-tight text-[#202124]">
              Continue to <span className="font-semibold text-[#1a73e8]">MOVEVI</span>
            </p>
          </div>

          <label className="block">
            <input
              placeholder="Email or phone"
              className="h-[68px] w-full rounded-none border-2 border-[#5f6368] bg-white px-4 text-[22px] font-normal text-[#202124] outline-none transition placeholder:text-[#5f6368] focus:border-[#1a73e8]"
            />
          </label>

          <button type="button" className="mt-6 self-start text-[19px] font-semibold text-[#1a73e8]">
            Forgot email?
          </button>

          <p className="mt-16 text-[17px] font-normal leading-relaxed text-[#3c4043]">
            Before using MOVEVI, review this app's <span className="font-semibold text-[#1a73e8]">Privacy Policy</span> and{' '}
            <span className="font-semibold text-[#1a73e8]">Terms of Service</span>.
          </p>

          <div className="mt-auto flex items-center justify-between pt-10">
            <button type="button" className="text-[19px] font-semibold text-[#1a73e8]">
              Create account
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={onContinue}
              className="flex h-[52px] min-w-[116px] items-center justify-center gap-2.5 rounded-full bg-[#0b57d0] px-7 text-[19px] font-semibold text-white transition active:scale-[0.99] disabled:bg-neutral-200 disabled:text-neutral-400"
            >
              {loadingProvider === 'google' ? <Loader2 size={20} className="animate-spin" /> : null}
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
