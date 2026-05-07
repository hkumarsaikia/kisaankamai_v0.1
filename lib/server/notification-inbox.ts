import "server-only";

import { randomUUID } from "node:crypto";
import type { NotificationRecord, NotificationTone } from "@/lib/local-data/types";
import { getAdminDb } from "@/lib/server/firebase-admin";
import { withFirestoreId } from "@/lib/server/firebase-local-helpers";

export const NOTIFICATIONS_COLLECTION = "notifications";

type CreateUserNotificationInput = {
  userIds: string[];
  title: string;
  body: string;
  href?: string;
  icon?: string;
  tone?: NotificationTone;
  data?: Record<string, string | number | boolean | undefined | null>;
};

function nowIso() {
  return new Date().toISOString();
}

function createId() {
  return `notification-${randomUUID().slice(0, 10)}`;
}

function normalizeIso(value: unknown) {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    try {
      return value.toDate().toISOString();
    } catch {
      return nowIso();
    }
  }

  return nowIso();
}

function normalizeData(data?: CreateUserNotificationInput["data"]) {
  if (!data) {
    return undefined;
  }

  const normalized = Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => [key, String(value)])
  );

  return Object.keys(normalized).length ? normalized : undefined;
}

function normalizeTone(input?: string | null): NotificationTone {
  if (input === "success" || input === "warning" || input === "danger" || input === "info") {
    return input;
  }

  return "neutral";
}

function deriveNotificationTone(input: CreateUserNotificationInput): NotificationTone {
  if (input.tone) {
    return input.tone;
  }

  const status = String(input.data?.status || "").toLowerCase();
  if (status === "cancelled") {
    return "danger";
  }

  if (status === "active" || status === "confirmed" || status === "completed") {
    return "success";
  }

  if (status === "pending" || input.title.toLowerCase().includes("request")) {
    return "warning";
  }

  return "info";
}

function deriveNotificationIcon(input: CreateUserNotificationInput) {
  if (input.icon) {
    return input.icon;
  }

  const status = String(input.data?.status || "").toLowerCase();
  if (status === "cancelled") {
    return "cancel";
  }

  if (input.data?.bookingId) {
    return status === "confirmed" || status === "completed" ? "check_circle" : "pending_actions";
  }

  if (input.data?.listingId) {
    return "agriculture";
  }

  return "notifications";
}

function notificationsCollection() {
  return getAdminDb().collection(NOTIFICATIONS_COLLECTION);
}

function mapNotificationFromFirestore(data: Partial<NotificationRecord> & { id?: string }): NotificationRecord {
  return {
    id: data.id || createId(),
    userId: String(data.userId || ""),
    title: String(data.title || "Kisan Kamai update"),
    body: String(data.body || ""),
    href: typeof data.href === "string" && data.href ? data.href : undefined,
    icon: typeof data.icon === "string" && data.icon ? data.icon : "notifications",
    tone: normalizeTone(data.tone),
    data: data.data && typeof data.data === "object" ? data.data : undefined,
    readAt: data.readAt ? normalizeIso(data.readAt) : undefined,
    createdAt: normalizeIso(data.createdAt),
  };
}

export async function createUserNotifications(input: CreateUserNotificationInput) {
  const userIds = Array.from(new Set(input.userIds.filter(Boolean)));
  if (!userIds.length) {
    return [];
  }

  const timestamp = nowIso();
  const batch = getAdminDb().batch();
  const records = userIds.map((userId) => {
    const record: NotificationRecord = {
      id: createId(),
      userId,
      title: input.title,
      body: input.body,
      href: input.href,
      icon: deriveNotificationIcon(input),
      tone: deriveNotificationTone(input),
      data: normalizeData(input.data),
      createdAt: timestamp,
    };

    batch.set(notificationsCollection().doc(record.id), record);
    return record;
  });

  await batch.commit();
  return records;
}

export async function getUnreadNotificationsForUser(userId: string, limit = 8) {
  if (!userId) {
    return [];
  }

  const snapshot = await notificationsCollection().where("userId", "==", userId).get();
  return snapshot.docs
    .map((doc) => mapNotificationFromFirestore(withFirestoreId(doc.id, doc.data() as Partial<NotificationRecord>)))
    .filter((notification) => !notification.readAt)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, Math.max(1, limit));
}

export async function markAllNotificationsRead(userId: string) {
  if (!userId) {
    return 0;
  }

  const snapshot = await notificationsCollection().where("userId", "==", userId).get();
  const unreadDocs = snapshot.docs.filter((doc) => !(doc.data() as Partial<NotificationRecord>).readAt);
  if (!unreadDocs.length) {
    return 0;
  }

  const readAt = nowIso();
  const batch = getAdminDb().batch();
  unreadDocs.forEach((doc) => batch.set(doc.ref, { readAt }, { merge: true }));
  await batch.commit();
  return unreadDocs.length;
}

export async function markNotificationRead(userId: string, notificationId: string) {
  if (!userId || !notificationId) {
    return null;
  }

  const ref = notificationsCollection().doc(notificationId);
  const snapshot = await ref.get();
  if (!snapshot.exists) {
    return null;
  }

  const notification = mapNotificationFromFirestore(
    withFirestoreId(snapshot.id, snapshot.data() as Partial<NotificationRecord>)
  );
  if (notification.userId !== userId) {
    return null;
  }

  if (!notification.readAt) {
    await ref.set({ readAt: nowIso() }, { merge: true });
  }

  return notification;
}
