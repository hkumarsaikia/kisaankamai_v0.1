"use client";

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { AppLink } from "@/components/AppLink";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useLanguage } from "@/components/LanguageContext";
import { LazyMap } from "@/components/LazyMap";
import { FormActions, FormField, FormGrid, FormNotice, FormSection, FormShell } from "@/components/forms/FormKit";
import { submitCallbackRequestAction, submitSupportRequestAction } from "@/lib/actions/local-data";
import { SUPPORT_HUB_MARKERS } from "@/lib/map-data";
import { supportContact } from "@/lib/support-contact";
import { callbackRequestSchema, supportRequestSchema } from "@/lib/validation/forms";

export default function SupportPage() {
  const { t, langText } = useLanguage();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSupportSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    const parsed = supportRequestSchema.safeParse({
      fullName: form.get("fullName"),
      phone: form.get("phone"),
      email: form.get("email"),
      category: form.get("category"),
      message: form.get("message"),
      sourcePath: "/support",
    });

    if (!parsed.success) {
      setError(
        parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          t("support.please_complete_the_support_form_correctly")
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitSupportRequestAction(parsed.data);
      if (!result.ok) {
        setError(result.error || t("support.could_not_submit_your_support_request_right_now"));
        return;
      }

      setSuccess(t("support.support_request_submitted"));
      event.currentTarget.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallbackRequest = async () => {
    if (!formRef.current) return;

    setError("");
    setSuccess("");
    const form = new FormData(formRef.current);
    const parsed = callbackRequestSchema.safeParse({
      fullName: form.get("fullName"),
      phone: form.get("phone"),
      equipmentNeeded: form.get("category") || "Support callback",
      location: "",
    });

    if (!parsed.success) {
      setError(
        parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          t("support.enter_your_name_and_phone_to_request_a_callback")
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitCallbackRequestAction(parsed.data);
      if (!result.ok) {
        setError(result.error || t("support.could_not_request_a_callback_right_now"));
        return;
      }

      setSuccess(t("support.callback_request_submitted"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <Header />
      <main className="flex-grow pt-24 pb-20">
        <section className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-outline-variant bg-primary-container shadow-[0_24px_60px_-36px_rgba(20,59,46,0.55)]">
            <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6 p-8 md:p-12 text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.22em]">
                  <span className="material-symbols-outlined text-base">support_agent</span>
                  {t("support.contact_us")}
                </span>
                <div className="space-y-4">
                  <h1 className="max-w-2xl text-4xl font-black tracking-tight md:text-6xl">
                    {langText("We are here to help.", "आम्ही मदतीसाठी येथे आहोत.")}
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-white/80">
                    {langText(
                      "Reach the support team for booking help, listing questions, payments, or general guidance.",
                      "बुकिंग मदत, लिस्टिंग प्रश्न, पेमेंट किंवा सामान्य मार्गदर्शनासाठी सपोर्ट टीमशी संपर्क साधा."
                    )}
                  </p>
                </div>
              </div>
              <div className="relative min-h-[260px] lg:min-h-0">
                <Image
                  alt="Support team"
                  src="/assets/generated/hero_tractor.png"
                  fill
                  className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-primary-container via-primary-container/60 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
              <h2 className="text-lg font-black text-primary">{t("support.direct_support_channels")}</h2>
              <div className="mt-6 space-y-5">
                <Channel
                  icon="call"
                  title={t("support.call_us")}
                  value={supportContact.phoneDisplay}
                  href={supportContact.phoneHref}
                  copy={t("support.free_for_all_indian_networks")}
                />
                <Channel
                  icon="chat"
                  title={t("support.whatsapp")}
                  value={supportContact.whatsappDisplay}
                  href={supportContact.whatsappHref}
                  copy={t("support.average_response_15_mins")}
                />
                <Channel
                  icon="mail"
                  title={t("support.email")}
                  value={supportContact.email}
                  href={supportContact.emailHref}
                  copy={t("support.official_correspondence")}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <AppLink className="rounded-[1.5rem] border border-outline-variant bg-surface-container-lowest p-5 shadow-sm transition-transform hover:-translate-y-0.5" href="/faq">
                <span className="material-symbols-outlined text-secondary">menu_book</span>
                <p className="mt-3 text-sm font-black text-primary">{langText("How to rent", "भाड्याने कसे घ्यावे")}</p>
                <p className="mt-1 text-xs font-medium text-on-surface-variant">{langText("Guided steps and common questions.", "मार्गदर्शित पावले आणि सामान्य प्रश्न.")}</p>
              </AppLink>
              <AppLink className="rounded-[1.5rem] border border-outline-variant bg-surface-container-lowest p-5 shadow-sm transition-transform hover:-translate-y-0.5" href="/list-equipment">
                <span className="material-symbols-outlined text-secondary">handyman</span>
                <p className="mt-3 text-sm font-black text-primary">{langText("How to list", "लिस्टिंग कसे करावे")}</p>
                <p className="mt-1 text-xs font-medium text-on-surface-variant">{langText("Start the owner journey from here.", "इथून मालक प्रवास सुरू करा.")}</p>
              </AppLink>
            </div>
          </div>

          <FormShell
            eyebrow={t("support.contact_us")}
            title={t("support.send_a_message")}
            description={t("support.fill_out_the_form_below_and_our_team_will_get_back_to_you_within_2_4_business_hours")}
            aside={
              <div className="space-y-4">
                <h3 className="text-lg font-black text-primary dark:text-emerald-50">{t("support.service_hours")}</h3>
                <p className="text-sm font-medium text-on-surface-variant">{t("support.daily_8_am_to_8_pm")}</p>
                <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-5">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">{t("support.direct_support_channels")}</p>
                  <div className="mt-4 space-y-3 text-sm font-medium text-on-surface-variant">
                    <p>{t("support.call_us")}: {supportContact.phoneDisplay}</p>
                    <p>{t("support.whatsapp")}: {supportContact.whatsappDisplay}</p>
                    <p>{t("support.email")}: {supportContact.email}</p>
                  </div>
                </div>
              </div>
            }
          >
            <form ref={formRef} className="space-y-6" onSubmit={handleSupportSubmit}>
              {error ? <FormNotice tone="error">{error}</FormNotice> : null}
              {success ? <FormNotice tone="success">{success}</FormNotice> : null}

              <FormSection
                title={t("support.contact_us")}
                description={langText(
                  "Tell us what you need and we will route it to the right team.",
                  "तुम्हाला काय हवे आहे ते सांगा आणि आम्ही योग्य टीमकडे पोहोचवू."
                )}
              >
                <FormGrid>
                  <FormField label={t("support.full_name")} required>
                    <input className="kk-input" name="fullName" placeholder={t("support.enter_your_name")} type="text" />
                  </FormField>
                  <FormField label={t("support.phone_number")} required>
                    <input className="kk-input" name="phone" placeholder="+91 00000 00000" type="tel" />
                  </FormField>
                </FormGrid>
                <FormGrid>
                  <FormField label={t("support.email_address_optional")}>
                    <input className="kk-input" name="email" placeholder="email@example.com" type="email" />
                  </FormField>
                  <FormField label={t("support.category")} required>
                    <select className="kk-input" defaultValue={t("support.i_want_to_rent")} name="category">
                      <option>{t("support.i_want_to_rent")}</option>
                      <option>{t("support.i_want_to_list")}</option>
                      <option>{t("support.payment_issue")}</option>
                      <option>{t("support.general_support")}</option>
                    </select>
                  </FormField>
                </FormGrid>
                <FormField label={t("support.message")} required>
                  <textarea className="kk-input min-h-[160px]" name="message" placeholder={t("support.how_can_we_help_you_today")} rows={5} />
                </FormField>
              </FormSection>

              <FormActions>
                <button className="kk-button-outline" disabled={isSubmitting} onClick={handleCallbackRequest} type="button">
                  {t("support.request_callback")}
                </button>
                <button className="kk-form-primary-button" disabled={isSubmitting} type="submit">
                  {isSubmitting ? t("support.sending") : t("support.send_message")}
                </button>
              </FormActions>
            </form>
          </FormShell>
        </section>

        <section className="mx-auto mt-12 max-w-7xl px-6">
          <div className="overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-lowest shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4 p-8 md:p-12">
                <h2 className="text-2xl font-black text-primary">{t("support.visit_our_regional_hubs")}</h2>
                <p className="text-sm font-medium leading-7 text-on-surface-variant">
                  {t("support.direct_support_is_available_at_our_partner_centers_across_southern_maharashtra")}
                </p>
                <div className="space-y-4">
                  {[
                    [t("support.sangli_district_hub"), "Market Yard Road, Sangli, Maharashtra 416416"],
                    [t("support.satara_district_hub"), "Bombay Restaurant Chowk, Satara, Maharashtra 415001"],
                    [t("support.kolhapur_regional_hub"), "Shiroli Pulachi, Kolhapur, Maharashtra 416122"],
                  ].map(([name, addr]) => (
                    <div key={name as string} className="rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-4">
                      <h3 className="font-black text-primary">{name as string}</h3>
                      <p className="mt-1 text-sm text-on-surface-variant">{addr as string}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="min-h-[360px]">
                <LazyMap
                  center={[17.05, 74.4]}
                  zoom={9}
                  markers={SUPPORT_HUB_MARKERS}
                  height="100%"
                  showControls={false}
                  className="rounded-none"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Channel({
  icon,
  title,
  value,
  href,
  copy,
}: {
  icon: string;
  title: string;
  value: string;
  href?: string;
  copy: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-container/10 text-primary">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-black text-primary">{title}</p>
        {href ? (
          <a className="mt-1 inline-flex text-base font-black text-on-surface hover:text-primary" href={href}>
            {value}
          </a>
        ) : (
          <p className="mt-1 text-base font-black text-on-surface">{value}</p>
        )}
        <p className="mt-1 text-xs font-medium text-on-surface-variant">{copy}</p>
      </div>
    </div>
  );
}
