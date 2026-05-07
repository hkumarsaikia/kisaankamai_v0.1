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

const SUPPORT_CATEGORIES = [
  { value: "listing", label: { en: "Listing Help", mr: "लिस्टिंग मदत" } },
  { value: "booking", label: { en: "Booking Help", mr: "बुकिंग मदत" } },
  { value: "verification", label: { en: "Verification", mr: "पडताळणी" } },
  { value: "payout", label: { en: "Payout Issue", mr: "पेआउट समस्या" } },
  { value: "general", label: { en: "General Support", mr: "सामान्य सपोर्ट" } },
  { value: "other", label: { en: "Other", mr: "इतर" } },
];

export function ProfileSupportWorkspace({
  family,
  session,
}: ProfileSupportWorkspaceProps) {
  const { langText } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [submitState, setSubmitState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [formState, setFormState] = useState({
    fullName: session.profile.fullName || session.user.name || "",
    phone: session.profile.phone || session.user.phone || "",
    email: session.profile.email || session.user.email || "",
    category: "",
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
          category: formState.category || "general",
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
    <main className="flex w-full items-start justify-center pb-16 pt-0">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-0">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-6 md:p-10 border border-outline-variant/30 backdrop-blur-sm">
              <h2 className="mb-6 flex items-center gap-2 font-headline text-2xl font-bold text-primary-container">
                <span className="material-symbols-outlined text-secondary">edit_document</span>
                {langText("Submit a Request", "विनंती सबमिट करा")}
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="block font-label text-sm font-semibold text-on-surface">
                      {langText("Full Name", "पूर्ण नाव")}
                    </span>
                    <input
                      className="w-full rounded-lg border-outline-variant bg-surface-bright px-4 py-3 text-on-surface transition-colors focus:border-primary-container focus:ring-primary-container"
                      placeholder={langText("Enter your full name", "तुमचे पूर्ण नाव प्रविष्ट करा")}
                      value={formState.fullName}
                      onChange={(event) => updateField("fullName", event.target.value)}
                      type="text"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="block font-label text-sm font-semibold text-on-surface">
                      {langText("Phone Number", "फोन नंबर")}
                    </span>
                    <input
                      className="w-full rounded-lg border-outline-variant bg-surface-bright px-4 py-3 text-on-surface transition-colors focus:border-primary-container focus:ring-primary-container"
                      placeholder="+91 XXXXX XXXXX"
                      value={formState.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      type="tel"
                    />
                  </label>
                </div>

                <label className="space-y-2 block">
                  <span className="block font-label text-sm font-semibold text-on-surface">
                    {langText("Email Address", "ईमेल पत्ता")}
                  </span>
                  <input
                    className="w-full rounded-lg border-outline-variant bg-surface-bright px-4 py-3 text-on-surface transition-colors focus:border-primary-container focus:ring-primary-container"
                    placeholder="your.email@example.com"
                    value={formState.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    type="email"
                  />
                </label>

                <label className="space-y-2 block">
                  <span className="block font-label text-sm font-semibold text-on-surface">
                    {langText("Issue Category", "समस्येचा प्रकार")}
                  </span>
                  <div className="relative">
                    <select
                      className="w-full appearance-none rounded-lg border-outline-variant bg-surface-bright px-4 py-3 pr-12 text-on-surface transition-colors focus:border-primary-container focus:ring-primary-container"
                      value={formState.category}
                      onChange={(event) => updateField("category", event.target.value)}
                    >
                      <option value="">{langText("Select a category", "प्रकार निवडा")}</option>
                      {SUPPORT_CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>
                          {langText(category.label.en, category.label.mr)}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pr-3 text-outline">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </label>

                <label className="space-y-2 block">
                  <span className="block font-label text-sm font-semibold text-on-surface">
                    {langText("Issue Details", "समस्येचा तपशील")}
                  </span>
                  <textarea
                    className="w-full resize-none rounded-lg border-outline-variant bg-surface-bright px-4 py-3 text-on-surface transition-colors focus:border-primary-container focus:ring-primary-container"
                    placeholder={langText("Please describe your issue in detail.", "कृपया आपल्या समस्येचे सविस्तर वर्णन करा.")}
                    rows={5}
                    value={formState.message}
                    onChange={(event) => updateField("message", event.target.value)}
                  />
                </label>

                {error ? (
                  <div className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm font-medium text-error">
                    {error}
                  </div>
                ) : null}

                <div className="pt-2">
                  <button
                    className={`kk-flow-button flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg font-bold text-on-primary shadow-md transition-all hover:shadow-lg md:w-auto ${
                      submitState === "success" ? "bg-emerald-600" : "bg-primary-container hover:bg-primary"
                    }`}
                    type="submit"
                    disabled={isPending}
                    data-loading={isPending ? "true" : "false"}
                    aria-busy={isPending}
                  >
                    {isPending ? <span className="kk-flow-spinner" aria-hidden="true" /> : null}
                    {submitLabel}
                    <span className="material-symbols-outlined ml-1">
                      {submitState === "success" ? "task_alt" : "send"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-1">
            <div className="group rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-lg transition-colors hover:border-secondary/30">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 transition-colors group-hover:bg-secondary/20">
                <span className="material-symbols-outlined text-3xl text-secondary">call</span>
              </div>
              <h3 className="mb-1 font-headline text-xl font-bold text-on-surface">
                {langText("Call Support", "कॉल सपोर्ट")}
              </h3>
              <p className="mb-4 text-sm text-on-surface-variant">
                {langText("Available 8 AM to 8 PM.", "सकाळी ८ ते रात्री ८ उपलब्ध.")}
              </p>
              <a
                className="flex items-center gap-2 text-2xl font-bold text-primary-container transition-colors hover:text-primary"
                href={supportContact.phoneHref}
              >
                {supportContact.phoneDisplay}
              </a>
            </div>

            <div className="group rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-lg transition-colors hover:border-[#25D366]/30">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]/10 transition-colors group-hover:bg-[#25D366]/20">
                <span className="material-symbols-outlined text-3xl text-[#25D366]">chat</span>
              </div>
              <h3 className="mb-1 font-headline text-xl font-bold text-on-surface">
                {langText("WhatsApp Help", "व्हॉट्सॲप मदत")}
              </h3>
              <p className="mb-4 text-sm text-on-surface-variant">
                {langText(`Chat with ${supportContact.primaryContactName}`, `${supportContact.primaryContactName} यांच्याशी चॅट करा`)}
              </p>
              <a
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] px-6 py-3 font-bold text-[#25D366] transition-all hover:bg-[#25D366] hover:text-white"
                href={supportContact.whatsappHref}
              >
                <span className="material-symbols-outlined">forum</span>
                {langText("Message on WhatsApp", "WhatsApp वर संदेश पाठवा")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
