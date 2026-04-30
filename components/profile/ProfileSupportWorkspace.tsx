"use client";

import { postJson } from "@/lib/client/forms";
import { useLanguage } from "@/components/LanguageContext";
import type { LocalSession } from "@/lib/local-data/types";
import { supportContact } from "@/lib/support-contact";
import { useState, useTransition } from "react";

type ProfileSupportWorkspaceProps = {
  family: "owner-profile" | "renter-profile";
  session: LocalSession;
};

const OWNER_CATEGORIES = [
  { value: "Listing Help", label: { en: "Listing Help", mr: "लिस्टिंग मदत" } },
  { value: "Booking Request", label: { en: "Booking Request", mr: "बुकिंग विनंती" } },
  { value: "Payout Question", label: { en: "Payout Question", mr: "पेआउट प्रश्न" } },
  { value: "Verification Issue", label: { en: "Verification Issue", mr: "पडताळणी समस्या" } },
  { value: "Other", label: { en: "Other", mr: "इतर" } },
];

const RENTER_CATEGORIES = [
  { value: "Booking Help", label: { en: "Booking Help", mr: "बुकिंग मदत" } },
  { value: "Equipment Issue", label: { en: "Equipment Issue", mr: "उपकरण समस्या" } },
  { value: "Payment Question", label: { en: "Payment Question", mr: "पेमेंट प्रश्न" } },
  { value: "Cancellation Support", label: { en: "Cancellation Support", mr: "रद्दीकरण मदत" } },
  { value: "Other", label: { en: "Other", mr: "इतर" } },
];

export function ProfileSupportWorkspace({
  family,
  session,
}: ProfileSupportWorkspaceProps) {
  const { langText } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [submitState, setSubmitState] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const categories =
    family === "owner-profile" ? OWNER_CATEGORIES : RENTER_CATEGORIES;
  const [formState, setFormState] = useState({
    fullName: session.profile.fullName || session.user.name || "",
    phone: session.profile.phone || session.user.phone || "",
    email: session.profile.email || session.user.email || "",
    category: categories[0].value,
    message: "",
  });

  const submitLabel =
    submitState === "pending"
      ? langText("Submitting...", "सबमिट करत आहे...")
      : submitState === "success"
        ? langText("Submitted", "सबमिट झाले")
        : langText("Submit Request", "विनंती सबमिट करा");

  const updateField = (field: keyof typeof formState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
    if (submitState !== "idle") {
      setSubmitState("idle");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitState("pending");

    startTransition(async () => {
      try {
        await postJson<{ ok: boolean; id: string }>("/api/forms/support-request", {
          fullName: formState.fullName,
          phone: formState.phone,
          email: formState.email || undefined,
          category: formState.category,
          message: formState.message,
          sourcePath:
            family === "owner-profile"
              ? "/owner-profile/support"
              : "/renter-profile/support",
        });
        setSubmitState("success");
      } catch (submitError) {
        setSubmitState("error");
        setError(
          submitError instanceof Error
            ? submitError.message
            : langText("Support request failed.", "सपोर्ट विनंती अयशस्वी झाली.")
        );
      }
    });
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-black text-primary">
          {langText("Support Request", "सपोर्ट विनंती")}
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          {langText(
            "Use the workspace support form for booking, listing, verification, and payout issues.",
            "बुकिंग, लिस्टिंग, पडताळणी आणि पेआउट समस्यांसाठी वर्कस्पेस सपोर्ट फॉर्म वापरा."
          )}
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">
                {langText("Full Name", "पूर्ण नाव")}
              </span>
              <input
                value={formState.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                className="kk-input"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">{langText("Phone", "फोन")}</span>
              <input
                value={formState.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="kk-input"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-on-surface">
                {langText("Email", "ईमेल")}
              </span>
              <input
                value={formState.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="kk-input"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-on-surface">
                {langText("Category", "वर्ग")}
              </span>
              <select
                value={formState.category}
                onChange={(event) => updateField("category", event.target.value)}
                className="kk-input"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {langText(category.label.en, category.label.mr)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-on-surface">
                {langText("Issue Details", "समस्येचा तपशील")}
              </span>
              <textarea
                value={formState.message}
                onChange={(event) => updateField("message", event.target.value)}
                rows={6}
                className="kk-input"
                placeholder={langText(
                  "Describe the problem clearly so the support team can help quickly.",
                  "सपोर्ट टीमला त्वरीत मदत करता यावी म्हणून समस्या स्पष्टपणे लिहा."
                )}
              />
            </label>
          </div>

          {error ? (
            <div className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm font-medium text-error">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className={`kk-flow-button inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white ${
              submitState === "success" ? "bg-emerald-600" : "bg-primary-container"
            }`}
            data-loading={isPending ? "true" : "false"}
            aria-busy={isPending}
          >
            {isPending ? <span className="kk-flow-spinner" aria-hidden="true" /> : null}
            <span className="material-symbols-outlined text-[18px]">
              {submitState === "success" ? "task_alt" : "send"}
            </span>
            {submitLabel}
          </button>
        </form>
      </div>

      <div className="space-y-5">
        <section className="rounded-[1.75rem] bg-primary-container p-6 text-white shadow-sm">
          <h3 className="text-xl font-black">{langText("Direct Channels", "थेट संपर्क")}</h3>
          <div className="mt-5 space-y-4">
            <a
              href={supportContact.phoneHref}
              className="block rounded-2xl bg-white/10 p-4 transition hover:bg-white/15"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-fixed">
                {langText("Call Support", "सपोर्टला कॉल करा")}
              </p>
              <p className="mt-1 text-lg font-bold">{supportContact.phoneDisplay}</p>
              <p className="text-sm text-white/75">{supportContact.serviceHours} {langText("Daily", "दररोज")}</p>
            </a>
            <a
              href={supportContact.whatsappHref}
              className="block rounded-2xl bg-[#1f9d57] p-4 transition hover:bg-[#19864a]"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                WhatsApp
              </p>
              <p className="mt-1 text-lg font-bold">
                {langText(`Chat with ${supportContact.primaryContactName}`, `${supportContact.primaryContactName} यांच्याशी चॅट करा`)}
              </p>
              <p className="text-sm text-white/75">{supportContact.whatsappDisplay}</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
