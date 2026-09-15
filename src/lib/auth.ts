export type AuthProvider = 'apple' | 'google' | 'email';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: AuthProvider;
  emailVerified: boolean;
  avatarUrl?: string;
  heightCm?: string;
  birthday?: string;
  weightKg?: string;
  profileCompleted: boolean;
  createdAt: string;
  lastSignedInAt: string;
}

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  provider: AuthProvider;
  providerSubjectId?: string;
  emailVerified: boolean;
  avatarUrl?: string;
  heightCm?: string;
  birthday?: string;
  weightKg?: string;
  profileCompleted?: boolean;
  passwordHash?: string;
  createdAt: string;
  lastSignedInAt: string;
}

export type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; message: string };

export type EmailCodeResult =
  | { ok: true; message: string; code: string }
  | { ok: false; message: string };

const AUTH_SESSION_STORAGE_KEY = 'movevi_auth_user';
const AUTH_ACCOUNTS_STORAGE_KEY = 'movevi_auth_accounts';
const AUTH_EMAIL_CODES_STORAGE_KEY = 'movevi_auth_email_codes';
const EMAIL_CODE_TTL_MS = 10 * 60 * 1000;

interface StoredEmailCode {
  email: string;
  code: string;
  expiresAt: number;
}

const socialProfiles: Record<Exclude<AuthProvider, 'email'>, Pick<AuthUser, 'name' | 'provider'> & { subjectId: string }> = {
  apple: {
    name: 'Mia Liu',
    provider: 'apple',
    subjectId: 'apple_demo_mia_liu',
  },
  google: {
    name: 'Mia Liu',
    provider: 'google',
    subjectId: 'google_demo_mia_liu',
  },
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const createId = () => `user_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const hashPassword = (password: string) => {
  try {
    return btoa(unescape(encodeURIComponent(password)));
  } catch {
    return password;
  }
};

const toUser = (account: StoredAccount): AuthUser => ({
  id: account.id,
  name: account.name,
  email: account.email,
  provider: account.provider,
  emailVerified: account.emailVerified,
  avatarUrl: account.avatarUrl,
  heightCm: account.heightCm,
  birthday: account.birthday,
  weightKg: account.weightKg,
  profileCompleted: account.profileCompleted ?? true,
  createdAt: account.createdAt,
  lastSignedInAt: account.lastSignedInAt,
});

const getNameFromEmail = (email: string) => {
  const localPart = email.split('@')[0] || 'MOVEVI Runner';
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'MOVEVI Runner';
};

const readAccounts = (): StoredAccount[] => {
  try {
    const storedAccounts = localStorage.getItem(AUTH_ACCOUNTS_STORAGE_KEY);
    return storedAccounts ? JSON.parse(storedAccounts) as StoredAccount[] : [];
  } catch {
    localStorage.removeItem(AUTH_ACCOUNTS_STORAGE_KEY);
    return [];
  }
};

const saveAccounts = (accounts: StoredAccount[]) => {
  localStorage.setItem(AUTH_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
};

const readEmailCodes = (): StoredEmailCode[] => {
  try {
    const storedCodes = localStorage.getItem(AUTH_EMAIL_CODES_STORAGE_KEY);
    const codes = storedCodes ? JSON.parse(storedCodes) as StoredEmailCode[] : [];
    const now = Date.now();
    const validCodes = codes.filter(code => code.expiresAt > now);
    if (validCodes.length !== codes.length) {
      localStorage.setItem(AUTH_EMAIL_CODES_STORAGE_KEY, JSON.stringify(validCodes));
    }
    return validCodes;
  } catch {
    localStorage.removeItem(AUTH_EMAIL_CODES_STORAGE_KEY);
    return [];
  }
};

const saveEmailCodes = (codes: StoredEmailCode[]) => {
  localStorage.setItem(AUTH_EMAIL_CODES_STORAGE_KEY, JSON.stringify(codes));
};

const createEmailCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const loadAuthSession = (): AuthUser | null => {
  try {
    const storedUser = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!storedUser) return null;
    const user = JSON.parse(storedUser) as AuthUser;
    return {
      ...user,
      heightCm: user.heightCm,
      birthday: user.birthday,
      weightKg: user.weightKg,
      profileCompleted: user.profileCompleted ?? true,
    };
  } catch {
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
};

export const saveAuthSession = (user: AuthUser) => {
  localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
};

export const updateAuthProfile = (userId: string, profile: {
  name: string;
  avatarUrl?: string;
  heightCm?: string;
  birthday?: string;
  weightKg?: string;
}): AuthResult => {
  const cleanName = profile.name.trim();
  if (cleanName.length < 2) {
    return { ok: false, message: 'Enter a name with at least 2 characters.' };
  }

  const accounts = readAccounts();
  const accountIndex = accounts.findIndex(account => account.id === userId);
  const sessionUser = loadAuthSession();
  const baseAccount: StoredAccount | null = accountIndex >= 0
    ? accounts[accountIndex]
    : sessionUser && sessionUser.id === userId
      ? {
          id: sessionUser.id,
          name: sessionUser.name,
          email: sessionUser.email,
          provider: sessionUser.provider,
          providerSubjectId: undefined,
          emailVerified: sessionUser.emailVerified,
          avatarUrl: sessionUser.avatarUrl,
          heightCm: sessionUser.heightCm,
          birthday: sessionUser.birthday,
          weightKg: sessionUser.weightKg,
          profileCompleted: sessionUser.profileCompleted,
          createdAt: sessionUser.createdAt,
          lastSignedInAt: sessionUser.lastSignedInAt,
        }
      : null;

  if (!baseAccount) {
    return { ok: false, message: 'Session expired. Sign in again.' };
  }

  const updatedAccount: StoredAccount = {
    ...baseAccount,
    name: cleanName,
    avatarUrl: profile.avatarUrl,
    heightCm: profile.heightCm?.trim(),
    birthday: profile.birthday?.trim(),
    weightKg: profile.weightKg?.trim(),
    profileCompleted: true,
  };

  if (accountIndex >= 0) {
    accounts[accountIndex] = updatedAccount;
    saveAccounts(accounts);
  } else {
    saveAccounts([...accounts, updatedAccount]);
  }

  const user = toUser(updatedAccount);
  saveAuthSession(user);
  return { ok: true, user };
};

export const signInWithProvider = (provider: Exclude<AuthProvider, 'email'>): AuthResult => {
  const profile = socialProfiles[provider];
  const now = new Date().toISOString();
  const accounts = readAccounts();
  const existingIndex = accounts.findIndex(
    account => account.provider === provider && account.providerSubjectId === profile.subjectId
  );

  if (existingIndex < 0) {
    return { ok: false, message: 'Link an email address to finish signing in.' };
  }

  const account: StoredAccount = {
    ...accounts[existingIndex],
    name: accounts[existingIndex].name || profile.name,
    provider,
    providerSubjectId: profile.subjectId,
    emailVerified: true,
    profileCompleted: accounts[existingIndex].profileCompleted ?? true,
    lastSignedInAt: now,
  };

  accounts[existingIndex] = account;
  saveAccounts(accounts);
  const user = toUser(account);
  saveAuthSession(user);
  return { ok: true, user };
};

export const bindProviderEmailAndSignIn = (
  provider: Exclude<AuthProvider, 'email'>,
  email: string,
  code: string
): AuthResult => {
  const profile = socialProfiles[provider];
  const cleanEmail = normalizeEmail(email);
  const cleanCode = code.trim();

  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
    return { ok: false, message: 'Enter a valid email address.' };
  }
  if (!/^\d{6}$/.test(cleanCode)) {
    return { ok: false, message: 'Enter the 6-digit code.' };
  }

  const codes = readEmailCodes();
  const matchingCode = codes.find(item => item.email === cleanEmail);
  if (!matchingCode) {
    return { ok: false, message: 'Your code expired. Request a new one.' };
  }
  if (matchingCode.code !== cleanCode) {
    return { ok: false, message: 'Incorrect code. Try again.' };
  }

  const now = new Date().toISOString();
  const accounts = readAccounts();
  const providerIndex = accounts.findIndex(
    account => account.provider === provider && account.providerSubjectId === profile.subjectId
  );
  const emailIndex = accounts.findIndex(account => account.email === cleanEmail);
  const existingIndex = providerIndex >= 0 ? providerIndex : emailIndex;
  const existingAccount = existingIndex >= 0 ? accounts[existingIndex] : null;

  const account: StoredAccount = existingAccount
    ? {
        ...existingAccount,
        name: existingAccount.name || profile.name,
        email: cleanEmail,
        provider,
        providerSubjectId: profile.subjectId,
        emailVerified: true,
        profileCompleted: existingAccount.profileCompleted ?? true,
        lastSignedInAt: now,
      }
    : {
        id: createId(),
        name: profile.name,
        email: cleanEmail,
        provider,
        providerSubjectId: profile.subjectId,
        emailVerified: true,
        profileCompleted: false,
        createdAt: now,
        lastSignedInAt: now,
      };

  if (existingIndex >= 0) {
    accounts[existingIndex] = account;
  } else {
    accounts.push(account);
  }

  saveAccounts(accounts);
  saveEmailCodes(codes.filter(item => item.email !== cleanEmail));
  const user = toUser(account);
  saveAuthSession(user);
  return { ok: true, user };
};

export const registerWithEmail = (name: string, email: string, password: string): AuthResult => {
  const cleanEmail = normalizeEmail(email);
  const cleanName = name.trim() || getNameFromEmail(cleanEmail);

  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
    return { ok: false, message: 'Enter a valid email address.' };
  }
  if (password.length < 8) {
    return { ok: false, message: 'Use at least 8 characters.' };
  }

  const accounts = readAccounts();
  if (accounts.some(account => account.email === cleanEmail)) {
    return { ok: false, message: 'An account already exists. Sign in instead.' };
  }

  const now = new Date().toISOString();
  const account: StoredAccount = {
    id: createId(),
    name: cleanName,
    email: cleanEmail,
    provider: 'email',
    emailVerified: false,
    profileCompleted: false,
    passwordHash: hashPassword(password),
    createdAt: now,
    lastSignedInAt: now,
  };

  saveAccounts([...accounts, account]);
  const user = toUser(account);
  saveAuthSession(user);
  return { ok: true, user };
};

export const requestEmailVerificationCode = (email: string): EmailCodeResult => {
  const cleanEmail = normalizeEmail(email);
  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
    return { ok: false, message: 'Enter a valid email address.' };
  }

  const code = createEmailCode();
  const codes = readEmailCodes().filter(item => item.email !== cleanEmail);
  saveEmailCodes([
    ...codes,
    {
      email: cleanEmail,
      code,
      expiresAt: Date.now() + EMAIL_CODE_TTL_MS,
    },
  ]);

  return {
    ok: true,
    code,
    message: 'Verification code sent.',
  };
};

export const verifyEmailCodeAndSignIn = (email: string, code: string): AuthResult => {
  const cleanEmail = normalizeEmail(email);
  const cleanCode = code.trim();

  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
    return { ok: false, message: 'Enter a valid email address.' };
  }
  if (!/^\d{6}$/.test(cleanCode)) {
    return { ok: false, message: 'Enter the 6-digit code.' };
  }

  const codes = readEmailCodes();
  const matchingCode = codes.find(item => item.email === cleanEmail);
  if (!matchingCode) {
    return { ok: false, message: 'Your code expired. Request a new one.' };
  }
  if (matchingCode.code !== cleanCode) {
    return { ok: false, message: 'Incorrect code. Try again.' };
  }

  const now = new Date().toISOString();
  const accounts = readAccounts();
  const existingIndex = accounts.findIndex(account => account.email === cleanEmail && account.provider === 'email');
  const account: StoredAccount = existingIndex >= 0
    ? {
        ...accounts[existingIndex],
        profileCompleted: false,
        emailVerified: true,
        lastSignedInAt: now,
      }
    : {
        id: createId(),
        name: getNameFromEmail(cleanEmail),
        email: cleanEmail,
        provider: 'email',
        emailVerified: true,
        profileCompleted: false,
        createdAt: now,
        lastSignedInAt: now,
      };

  if (existingIndex >= 0) {
    accounts[existingIndex] = account;
  } else {
    accounts.push(account);
  }

  saveAccounts(accounts);
  saveEmailCodes(codes.filter(item => item.email !== cleanEmail));

  const user = toUser(account);
  saveAuthSession(user);
  return { ok: true, user };
};

export const signInWithEmail = (email: string, password: string): AuthResult => {
  const cleanEmail = normalizeEmail(email);
  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
    return { ok: false, message: 'Enter a valid email address.' };
  }
  if (!password) {
    return { ok: false, message: 'Enter your password.' };
  }

  const accounts = readAccounts();
  const accountIndex = accounts.findIndex(account => account.email === cleanEmail && account.provider === 'email');
  if (accountIndex < 0) {
    return { ok: false, message: 'No email account found. Create an account first.' };
  }

  const account = accounts[accountIndex];
  if (account.passwordHash !== hashPassword(password)) {
    return { ok: false, message: 'Incorrect password.' };
  }

  const nextAccount = {
    ...account,
    profileCompleted: false,
    lastSignedInAt: new Date().toISOString(),
  };
  accounts[accountIndex] = nextAccount;
  saveAccounts(accounts);

  const user = toUser(nextAccount);
  saveAuthSession(user);
  return { ok: true, user };
};

export const requestPasswordReset = (email: string): AuthResult => {
  const cleanEmail = normalizeEmail(email);
  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
    return { ok: false, message: 'Enter your email first.' };
  }

  return {
    ok: false,
    message: 'If that email is registered, a reset link has been sent.',
  };
};
