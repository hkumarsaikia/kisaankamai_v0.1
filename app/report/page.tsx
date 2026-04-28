"use client";

import { ContentImage } from "@/components/ContentImage";
import { useLanguage } from "@/components/LanguageContext";
import { postJson } from "@/lib/client/forms";
import { supportContact } from "@/lib/support-contact";
import { type FormEvent, type ReactNode, useState, useTransition } from "react";

const categories = [
  {
    icon: "info",
    value: "Wrong Equipment Details",
    label: { en: "Wrong Equipment Details", mr: "चुकीचे उपकरण तपशील" },
    description: { en: "Listing information is incorrect", mr: "लिस्टिंग माहिती चुकीची आहे" },
  },
  {
    icon: "event_busy",
    value: "Booking Problem",
    label: { en: "Booking Problem", mr: "बुकिंग समस्या" },
    description: { en: "Booking flow or dates failed", mr: "बुकिंग प्रक्रिया किंवा तारीख अडली" },
  },
  {
    icon: "payments",
    value: "Payment Issue",
    label: { en: "Payment Issue", mr: "पेमेंट समस्या" },
    description: { en: "Pricing or payment concern", mr: "किंमत किंवा पेमेंट समस्या" },
  },
  {
    icon: "report_problem",
    value: "Safety Concern",
    label: { en: "Safety Concern", mr: "सुरक्षा चिंता" },
    description: { en: "Machine, owner, or renter safety", mr: "मशीन, मालक किंवा भाडेकरू सुरक्षा" },
  },
] as const;

const roleOptions = [
  { value: "Renter", label: { en: "Renter", mr: "भाडेकरू" } },
  { value: "Owner", label: { en: "Owner", mr: "मालक" } },
] as const;

const urgencyOptions = [
  { value: "Low", label: { en: "Low", mr: "कमी" } },
  { value: "Medium", label: { en: "Medium", mr: "मध्यम" } },
  { value: "High Urgent", label: { en: "High", mr: "तातडीचे" } },
] as const;

