import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  CalendarCheck2,
  Check,
  ChevronLeft,
  CircleDollarSign,
  Dumbbell,
  Headphones,
  MessageCircleMore,
  Smartphone,
  Sparkles,
  UsersRound,
  Video
} from 'lucide-react';

export type PurchaseRefundMachineType = 'TS2' | 'TS2PRO' | 'TS3' | 'TS3PRO';
export type PurchaseRefundCampaignStatus =
  | 'unregistered'
  | 'registrationPending'
  | 'registrationRejected'
  | 'active'
  | 'expired'
  | 'completed'
  | 'refundPending'
  | 'refunded';

export interface PurchaseRefundRegistration {
  machineCode: string;
  machineType: PurchaseRefundMachineType;
  name: string;
  phone: string;
  submittedAt: number;
  approvedAt?: number;
  rejectionReason?: string;
}

export interface PurchaseRefundCheckIn {
  id: string;
  day: number;
  date: string;
  url: string;
  submittedAt: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: number;
  rejectionReason?: string;
}

export interface PurchaseRefundCampaignState {
  status: PurchaseRefundCampaignStatus;
  registration: PurchaseRefundRegistration | null;
  checkIns: PurchaseRefundCheckIn[];
  refundRequestedAt?: number;
  refundedAt?: number;
}

interface PurchaseRefundCampaignViewProps {
  campaign: PurchaseRefundCampaignState;
  onBack: () => void;
  onOpenSupport?: () => void;
  onSubmitRegistration: (registration: Omit<PurchaseRefundRegistration, 'submittedAt' | 'approvedAt' | 'rejectionReason'>) => { success: boolean; message: string };
  onReviewRegistration: (approved: boolean) => void;
  onSubmitCheckIn: (url: string) => { success: boolean; message: string };
  onReviewCheckIn: (id: string, approved: boolean) => void;
  onRequestRefund: () => void;
  onConfirmRefund: () => void;
  onDemoNearCompletion: () => void;
  onDemoExpire: () => void;
  onResetDemo: () => void;
}

const CONTENT_IDEAS = [
  "First time running for Io.",
  "20 minutes to go home from work.",
  "Walking while watching the city's route.",
  "Today is the seventh day.",
  "Let's move with our families.",
  "Change after 30 days of carding"
];

function PageHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060907]/94 backdrop-blur-xl">
      <div className="grid h-16 grid-cols-[44px_1fr_44px] items-center px-4">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.07] text-white outline-none transition active:scale-95 focus-visible:ring-2 focus-visible:ring-[#d8ff32]"
          aria-label="Back"
        >
          <ChevronLeft size={23} />
        </button>
        <h1 className="text-center text-lg font-black tracking-[-0.04em] text-white">{"Repurchase of the machine with a card"}</h1>
        <span />
      </div>
    </header>
  );
}

