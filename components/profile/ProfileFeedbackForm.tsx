"use client";

import { postJson } from "@/lib/client/forms";
import { useLanguage } from "@/components/LanguageContext";
import type { LocalSession } from "@/lib/local-data/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProfileFeedbackFormProps = {
  family: "owner-profile" | "renter-profile";
  session: LocalSession;
};

const ROLE_OPTIONS = [
  { value: "farmer", label: { en: "Farmer / Renter", mr: "शेतकरी / भाडेकरू" } },
  { value: "owner", label: { en: "Equipment Owner", mr: "उपकरणे मालक" } },
  { value: "partner", label: { en: "Partner", mr: "भागीदार" } },
  { value: "other", label: { en: "Other", mr: "इतर" } },
];

const FEEDBACK_CATEGORIES = [
  { value: "booking", label: { en: "Booking Experience", mr: "बुकिंग अनुभव" } },
  { value: "listing", label: { en: "Equipment Listing", mr: "उपकरणे नोंदणी" } },
  { value: "website", label: { en: "Website Usability", mr: "वेबसाइट वापर" } },
  { value: "support", label: { en: "Customer Support", mr: "ग्राहक सेवा" } },
  { value: "issue", label: { en: "Report an Issue", mr: "समस्या नोंदवा" } },
  { value: "suggestion", label: { en: "General Suggestion", mr: "सामान्य सूचना" } },
  { value: "other", label: { en: "Other", mr: "इतर" } },
];

export function ProfileFeedbackForm({
  family,
  session,
}: ProfileFeedbackFormProps) {
  const { langText } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [formState, setFormState] = useState({
    fullName: session.profile.fullName || session.user.name || "",
    mobileNumber: session.profile.phone || session.user.phone || "",
    email: session.profile.email || session.user.email || "",
    role: family === "owner-profile" ? "owner" : "farmer",
    category: "",
    message: "",
    rating: 4,
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setError("");
    setSubmitState("pending");
    setIsSubmitting(true);

    try {
      await postJson<{ ok: boolean; id: string }>("/api/forms/feedback", {
        fullName: formState.fullName,
        mobileNumber: formState.mobileNumber,
        email: formState.email || undefined,
        role: formState.role,
        category: formState.category || "other",
        subject: formState.category || "Workspace feedback",
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full pb-16 pt-2">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm md:p-8 lg:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label>
                <span className="mb-1.5 flex justify-between font-label text-sm font-semibold text-on-surface">
                  <span>{langText("Full Name", "पूर्ण नाव")}</span>
                </span>
                <input
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface outline-none transition-shadow focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                  placeholder={langText("Rajaram Patil", "राजाराम पाटील")}
                  value={formState.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  type="text"
                  required
                />
              </label>

              <label>
                <span className="mb-1.5 flex justify-between font-label text-sm font-semibold text-on-surface">
                  <span>{langText("Mobile Number", "मोबाईल नंबर")}</span>
                </span>
                <input
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface outline-none transition-shadow focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                  placeholder="+91 98765 43210"
                  value={formState.mobileNumber}
                  onChange={(event) => updateField("mobileNumber", event.target.value)}
                  type="tel"
                  required
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label>
                <span className="mb-1.5 flex justify-between font-label text-sm font-semibold text-on-surface">
                  <span>{langText("I am a...", "भूमिका")}</span>
                </span>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-lg border border-outline-variant bg-surface px-4 py-3 pr-10 font-body text-on-surface outline-none transition-shadow focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                    value={formState.role}
                    onChange={(event) => updateField("role", event.target.value)}
                    required
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role.value} value={role.value}>
                        {langText(role.label.en, role.label.mr)}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-outline">
                    expand_more
                  </span>
                </div>
              </label>

              <label>
                <span className="mb-1.5 flex justify-between font-label text-sm font-semibold text-on-surface">
                  <span>{langText("Feedback Category", "श्रेणी")}</span>
                </span>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-lg border border-outline-variant bg-surface px-4 py-3 pr-10 font-body text-on-surface outline-none transition-shadow focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                    value={formState.category}
                    onChange={(event) => updateField("category", event.target.value)}
                    required
                  >
                    <option value="">{langText("Select category", "श्रेणी निवडा")}</option>
                    {FEEDBACK_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {langText(category.label.en, category.label.mr)}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-outline">
                    expand_more
                  </span>
                </div>
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 flex justify-between font-label text-sm font-semibold text-on-surface">
                <span>{langText("Your Feedback", "तुमचा संदेश")}</span>
              </span>
              <textarea
                className="w-full resize-none rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface outline-none transition-shadow focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                placeholder={langText("Please describe your experience or issue in detail...", "तुमचा अनुभव किंवा समस्या सविस्तर लिहा...")}
                rows={5}
                value={formState.message}
                onChange={(event) => updateField("message", event.target.value)}
                required
              />
            </label>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <label className="mb-2 block font-label text-sm font-semibold text-on-surface">
                  {langText("Overall Satisfaction", "एकूण समाधान")}
                </label>
                <div className="flex items-center gap-1 text-secondary">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-transform hover:scale-110 hover:bg-surface-container"
                      type="button"
                      onClick={() => updateField("rating", rating)}
                      aria-label={langText(`Set satisfaction to ${rating}`, `समाधान ${rating} करा`)}
                    >
                      <span className={`material-symbols-outlined text-3xl ${rating <= formState.rating ? "fill" : "text-outline-variant"}`}>
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <label className="group flex cursor-pointer items-start gap-3">
                <input
                  className="mt-1 h-5 w-5 rounded border-outline text-primary-container focus:ring-primary-container"
                  checked={formState.contactMe}
                  onChange={(event) => updateField("contactMe", event.target.checked)}
                  type="checkbox"
                />
                <span className="font-label text-sm text-on-surface-variant transition-colors group-hover:text-on-surface">
                  <span className="block font-medium">{langText("Contact me regarding this", "याबाबत माझ्याशी संपर्क साधा")}</span>
                </span>
              </label>
            </div>

            {error ? (
              <div className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm font-medium text-error">
                {error}
              </div>
            ) : null}

            <div className="pt-2">
              <button
                className={`kk-flow-button flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 font-headline text-lg font-semibold text-on-primary shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg sm:w-auto ${
                  submitState === "success" ? "bg-emerald-600" : "bg-primary-container"
                }`}
                type="submit"
                disabled={isSubmitting}
                data-loading={isSubmitting ? "true" : "false"}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? <span className="kk-flow-spinner" aria-hidden="true" /> : null}
                {submitLabel}
                <span className="material-symbols-outlined">
                  {submitState === "success" ? "task_alt" : "send"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
