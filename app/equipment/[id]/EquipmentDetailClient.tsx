"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LazyMap } from "@/components/LazyMap";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/ScrollReveal";
import { useLanguage } from "@/components/LanguageContext";
import { postJson, SubmissionError } from "@/lib/client/forms";
import type { EquipmentRecord } from "@/lib/equipment";
import { IS_PAGES_BUILD } from "@/lib/runtime";
import { assetPath } from "@/lib/site";
import { bookingRequestSchema } from "@/lib/validation/forms";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

export default function EquipmentDetailClient({
  equipment,
  relatedEquipment,
}: {
  equipment: EquipmentRecord;
  relatedEquipment: EquipmentRecord[];
}) {
  const { langText } = useLanguage();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    fieldLocation: "",
    workType: equipment.workTypes[0] || "Ploughing",
    approxHours: "",
    phone: "",
  });

  const markers = useMemo(
    () => [
      {
        lat: 16.86,
        lng: 74.57,
        label: equipment.name,
        sublabel: `${equipment.location}, ${equipment.district}`,
        color: "#693c00",
      },
    ],
    [equipment]
  );

  const handleBookingRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const parsed = bookingRequestSchema.safeParse({
      sourcePath: `/equipment/${equipment.id}`,
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      fieldLocation: formState.fieldLocation,
      workType: formState.workType,
      approxHours: formState.approxHours,
      phone: formState.phone,
      startDate: "",
      duration: "",
      task: formState.workType,
      fieldSize: "",
    });

    if (!parsed.success) {
      setError(
        parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          langText("Please complete the booking request form.", "कृपया booking request form पूर्ण करा.")
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (!IS_PAGES_BUILD) {
        await postJson("/api/forms/booking-request", parsed.data);
      }
      setSuccess(
        langText(
          "Booking request sent. Our team will confirm availability shortly.",
          "Booking विनंती पाठवली. आमची टीम लवकरच उपलब्धता निश्चित करेल."
        )
      );
      setFormState({
        fieldLocation: "",
        workType: equipment.workTypes[0] || "Ploughing",
        approxHours: "",
        phone: "",
      });
    } catch (submitError) {
      if (submitError instanceof SubmissionError) {
        setError(submitError.message);
      } else {
        setError(
          langText(
            "Could not submit the booking request right now.",
            "सध्या booking request पाठवता आली नाही."
          )
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface dark:bg-slate-950">
      <Header />
      <div className="mx-auto max-w-screen-2xl px-4 pb-12 pt-24 md:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-outline dark:text-slate-400">
          <Link href="/" className="transition-colors hover:text-primary dark:hover:text-emerald-400">
            Home
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link href="/rent-equipment" className="transition-colors hover:text-primary dark:hover:text-emerald-400">
            Rent
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-black text-on-surface dark:text-white">{equipment.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <ScrollReveal className="space-y-4">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-3xl bg-surface-variant dark:bg-slate-900/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full w-full object-cover"
                  alt={equipment.name}
                  src={assetPath(equipment.coverImage)}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
                {equipment.galleryImages.slice(0, 4).map((image, index) => (
                  <div key={`${image}-${index}`} className="aspect-square overflow-hidden rounded-2xl bg-surface-variant dark:bg-slate-900/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="h-full w-full object-cover"
                      alt={`${equipment.name} gallery ${index + 1}`}
                      src={assetPath(image)}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal className="flex flex-col gap-6 border-b border-outline-variant pb-8 dark:border-slate-800/50 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-secondary-fixed px-3 py-1 text-[10px] font-black uppercase tracking-widest text-on-secondary-fixed">
                    {equipment.categoryLabel}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold text-on-tertiary-container dark:text-amber-400">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    {equipment.rating.toFixed(1)}
                  </span>
                </div>
                <h1 className="text-4xl font-black text-primary dark:text-emerald-50 md:text-5xl">{equipment.name}</h1>
                <p className="mt-2 flex items-center gap-2 text-lg text-on-surface-variant dark:text-slate-400">
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  {equipment.location}, {equipment.district}
                </p>
                <p className="mt-4 max-w-3xl font-medium text-on-surface-variant dark:text-slate-400">
                  {equipment.description}
                </p>
              </div>
              <div className="rounded-3xl border border-outline-variant/30 bg-surface-container p-6 dark:border-slate-800/50 dark:bg-slate-900/50">
                <p className="text-sm font-bold uppercase tracking-widest text-outline dark:text-slate-500">
                  {langText("Rental starting at", "भाडे सुरू")}
                </p>
                <p className="mt-2 text-3xl font-black text-primary dark:text-emerald-50">
                  ₹{equipment.pricePerHour}{" "}
                  <span className="text-sm font-medium text-on-surface-variant dark:text-slate-400">
                    / {equipment.unitLabel}
                  </span>
                </p>
              </div>
            </ScrollReveal>

            <ScrollRevealGroup className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Power", value: equipment.hp, icon: "settings_input_component" },
                { label: "Distance", value: `${equipment.distanceKm} km`, icon: "distance" },
                { label: "Operator", value: equipment.operatorIncluded ? "Included" : "Optional", icon: "person" },
                { label: "Owner", value: equipment.ownerVerified ? "Verified" : "Pending", icon: "verified_user" },
              ].map((spec) => (
                <ScrollRevealItem key={spec.label}>
                  <div className="rounded-2xl border border-outline-variant/50 bg-white p-5 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/40">
                    <span className="material-symbols-outlined mb-3 text-secondary dark:text-amber-400">{spec.icon}</span>
                    <p className="text-xs font-black uppercase tracking-widest text-outline dark:text-slate-500">{spec.label}</p>
                    <p className="mt-1 font-black text-on-surface dark:text-white">{spec.value}</p>
                  </div>
                </ScrollRevealItem>
              ))}
            </ScrollRevealGroup>

            <ScrollRevealGroup className="grid gap-12 md:grid-cols-2">
              <ScrollRevealItem>
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-primary dark:text-emerald-50">
                    {langText("Features & Inclusions", "वैशिष्ट्ये आणि समावेश")}
                  </h2>
                  <ul className="space-y-4">
                    {equipment.tags.map((tag) => (
                      <li key={tag} className="flex items-start gap-4">
                        <div className="mt-0.5 rounded-full bg-primary-fixed p-1.5 dark:bg-emerald-900/40">
                          <span className="material-symbols-outlined text-sm text-primary dark:text-emerald-400">
                            check
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-on-surface dark:text-white">{tag}</p>
                          <p className="text-sm text-on-surface-variant dark:text-slate-400">
                            {equipment.name} is available for {equipment.workTypes.join(", ")}.
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-primary dark:text-emerald-50">
                    {langText("Owner Details", "मालक माहिती")}
                  </h2>
                  <div className="flex items-center gap-5 rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6 dark:border-slate-800/50 dark:bg-slate-900/40">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-slate-500 shadow-lg dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-outline dark:text-slate-500">
                        {langText("Listing Owner", "लिस्टिंग मालक")}
                      </p>
                      <p className="text-xl font-black text-primary dark:text-emerald-50">{equipment.ownerName}</p>
                      <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">
                        {equipment.ownerLocation}
                      </p>
                    </div>
                  </div>
                  <LazyMap
                    center={[16.86, 74.57]}
                    zoom={13}
                    markers={markers}
                    height="220px"
                    className="rounded-3xl border border-outline-variant dark:border-slate-800/50"
                    showControls={false}
                  />
                </div>
              </ScrollRevealItem>
            </ScrollRevealGroup>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-900/5 dark:border-slate-800/50 dark:bg-slate-900/40">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-primary dark:text-emerald-50">
                    {langText("Reserve this Equipment", "हे उपकरण आरक्षित करा")}
                  </h3>
                  <p className="text-sm font-medium text-on-surface-variant dark:text-slate-400">
                    {langText("Check availability and request a booking callback.", "उपलब्धता तपासा आणि booking callback मागवा.")}
                  </p>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleBookingRequest}>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-outline dark:text-slate-500">
                      {langText("Field Location", "शेताचे स्थान")}
                    </label>
                    <input
                      className="w-full rounded-xl bg-surface-container px-4 py-3 text-sm font-semibold dark:bg-slate-950/50 dark:text-white"
                      placeholder="Village / Taluka name"
                      value={formState.fieldLocation}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, fieldLocation: event.target.value }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-widest text-outline dark:text-slate-500">
                        {langText("Work Type", "कामाचा प्रकार")}
                      </label>
                      <select
                        className="w-full rounded-xl bg-surface-container px-4 py-3 text-sm font-semibold dark:bg-slate-950/50 dark:text-white"
                        value={formState.workType}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, workType: event.target.value }))
                        }
                      >
                        {equipment.workTypes.map((workType) => (
                          <option key={workType}>{workType}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-widest text-outline dark:text-slate-500">
                        {langText("Approx Hours", "अंदाजे तास")}
                      </label>
                      <input
                        className="w-full rounded-xl bg-surface-container px-4 py-3 text-sm font-semibold dark:bg-slate-950/50 dark:text-white"
                        placeholder="8"
                        type="number"
                        value={formState.approxHours}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, approxHours: event.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-outline dark:text-slate-500">
                      {langText("Phone Number", "फोन नंबर")}
                    </label>
                    <input
                      className="w-full rounded-xl bg-surface-container px-4 py-3 text-sm font-semibold dark:bg-slate-950/50 dark:text-white"
                      placeholder="+91 00000 00000"
                      value={formState.phone}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          phone: event.target.value.replace(/\D/g, "").slice(0, 10),
                        }))
                      }
                    />
                  </div>

                  {error ? <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p> : null}
                  {success ? (
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{success}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-secondary py-4 font-black text-white shadow-lg shadow-secondary/20 transition-transform hover:scale-[1.02] disabled:opacity-60"
                  >
                    {isSubmitting
                      ? langText("Submitting...", "पाठवत आहे...")
                      : langText("Request Booking Callback", "बुकिंग कॉलबॅक विनंती")}
                  </button>
                </form>
              </div>

              {relatedEquipment.length ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-primary dark:text-emerald-50">
                    {langText("Similar Equipment", "समान उपकरणे")}
                  </h2>
                  {relatedEquipment.map((item) => (
                    <Link
                      key={item.id}
                      href={`/equipment/${item.id}`}
                      className="flex items-center gap-4 rounded-2xl border border-outline-variant/20 bg-white p-4 shadow-sm transition-colors hover:border-secondary dark:border-slate-800/50 dark:bg-slate-900/40"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={item.name}
                        className="h-20 w-20 rounded-xl object-cover"
                        src={assetPath(item.coverImage)}
                        loading="lazy"
                        decoding="async"
                      />
                      <div>
                        <p className="font-black text-primary dark:text-emerald-50">{item.name}</p>
                        <p className="mt-1 text-sm font-medium text-on-surface-variant dark:text-slate-400">
                          {item.location} • ₹{item.pricePerHour}/{item.unitLabel}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </main>
  );
}
