"use client";

import { postJson, SubmissionError } from "@/lib/client/forms";
import { IS_PAGES_BUILD } from "@/lib/runtime";
import { bookingRequestSchema } from "@/lib/validation/forms";
import { FormEvent, useState } from "react";

export default function CatalogBookingForm({
  sourcePath,
  equipmentName,
}: {
  sourcePath: string;
  equipmentName: string;
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    const parsed = bookingRequestSchema.safeParse({
      sourcePath,
      equipmentId: "",
      equipmentName,
      fieldLocation: form.get("fieldLocation"),
      workType: form.get("workType"),
      approxHours: form.get("approxHours"),
      phone: form.get("phone"),
      startDate: "",
      duration: "",
      task: form.get("workType"),
      fieldSize: "",
    });

    if (!parsed.success) {
      setError(
        parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          "Please complete the booking callback form correctly."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (!IS_PAGES_BUILD) {
        await postJson("/api/forms/booking-request", parsed.data);
      }
      setSuccess("Booking callback request submitted.");
      event.currentTarget.reset();
    } catch (submitError) {
      if (submitError instanceof SubmissionError) {
        setError(submitError.message);
      } else {
        setError("Could not submit the booking callback right now.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label className="text-xs font-label font-bold text-outline uppercase tracking-wider">Field Location (Sangli Region Only)</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-3.5 text-outline text-lg">location_on</span>
          <input className="w-full pl-10 pr-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary text-sm font-label" name="fieldLocation" placeholder="Village / Taluka name" type="text" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-label font-bold text-outline uppercase tracking-wider">Work Type</label>
          <select className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary text-sm font-label" name="workType">
            <option>Plowing</option>
            <option>Sowing</option>
            <option>Transport</option>
            <option>Harrowing</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-label font-bold text-outline uppercase tracking-wider">Approx Hours</label>
          <input className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary text-sm font-label" name="approxHours" placeholder="8" type="number" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-label font-bold text-outline uppercase tracking-wider">Phone Number</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-3.5 text-outline text-lg">call</span>
          <input className="w-full pl-10 pr-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary text-sm font-label" name="phone" placeholder="+91 00000 00000" type="tel" />
        </div>
      </div>
      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
      {success ? <p className="text-sm font-semibold text-emerald-700">{success}</p> : null}
      <button className="w-full bg-secondary text-on-secondary font-headline font-black py-4 rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Submitting..." : "Request Booking Callback"}
      </button>
    </form>
  );
}
