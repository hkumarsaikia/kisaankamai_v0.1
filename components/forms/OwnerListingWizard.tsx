"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import { createListingAction, updateListingAction } from "@/lib/actions/local-data";
import { useLanguage } from "@/components/LanguageContext";
import {
  ChoicePills,
  FormField,
  FormGrid,
  FormNotice,
  FormStepActions,
  ReviewList,
} from "@/components/forms/FormKit";
import { useSmoothRouter } from "@/lib/client/useSmoothRouter";
import type { ListingRecord } from "@/lib/local-data/types";

type CategoryValue = "tractor" | "harvester" | "implement";
type StatusValue = "active" | "paused";

export function OwnerListingWizard({
  listing,
  defaultVillage,
}: {
  listing?: ListingRecord | null;
  defaultVillage: string;
}) {
  const { langText } = useLanguage();
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

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

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
        setError(result.error || langText("Could not save the listing.", "लिस्टिंग सेव्ह करता आली नाही."));
        return;
      }
      router.push(result.redirectTo || "/owner-profile");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">
              {listing ? langText("Edit listing flow", "लिस्टिंग संपादन फ्लो") : langText("New listing flow", "नवीन लिस्टिंग फ्लो")}
            </p>
            <h2 className="mt-2 text-2xl font-black text-primary">
              {langText("Complete the listing with the original fields.", "मूळ फील्डसह लिस्टिंग पूर्ण करा.")}
            </h2>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-on-surface-variant">
              {langText(
                "This layout follows the imported multi-step equipment form more closely while keeping the same Firebase-backed save, image upload, and redirect contracts.",
                "हा लेआउट आयात केलेल्या मल्टी-स्टेप उपकरण फॉर्मशी अधिक जुळतो आणि त्याच Firebase-आधारित सेव्ह, प्रतिमा अपलोड आणि रीडायरेक्ट करार कायम ठेवतो."
              )}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-outline-variant bg-surface-container-low px-4 py-3 text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
              {langText("Step", "पायरी")}
            </p>
            <p className="mt-1 text-2xl font-black text-primary">{step}/3</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            {
              id: 1,
              icon: "agriculture",
              title: langText("Equipment details", "उपकरण तपशील"),
              copy: langText("Name, category, horsepower, and pricing.", "नाव, प्रकार, हॉर्सपॉवर आणि किंमत."),
            },
            {
              id: 2,
              icon: "image",
              title: langText("Coverage and photos", "सेवा क्षेत्र आणि फोटो"),
              copy: langText("Location, tags, operator preference, and images.", "स्थान, टॅग, ऑपरेटर प्राधान्य आणि प्रतिमा."),
            },
            {
              id: 3,
              icon: "verified",
              title: langText("Review and publish", "पुनरावलोकन आणि प्रकाशित करा"),
              copy: langText("Confirm the details before saving.", "सेव्ह करण्यापूर्वी तपशील पुष्टी करा."),
            },
          ].map((item) => (
            <div
              key={item.id}
              className={`rounded-[1.4rem] border px-5 py-5 transition-colors ${
                step === item.id
                  ? "border-primary bg-primary-container text-white shadow-[0_18px_40px_-24px_rgba(20,59,46,0.55)]"
                  : "border-outline-variant bg-surface-container-low text-on-surface"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-80">
                    {langText("Step", "पायरी")} {item.id}
                  </p>
                  <h3 className="text-sm font-black">{item.title}</h3>
                </div>
              </div>
              <p className={`mt-3 text-sm leading-6 ${step === item.id ? "text-white/80" : "text-on-surface-variant"}`}>{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {error ? <FormNotice tone="error">{error}</FormNotice> : null}

      {step === 1 ? (
        <section className="grid gap-8 xl:grid-cols-[1.45fr_0.75fr]">
          <div className="space-y-8">
            <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm md:p-8">
              <div className="mb-6">
                <h3 className="text-xl font-black text-primary">{langText("Equipment details", "उपकरण तपशील")}</h3>
                <p className="mt-2 text-sm font-medium leading-7 text-on-surface-variant">
                  {langText(
                    "Add the same machine metadata renters already rely on while browsing and booking.",
                    "ब्राउझ आणि बुकिंग करताना भाडेकर्‍यांना लागणारे तेच मशीन मेटाडेटा जोडा."
                  )}
                </p>
              </div>
              <FormGrid>
                <FormField label={langText("Equipment name", "उपकरणाचे नाव")} required>
                  <input className="kk-input" value={formState.name} onChange={(event) => updateField("name", event.target.value)} />
                </FormField>
                <FormField label={langText("Category", "प्रकार")} required>
                  <ChoicePills
                    value={formState.category}
                    onChange={(value) => updateField("category", value)}
                    options={[
                      { label: langText("Tractor", "ट्रॅक्टर"), value: "tractor" },
                      { label: langText("Harvester", "हार्वेस्टर"), value: "harvester" },
                      { label: langText("Implement", "इम्प्लिमेंट"), value: "implement" },
                    ]}
                  />
                </FormField>
                <FormField label={langText("Horsepower or model detail", "हॉर्सपॉवर किंवा मॉडेल तपशील")} required>
                  <input className="kk-input" value={formState.hp} onChange={(event) => updateField("hp", event.target.value)} />
                </FormField>
                <FormField label={langText("Price per hour", "प्रति तास किंमत")} required>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-black text-on-surface-variant">₹</span>
                    <input className="kk-input pl-10" type="number" value={formState.pricePerHour} onChange={(event) => updateField("pricePerHour", event.target.value)} />
                  </div>
                </FormField>
              </FormGrid>
              <div className="mt-6">
                <FormField label={langText("Description", "वर्णन")} required>
                  <textarea className="kk-input min-h-36 resize-y" value={formState.description} onChange={(event) => updateField("description", event.target.value)} />
                </FormField>
              </div>
            </section>

            <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm md:p-8">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined rounded-2xl bg-tertiary-fixed px-3 py-3 text-2xl text-on-tertiary-fixed">lightbulb</span>
                <div>
                  <h3 className="text-lg font-black text-primary">{langText("Pricing tip", "किंमत सूचना")}</h3>
                  <p className="mt-2 text-sm font-medium leading-7 text-on-surface-variant">
                    {langText(
                      "Set a price that matches local expectations and the current quality of the machine. You can still pause or edit the listing later.",
                      "स्थानिक अपेक्षा आणि मशीनच्या सध्याच्या गुणवत्तेनुसार किंमत ठेवा. नंतरही लिस्टिंग थांबवता किंवा संपादित करता येईल."
                    )}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-outline-variant bg-primary-container p-6 text-white shadow-[0_22px_50px_-28px_rgba(20,59,46,0.65)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary-fixed">
                {langText("What renters will see", "भाडेकर्‍यांना काय दिसेल")}
              </p>
              <h3 className="mt-3 text-xl font-black">{formState.name || langText("Your equipment title", "तुमच्या उपकरणाचे शीर्षक")}</h3>
              <div className="mt-4 space-y-2 text-sm leading-6 text-white/80">
                <p>{formState.hp || langText("Horsepower / detail", "हॉर्सपॉवर / तपशील")}</p>
                <p>{formState.pricePerHour ? `₹${formState.pricePerHour}/hr` : langText("Hourly price not set", "प्रति तास किंमत नाही")}</p>
                <p>{formState.description || langText("The description preview appears here once you start typing.", "तुम्ही टाइप केल्यावर वर्णनाची झलक येथे दिसेल.")}</p>
              </div>
            </section>
            <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-secondary">{langText("Original contract preserved", "मूळ करार जतन")}</h3>
              <ul className="mt-4 space-y-3 text-sm font-medium leading-6 text-on-surface-variant">
                <li>{langText("The existing create/update listing actions still submit this form.", "विद्यमान create/update listing actions अजूनही हा फॉर्म सबमिट करतात.")}</li>
                <li>{langText("Uploaded images still use the current Firebase Storage pipeline.", "अपलोड केलेल्या प्रतिमा अजूनही सध्याच्या Firebase Storage पाइपलाइनचा वापर करतात.")}</li>
                <li>{langText("The owner profile still reads the same Firestore listing record.", "मालक प्रोफाइल अजूनही तीच Firestore listing नोंद वाचतो.")}</li>
              </ul>
            </section>
          </aside>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="grid gap-8 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-8">
            <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm md:p-8">
              <div className="mb-6">
                <h3 className="text-xl font-black text-primary">{langText("Coverage and availability", "सेवा क्षेत्र आणि उपलब्धता")}</h3>
                <p className="mt-2 text-sm font-medium leading-7 text-on-surface-variant">
                  {langText(
                    "Set the villages or districts you can reach, then add tags renters can scan quickly.",
                    "तुम्ही ज्या गावांपर्यंत किंवा जिल्ह्यांपर्यंत पोहोचू शकता ते सेट करा, मग भाडेकर्‍यांसाठी पटकन दिसतील असे टॅग जोडा."
                  )}
                </p>
              </div>
              <FormGrid columns={3}>
                <FormField label={langText("Village / location", "गाव / स्थान")} required>
                  <input className="kk-input" value={formState.location} onChange={(event) => updateField("location", event.target.value)} />
                </FormField>
                <FormField label={langText("District", "जिल्हा")} required>
                  <input className="kk-input" value={formState.district} onChange={(event) => updateField("district", event.target.value)} />
                </FormField>
                <FormField label={langText("State", "राज्य")} required>
                  <input className="kk-input" value={formState.state} onChange={(event) => updateField("state", event.target.value)} />
                </FormField>
              </FormGrid>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <FormField label={langText("Work types", "कामाचे प्रकार")} hint={langText("Comma separated. Example: Ploughing, Harvesting", "स्वल्पविरामाने वेगळे करा. उदाहरण: नांगरणी, कापणी")}>
                  <input className="kk-input" value={formState.workTypes} onChange={(event) => updateField("workTypes", event.target.value)} />
                </FormField>
                <FormField label={langText("Tags", "टॅग")} hint={langText("Comma separated. Example: Verified, Fuel efficient", "स्वल्पविरामाने वेगळे करा. उदाहरण: पडताळलेले, इंधन बचत")}>
                  <input className="kk-input" value={formState.tags} onChange={(event) => updateField("tags", event.target.value)} />
                </FormField>
                <FormField label={langText("Distance radius (km)", "त्रिज्या (किमी)")}>
                  <input className="kk-input" type="number" step="0.1" value={formState.distanceKm} onChange={(event) => updateField("distanceKm", event.target.value)} />
                </FormField>
                <FormField label={langText("Listing status", "लिस्टिंग स्थिती")}>
                  <ChoicePills
                    value={formState.status}
                    onChange={(value) => updateField("status", value)}
                    options={[
                      { label: langText("Active", "सक्रिय"), value: "active" },
                      { label: langText("Paused", "थांबवलेले"), value: "paused" },
                    ]}
                  />
                </FormField>
              </div>
              <label className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface">
                <input type="checkbox" checked={formState.operatorIncluded} onChange={(event) => updateField("operatorIncluded", event.target.checked)} />
                {langText("Operator included with the machine", "मशीनसोबत ऑपरेटर समाविष्ट आहे")}
              </label>
            </section>

            <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm md:p-8">
              <div className="mb-6">
                <h3 className="text-xl font-black text-primary">{langText("Listing photos", "लिस्टिंग फोटो")}</h3>
                <p className="mt-2 text-sm font-medium leading-7 text-on-surface-variant">
                  {langText(
                    "Upload clear images of the machine. These still save through the current Firebase upload adapter.",
                    "मशीनचे स्पष्ट फोटो अपलोड करा. हे अजूनही सध्याच्या Firebase upload adapter मधून सेव्ह होतात."
                  )}
                </p>
              </div>
              <div className="rounded-[1.6rem] border-2 border-dashed border-outline-variant bg-surface-container-low p-6">
                <FormField label={langText("Add photos", "फोटो जोडा")}>
                  <input
                    className="kk-input file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-bold file:text-white"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(event) => setFiles(Array.from(event.target.files || []))}
                  />
                </FormField>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {previewImages.length ? (
                  previewImages.slice(0, 8).map((image, index) => (
                    <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-[1.25rem] border border-outline-variant bg-surface-container-low">
                      <Image src={image} alt={`Listing preview ${index + 1}`} fill className="object-cover" />
                    </div>
                  ))
                ) : (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex aspect-square items-center justify-center rounded-[1.25rem] border-2 border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant">
                      <span className="material-symbols-outlined text-3xl">image</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-lowest shadow-sm">
              <div className="relative h-56">
                {previewImages[0] ? (
                  <Image src={previewImages[0]} alt={formState.name || "Listing cover preview"} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(20,59,46,0.18),_rgba(20,59,46,0.02))]">
                    <span className="material-symbols-outlined text-6xl text-primary/35">agriculture</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                    {langText("Cover preview", "कव्हर पूर्वावलोकन")}
                  </p>
                  <h3 className="mt-2 text-lg font-black">{formState.name || langText("Listing title", "लिस्टिंग शीर्षक")}</h3>
                  <p className="text-sm text-white/75">
                    {formState.location || langText("Location appears here", "स्थान येथे दिसेल")}
                  </p>
                </div>
              </div>
              <div className="space-y-3 p-5 text-sm font-medium text-on-surface-variant">
                <div className="flex items-center justify-between">
                  <span>{langText("Status", "स्थिती")}</span>
                  <span className="font-black text-primary">{formState.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{langText("Radius", "त्रिज्या")}</span>
                  <span className="font-black text-primary">{formState.distanceKm || "0"} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{langText("Operator", "ऑपरेटर")}</span>
                  <span className="font-black text-primary">
                    {formState.operatorIncluded ? langText("Included", "समाविष्ट") : langText("Not included", "समाविष्ट नाही")}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-black text-primary">{langText("Review and publish", "पुनरावलोकन आणि प्रकाशित करा")}</h3>
              <p className="mt-2 text-sm font-medium leading-7 text-on-surface-variant">
                {langText("Check the same values that will be saved to the shared Firebase record.", "शेअर्ड Firebase नोंदीत सेव्ह होणारी तीच मूल्ये तपासा.")}
              </p>
            </div>
            <ReviewList
              items={[
                { label: langText("Name", "नाव"), value: formState.name },
                { label: langText("Category", "प्रकार"), value: formState.category },
                { label: langText("Horsepower / detail", "हॉर्सपॉवर / तपशील"), value: formState.hp },
                { label: langText("Price per hour", "प्रति तास किंमत"), value: formState.pricePerHour ? `₹${formState.pricePerHour}` : "-" },
                { label: langText("Location", "स्थान"), value: `${formState.location}, ${formState.district}, ${formState.state}` },
                { label: langText("Work types", "कामाचे प्रकार"), value: formState.workTypes || "-" },
                { label: langText("Tags", "टॅग"), value: formState.tags || "-" },
                { label: langText("Status", "स्थिती"), value: formState.status },
                { label: langText("Operator included", "ऑपरेटर समाविष्ट"), value: formState.operatorIncluded ? langText("Yes", "होय") : langText("No", "नाही") },
                { label: langText("Images selected", "निवडलेल्या प्रतिमा"), value: previewImages.length || 0 },
              ]}
            />
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-outline-variant bg-primary-container p-6 text-white shadow-[0_22px_50px_-28px_rgba(20,59,46,0.65)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary-fixed">
                {langText("Ready to publish", "प्रकाशित करण्यास तयार")}
              </p>
              <h3 className="mt-3 text-xl font-black">
                {listing ? langText("Save the changes to this listing.", "या लिस्टिंगमधील बदल सेव्ह करा.") : langText("Create the listing and open the owner equipment page.", "लिस्टिंग तयार करा आणि मालकाच्या उपकरण पृष्ठावर जा.")}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/80">
                {langText(
                  "The submit action keeps the same backend flow. This redesign only improves the owner-facing experience and readability.",
                  "सबमिट action तोच backend flow वापरते. हा बदल फक्त मालक-सामोरील अनुभव आणि वाचनक्षमता सुधारतो."
                )}
              </p>
            </section>

            <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
              <FormStepActions
                backLabel={langText("Back", "मागे")}
                nextLabel={
                  isPending
                    ? langText("Saving...", "सेव्ह होत आहे...")
                    : listing
                      ? langText("Save listing", "लिस्टिंग सेव्ह करा")
                      : langText("Create listing", "लिस्टिंग तयार करा")
                }
                onBack={() => setStep(2)}
                submit
                disableNext={isPending}
              />
            </section>
          </aside>
        </section>
      ) : null}

      {step < 3 ? (
        <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
          <FormStepActions
            backLabel={langText("Back", "मागे")}
            nextLabel={
              step === 1
                ? langText("Continue to coverage", "सेवा क्षेत्राकडे पुढे")
                : langText("Review listing", "लिस्टिंग पुनरावलोकन")
            }
            onBack={step === 1 ? undefined : () => setStep(step - 1)}
            onNext={() => setStep(step + 1)}
            disableNext={
              step === 1
                ? !formState.name || !formState.hp || !formState.pricePerHour || !formState.description
                : !formState.location || !formState.district || !formState.state
            }
          />
        </section>
      ) : null}
    </form>
  );
}
