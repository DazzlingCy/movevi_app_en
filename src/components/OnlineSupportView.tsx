import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Bot, ChevronLeft, HeadphonesIcon, ImagePlus, Send, UserRound, X } from 'lucide-react';

type SupportMessage = {
  id: number;
  role: 'assistant' | 'user';
  content: string;
  time: string;
  image?: {
    dataUrl: string;
    name: string;
  };
};

type OnlineSupportViewProps = {
  onBack: () => void;
};

const QUICK_QUESTIONS = [
  "My treadmill won't connect.",
  "The screen won't turn on.",
  "The belt is slipping or making noise.",
  "I can't change the speed.",
  "The safety key warning won't clear.",
  "My route didn't update after my run.",
  "My reward hasn't arrived."
];

const getReply = (question: string) => {
  if (/screen|black|turn on|power/i.test(question)) {
    return "Check the power cord, outlet, and treadmill power switch. Make sure the safety key is attached, then unplug the treadmill for 30 seconds and restart it. If the screen still stays off, send a photo of the power switch and display.";
  }
  if (/belt|slip|noise|stuck|shift/i.test(question)) {
    return "Stop the treadmill and unplug it. Check the belt for debris, but do not adjust it while the treadmill is running. Send a photo of the belt position and a short description of the sound so we can help diagnose it.";
  }
  if (/speed|faster|slower|adjust/i.test(question)) {
    return "Make sure the safety key is attached and the treadmill is not paused. Try both the console controls and the speed control in MOVEVI. If neither responds, restart the treadmill and send a photo of the console.";
  }
  if (/safety key|emergency|warning/i.test(question)) {
    return "Remove the safety key, wipe the contact area, reattach it, and wait three seconds. If the warning remains, restart the treadmill. Do not start the belt until the warning clears.";
  }
  if (/treadmill|connect|bluetooth|device/i.test(question)) {
    return "Make sure the treadmill is on and Bluetooth is enabled. Return to Home, open My Devices, and try connecting again. If it still fails, restart the treadmill and your phone before retrying.";
  }
  if (/route|progress|city|update/i.test(question)) {
    return "Check that your distance met the route requirement and that your phone stayed online. Then reopen the city route page to refresh your progress.";
  }
  if (/reward|cash|wallet|arrive/i.test(question)) {
    return "Rewards can take a few minutes to appear. Check the activity in My Wallet first. If it is still missing after 10 minutes, send the route name and completion time.";
  }
  return "Thanks. To help us narrow this down, include the city or route name, when it happened, and what you see on your device.";
};

const formatTime = () => new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}).format(new Date());

