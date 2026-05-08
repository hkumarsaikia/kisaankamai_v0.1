"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { BASE_EQUIPMENT_CATEGORIES } from "@/lib/equipment-categories";
import { createListingAction, updateListingAction } from "@/lib/actions/local-data";
import type { ListingRecord } from "@/lib/local-data/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

type ListEquipmentEditorPageProps = {
  listing?: ListingRecord | null;
  defaultVillage?: string;
};
const MAX_LISTING_IMAGES = 3;
const PHOTO_SLOT_LABELS = ["Photo 1", "Photo 2", "Photo 3"] as const;
type AvailabilityMode = "now" | "date" | "unavailable";

function normalizeCustomCategory(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "other";
}

export function ListEquipmentEditorPage({
  listing,
  defaultVillage = "",
}: ListEquipmentEditorPageProps) {
  const { langText } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [fileSlots, setFileSlots] = useState<Array<File | null>>([null, null, null]);
  const [customCategory, setCustomCategory] = useState("");
  const [formState, setFormState] = useState({
    name: listing?.name || "",
    category: listing?.category || "tractor",
    brand: listing?.name.split(" ").slice(0, 1).join(" ") || "",
    model: listing?.name.split(" ").slice(1).join(" ") || "",
    hp: listing?.hp || "",
    pricePerHour: String(listing?.pricePerHour || ""),
    minimumHours: "2",
    location: listing?.location || defaultVillage || "",
    district: listing?.district || "",
    state: listing?.state || "Maharashtra",
    serviceRadius: String(listing?.distanceKm || 0),
    workTypes: listing?.workTypes.join(", ") || "",
    operatorIncluded: listing?.operatorIncluded ?? true,
    availabilityMode: (listing?.status === "paused"
      ? "unavailable"
      : listing?.availableFrom
        ? "date"
        : "now") as AvailabilityMode,
    availableFrom: listing?.availableFrom || "",
    status: listing?.status || "active",
  });

  const files = useMemo(() => fileSlots.filter((file): file is File => file instanceof File), [fileSlots]);
  const objectPreviewUrls = useMemo(
    () => fileSlots.map((file) => (file ? URL.createObjectURL(file) : "")),
    [fileSlots]
  );

  useEffect(() => {
    return () => {
      objectPreviewUrls.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [objectPreviewUrls]);

  const updateField = (field: keyof typeof formState, value: string | boolean) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const updateAvailabilityMode = (availabilityMode: AvailabilityMode) => {
    setFormState((current) => ({
      ...current,
      availabilityMode,
      status: availabilityMode === "unavailable" ? "paused" : "active",
      availableFrom: availabilityMode === "date" ? current.availableFrom : "",
    }));
  };

  const updateFileSlot = (index: number, file: File | null) => {
    setFileSlots((current) => {
      const next = [...current];
      next[index] = file;
      return next.slice(0, MAX_LISTING_IMAGES);
    });
  };

  const removePhotoSlot = (index: number) => {
    updateFileSlot(index, null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitState("pending");

    startTransition(async () => {
      const formData = new FormData();
      if (listing?.id) {
        formData.set("listingId", listing.id);
      }

      const equipmentName =
        formState.name.trim() ||
        [formState.brand.trim(), formState.model.trim()].filter(Boolean).join(" ").trim();

      formData.set("name", equipmentName);
      const categoryValue =
        formState.category === "other"
          ? normalizeCustomCategory(customCategory)
          : formState.category.trim();

      formData.set("category", categoryValue);
      formData.set("location", formState.location.trim());
      formData.set("district", formState.district.trim() || formState.location.trim());
      formData.set("state", formState.state.trim());
      formData.set("description", "");
      formData.set("pricePerHour", formState.pricePerHour.trim());
      formData.set("hp", formState.hp.trim());
      formData.set("distanceKm", formState.serviceRadius.trim());
      formData.set("workTypes", formState.workTypes.trim());
      formData.set("status", formState.availabilityMode === "unavailable" ? "paused" : "active");
      formData.set("availabilityMode", formState.availabilityMode);
      formData.set("unitLabel", "per hour");
      if (formState.operatorIncluded) {
        formData.set("operatorIncluded", "on");
      }
      if (formState.availabilityMode === "date" && formState.availableFrom) {
        formData.set("availableFrom", formState.availableFrom);
      }
      for (const file of files) {
        formData.append("images", file);
      }

      const result = listing ? await updateListingAction(formData) : await createListingAction(formData);
      if (!result.ok) {
        setError(result.error || langText("Could not save the listing.", "लिस्टिंग जतन करता आली नाही."));
        setSubmitState("error");
        return;
      }

      setSubmitState("success");
      window.setTimeout(() => {
        router.push(result.redirectTo || "/owner-profile/browse");
        router.refresh();
      }, 700);
    });
  };

  const submitLabel =
    submitState === "pending"
      ? listing
        ? langText("Saving...", "जतन करत आहे...")
        : langText("Publishing...", "प्रकाशित करत आहे...")
      : submitState === "success"
        ? listing
          ? langText("Saved", "जतन झाले")
          : langText("Published", "प्रकाशित झाले")
        : listing
          ? langText("Save Changes", "बदल जतन करा")
          : langText("Publish Listing", "लिस्टिंग प्रकाशित करा");

  return (
    <div className="font-body text-on-surface antialiased">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-6 lg:px-10 lg:py-8">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-primary md:text-4xl">
            {listing
              ? langText("Edit Equipment Listing", "उपकरण लिस्टिंग संपादित करा")
              : langText("List New Equipment", "नवीन उपकरण सूचीबद्ध करा")}
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            {listing
              ? langText(
                  "Update the saved fields, availability, and photo slots before saving.",
                  "जतन करण्यापूर्वी फील्ड, उपलब्धता आणि फोटो स्लॉट अपडेट करा."
                )
              : langText(
                  "Add equipment details, pricing, service area, and three listing photos.",
                  "उपकरण तपशील, किंमत, सेवा क्षेत्र आणि तीन लिस्टिंग फोटो जोडा."
                )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
          <div className="space-y-8">
            <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-on-surface">
                <span className="material-symbols-outlined text-secondary">info</span>
                {langText("Basic Information", "मूलभूत माहिती")}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">{langText("Equipment Type *", "उपकरण प्रकार *")}</span>
                  <select
                    value={formState.category}
                    onChange={(event) => updateField("category", event.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                  >
                    {BASE_EQUIPMENT_CATEGORIES.map((category) => (
                      <option key={category.category} value={category.category}>
                        {category.name}
                      </option>
                    ))}
                    <option value="other">{langText("Other", "इतर")}</option>
                  </select>
                </label>
                {formState.category === "other" ? (
                  <label className="space-y-2">
                    <span className="block font-label text-sm font-medium text-on-surface-variant">{langText("Other Equipment Type *", "इतर उपकरण प्रकार *")}</span>
                    <input
                      value={customCategory}
                      onChange={(event) => setCustomCategory(event.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                      placeholder={langText("Enter equipment type", "उपकरण प्रकार लिहा")}
                      type="text"
                    />
                  </label>
                ) : null}
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">{langText("Brand / Manufacturer", "ब्रँड / उत्पादक")}</span>
                  <input
                    value={formState.brand}
                    onChange={(event) => {
                      updateField("brand", event.target.value);
                      updateField("name", [event.target.value.trim(), formState.model.trim()].filter(Boolean).join(" "));
                    }}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder={langText("e.g. Mahindra", "उदा. महिंद्रा")}
                    type="text"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">{langText("Model Name *", "मॉडेल नाव *")}</span>
                  <input
                    value={formState.model}
                    onChange={(event) => {
                      updateField("model", event.target.value);
                      updateField("name", [formState.brand.trim(), event.target.value.trim()].filter(Boolean).join(" "));
                    }}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder={langText("e.g. 575 DI", "उदा. 575 DI")}
                    type="text"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">{langText("HP / Capacity *", "HP / क्षमता *")}</span>
                  <input
                    value={formState.hp}
                    onChange={(event) => updateField("hp", event.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder={langText("e.g. 45 HP", "उदा. 45 HP")}
                    type="text"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-on-surface">
                <span className="material-symbols-outlined text-secondary">payments</span>
                {langText("Pricing", "किंमत")}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">{langText("Hourly Rate (₹) *", "प्रति तास दर (₹) *")}</span>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">₹</span>
                    <input
                      value={formState.pricePerHour}
                      onChange={(event) => updateField("pricePerHour", event.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 pl-8 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                      placeholder="0.00"
                      type="number"
                    />
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">{langText("Minimum Hours", "किमान तास")}</span>
                  <input
                    value={formState.minimumHours}
                    onChange={(event) => updateField("minimumHours", event.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="e.g. 2"
                    type="number"
                  />
                </label>
                <label className="md:col-span-2 flex cursor-pointer items-center gap-3 rounded-lg border border-outline-variant/50 p-4 transition-colors hover:bg-surface-container-low">
                  <input
                    checked={formState.operatorIncluded}
                    onChange={(event) => updateField("operatorIncluded", event.target.checked)}
                    className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
                    type="checkbox"
                  />
                  <div>
                    <span className="block text-sm font-medium text-on-surface">{langText("Includes Driver/Operator", "ड्रायव्हर/ऑपरेटर समाविष्ट")}</span>
                    <span className="block text-xs text-on-surface-variant">{langText("Check this if the rate includes an operator.", "दरात ऑपरेटर समाविष्ट असल्यास हे निवडा.")}</span>
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-on-surface">
                <span className="material-symbols-outlined text-secondary">location_on</span>
                {langText("Location & Service Area", "स्थान आणि सेवा क्षेत्र")}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">{langText("Base Village/Town *", "मुख्य गाव/शहर *")}</span>
                  <input
                    value={formState.location}
                    onChange={(event) => updateField("location", event.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder={langText("Enter base location", "मुख्य ठिकाण लिहा")}
                    type="text"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">{langText("District *", "जिल्हा *")}</span>
                  <input
                    value={formState.district}
                    onChange={(event) => updateField("district", event.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder={langText("e.g. Nashik", "उदा. नाशिक")}
                    type="text"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">{langText("Service Radius (km) *", "सेवा त्रिज्या (कि.मी.) *")}</span>
                  <input
                    value={formState.serviceRadius}
                    onChange={(event) => updateField("serviceRadius", event.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="e.g. 15"
                    type="number"
                  />
                </label>
              </div>
              <div className="mt-6 grid gap-6">
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">{langText("Work Types", "कामाचे प्रकार")}</span>
                  <input
                    value={formState.workTypes}
                    onChange={(event) => updateField("workTypes", event.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder={langText("e.g. Ploughing, Harvesting", "उदा. नांगरणी, कापणी")}
                    type="text"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-on-surface">
                <span className="material-symbols-outlined text-secondary">calendar_month</span>
                {langText("Availability", "उपलब्धता")}
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    checked={formState.availabilityMode === "now"}
                    onChange={() => updateAvailabilityMode("now")}
                    className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
                    name="availability"
                    type="radio"
                  />
                  <span className="text-sm font-medium text-on-surface">{langText("Available Now", "आता उपलब्ध")}</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    checked={formState.availabilityMode === "date"}
                    onChange={() => updateAvailabilityMode("date")}
                    className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
                    name="availability"
                    type="radio"
                  />
                  <span className="text-sm font-medium text-on-surface">{langText("Available from specific date", "निश्चित तारखेपासून उपलब्ध")}</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    checked={formState.availabilityMode === "unavailable"}
                    onChange={() => updateAvailabilityMode("unavailable")}
                    className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
                    name="availability"
                    type="radio"
                  />
                  <span className="text-sm font-medium text-on-surface">{langText("Temporarily unavailable", "तात्पुरते उपलब्ध नाही")}</span>
                </label>
                {formState.availabilityMode === "date" ? (
                  <label className="block space-y-2">
                    <span className="block font-label text-sm font-medium text-on-surface-variant">{langText("Choose availability date", "उपलब्धतेची तारीख निवडा")}</span>
                    <input
                      value={formState.availableFrom}
                      onChange={(event) => updateField("availableFrom", event.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                      type="date"
                    />
                  </label>
                ) : null}
              </div>
            </section>

            <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-on-surface">
                <span className="material-symbols-outlined text-secondary">add_photo_alternate</span>
                {langText("Photos", "फोटो")}
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {PHOTO_SLOT_LABELS.map((slotLabel, slot) => {
                  const previewUrl = objectPreviewUrls[slot];

                  return (
                    <div key={slot} className="relative">
                      <label className="block cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-outline-variant/50 bg-surface-container-lowest text-center transition-colors hover:bg-surface-container-low">
                        <span className="sr-only">{langText(slotLabel, `फोटो ${slot + 1}`)}</span>
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt={fileSlots[slot]?.name || langText(slotLabel, `फोटो ${slot + 1}`)}
                            className="h-44 w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-44 flex-col items-center justify-center p-6">
                            <span className="material-symbols-outlined mb-2 text-4xl text-outline">upload_file</span>
                            <span className="font-body font-bold text-on-surface">{langText(slotLabel, `फोटो ${slot + 1}`)}</span>
                            <span className="mt-1 text-xs text-on-surface-variant">
                              {langText("Upload a clear equipment photo", "स्पष्ट उपकरण फोटो अपलोड करा")}
                            </span>
                          </span>
                        )}
                        <input
                          className="hidden"
                          type="file"
                          accept="image/*"
                          onChange={(event) => updateFileSlot(slot, event.target.files?.[0] || null)}
                        />
                      </label>
                      {fileSlots[slot] ? (
                        <button
                          type="button"
                          onClick={() => removePhotoSlot(slot)}
                          aria-label={langText(`Remove ${slotLabel}`, `फोटो ${slot + 1} काढा`)}
                          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/75 text-white shadow-lg backdrop-blur transition-colors hover:bg-red-600"
                        >
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      ) : null}
                      <p className="mt-2 truncate text-xs font-semibold text-on-surface-variant">
                        {fileSlots[slot]?.name || langText("No photo selected", "फोटो निवडलेला नाही")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {error ? (
              <div className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm font-medium text-error">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-end">
              <Link
                href="/owner-profile/browse"
                className="w-full rounded-lg border border-outline px-6 py-3 text-center font-label font-medium text-on-surface-variant transition-colors hover:bg-surface-variant sm:w-auto"
              >
                {langText("Cancel", "रद्द करा")}
              </Link>
              <button
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-8 py-3 font-label font-medium text-on-primary shadow-sm transition-colors sm:w-auto ${
                  submitState === "success"
                    ? "bg-emerald-600"
                    : "bg-primary hover:bg-primary-container"
                }`}
                type="submit"
                disabled={isPending}
              >
                {submitLabel}
                <span className="material-symbols-outlined text-sm">
                  {submitState === "success" ? "task_alt" : "check_circle"}
                </span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
