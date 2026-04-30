"use client";

import type { LocalSession, UserRole, VerificationDocumentRecord } from "@/lib/local-data/types";
import { MAHARASHTRA_DISTRICTS } from "@/lib/auth/india-districts";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { emitAuthSyncEvent } from "@/lib/client/auth-sync";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

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

const SUBMITTED_VERIFICATION_STATE = { verificationStatus: "submitted" as const };

function labelForFamily(family: ProfileSettingsFormProps["family"]) {
  return family === "owner-profile" ? "Owner Profile" : "Renter Profile";
}

export function ProfileSettingsForm({ family, session }: ProfileSettingsFormProps) {
  const { langText } = useLanguage();
  type WorkspacePreference = "owner" | "renter";
  type SettingsState = {
    fullName: string;
    email: string;
    phone: string;
    village: string;
    address: string;
    pincode: string;
    fieldArea: string;
    farmingTypes: string;
    rolePreference: WorkspacePreference;
  };

  const formId = `${family}-settings-form`;
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(session.profile.photoUrl || session.user.photoUrl || "");
  const [identityFiles, setIdentityFiles] = useState<{ frontDocument: File | null; backDocument: File | null }>({
    frontDocument: null,
    backDocument: null,
  });
  const [customDocumentType, setCustomDocumentType] = useState("");
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
    farmingTypes: session.profile.farmingTypes || "",
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
          profile?: Partial<ExtraProfileState> & { farmingTypes?: string };
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
        setFormState((current) => ({
          ...current,
          farmingTypes: payload.profile?.farmingTypes || current.farmingTypes,
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
      ? langText("Saving...", "जतन करत आहे...")
      : submitState === "success"
        ? langText("Saved", "जतन झाले")
        : langText("Save Changes", "बदल जतन करा");

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

  const updateIdentityFile = (field: keyof typeof identityFiles, file: File | null) => {
    setIdentityFiles((current) => ({ ...current, [field]: file }));
    if (submitState !== "idle") {
      setSubmitState("idle");
    }
  };

  const handleProfilePhotoChange = async (file: File | null) => {
    if (!file || isPhotoUploading) {
      return;
    }

    setError("");
    setIsPhotoUploading(true);

    try {
      const formData = new FormData();
      formData.set("assetType", "profile-photo");
      formData.set("profilePhoto", file);
      const response = await fetch("/api/profile/assets", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        photoUrl?: string;
        error?: string;
      };

      if (!response.ok || payload.ok === false || !payload.photoUrl) {
        throw new Error(payload.error || langText("Could not update profile picture.", "प्रोफाइल फोटो अपडेट करता आला नाही."));
      }

      setProfilePhotoUrl(payload.photoUrl);
      await refreshProfile();
      emitAuthSyncEvent("session-refresh");
      router.refresh();
    } catch (photoError) {
      setError(photoError instanceof Error ? photoError.message : langText("Could not update profile picture.", "प्रोफाइल फोटो अपडेट करता आला नाही."));
    } finally {
      setIsPhotoUploading(false);
      if (profilePhotoInputRef.current) {
        profilePhotoInputRef.current.value = "";
      }
    }
  };

  const uploadPendingIdentityDocuments = async () => {
    if (!identityFiles.frontDocument && !identityFiles.backDocument) {
      return extraProfileState.verificationDocuments;
    }

    const formData = new FormData();
    formData.set("assetType", "identity-documents");
    if (identityFiles.frontDocument) {
      formData.set("frontDocument", identityFiles.frontDocument);
    }
    if (identityFiles.backDocument) {
      formData.set("backDocument", identityFiles.backDocument);
    }

    const response = await fetch("/api/profile/assets", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      documents?: VerificationDocumentRecord[];
      error?: string;
    };

    if (!response.ok || payload.ok === false || !payload.documents?.length) {
      throw new Error(payload.error || langText("Could not upload identity documents.", "ओळख दस्तऐवज अपलोड करता आले नाहीत."));
    }

    const byKind = new Map(
      extraProfileState.verificationDocuments.map((document) => [document.kind, document])
    );
    for (const document of payload.documents) {
      byKind.set(document.kind, document);
    }

    return Array.from(byKind.values());
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitState("pending");

    startTransition(async () => {
      try {
        const verificationDocuments = await uploadPendingIdentityDocuments();
        const nextVerificationStatus = verificationDocuments.length > 0
          ? SUBMITTED_VERIFICATION_STATE.verificationStatus
          : extraProfileState.verificationStatus;
        const verificationDocumentType =
          extraProfileState.verificationDocumentType === "Other"
            ? customDocumentType.trim() || "Other"
            : extraProfileState.verificationDocumentType.trim();

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
          farmingTypes: formState.farmingTypes.trim(),
          role: formState.rolePreference,
          district: extraProfileState.district.trim(),
          verificationStatus: nextVerificationStatus,
          verificationDocumentType: verificationDocumentType || undefined,
          verificationDocumentNumber: extraProfileState.verificationDocumentNumber.trim() || undefined,
          verificationDocuments,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || payload.ok === false) {
        setSubmitState("error");
        setError(payload.error || langText("Could not update settings.", "सेटिंग्ज अपडेट करता आल्या नाहीत."));
        return;
      }

      setExtraProfileState((current) => ({
        ...current,
        verificationStatus: nextVerificationStatus,
        verificationDocuments,
      }));
      setIdentityFiles({ frontDocument: null, backDocument: null });
      setSubmitState("success");
      window.setTimeout(() => router.refresh(), 650);
      } catch (submitError) {
        setSubmitState("error");
        setError(submitError instanceof Error ? submitError.message : langText("Could not update settings.", "सेटिंग्ज अपडेट करता आल्या नाहीत."));
      }
    });
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.35fr_0.75fr]">
      <form id={formId} className="space-y-6" onSubmit={handleSubmit}>
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-emerald-500 bg-emerald-100 text-3xl font-black uppercase text-emerald-700 shadow-sm">
              {profilePhotoUrl ? (
                <img src={profilePhotoUrl} alt={langText("Profile picture preview", "प्रोफाइल फोटो पूर्वावलोकन")} className="h-full w-full object-cover" />
              ) : (
                (formState.fullName || session.user.name || "K")
                  .trim()
                  .slice(0, 1)
                  .toUpperCase()
              )}
            </div>
            <h2 className="text-2xl font-black text-on-surface">
              {formState.fullName || session.user.name || labelForFamily(family)}
            </h2>
            <button
              type="button"
              onClick={() => profilePhotoInputRef.current?.click()}
              disabled={isPhotoUploading}
              className="rounded-xl bg-primary-container px-4 py-2 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-primary disabled:opacity-60"
            >
              {isPhotoUploading ? langText("Uploading...", "अपलोड करत आहे...") : langText("Change Profile Picture", "प्रोफाइल फोटो बदला")}
            </button>
            <input
              ref={profilePhotoInputRef}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(event) => void handleProfilePhotoChange(event.target.files?.[0] || null)}
            />
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-primary">{langText("Personal Information", "वैयक्तिक माहिती")}</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">{langText("Full Name", "पूर्ण नाव")}</span>
              <input
                value={formState.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">{langText("Email", "ईमेल")}</span>
              <input
                value={formState.email}
                readOnly
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-on-surface-variant dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">{langText("Phone", "फोन")}</span>
              <input
                value={formState.phone}
                readOnly
                aria-label="Phone"
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-on-surface-variant dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">
                {langText("Preferred Workspace", "पसंतीचा वर्कस्पेस")}
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
                    {option === "owner"
                      ? langText("Owner Profile", "मालक प्रोफाइल")
                      : langText("Renter Profile", "भाडेकरू प्रोफाइल")}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-primary">{langText("Farm Details", "शेती तपशील")}</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">{langText("Village", "गाव")}</span>
              <input
                value={formState.village}
                onChange={(event) => updateField("village", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">{langText("District", "जिल्हा")}</span>
              <select
                value={extraProfileState.district}
                onChange={(event) => updateExtraField("district", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="">{langText("Select district", "जिल्हा निवडा")}</option>
                {MAHARASHTRA_DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">{langText("Pincode", "पिनकोड")}</span>
              <input
                value={formState.pincode}
                onChange={(event) => updateField("pincode", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-on-surface">{langText("Address", "पत्ता")}</span>
              <textarea
                value={formState.address}
                onChange={(event) => updateField("address", event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-on-surface">
                {langText("Field Area (acres)", "शेत क्षेत्र (एकर)")}
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
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-on-surface">{langText("Types of Farming", "शेतीचे प्रकार")}</span>
              <input
                value={formState.farmingTypes}
                onChange={(event) => updateField("farmingTypes", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder={langText("e.g. Rice, Sugarcane, Grapes", "उदा. तांदूळ, ऊस, द्राक्षे")}
              />
            </label>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-primary">{langText("Identity Verification (Optional)", "ओळख पडताळणी (ऐच्छिक)")}</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">{langText("Verification Status", "पडताळणी स्थिती")}</span>
              <input
                value={extraProfileState.verificationStatus === "submitted"
                  ? langText("Submitted", "सबमिट झाले")
                  : langText("Not submitted", "सबमिट केलेले नाही")}
                readOnly
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-on-surface-variant dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">{langText("Document Type", "दस्तऐवज प्रकार")}</span>
              <select
                value={extraProfileState.verificationDocumentType}
                onChange={(event) => updateExtraField("verificationDocumentType", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="">{langText("Select document type", "दस्तऐवज प्रकार निवडा")}</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Other">{langText("Other", "इतर")}</option>
              </select>
            </label>
            {extraProfileState.verificationDocumentType === "Other" ? (
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-on-surface">{langText("Specify Other Document Type", "इतर दस्तऐवज प्रकार लिहा")}</span>
                <input
                  value={customDocumentType}
                  onChange={(event) => setCustomDocumentType(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                  placeholder={langText("Enter document type", "दस्तऐवज प्रकार लिहा")}
                />
              </label>
            ) : null}
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-on-surface">{langText("Document Number", "दस्तऐवज क्रमांक")}</span>
              <input
                value={extraProfileState.verificationDocumentNumber}
                onChange={(event) => updateExtraField("verificationDocumentNumber", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label className="space-y-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
              <span className="text-sm font-semibold text-on-surface">{langText("Upload Front Page", "समोरील पान अपलोड करा")}</span>
              <input
                name="frontDocument"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(event) => updateIdentityFile("frontDocument", event.target.files?.[0] || null)}
                className="block w-full text-sm text-on-surface-variant file:mr-4 file:rounded-xl file:border-0 file:bg-primary-container file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
              />
              <span className="text-xs text-on-surface-variant">
                {identityFiles.frontDocument?.name || langText("Accepted formats: JPG, PNG, PDF", "स्वीकारलेले प्रकार: JPG, PNG, PDF")}
              </span>
            </label>
            <label className="space-y-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
              <span className="text-sm font-semibold text-on-surface">{langText("Upload Back Page", "मागील पान अपलोड करा")}</span>
              <input
                name="backDocument"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(event) => updateIdentityFile("backDocument", event.target.files?.[0] || null)}
                className="block w-full text-sm text-on-surface-variant file:mr-4 file:rounded-xl file:border-0 file:bg-primary-container file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
              />
              <span className="text-xs text-on-surface-variant">
                {identityFiles.backDocument?.name || langText("Accepted formats: JPG, PNG, PDF", "स्वीकारलेले प्रकार: JPG, PNG, PDF")}
              </span>
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
                  <span>{document.kind === "front" ? langText("Front Document", "समोरील दस्तऐवज") : langText("Back Document", "मागील दस्तऐवज")}</span>
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
            {langText("Save Changes", "बदल जतन करा")}
          </h3>
          <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-400">
            {langText(
              "Update your contact details, farm information, district, and saved identity metadata from this panel.",
              "या पॅनेलमधून संपर्क तपशील, शेती माहिती, जिल्हा आणि जतन केलेली ओळख माहिती अपडेट करा."
            )}
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
            {langText("Workspace", "वर्कस्पेस")}
          </p>
          <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-400">
            {langText(
              `You are editing the ${labelForFamily(family).toLowerCase()} route. Saving here keeps the shared profile and verification metadata in sync with the account session.`,
              `तुम्ही ${family === "owner-profile" ? "मालक प्रोफाइल" : "भाडेकरू प्रोफाइल"} मार्ग संपादित करत आहात. येथे जतन केल्याने शेअर केलेले प्रोफाइल आणि पडताळणी माहिती खात्याच्या सत्राशी समक्रमित राहते.`
            )}
          </p>
        </div>
      </aside>
    </div>
  );
}
