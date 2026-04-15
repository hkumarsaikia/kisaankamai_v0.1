import "server-only";

import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/server/firebase-admin";
import { captureServerException } from "@/lib/server/observability";
import { getUserProfile, getUserRecord, upsertUserProfile, upsertUserRecord } from "@/lib/server/repositories";
import { mirrorAuthEvent } from "@/lib/server/sheets-mirror";
import type { SessionRecord, Workspace } from "@/lib/types";

const SESSION_COOKIE_NAME = "kk_prod_session";
const WORKSPACE_COOKIE_NAME = "kk_prod_workspace";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 5;

function normalizeWorkspace(value?: string | null): Workspace {
  return value === "owner" ? "owner" : "renter";
}

export async function createSessionFromIdToken(
  idToken: string,
  options?: {
    workspacePreference?: Workspace;
    profile?: {
      fullName: string;
      phone: string;
      email?: string;
      address: string;
      village: string;
      pincode: string;
      fieldArea: number;
    };
  }
) {
  const auth = getAdminAuth();
  const decoded = await auth.verifyIdToken(idToken, true);
  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
  const workspacePreference = normalizeWorkspace(options?.workspacePreference || undefined);

  const userRecord = await upsertUserRecord(decoded.uid, {
    fullName: decoded.name || undefined,
    phone: decoded.phone_number || undefined,
    email: decoded.email || undefined,
    workspacePreference,
    lastLoginAt: new Date().toISOString(),
  });
  const profileRecord = options?.profile
    ? await upsertUserProfile(decoded.uid, {
        ...options.profile,
        email: options.profile.email || decoded.email || undefined,
        workspacePreference,
      })
    : null;

  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
  });
  store.set(WORKSPACE_COOKIE_NAME, workspacePreference, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
  });

  await mirrorAuthEvent({
    eventType: options?.profile ? "register" : "login",
    session: {
      user: {
        uid: decoded.uid,
        fullName: profileRecord?.fullName || userRecord.fullName || decoded.name || "Kisan Kamai User",
        phone: profileRecord?.phone || userRecord.phone || decoded.phone_number || undefined,
        email: profileRecord?.email || userRecord.email || decoded.email || undefined,
        workspacePreference,
      },
      profile: profileRecord,
    },
    identifier: decoded.uid,
    outcome: "success",
  });

  return decoded.uid;
}

export async function clearSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  store.set(WORKSPACE_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function setWorkspaceCookie(workspace: Workspace) {
  const store = await cookies();
  store.set(WORKSPACE_COOKIE_NAME, workspace, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
  });
}

export async function getCurrentSession(): Promise<SessionRecord | null> {
  const store = await cookies();
  const sessionCookie = store.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, false);
    const [userRecord, profile] = await Promise.all([getUserRecord(decoded.uid), getUserProfile(decoded.uid)]);
    const workspacePreference = normalizeWorkspace(
      store.get(WORKSPACE_COOKIE_NAME)?.value || profile?.workspacePreference || userRecord?.workspacePreference
    );

    return {
      user: {
        uid: decoded.uid,
        fullName: profile?.fullName || userRecord?.fullName || decoded.name || "Kisan Kamai User",
        phone: profile?.phone || userRecord?.phone || decoded.phone_number || undefined,
        email: profile?.email || userRecord?.email || decoded.email || undefined,
        workspacePreference,
      },
      profile,
    };
  } catch (error) {
    captureServerException(error, { subsystem: "getCurrentSession" });
    return null;
  }
}

export async function requireSession() {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("AUTH_REQUIRED");
  }
  return session;
}
