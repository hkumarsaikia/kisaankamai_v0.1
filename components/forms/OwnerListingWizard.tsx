"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { createListingAction, updateListingAction } from "@/lib/actions/local-data";
import { useSmoothRouter } from "@/lib/client/useSmoothRouter";
import type { ListingRecord } from "@/lib/local-data/types";
import { ChoicePills, FormField, FormGrid, FormNotice, FormSection, FormShell, FormStepActions, ReviewList } from "@/components/forms/FormKit";

type CategoryValue = "tractor" | "harvester" | "implement";
type StatusValue = "active" | "paused";

export function OwnerListingWizard({
  listing,
  defaultVillage,
}: {
  listing?: ListingRecord | null;
  defaultVillage: string;
}) {
  const router = useSmoothRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<File[]>([]);
  const [formState, setFormState] = useState({
    name: listing?.name || "",
    category: (listing?.category || "tractor") as CategoryValue,
    hp: listing?.hp || "",
    pricePerHour: String(listing?.pricePerHour || ""),
    location: listing?.location || defaultVillage || "",
    district: listing?.district || "",
    state: listing?.state || "Maharashtra",
    description: listing?.description || "",
    workTypes: listing?.workTypes.join(", ") || "",
    tags: listing?.tags.join(", ") || "",
    status: (listing?.status || "active") as StatusValue,
    distanceKm: String(listing?.distanceKm || 0),
    operatorIncluded: listing?.operatorIncluded ?? true,
  });

  const imagePreviewUrls = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);
  const previewImages = imagePreviewUrls.length ? imagePreviewUrls : listing?.imagePaths || [];

  const updateField = (field: keyof typeof formState, value: string | boolean) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const formData = new FormData();
      if (listing?.id) formData.set("listingId", listing.id);
      formData.set("name", formState.name);
      formData.set("category", formState.category);
      formData.set("hp", formState.hp);
      formData.set("pricePerHour", formState.pricePerHour);
      formData.set("location", formState.location);
      formData.set("district", formState.district);
      formData.set("state", formState.state);
      formData.set("description", formState.description);
      formData.set("workTypes", formState.workTypes);
      formData.set("tags", formState.tags);
      formData.set("status", formState.status);
      formData.set("distanceKm", formState.distanceKm);
      if (formState.operatorIncluded) formData.set("operatorIncluded", "on");
      for (const file of files) {
        formData.append("images", file);
      }

      const result = listing ? await updateListingAction(formData) : await createListingAction(formData);
      if (!result.ok) {
        setError(result.error || "Could not save the listing.");
        return;
      }
      router.push(result.redirectTo || "/owner-profile/equipment");
    });
  };

  return (
    <FormShell
      eyebrow={listing ? "Edit Listing" : "Owner Listing"}
      title={listing ? "Refine your equipment listing" : "Publish a new equipment listing"}
      description="This is still backed by the same local listing actions and JSON data store, but the flow now uses progressive sections, review state, and image previews."
      step={step}
      totalSteps={3}
      aside={
        <div className="space-y-4">
          <h3 className="text-lg font-black text-primary">Local owner checklist</h3>
          <ul className="space-y-3 text-sm font-medium text-on-surface-variant">
            <li>Listings persist into `data/listings.json`.</li>
            <li>Image uploads are stored under `public/uploads/listings`.</li>
            <li>Public, renter, and owner views revalidate from the same record.</li>
          </ul>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error ? <FormNotice tone="error">{error}</FormNotice> : null}

        {step === 1 ? (
          <FormSection title="Equipment basics" description="Start with the public-facing core details renters will use to evaluate this listing.">
            <FormGrid>
              <FormField label="Name" required>
                <input className="kk-input" value={formState.name} onChange={(event) => updateField("name", event.target.value)} />
              </FormField>
              <FormField label="Horsepower / detail" required>
                <input className="kk-input" value={formState.hp} onChange={(event) => updateField("hp", event.target.value)} />
              </FormField>
              <FormField label="Price per hour" required>
                <input className="kk-input" type="number" value={formState.pricePerHour} onChange={(event) => updateField("pricePerHour", event.target.value)} />
              </FormField>
              <FormField label="Category" required>
                <ChoicePills
                  value={formState.category}
                  onChange={(value) => updateField("category", value)}
                  options={[
                    { label: "Tractor", value: "tractor" },
                    { label: "Harvester", value: "harvester" },
                    { label: "Implement", value: "implement" },
                  ]}
                />
              </FormField>
            </FormGrid>
            <FormField label="Description" required>
              <textarea className="kk-input min-h-32 resize-y" value={formState.description} onChange={(event) => updateField("description", event.target.value)} />
            </FormField>
            <FormStepActions nextLabel="Continue to coverage" onNext={() => setStep(2)} disableNext={!formState.name || !formState.hp || !formState.pricePerHour || !formState.description} />
          </FormSection>
        ) : null}

        {step === 2 ? (
          <FormSection title="Coverage, tags, and media" description="Location, supported work types, and media all stay wired to the same existing listing schema.">
            <FormGrid columns={3}>
              <FormField label="Village / location" required>
                <input className="kk-input" value={formState.location} onChange={(event) => updateField("location", event.target.value)} />
              </FormField>
              <FormField label="District" required>
                <input className="kk-input" value={formState.district} onChange={(event) => updateField("district", event.target.value)} />
              </FormField>
              <FormField label="State" required>
                <input className="kk-input" value={formState.state} onChange={(event) => updateField("state", event.target.value)} />
              </FormField>
            </FormGrid>
            <FormGrid>
              <FormField label="Work types" hint="Comma separated. Example: Ploughing, Transport, Harvesting">
                <input className="kk-input" value={formState.workTypes} onChange={(event) => updateField("workTypes", event.target.value)} />
              </FormField>
              <FormField label="Tags" hint="Comma separated. Example: Verified, Fuel efficient">
                <input className="kk-input" value={formState.tags} onChange={(event) => updateField("tags", event.target.value)} />
              </FormField>
              <FormField label="Distance (km)">
                <input className="kk-input" type="number" step="0.1" value={formState.distanceKm} onChange={(event) => updateField("distanceKm", event.target.value)} />
              </FormField>
              <FormField label="Status">
                <ChoicePills
                  value={formState.status}
                  onChange={(value) => updateField("status", value)}
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Paused", value: "paused" },
                  ]}
                />
              </FormField>
            </FormGrid>
            <label className="inline-flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface">
              <input type="checkbox" checked={formState.operatorIncluded} onChange={(event) => updateField("operatorIncluded", event.target.checked)} />
              Operator included
            </label>
            <FormField label="Listing images" hint="New uploads are added through the same local upload pipeline already used by the owner listing backend.">
              <input className="kk-input file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-bold file:text-white" type="file" multiple accept="image/*" onChange={(event) => setFiles(Array.from(event.target.files || []))} />
            </FormField>
            {previewImages.length ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {previewImages.slice(0, 6).map((image, index) => (
                  <div key={`${image}-${index}`} className="relative h-28 overflow-hidden rounded-2xl border border-outline-variant">
                    <Image src={image} alt={`Listing preview ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
            <FormStepActions backLabel="Back" nextLabel="Review listing" onBack={() => setStep(1)} onNext={() => setStep(3)} disableNext={!formState.location || !formState.district || !formState.state} />
          </FormSection>
        ) : null}

        {step === 3 ? (
          <FormSection title="Review and publish" description="The review step mirrors OpenForm-style progressive confirmation while keeping the current local-data submission contract.">
            <ReviewList
              items={[
                { label: "Name", value: formState.name },
                { label: "Category", value: formState.category },
                { label: "Horsepower / detail", value: formState.hp },
                { label: "Price per hour", value: formState.pricePerHour },
                { label: "Location", value: `${formState.location}, ${formState.district}, ${formState.state}` },
                { label: "Work types", value: formState.workTypes || "-" },
                { label: "Tags", value: formState.tags || "-" },
                { label: "Status", value: formState.status },
                { label: "Operator included", value: formState.operatorIncluded ? "Yes" : "No" },
                { label: "Images selected", value: previewImages.length || 0 },
              ]}
            />
            <FormStepActions backLabel="Back" nextLabel={isPending ? "Saving..." : listing ? "Save listing" : "Create listing"} onBack={() => setStep(2)} submit disableNext={isPending} />
          </FormSection>
        ) : null}
      </form>
    </FormShell>
  );
}

