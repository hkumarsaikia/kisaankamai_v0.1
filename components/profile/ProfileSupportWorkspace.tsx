"use client";

import { postJson } from "@/lib/client/forms";
import type { LocalSession } from "@/lib/local-data/types";
import { useState, useTransition } from "react";

type ProfileSupportWorkspaceProps = {
  family: "owner-profile" | "renter-profile";
  session: LocalSession;
};

const OWNER_CATEGORIES = [
  "Listing Help",
  "Booking Request",
  "Payout Question",
  "Verification Issue",
];

const RENTER_CATEGORIES = [
  "Booking Help",
  "Equipment Issue",
  "Payment Question",
  "Cancellation Support",
];

export function ProfileSupportWorkspace({
  family,
  session,
}: ProfileSupportWorkspaceProps) {
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
    category: categories[0],
    message: "",
  });

  const submitLabel =
    submitState === "pending"
      ? "Submitting..."
      : submitState === "success"
        ? "Submitted"
        : "Submit Request";

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
            : "Support request failed."
        );
      }
    });
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-black text-primary">Support Request</h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Use the workspace support form for booking, listing, verification, and
          payout issues.
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">
                Full Name
              </span>
              <input
                value={formState.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Phone</span>
              <input
                value={formState.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-on-surface">
                Email
              </span>
              <input
                value={formState.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-on-surface">
                Category
              </span>
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
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-on-surface">
                Issue Details
              </span>
              <textarea
                value={formState.message}
                onChange={(event) => updateField("message", event.target.value)}
                rows={6}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="Describe the problem clearly so the support team can help quickly."
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

      <div className="space-y-5">
        <section className="rounded-[1.75rem] bg-primary-container p-6 text-white shadow-sm">
          <h3 className="text-xl font-black">Direct Channels</h3>
          <div className="mt-5 space-y-4">
            <a
              href="tel:+9118005550123"
              className="block rounded-2xl bg-white/10 p-4 transition hover:bg-white/15"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-fixed">
                Call Support
              </p>
              <p className="mt-1 text-lg font-bold">+91 1800 555 0123</p>
              <p className="text-sm text-white/75">8 AM - 8 PM Daily</p>
            </a>
            <a
              href="https://wa.me/919876543210"
              className="block rounded-2xl bg-[#1f9d57] p-4 transition hover:bg-[#19864a]"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                WhatsApp
              </p>
              <p className="mt-1 text-lg font-bold">Chat with Kisan Mitra</p>
              <p className="text-sm text-white/75">Marathi & English Support</p>
            </a>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-on-surface dark:text-slate-100">
            Fastest Path
          </h3>
          <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-400">
            Phone support is best for urgent booking, cancellation, and machine
            dispatch issues. Use the form when you need a documented follow-up.
          </p>
        </section>
      </div>
    </div>
  );
}
