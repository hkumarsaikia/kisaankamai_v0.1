"use client";

import { ContentImage } from "@/components/ContentImage";
import { postJson } from "@/lib/client/forms";
import { useState, useTransition } from "react";

const categories = [
  ["Wrong Equipment Details", "चुकीचे तपशील"],
  ["Booking Problem", "बुकिंग समस्या"],
  ["Payment Issue", "पेमेंट समस्या"],
  ["Safety Concern", "सुरक्षा चिंता"],
] as const;

export default function ReportPage() {
  const [isPending, startTransition] = useTransition();
  const [submitState, setSubmitState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0][0]);
  const [formState, setFormState] = useState({
    fullName: "",
    phone: "",
    role: "Renter",
    district: "Pune",
    bookingId: "",
    title: "",
    description: "",
    urgency: "High / Urgent",
  });

  const updateField = (field: keyof typeof formState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
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
        setError(submitError instanceof Error ? submitError.message : "Could not submit the report.");
      }
    });
  };

  const submitLabel =
    submitState === "pending"
      ? "Submitting..."
      : submitState === "success"
        ? "Submitted"
        : "Submit Report";

  return (
    <div className="min-h-screen bg-background font-body text-on-background antialiased">
      <main className="pt-20">
        <section className="relative flex h-[400px] items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <ContentImage
              alt="Report a Problem"
              className="h-full w-full object-cover"
              data-alt="cinematic wide shot of a green tractor in a sprawling maharashtra farm at dawn with soft morning mist and golden sunlight"
              decoding="async"
              loading="lazy"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDprln7ei_-7KiHHUMhRaq3RPbGYAStHFc9k345CkGiggTfvSAe7LHkNV9H2R-yzCcb2F954B6sVfFlEyjr86aTHMksY7Pdl50EXBcMK0neZWBEFqJNEUHbanR1INlv_4BwH7QgTimp3zJS2d9oIeOrzhMu-EZxJeLof62W-9oekBbcMO53eyXg9J-WzmmncPNcu6fN3TeC1NbGqiDsyh6mQm8xeQ5ZmGwUISUiWEU1AQi7y-xWajGQWxA2QrOZp3ahSmQVe_1_HO5R"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container/90 via-primary-container/60 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 text-white">
            <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-6xl">
              Report a Problem <br />
              <span className="text-on-primary-container">समस्या रिपोर्ट करा</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg font-medium text-slate-200 md:text-xl">
              Tell us what went wrong. Our team is committed to resolving your concerns promptly in English and Marathi.
            </p>
          </div>
        </section>

        <section className="bg-surface py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-3xl font-bold text-primary-container">What happened? / काय झाले?</h2>
              <p className="font-medium text-slate-500">Select a category to start your report</p>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {categories.map(([title, subtitle], index) => {
                const active = selectedCategory === title;
                return (
                  <button
                    key={title}
                    className={`group rounded-2xl border p-6 text-left transition-all ${
                      active
                        ? "border-primary-container bg-primary-container text-white shadow-xl"
                        : "border-outline-variant bg-white hover:border-primary-container hover:shadow-xl"
                    }`}
                    type="button"
                    onClick={() => setSelectedCategory(title)}
                  >
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${active ? "bg-white/10 text-white" : "bg-surface-container-low text-primary-container"}`}>
                      <span className="material-symbols-outlined text-2xl">
                        {index === 0 ? "info" : index === 1 ? "event_busy" : index === 2 ? "payments" : "report_problem"}
                      </span>
                    </div>
                    <h3 className={`font-bold ${active ? "text-white" : "text-primary-container"}`}>{title}</h3>
                    <p className={`mt-1 text-sm ${active ? "text-white/80" : "text-slate-500"}`}>{subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-3">
            <form className="space-y-8 lg:col-span-2" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-primary-container">Full Name / पूर्ण नाव</span>
                  <input
                    value={formState.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary-container"
                    placeholder="Enter your name"
                    type="text"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-primary-container">Mobile Number / मोबाईल नंबर</span>
                  <input
                    value={formState.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary-container"
                    placeholder="9876543210"
                    type="tel"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-primary-container">I am a / मी आहे</span>
                  <select
                    value={formState.role}
                    onChange={(event) => updateField("role", event.target.value)}
                    className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary-container"
                  >
                    <option>Renter</option>
                    <option>Owner</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-primary-container">District / जिल्हा</span>
                  <select
                    value={formState.district}
                    onChange={(event) => updateField("district", event.target.value)}
                    className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary-container"
                  >
                    <option>Pune</option>
                    <option>Nashik</option>
                    <option>Satara</option>
                    <option>Ahmednagar</option>
                  </select>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-primary-container">Booking ID / बुकिंग आयडी (Optional)</span>
                  <input
                    value={formState.bookingId}
                    onChange={(event) => updateField("bookingId", event.target.value)}
                    className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary-container"
                    placeholder="e.g. KK-45892"
                    type="text"
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-primary-container">Problem Title / विषयाची हेडलाईन</span>
                  <input
                    value={formState.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary-container"
                    placeholder="Briefly describe the issue"
                    type="text"
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-primary-container">Description / वर्णन</span>
                  <textarea
                    value={formState.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary-container"
                    placeholder="Tell us exactly what happened..."
                    rows={5}
                  />
                </label>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-primary-container">Urgency Level / निकडीची पातळी</label>
                  <div className="flex flex-wrap gap-3">
                    {["Low", "Medium", "High / Urgent"].map((urgency) => (
                      <button
                        key={urgency}
                        type="button"
                        onClick={() => updateField("urgency", urgency)}
                        className={`rounded-full border-2 px-6 py-2 font-bold transition-all ${
                          formState.urgency === urgency
                            ? "border-error bg-error/5 text-error"
                            : "border-slate-200 text-slate-500 hover:border-on-tertiary-container hover:text-on-tertiary-container"
                        }`}
                      >
                        {urgency}
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
                <div className="rounded-xl border border-primary/20 bg-primary-fixed/20 px-4 py-3 text-sm font-medium text-primary">
                  Report submitted successfully. Our team will review it shortly.
                </div>
              ) : null}

              <button
                className={`w-full rounded-xl py-4 text-lg font-bold text-white shadow-lg transition-all ${
                  submitState === "success"
                    ? "bg-emerald-600"
                    : "bg-primary-container hover:scale-[1.01] hover:shadow-primary-container/20 active:scale-95"
                }`}
                type="submit"
                disabled={isPending}
              >
                {submitLabel}
              </button>
            </form>

            <div className="space-y-6">
              <div className="sticky top-28 rounded-3xl border border-secondary-container/20 bg-secondary-fixed/30 p-8">
                <h4 className="mb-4 font-bold text-on-secondary-fixed">Direct Support</h4>
                <div className="flex items-center gap-3 rounded-2xl bg-white/50 p-4">
                  <span className="material-symbols-outlined text-on-tertiary-container">support_agent</span>
                  <div>
                    <p className="text-sm font-bold text-primary-container">+91 1800-KISAN-HELP</p>
                    <p className="text-xs text-slate-500">9 AM - 7 PM, Mon-Sat</p>
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
