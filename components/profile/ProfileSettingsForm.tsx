"use client";

import { updateProfileSettingsAction } from "@/lib/actions/local-data";
import type { LocalSession, UserRole } from "@/lib/local-data/types";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

type ProfileSettingsFormProps = {
  family: "owner-profile" | "renter-profile";
  session: LocalSession;
};

type SubmitState = "idle" | "pending" | "success" | "error";

function labelForFamily(family: ProfileSettingsFormProps["family"]) {
  return family === "owner-profile" ? "Owner Profile" : "Renter Profile";
}

export function ProfileSettingsForm({
  family,
  session,
}: ProfileSettingsFormProps) {
  type WorkspacePreference = "owner" | "renter";
  type SettingsState = {
    fullName: string;
    email: string;
    phone: string;
    village: string;
    address: string;
    pincode: string;
    fieldArea: string;
    rolePreference: WorkspacePreference;
  };
  const formId = `${family}-settings-form`;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [formState, setFormState] = useState<SettingsState>({
    fullName: session.profile.fullName || session.user.name || "",
    email: session.profile.email || session.user.email || "",
    phone: session.profile.phone || session.user.phone || "",
    village: session.profile.village || "",
    address: session.profile.address || "",
    pincode: session.profile.pincode || "",
    fieldArea: String(session.profile.fieldArea || 0),
    rolePreference:
      session.profile.rolePreference === "owner" ? "owner" : "renter",
  });

  const workspaceOptions = useMemo(
    () =>
      Array.from(
        new Set<UserRole>([
          family === "owner-profile" ? "owner" : "renter",
          ...session.user.roles,
        ])
      ),
    [family, session.user.roles]
  );

  const submitLabel =
    submitState === "pending"
      ? "Saving..."
      : submitState === "success"
        ? "Saved"
        : "Save Changes";

  const updateField = (
    field: keyof typeof formState,
    value: string | WorkspacePreference
  ) => {
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
      const result = await updateProfileSettingsAction({
        fullName: formState.fullName,
        phone: formState.phone,
        village: formState.village,
        address: formState.address,
        pincode: formState.pincode,
        fieldArea: Number(formState.fieldArea || 0),
        rolePreference: formState.rolePreference,
      });

      if (!result.ok) {
        setSubmitState("error");
        setError(result.error || "Could not update settings.");
        return;
      }

      setSubmitState("success");
      window.setTimeout(() => router.refresh(), 650);
    });
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.35fr_0.75fr]">
      <form id={formId} className="space-y-6" onSubmit={handleSubmit}>
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-start gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-100 text-3xl font-black uppercase text-emerald-700 shadow-sm">
              {(formState.fullName || session.user.name || "K")
                .trim()
                .slice(0, 1)
                .toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-black text-primary">Settings</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Manage your {labelForFamily(family).toLowerCase()} details,
                saved contact information, and preferred workspace.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-primary">Personal Information</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
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
              <span className="text-sm font-semibold text-on-surface">Email</span>
              <input
                value={formState.email}
                readOnly
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-on-surface-variant dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400"
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
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">
                Preferred Workspace
              </span>
              <select
                value={formState.rolePreference}
                onChange={(event) =>
                    updateField(
                      "rolePreference",
                      event.target.value as WorkspacePreference
                    )
                  }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                {workspaceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "owner" ? "Owner Profile" : "Renter Profile"}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-primary">Farm Details</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Village</span>
              <input
                value={formState.village}
                onChange={(event) => updateField("village", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Pincode</span>
              <input
                value={formState.pincode}
                onChange={(event) => updateField("pincode", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-on-surface">Address</span>
              <textarea
                value={formState.address}
                onChange={(event) => updateField("address", event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-on-surface">
                Field Area (acres)
              </span>
              <input
                value={formState.fieldArea}
                onChange={(event) => updateField("fieldArea", event.target.value)}
                min="0"
                step="0.1"
                type="number"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
          </div>
        </section>
      </form>

      <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-on-surface dark:text-slate-100">
            Save Changes
          </h3>
          <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-400">
            Update your contact details, farm information, and preferred
            workspace from this panel.
          </p>
          <button
            type="button"
            onClick={() => {
              const form = document.getElementById(formId);
              if (form instanceof HTMLFormElement) {
                form.requestSubmit();
              }
            }}
            disabled={isPending}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white ${
              submitState === "success" ? "bg-emerald-600" : "bg-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {submitState === "success" ? "task_alt" : "save"}
            </span>
            {submitLabel}
          </button>
          {error ? (
            <div className="mt-4 rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm font-medium text-error">
              {error}
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">
            Workspace
          </p>
          <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-400">
            You are editing the {labelForFamily(family).toLowerCase()} route.
            Saving here keeps the profile details in sync with the shared account
            session.
          </p>
        </div>
      </aside>
    </div>
  );
}
