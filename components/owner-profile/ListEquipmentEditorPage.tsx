"use client";

import { AppLink as Link } from "@/components/AppLink";
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

export function ListEquipmentEditorPage({
  listing,
  defaultVillage = "",
}: ListEquipmentEditorPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [files, setFiles] = useState<File[]>([]);
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
    description: listing?.description || "",
    workTypes: listing?.workTypes.join(", ") || "",
    tags: listing?.tags.join(", ") || "",
    operatorIncluded: listing?.operatorIncluded ?? true,
    availabilityMode: listing?.availableFrom ? "date" : "now",
    availableFrom: listing?.availableFrom || "",
    status: listing?.status || "active",
  });

  const uploadedPreviewUrls = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);
  const previewImages =
    uploadedPreviewUrls.length > 0
      ? uploadedPreviewUrls.slice(0, MAX_LISTING_IMAGES)
      : listing?.galleryImages?.length
        ? listing.galleryImages.slice(0, MAX_LISTING_IMAGES)
        : [];

  useEffect(() => {
    return () => {
      uploadedPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploadedPreviewUrls]);

  const updateField = (field: keyof typeof formState, value: string | boolean) => {
    setFormState((current) => ({ ...current, [field]: value }));
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
      formData.set("category", formState.category.trim());
      formData.set("location", formState.location.trim());
      formData.set("district", formState.district.trim() || formState.location.trim());
      formData.set("state", formState.state.trim());
      formData.set("description", formState.description.trim());
      formData.set("pricePerHour", formState.pricePerHour.trim());
      formData.set("hp", formState.hp.trim());
      formData.set("distanceKm", formState.serviceRadius.trim());
      formData.set("workTypes", formState.workTypes.trim());
      formData.set("tags", formState.tags.trim());
      formData.set("status", formState.status);
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
        setError(result.error || "Could not save the listing.");
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
        ? "Saving..."
        : "Publishing..."
      : submitState === "success"
        ? listing
          ? "Saved"
          : "Published"
        : listing
          ? "Save Changes"
          : "Publish Listing";

  return (
    <div className="font-body text-on-surface antialiased">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-6 lg:px-10 lg:py-8">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-primary md:text-4xl">
            {listing ? "Edit Equipment Listing" : "List New Equipment"}
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            {listing
              ? "Update the saved fields, availability, and live preview before saving."
              : "Add your equipment details and keep the live preview visible while you scroll."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-on-surface">
                <span className="material-symbols-outlined text-secondary">info</span>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">Equipment Type *</span>
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
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">Brand / Manufacturer</span>
                  <input
                    value={formState.brand}
                    onChange={(event) => {
                      updateField("brand", event.target.value);
                      updateField("name", [event.target.value.trim(), formState.model.trim()].filter(Boolean).join(" "));
                    }}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="e.g. Mahindra"
                    type="text"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">Model Name *</span>
                  <input
                    value={formState.model}
                    onChange={(event) => {
                      updateField("model", event.target.value);
                      updateField("name", [formState.brand.trim(), event.target.value.trim()].filter(Boolean).join(" "));
                    }}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="e.g. 575 DI"
                    type="text"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">HP / Capacity *</span>
                  <input
                    value={formState.hp}
                    onChange={(event) => updateField("hp", event.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="e.g. 45 HP"
                    type="text"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-on-surface">
                <span className="material-symbols-outlined text-secondary">payments</span>
                Pricing
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">Hourly Rate (₹) *</span>
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
                  <span className="block font-label text-sm font-medium text-on-surface-variant">Minimum Hours</span>
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
                    <span className="block text-sm font-medium text-on-surface">Includes Driver/Operator</span>
                    <span className="block text-xs text-on-surface-variant">Check this if the rate includes an operator.</span>
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-on-surface">
                <span className="material-symbols-outlined text-secondary">location_on</span>
                Location &amp; Service Area
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">Base Village/Town *</span>
                  <input
                    value={formState.location}
                    onChange={(event) => updateField("location", event.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="Enter base location"
                    type="text"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">District *</span>
                  <input
                    value={formState.district}
                    onChange={(event) => updateField("district", event.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="e.g. Nashik"
                    type="text"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">Service Radius (km) *</span>
                  <input
                    value={formState.serviceRadius}
                    onChange={(event) => updateField("serviceRadius", event.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="e.g. 15"
                    type="number"
                  />
                </label>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">Work Types</span>
                  <input
                    value={formState.workTypes}
                    onChange={(event) => updateField("workTypes", event.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="e.g. Ploughing, Harvesting"
                    type="text"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">Tags</span>
                  <input
                    value={formState.tags}
                    onChange={(event) => updateField("tags", event.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="e.g. Fuel efficient, Operator available"
                    type="text"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-on-surface">
                <span className="material-symbols-outlined text-secondary">calendar_month</span>
                Availability
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    checked={formState.availabilityMode === "now"}
                    onChange={() => updateField("availabilityMode", "now")}
                    className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
                    name="availability"
                    type="radio"
                  />
                  <span className="text-sm font-medium text-on-surface">Available Now</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    checked={formState.availabilityMode === "date"}
                    onChange={() => updateField("availabilityMode", "date")}
                    className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
                    name="availability"
                    type="radio"
                  />
                  <span className="text-sm font-medium text-on-surface">Available from specific date</span>
                </label>
                {formState.availabilityMode === "date" ? (
                  <label className="block space-y-2">
                    <span className="block font-label text-sm font-medium text-on-surface-variant">Choose availability date</span>
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
                <span className="material-symbols-outlined text-secondary">description</span>
                Description &amp; Photos
              </h2>
              <div className="space-y-6">
                <label className="space-y-2">
                  <span className="block font-label text-sm font-medium text-on-surface-variant">Listing Description *</span>
                  <textarea
                    value={formState.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    className="min-h-[150px] w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="Describe equipment condition, service coverage, and any operator details."
                  />
                </label>
                <label className="block cursor-pointer rounded-xl border-2 border-dashed border-outline-variant/50 p-8 text-center transition-colors hover:bg-surface-container-low">
                  <span className="material-symbols-outlined mb-2 text-4xl text-outline">upload_file</span>
                  <p className="font-body font-medium text-on-surface">Click to upload or drag and drop</p>
                  <p className="mt-1 text-sm text-on-surface-variant">Upload clear photos of your equipment.</p>
                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, MAX_LISTING_IMAGES))}
                  />
                </label>
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
                Cancel
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

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6 self-start">
              <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-xl">
                <div className="relative aspect-[4/3]">
                  {previewImages[0] ? (
                    <img
                      className="h-full w-full object-cover"
                      alt="Equipment live preview"
                      src={previewImages[0]}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-container-low text-center">
                      <div className="px-6">
                        <span className="material-symbols-outlined text-5xl text-outline">add_photo_alternate</span>
                        <p className="mt-3 text-sm font-bold text-on-surface">Upload a real equipment photo</p>
                        <p className="mt-1 text-xs text-on-surface-variant">Public listings need owner-provided images.</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute left-4 top-4 rounded-full bg-surface-container-lowest/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur font-label">
                    Live Preview
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-secondary font-label">
                        {formState.category || "Equipment"}
                      </p>
                      <h3 className="font-headline text-xl font-extrabold text-primary">
                        {[formState.brand.trim(), formState.model.trim()].filter(Boolean).join(" ") || formState.name || "Equipment Name"}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="font-headline text-lg font-black text-primary">₹{formState.pricePerHour || "0"}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant font-label">PER HOUR</p>
                    </div>
                  </div>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {(formState.hp ? [formState.hp] : []).concat(formState.tags.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 2)).map((tag) => (
                      <span key={tag} className="rounded bg-primary-fixed/50 px-2 py-1 text-[10px] font-bold text-on-primary-fixed font-label">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="border-t border-outline-variant/30 pt-4 text-sm text-on-surface-variant">
                    <p>{formState.location || "Location pending"}, {formState.district || "District pending"}</p>
                    <p className="mt-2">
                      {formState.availabilityMode === "date" && formState.availableFrom
                        ? `Available from ${formState.availableFrom}`
                        : "Available Now"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-secondary-container/20 bg-secondary-fixed/30 p-6">
                <h4 className="mb-2 flex items-center gap-2 font-headline text-sm font-bold text-on-secondary-fixed-variant">
                  <span className="material-symbols-outlined text-lg">verified_user</span>
                  Trust Policy
                </h4>
                <p className="font-body text-xs leading-relaxed text-on-secondary-fixed-variant/80">
                  Your listing will be reviewed with the current owner workflow after you publish or save changes.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
