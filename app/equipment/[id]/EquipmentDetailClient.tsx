"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { createBookingAction } from "@/lib/actions/local-data";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { LazyMap } from "@/components/LazyMap";
import {
  getEquipmentAvailability,
  getVisibleEquipmentRating,
  type EquipmentRecord,
} from "@/lib/equipment";
import { useSmoothRouter } from "@/lib/client/useSmoothRouter";
import { createListingMarker } from "@/lib/map-data";
import { DETAIL_BOOKING_LAYOUT } from "@/lib/equipment-detail-layout.js";
import { assetPath } from "@/lib/site";
import { normalizeCategorySlug } from "@/lib/equipment-categories";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function deriveDriveLabel(equipment: EquipmentRecord) {
  const driveTag = equipment.tags.find((tag) => /(2wd|4wd)/i.test(tag));
  return driveTag || null;
}

export default function EquipmentDetailClient({
  equipment,
  showBreadcrumbs = true,
  containerVariant = "public",
  currentUserId = null,
}: {
  equipment: EquipmentRecord;
  relatedEquipment: EquipmentRecord[];
  showBreadcrumbs?: boolean;
  containerVariant?: "public" | "workspace";
  currentUserId?: string | null;
}) {
  const router = useSmoothRouter();
  const { langText, text } = useLanguage();
  const [error, setError] = useState("");
  const [ownListingToast, setOwnListingToast] = useState(false);
  const [loginToast, setLoginToast] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [formState, setFormState] = useState({
    fieldLocation: "",
    fieldPincode: "",
    workType: equipment.workTypes[0] || "",
    startDate: new Date().toISOString().slice(0, 10),
    approxHours: "4",
    phone: "",
  });

  const markers = useMemo(
    () => createListingMarker(equipment.name, equipment.location, equipment.district),
    [equipment.name, equipment.location, equipment.district]
  );
  const displayGalleryImages = useMemo(
    () => Array.from(new Set([equipment.coverImage, ...equipment.galleryImages].filter(Boolean))).slice(0, 3),
    [equipment.coverImage, equipment.galleryImages]
  );

  useEffect(() => {
    if (selectedImageIndex >= displayGalleryImages.length) {
      setSelectedImageIndex(0);
    }
  }, [displayGalleryImages.length, selectedImageIndex]);

  const estimatedHours = Math.max(1, Number(formState.approxHours) || 1);
  const estimatedBase = equipment.pricePerHour * estimatedHours;
  const driveLabel = deriveDriveLabel(equipment);
  const categoryLabel = text(equipment.categoryLabel.split("•")[0]?.trim() || "Equipment", {
    cacheKey: `equipment.${equipment.id}.category`,
  });
  const categorySlug = normalizeCategorySlug(
    equipment.category.endsWith("s") ? equipment.category : `${equipment.category}s`
  );
  const selectedGalleryImage = displayGalleryImages[selectedImageIndex] || equipment.coverImage;
  const visibleRating = getVisibleEquipmentRating(equipment);
  const availability = getEquipmentAvailability(equipment);
  const isOwnListing = Boolean(currentUserId && equipment.ownerUserId === currentUserId);
  const containerClassName =
    containerVariant === "workspace"
      ? DETAIL_BOOKING_LAYOUT.workspaceContainer
      : DETAIL_BOOKING_LAYOUT.publicContainer;
  const bookingCardClassName =
    containerVariant === "workspace"
      ? DETAIL_BOOKING_LAYOUT.workspaceCard
      : DETAIL_BOOKING_LAYOUT.card;
  const workspaceContentClassName =
    containerVariant === "workspace"
      ? "order-2 space-y-6 lg:order-1 lg:col-span-2 lg:space-y-8"
      : "space-y-8 lg:col-span-2";
  const workspaceBookingClassName =
    containerVariant === "workspace"
      ? "relative order-1 mb-2 lg:order-2 lg:col-span-1 lg:mb-0 lg:self-start"
      : "relative lg:col-span-1 lg:self-start";

  const handleBookingRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (isOwnListing) {
      setOwnListingToast(true);
      window.setTimeout(() => setOwnListingToast(false), 4000);
      return;
    }

    if (!availability.available) {
      setError(langText("This equipment is not available for booking right now.", "हे उपकरण सध्या बुकिंगसाठी उपलब्ध नाही."));
      return;
    }

    startTransition(async () => {
      const result = await createBookingAction({
        sourcePath: `/equipment/${equipment.id}`,
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        fieldLocation: formState.fieldLocation,
        fieldPincode: formState.fieldPincode,
        workType: formState.workType,
        approxHours: formState.approxHours,
        phone: formState.phone,
        startDate: formState.startDate,
        duration: "",
        task: formState.workType,
        fieldSize: "",
      });

      if (!result.ok) {
        if (result.error === "Login required." || result.error === "Renter access required.") {
          setLoginToast(true);
          window.setTimeout(() => setLoginToast(false), 4000);
          return;
        }

        if (result.code === "OWN_LISTING") {
          setOwnListingToast(true);
          window.setTimeout(() => setOwnListingToast(false), 4000);
          return;
        }

        setError(
          result.error ||
            langText(
              "Could not submit the booking request right now.",
              "सध्या बुकिंग विनंती सबमिट करता आली नाही."
            )
        );
        return;
      }

      router.push(result.redirectTo || "/renter-profile");
    });
  };

  return (
    <div className={containerClassName}>
      {ownListingToast ? (
        <div className="kk-login-toast" role="status">
          <span className="material-symbols-outlined text-primary">info</span>
          <span>{langText("You cannot book your own listings", "तुम्ही स्वतःची लिस्टिंग बुक करू शकत नाही")}</span>
        </div>
      ) : null}
      {loginToast ? (
        <div className="kk-login-toast" role="status">
          <span className="material-symbols-outlined text-primary">login</span>
          <span>{langText("please login or register", "कृपया लॉगिन किंवा नोंदणी करा")}</span>
        </div>
      ) : null}
      <div className={workspaceContentClassName}>
        {showBreadcrumbs ? (
        <nav className="text-sm text-on-surface-variant">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-primary">
                {langText("Home", "मुख्यपृष्ठ")}
              </Link>
            </li>
            <li>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
            </li>
            <li>
              <Link href="/categories" className="hover:text-primary">
                {langText("Categories", "वर्गवारी")}
              </Link>
            </li>
            <li>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
            </li>
            <li>
              <Link href={`/rent-equipment?query=${categorySlug}`} className="hover:text-primary">
                {categoryLabel}
              </Link>
            </li>
            <li>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
            </li>
            <li className="font-medium text-on-surface">{equipment.name}</li>
          </ol>
        </nav>
        ) : null}

        <section className="space-y-4">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-surface-container shadow-lg">
            <Image
              alt={equipment.name}
              className="object-cover"
              fill
              sizes="(min-width: 1280px) 900px, (min-width: 1024px) 66vw, 100vw"
              src={assetPath(selectedGalleryImage)}
            />
            <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-surface-container-lowest/90 px-3 py-1 text-xs font-bold text-primary shadow backdrop-blur">
              <span className="material-symbols-outlined text-sm">verified</span>
              {langText("Verified Listing", "सत्यापित लिस्टिंग")}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {displayGalleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                aria-label={langText(`Show photo ${index + 1}`, `फोटो ${index + 1} दाखवा`)}
                className={`relative aspect-[4/3] overflow-hidden rounded-lg shadow-sm transition-transform duration-200 hover:scale-[1.02] ${
                  index === selectedImageIndex ? "border-2 border-primary" : "opacity-80 hover:opacity-100"
                }`}
              >
                <Image
                  alt={`${equipment.name} gallery ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes="(min-width: 768px) 180px, 30vw"
                  src={assetPath(image)}
                />
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              {equipment.categoryLabel}
            </span>
            {visibleRating ? (
              <div className="equipment-rating-pill flex items-center text-sm font-medium">
                <span className="material-symbols-outlined mr-1 text-lg text-amber-500">star</span>
                {visibleRating.value.toFixed(1)}
              </div>
            ) : null}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-on-surface md:text-4xl">{equipment.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span>
                {equipment.location}, {equipment.district}
              </span>
            </div>
          </div>

          <p className="max-w-4xl text-base leading-7 text-on-surface-variant">
            {equipment.description}
          </p>
        </section>

        <hr className="border-outline-variant" />

        <section>
          <h2 className="mb-4 text-xl font-bold">{langText("Specifications", "तपशील")}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: "bolt", label: langText("Power", "पॉवर"), value: equipment.hp },
              {
                icon: "person",
                label: langText("Operator", "चालक"),
                value: equipment.operatorIncluded
                  ? langText("Included", "समाविष्ट")
                  : langText("Optional", "ऐच्छिक"),
              },
              {
                icon: "settings",
                label: langText("Drive", "ड्राईव्ह"),
                value: driveLabel
                  ? text(driveLabel, { cacheKey: `equipment.${equipment.id}.drive.${driveLabel}` })
                  : langText("Not listed", "नमूद नाही"),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="kk-depth-tile flex flex-col items-center rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-center shadow-sm"
              >
                <span className="material-symbols-outlined mb-2 text-3xl text-primary">{item.icon}</span>
                <span className="text-sm text-on-surface-variant">{item.label}</span>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-outline-variant" />

        <section>
          <h2 className="mb-4 text-xl font-bold">{langText("Owner Details", "मालक तपशील")}</h2>
          <div className="kk-owner-detail-card kk-depth-tile relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary-container/10 via-surface-container-lowest to-secondary-container/10 p-6 shadow-sm">
            <div className="absolute right-0 top-0 h-28 w-28 -translate-y-10 translate-x-10 rounded-full bg-secondary/15 blur-2xl" />
            <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              {equipment.ownerPhotoUrl ? (
                <img
                  alt={langText("Owner profile photo", "मालकाचा प्रोफाइल फोटो")}
                  className="h-24 w-24 shrink-0 rounded-2xl border-4 border-white bg-surface-container object-cover shadow-lg dark:border-slate-900"
                  src={equipment.ownerPhotoUrl}
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-surface-container text-slate-500 shadow-lg dark:border-slate-900">
                  <span className="material-symbols-outlined text-3xl">person</span>
                </div>
              )}
              <div className="flex-grow text-center sm:text-left">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                  {langText("Equipment Owner", "उपकरण मालक")}
                </p>
                <h3 className="mt-2 text-2xl font-black text-on-surface">{equipment.ownerName}</h3>
                {equipment.ownerLocation ? (
                  <div className="kk-owner-location-row mt-4 inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-primary/10 bg-white/75 px-3.5 py-2 text-sm font-bold text-on-surface-variant shadow-sm backdrop-blur dark:border-emerald-400/15 dark:bg-slate-950/70 sm:justify-start">
                    <span className="material-symbols-outlined text-base text-primary">location_on</span>
                    <span className="truncate">{equipment.ownerLocation}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold">{langText("Service Area", "सेवा क्षेत्र")}</h2>
          {markers.length ? (
            <div className="relative overflow-hidden rounded-xl border border-outline-variant shadow-inner">
              <LazyMap
                center={[markers[0].lat, markers[0].lng]}
                zoom={12}
                markers={markers}
                height="256px"
                className="rounded-none"
                showControls
                deferUntilVisible={false}
              />
              {equipment.distanceKm > 0 ? (
                <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg bg-surface-container-lowest/90 p-3 text-sm shadow-md backdrop-blur">
                  <p className="flex items-center gap-1 font-bold text-on-surface">
                    <span className="material-symbols-outlined text-sm text-primary">near_me</span>
                    {equipment.distanceKm} {langText("km Radius", "किमी परिसर")}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {langText("from", "पासून")} {equipment.location}
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="kk-depth-tile rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">
                {langText("Map unavailable", "नकाशा उपलब्ध नाही")}
              </p>
              <h3 className="mt-3 text-xl font-bold text-on-surface">
                {langText("This listing does not have enough live location data for the public map yet.", "या लिस्टिंगसाठी सार्वजनिक नकाशावर दाखवण्यासाठी पुरेशी स्थान माहिती अजून उपलब्ध नाही.")}
              </h3>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                {langText(
                  "The equipment detail remains live, but the service-area map stays hidden until the listing location can be matched safely.",
                  "उपकरण तपशील उपलब्ध आहे, पण लिस्टिंगचे ठिकाण सुरक्षितरीत्या जुळल्याशिवाय सेवा-क्षेत्र नकाशा लपवून ठेवला जातो."
                )}
              </p>
            </div>
          )}
        </section>

        <section className="pb-10">
          <h2 className="mb-4 text-xl font-bold">{langText("Frequently Asked Questions", "वारंवार विचारले जाणारे प्रश्न")}</h2>
          <div className="space-y-4">
            {[
              {
                q: langText("Who pays for fuel?", "इंधनाचा खर्च कोण करेल?"),
                a: langText(
                  "Fuel is not included in the hourly rate. The renter is responsible for diesel during the work period.",
                  "इंधन प्रति तास दरामध्ये समाविष्ट नाही. कामाच्या कालावधीत डिझेलचा खर्च भाडेकरूचा असेल."
                ),
              },
              {
                q: langText("Can I cancel my booking?", "मी बुकिंग रद्द करू शकतो का?"),
                a: langText(
                  "Yes, you can cancel before the owner confirms the booking request.",
                  "होय, मालक बुकिंग विनंतीची पुष्टी करण्यापूर्वी तुम्ही ती रद्द करू शकता."
                ),
              },
            ].map((item) => (
              <details
                key={item.q}
                className="kk-depth-tile group rounded-lg border border-outline-variant bg-surface-container-lowest p-4 transition-all duration-200 hover:shadow-sm"
              >
                <summary className="flex list-none cursor-pointer items-center justify-between gap-3 font-medium">
                  <span>{item.q}</span>
                  <span className="material-symbols-outlined transition group-open:rotate-180">expand_more</span>
                </summary>
                <div className="mt-4 border-t border-outline-variant pt-4 text-sm text-on-surface-variant">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>

      <div className={workspaceBookingClassName}>
        <div className={bookingCardClassName}>
          <div className="mb-4 flex flex-col gap-3 border-b border-outline-variant pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-3xl font-bold text-on-surface">{formatCurrency(equipment.pricePerHour)}</span>
              <span className="text-on-surface-variant"> / {equipment.unitLabel}</span>
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${
                availability.available
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
                  : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  availability.available ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              {availability.available
                ? langText("Available", "उपलब्ध")
                : langText("Not available", "उपलब्ध नाही")}
            </span>
          </div>

          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary">event_available</span>
            {langText("Book this Equipment", "हे उपकरण बुक करा")}
          </h3>

          <form className={DETAIL_BOOKING_LAYOUT.form} onSubmit={handleBookingRequest}>
            <div className={DETAIL_BOOKING_LAYOUT.fields}>
              <div>
                <label className="mb-1 block text-sm font-medium text-on-surface">
                  {langText("Field Location", "शेताचे ठिकाण")}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant">location_on</span>
                  <input
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2 pl-10 focus:border-primary focus:ring-primary"
                    placeholder={langText("Enter village or landmark", "गाव किंवा खूणचिन्ह टाका")}
                    value={formState.fieldLocation}
                    onChange={(event) => setFormState((current) => ({ ...current, fieldLocation: event.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-on-surface">
                  {langText("Field Pincode", "शेताचा पिनकोड")}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant">pin_drop</span>
                  <input
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2 pl-10 focus:border-primary focus:ring-primary"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    placeholder={langText("Enter 6-digit pincode", "६ अंकी पिनकोड टाका")}
                    value={formState.fieldPincode}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        fieldPincode: event.target.value.replace(/\D/g, "").slice(0, 6),
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-on-surface">
                      {langText("Start Date", "तारीख")}
                    </label>
                    <input
                      className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:ring-primary"
                      type="date"
                      value={formState.startDate}
                      onChange={(event) => setFormState((current) => ({ ...current, startDate: event.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-on-surface">
                      {langText("Approx Hours", "अंदाजे तास")}
                    </label>
                    <input
                      className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:ring-primary"
                      min="1"
                      type="number"
                      value={formState.approxHours}
                      onChange={(event) => setFormState((current) => ({ ...current, approxHours: event.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-on-surface">
                  {langText("Phone Number", "फोन नंबर")}
                </label>
                <input
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2 focus:border-primary focus:ring-primary"
                  placeholder={langText("+91 00000 00000", "+९१ ००००० ०००००")}
                  value={formState.phone}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      phone: event.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                />
              </div>
            </div>

            <div className={DETAIL_BOOKING_LAYOUT.actions}>
              <div className="rounded-lg border border-outline-variant bg-surface p-3">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-on-surface-variant">
                    {formatCurrency(equipment.pricePerHour)} x {estimatedHours} {langText("hours", "तास")}
                  </span>
                  <span>{formatCurrency(estimatedBase)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-outline-variant pt-2 text-base font-bold">
                  <span>{langText("Estimated Rental Value", "अंदाजित भाडे मूल्य")}</span>
                  <span>{formatCurrency(estimatedBase)}</span>
                </div>
                <p className="mt-2 text-center text-[11px] text-on-surface-variant">
                  {langText(
                    "Kisan Kamai does not collect money. Settle directly with the owner after confirming the work.",
                    "Kisan Kamai पैसे गोळा करत नाही. काम निश्चित केल्यानंतर मालकाशी थेट व्यवहार करा."
                  )}
                </p>
              </div>

              {error ? <p className="text-sm font-semibold text-error">{error}</p> : null}

              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-white shadow-md transition hover:bg-primary-container"
                disabled={isPending || (!availability.available && !isOwnListing)}
                type="submit"
              >
                {isPending
                  ? langText("Submitting...", "सबमिट होत आहे...")
                  : !availability.available && !isOwnListing
                    ? langText("Currently unavailable", "सध्या उपलब्ध नाही")
                    : langText("Book Now", "आता बुक करा")}
              </button>
            </div>
          </form>

          <div className={DETAIL_BOOKING_LAYOUT.security}>
            <span className="material-symbols-outlined text-sm">security</span>
            <span>{langText("Secure booking via Kisan Kamai", "किसान कमाईद्वारे सुरक्षित बुकिंग")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
