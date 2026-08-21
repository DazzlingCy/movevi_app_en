final result: passed

# Settings Page QA

Reference: attached mobile settings screenshot.
Implementation: `src/components/SettingsPage.tsx`, opened from Profile > Settings.

Checks completed:
- Settings opens from the Profile Settings row and returns with the back button.
- The page matches the reference structure: top title bar, stacked rounded setting rows, account value, version row, and full-width sign out button.
- Copy is localized for the English app: Settings, Account, Privacy Policy, Terms of Service, About MOVEVI, Check for Updates, Sign out.
- Account, policy, terms, and about rows open user-facing detail sheets.
- Check for Updates shows a latest-version confirmation.
- Sign out exits the account and returns to the login screen.

Notes:
- The iOS status bar in the reference was treated as device chrome and was not recreated inside the app.
- Styling was adapted to MOVEVI's existing dark mobile container while preserving the reference layout.

# Auth Flow QA

Reference: attached clean white mobile sign-up screenshots plus common US app account flows.
Implementation: `src/components/AuthScreen.tsx`, shown before the signed-in app shell.

Checks completed:
- The first screen uses a minimal white sign-up/log-in entry page with a MOVEVI logo lockup, the copy "Put the world on your treadmill.", rounded Apple/Google/email buttons, and legal copy at the bottom.
- Button sizing and internal layout keep provider icons separated from centered button text.
- Apple now opens an iOS-style third-party bottom sheet over a dimmed MOVEVI sign-in screen; tapping Continue completes the mock sign-in.
- Google now opens a browser-style `accounts.google.com` page with MOVEVI as the destination; tapping Next completes the mock sign-in.
- Continue with email opens a separate stepped email flow with a back button and progress bar.
- Account creation/login uses email verification: enter email, accept Terms/Privacy, request a 6-digit code, then verify to sign in.
- First-time account creation now opens a profile setup page before Home; users must add an avatar and nickname to enter the app.
- Completed profile data is saved to the auth account/session and appears on Home and Profile.
- The verification-code page keeps the same clean white style and allows requesting a new code.
- Copy is concise, user-facing, and avoids exposing implementation details.
- Verification-code auth was checked with a local storage mock: code sent, incorrect code rejected, correct code signs in with a verified email account.

# Post-Login Guide QA

Reference: attached post-login guide screenshot.
Implementation: `src/components/IntroScreen.tsx`, currently hidden from `src/App.tsx`.

Checks completed:
- The three-step guide is no longer rendered after sign-in.
- A successful sign-in or registration now opens the main Home experience directly.
- Bottom navigation is visible immediately after authentication.
- The `IntroScreen` component remains in the codebase for future reuse, but no active app flow displays it.

# Ranking And Profile QA

Checks completed:
- Home no longer shows a level, tier, or light-value progress bar in the user chip.
- Switching cities no longer requires or deducts Glow/light value.
- Profile no longer shows `LV.3` or `Gold`; the city stat is shown as `Cities Lit`.
- Leaderboard ranking is now based on lit city count, including the current user's rank.
