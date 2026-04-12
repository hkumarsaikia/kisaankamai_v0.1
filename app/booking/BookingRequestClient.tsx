"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useLanguage } from "@/components/LanguageContext";
import { postJson, SubmissionError } from "@/lib/client/forms";
import { getMockEquipmentById } from "@/lib/equipment";
import { IS_PAGES_BUILD } from "@/lib/runtime";
import { assetPath } from "@/lib/site";
import { bookingRequestSchema } from "@/lib/validation/forms";
import { FormEvent, useMemo, useState } from "react";

export default function BookingRequestClient({ equipmentId }: { equipmentId?: string }) {
  const { langText } = useLanguage();
  const equipment = equipmentId ? getMockEquipmentById(equipmentId) : null;
  const [task, setTask] = useState("Ploughing");
  const [fieldSize, setFieldSize] = useState("5");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const equipmentName = useMemo(
    () => equipment?.name || "Mahindra Novo 605 DI-i",
    [equipment?.name]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    const parsed = bookingRequestSchema.safeParse({
      sourcePath: equipmentId ? `/booking/${equipmentId}` : "/booking",
      equipmentId: equipmentId || "",
      equipmentName,
      fieldLocation: form.get("fieldLocation"),
      workType: task,
      approxHours: form.get("approxHours"),
      phone: form.get("phone"),
      startDate: form.get("startDate"),
      duration: form.get("duration"),
      task,
      fieldSize,
    });

    if (!parsed.success) {
      setError(
        parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          langText("Please complete the booking form correctly.", "कृपया booking form योग्यरित्या भरा.")
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
          "Booking request submitted. We will connect you with the owner shortly.",
          "Booking विनंती सबमिट झाली. आम्ही तुम्हाला लवकरच मालकाशी जोडू."
        )
      );
      event.currentTarget.reset();
      setFieldSize("5");
      setTask("Ploughing");
    } catch (submitError) {
      if (submitError instanceof SubmissionError) {
        setError(submitError.message);
      } else {
        setError(langText("Could not submit the booking request right now.", "सध्या booking request submit करता आली नाही."));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-background dark:bg-slate-950 min-h-screen">
      <Header />
      <div className="pt-28 pb-32 px-4 md:px-8 max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-primary dark:text-emerald-50 tracking-tight mb-2">
            {langText("Book Your Equipment", "तुमची उपकरणे बुक करा")}
          </h1>
          <p className="text-on-surface-variant dark:text-slate-400">
            {langText("Complete the request and we will coordinate the rest.", "विनंती पूर्ण करा आणि उर्वरित समन्वय आम्ही करू.")}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-slate-900/40 rounded-[32px] p-8 md:p-10 shadow-sm border border-surface-variant dark:border-slate-800/50">
              <h2 className="text-2xl font-bold text-primary dark:text-emerald-50 mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary dark:text-amber-500">event_available</span>
                {langText("Date & Task Details", "तारीख आणि कार्याचा तपशील")}
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                ) : null}
                {success ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    {success}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant dark:text-emerald-100 block">{langText("Start Date", "सुरुवात तारीख")}</label>
                    <input className="w-full bg-surface-container-lowest dark:bg-slate-950 border border-surface-variant dark:border-slate-800 rounded-xl p-4 text-on-surface dark:text-emerald-50 focus:ring-2 focus:ring-secondary-container transition-all" name="startDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant dark:text-emerald-100 block">{langText("Duration", "कालावधी")}</label>
                    <select className="w-full bg-surface-container-lowest dark:bg-slate-950 border border-surface-variant dark:border-slate-800 rounded-xl p-4 text-on-surface dark:text-emerald-50 focus:ring-2 focus:ring-secondary-container transition-all" name="duration">
                      <option>1 Day</option>
                      <option>2-3 Days</option>
                      <option>1 Week</option>
                      <option>Custom</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant dark:text-emerald-100 block">{langText("Field Location", "शेताचे स्थान")}</label>
                  <input className="w-full bg-surface-container-lowest dark:bg-slate-950 border border-surface-variant dark:border-slate-800 rounded-xl p-4 text-on-surface dark:text-emerald-50 focus:ring-2 focus:ring-secondary-container transition-all" name="fieldLocation" placeholder="Village / Taluka name" type="text" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant dark:text-emerald-100 block">{langText("Select Farming Task", "शेतीचे काम निवडा")}</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Ploughing", "Sowing", "Spraying"].map((option) => (
                      <button
                        key={option}
                        className={`flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
                          task === option
                            ? "border-secondary-container bg-secondary-fixed/20 text-secondary dark:text-amber-400"
                            : "border-transparent bg-surface-container-low text-on-surface dark:bg-slate-900/50 dark:text-emerald-100"
                        }`}
                        onClick={() => setTask(option)}
                        type="button"
                      >
                        <span className="material-symbols-outlined mb-2">{option === "Ploughing" ? "agriculture" : option === "Sowing" ? "grain" : "water_drop"}</span>
                        <span className="text-xs font-bold">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant dark:text-emerald-100 block">{langText("Approx Hours", "अंदाजे तास")}</label>
                  <input className="w-full bg-surface-container-lowest dark:bg-slate-950 border border-surface-variant dark:border-slate-800 rounded-xl p-4 text-on-surface dark:text-emerald-50 focus:ring-2 focus:ring-secondary-container transition-all" name="approxHours" placeholder="8" type="number" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant dark:text-emerald-100 block">{langText("Field Size (Acres)", "शेत आकार (एकर)")}</label>
                  <div className="flex items-center gap-4">
                    <input
                      className="w-full h-2 bg-surface-container dark:bg-slate-900 rounded-lg appearance-none cursor-pointer accent-secondary dark:accent-amber-500"
                      max="50"
                      min="1"
                      type="range"
                      value={fieldSize}
                      onChange={(event) => setFieldSize(event.target.value)}
                    />
                    <span className="bg-secondary-container dark:bg-amber-600 text-on-secondary-container dark:text-white px-4 py-1 rounded-full font-bold min-w-[60px] text-center">
                      {fieldSize}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant dark:text-emerald-100 block">{langText("Phone Number", "फोन नंबर")}</label>
                  <input className="w-full bg-surface-container-lowest dark:bg-slate-950 border border-surface-variant dark:border-slate-800 rounded-xl p-4 text-on-surface dark:text-emerald-50 focus:ring-2 focus:ring-secondary-container transition-all" name="phone" placeholder="10-digit mobile number" type="tel" />
                </div>

                <button className="w-full bg-primary-container text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60" disabled={isSubmitting} type="submit">
                  {isSubmitting
                    ? langText("Submitting...", "सबमिट करत आहे...")
                    : langText("Save & Continue", "जतन करा आणि पुढे जा")}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white dark:bg-slate-900/40 rounded-[32px] overflow-hidden shadow-sm border border-surface-variant dark:border-slate-800/50">
                <div className="h-48 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-full h-full object-cover" alt={equipmentName} src={assetPath(equipment?.coverImage || "/assets/generated/hero_tractor.png")} loading="lazy" decoding="async" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary dark:text-emerald-50 mb-1">{equipmentName}</h3>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-4">
                    {equipment ? `${equipment.hp} • ${equipment.location}` : langText("Premium equipment listing", "प्रीमियम उपकरण सूची")}
                  </p>
                  <div className="flex justify-between items-end border-t border-surface-variant dark:border-slate-800/50 pt-4">
                    <div>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 uppercase font-bold tracking-widest">
                        {langText("Base Rate", "मूळ दर")}
                      </p>
                      <p className="text-2xl font-black text-secondary dark:text-amber-500">
                        ₹{equipment?.pricePerHour || 1200}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 uppercase font-bold tracking-widest">
                        {langText("Owner", "मालक")}
                      </p>
                      <p className="font-bold text-primary dark:text-emerald-100">{equipment?.ownerName || "Verified Owner"}</p>
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