export default function OnlineSupportView({ onBack }: OnlineSupportViewProps) {
  const [input, setInput] = useState('');
  const [pendingImage, setPendingImage] = useState<{ dataUrl: string; name: string } | null>(null);
  const [imageError, setImageError] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hi, I'm the MOVEVI support assistant. Describe what happened, or choose a common question below.",
      time: formatTime()
    }
  ]);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const replyTimerRef = useRef<number | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isReplying]);

  useEffect(() => () => {
    if (replyTimerRef.current !== null) window.clearTimeout(replyTimerRef.current);
  }, []);

  const sendMessage = (content: string) => {
    const question = content.trim();
    const image = pendingImage;
    if ((!question && !image) || isReplying) return;

    setMessages(previous => [
      ...previous,
      { id: Date.now(), role: 'user', content: question, image: image ?? undefined, time: formatTime() }
    ]);
    setInput('');
    setPendingImage(null);
    setImageError('');
    if (imageInputRef.current) imageInputRef.current.value = '';
    setIsReplying(true);

    replyTimerRef.current = window.setTimeout(() => {
      setMessages(previous => [
        ...previous,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: image && !question
            ? "Thanks for the photo. Tell me whether the treadmill powers on, whether you hear any unusual sound, and what the screen shows."
            : getReply(question),
          time: formatTime()
        }
      ]);
      setIsReplying(false);
      replyTimerRef.current = null;
    }, 650);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleImageChange = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError("Please select a photo file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Can't exceed 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      setPendingImage({ dataUrl: reader.result, name: file.name });
      setImageError('');
    };
    reader.onerror = () => setImageError("Picture reading failed, re-select");
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#05070a] text-slate-100">
      <header className="shrink-0 border-b border-white/10 bg-[#07111c]/95 px-4 pb-2 pt-safeb backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-slate-200 outline-none active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-200/60"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="text-center">
            <h1 className="text-base font-black text-white">MOVEVI Support</h1>
            <div className="mt-0.5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.65)]" />
              Support is online
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-100" aria-hidden="true">
            <HeadphonesIcon size={19} />
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 hide-scrollbar" aria-live="polite">
        <div className="mb-5 text-center text-[10px] font-bold text-slate-600">DEMO SUPPORT SESSION</div>
        <div className="space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex items-end gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-100">
                  <Bot size={17} />
                </div>
              )}
              <div className={`max-w-[78%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`overflow-hidden rounded-[20px] text-left text-sm font-bold leading-6 ${
                  message.role === 'user'
                    ? 'rounded-br-md bg-cyan-200 text-slate-950'
                    : 'rounded-bl-md border border-white/10 bg-[#0c1724] text-slate-200'
                }`}>
                  {message.image && (
                    <img
                      src={message.image.dataUrl}
                      alt={message.image.name}
                      className="max-h-64 w-full bg-slate-900 object-cover"
                    />
                  )}
                  {message.content && <p className="px-4 py-3">{message.content}</p>}
                </div>
                <span className="mt-1.5 inline-block px-1 font-mono text-[9px] text-slate-600">{message.time}</span>
              </div>
              {message.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-slate-400">
                  <UserRound size={16} />
                </div>
              )}
            </div>
          ))}

          {isReplying && (
            <div className="flex items-end gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-100">
                <Bot size={17} />
              </div>
              <div className="flex h-11 items-center gap-1.5 rounded-[20px] rounded-bl-md border border-white/10 bg-[#0c1724] px-4" aria-label="Client service is being entered.">
                {[0, 1, 2].map(index => (
                  <span key={index} className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-200/70 motion-reduce:animate-none" style={{ animationDelay: `${index * 120}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={scrollAnchorRef} />
        </div>
      </main>

      <section className="shrink-0 border-t border-white/10 bg-[#07111c]/96 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="mb-3 flex gap-2 overflow-x-auto hide-scrollbar" aria-label="Common problems">
          {QUICK_QUESTIONS.map(question => (
            <button
              key={question}
              type="button"
              disabled={isReplying}
              onClick={() => sendMessage(question)}
              className="shrink-0 rounded-full border border-cyan-200/16 bg-cyan-300/[0.06] px-3 py-2 text-[11px] font-black text-cyan-100 active:scale-95 disabled:opacity-45"
            >
              {question}
            </button>
          ))}
        </div>
        {pendingImage && (
          <div className="relative mb-3 w-24 overflow-hidden rounded-2xl border border-cyan-200/20 bg-slate-900 p-1">
            <img src={pendingImage.dataUrl} alt="To Send Photo Preview" className="h-20 w-full rounded-xl object-cover" />
            <button
              type="button"
              onClick={() => {
                setPendingImage(null);
                if (imageInputRef.current) imageInputRef.current.value = '';
              }}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white"
              aria-label="Remove to Send Picture"
            >
              <X size={14} />
            </button>
          </div>
        )}
        {imageError && <p className="mb-2 text-xs font-bold text-rose-300" role="alert">{imageError}</p>}
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={event => handleImageChange(event.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={isReplying}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-cyan-100 outline-none active:scale-95 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-cyan-200/60"
            aria-label="Select Picture"
          >
            <ImagePlus size={19} />
          </button>
          <label htmlFor="support-message" className="sr-only">{"Enter customer service message"}</label>
          <textarea
            id="support-message"
            value={input}
            rows={1}
            maxLength={300}
            onChange={event => setInput(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Please enter your question."
            className="max-h-24 min-h-11 flex-1 resize-none rounded-[20px] border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold leading-5 text-white outline-none placeholder:text-slate-600 focus:border-cyan-200/40"
          />
          <button
            type="submit"
            disabled={(!input.trim() && !pendingImage) || isReplying}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-200 text-slate-950 shadow-[0_8px_24px_rgba(34,211,238,0.18)] active:scale-95 disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none"
            aria-label="Send Message"
          >
            <Send size={18} />
          </button>
        </form>
      </section>
    </div>
  );
}
