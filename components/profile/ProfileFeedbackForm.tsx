"use client";

import { postJson } from "@/lib/client/forms";
import type { LocalSession } from "@/lib/local-data/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type ProfileFeedbackFormProps = {
  family: "owner-profile" | "renter-profile";
  session: LocalSession;
};

const OWNER_CATEGORIES = [
  "Fleet Workflow",
  "Bookings",
  "Pricing & Earnings",
  "Profile Experience",
];

const RENTER_CATEGORIES = [
  "Equipment Search",
  "Bookings",
  "Saved Equipment",
  "Profile Experience",
];

export function ProfileFeedbackForm({
  family,
  session,
}: ProfileFeedbackFormProps) {
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
    category: categories[0],
    subject: "",
    message: "",
    rating: 5,
    contactMe: true,
  });

  const submitLabel =
    submitState === "pending"
      ? "Submitting..."
      : submitState === "success"
        ? "Submitted"
        : "Submit Feedback";

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
            : "Could not submit feedback."
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
          <h2 className="text-3xl font-black text-primary">Share Feedback</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Tell us what would improve this workspace and the next release.
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">Full Name</span>
            <input
              value={formState.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">Mobile Number</span>
            <input
              value={formState.mobileNumber}
              onChange={(event) => updateField("mobileNumber", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-on-surface">Email</span>
            <input
              value={formState.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">Category</span>
            <select
              value={formState.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">Rating</span>
            <select
              value={String(formState.rating)}
              onChange={(event) => updateField("rating", Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Star{rating === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-on-surface">Subject</span>
            <input
              value={formState.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder="Summarize your feedback in one line"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-on-surface">Feedback</span>
            <textarea
              value={formState.message}
              onChange={(event) => updateField("message", event.target.value)}
              rows={6}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder="Tell us what is working, what is missing, or what should change."
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
          Contact me if the team needs more detail.
        </label>

        {error ? (
          <div className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm font-medium text-error">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white ${
            submitState === "success" ? "bg-emerald-600" : "bg-primary-container"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {submitState === "success" ? "task_alt" : "send"}
          </span>
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
