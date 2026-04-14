import "server-only";

import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/server/firebase-admin";
import { captureServerException } from "@/lib/server/firebase-observability";
import {
  getLocalSessionByUserId,
  loginWithIdentifier,
  normalizeRolePreference,
  registerLocalUser,
} from "@/lib/server/local-data";
import type { LocalSession, UserRole } from "@/lib/local-data/types";
import type { RegisterInput } from "@/lib/validation/forms";

const SESSION_COOKIE_NAME = "kisan_kamai_session";
const WORKSPACE_COOKIE_NAME = "kisan_kamai_workspace";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 5;

function normalizeWorkspaceCookie(value?: string | null): UserRole | null {
  return value === "owner" || value === "renter" ? value : null;
}

export async function createSessionFromIdToken(
  idToken: string,
  options?: {
    workspacePreference?: UserRole;
  }
) {
  const auth = getAdminAuth();
  const decoded = await auth.verifyIdToken(idToken, true);
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_MS,
  });

  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
  });

  if (options?.workspacePreference) {
    await setWorkspaceCookie(options.workspacePreference);
  }

  return decoded.uid;
}

export async function setWorkspaceCookie(workspace: UserRole) {
  const store = await cookies();
  store.set(WORKSPACE_COOKIE_NAME, workspace, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
  });
}

export async function clearSessionCookie() {
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

export async function getCurrentSession(): Promise<LocalSession | null> {
  const store = await cookies();
  const sessionCookie = store.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, false);
    const session = await getLocalSessionByUserId(decoded.uid);
    if (!session) {
      return null;
    }

    return {
      ...session,
      activeWorkspace:
        normalizeWorkspaceCookie(store.get(WORKSPACE_COOKIE_NAME)?.value) ??
        normalizeRolePreference(session.profile.rolePreference),
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

export async function loginAndCreateSession(identifier: string, password: string) {
  const result = await loginWithIdentifier(identifier, password);
  if (!result?.idToken || !result.session) {
    return null;
  }

  await createSessionFromIdToken(result.idToken, {
    workspacePreference: result.session.activeWorkspace,
  });
  return result.session;
}

export async function registerAndCreateSession(input: RegisterInput) {
  const result = await registerLocalUser(input);
  if (!result?.idToken || !result.session) {
    return null;
  }

  await createSessionFromIdToken(result.idToken, {
    workspacePreference: result.session.activeWorkspace,
  });
  return result.session;
}
