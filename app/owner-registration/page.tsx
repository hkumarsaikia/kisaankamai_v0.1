"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { postJson, SubmissionError } from "@/lib/client/forms";
import { IS_PAGES_BUILD } from "@/lib/runtime";
import { ownerApplicationSchema } from "@/lib/validation/forms";
import { FormEvent, useState } from "react";

export default function OwnerRegistration() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    const parsed = ownerApplicationSchema.safeParse({
      equipmentType: form.get("equipmentType"),
      brand: form.get("brand"),
      modelYear: form.get("modelYear"),
      horsepower: form.get("horsepower"),
      ratePerHour: form.get("ratePerHour"),
      ratePerAcre: form.get("ratePerAcre"),
      district: form.get("district"),
      taluka: form.get("taluka"),
      radius: form.get("radius"),
    });

    if (!parsed.success) {
      setError(
        parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          "Please complete the owner registration form correctly."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (!IS_PAGES_BUILD) {
        await postJson("/api/forms/owner-application", parsed.data);
      }
      setSuccess("Owner application submitted. Our team will review it within 24 hours.");
      event.currentTarget.reset();
    } catch (submitError) {
      if (submitError instanceof SubmissionError) {
        setError(submitError.message);
      } else {
        setError("Could not submit the owner application right now.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-primary mb-2">List Your Equipment</h1>
          <p className="text-on-surface-variant mb-8">आपले उपकरण भाड्याने देण्यासाठी नोंदणी करा</p>
          <div className="flex items-center justify-between border-b border-outline-variant overflow-x-auto whitespace-nowrap scrollbar-hide">
            {["Basic Info", "Images", "Pricing", "Location", "Operator"].map((step, index) => (
              <div key={step} className="px-4 pb-4 flex items-center gap-2">
                <span className={`material-symbols-outlined text-lg ${index === 0 ? "text-primary" : "text-outline"}`}>
                  {["info", "image", "payments", "location_on", "person"][index]}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <form className="lg:col-span-2 space-y-10" onSubmit={handleSubmit}>
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

            <section className="bg-surface-container-lowest p-8 rounded-xl border border-surface-container-highest shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">agriculture</span>
                Equipment Details / उपकरणाची माहिती
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Equipment Type / उपकरणाचा प्रकार">
                  <select className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all" name="equipmentType">
                    <option value="">Select Type</option>
                    <option>Tractor</option>
                    <option>Harvester</option>
                    <option>Rotavator</option>
                    <option>Seeder</option>
                  </select>
                </Field>
                <Field label="Brand / मेक">
                  <input className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" name="brand" placeholder="e.g. John Deere" type="text" />
                </Field>
                <Field label="Model & Year / मॉडेल आणि वर्ष">
                  <input className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" name="modelYear" placeholder="e.g. 5050E, 2022" type="text" />
                </Field>
                <Field label="Horsepower / अश्वशक्ती (HP)">
                  <input className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" name="horsepower" placeholder="e.g. 45" type="number" />
                </Field>
              </div>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-xl border border-surface-container-highest shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">currency_rupee</span>
                Pricing &amp; Billing / किंमत आणि बिलिंग
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Rate per Hour / प्रति तास दर">
                  <input className="w-full pl-10 p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" name="ratePerHour" placeholder="800" type="number" />
                </Field>
                <Field label="Rate per Acre / प्रति एकर दर (Optional)">
                  <input className="w-full pl-10 p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" name="ratePerAcre" placeholder="1200" type="number" />
                </Field>
              </div>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-xl border border-surface-container-highest shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">distance</span>
                Operational Area / कार्यक्षेत्र
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="District / जिल्हा">
                  <select className="w-full p-3 rounded-lg border border-outline-variant bg-white" name="district">
                    <option value="">Select District</option>
                    <option>Satara</option>
                    <option>Pune</option>
                    <option>Nashik</option>
                  </select>
                </Field>
                <Field label="Taluka / तालुका">
                  <input className="w-full p-3 rounded-lg border border-outline-variant" name="taluka" placeholder="e.g. Karad" type="text" />
                </Field>
                <Field label="Radius / त्रिज्या (KM)">
                  <input className="w-full p-3 rounded-lg border border-outline-variant" name="radius" placeholder="15" type="number" />
                </Field>
              </div>
            </section>

            <div className="flex items-center justify-between pt-6">
              <Link href="/owner-profile" className="px-8 py-3 text-primary font-bold hover:bg-emerald-50 rounded-lg transition-all">
                Skip / वगळा
              </Link>
              <button className="px-10 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all disabled:opacity-60" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Submitting..." : "Continue / पुढे सुरू ठेवा"}
              </button>
            </div>
          </form>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-2xl border border-surface-container-highest shadow-xl overflow-hidden">
                <div className="aspect-[4/3] relative bg-slate-100 dark:bg-slate-800">
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary">
                    Live Preview
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-widest">Tractor</p>
                      <h3 className="text-xl font-extrabold text-primary">Mahindra 575 DI</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-primary">₹850</p>
                      <p className="text-[10px] text-on-surface-variant font-bold">PER HOUR</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded">45 HP</span>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded">Power Steering</span>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded">2022 Model</span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary-fixed/30 p-6 rounded-2xl border border-secondary-container/20">
                <h4 className="text-on-secondary-fixed-variant font-bold text-sm mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">verified_user</span>
                  Trust Policy
                </h4>
                <p className="text-xs text-on-secondary-fixed-variant/80 leading-relaxed">
                  Your listing will be reviewed within 24 hours. Ensure all information is accurate to avoid rejection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="font-label text-sm font-semibold text-on-surface-variant">{label}</label>
      {children}
    </div>
  );
}
