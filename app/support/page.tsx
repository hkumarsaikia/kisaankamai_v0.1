"use client";

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { AppLink } from "@/components/AppLink";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useLanguage } from "@/components/LanguageContext";
import { LazyMap } from "@/components/LazyMap";
import { FormActions, FormField, FormGrid, FormNotice, FormSection, FormShell } from "@/components/forms/FormKit";
import {
  submitCallbackRequestAction,
  submitSupportRequestAction,
} from "@/lib/actions/local-data";
import { SUPPORT_HUB_MARKERS } from "@/lib/map-data";
import { supportContact } from "@/lib/support-contact";
import { callbackRequestSchema, supportRequestSchema } from "@/lib/validation/forms";

export default function Support() {
  const { t } = useLanguage();
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
    if (!formRef.current) {
      return;
    }

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
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow pt-28 pb-20">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <div className="relative overflow-hidden rounded-xl bg-primary-container p-8 md:p-16 text-white shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block px-4 py-1.5 bg-on-tertiary-container/20 text-on-tertiary-container rounded-full text-sm font-bold tracking-wide uppercase mb-6">{t("support.contact_us")}</span>
              <h1 className="text-4xl md:text-6xl font-extrabold font-headline leading-tight mb-6 tracking-tight">
                {t("support.we_are_here_to_help")} <br />
                <span className="text-on-primary-container font-mukta">{t("support.text")}</span>
              </h1>
              <p className="text-lg md:text-xl text-on-primary-fixed-variant max-w-xl font-medium leading-relaxed opacity-90">
                {t("support.reach_out_to_our_team_in_sangli_satara_or_kolhapur_for_any_equipment_rental_or_listing_support")}
              </p>
            </div>
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 pointer-events-none hidden lg:block">
              <Image
                alt="Farmer with phone"
                className="object-cover"
                src="/assets/generated/hero_tractor.png"
                fill
                sizes="33vw"
              />
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900/40 p-8 rounded-xl shadow-sm border border-emerald-50 dark:border-slate-800/50">
              <h2 className="text-xl font-bold font-headline mb-6 text-emerald-900 dark:text-emerald-50">{t("support.direct_support_channels")}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-800/30 flex items-center justify-center text-emerald-900 dark:text-emerald-400 shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t("support.call_us")}</p>
                    <a className="text-lg font-bold text-emerald-900 dark:text-emerald-50 hover:text-secondary transition-colors" href={supportContact.phoneHref}>{supportContact.phoneDisplay}</a>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{t("support.free_for_all_indian_networks")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-800/30 flex items-center justify-center text-emerald-900 dark:text-emerald-400 shrink-0">
                    <span className="material-symbols-outlined">chat</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t("support.whatsapp")}</p>
                    <a className="text-lg font-bold text-emerald-900 dark:text-emerald-50 hover:text-secondary transition-colors" href={supportContact.whatsappHref}>{supportContact.whatsappDisplay}</a>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{t("support.average_response_15_mins")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-800/30 flex items-center justify-center text-emerald-900 dark:text-emerald-400 shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t("support.email")}</p>
                    <a className="text-lg font-bold text-emerald-900 dark:text-emerald-50 hover:text-secondary transition-colors" href={supportContact.emailHref}>{supportContact.email}</a>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{t("support.official_correspondence")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low dark:bg-slate-900/50 p-8 rounded-xl border border-surface-container-highest dark:border-slate-800/50">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-on-surface dark:text-emerald-50">
                <span className="material-symbols-outlined text-secondary">schedule</span>
                {t("support.service_hours")}
              </h3>
              <p className="text-on-surface-variant dark:text-slate-300 font-medium">{supportContact.serviceHours}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <AppLink className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-emerald-100 dark:border-slate-800/50 hover:border-emerald-500 hover:shadow-md transition-all" href="/faq">
                <span className="material-symbols-outlined text-secondary mb-3 block">menu_book</span>
                <span className="font-bold block text-emerald-900 dark:text-emerald-50">{t("support.how_to_rent")}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-tighter">{t("support.guide")}</span>
              </AppLink>
              <AppLink className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-emerald-100 dark:border-slate-800/50 hover:border-emerald-500 hover:shadow-md transition-all" href="/list-equipment">
                <span className="material-symbols-outlined text-secondary mb-3 block">handyman</span>
                <span className="font-bold block text-emerald-900 dark:text-emerald-50">{t("support.owner_guide")}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-tighter">{t("support.help")}</span>
              </AppLink>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <FormShell
              eyebrow={t("support.contact_us")}
              title={t("support.send_a_message")}
              description={t("support.fill_out_the_form_below_and_our_team_will_get_back_to_you_within_2_4_business_hours")}
              aside={
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-primary">{t("support.service_hours")}</h3>
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
              <form className="space-y-6" ref={formRef} onSubmit={handleSupportSubmit}>
                {error ? <FormNotice tone="error">{error}</FormNotice> : null}
                {success ? <FormNotice tone="success">{success}</FormNotice> : null}

                <FormSection
                  title={t("support.contact_us")}
                  description={t("support.reach_out_to_our_team_in_sangli_satara_or_kolhapur_for_any_equipment_rental_or_listing_support")}
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
          </div>
        </section>

        {/* Regional Hubs with Real Map */}
        <section className="max-w-7xl mx-auto px-6 mt-20">
          <div className="bg-white dark:bg-slate-900/40 rounded-xl shadow-sm border border-emerald-50 dark:border-slate-800/50 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-bold font-headline text-emerald-900 dark:text-emerald-50 mb-4">{t("support.visit_our_regional_hubs")}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">{t("support.direct_support_is_available_at_our_partner_centers_across_southern_maharashtra")}</p>
                <div className="space-y-6">
                  {[
                    { name: t("support.sangli_district_hub"), addr: "Market Yard Road, Sangli, Maharashtra 416416" },
                    { name: t("support.satara_district_hub"), addr: "Bombay Restaurant Chowk, Satara, Maharashtra 415001" },
                    { name: t("support.kolhapur_regional_hub"), addr: "Shiroli Pulachi, Kolhapur, Maharashtra 416122" },
                    { name: t("support.kalwan_area_hub"), addr: "Nashik Region, Maharashtra 423501" },
                    { name: t("support.mukhed_area_hub"), addr: "Nanded Region, Maharashtra 431715" },
                  ].map((hub) => (
                    <div key={hub.name} className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-secondary">location_on</span>
                      <div>
                        <h4 className="font-bold text-emerald-900 dark:text-emerald-50">{hub.name}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{hub.addr}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-64 lg:h-auto min-h-[400px] relative">
                <LazyMap
                  center={[17.05, 74.40]}
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
