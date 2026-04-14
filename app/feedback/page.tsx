"use client";

import { useState } from "react";
import { submitFeedbackAction } from "@/lib/actions/local-data";
import { ChoicePills, FormActions, FormField, FormGrid, FormNotice, FormSection, FormShell } from "@/components/forms/FormKit";
import { useLanguage } from "@/components/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSmoothRouter } from "@/lib/client/useSmoothRouter";
import { feedbackSchema } from "@/lib/validation/forms";

export default function FeedbackPage() {
  const { t, langText } = useLanguage();
  const router = useSmoothRouter();
  const [rating, setRating] = useState<number | undefined>();
  const [role, setRole] = useState<"farmer" | "owner" | "partner" | "visitor">("visitor");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const parsed = feedbackSchema.safeParse({
      fullName: form.get("fullName"),
      mobileNumber: form.get("mobileNumber"),
      email: form.get("email"),
      role,
      category: form.get("category"),
      subject: form.get("subject"),
      message: form.get("message"),
      rating,
      contactMe: form.get("contactMe") === "on",
    });

    if (!parsed.success) {
      setError(
        parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          t("feedback.please_complete_the_feedback_form_correctly")
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitFeedbackAction(parsed.data);
      if (!result.ok) {
        setError(result.error || t("feedback.could_not_submit_feedback_right_now"));
        return;
      }

      router.push(result.redirectTo || "/feedback/success");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950 text-on-surface">
      <Header />
      <main className="flex-grow flex flex-col items-center pb-20">
      {/* Hero Section */}
      <section className="w-full max-w-[1200px] px-4 md:px-8 py-8 md:py-12 mt-4">
        <div className="relative w-full rounded-2xl overflow-hidden bg-surface-container shadow-sm border border-surface-variant flex flex-col md:flex-row min-h-[300px]">
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-primary-container z-10">
            <h1 className="text-on-primary font-headline text-3xl md:text-5xl font-bold leading-tight mb-4">
              {t("feedback.share_your_feedback")}
            </h1>
            <p className="text-on-primary-container font-body text-base md:text-lg max-w-md">
              {t("feedback.help_us_improve_kisan_kamai_for_every_farmer_and_equipment_owner")}
            </p>
          </div>
          <div
            className="absolute inset-0 md:relative md:w-[45%] opacity-30 md:opacity-100 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA8Xr4lg_H-izzJrrcejcw45UXzCzstoO5DhWjUiCzPQl7r63nMHpKCjm44kOpnkjjrxBxEp8nX_pMfD9JQmAqaiGoatR1ac_-I4kCOjqvQPs2T0Zui_OLEYTlWAVcK9TUr6oMbabE9LTHbEMEK6Ylb6QYzY1UFFQeWAUtxRlOm99rUnxMQ_7mrC5RDTik0hmPYx-a2UpU5hbsvrf4L5QWP_grh7vLxy_ou4OoZV81SSUms7UyrSTFhtTOUNQ4TuEqOpxNG8U9DstKz')",
            }}
          ></div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="w-full max-w-[800px] px-4 md:px-8">
        <FormShell
          eyebrow={t("feedback.share_your_feedback")}
          title={t("feedback.share_your_feedback")}
          description={t("feedback.help_us_improve_kisan_kamai_for_every_farmer_and_equipment_owner")}
          aside={
            <div className="space-y-4">
              <h3 className="text-lg font-black text-primary">{t("feedback.overall_satisfaction")}</h3>
              <p className="text-sm font-medium text-on-surface-variant">
                {t("feedback.your_feedback_is_handled_securely")}
              </p>
              <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-5">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                  {t("feedback.feedback_category")}
                </p>
                <ul className="mt-4 space-y-2 text-sm font-medium text-on-surface-variant">
                  <li>{t("feedback.website_experience")}</li>
                  <li>{t("feedback.booking_experience")}</li>
                  <li>{t("feedback.support_experience")}</li>
                  <li>{t("feedback.payment_and_pricing")}</li>
                </ul>
              </div>
            </div>
          }
        >
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error ? <FormNotice tone="error">{error}</FormNotice> : null}

            <FormSection title={t("feedback.personal_information")}>
              <FormGrid>
                <FormField label={t("feedback.full_name")} required>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder={t("feedback.enter_your_full_name")}
                    className="kk-input"
                  />
                </FormField>
                <FormField label={t("feedback.mobile_number")} required>
                  <input
                    type="tel"
                    name="mobileNumber"
                    required
                    placeholder={t("feedback.enter_10_digit_number")}
                    className="kk-input"
                  />
                </FormField>
              </FormGrid>
              <FormField label={`${t("feedback.email")} (${t("feedback.optional")})`}>
                <input
                  type="email"
                  name="email"
                  placeholder={t("feedback.enter_your_email_address")}
                  className="kk-input"
                />
              </FormField>
            </FormSection>

            <FormSection title={t("feedback.feedback_category")}>
              <FormField label={t("feedback.i_am_a")} required>
                <ChoicePills
                  options={[
                    { value: "farmer", label: langText("Farmer", "शेतकरी") },
                    { value: "owner", label: langText("Equipment Owner", "मालक") },
                    { value: "partner", label: langText("Partner", "भागीदार") },
                    { value: "visitor", label: langText("Visitor", "अभ्यागत") },
                  ]}
                  value={role}
                  onChange={setRole}
                />
                <input type="hidden" name="role" value={role} />
              </FormField>

              <FormGrid>
                <FormField label={t("feedback.feedback_category")} required>
                  <select
                    name="category"
                    required
                    className="kk-input"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      {t("feedback.select_a_category")}
                    </option>
                    <option value="website">{t("feedback.website_experience")}</option>
                    <option value="booking">{t("feedback.booking_experience")}</option>
                    <option value="listing">{t("feedback.listing_experience")}</option>
                    <option value="support">{t("feedback.support_experience")}</option>
                    <option value="payment">{t("feedback.payment_and_pricing")}</option>
                    <option value="suggestion">{t("feedback.suggestion")}</option>
                    <option value="issue">{t("feedback.report_an_issue")}</option>
                  </select>
                </FormField>
                <FormField label={t("feedback.subject")} required>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder={t("feedback.brief_subject_of_your_feedback")}
                    className="kk-input"
                  />
                </FormField>
              </FormGrid>

              <FormField label={t("feedback.feedback_message")} required>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder={t("feedback.please_describe_your_experience_or_suggestion_in_detail")}
                  className="kk-input min-h-[160px]"
                />
              </FormField>
            </FormSection>

            <FormSection title={t("feedback.overall_satisfaction")}>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition-colors ${
                      rating && star <= rating ? "text-tertiary-container" : "text-outline hover:text-tertiary-container"
                    }`}
                  >
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </button>
                ))}
              </div>

              <label className="mt-4 flex items-start gap-3 text-sm font-medium text-on-surface">
                <input
                  type="checkbox"
                  name="contactMe"
                  className="mt-1 h-5 w-5 rounded border-outline text-primary focus:ring-primary"
                />
                <span>{t("feedback.contact_me_about_this_feedback")}</span>
              </label>
            </FormSection>

            <FormActions>
              <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">lock</span>
                <span>{t("feedback.your_feedback_is_handled_securely")}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="kk-form-primary-button"
              >
                {isSubmitting ? t("feedback.submitting") : t("feedback.submit_feedback")}
              </button>
            </FormActions>
          </form>
        </FormShell>
      </section>
    </main>
    <Footer />
  </div>
  );
}


