"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { postJson } from "@/lib/client/forms";
import { assetPath } from "@/lib/site";
import { supportContact } from "@/lib/support-contact";

const supportHeroImage = assetPath("/assets/generated/farmer_handshake.png");

const supportHtmlCategories = [
  {
    icon: "person",
    value: "Account",
    title: { en: "Account", mr: "खाते" },
    detail: { en: "Manage your profile, language preferences, and security settings.", mr: "प्रोफाइल, भाषा आणि सुरक्षा सेटिंग्ज व्यवस्थापित करा." },
    note: { en: "Account management and security.", mr: "खाते व्यवस्थापन आणि सुरक्षा." },
    halo: "bg-primary-fixed",
    iconTone: "bg-primary/10 text-primary",
  },
  {
    icon: "calendar_today",
    value: "Booking Inquiry",
    title: { en: "Bookings", mr: "बुकिंग" },
    detail: { en: "Track active rentals, cancellations, and delivery status.", mr: "सक्रिय भाडे, रद्दीकरण आणि वितरण स्थिती तपासा." },
    note: { en: "Booking status and delivery.", mr: "बुकिंग स्थिती आणि वितरण." },
    halo: "bg-secondary-fixed",
    iconTone: "bg-secondary-container/20 text-secondary",
  },
  {
    icon: "handshake",
    value: "Pricing & Settlement",
    title: { en: "Pricing & Settlement", mr: "किंमत आणि थेट व्यवहार" },
    detail: { en: "Owner-listed rates, direct settlement, and Offline settlement coordination guidance.", mr: "मालकाने दिलेले दर, थेट व्यवहार आणि ऑफलाइन समन्वय मार्गदर्शन." },
    note: { en: "Direct owner-renter settlement.", mr: "मालक आणि भाडेकरू यांच्यात थेट व्यवहार." },
    halo: "bg-tertiary-fixed",
    iconTone: "bg-tertiary-container/10 text-tertiary",
  },
  {
    icon: "build",
    value: "Support Issue",
    title: { en: "Platform Issues", mr: "प्लॅटफॉर्म समस्या" },
    detail: { en: "Report bugs, app crashes, or technical difficulties.", mr: "बग, अॅप क्रॅश किंवा तांत्रिक अडचणी कळवा." },
    note: { en: "Technical difficulties.", mr: "तांत्रिक अडचणी." },
    halo: "bg-error-container",
    iconTone: "bg-error-container/50 text-error",
  },
] as const;

const issueOptions = ["Booking Inquiry", "Pricing & Settlement", "Equipment Listing Help", "Other"] as const;

const supportFormControlClass =
  "w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant text-on-surface placeholder:text-on-surface-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";

