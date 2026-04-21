import "server-only";

import { getMessaging } from "firebase-admin/messaging";
import { getAdminApp, getAdminDb } from "@/lib/server/firebase-admin";
import { captureServerException } from "@/lib/server/firebase-observability";

type NotificationPayload = {
  userIds: string[];
  title: string;
  body: string;
  data?: Record<string, string | number | boolean | undefined | null>;
  link?: string;
};

const TOKEN_ERROR_CODES = new Set([
  "messaging/invalid-registration-token",
  "messaging/registration-token-not-registered",
]);

function getAbsoluteLink(link?: string) {
  if (!link) {
    return undefined;
  }

  if (/^https?:\/\//i.test(link)) {
    return link;
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kisankamai.com";
  return `${origin.replace(/\/$/, "")}${link.startsWith("/") ? link : `/${link}`}`;
}

function normalizeData(data?: NotificationPayload["data"]) {
  if (!data) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  );
}

async function loadTokenOwners(userIds: string[]) {
  const uniqueUserIds = Array.from(new Set(userIds.filter(Boolean)));
  if (!uniqueUserIds.length) {
    return [];
  }

  const snapshots = await Promise.all(
    uniqueUserIds.map((userId) => getAdminDb().collection("users").doc(userId).get())
  );

  return snapshots.flatMap((snapshot, index) => {
    const data = snapshot.data() as { fcmTokens?: string[] } | undefined;
    const tokens = Array.isArray(data?.fcmTokens) ? data?.fcmTokens.filter(Boolean) : [];
    return tokens.map((token) => ({
      userId: uniqueUserIds[index],
      token,
    }));
  });
}

async function pruneInvalidTokens(invalidTokens: Array<{ userId: string; token: string }>) {
  if (!invalidTokens.length) {
    return;
  }

  const grouped = invalidTokens.reduce<Map<string, Set<string>>>((map, item) => {
    const tokens = map.get(item.userId) || new Set<string>();
    tokens.add(item.token);
    map.set(item.userId, tokens);
    return map;
  }, new Map<string, Set<string>>());

  await Promise.all(
    Array.from(grouped.entries()).map(async ([userId, tokensToRemove]) => {
      const ref = getAdminDb().collection("users").doc(userId);
      const snapshot = await ref.get();
      const data = snapshot.data() as { fcmTokens?: string[] } | undefined;
      const nextTokens = (data?.fcmTokens || []).filter((token) => !tokensToRemove.has(token));
      await ref.set({ fcmTokens: nextTokens }, { merge: true });
    })
  );
}

export async function sendPushNotificationToUsers(payload: NotificationPayload) {
  const tokenOwners = await loadTokenOwners(payload.userIds);
  if (!tokenOwners.length) {
    return { attempted: 0, successCount: 0, failureCount: 0 };
  }

  try {
    const response = await getMessaging(getAdminApp()).sendEachForMulticast({
      tokens: tokenOwners.map((item) => item.token),
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: normalizeData(payload.data),
      webpush: {
        fcmOptions: {
          link: getAbsoluteLink(payload.link),
        },
        notification: {
          icon: "/icon-192x192.png",
          badge: "/icon-192x192.png",
        },
      },
    });

    const invalidTokens = response.responses.flatMap((result, index) => {
      const code = result.error?.code;
      return code && TOKEN_ERROR_CODES.has(code) ? [tokenOwners[index]] : [];
    });

    await pruneInvalidTokens(invalidTokens);

    if (response.failureCount > 0) {
      captureServerException(
        new Error("Some Firebase push notifications failed."),
        {
          failureCount: response.failureCount,
          attempted: tokenOwners.length,
          codes: response.responses
            .map((result) => result.error?.code)
            .filter(Boolean),
        }
      );
    }

    return {
      attempted: tokenOwners.length,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    captureServerException(error, {
      userIds: payload.userIds,
      title: payload.title,
      link: payload.link,
      source: "firebase-messaging",
    });
    return { attempted: tokenOwners.length, successCount: 0, failureCount: tokenOwners.length };
  }
}
