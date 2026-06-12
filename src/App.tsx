import { useState, useEffect } from 'react';
import { Compass, Trophy, Map as MapIcon, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HomeTab from './components/HomeTab';
import EventsTab from './components/EventsTab';
import { CITIES } from './data/cities';
import CitiesTab from './components/CitiesTab';
import ProfileTab from './components/ProfileTab';
import CityRoutesView from './components/CityRoutesView';
import RouteDetailView from './components/RouteDetailView';
import RunPlaybackView from './components/RunPlaybackView';
import IntroScreen from './components/IntroScreen';
import LitRecordsView from './components/LitRecordsView';
import LeaderboardView from './components/LeaderboardView';
import WeekendMedleyView from './components/WeekendMedleyView';
import SubscriptionModal from './components/SubscriptionModal';
import MedalDrawView from './components/MedalDrawView';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showIntro, setShowIntro] = useState(true);
  const [fullScreenPage, setFullScreenPage] = useState<{type: 'cityRoutes' | 'routeDetail' | 'runPlayback' | 'litRecords' | 'leaderboard' | 'weekendMedley' | 'medalDraw', data?: any} | null>(null);

  // Overseas Subscription status
  const [isSubscribed, setIsSubscribed] = useState(() => {
    return localStorage.getItem('movevi_is_subscribed') === 'true';
  });
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handleSubscribeSuccess = () => {
    setIsSubscribed(true);
    localStorage.setItem('movevi_is_subscribed', 'true');
  };

  const handleCancelSubscription = () => {
    setIsSubscribed(false);
    localStorage.removeItem('movevi_is_subscribed');
  };

  // Weekend City Memory Medley Activity states
  const [medleySelectedRouteIds, setMedleySelectedRouteIds] = useState<string[]>([]);
  const [medleyCompletedRouteIds, setMedleyCompletedRouteIds] = useState<string[]>([]);
  const [medleyLotteryChances, setMedleyLotteryChances] = useState<number>(0);
  const [medleyDrawHistory, setMedleyDrawHistory] = useState<number[]>([]);
  const [medleyShareBonusClaimed, setMedleyShareBonusClaimed] = useState<boolean>(false);
  const [medleyActivityStarted, setMedleyActivityStarted] = useState<boolean>(false);
  const [litCityIds, setLitCityIds] = useState<string[]>(() => {
    // Always start fresh on load
    CITIES.forEach(c => {
      if (c.status !== 'upcoming') c.status = 'unlit';
      c.completed = 0;
      c.completedRouteIndices = [];
      c.completedRouteTimestamps = {};
      c.justLit = false;
    });
    return [];
  });

  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [targetFlight, setTargetFlight] = useState<{fromCityId: string, toCityId: string} | null>(null);
  const [pendingSelectionFrom, setPendingSelectionFrom] = useState<string | null>(null);
  const [showMedalPrompt, setShowMedalPrompt] = useState(false);
  const [hasGuidedToMedalDraw, setHasGuidedToMedalDraw] = useState(false);
  const [userStats, setUserStats] = useState({
    completedCities: 1,
    completedRoutes: 1,
    totalDistance: 2.5,
    totalTimeHours: 0.5,
    lightValue: 40
  });

  const tabs = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'events', label: 'Events', icon: Trophy },
    { id: 'cities', label: 'Cities', icon: MapIcon },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab 
          userStats={userStats}
          setUserStats={setUserStats}
          onNavigate={(type, data) => setFullScreenPage({ type: type as any, data })} 
          completedChapters={completedChapters} 
          targetFlight={targetFlight} 
          pendingSelectionFrom={pendingSelectionFrom}
          litCityIds={litCityIds}
          onCitySelected={(cityId) => {
            if (pendingSelectionFrom) {
              setTargetFlight({ fromCityId: pendingSelectionFrom, toCityId: cityId });
              setPendingSelectionFrom(null);
            } else {
              // Direct selection or first selection
              const city = CITIES.find(c => c.id === cityId);
              if (city) {
                CITIES.forEach(c => { if(c.status === 'in-progress') c.status = 'unlit'; });
                city.status = 'in-progress';
                setLitCityIds(prev => {
                  if (prev.includes(cityId)) return prev;
                  return [...prev, cityId];
                });
              }
            }
          }}
          onFlightComplete={() => {
          if (targetFlight) {
            const nextCity = CITIES.find(c => c.id === targetFlight.toCityId);
            if (nextCity && (nextCity.status === 'unlit' || nextCity.status === 'in-progress')) {
              nextCity.status = 'in-progress';
              setLitCityIds(prev => {
                if (prev.includes(nextCity.id)) return prev;
                return [...prev, nextCity.id];
              });
            }
          }
          setTargetFlight(null);
        }} />;
      case 'events':
        return (
          <EventsTab 
            onSelectMedley={() => setFullScreenPage({ type: 'weekendMedley' })} 
            onSelectMedalDraw={() => setFullScreenPage({ type: 'medalDraw' })}
          />
        );
      case 'cities':
        return <CitiesTab onCityClick={(city) => setFullScreenPage({ type: 'cityRoutes', data: city })} />;
      case 'profile':
        return (
          <ProfileTab 
            userStats={userStats} 
            isSubscribed={isSubscribed}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
            onCancelSubscription={handleCancelSubscription}
          />
        );
      default:
        return <HomeTab userStats={userStats} setUserStats={setUserStats} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-[#05070A] text-slate-100 overflow-hidden relative font-sans shadow-2xl sm:h-[800px] sm:mt-10 sm:rounded-[40px] sm:border-[8px] sm:border-slate-800">
      <AnimatePresence>
        {showIntro && (
          <IntroScreen 
            onComplete={() => {
              setShowIntro(false);
            }} 
          />
        )}
      </AnimatePresence>
      <main className="flex-1 relative overflow-hidden bg-[#05070A]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="px-6 py-3 shrink-0 bg-black/80 backdrop-blur-2xl border-t border-white/10 pb-3 sm:pb-3 z-50">
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-white'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : ''} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Full Screen Pages overlays on top of everything including bottom nav */}
      <AnimatePresence>
        {fullScreenPage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 z-[100] bg-[#05070A]"
          >
            {fullScreenPage.type === 'cityRoutes' && (
                <CityRoutesView 
                  city={fullScreenPage.data} 
                  onBack={() => setFullScreenPage(null)} 
                  onRouteClick={(routeIndex) => setFullScreenPage({ 
                    type: 'routeDetail', 
                    data: { cityId: fullScreenPage.data.id, routeIndex, image: fullScreenPage.data.image, previousCityData: fullScreenPage.data } 
                  })} 
                  onExploreNext={(currentCityId) => {
                    setPendingSelectionFrom(currentCityId);
                    setFullScreenPage(null);
                    setActiveTab('home');
                  }}
                  isSubscribed={isSubscribed}
                  onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
                />
            )}
            {fullScreenPage.type === 'routeDetail' && (
                <RouteDetailView 
                  {...fullScreenPage.data}
                  onBack={() => {
                    if (fullScreenPage.data.isActivityRoute) {
                      setFullScreenPage({ type: 'weekendMedley' });
                    } else {
                      setFullScreenPage({ type: 'cityRoutes', data: fullScreenPage.data.previousCityData });
                    }
                  }}
                  onStart={() => setFullScreenPage({ type: 'runPlayback', data: fullScreenPage.data })}
                  isSubscribed={isSubscribed}
                  onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
                />
            )}
            {fullScreenPage.type === 'runPlayback' && (
               <RunPlaybackView 
                 {...fullScreenPage.data}
                 onExit={() => setFullScreenPage({ type: 'routeDetail', data: fullScreenPage.data })}
                 onComplete={(stats) => {
                   // Update user stats
                   setUserStats(prev => ({
                     ...prev,
                     totalDistance: prev.totalDistance + stats.distance,
                     totalTimeHours: prev.totalTimeHours + (stats.duration / 3600),
                     lightValue: (prev.lightValue || 0) + (stats.calories || Math.floor(stats.distance * 65))
                   }));

                   if (fullScreenPage.data.isActivityRoute) {
                      const activityKey = `${fullScreenPage.data.cityId}-${fullScreenPage.data.routeIndex}`;
                      setMedleyCompletedRouteIds(prevCompleted => {
                        if (prevCompleted.includes(activityKey)) return prevCompleted;
                        const nextCompleted = [...prevCompleted, activityKey];
                        if (nextCompleted.length === 3) {
                          setMedleyLotteryChances(prevChances => prevChances + 1);
                        }
                        return nextCompleted;
                      });
                      setFullScreenPage({ type: 'weekendMedley' });
                      return;
                    }

                    const { previousCityData, routeIndex } = fullScreenPage.data;
                   const realCityData = CITIES.find(c => c.id === previousCityData.id) || previousCityData;
                   const currentCompleted = realCityData.completedRouteIndices || [];
                   
                   let isNewlyCompleted = false;
                   if (!currentCompleted.includes(routeIndex)) {
                     realCityData.completedRouteIndices = [...currentCompleted, routeIndex];
                     if (!realCityData.completedRouteTimestamps) {
                       realCityData.completedRouteTimestamps = {};
                     }
                     realCityData.completedRouteTimestamps[routeIndex] = Date.now();
                     realCityData.completed = Math.min(realCityData.completedRouteIndices.length, realCityData.routes);
                     
                     // If this is a newly completed route, increment completedRoutes counter
                     setUserStats(prev => ({ ...prev, completedRoutes: prev.completedRoutes + 1 }));
                     isNewlyCompleted = true;
                   }
                   
                   if (realCityData.completed === realCityData.routes && realCityData.status !== 'lit') {
                     realCityData.status = 'lit';
                     realCityData.justLit = true;
                     // Increment completed cities counter
                     setUserStats(prev => ({ ...prev, completedCities: prev.completedCities + 1 }));
                   }

                   setCompletedChapters(prev => {
                     const newChapters = [...prev];
                     // Chapter 1: Complete 1 route
                     if (!newChapters.includes(1)) newChapters.push(1);
                     // Chapter 2: Complete 1 city
                     if (realCityData.status === 'lit' && !newChapters.includes(2)) {
                       newChapters.push(2);
                     }
                     
                     const litCount = CITIES.filter(c => c.status === 'lit').length;
                     if (litCount >= 3) {
                       if (!newChapters.includes(3)) newChapters.push(3);
                     }
                     if (litCount >= CITIES.length) {
                       if (!newChapters.includes(4)) newChapters.push(4);
                     }
                     
                     return newChapters;
                   });

                   // Navigate back to cityRoutes with the updated data
                   setFullScreenPage({ type: 'cityRoutes', data: realCityData });

                   // 如果未订阅会员，首次完成路线后开启大转盘抽奖引导弹窗
                   if (isNewlyCompleted && !isSubscribed && !hasGuidedToMedalDraw) {
                     setShowMedalPrompt(true);
                     setHasGuidedToMedalDraw(true);
                   }
                 }}
               />
            )}
            {fullScreenPage.type === 'litRecords' && (
              <LitRecordsView onBack={() => setFullScreenPage(null)} />
            )}
            {fullScreenPage.type === 'leaderboard' && (
              <LeaderboardView onBack={() => setFullScreenPage(null)} />
            )}
            {fullScreenPage.type === 'weekendMedley' && (
               <WeekendMedleyView 
                 onBack={() => setFullScreenPage(null)}
                 selectedRouteIds={medleySelectedRouteIds}
                 completedRouteIds={medleyCompletedRouteIds}
                 lotteryChances={medleyLotteryChances}
                 drawHistory={medleyDrawHistory}
                 shareBonusClaimed={medleyShareBonusClaimed}
                 activityStarted={medleyActivityStarted}
                 onUpdateState={(state) => {
                   if (state.selectedRouteIds !== undefined) setMedleySelectedRouteIds(state.selectedRouteIds);
                   if (state.completedRouteIds !== undefined) setMedleyCompletedRouteIds(state.completedRouteIds);
                   if (state.lotteryChances !== undefined) setMedleyLotteryChances(state.lotteryChances);
                   if (state.drawHistory !== undefined) setMedleyDrawHistory(state.drawHistory);
                   if (state.shareBonusClaimed !== undefined) setMedleyShareBonusClaimed(state.shareBonusClaimed);
                   if (state.activityStarted !== undefined) setMedleyActivityStarted(state.activityStarted);
                 }}
                 onNavigateToRouteDetail={(cityId, routeIndex, image) => {
                   setFullScreenPage({
                     type: 'routeDetail',
                     data: {
                       cityId,
                       routeIndex,
                       image,
                       isActivityRoute: true
                     }
                   });
                 }}
               />
            )}
            {fullScreenPage.type === 'medalDraw' && (
              <MedalDrawView 
                onBack={() => setFullScreenPage(null)}
                onGoToRunning={() => {
                  setFullScreenPage(null);
                  setActiveTab('cities');
                }}
                userStats={userStats}
                setUserStats={setUserStats}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overseas Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSubscribeSuccess={handleSubscribeSuccess}
      />

      {/* 首次完成路线且未订阅会员 引导提示弹窗 */}
      <AnimatePresence>
        {showMedalPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 z-[150] flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-xs bg-[#fffcf2] rounded-3xl p-6 text-slate-800 shadow-2xl relative border border-orange-200"
            >
              {/* Top Banner Accent */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-4 border-[#fffcf2] text-3xl">
                🎁
              </div>

              <div className="text-center mt-8">
                <span className="text-[10px] bg-red-100 text-red-600 font-black px-2 py-0.5 rounded-full uppercase tracking-widest font-sans inline-block">
                  星光奖励发放
                </span>
                <h3 className="text-base font-black text-slate-950 mt-2 leading-tight">
                  恭喜完成首次路线！
                </h3>
                <p className="text-xs text-slate-650 mt-2 font-medium leading-relaxed">
                  您获得了一条路线的专属励勋！已为您发放 <strong className="text-orange-600 font-extrabold text-sm">3 枚路线勋章</strong>！可在木卫六勋章大转盘中兑换 <strong className="text-orange-600 font-extrabold text-sm">3 次抽奖机会</strong>，100% 抽取现金红包！
                </p>

                {/* Subtitle explaining unsubscribed status perk */}
                <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200/20 text-left">
                  <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                    💡 <span className="font-bold">特权提示</span>：每次完成路线都可参与大转盘抽奖！
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setShowMedalPrompt(false);
                    setFullScreenPage({ type: 'medalDraw' });
                  }}
                  className="w-full py-3 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-650 text-white font-black rounded-xl text-xs tracking-wider shadow-lg active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>立即去抽奖 🧧</span>
                </button>
                <button
                  onClick={() => setShowMedalPrompt(false)}
                  className="w-full py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-500 font-bold rounded-xl text-xs transition-colors"
                >
                  暂不抽取
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
