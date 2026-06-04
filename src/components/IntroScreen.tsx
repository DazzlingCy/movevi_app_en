import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ChevronRight, Check } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

const introSteps = [
  {
    id: 'step1',
    title: 'Run & Illuminate Earth',
    subtitle: 'THE STELLAR LEAP',
    text: 'In the year 3026, humanity has long migrated to other planets. On new paths and in new homes, we have built a massive interstellar network across the stars.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=90&w=1200&auto=format&fit=crop', // Earth / space
  },
  {
    id: 'step2',
    title: 'Echoes of Earth',
    subtitle: 'ECHOES OF EARTH',
    text: 'Traversing the cosmic deep, we miss our blue home planet more than ever. We long for Paris under morning fog, the warm desert wind before the Pyramids, and the sound of falling sycamore leaves along Nanjing\'s ancient city walls...',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=90&w=1200&auto=format&fit=crop', // City neon/nostalgia
  },
  {
    id: 'step3',
    title: 'Glowtrail Explorer',
    subtitle: 'GLOWTRAIL EXPLORER',
    text: 'You are no ordinary runner; you are a "Glowtrail Explorer" of the Earth Restoration Bureau. Your mission is to reconnect the Earth network and awaken cosmic memories with every single stride.',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=90&w=1200&auto=format&fit=crop', // Runner / dark
  }
];

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = introSteps[currentStep];

  const handleNext = () => {
    if (currentStep < introSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 z-[200] bg-[#05070A] overflow-hidden flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05070A]/80 to-[#05070A] z-10" />
            <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>
        
        {/* Top left decorative */}
        <div className="absolute top-8 left-6 z-20 flex items-center gap-2">
          <Sparkles className="text-cyan-400" size={18} />
        </div>
      </div>

      <div className="relative z-20 px-8 pb-12 pt-6 shrink-0 bg-[#05070A]">
        {/* Step indicators */}
        <div className="flex gap-2 mb-8 items-center">
          {introSteps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStep ? 'w-8 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'w-2 bg-slate-800'
              }`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 min-h-[140px]"
          >
            <div>
              <h2 className="text-xs font-mono text-cyan-500/80 tracking-widest mb-1">{step.subtitle}</h2>
              <h1 className="text-3xl font-bold text-slate-100 tracking-wide">{step.title}</h1>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {step.text}
            </p>
          </motion.div>
        </AnimatePresence>

        <button 
          onClick={handleNext}
          className="w-full mt-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-[#05070A] font-bold text-lg rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] flex items-center justify-center group"
        >
          {currentStep === introSteps.length - 1 ? (
            <>
              <span className="tracking-widest">Accept Mission</span>
              <Check className="ml-2" size={20} />
            </>
          ) : (
            <>
              <span className="tracking-widest">Next Step</span>
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
