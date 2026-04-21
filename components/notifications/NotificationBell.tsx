"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { getFirebaseClientAppOrNull } from "@/lib/firebase-client";
import { saveFcmTokenAction } from "@/lib/actions/local-data";
import {
  getFirebaseMessagingServiceWorkerUrl,
  WEB_PUSH_ENABLED,
  WEB_PUSH_PUBLIC_KEY,
} from "@/lib/notifications";

type NotificationBellState =
  | "checking"
  | "ready"
  | "enabling"
  | "enabled"
  | "permission-denied"
  | "unsupported"
  | "missing-config"
  | "error";

function getSavedTokenStorageKey(userId: string) {
  return `kk.notifications.savedToken.${userId}`;
}

function readSavedToken(userId: string) {
  try {
    return window.localStorage.getItem(getSavedTokenStorageKey(userId));
  } catch {
    return null;
  }
}

function writeSavedToken(userId: string, token: string) {
  try {
    window.localStorage.setItem(getSavedTokenStorageKey(userId), token);
  } catch {
    // Ignore storage failures and keep the token registration best-effort.
  }
}

type NotificationBellProps = {
  className?: string;
  compact?: boolean;
};

export function NotificationBell({ className = "", compact = false }: NotificationBellProps) {
  const { user } = useAuth();
  const { langText } = useLanguage();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [state, setState] = useState<NotificationBellState>("checking");
  const [message, setMessage] = useState("");

  const enableNotifications = useCallback(async (requestPermission: boolean) => {
    if (!user?.id) {
      setState("error");
      setMessage(langText("Sign in again before enabling notifications.", "सूचना सक्षम करण्यापूर्वी पुन्हा साइन इन करा."));
      return;
    }

    if (!WEB_PUSH_ENABLED) {
      setState("missing-config");
      setMessage(
        langText(
          "Notifications are unavailable because the Firebase messaging config is missing for this deployment.",
          "या डिप्लॉयमेंटमध्ये Firebase messaging कॉन्फिगरेशन नसल्यामुळे सूचना उपलब्ध नाहीत."
        )
      );
      return;
    }

    setState("enabling");
    setMessage(
      langText(
        "Registering this device for notifications...",
        "या डिव्हाइससाठी सूचना नोंदवत आहोत..."
      )
    );

    try {
      if (requestPermission) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setState(permission === "denied" ? "permission-denied" : "ready");
          setMessage(
            permission === "denied"
              ? langText(
                  "Browser notification permission is blocked. Enable it in browser settings, then reload this page.",
                  "ब्राउझरमधील सूचना परवानगी बंद आहे. ब्राउझर सेटिंगमध्ये ती सक्षम करा आणि हे पृष्ठ पुन्हा लोड करा."
                )
              : langText(
                  "Notification permission was not granted yet.",
                  "सूचना परवानगी अद्याप मिळालेली नाही."
                )
          );
          return;
        }
      }

      const swUrl = getFirebaseMessagingServiceWorkerUrl();
      const app = getFirebaseClientAppOrNull();
      if (!swUrl || !app) {
        throw new Error(
          langText(
            "Firebase messaging is not configured for this deployment.",
            "या डिप्लॉयमेंटसाठी Firebase messaging कॉन्फिगर केलेले नाही."
          )
        );
      }

      const { getMessaging, getToken, isSupported } = await import("firebase/messaging");
      if (!(await isSupported())) {
        throw new Error(
          langText(
            "Firebase messaging is not supported in this browser.",
            "या ब्राउझरमध्ये Firebase messaging समर्थित नाही."
          )
        );
      }

      const registration = await navigator.serviceWorker.register(swUrl, { scope: "/" });
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: WEB_PUSH_PUBLIC_KEY,
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        throw new Error(
          langText(
            "Firebase did not return a notification token for this device.",
            "या डिव्हाइससाठी Firebase ने सूचना टोकन परत केले नाही."
          )
        );
      }

      if (token !== readSavedToken(user.id)) {
        const result = await saveFcmTokenAction(token);
        if (!result.ok) {
          throw new Error(result.error || langText("Could not save the notification token.", "सूचना टोकन जतन करता आले नाही."));
        }

        writeSavedToken(user.id, token);
      }

      setState("enabled");
      setMessage(
        langText(
          "Notifications are enabled for this device.",
          "या डिव्हाइससाठी सूचना सक्षम झाल्या आहेत."
        )
      );
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : langText("Could not enable notifications.", "सूचना सक्षम करता आल्या नाहीत."));
    }
  }, [langText, user?.id]);

  const evaluateSupport = useCallback(async () => {
    if (!WEB_PUSH_ENABLED) {
      setState("missing-config");
      setMessage(
        langText(
          "Notifications are unavailable because the Firebase messaging config is missing for this deployment.",
          "या डिप्लॉयमेंटमध्ये Firebase messaging कॉन्फिगरेशन नसल्यामुळे सूचना उपलब्ध नाहीत."
        )
      );
      return;
    }

    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("Notification" in window)) {
      setState("unsupported");
      setMessage(
        langText(
          "This browser cannot register web notifications here.",
          "या ब्राउझरमध्ये वेब सूचना नोंदवता येत नाहीत."
        )
      );
      return;
    }

    const { isSupported } = await import("firebase/messaging");
    if (!(await isSupported())) {
      setState("unsupported");
      setMessage(
        langText(
          "Firebase messaging is not supported in this browser.",
          "या ब्राउझरमध्ये Firebase messaging समर्थित नाही."
        )
      );
      return;
    }

    if (Notification.permission === "granted") {
      await enableNotifications(false);
      return;
    }

    if (Notification.permission === "denied") {
      setState("permission-denied");
      setMessage(
        langText(
          "Browser notification permission is blocked. Enable it in browser settings, then reload this page.",
          "ब्राउझरमधील सूचना परवानगी बंद आहे. ब्राउझर सेटिंगमध्ये ती सक्षम करा आणि हे पृष्ठ पुन्हा लोड करा."
        )
      );
      return;
    }

    setState("ready");
    setMessage(
      langText(
        "Enable browser notifications to receive booking and account updates on this device.",
        "या डिव्हाइसवर बुकिंग आणि खाते अद्यतने मिळवण्यासाठी ब्राउझर सूचना सक्षम करा."
      )
    );
  }, [enableNotifications, langText]);

  useEffect(() => {
    void evaluateSupport();
  }, [evaluateSupport]);

  useEffect(() => {
    if (!panelOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [panelOpen]);

  const isBusy = state === "checking" || state === "enabling";
  const iconName =
    state === "enabled"
      ? "notifications_active"
      : state === "missing-config" || state === "permission-denied" || state === "unsupported" || state === "error"
        ? "notifications_off"
        : "notifications";
  const title =
    state === "enabled"
      ? langText("Notifications enabled", "सूचना सक्षम")
      : state === "missing-config"
        ? langText("Notifications unavailable", "सूचना उपलब्ध नाहीत")
        : state === "permission-denied"
          ? langText("Notifications blocked", "सूचना बंद")
          : state === "unsupported"
            ? langText("Notifications unsupported", "सूचना समर्थित नाहीत")
            : state === "error"
              ? langText("Notification setup failed", "सूचना सेटअप अयशस्वी")
              : langText("Enable notifications", "सूचना सक्षम करा");

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setPanelOpen((current) => !current)}
        className={`relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 ${className}`.trim()}
        aria-expanded={panelOpen}
        aria-haspopup="dialog"
        aria-label={title}
        title={title}
      >
        <span className={`material-symbols-outlined ${compact ? "text-[20px]" : ""} ${isBusy ? "animate-pulse" : ""}`.trim()}>{iconName}</span>
        {state === "enabled" ? (
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-secondary dark:border-slate-900" />
        ) : null}
      </button>

      {panelOpen ? (
        <div className={`absolute right-0 top-full z-50 mt-3 ${compact ? "w-72" : "w-80"} rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-on-surface dark:text-slate-100">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant dark:text-slate-400">{message}</p>
            </div>
            <span className="material-symbols-outlined text-primary dark:text-emerald-300">{iconName}</span>
          </div>

          {state === "ready" || state === "enabled" || state === "error" ? (
            <button
              type="button"
              onClick={() => void enableNotifications(state !== "enabled")}
              disabled={isBusy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-base">
                {state === "enabled" ? "refresh" : "notifications_active"}
              </span>
              <span>
                {state === "enabled"
                  ? langText("Refresh token", "टोकन रीफ्रेश करा")
                  : isBusy
                    ? langText("Working...", "काम सुरू आहे...")
                    : langText("Enable on this device", "या डिव्हाइसवर सक्षम करा")}
              </span>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
