"use client";

import type { LocalSession, UserRole, VerificationDocumentRecord } from "@/lib/local-data/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

type ProfileSettingsFormProps = {
  family: "owner-profile" | "renter-profile";
  session: LocalSession;
};

type SubmitState = "idle" | "pending" | "success" | "error";

type ExtraProfileState = {
  district: string;
  verificationStatus: "not_submitted" | "submitted";
  verificationDocumentType: string;
  verificationDocumentNumber: string;
  verificationDocuments: VerificationDocumentRecord[];
};

function labelForFamily(family: ProfileSettingsFormProps["family"]) {
  return family === "owner-profile" ? "Owner Profile" : "Renter Profile";
}

export function ProfileSettingsForm({ family, session }: ProfileSettingsFormProps) {
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
  const [extraProfileState, setExtraProfileState] = useState<ExtraProfileState>({
    district: session.profile.district || "",
    verificationStatus: session.profile.verificationStatus || "not_submitted",
    verificationDocumentType: session.profile.verificationDocumentType || "",
    verificationDocumentNumber: session.profile.verificationDocumentNumber || "",
    verificationDocuments: session.profile.verificationDocuments || [],
  });
  const [formState, setFormState] = useState<SettingsState>({
    fullName: session.profile.fullName || session.user.name || "",
    email: session.profile.email || session.user.email || "",
    phone: session.profile.phone || session.user.phone || "",
    village: session.profile.village || "",
    address: session.profile.address || "",
    pincode: session.profile.pincode || "",
    fieldArea: String(session.profile.fieldArea || 0),
    rolePreference: session.profile.rolePreference === "owner" ? "owner" : "renter",
  });

  useEffect(() => {
    let isMounted = true;

    const loadExtraProfileState = async () => {
      try {
        const response = await fetch("/api/profile/complete", {
          cache: "no-store",
          credentials: "include",
        });
        const payload = (await response.json().catch(() => ({}))) as {
          ok?: boolean;
          profile?: Partial<ExtraProfileState>;
        };

        if (!response.ok || payload.ok === false || !payload.profile || !isMounted) {
          return;
        }

        setExtraProfileState((current) => ({
          district: payload.profile?.district || current.district,
          verificationStatus: payload.profile?.verificationStatus || current.verificationStatus,
          verificationDocumentType: payload.profile?.verificationDocumentType || current.verificationDocumentType,
          verificationDocumentNumber: payload.profile?.verificationDocumentNumber || current.verificationDocumentNumber,
          verificationDocuments: payload.profile?.verificationDocuments || current.verificationDocuments,
        }));
      } catch {
        // Keep the session-derived fallback when the extra profile fetch is unavailable.
      }
    };

    void loadExtraProfileState();

    return () => {
      isMounted = false;
    };
  }, []);

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
    field: keyof SettingsState,
    value: string | WorkspacePreference
  ) => {
    setFormState((current) => ({ ...current, [field]: value }));
    if (submitState !== "idle") {
      setSubmitState("idle");
    }
  };

  const updateExtraField = (
    field: keyof Omit<ExtraProfileState, "verificationDocuments">,
    value: string
  ) => {
    setExtraProfileState((current) => ({ ...current, [field]: value }));
    if (submitState !== "idle") {
      setSubmitState("idle");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitState("pending");

    startTransition(async () => {
      const response = await fetch("/api/profile/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName: formState.fullName.trim(),
          phone: formState.phone.replace(/\D/g, "").slice(-10),
          village: formState.village.trim(),
          address: formState.address.trim(),
          pincode: formState.pincode.replace(/\D/g, "").slice(0, 6),
          fieldArea: Number(formState.fieldArea || 0),
          role: formState.rolePreference,
          district: extraProfileState.district.trim(),
          verificationStatus: extraProfileState.verificationStatus,
          verificationDocumentType: extraProfileState.verificationDocumentType.trim() || undefined,
          verificationDocumentNumber: extraProfileState.verificationDocumentNumber.trim() || undefined,
          verificationDocuments: extraProfileState.verificationDocuments,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || payload.ok === false) {
        setSubmitState("error");
        setError(payload.error || "Could not update settings.");
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
                saved contact information, district, and preferred workspace.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-primary">Personal Information</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Full Name</span>
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
              <span className="text-sm font-semibold text-on-surface">District</span>
              <input
                value={extraProfileState.district}
                onChange={(event) => updateExtraField("district", event.target.value)}
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

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-primary">Identity Verification</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Verification Status</span>
              <input
                value={extraProfileState.verificationStatus === "submitted" ? "Submitted" : "Not submitted"}
                readOnly
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-on-surface-variant dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Document Type</span>
              <input
                value={extraProfileState.verificationDocumentType}
                onChange={(event) => updateExtraField("verificationDocumentType", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-on-surface">Document Number</span>
              <input
                value={extraProfileState.verificationDocumentNumber}
                onChange={(event) => updateExtraField("verificationDocumentNumber", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
          </div>
          {extraProfileState.verificationDocuments.length ? (
            <div className="mt-6 grid gap-3">
              {extraProfileState.verificationDocuments.map((document) => (
                <a
                  key={`${document.kind}-${document.storagePath}`}
                  href={document.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-primary dark:border-slate-700 dark:bg-slate-950"
                >
                  <span>{document.kind === "front" ? "Front Document" : "Back Document"}</span>
                  <span className="truncate pl-4 text-on-surface-variant">{document.name}</span>
                </a>
              ))}
            </div>
          ) : null}
        </section>
      </form>

      <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-on-surface dark:text-slate-100">
            Save Changes
          </h3>
          <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-400">
            Update your contact details, farm information, district, and saved
            identity metadata from this panel.
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
            Saving here keeps the shared profile and verification metadata in
            sync with the account session.
          </p>
        </div>
      </aside>
    </div>
  );
}
