import { useState, useEffect } from 'react';
import { Compass, Trophy, Map as MapIcon, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HomeTab from './components/HomeTab';
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
import SubscriptionPage from './components/SubscriptionPage';
import MedalDrawView from './components/MedalDrawView';
import {
  SubscriptionPlan,
  SubscriptionState,
  createActiveSubscription,
  formatBillingDate,
  hasPremiumAccess as getHasPremiumAccess,
  markSubscriptionForCancellation,
  readSubscriptionState,
  resumeSubscription,
  saveSubscriptionState,
  updatePaymentMethod,
} from './lib/subscription';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showIntro, setShowIntro] = useState(true);
  const [fullScreenPage, setFullScreenPage] = useState<{type: 'cityRoutes' | 'routeDetail' | 'runPlayback' | 'litRecords' | 'leaderboard' | 'weekendMedley' | 'medalDraw' | 'subscription', data?: any} | null>(null);

  // Overseas subscription state. This is a front-end demo model that mirrors
  // the Stripe-style lifecycle: active, canceled at period end, and expired.
  const [subscription, setSubscription] = useState<SubscriptionState>(() => readSubscriptionState());
  const hasPremiumAccess = getHasPremiumAccess(subscription);
  const premiumAccessLabel = subscription.status === 'canceled_at_period_end' && hasPremiumAccess
    ? `Until ${formatBillingDate(subscription.currentPeriodEnd)}`
    : undefined;

  const updateSubscription = (nextSubscription: SubscriptionState) => {
    setSubscription(nextSubscription);
    saveSubscriptionState(nextSubscription);
  };

  const handleSubscribeSuccess = (paymentMethodLabel: string, plan: SubscriptionPlan, _mode: 'trial' | 'paid') => {
    updateSubscription(createActiveSubscription(paymentMethodLabel, plan));
  };

  const handleCancelSubscription = () => {
    updateSubscription(markSubscriptionForCancellation(subscription));
  };

  const handleResumeSubscription = () => {
    updateSubscription(resumeSubscription(subscription));
  };

  const handleUpdatePaymentMethod = (paymentMethodLabel = 'Visa ending in 4242') => {
    updateSubscription(updatePaymentMethod(subscription, paymentMethodLabel));
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
  const [userStats, setUserStats] = useState({
    completedCities: 0,
    completedRoutes: 0,
    totalDistance: 0.0,
    totalTimeHours: 0.0,
    lightValue: 120
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
          <MedalDrawView
            showHeader={false}
            onBack={() => setActiveTab('home')}
            onGoToRunning={() => setActiveTab('cities')}
            userStats={userStats}
            setUserStats={setUserStats}
          />
        );
      case 'cities':
        return <CitiesTab onCityClick={(city) => setFullScreenPage({ type: 'cityRoutes', data: city })} />;
      case 'profile':
        return (
          <ProfileTab 
            userStats={userStats} 
            isSubscribed={hasPremiumAccess}
            subscription={subscription}
            onOpenSubscription={() => setFullScreenPage({ type: 'subscription' })}
            onCancelSubscription={handleCancelSubscription}
            onResumeSubscription={handleResumeSubscription}
            onUpdatePaymentMethod={handleUpdatePaymentMethod}
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
                  isSubscribed={hasPremiumAccess}
                  premiumAccessLabel={premiumAccessLabel}
                  onOpenSubscription={() => setFullScreenPage({ type: 'subscription' })}
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
                  isSubscribed={hasPremiumAccess}
                  premiumAccessLabel={premiumAccessLabel}
                  onOpenSubscription={() => setFullScreenPage({ type: 'subscription' })}
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

                   // Show the reward prompt after each newly completed route.
                   if (isNewlyCompleted) {
                     setShowMedalPrompt(true);
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
            {fullScreenPage.type === 'subscription' && (
              <SubscriptionPage
                subscription={subscription}
                isSubscribed={hasPremiumAccess}
                onBack={() => setFullScreenPage(null)}
                onSubscribe={handleSubscribeSuccess}
                onCancelSubscription={handleCancelSubscription}
                onResumeSubscription={handleResumeSubscription}
                onUpdatePaymentMethod={handleUpdatePaymentMethod}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route completion reward prompt */}
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
              className="w-full max-w-[360px] overflow-visible rounded-[34px] border border-orange-200/80 bg-[linear-gradient(180deg,#fffdf6_0%,#fff8ec_100%)] px-7 pb-7 pt-10 text-slate-800 shadow-[0_24px_80px_rgba(0,0,0,0.32),0_2px_0_rgba(255,255,255,0.7)_inset] relative"
            >
              {/* Top Banner Accent */}
              <div className="absolute -top-12 left-1/2 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-full bg-[#fffdf6] shadow-[0_14px_35px_rgba(234,88,12,0.24)]">
                <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-orange-600 text-4xl shadow-[0_8px_18px_rgba(249,115,22,0.32)_inset]">
                  🎁
                </div>
              </div>

              <div className="mt-10 text-center">
                <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-500 ring-1 ring-red-100">
                  Reward added
                </span>
                <h3 className="mt-3 text-[22px] font-black leading-tight tracking-tight text-slate-950">
                  Route complete!
                </h3>

                <div className="mt-5 flex items-center justify-center rounded-2xl border border-orange-100 bg-white/65 px-4 py-3 shadow-[0_8px_22px_rgba(251,146,60,0.08)]">
                  <div className="flex-1">
                    <strong className="block text-2xl font-black leading-none text-orange-600">3</strong>
                    <span className="mt-1 block text-[11px] font-bold text-slate-600">Route medals</span>
                  </div>
                  <div className="mx-4 h-9 w-px bg-orange-100" />
                  <div className="flex-1">
                    <strong className="block text-2xl font-black leading-none text-orange-600">3</strong>
                    <span className="mt-1 block text-[11px] font-bold text-slate-600">Draw chances</span>
                  </div>
                </div>

                {/* Subtitle explaining unsubscribed status perk */}
                <div className="mt-5 rounded-2xl border border-amber-200/60 bg-amber-50/70 px-4 py-3">
                  <p className="text-center text-[11px] font-semibold leading-relaxed text-amber-800">
                    Complete more routes to earn more draw chances.
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowMedalPrompt(false);
                    setFullScreenPage({ type: 'medalDraw' });
                  }}
                  className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 py-4 text-sm font-black tracking-wide text-white shadow-[0_16px_34px_rgba(249,115,22,0.28)] transition-all hover:brightness-105 active:scale-[0.98]"
                >
                  <span>Go to draw</span>
                </button>
                <button
                  onClick={() => setShowMedalPrompt(false)}
                  className="w-full rounded-xl py-2.5 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-900/5 hover:text-slate-700"
                >
                  Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}