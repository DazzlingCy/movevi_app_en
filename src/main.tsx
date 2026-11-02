import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

declare const __APP_VERSION__: string;

const checkForNewVersion = async () => {
  try {
    const versionUrl = new URL('version.json', document.baseURI);
    versionUrl.searchParams.set('t', Date.now().toString());

    const response = await fetch(versionUrl, {cache: 'no-store'});
    if (!response.ok) return;

    const payload = (await response.json()) as {version?: string};
    const remoteVersion = payload.version;
    if (!remoteVersion || remoteVersion === __APP_VERSION__) return;

    const pageUrl = new URL(window.location.href);
    if (pageUrl.searchParams.get('v') === remoteVersion) return;

    pageUrl.searchParams.set('v', remoteVersion);
    window.location.replace(pageUrl);
  } catch {
    // Keep the current build when offline and check again when the app returns to the foreground.
  }
};

void checkForNewVersion();

// Mobile Safari and in-app browsers may restore the full React tree from the
// back-forward cache instead of creating a new first-use session. A real reload
// guarantees that the prototype always starts from the journey intro screen.
window.addEventListener('pageshow', event => {
  if (event.persisted) window.location.reload();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    void checkForNewVersion();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
