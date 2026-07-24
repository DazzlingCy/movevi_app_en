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
import CheckInRedPacketView from './components/CheckInRedPacketView';
import {
  SubscriptionPlan,
  SubscriptionState,
  createActiveSubscription,
  formatBillingDate,
  hasPremiumAccess as getHasPremiumAccess,
  markSubscriptionForCancellation,
  resetSubscriptionState,
  resumeSubscription,
  saveSubscriptionState,
  updatePaymentMethod,
} from './lib/subscription';

const DEFAULT_LIT_CITY_IDS = ['2', '1'];
const DEFAULT_IN_PROGRESS_CITY_ID = '15';
const DEFAULT_IN_PROGRESS_COMPLETED_ROUTE_INDICES = [1];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showIntro, setShowIntro] = useState(true);
  const [fullScreenPage, setFullScreenPage] = useState<{type: 'cityRoutes' | 'routeDetail' | 'runPlayback' | 'litRecords' | 'leaderboard' | 'weekendMedley' | 'medalDraw' | 'checkInRedPacket' | 'subscription', data?: any} | null>(null);

  // Demo subscription state starts as a never-subscribed user on every reload.
  const [subscription, setSubscription] = useState<SubscriptionState>(() => resetSubscriptionState());
  const hasPremiumAccess = getHasPremiumAccess(subscription);
  const premiumAccessLabel = subscription.status === 'canceled_at_period_end' && hasPremiumAccess
    ? `Until ${formatBillingDate(subscription.currentPeriodEnd)}`
    : undefined;

  const updateSubscription = (nextSubscription: SubscriptionState) => {
    setSubscription(nextSubscription);
    saveSubscriptionState(nextSubscription);
  };

  const handleSubscribeSuccess = (paymentMethodLabel: string, plan: SubscriptionPlan, _mode: 'trial' | 'paid') => {
    updateSubscription(createActiveSubscription(paymentMethodLabel, plan, !subscription.hasUsedIntroOffer));
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
    DEFAULT_LIT_CITY_IDS.forEach(cityId => {
      const city = CITIES.find(c => c.id === cityId);
      if (!city) return;
      city.status = 'lit';
      city.completedRouteIndices = Array.from({ length: city.routes }, (_, index) => index + 1);
      city.completedRouteTimestamps = city.completedRouteIndices.reduce((acc, routeId, index) => {
        acc[routeId] = Date.now() - (DEFAULT_LIT_CITY_IDS.length - index) * 86400000;
        return acc;
      }, {} as Record<number, number>);
      city.completed = city.routes;
    });

    const inProgressCity = CITIES.find(c => c.id === DEFAULT_IN_PROGRESS_CITY_ID);
    if (inProgressCity) {
      inProgressCity.status = 'in-progress';
      inProgressCity.completedRouteIndices = DEFAULT_IN_PROGRESS_COMPLETED_ROUTE_INDICES;
      inProgressCity.completedRouteTimestamps = { 1: Date.now() - 3600000 };
      inProgressCity.completed = DEFAULT_IN_PROGRESS_COMPLETED_ROUTE_INDICES.length;
    }

    return [...DEFAULT_LIT_CITY_IDS, DEFAULT_IN_PROGRESS_CITY_ID];
  });

  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [targetFlight, setTargetFlight] = useState<{fromCityId: string, toCityId: string} | null>(null);
  const [pendingSelectionFrom, setPendingSelectionFrom] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    completedCities: 2,
    completedRoutes: 7,
    totalDistance: 62.0,
    totalTimeHours: 12.0,
    lightValue: 120,
    lifetimeLightValue: 120,
    dailyCheckedIn: false,
    dailyDistance: 0,
    dailyTreadmillStarted: false,
    dailyCompletedRoutes: 0,
    weeklyCompletedCities: 0,
    claimedDailyTaskIds: [] as string[],
    claimedWeeklyTaskIds: [] as string[],
    medalMysteryTickets: 0,
    medalLotteryDrawHistory: [] as Array<{ id: string; nickname: string; amount: string; createdAt: string }>,
    checkInPlanStarted: false,
    checkInCompletedDays: [] as number[],
    checkInRewardDays: [] as number[],
    checkInOpenedRewardDays: [] as number[],
    checkInRewardHistory: [] as Array<{ day: number; amount: string; openedAt: string }>,
    checkInActivationClaimed: false,
    checkInFirstRouteClaimed: false,
    redPacketBalance: 0
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
          <CheckInRedPacketView
            showHeader={false}
            onGoRun={() => setActiveTab('cities')}
            onNavigateToRouteDetail={(cityId, routeIndex, image, day) => {
              setFullScreenPage({
                type: 'routeDetail',
                data: {
                  cityId,
                  routeIndex,
                  image,
                  isCheckInRoute: true,
                  checkInDay: day,
                },
              });
            }}
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
                    if (fullScreenPage.data.isCheckInRoute) {
                      setFullScreenPage({ type: 'checkInRedPacket' });
                    } else if (fullScreenPage.data.isActivityRoute) {
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
                   const earnedGlow = stats.calories || Math.floor(stats.distance * 65);

                   if (fullScreenPage.data.isCheckInRoute) {
                      const checkInDay = fullScreenPage.data.checkInDay || 1;
                      setUserStats(prev => {
                        const completedDays = prev.checkInCompletedDays || [];
                        const rewardDays = prev.checkInRewardDays || [];
                        const alreadyCompleted = completedDays.includes(checkInDay);
                        return {
                          ...prev,
                          totalDistance: prev.totalDistance + stats.distance,
                          totalTimeHours: prev.totalTimeHours + (stats.duration / 3600),
                          lightValue: (prev.lightValue || 0) + earnedGlow,
                          lifetimeLightValue: (prev.lifetimeLightValue ?? prev.lightValue ?? 0) + earnedGlow,
                          dailyDistance: (prev.dailyDistance || 0) + stats.distance,
                          dailyTreadmillStarted: true,
                          completedRoutes: alreadyCompleted ? prev.completedRoutes : prev.completedRoutes + 1,
                          dailyCompletedRoutes: alreadyCompleted ? (prev.dailyCompletedRoutes || 0) : (prev.dailyCompletedRoutes || 0) + 1,
                          checkInCompletedDays: alreadyCompleted ? completedDays : [...completedDays, checkInDay],
                          checkInRewardDays: rewardDays.includes(checkInDay) ? rewardDays : [...rewardDays, checkInDay],
                        };
                      });
                      setFullScreenPage({ type: 'checkInRedPacket' });
                      return;
                    }

                   // Update user stats
                   setUserStats(prev => ({
                     ...prev,
                     totalDistance: prev.totalDistance + stats.distance,
                     totalTimeHours: prev.totalTimeHours + (stats.duration / 3600),
                     lightValue: (prev.lightValue || 0) + earnedGlow,
                     lifetimeLightValue: (prev.lifetimeLightValue ?? prev.lightValue ?? 0) + earnedGlow,
                     dailyDistance: (prev.dailyDistance || 0) + stats.distance,
                     dailyTreadmillStarted: true,
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
            {fullScreenPage.type === 'checkInRedPacket' && (
              <CheckInRedPacketView
                showHeader
                onBack={() => setFullScreenPage(null)}
                onGoRun={() => {
                  setFullScreenPage(null);
                  setActiveTab('cities');
                }}
                onNavigateToRouteDetail={(cityId, routeIndex, image, day) => {
                  setFullScreenPage({
                    type: 'routeDetail',
                    data: {
                      cityId,
                      routeIndex,
                      image,
                      isCheckInRoute: true,
                      checkInDay: day,
                    },
                  });
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

    </div>
  );
}
