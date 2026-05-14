"use client";

import { formatSubmissionError, postJson, SubmissionError } from "@/lib/client/forms";
import { bookingRequestSchema } from "@/lib/validation/forms";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

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
      await postJson("/api/forms/booking-request", parsed.data);
      setSuccess("Booking callback request submitted.");
      event.currentTarget.reset();
    } catch (submitError) {
      if (submitError instanceof SubmissionError) {
        if (submitError.status === 401) {
          window.location.href = "/login";
          return;
        }
        setError(formatSubmissionError(submitError, "Could not submit the booking callback right now."));
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
	        <label htmlFor="catalog-field-location" className="kk-form-label">Field Location (Sangli Region Only)</label>
	        <div className="relative">
	          <span className="material-symbols-outlined absolute left-3 top-3.5 text-outline text-lg">location_on</span>
	          <input id="catalog-field-location" className="kk-input pl-10" name="fieldLocation" autoComplete="address-level3" placeholder="Village / Taluka name" type="text" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
	          <label htmlFor="catalog-work-type" className="kk-form-label">Work Type</label>
	          <select id="catalog-work-type" className="kk-input" name="workType">
            <option>Plowing</option>
            <option>Sowing</option>
            <option>Transport</option>
            <option>Harrowing</option>
          </select>
        </div>
        <div className="space-y-1.5">
	          <label htmlFor="catalog-approx-hours" className="kk-form-label">Approx Hours</label>
	          <input id="catalog-approx-hours" className="kk-input" name="approxHours" placeholder="8" type="number" />
        </div>
      </div>
      <div className="space-y-1.5">
	        <label htmlFor="catalog-phone" className="kk-form-label">Phone Number</label>
	        <div className="relative">
	          <span className="material-symbols-outlined absolute left-3 top-3.5 text-outline text-lg">call</span>
	          <input id="catalog-phone" className="kk-input pl-10" name="phone" autoComplete="tel" placeholder="+91 00000 00000" type="tel" />
	        </div>
	      </div>
	      {error ? <p className="text-sm font-semibold text-red-600" role="alert">{error}</p> : null}
	      {success ? <p className="text-sm font-semibold text-emerald-700" role="status" aria-live="polite">{success}</p> : null}
	      <Button className="w-full" disabled={isSubmitting} type="submit" variant="secondary">
	        {isSubmitting ? "Submitting…" : "Request Booking Callback"}
	      </Button>
    </form>
  );
}
