import { useState } from 'react';
import { ChevronLeft, Info, Trophy, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface LeaderboardViewProps {
  onBack: () => void;
  currentLevel: number;
}

type LeaderboardUser = {
  id: number;
  name: string;
  avatar: string;
  level: number;
};

const avatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160&h=160',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=160&h=160',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=160&h=160',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160&h=160',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=160&h=160',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=160&h=160',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=160&h=160',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=160&h=160'
];

const leaderboardData: LeaderboardUser[] = [
    { id: 1, name: 'Aurora Miles', avatar: avatars[0], level: 186 },
    { id: 2, name: 'City Explorer', avatar: avatars[1], level: 174 },
    { id: 3, name: 'Starlight Runner', avatar: avatars[2], level: 168 },
    { id: 4, name: 'Night Strider', avatar: avatars[3], level: 151 },
    { id: 5, name: 'Clear Skies', avatar: avatars[4], level: 146 },
    { id: 6, name: 'Run the Earth', avatar: avatars[5], level: 139 },
    { id: 7, name: 'Atlas Pace', avatar: avatars[6], level: 128 },
    { id: 8, name: 'Beyond Limits', avatar: avatars[7], level: 116 },
    { id: 11, name: 'Cloud Walker', avatar: avatars[4], level: 172 },
    { id: 12, name: 'Daily Miles', avatar: avatars[2], level: 165 },
    { id: 13, name: 'Light Steps', avatar: avatars[6], level: 157 },
    { id: 14, name: 'City Pacers', avatar: avatars[0], level: 143 },
    { id: 15, name: 'Keep Moving', avatar: avatars[7], level: 132 },
    { id: 16, name: 'Morning Miles', avatar: avatars[1], level: 124 },
    { id: 17, name: 'Steady Pace', avatar: avatars[5], level: 118 },
    { id: 18, name: 'Trail Mix', avatar: avatars[3], level: 109 }
];
const ranking = [...leaderboardData].sort((a, b) => b.level - a.level);

export default function LeaderboardView({ onBack, currentLevel }: LeaderboardViewProps) {
  const [showRules, setShowRules] = useState(false);
  // Keep the global preview rank consistent with the world-page entry.
  const currentRank = 142;
  const podiumOrder = [ranking[1], ranking[0], ranking[2]];

  return (
    <main className="leaderboard-page" id="main-content">
      <header className="leaderboard-header">
        <button type="button" onClick={onBack} aria-label="Back to World"><ChevronLeft /></button>
        <div><h1>Global Leaderboard</h1></div>
        <button type="button" onClick={() => setShowRules(true)} aria-label="View leaderboard rules"><Info /><span>Rules</span></button>
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          className="leaderboard-ranking"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          aria-label="Global leaderboard"
        >
          <div className="leaderboard-podium">
            {podiumOrder.map((user, podiumIndex) => {
              const rank = podiumIndex === 0 ? 2 : podiumIndex === 1 ? 1 : 3;
              return (
                <article className={`leaderboard-podium__item leaderboard-podium__item--${rank}`} key={user.id}>
                  {rank === 1 && <Trophy className="leaderboard-podium__trophy" aria-hidden="true" />}
                  <div className="leaderboard-podium__avatar"><img src={user.avatar} alt="" /><b>{rank}</b></div>
                  <h3>{user.name}</h3>
                  <p><strong>LV.{user.level}</strong></p>
                  <i aria-hidden="true" />
                </article>
              );
            })}
          </div>

          <div className="leaderboard-list-heading"><span>Global Rank</span><span>World Level</span></div>
          <div className="leaderboard-list">
            {ranking.slice(3).map((user, index) => (
              <motion.article key={user.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.035 }}>
                <b>{String(index + 4).padStart(2, '0')}</b>
                <img src={user.avatar} alt="" />
                <div><strong>{user.name}</strong></div>
                <p><strong>LV.{user.level}</strong></p>
              </motion.article>
            ))}
          </div>
        </motion.section>
      </AnimatePresence>

      <aside className="leaderboard-current" aria-label={`Your rank is ${currentRank}, world level ${currentLevel}`}>
        <b>{currentRank}</b>
        <span className="leaderboard-current__avatar">You</span>
        <div><small>Your Rank</small><strong>You</strong></div>
        <p><strong>LV.{currentLevel}</strong><span>World Level</span></p>
      </aside>

      <AnimatePresence>
        {showRules && (
          <motion.div className="leaderboard-rules-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRules(false)}>
            <motion.section
              className="leaderboard-rules"
              role="dialog"
              aria-modal="true"
              aria-labelledby="leaderboard-rules-title"
              initial={{ y: 28, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 28, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              onClick={event => event.stopPropagation()}
            >
              <header><div><small>LEADERBOARD RULES</small><h2 id="leaderboard-rules-title">How rankings work</h2></div><button type="button" onClick={() => setShowRules(false)} aria-label="Close rules"><X /></button></header>
              <ol>
                <li><b>01</b><p><strong>Ranked by World Level</strong><span>Your World Level increases by one each time you complete a new country or region.</span></p></li>
                <li><b>02</b><p><strong>One global leaderboard</strong><span>All runners compete together, regardless of which treadmill they use.</span></p></li>
                <li><b>03</b><p><strong>Earlier finish wins ties</strong><span>When runners share the same level, the runner who reached it first ranks higher.</span></p></li>
              </ol>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
