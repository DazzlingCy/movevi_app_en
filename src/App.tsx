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
  const [guestMode, setGuestMode] = useState(true);
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    clearAuthSession();
    return null;
  });

  const handleAuthenticated = (user: AuthUser) => {
    setGuestMode(false);
    setAuthUser(user);
    saveAuthSession(user);
  };

  const handleProfileComplete = (user: AuthUser) => {
    setAuthUser(user);
    saveAuthSession(user);
  };

  const handleSignOut = () => {
    clearAuthSession();
    setGuestMode(true);
    setAuthUser(null);
  };

  if (!authUser && !guestMode) {
    return (
      <div className="app-stage">
        <div className="phone-shell">
          <AuthScreen
            onAuthenticated={handleAuthenticated}
            onContinueAsGuest={() => setGuestMode(true)}
          />
        </div>
      </div>
    );
  }

  if (authUser && !authUser.profileCompleted) {
    return (
      <div className="app-stage">
        <div className="phone-shell">
          <ProfileSetupScreen user={authUser} onComplete={handleProfileComplete} />
        </div>
      </div>
    );
  }

  return (
    <JourneyApp
      user={authUser}
      onRequireAuth={() => setGuestMode(false)}
      onSignOut={handleSignOut}
    />
  );
}
