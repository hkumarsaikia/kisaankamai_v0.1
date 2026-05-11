"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { LazyMap } from "@/components/LazyMap";
import { useLanguage } from "@/components/LanguageContext";
import {
  COMING_SOON_CONTACT_PLACEHOLDER,
  COMING_SOON_NOTIFY_MODE,
} from "@/lib/coming-soon-config.js";
import { HOMEPAGE_MARKERS } from "@/lib/map-data";
import { postJson } from "@/lib/client/forms";
import { NORTHERN_MAHARASHTRA_SERVICE_AREAS } from "@/lib/service-areas.js";
import { supportContact } from "@/lib/support-contact";

const trustPartners = [
  { icon: "agriculture" },
  { icon: "account_balance" },
  { icon: "eco" },
  { icon: "verified_user" },
];

export default function ComingSoonPage() {
  const { langText } = useLanguage();
  const [notifyState, setNotifyState] = useState<"idle" | "form">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const handleNotifySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contact.trim() || isSubmitting) {
      return;
    }

    setError("");
    setSubmitState("pending");
    setIsSubmitting(true);

    try {
      await postJson<{ ok: boolean; id: string }>("/api/forms/coming-soon-notify", {
        contact: contact.trim(),
        sourcePath: "/coming-soon",
      });
      setSubmitState("success");
      setContact("");

      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }

      resetTimeoutRef.current = window.setTimeout(() => {
        setSubmitState("idle");
        setNotifyState("idle");
        resetTimeoutRef.current = null;
      }, 1400);
    } catch (submitError) {
      setSubmitState("error");
      setError(submitError instanceof Error ? submitError.message : langText("Could not submit this request.", "ही विनंती सबमिट करता आली नाही."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-secondary-container selection:text-on-secondary-container">
      <main className="min-h-screen pt-24">
        <section className="relative overflow-hidden bg-surface-container-low py-16">
          <div className="kk-dark-image-overlay opacity-[0.04] dark:opacity-[0.12]" />
          <div className="relative mx-auto max-w-screen-2xl px-8">
            <h2 className="mb-12 text-center text-sm font-bold uppercase tracking-[0.2em] text-outline">
              {langText("Building Rural Prosperity with Strategic Partners", "धोरणात्मक भागीदारीतून ग्रामीण समृद्धी")}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-60 grayscale transition-all duration-700 hover:grayscale-0 md:gap-24">
              {trustPartners.map((partner) => (
                <div key={partner.icon} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {partner.icon}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 px-8 py-24 md:grid-cols-12">
          <div className="relative overflow-hidden rounded-[2rem] bg-surface-container-lowest p-8 shadow-sm md:col-span-8">
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="flex-1 space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-fixed px-4 py-1 text-xs font-bold uppercase tracking-wider text-on-primary-fixed">
                  {langText("Now Expanding", "आता विस्तार सुरू")}
                </span>
                <h3 className="font-headline text-4xl font-extrabold leading-tight tracking-tight text-primary">
                  {langText("Operating across", "सेवा सुरू आहे")} <br />
                  {langText("14 Districts of Maharashtra", "महाराष्ट्रातील १४ जिल्ह्यांमध्ये")}
                </h3>
                <p className="max-w-md leading-relaxed text-on-surface-variant">
                  {langText(
                    "Our expansion network is focused on dependable equipment delivery across the Northern Maharashtra service corridor.",
                    "आमचे विस्तार नेटवर्क उत्तर महाराष्ट्रातील सेवा क्षेत्रात विश्वासार्ह उपकरण उपलब्धतेवर केंद्रित आहे."
                  )}
                </p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2 pt-4 text-sm font-semibold text-primary/80">
                  {NORTHERN_MAHARASHTRA_SERVICE_AREAS.map(({ areaLabel }) => (
                    <li key={areaLabel} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      {areaLabel}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container shadow-inner">
                <LazyMap
                  center={[19.62, 75.58]}
                  zoom={7}
                  markers={HOMEPAGE_MARKERS}
                  height="100%"
                  className="rounded-none"
                  showControls
                  deferUntilVisible={false}
                />
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-[2rem] bg-primary p-10 text-on-primary shadow-2xl md:col-span-4">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full bg-primary-container opacity-50 blur-3xl" />
            <div className="relative z-10">
              <h3 className="mb-4 font-headline text-3xl font-extrabold leading-tight">
                {langText("Digital Farming in your pocket.", "डिजिटल शेती तुमच्या मोबाईलमध्ये.")}
              </h3>
              <p className="mb-8 text-lg opacity-80">
                {langText("Manage rentals and track earnings on the move.", "भाडे व्यवहार आणि कमाईची माहिती प्रवासातही सांभाळा.")}
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <span className="material-symbols-outlined text-4xl">phone_iphone</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-60">Mobile App</p>
                  <p className="font-bold">{langText("Coming Soon to iOS & Play Store", "लवकरच iOS आणि Play Store वर")}</p>
                </div>
              </div>

              {COMING_SOON_NOTIFY_MODE === "single-contact-reveal" ? (
                <div className="overflow-hidden rounded-[2rem] transition-all duration-300 ease-out">
                  {notifyState === "idle" ? (
                    <button
                      className="kk-deep-cta w-full rounded-full py-4 font-bold"
                      type="button"
                      onClick={() => setNotifyState("form")}
                    >
                      {langText("Notify Me", "मला कळवा")}
                    </button>
                  ) : null}

                  {notifyState === "form" ? (
                    <form className="space-y-3 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-1" onSubmit={handleNotifySubmit}>
                      <input
                        className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/65 focus:border-white/50"
                        placeholder={COMING_SOON_CONTACT_PLACEHOLDER}
                        type="text"
                        value={contact}
                        onChange={(event) => {
                          setContact(event.target.value);
                          setSubmitState("idle");
                          setError("");
                        }}
                        disabled={isSubmitting}
                      />
                      {error ? <p className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white">{error}</p> : null}
                      <button
                        className={`kk-flow-button kk-deep-cta flex w-full items-center justify-center gap-2 rounded-full py-4 font-bold ${
                          submitState === "success" ? "bg-emerald-600" : ""
                        }`}
                        type="submit"
                        disabled={isSubmitting || submitState === "success"}
                        data-loading={isSubmitting ? "true" : "false"}
                        aria-busy={isSubmitting}
                      >
                        {isSubmitting ? <span className="kk-flow-spinner" aria-hidden="true" /> : null}
                        <span>
                          {submitState === "pending"
                            ? langText("Submitting...", "सबमिट करत आहे...")
                            : submitState === "success"
                              ? langText("Submitted", "सबमिट झाले")
                              : langText("Submit", "सबमिट करा")}
                        </span>
                        <span className="material-symbols-outlined text-lg">
                          {submitState === "success" ? "task_alt" : "send"}
                        </span>
                      </button>
                    </form>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mx-auto mb-24 max-w-screen-2xl px-8">
          <div className="flex flex-col items-center justify-between gap-8 rounded-[2rem] bg-surface-container-high px-8 py-12 md:flex-row md:px-16">
            <div className="flex items-center gap-6">
              <div className="rounded-2xl bg-primary-container p-4">
                <span className="material-symbols-outlined text-4xl text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                  support_agent
                </span>
              </div>
              <div>
                <h4 className="font-headline text-xl font-extrabold text-primary">Need assistance?</h4>
                <p className="text-on-surface-variant">
                  {langText("Our support team is available from 8 AM to 8 PM.", "आमची सपोर्ट टीम सकाळी ८ ते रात्री ८ उपलब्ध आहे.")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                className="flex items-center gap-3 rounded-2xl border border-outline-variant/10 bg-surface-container-lowest px-6 py-4 font-bold shadow-sm transition-all hover:shadow-md"
                href={supportContact.emailHref}
              >
                <span className="material-symbols-outlined text-secondary">mail</span>
                {supportContact.email}
              </a>
              <a
                className="flex items-center gap-3 rounded-2xl border border-outline-variant/10 bg-surface-container-lowest px-6 py-4 font-bold shadow-sm transition-all hover:shadow-md"
                href={supportContact.phoneHref}
              >
                <span className="material-symbols-outlined text-secondary">call</span>
                {supportContact.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