export default function SupportPage() {
  const { langText, text } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [formState, setFormState] = useState({
    fullName: "",
    phone: "",
    inquiryType: "",
    message: "",
  });

  const submitLabel =
    submitState === "pending"
      ? langText("Submitting...", "सबमिट करत आहे...")
      : submitState === "success"
        ? langText("Submitted", "सबमिट झाले")
        : langText("Submit Request", "विनंती सबमिट करा");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const updateField = (field: keyof typeof formState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
    if (submitState !== "idle") {
      setSubmitState("idle");
      setError("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setError("");
    setSubmitState("pending");
    setIsSubmitting(true);

    try {
      await postJson<{ ok: boolean; id: string }>("/api/forms/support-request", {
        fullName: formState.fullName,
        phone: formState.phone,
        category: formState.inquiryType,
        inquiryType: formState.inquiryType,
        message: formState.message,
        sourcePath: "/support",
      });
      setSubmitState("success");
    } catch (submitError) {
      setSubmitState("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : langText("Support request failed.", "सहाय्य विनंती अयशस्वी झाली.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-background">
      <main className="pt-20">
        <section className="relative flex min-h-[716px] items-center justify-center overflow-hidden bg-primary px-6 dark:bg-primary-container">
          <div className="absolute inset-0 z-0">
            <img
              alt="Lush green agricultural fields in Maharashtra"
              className="h-full w-full object-cover object-[center_18%]"
              src={supportHeroImage}
            />
            <div className="kk-banner-image-overlay" />
          </div>
          <div className="relative z-10 mx-auto max-w-4xl space-y-8 pt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-label text-sm font-medium tracking-wide text-white/90 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {langText("Support Center", "मदत केंद्र")}
            </div>
            <h1 className="font-headline text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
              {langText("How can we help you today?", "आज आम्ही तुम्हाला कशी मदत करू शकतो?")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
              {langText(
                "Find quick answers, explore guides, or reach out to our dedicated support team. We're here to keep your farm moving.",
                "जलद उत्तरे मिळवा, मार्गदर्शक पहा किंवा आमच्या सपोर्ट टीमशी संपर्क साधा. तुमचे शेतीचे काम सुरळीत ठेवण्यासाठी आम्ही येथे आहोत."
              )}
            </p>
          </div>
        </section>

        <section className="relative z-20 mx-auto -mt-16 mb-24 max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {supportHtmlCategories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => updateField("inquiryType", category.value)}
                className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white shadow-xl p-8 text-left shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/20"
              >
                <div className={`absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-bl-full ${category.halo} opacity-20 transition-opacity group-hover:opacity-50`} />
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${category.iconTone} transition-transform group-hover:scale-110`}>
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {category.icon}
                  </span>
                </div>
                <h3 className="mb-2 font-headline text-xl font-bold text-on-surface dark:text-white">{text(category.title)}</h3>
                <p className="mb-4 text-sm text-on-surface-variant dark:text-slate-300">{text(category.detail)}</p>
                <p className="text-sm text-on-surface-variant opacity-80 dark:text-slate-400">{text(category.note)}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto mb-24 grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-12">
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-surface-container-high dark:border-slate-800 dark:bg-slate-950">
            <h2 className="mb-2 font-headline text-3xl font-bold text-on-surface">{langText("Send us a message", "आम्हाला संदेश पाठवा")}</h2>
            <p className="mb-8 font-body text-on-surface-variant">
              {langText("We usually respond within 24 hours.", "आम्ही साधारणपणे २४ तासांत प्रतिसाद देतो.")}
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="font-label text-sm font-medium text-on-surface">{langText("Full Name", "पूर्ण नाव")}</label>
                  <input
                    className={supportFormControlClass}
                    required
                    placeholder={langText("Your name", "तुमचे नाव")}
                    type="text"
                    value={formState.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-medium text-on-surface">{langText("Phone Number", "मोबाईल क्रमांक")}</label>
                  <input
                    className={supportFormControlClass}
                    required
                    placeholder="+91"
                    type="tel"
                    value={formState.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label text-sm font-medium text-on-surface">{langText("Issue Type", "समस्या प्रकार")}</label>
                <select
                  className={supportFormControlClass}
                  required
                  value={formState.inquiryType}
                  onChange={(event) => updateField("inquiryType", event.target.value)}
                >
                  <option disabled value="">
                    {langText("Select a category", "प्रकार निवडा")}
                  </option>
                  {issueOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label text-sm font-medium text-on-surface">{langText("Message", "संदेश")}</label>
                <textarea
                  className={supportFormControlClass}
                  required
                  placeholder={langText("Describe your issue in detail...", "तुमची समस्या सविस्तर लिहा...")}
                  rows={4}
                  value={formState.message}
                  onChange={(event) => updateField("message", event.target.value)}
                />
              </div>

              {error ? <p className="rounded-xl bg-error-container px-4 py-3 text-sm font-semibold text-error">{error}</p> : null}

              <button
                type="submit"
                aria-label={langText("Send Message", "संदेश पाठवा")}
                disabled={isSubmitting || submitState === "pending"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-8 py-4 font-label font-medium text-on-primary transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70 dark:text-white dark:hover:bg-primary-container/80 md:w-auto"
              >
                {isSubmitting ? <span className="kk-flow-spinner" aria-hidden="true" /> : null}
                {submitState === "success" ? <span className="material-symbols-outlined text-sm">check_circle</span> : null}
                {submitLabel}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>
          </div>

          <div className="space-y-4 self-start lg:col-span-5">
            <div className="rounded-3xl bg-surface-container p-5 dark:bg-slate-900 md:p-6">
              <h2 className="mb-5 font-headline text-2xl font-bold text-on-surface dark:text-white">
                {langText("Need urgent help?", "तातडीची मदत हवी आहे का?")}
              </h2>
              <div className="space-y-3">
                <div className="kk-deep-cta flex items-start gap-4 rounded-2xl border border-surface-container-high bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-fixed">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      call
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-on-surface dark:text-white">
                      {langText("Call Us", "आम्हाला कॉल करा")}
                    </h4>
                    <p className="mb-2 text-sm text-on-surface-variant dark:text-slate-300">
                      {supportContact.primaryContactName} · {supportContact.serviceHours}
                    </p>
                    <a className="font-label text-lg font-semibold text-primary hover:underline dark:text-emerald-300" href={supportContact.phoneHref}>
                      {supportContact.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-surface-container-high bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1f9d57]">
                    <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                      chat
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-on-surface dark:text-white">
                      {langText("WhatsApp Support", "WhatsApp सपोर्ट")}
                    </h4>
                    <p className="mb-2 text-sm text-on-surface-variant dark:text-slate-300">
                      {langText("Quick text assistance", "जलद मजकूर मदत")}
                    </p>
                    <a className="flex items-center gap-1 font-label font-semibold text-[#2E7D32] hover:underline dark:text-emerald-300" href={supportContact.whatsappHref}>
                      {langText(`Chat with ${supportContact.primaryContactName}`, `${supportContact.primaryContactName} यांच्याशी चॅट करा`)}
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-outline-variant/30 pt-5">
                <h4 className="mb-2 font-headline font-bold text-on-surface dark:text-white">
                  {langText("Support Coverage", "सपोर्ट कव्हरेज")}
                </h4>
                <p className="text-sm leading-relaxed text-on-surface-variant dark:text-slate-300">
                  {langText(
                    "Support is available for equipment rentals, owner listings, pricing, direct settlement, and account questions across current Maharashtra service areas.",
                    "सध्याच्या महाराष्ट्र सेवा भागात उपकरण भाडे, मालक लिस्टिंग, किंमत, थेट व्यवहार आणि खाते प्रश्नांसाठी सपोर्ट उपलब्ध आहे."
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
