"use client";

import type { LocalSession } from "@/lib/local-data/types";
import { MAHARASHTRA_DISTRICTS } from "@/lib/auth/india-districts";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { emitAuthSyncEvent } from "@/lib/client/auth-sync";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ProfileSettingsFormProps = {
  family: "owner-profile" | "renter-profile";
  session: LocalSession;
};

type SubmitState = "idle" | "pending" | "success" | "error";

type SettingsState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  village: string;
  district: string;
  pincode: string;
  fieldArea: string;
  farmingTypes: string;
  equipmentOwned: string;
  publicVisibility: boolean;
  whatsappNotifications: boolean;
};

function labelForFamily(family: ProfileSettingsFormProps["family"]) {
  return family === "owner-profile" ? "Owner Profile" : "Renter Profile";
}

function initialsFor(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "KK"
  );
}

export function ProfileSettingsForm({ family, session }: ProfileSettingsFormProps) {
  const { langText } = useLanguage();
  const formId = `${family}-settings-form`;
  const router = useRouter();
  const { refreshProfile, setSession } = useAuth();
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(session.profile.photoUrl || session.user.photoUrl || "");
  const [formState, setFormState] = useState<SettingsState>({
    fullName: session.profile.fullName || session.user.name || "",
    email: session.profile.email || session.user.email || "",
    phone: session.profile.phone || session.user.phone || "",
    address: session.profile.address || "",
    village: session.profile.village || "",
    district: session.profile.district || "",
    pincode: session.profile.pincode || "",
    fieldArea: String(session.profile.fieldArea || ""),
    farmingTypes: session.profile.farmingTypes || "",
    equipmentOwned: "",
    publicVisibility: true,
    whatsappNotifications: true,
  });

  useEffect(() => {
    setProfilePhotoUrl(session.profile.photoUrl || session.user.photoUrl || "");
  }, [session.profile.photoUrl, session.user.photoUrl]);

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
          profile?: {
            district?: string;
            farmingTypes?: string;
          };
        };

        if (!response.ok || payload.ok === false || !payload.profile || !isMounted) {
          return;
        }

        setFormState((current) => ({
          ...current,
          district: payload.profile?.district || current.district,
          farmingTypes: payload.profile?.farmingTypes || current.farmingTypes,
        }));
      } catch {
        // Session values are enough when the profile metadata endpoint is unavailable.
      }
    };

    void loadExtraProfileState();

    return () => {
      isMounted = false;
    };
  }, []);

  const submitLabel =
    submitState === "pending"
      ? langText("Saving...", "जतन करत आहे...")
      : submitState === "success"
        ? langText("Saved", "जतन झाले")
        : langText("Save Changes", "बदल जतन करा");

  const updateField = (field: keyof SettingsState, value: string | boolean) => {
    setFormState((current) => ({ ...current, [field]: value }));
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
        session?: LocalSession | null;
        error?: string;
      };

      if (!response.ok || payload.ok === false || !payload.photoUrl) {
        throw new Error(payload.error || langText("Could not update profile picture.", "प्रोफाइल फोटो अपडेट करता आला नाही."));
      }

      setProfilePhotoUrl(payload.photoUrl);
      if (payload.session) {
        setSession(payload.session);
      }
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setError("");
    setSubmitState("pending");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/profile/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName: formState.fullName.trim(),
          email: formState.email.trim() || undefined,
          phone: formState.phone.replace(/\D/g, "").slice(-10),
          village: formState.village.trim(),
          address: formState.address.trim(),
          pincode: formState.pincode.replace(/\D/g, "").slice(0, 6),
          fieldArea: Number(formState.fieldArea || 0),
          farmingTypes: [formState.farmingTypes.trim(), formState.equipmentOwned.trim()].filter(Boolean).join(" | "),
          role: family === "owner-profile" ? "owner" : "renter",
          district: formState.district.trim() || undefined,
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

      setSubmitState("success");
      window.setTimeout(() => router.refresh(), 650);
    } catch (submitError) {
      setSubmitState("error");
      setError(submitError instanceof Error ? submitError.message : langText("Could not update settings.", "सेटिंग्ज अपडेट करता आल्या नाहीत."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full pb-16 font-body text-on-background">
      <h2 className="sr-only">{langText("Profile Settings", "प्रोफाइल सेटिंग्ज")}</h2>
      <form id={formId} className="grid gap-8 xl:grid-cols-[20rem_minmax(0,1fr)] xl:items-start" onSubmit={handleSubmit}>
        <aside className="space-y-8 xl:sticky xl:top-24">
          <div className="rounded-3xl border border-surface-container/50 bg-surface-container-lowest p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
          <h2 className="mb-6 font-headline text-xl font-bold text-on-surface">
            {langText("Profile Photo", "प्रोफाइल फोटो")}
          </h2>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative mb-6">
              <div className="h-44 w-44 overflow-hidden rounded-full ring-4 ring-surface-container shadow-xl transition-all duration-300">
                {profilePhotoUrl ? (
                  <img
                    alt={langText("User Avatar", "वापरकर्ता अवतार")}
                    className="h-full w-full object-cover"
                    src={profilePhotoUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary-fixed text-4xl font-black text-primary">
                    {initialsFor(formState.fullName || session.user.name || labelForFamily(family))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => profilePhotoInputRef.current?.click()}
                disabled={isPhotoUploading}
                aria-label={langText("Upload or change profile photo", "प्रोफाइल फोटो अपलोड किंवा बदला")}
                className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-4 ring-white transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[22px]">
                  {isPhotoUploading ? "hourglass_top" : "edit"}
                </span>
              </button>
              <input
                ref={profilePhotoInputRef}
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(event) => void handleProfilePhotoChange(event.target.files?.[0] || null)}
              />
            </div>
          </div>
          </div>

          <div className="rounded-3xl border border-surface-container/50 bg-surface-container-lowest p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
            <h2 className="mb-6 border-b border-surface-container pb-4 font-headline text-xl font-bold text-on-surface">
              {langText("Account Settings", "खाते सेटिंग्ज")}
            </h2>
            <div className="space-y-5">
              <div className="rounded-2xl border border-outline-variant bg-surface-bright p-5 shadow-sm transition-colors hover:border-primary/30">
                <div className="mb-4">
                  <p className="mb-1 text-base font-bold text-on-surface">{langText("Public Visibility", "सार्वजनिक दृश्यमानता")}</p>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    {langText("Allow others to see your profile when you list equipment.", "तुम्ही उपकरणे सूचीबद्ध करता तेव्हा इतरांना तुमचे प्रोफाइल पाहण्याची अनुमती द्या.")}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    checked={formState.publicVisibility}
                    onChange={(event) => updateField("publicVisibility", event.target.checked)}
                    className="peer sr-only"
                    type="checkbox"
                  />
                  <div className="h-7 w-14 rounded-full bg-surface-container-highest after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white" />
                </label>
              </div>

              <div className="rounded-2xl border border-outline-variant bg-surface-bright p-5 shadow-sm transition-colors hover:border-primary/30">
                <div className="mb-4">
                  <p className="mb-1 text-base font-bold text-on-surface">{langText("WhatsApp Notifications", "व्हॉट्सॲप सूचना")}</p>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    {langText("Receive instant booking requests and updates via WhatsApp.", "व्हॉट्सॲप द्वारे त्वरित बुकिंग विनंत्या आणि अद्यतने प्राप्त करा.")}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    checked={formState.whatsappNotifications}
                    onChange={(event) => updateField("whatsappNotifications", event.target.checked)}
                    className="peer sr-only"
                    type="checkbox"
                  />
                  <div className="h-7 w-14 rounded-full bg-surface-container-highest after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white" />
                </label>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-8">
          <div className="rounded-3xl border border-surface-container/50 bg-surface-container-lowest p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
            <h2 className="mb-6 border-b border-surface-container pb-4 font-headline text-xl font-bold text-on-surface">
              {langText("Personal Information", "वैयक्तिक माहिती")}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="col-span-1 md:col-span-2">
                <span className="mb-3 block text-sm font-bold text-on-surface">{langText("Full Name", "पूर्ण नाव")}</span>
                <input
                  className="w-full rounded-xl border border-outline-variant bg-surface-bright px-5 py-4 text-on-surface shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary"
                  type="text"
                  value={formState.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                />
              </label>
              <label>
                <span className="mb-3 block text-sm font-bold text-on-surface">{langText("Phone Number", "फोन नंबर")}</span>
                <input
                  className="w-full cursor-not-allowed rounded-xl border border-outline-variant bg-surface-container-low px-5 py-4 text-on-surface opacity-60 shadow-sm transition-all"
                  type="tel"
                  value={formState.phone}
                  readOnly
                  aria-label="Phone"
                />
              </label>
              <label>
                <span className="mb-3 block text-sm font-bold text-on-surface">{langText("Email Address", "ईमेल पत्ता")}</span>
                <input
                  className="w-full rounded-xl border border-outline-variant bg-surface-bright px-5 py-4 text-on-surface shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary"
                  type="email"
                  value={formState.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
              </label>
              <label className="col-span-1 md:col-span-2">
                <span className="mb-3 block text-sm font-bold text-on-surface">{langText("Address", "पत्ता")}</span>
                <textarea
                  className="h-28 w-full resize-none rounded-xl border border-outline-variant bg-surface-bright px-5 py-4 text-on-surface shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary"
                  value={formState.address}
                  onChange={(event) => updateField("address", event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-surface-container/50 bg-surface-container-lowest p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
            <h2 className="mb-6 border-b border-surface-container pb-4 font-headline text-xl font-bold text-on-surface">
              {langText("Farm Details", "शेतीची माहिती")}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label>
                <span className="mb-3 block text-sm font-bold text-on-surface">{langText("Village", "गाव")}</span>
                <input
                  className="w-full rounded-xl border border-outline-variant bg-surface-bright px-5 py-4 text-on-surface shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary"
                  value={formState.village}
                  onChange={(event) => updateField("village", event.target.value)}
                  type="text"
                />
              </label>
              <label>
                <span className="mb-3 block text-sm font-bold text-on-surface">{langText("District", "जिल्हा")}</span>
                <select
                  className="w-full rounded-xl border border-outline-variant bg-surface-bright px-5 py-4 text-on-surface shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary"
                  value={formState.district}
                  onChange={(event) => updateField("district", event.target.value)}
                >
                  <option value="">{langText("Select district", "जिल्हा निवडा")}</option>
                  {MAHARASHTRA_DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-3 block text-sm font-bold text-on-surface">{langText("Pincode", "पिनकोड")}</span>
                <input
                  className="w-full rounded-xl border border-outline-variant bg-surface-bright px-5 py-4 text-on-surface shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary"
                  value={formState.pincode}
                  onChange={(event) => updateField("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  type="text"
                />
              </label>
              <label>
                <span className="mb-3 block text-sm font-bold text-on-surface">{langText("Farm Size (Acres)", "शेतीचे क्षेत्र (एकर)")}</span>
                <input
                  className="w-full rounded-xl border border-outline-variant bg-surface-bright px-5 py-4 text-on-surface shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary"
                  type="number"
                  value={formState.fieldArea}
                  onChange={(event) => updateField("fieldArea", event.target.value)}
                />
              </label>
              <label>
                <span className="mb-3 block text-sm font-bold text-on-surface">{langText("Primary Crop", "मुख्य पीक")}</span>
                <input
                  className="w-full rounded-xl border border-outline-variant bg-surface-bright px-5 py-4 text-on-surface shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary"
                  placeholder={langText("Enter primary crop", "मुख्य पीक प्रविष्ट करा")}
                  type="text"
                  value={formState.farmingTypes}
                  onChange={(event) => updateField("farmingTypes", event.target.value)}
                />
              </label>
              <label className="col-span-1 md:col-span-2">
                <span className="mb-3 block text-sm font-bold text-on-surface">{langText("Equipment Owned", "मालकीची उपकरणे")}</span>
                <input
                  className="w-full rounded-xl border border-outline-variant bg-surface-bright px-5 py-4 text-on-surface shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary"
                  placeholder={langText("e.g. Tractor (50 HP), Rotavator", "उदा. ट्रॅक्टर (५० HP), रोटाव्हेटर")}
                  type="text"
                  value={formState.equipmentOwned}
                  onChange={(event) => updateField("equipmentOwned", event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-surface-container/50 bg-surface-container-lowest p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
            {error ? (
              <div className="mb-6 rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm font-medium text-error">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-surface-container pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                className="rounded-xl px-4 py-2 text-sm font-bold text-on-surface-variant transition-colors hover:bg-error/5 hover:text-error"
                type="button"
                onClick={() => router.refresh()}
              >
                {langText("Discard Changes", "बदल रद्द करा")}
              </button>
              <button
                className={`rounded-xl px-10 py-3.5 font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                  submitState === "success" ? "bg-emerald-600" : "bg-primary hover:bg-primary/90"
                }`}
                type="submit"
                disabled={isSubmitting}
                data-loading={isSubmitting ? "true" : "false"}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? <span className="kk-flow-spinner mr-2 inline-block align-middle" aria-hidden="true" /> : null}
                {submitLabel}
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