function PosterPanel({ number, title, icon, children }: { number: string; title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[22px] border-[3px] border-dotted border-[#151b12] bg-[#fffef0] p-4 text-[#151b12] shadow-[4px_5px_0_#151b12]">
      <div className="flex items-center justify-between gap-3 border-b-2 border-[#151b12] pb-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 min-w-8 items-center justify-center bg-[#151b12] px-2 font-mono text-[11px] font-black text-[#f8db27]">{number}</span>
          <h2 className="truncate text-base font-black tracking-[-0.03em]">{title}</h2>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#151b12] bg-[#d7ff32] text-[#151b12]">{icon}</span>
      </div>
      <div className="mt-4 text-[13px] font-medium leading-[1.75]">{children}</div>
    </section>
  );
}

function CampaignPoster() {
  const viteBaseUrl = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL || '/';
  const backgroundSrc = `${viteBaseUrl}purchase-refund-poster-bg.jpg`;

  return (
    <article className="relative overflow-hidden rounded-[26px] border-[3px] border-[#151b12] bg-[#efffac] text-[#151b12] shadow-[0_28px_70px_rgba(0,0,0,0.38)]">
      <img src={backgroundSrc} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-fill opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-[#efffac]/65" />
      <div className="relative px-4 pb-6 pt-5">
        <div className="flex items-center justify-between gap-3">
          <span className="bg-[#151b12] px-3 py-1.5 text-[10px] font-black tracking-[0.12em] text-white">MOVEVI</span>
          <span className="rounded-full border-2 border-[#151b12] bg-[#f8db27] px-3 py-1.5 text-[10px] font-black">{"10 places per month"}</span>
        </div>

        <header className="mt-7 rounded-[24px] border-2 border-[#151b12] bg-[#fffef0]/95 px-4 pb-6 pt-7 text-center shadow-[5px_6px_0_#8ddd27]">
          <div className="inline-flex -rotate-2 items-center gap-2 rounded-full border-2 border-[#151b12] bg-[#8ddd27] px-4 py-2 text-xs font-black shadow-[3px_3px_0_#151b12]">
            <Sparkles size={15} />{"Io-Wi's campaign."}
          </div>
          <p className="mt-5 text-[13px] font-black tracking-[0.06em]">{"Io, I'll put it to good use"}</p>
          <h2 className="mt-3 text-[34px] font-black leading-[1.02] tracking-[-0.075em] sm:text-[44px]">
            {"30 days of exercise cards."}
            <span className="mx-auto mt-3 block max-w-[300px] -rotate-1 bg-[#151b12] px-3 py-2.5 text-[#d7ff32] shadow-[5px_5px_0_#f8db27]">{"Repurchase cost"}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-sm text-[13px] font-bold leading-6">
            {"30 days of exercise cards to record real sports life within the prescribed time frame."}<br />
            {"Once the cards are completed, the purchase of the aircraft is returned in full."}
            <span className="mt-1 block text-[11px] font-semibold opacity-70">{"The maximum amount for the return purchase of aircraft is not more than $1,800."}</span>
          </p>
          <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 overflow-hidden border-2 border-[#151b12] bg-[#fffef0] shadow-[4px_4px_0_#8ddd27]">
            {[["30 days", "Target card."], ["60 days", "Completion cycle"], ["Up to $1,800.", "Refund of aircraft purchases"]].map(([value, label], index) => (
              <div key={label} className={`py-3 ${index > 0 ? 'border-l-2 border-[#151b12]' : ''}`}>
                <p className="font-mono text-lg font-black">{value}</p>
                <p className="mt-0.5 text-[9px] font-bold opacity-60">{label}</p>
              </div>
            ))}
          </div>
        </header>

        <div className="mt-7 space-y-5 rounded-[26px] border-2 border-[#151b12] bg-[#8ddd27] px-3 pb-6 pt-5 sm:px-5">
          <div className="mx-auto w-fit -rotate-1 bg-[#151b12] px-5 py-2.5 text-center text-base font-black text-[#f8db27] shadow-[3px_3px_0_#fffef0]">{"Activity strategy"}</div>

          <PosterPanel number="01" title="How do we get involved in the event?" icon={<CalendarCheck2 size={21} />}>
            <p className="mb-4 font-black">{"Only three steps, simple start."}</p>
            <ol className="space-y-3">
              {[
                ["Daily exercise", "Family members may also participate in the use of the Io-VI treadmill or walker.", Dumbbell],
                ["Make a real video.", "The daily exercise is recorded on mobile phones and shared with the shivering.", Video],
                ["30 days completed", "30 days from the first video, completed within 60 days.", CalendarCheck2]
              ].map(([title, description, Icon], index) => {
                const StepIcon = Icon as typeof Dumbbell;
                return (
                  <li key={String(title)} className="flex items-start gap-3 border-b border-dashed border-black/20 pb-3 last:border-0 last:pb-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#151b12] text-[#d7ff32]"><StepIcon size={16} /></span>
                    <div><p className="font-black">{index + 1}. {String(title)}</p><p className="mt-0.5 text-[11px] leading-5 opacity-65">{String(description)}</p></div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-4 flex items-center gap-3 bg-[#f8db27] p-3 font-black shadow-[3px_3px_0_#151b12]"><CircleDollarSign size={20} />{"Complete request for full return of purchase cost"}</div>
          </PosterPanel>

          <PosterPanel number="02" title="You can shoot anything." icon={<Smartphone size={21} />}>
            <p className="font-bold">{"You don't need a professional set, you don't need a complicated cut. You're the real one, you're the real one, you're the best."}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {CONTENT_IDEAS.map(item => <span key={item} className="border border-[#151b12]/30 bg-[#eefbcf] px-2 py-2 text-center text-[10px] font-bold">{item}</span>)}
            </div>
            <div className="mt-4 flex items-center justify-between border-t-2 border-[#151b12] pt-4">
              <span className="font-black">{"Suggested length of time"}</span>
              <strong className="bg-[#151b12] px-3 py-1 font-mono text-lg text-[#f8db27]">{"15-50 seconds"}</strong>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-bold">
              {["No complex editing required.", "No professional equipment required", "It's a free shot.", "Could provide editing assistance"].map(item => <li key={item} className="flex items-center gap-1.5"><Check size={13} strokeWidth={3} />{item}</li>)}
            </ul>
          </PosterPanel>

          <PosterPanel number="03" title="Who's in?" icon={<UsersRound size={21} />}>
            <p className="font-black">{"Users of the following Igua products have been purchased:"}</p>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {(['TS2', 'TS2PRO', 'TS3', 'TS3PRO'] as PurchaseRefundMachineType[]).map(model => <span key={model} className="flex h-9 items-center justify-center bg-[#151b12] font-mono text-[10px] font-black text-white">{model}</span>)}
            </div>
            <div className="mt-4 grid gap-2 text-[11px] font-bold">
              {["A person's life number is one. A fan number one.", "Account is in normal condition and there is no other ongoing business cooperation", "You don't need to be a net. You just have to record real sports."].map(item => <p key={item} className="flex items-start gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8ddd27]" />{item}</p>)}
            </div>
          </PosterPanel>

          <PosterPanel number="04" title="What can I get you?" icon={<Sparkles size={21} />}>
            <div className="space-y-3">
              {[
                ["Sports habits.", "A true and sustained sport."],
                ["Life record", "Thirty days of real sports history."],
                ["Refund of aircraft purchases", "Full return of purchase cost upon completion of activity requirements"]
              ].map(([title, description], index) => <div key={title} className={`flex items-center gap-3 border-2 border-[#151b12] p-3 ${index === 2 ? 'bg-[#f8db27]' : 'bg-white'}`}><span className="font-mono text-xl font-black">0{index + 1}</span><div><p className="font-black">{title}</p><p className="text-[10px] opacity-60">{description}</p></div></div>)}
            </div>
            <p className="mt-5 border-l-4 border-[#151b12] pl-3 text-sm font-black leading-6">{"You're in charge of sports, and Io is in charge of paying for your persistence."}</p>
          </PosterPanel>
        </div>

        <section className="mt-7 border-[3px] border-[#151b12] bg-[#f8db27] p-4 shadow-[5px_5px_0_#151b12]">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#151b12] text-[#d7ff32]"><Headphones size={22} /></span>
            <div className="min-w-0">
              <p className="text-base font-black">{"Activity counselling"}</p>
              <p className="mt-1 text-[11px] font-bold leading-5 opacity-70">{"Click on the next passenger service button, one-on-one registration, filming and return of the purchase of the aircraft."}</p>
            </div>
          </div>
        </section>

        <div className="mt-8 rounded-[20px] border-2 border-[#151b12] bg-[#fffef0]/95 px-4 py-5 text-center">
          <p className="text-xl font-black">{"30 days, hold on once."}</p>
          <p className="mt-1 text-sm font-bold">{"Let the movement really happen."}</p>
          <p className="mt-5 text-[10px] font-medium leading-5 opacity-60">{"The activity testing phase, which serves only 10 users per natural month, is extended to the next issue, with a great deal of understanding."}</p>
          <div className="mt-5 flex items-end justify-between border-t-2 border-[#151b12] pt-4 text-left"><div><p className="text-lg font-black">{"Io!"}</p><p className="text-[9px] font-bold tracking-[0.12em]">{"Put the world in a treadmill."}</p></div><span className="font-mono text-sm font-black">MOVEVI</span></div>
        </div>
      </div>
    </article>
  );
}

export default function PurchaseRefundCampaignView({ onBack, onOpenSupport }: PurchaseRefundCampaignViewProps) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-[#070a07] text-white [color-scheme:dark]">
      <PageHeader onBack={onBack} />
      <motion.main initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="mx-auto w-full max-w-xl px-3 pb-[calc(104px+env(safe-area-inset-bottom))] pt-3 sm:px-4">
        <CampaignPoster />
      </motion.main>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#070a07]/94 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="mx-auto max-w-xl">
          <button type="button" onClick={onOpenSupport} className="group flex h-14 w-full items-center justify-between rounded-2xl border-2 border-[#151b12] bg-[#d7ff32] px-4 text-[#151b12] shadow-[4px_4px_0_#f8db27] outline-none transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:ring-2 focus-visible:ring-white">
            <span className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#151b12] text-[#d7ff32]"><Headphones size={19} /></span><span className="text-left"><span className="block text-sm font-black">{"I'm gonna need to get a credit card back-purchaser."}</span><span className="block text-[10px] font-bold opacity-55">{"The online service is your answer."}</span></span></span>
            <span className="flex items-center gap-1 text-xs font-black"><MessageCircleMore size={17} /><ArrowRight size={17} /></span>
          </button>
        </div>
      </div>
    </div>
  );
}
