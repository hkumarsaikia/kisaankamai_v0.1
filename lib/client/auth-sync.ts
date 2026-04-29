"use client";

export type AuthSyncEventType = "login" | "logout" | "session-refresh";

type AuthSyncMessage = {
  type: AuthSyncEventType;
  timestamp: number;
  sourceId: string;
};

const AUTH_SYNC_CHANNEL = "kisan-kamai-auth";
const AUTH_SYNC_STORAGE_KEY = "kk_auth_sync_event";

function getSourceId() {
  if (typeof window === "undefined") {
    return "server";
  }

  const win = window as typeof window & { __kkAuthSyncSourceId?: string };
  if (!win.__kkAuthSyncSourceId) {
    win.__kkAuthSyncSourceId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  return win.__kkAuthSyncSourceId;
}

function buildMessage(type: AuthSyncEventType): AuthSyncMessage {
  return {
    type,
    timestamp: Date.now(),
    sourceId: getSourceId(),
  };
}

function isAuthSyncMessage(value: unknown): value is AuthSyncMessage {
  return Boolean(
    value &&
      typeof value === "object" &&
      "type" in value &&
      (value.type === "login" || value.type === "logout" || value.type === "session-refresh") &&
      "timestamp" in value &&
      typeof value.timestamp === "number" &&
      "sourceId" in value &&
      typeof value.sourceId === "string"
  );
}

export function emitAuthSyncEvent(type: AuthSyncEventType) {
  if (typeof window === "undefined") {
    return;
  }

  const message = buildMessage(type);

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(AUTH_SYNC_CHANNEL);
    channel.postMessage(message);
    channel.close();
  }

  try {
    window.localStorage.setItem(AUTH_SYNC_STORAGE_KEY, JSON.stringify(message));
  } catch {
    // Storage can be unavailable in strict privacy modes. BroadcastChannel still covers modern browsers.
  }
}

export function subscribeToAuthSyncEvents(callback: (message: AuthSyncMessage) => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const sourceId = getSourceId();
  const handleMessage = (message: AuthSyncMessage) => {
    if (message.sourceId !== sourceId) {
      callback(message);
    }
  };

  const channel =
    "BroadcastChannel" in window ? new BroadcastChannel(AUTH_SYNC_CHANNEL) : null;

  if (channel) {
    channel.onmessage = (event) => {
      if (isAuthSyncMessage(event.data)) {
        handleMessage(event.data);
      }
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== AUTH_SYNC_STORAGE_KEY || !event.newValue) {
      return;
    }

    try {
      const parsed = JSON.parse(event.newValue) as unknown;
      if (isAuthSyncMessage(parsed)) {
        handleMessage(parsed);
      }
    } catch {
      // Ignore malformed storage events from extensions or manual tampering.
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    channel?.close();
    window.removeEventListener("storage", handleStorage);
  };
}
