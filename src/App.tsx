import { useState } from 'react';
import AuthScreen from './components/AuthScreen';
import JourneyApp from './components/journey/JourneyApp';
import ProfileSetupScreen from './components/ProfileSetupScreen';
import {
  type AuthUser,
  clearAuthSession,
  saveAuthSession,
} from './lib/auth';

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    clearAuthSession();
    return null;
  });

  const handleAuthenticated = (user: AuthUser) => {
    setAuthUser(user);
    saveAuthSession(user);
  };

  const handleProfileComplete = (user: AuthUser) => {
    setAuthUser(user);
    saveAuthSession(user);
  };

  const handleSignOut = () => {
    clearAuthSession();
    setAuthUser(null);
  };

  if (!authUser) {
    return (
      <div className="app-stage">
        <div className="phone-shell">
          <AuthScreen onAuthenticated={handleAuthenticated} />
        </div>
      </div>
    );
  }

  if (!authUser.profileCompleted) {
    return (
      <div className="app-stage">
        <div className="phone-shell">
          <ProfileSetupScreen user={authUser} onComplete={handleProfileComplete} />
        </div>
      </div>
    );
  }

  return <JourneyApp user={authUser} onSignOut={handleSignOut} />;
}
