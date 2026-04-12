import { Models } from "appwrite";

const getEnvValue = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
};

export interface DemoUserProfile {
  fullName: string;
  role: "owner" | "renter" | "both";
  email?: string;
  phone?: string;
  village?: string;
  address?: string;
  pincode?: string;
  fieldArea?: number;
  aadhaar?: string;
}

export interface DemoSession {
  user: Models.User<Models.Preferences>;
  profile: DemoUserProfile;
}

export const DEMO_AUTH_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_DEMO_AUTH_MODE === "true",
  phone: getEnvValue(process.env.NEXT_PUBLIC_DEMO_PHONE, "8761085453"),
  email: getEnvValue(process.env.NEXT_PUBLIC_DEMO_EMAIL, "test@example.com").toLowerCase(),
  password: getEnvValue(process.env.NEXT_PUBLIC_DEMO_PASSWORD, "Test@12345"),
  storageKey: "kisan-kamai-demo-session"
};

const DEMO_FULL_NAME = "Kisan Kamai Demo User";

const createDemoUser = (): Models.User<Models.Preferences> =>
  ({
    $id: "demo-user",
    $createdAt: "2026-01-01T00:00:00.000Z",
    $updatedAt: "2026-01-01T00:00:00.000Z",
    accessedAt: "2026-01-01T00:00:00.000Z",
    name: DEMO_FULL_NAME,
    registration: "2026-01-01T00:00:00.000Z",
    status: true,
    labels: ["demo"],
    passwordUpdate: "2026-01-01T00:00:00.000Z",
    email: DEMO_AUTH_CONFIG.email,
    phone: `+91${DEMO_AUTH_CONFIG.phone}`,
    emailVerification: true,
    phoneVerification: true,
    prefs: {},
    mfa: false
  } as Models.User<Models.Preferences>);

const createDemoProfile = (): DemoUserProfile => ({
  fullName: DEMO_FULL_NAME,
  role: "both",
  email: DEMO_AUTH_CONFIG.email,
  phone: DEMO_AUTH_CONFIG.phone,
  village: "Sangli Demo Hub",
  address: "Demo Farm Road, Sangli",
  pincode: "416416",
  fieldArea: 12.5
});

const canUseLocalStorage = () => typeof window !== "undefined" && !!window.localStorage;

export const getDemoLoginNote = () =>
  `Demo mode is enabled. Use ${DEMO_AUTH_CONFIG.phone} or ${DEMO_AUTH_CONFIG.email} with password ${DEMO_AUTH_CONFIG.password}.`;

export const isDemoLoginCredentials = (identifier: string, password: string) => {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  return (
    DEMO_AUTH_CONFIG.enabled &&
    password === DEMO_AUTH_CONFIG.password &&
    (normalizedIdentifier === DEMO_AUTH_CONFIG.phone || normalizedIdentifier === DEMO_AUTH_CONFIG.email)
  );
};

export const isDemoRegistrationCredentials = ({
  phone,
  email,
  password
}: {
  phone: string;
  email: string;
  password: string;
}) =>
  DEMO_AUTH_CONFIG.enabled &&
  phone.trim() === DEMO_AUTH_CONFIG.phone &&
  email.trim().toLowerCase() === DEMO_AUTH_CONFIG.email &&
  password === DEMO_AUTH_CONFIG.password;

export const readDemoSession = (): DemoSession | null => {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(DEMO_AUTH_CONFIG.storageKey);
    if (!rawSession) {
      return null;
    }

    const parsed = JSON.parse(rawSession) as DemoSession;
    if (!parsed?.user?.$id || !parsed?.profile?.role) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const startDemoSession = () => {
  const session: DemoSession = {
    user: createDemoUser(),
    profile: createDemoProfile()
  };

  if (canUseLocalStorage()) {
    window.localStorage.setItem(DEMO_AUTH_CONFIG.storageKey, JSON.stringify(session));
  }

  return session;
};

export const clearDemoSession = () => {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(DEMO_AUTH_CONFIG.storageKey);
  }
};
