import "server-only";

import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import {
  getLocalSessionByUserId,
  loginWithIdentifier,
  normalizeRolePreference,
  registerLocalUser,
} from "@/lib/server/local-data";
import { IS_PAGES_BUILD } from "@/lib/server/pages-export";
import type { LocalSession, UserRole } from "@/lib/local-data/types";
import type { RegisterInput } from "@/lib/validation/forms";

const SESSION_COOKIE_NAME = "kisan_kamai_session";
const WORKSPACE_COOKIE_NAME = "kisan_kamai_workspace";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getSessionSecret() {
  return process.env.LOCAL_SESSION_SECRET || "kisan-kamai-local-session-secret";
}

function encodePayload(payload: Record<string, string>) {
  const raw = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", getSessionSecret()).update(raw).digest("base64url");
  return `${raw}.${signature}`;
}

function decodePayload(token: string) {
  const [raw, signature] = token.split(".");
  if (!raw || !signature) {
    return null;
  }

  const expected = createHmac("sha256", getSessionSecret()).update(raw).digest("base64url");
  if (expected !== signature) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as {
      userId: string;
      issuedAt: string;
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string) {
  if (IS_PAGES_BUILD) {
    void userId;
    return;
  }

  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, encodePayload({ userId, issuedAt: new Date().toISOString() }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

function normalizeWorkspaceCookie(value?: string | null): UserRole | null {
  if (value === "owner" || value === "renter") {
    return value;
  }

  return null;
}

export async function setWorkspaceCookie(workspace: UserRole) {
  if (IS_PAGES_BUILD) {
    void workspace;
    return;
  }

  const store = await cookies();
  store.set(WORKSPACE_COOKIE_NAME, workspace, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  if (IS_PAGES_BUILD) {
    return;
  }

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
  if (IS_PAGES_BUILD) {
    return null;
  }

  const store = await cookies();
  const raw = store.get(SESSION_COOKIE_NAME)?.value;

  if (!raw) {
    return null;
  }

  const payload = decodePayload(raw);
  if (!payload?.userId) {
    return null;
  }

  const session = await getLocalSessionByUserId(payload.userId);
  if (!session) {
    return null;
  }

  return {
    ...session,
    activeWorkspace:
      normalizeWorkspaceCookie(store.get(WORKSPACE_COOKIE_NAME)?.value) ??
      normalizeRolePreference(session.profile.rolePreference),
  };
}

export async function requireSession() {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("AUTH_REQUIRED");
  }
  return session;
}

export async function loginAndCreateSession(identifier: string, password: string) {
  const session = await loginWithIdentifier(identifier, password);
  if (!session) {
    return null;
  }

  await setSessionCookie(session.user.id);
  await setWorkspaceCookie(session.activeWorkspace);
  return session;
}

export async function registerAndCreateSession(input: RegisterInput) {
  const session = await registerLocalUser(input);
  if (!session) {
    return null;
  }

  await setSessionCookie(session.user.id);
  await setWorkspaceCookie(session.activeWorkspace);
  return session;
}