export default function ReportPage() {
  const { langText } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [submitState, setSubmitState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].value);
  const [formState, setFormState] = useState({
    fullName: "",
    phone: "",
    role: "Renter",
    district: "Nashik",
    bookingId: "",
    title: "",
    description: "",
    urgency: "High Urgent",
  });

  const updateField = (field: keyof typeof formState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitState("pending");

    startTransition(async () => {
      try {
        await postJson<{ ok: boolean; id: string }>("/api/forms/support-request", {
          fullName: formState.fullName,
          phone: formState.phone,
          email: undefined,
          category: selectedCategory,
          message: [
            `Role: ${formState.role}`,
            `District: ${formState.district}`,
            formState.bookingId ? `Booking ID: ${formState.bookingId}` : "",
            `Urgency: ${formState.urgency}`,
            `Title: ${formState.title}`,
            `Description: ${formState.description}`,
          ]
            .filter(Boolean)
            .join("\n"),
          sourcePath: "/report",
        });
        setSubmitState("success");
      } catch (submitError) {
        setSubmitState("error");
        setError(submitError instanceof Error ? submitError.message : langText("Could not submit the report.", "रिपोर्ट सबमिट करता आला नाही."));
      }
    });
  };

  const submitLabel =
    submitState === "pending"
      ? langText("Submitting...", "सबमिट करत आहे...")
      : submitState === "success"
        ? langText("Submitted", "सबमिट झाले")
        : langText("Submit Report", "रिपोर्ट सबमिट करा");

  return (
    <div className="min-h-screen bg-background font-body text-on-background antialiased">
      <main className="pt-20">
        <section className="relative flex min-h-[400px] items-center overflow-hidden">
          <ContentImage
            alt="Report a problem"
            className="absolute inset-0 h-full w-full object-cover"
            data-alt="cinematic wide shot of a green tractor in a sprawling maharashtra farm at dawn with soft morning mist and golden sunlight"
            decoding="async"
            loading="lazy"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDprln7ei_-7KiHHUMhRaq3RPbGYAStHFc9k345CkGiggTfvSAe7LHkNV9H2R-yzCcb2F954B6sVfFlEyjr86aTHMksY7Pdl50EXBcMK0neZWBEFqJNEUHbanR1INlv_4BwH7QgTimp3zJS2d9oIeOrzhMu-EZxJeLof62W-9oekBbcMO53eyXg9J-WzmmncPNcu6fN3TeC1NbGqiDsyh6mQm8xeQ5ZmGwUISUiWEU1AQi7y-xWajGQWxA2QrOZp3ahSmQVe_1_HO5R"
          />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 text-white">
            <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-6xl">
              {langText("Report a Problem", "समस्या कळवा")}
            </h1>
            <p className="mb-8 max-w-xl text-lg font-medium text-white/85 md:text-xl">
              {langText(
                "Tell us what went wrong so our team can review and respond.",
                "काय चुकले ते आम्हाला सांगा, आमची टीम तपासून प्रतिसाद देईल."
              )}
            </p>
          </div>
        </section>

        <section className="bg-surface py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-3xl font-bold text-primary">
                {langText("What happened?", "काय झाले?")}
              </h2>
              <p className="font-medium text-on-surface-variant">
                {langText("Select a category to start your report", "रिपोर्ट सुरू करण्यासाठी वर्गवारी निवडा")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
              {categories.map((category) => {
                const active = selectedCategory === category.value;
                return (
                  <button
                    key={category.value}
                    className={`group rounded-2xl border p-6 text-left transition-all ${
                      active
                        ? "border-primary-container bg-primary-container text-white shadow-xl"
                        : "border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary-container hover:shadow-xl"
                    }`}
                    type="button"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${active ? "bg-white/10 text-white" : "bg-surface-container-low text-primary"}`}>
                      <span className="material-symbols-outlined text-2xl">{category.icon}</span>
                    </div>
                    <h3 className={`font-bold ${active ? "text-white" : "text-primary"}`}>
                      {langText(category.label.en, category.label.mr)}
                    </h3>
                    <p className={`mt-1 text-sm ${active ? "text-white/80" : "text-on-surface-variant"}`}>
                      {langText(category.description.en, category.description.mr)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-3">
            <form className="space-y-8 lg:col-span-2" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label={langText("Full Name", "पूर्ण नाव")}>
                  <input
                    value={formState.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    className="kk-input"
                    placeholder={langText("Enter your name", "तुमचे नाव टाका")}
                    type="text"
                    required
                  />
                </Field>
                <Field label={langText("Mobile Number", "मोबाईल नंबर")}>
                  <input
                    value={formState.phone}
                    onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="kk-input"
                    placeholder={langText("Enter 10 digit mobile number", "१० अंकी मोबाईल नंबर टाका")}
                    type="tel"
                    inputMode="numeric"
                    required
                  />
                </Field>
                <Field label={langText("I am a", "मी आहे")}>
                  <select
                    value={formState.role}
                    onChange={(event) => updateField("role", event.target.value)}
                    className="kk-input"
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {langText(role.label.en, role.label.mr)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={langText("District", "जिल्हा")}>
                  <select
                    value={formState.district}
                    onChange={(event) => updateField("district", event.target.value)}
                    className="kk-input"
                  >
                    <option>Nashik</option>
                    <option>Nanded</option>
                    <option>Jalgaon</option>
                    <option>Dhule</option>
                    <option>Ahmednagar</option>
                  </select>
                </Field>
                <Field label={langText("Booking ID", "बुकिंग आयडी")} className="md:col-span-2">
                  <input
                    value={formState.bookingId}
                    onChange={(event) => updateField("bookingId", event.target.value)}
                    className="kk-input"
                    placeholder={langText("Optional", "पर्यायी")}
                    type="text"
                  />
                </Field>
                <Field label={langText("Problem Title", "समस्येचे शीर्षक")} className="md:col-span-2">
                  <input
                    value={formState.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    className="kk-input"
                    placeholder={langText("Briefly describe the issue", "समस्या थोडक्यात सांगा")}
                    type="text"
                    required
                  />
                </Field>
                <Field label={langText("Description", "वर्णन")} className="md:col-span-2">
                  <textarea
                    value={formState.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    className="kk-input min-h-[150px]"
                    placeholder={langText("Tell us exactly what happened...", "नेमके काय झाले ते सांगा...")}
                    rows={5}
                    required
                  />
                </Field>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-primary">
                    {langText("Urgency Level", "निकडीची पातळी")}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {urgencyOptions.map((urgency) => (
                      <button
                        key={urgency.value}
                        type="button"
                        onClick={() => updateField("urgency", urgency.value)}
                        className={`rounded-full border-2 px-6 py-2 font-bold transition-all ${
                          formState.urgency === urgency.value
                            ? "border-error bg-error-container text-error"
                            : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                        }`}
                      >
                        {langText(urgency.label.en, urgency.label.mr)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm font-medium text-error">
                  {error}
                </div>
              ) : null}
              {submitState === "success" ? (
                <div className="rounded-xl border border-primary/20 bg-primary-container/20 px-4 py-3 text-sm font-medium text-primary">
                  {langText("Report submitted successfully. Our team will review it shortly.", "रिपोर्ट सबमिट झाला. आमची टीम लवकरच तपासेल.")}
                </div>
              ) : null}

              <button
                className={`kk-flow-button w-full rounded-xl py-4 text-lg font-bold text-white shadow-lg ${
                  submitState === "success"
                    ? "bg-emerald-600"
                    : "bg-primary-container"
                }`}
                type="submit"
                disabled={isPending}
                data-loading={isPending ? "true" : "false"}
                aria-busy={isPending}
              >
                {isPending ? <span className="kk-flow-spinner mr-2" aria-hidden="true" /> : null}
                {submitLabel}
              </button>
            </form>

            <div className="space-y-6">
              <div className="sticky top-28 rounded-3xl border border-outline-variant bg-primary-container p-8 text-white">
                <h4 className="mb-4 font-bold text-white">{langText("Direct Support", "थेट सहाय्य")}</h4>
                <div className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest/70 p-4">
                  <span className="material-symbols-outlined text-primary">support_agent</span>
                  <div>
                    <p className="text-sm font-bold text-primary">{supportContact.phoneDisplay}</p>
                    <p className="text-xs text-on-surface-variant">
                      {supportContact.serviceHours}, {langText("Mon-Sat", "सोमवार-शनिवार")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`space-y-2 ${className}`}>
      <span className="text-sm font-bold uppercase tracking-wider text-primary">{label}</span>
      {children}
    </label>
  );
}
