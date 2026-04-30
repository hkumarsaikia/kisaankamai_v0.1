"use client";

import { postJson } from "@/lib/client/forms";
import { useLanguage } from "@/components/LanguageContext";
import type { LocalSession } from "@/lib/local-data/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type ProfileFeedbackFormProps = {
  family: "owner-profile" | "renter-profile";
  session: LocalSession;
};

const OWNER_CATEGORIES = [
  { value: "Fleet Workflow", label: { en: "Fleet Workflow", mr: "फ्लीट वर्कफ्लो" } },
  { value: "Bookings", label: { en: "Bookings", mr: "बुकिंग्ज" } },
  { value: "Pricing & Earnings", label: { en: "Pricing & Earnings", mr: "किंमत आणि कमाई" } },
  { value: "Profile Experience", label: { en: "Profile Experience", mr: "प्रोफाइल अनुभव" } },
  { value: "Other", label: { en: "Other", mr: "इतर" } },
];

const RENTER_CATEGORIES = [
  { value: "Equipment Search", label: { en: "Equipment Search", mr: "उपकरण शोध" } },
  { value: "Bookings", label: { en: "Bookings", mr: "बुकिंग्ज" } },
  { value: "Saved Equipment", label: { en: "Saved Equipment", mr: "जतन केलेली उपकरणे" } },
  { value: "Profile Experience", label: { en: "Profile Experience", mr: "प्रोफाइल अनुभव" } },
  { value: "Other", label: { en: "Other", mr: "इतर" } },
];

export function ProfileFeedbackForm({
  family,
  session,
}: ProfileFeedbackFormProps) {
  const { langText } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitState, setSubmitState] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const categories =
    family === "owner-profile" ? OWNER_CATEGORIES : RENTER_CATEGORIES;
  const [formState, setFormState] = useState({
    fullName: session.profile.fullName || session.user.name || "",
    mobileNumber: session.profile.phone || session.user.phone || "",
    email: session.profile.email || session.user.email || "",
    role: family === "owner-profile" ? "owner" : "farmer",
    category: categories[0].value,
    subject: "",
    message: "",
    rating: 5,
    contactMe: true,
  });

  const submitLabel =
    submitState === "pending"
      ? langText("Submitting...", "सबमिट करत आहे...")
      : submitState === "success"
        ? langText("Submitted", "सबमिट झाले")
        : langText("Submit Feedback", "अभिप्राय सबमिट करा");

  const updateField = (field: keyof typeof formState, value: string | number | boolean) => {
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
        await postJson<{ ok: boolean; id: string }>("/api/forms/feedback", {
          fullName: formState.fullName,
          mobileNumber: formState.mobileNumber,
          email: formState.email || undefined,
          role: formState.role,
          category: formState.category,
          subject: formState.subject,
          message: formState.message,
          rating: formState.rating,
          contactMe: formState.contactMe,
        });
        setSubmitState("success");
        window.setTimeout(() => {
          router.push(
            family === "owner-profile"
              ? "/owner-profile/feedback/success"
              : "/renter-profile/feedback/success"
          );
        }, 700);
      } catch (submitError) {
        setSubmitState("error");
        setError(
          submitError instanceof Error
            ? submitError.message
            : langText("Could not submit feedback.", "अभिप्राय सबमिट करता आला नाही.")
        );
      }
    });
  };

  return (
    <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-10">
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
          <span className="material-symbols-outlined text-3xl">rate_review</span>
        </div>
        <div>
          <h2 className="text-3xl font-black text-primary">{langText("Share Feedback", "अभिप्राय शेअर करा")}</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            {langText(
              "Tell us what would improve this workspace and the next release.",
              "हा वर्कस्पेस आणि पुढील रिलीज सुधारण्यासाठी काय हवे ते सांगा."
            )}
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">{langText("Full Name", "पूर्ण नाव")}</span>
            <input
              value={formState.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              className="kk-input"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">{langText("Mobile Number", "मोबाईल नंबर")}</span>
            <input
              value={formState.mobileNumber}
              onChange={(event) => updateField("mobileNumber", event.target.value)}
              className="kk-input"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-on-surface">{langText("Email", "ईमेल")}</span>
            <input
              value={formState.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="kk-input"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">{langText("Category", "वर्ग")}</span>
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
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">{langText("Rating", "रेटिंग")}</span>
            <select
              value={String(formState.rating)}
              onChange={(event) => updateField("rating", Number(event.target.value))}
              className="kk-input"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} {langText(`Star${rating === 1 ? "" : "s"}`, "स्टार")}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-on-surface">{langText("Subject", "विषय")}</span>
            <input
              value={formState.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              className="kk-input"
              placeholder={langText("Summarize your feedback in one line", "तुमचा अभिप्राय एका ओळीत लिहा")}
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-on-surface">{langText("Feedback", "अभिप्राय")}</span>
            <textarea
              value={formState.message}
              onChange={(event) => updateField("message", event.target.value)}
              rows={6}
              className="kk-input"
              placeholder={langText(
                "Tell us what is working, what is missing, or what should change.",
                "काय चांगले आहे, काय कमी आहे किंवा काय बदलायला हवे ते सांगा."
              )}
            />
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-on-surface dark:bg-slate-950 dark:text-slate-100">
          <input
            checked={formState.contactMe}
            onChange={(event) => updateField("contactMe", event.target.checked)}
            type="checkbox"
            className="h-5 w-5 accent-primary"
          />
          {langText("Contact me if the team needs more detail.", "टीमला अधिक माहिती हवी असल्यास माझ्याशी संपर्क साधा.")}
        </label>

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
  );
}
