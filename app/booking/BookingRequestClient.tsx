"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState, useTransition } from "react";
import type { EquipmentRecord } from "@/lib/equipment";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { Button } from "@/components/ui/button";
import { createBookingAction } from "@/lib/actions/local-data";
import { useSmoothRouter } from "@/lib/client/useSmoothRouter";

export default function BookingRequestClient({
  equipment,
}: {
  equipment?: EquipmentRecord | null;
}) {
  const { t } = useLanguage();
  const router = useSmoothRouter();
  const [task, setTask] = useState(equipment?.workTypes[0] || "Ploughing");
  const [fieldSize, setFieldSize] = useState("5");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const equipmentName = useMemo(
    () => equipment?.name || "Select equipment from the marketplace",
    [equipment]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!equipment) {
      setError(
        t("booking.BookingRequestClient.choose_equipment_from_the_marketplace_before_placing_a_booking_request")
      );
      return;
    }

    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createBookingAction({
        sourcePath: `/booking/${equipment.id}`,
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        fieldLocation: String(form.get("fieldLocation") || ""),
        workType: task,
        approxHours: String(form.get("approxHours") || ""),
        phone,
        startDate: String(form.get("startDate") || ""),
        duration: String(form.get("duration") || ""),
        task,
        fieldSize,
      });

      if (!result.ok) {
        if (result.error === "Renter access required." || result.error === "Login required.") {
          router.push("/login");
          return;
        }

        setError(
          result.error ||
            t("booking.BookingRequestClient.could_not_submit_the_booking_request_right_now")
        );
        return;
      }

      router.push(result.redirectTo || "/renter-profile/bookings");
    });
  };

  return (
    <main className="bg-background dark:bg-slate-950 min-h-screen">
      <Header />
      <div className="pt-28 pb-32 px-4 md:px-8 max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-primary dark:text-emerald-50 tracking-tight mb-2">
            {t("booking.BookingRequestClient.book_your_equipment")}
          </h1>
          <p className="text-on-surface-variant dark:text-slate-400">
            {t("booking.BookingRequestClient.complete_the_request_and_we_will_coordinate_the_rest")}
          </p>
        </header>

        {!equipment ? (
          <div className="kk-form-muted-banner mb-8 px-6 py-5">
            {t("booking.BookingRequestClient.this_route_needs_a_selected_equipment_listing_browse_active_equipment_first_then_open_the_booking_page_from_that_listing")}
            <div className="mt-4">
              <Link href="/rent-equipment" className="kk-form-primary-button inline-flex">
                {t("booking.BookingRequestClient.browse_equipment")}
              </Link>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="kk-form-compact-card p-8 md:p-10">
              <h2 className="text-2xl font-bold text-primary dark:text-emerald-50 mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary dark:text-amber-500">event_available</span>
                {t("booking.BookingRequestClient.date_and_task_details")}
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error ? (
                  <div className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="kk-form-label block">{t("booking.BookingRequestClient.start_date")}</label>
                    <input className="kk-input" name="startDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="kk-form-label block">{t("booking.BookingRequestClient.duration")}</label>
                    <select className="kk-input" name="duration">
                      <option>1 Day</option>
                      <option>2-3 Days</option>
                      <option>1 Week</option>
                      <option>Custom</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="kk-form-label block">{t("booking.BookingRequestClient.field_location")}</label>
                  <input className="kk-input" name="fieldLocation" placeholder="Village / Taluka name" type="text" />
                </div>

                <div className="space-y-2">
                  <label className="kk-form-label block">{t("booking.BookingRequestClient.select_farming_task")}</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(equipment?.workTypes.length ? equipment.workTypes : ["Ploughing", "Sowing", "Spraying"]).map((option) => (
                      <button
                        key={option}
                        className={`flex flex-col items-center justify-center rounded-[1.2rem] border p-4 text-sm font-black transition-all ${
                          task === option
                            ? "border-secondary/35 bg-secondary-fixed/35 text-secondary dark:text-amber-400"
                            : "border-outline-variant/60 bg-surface-container-lowest text-on-surface hover:border-secondary/20 hover:bg-surface-container-low dark:bg-slate-900/50 dark:text-emerald-100"
                        }`}
                        onClick={() => setTask(option)}
                        type="button"
                      >
                        <span className="material-symbols-outlined mb-2">
                          {option === "Ploughing" ? "agriculture" : option === "Sowing" ? "grain" : "water_drop"}
                        </span>
                        <span className="text-xs font-bold">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="kk-form-label block">{t("booking.BookingRequestClient.approx_hours")}</label>
                  <input className="kk-input" name="approxHours" placeholder="8" type="number" />
                </div>

                <div className="space-y-2">
                  <label className="kk-form-label block">{t("booking.BookingRequestClient.field_size_acres")}</label>
                  <div className="kk-form-control-card flex items-center gap-4">
                    <input
                      className="w-full h-2 bg-surface-container dark:bg-slate-900 rounded-lg appearance-none cursor-pointer accent-secondary dark:accent-amber-500"
                      max="50"
                      min="1"
                      type="range"
                      value={fieldSize}
                      onChange={(event) => setFieldSize(event.target.value)}
                    />
                    <span className="rounded-full bg-secondary-fixed/60 px-4 py-1 text-center font-bold text-secondary dark:bg-amber-600 dark:text-white min-w-[60px]">
                      {fieldSize}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="kk-form-label block">{t("booking.BookingRequestClient.phone_number")}</label>
                  <input
                    className="kk-input"
                    name="phone"
                    placeholder="10-digit mobile number"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                </div>

                <Button className="w-full gap-3 text-base" disabled={isPending} type="submit">
                  {isPending
                    ? t("booking.BookingRequestClient.submitting")
                    : t("booking.BookingRequestClient.save_and_continue")}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white dark:bg-slate-900/40 rounded-[32px] overflow-hidden shadow-sm border border-surface-variant dark:border-slate-800/50">
                <div className="relative h-48">
                  <Image
                    className="object-cover"
                    alt={equipmentName}
                    src={equipment?.coverImage || "/assets/generated/hero_tractor.png"}
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary dark:text-emerald-50 mb-1">{equipmentName}</h3>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-4">
                    {equipment ? `${equipment.hp} • ${equipment.location}` : t("booking.BookingRequestClient.choose_a_listing_before_booking")}
                  </p>
                  <div className="flex justify-between items-end border-t border-surface-variant dark:border-slate-800/50 pt-4">
                    <div>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 uppercase font-bold tracking-widest">
                        {t("booking.BookingRequestClient.base_rate")}
                      </p>
                      <p className="text-2xl font-black text-secondary dark:text-amber-500">
                        ₹{equipment?.pricePerHour || 0}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 uppercase font-bold tracking-widest">
                        {t("booking.BookingRequestClient.owner")}
                      </p>
                      <p className="font-bold text-primary dark:text-emerald-100">{equipment?.ownerName || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}


