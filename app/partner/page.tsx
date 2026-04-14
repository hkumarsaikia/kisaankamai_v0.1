"use client";

import { ContentImage } from "@/components/ContentImage";
import { FormActions, FormField, FormGrid, FormNotice, FormSection, FormShell } from "@/components/forms/FormKit";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { postJson, SubmissionError } from "@/lib/client/forms";
import { assetPath } from "@/lib/site";
import { partnerInquirySchema } from "@/lib/validation/forms";
import { FormEvent, useState } from "react";

export default function PartnerPage() {
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    const parsed = partnerInquirySchema.safeParse({
      organizationName: form.get("organizationName"),
      partnerType: form.get("partnerType"),
      contactPerson: form.get("contactPerson"),
      phone: form.get("phone"),
      businessLocation: form.get("businessLocation"),
      message: form.get("message"),
    });

    if (!parsed.success) {
      setError(
        parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          "Please complete the inquiry form correctly."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await postJson("/api/forms/partner-inquiry", parsed.data);
      setSuccess("Inquiry received. Our partnership team will contact you within 24 hours.");
      event.currentTarget.reset();
    } catch (submitError) {
      if (submitError instanceof SubmissionError) {
        setError(submitError.message);
      } else {
        setError("Could not submit your inquiry right now.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-slate-950">
      <Header />
      <main className="flex-grow pt-28 pb-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,rgba(20,59,46,0.05)_0px,transparent_50%),radial-gradient(at_100%_100%,rgba(168,91,51,0.05)_0px,transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <span className="inline-block py-1 px-3 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-sm font-bold tracking-wider mb-6">{t("partner.opportunity_for_growth")}</span>
            <h1 className="text-5xl lg:text-7xl font-extrabold font-headline text-primary dark:text-emerald-50 mb-6 leading-tight tracking-tighter">
              {t("partner.empowering_rural_entrepreneurs")}
            </h1>
            <p className="text-xl text-on-surface-variant dark:text-slate-400 leading-relaxed mb-4 max-w-xl">
              {t("partner.join_india_s_fastest_growing_agritech_marketplace_partner_with_kisan_kamai_to_transform_agricultural_logistics")}
            </p>
            <p className="text-base text-secondary dark:text-amber-400 font-bold mb-10 font-mukta">
              भारतातील सर्वात वेगाने वाढणाऱ्या कृषी तंत्रज्ञान बाजारपेठेत सामील व्हा.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a className="bg-primary-container text-white text-center px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all" href="#inquiry">{t("partner.become_a_partner")}</a>
              <a className="border-2 border-primary-container dark:border-emerald-600 text-primary-container dark:text-emerald-400 text-center px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-container/5 transition-all" href="#models">{t("partner.explore_models")}</a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <ContentImage className="w-full h-full object-cover" alt="Farmer and agritech representative in wheat field" src={assetPath("/assets/generated/hero_tractor.png")} loading="lazy" decoding="async" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-900/80 p-6 rounded-2xl card-shadow-xl hidden md:block max-w-[240px]">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-secondary text-3xl">trending_up</span>
                <span className="font-bold text-primary dark:text-emerald-50">High Growth</span>
              </div>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-tight">Partners see an average increase of 40% in machinery utilization rates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Models */}
      <section className="py-24 bg-white dark:bg-slate-950/50" id="models">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-extrabold font-headline text-primary dark:text-emerald-50 mb-4 tracking-tight">{t("partner.tailored_partnership_models")}</h2>
            <p className="text-lg text-on-surface-variant dark:text-slate-400 max-w-2xl mx-auto">{t("partner.we_offer_flexible_collaboration_frameworks_designed_for_fpos_local_dealers_and_financial_innovators")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Listing Partner */}
            <div className="md:col-span-8 bg-surface-container-low dark:bg-slate-900/40 rounded-3xl p-8 flex flex-col justify-between border border-outline-variant/30 dark:border-slate-800/50 hover:shadow-lg transition-all group overflow-hidden relative min-h-[300px]">
              <div className="relative z-10">
                <span className="bg-primary dark:bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold mb-4 inline-block">FOR DEALERS & FPOs</span>
                <h3 className="text-3xl font-extrabold text-primary dark:text-emerald-50 mb-4">Equipment Listing Partner</h3>
                <p className="text-on-surface-variant dark:text-slate-400 max-w-md mb-6 leading-relaxed">Digitize your inventory and reach thousands of verified renters.</p>
                <ul className="space-y-3 mb-8">
                  {["Zero upfront platform fees", "Integrated GPS monitoring", "Secure automated payments"].map((item) => (
                    <li key={item} className="flex items-center gap-2 font-medium text-primary-container dark:text-emerald-400">
                      <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-sm">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="relative z-10 w-fit bg-primary-container text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all">Start Listing</button>
            </div>

            {/* Financing Partner */}
            <div className="md:col-span-4 bg-secondary-container rounded-3xl p-8 flex flex-col border border-on-secondary-container/10 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <span className="material-symbols-outlined text-on-secondary-container text-3xl">account_balance</span>
              </div>
              <h3 className="text-2xl font-extrabold text-on-secondary-container mb-4">Financial Institution</h3>
              <p className="text-on-secondary-container/80 mb-6 flex-grow">Partner with us to provide asset financing and credit lines to equipment owners.</p>
              <div className="mt-auto pt-6 border-t border-on-secondary-container/10">
                <p className="font-bold text-on-secondary-container mb-2">Benefit from:</p>
                <p className="text-sm text-on-secondary-container/70">Verified transaction history & risk-mitigated asset monitoring.</p>
              </div>
            </div>

            {/* Hub Operator */}
            <div className="md:col-span-4 bg-tertiary-container rounded-3xl p-8 flex flex-col border border-tertiary/20 hover:shadow-lg transition-all text-white">
              <div className="w-14 h-14 bg-on-tertiary-container rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <span className="material-symbols-outlined text-white text-3xl">hub</span>
              </div>
              <h3 className="text-2xl font-extrabold mb-4">Operating Hub Partner</h3>
              <p className="text-white/80 mb-6 flex-grow">Become a regional service center. Manage logistics, maintenance, and operator training.</p>
              <div className="mt-auto flex items-center gap-2 font-bold text-on-tertiary-container">
                Learn more <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>

            {/* FPO Network */}
            <div className="md:col-span-8 bg-surface-dim dark:bg-slate-900/10 rounded-3xl p-8 flex items-center gap-8 border border-outline-variant/30 dark:border-slate-800/50 overflow-hidden">
              <div className="flex-1">
                <h3 className="text-2xl font-extrabold text-primary dark:text-emerald-50 mb-4">Strategic FPO Network</h3>
                <p className="text-on-surface-variant dark:text-slate-400 max-w-sm mb-6">Empower your FPO members with collective access to mechanization.</p>
                <div className="flex gap-4">
                  <div className="bg-white/50 dark:bg-slate-900/60 backdrop-blur rounded-xl px-4 py-2">
                    <p className="text-2xl font-bold text-primary dark:text-emerald-50">150+</p>
                    <p className="text-xs uppercase tracking-widest font-bold opacity-60">Active FPOs</p>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-900/60 backdrop-blur rounded-xl px-4 py-2">
                    <p className="text-2xl font-bold text-primary dark:text-emerald-50">25k+</p>
                    <p className="text-xs uppercase tracking-widest font-bold opacity-60">Farmers Served</p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block w-1/3 aspect-video rounded-2xl overflow-hidden shadow-inner">
                <ContentImage className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Farm equipment facility" src={assetPath("/assets/generated/hero_tractor.png")} loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-surface-container-highest/30 dark:bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold font-headline text-primary dark:text-emerald-50 mb-8 tracking-tight">{t("partner.why_partner_with_kisan_kamai")}</h2>
              <div className="space-y-8">
                {[
                  { icon: "payments", title: t("partner.sustainable_revenue_streams"), desc: t("partner.maximize_roi_on_expensive_assets_by_keeping_them_utilized_throughout_the_season") },
                  { icon: "analytics", title: t("partner.data_driven_insights"), desc: t("partner.access_detailed_reports_on_demand_patterns_machine_health_and_operator_efficiency") },
                  { icon: "verified_user", title: t("partner.risk_mitigation"), desc: t("partner.every_rental_is_backed_by_verified_users_and_digital_contracts") },
                ].map((b) => (
                  <div key={b.title} className="flex gap-6">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-emerald-100 dark:bg-slate-900/60 flex items-center justify-center text-emerald-800 dark:text-emerald-400">
                      <span className="material-symbols-outlined">{b.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-primary dark:text-emerald-50 mb-2">{b.title}</h4>
                      <p className="text-on-surface-variant dark:text-slate-400">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative grid grid-cols-2 gap-4">
              <div className="pt-12">
                <ContentImage className="rounded-2xl shadow-lg mb-4 h-64 w-full object-cover" alt="Agricultural dealers" src={assetPath("/assets/generated/modern_farm_tech.png")} loading="lazy" decoding="async" />
                <div className="bg-primary-container p-6 rounded-2xl text-white">
                  <p className="text-3xl font-bold mb-1">98%</p>
                  <p className="text-sm opacity-80">Partner retention rate</p>
                </div>
              </div>
              <div>
                <div className="bg-secondary p-6 rounded-2xl text-white mb-4">
                  <p className="text-3xl font-bold mb-1">₹12Cr+</p>
                  <p className="text-sm opacity-80">Total partner earnings</p>
                </div>
                <ContentImage className="rounded-2xl shadow-lg h-80 w-full object-cover" alt="Entrepreneur with tablet" src={assetPath("/assets/generated/modern_farm_tech.png")} loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-24 bg-white dark:bg-slate-950/30 relative" id="inquiry">
        <div className="max-w-4xl mx-auto px-6">
          <FormShell
            eyebrow={t("partner.opportunity_for_growth")}
            title={t("partner.partner_inquiry")}
            description={t("partner.tell_us_about_your_organization_and_we_ll_reach_out_within_24_hours")}
            aside={
              <div className="space-y-4">
                <h3 className="text-lg font-black text-primary">Reference partner types</h3>
                <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-5">
                  <ul className="space-y-2 text-sm font-medium text-on-surface-variant">
                    <li>FPO / Cooperative</li>
                    <li>Equipment Dealer</li>
                    <li>Financial Institution</li>
                    <li>Logistics / Tech Partner</li>
                  </ul>
                </div>
              </div>
            }
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error ? <FormNotice tone="error">{error}</FormNotice> : null}
              {success ? <FormNotice tone="success">{success}</FormNotice> : null}

              <FormSection title="Organization details">
                <FormGrid>
                  <FormField label="Organization Name" required>
                    <input className="kk-input" name="organizationName" placeholder="e.g. Mahalakshmi FPO" type="text" />
                  </FormField>
                  <FormField label="Type of Partner" required>
                    <select className="kk-input" defaultValue="FPO / Cooperative" name="partnerType">
                      <option>FPO / Cooperative</option>
                      <option>Equipment Dealer</option>
                      <option>Financial Institution</option>
                      <option>Logistics / Tech Partner</option>
                    </select>
                  </FormField>
                </FormGrid>
                <FormGrid>
                  <FormField label="Contact Person" required>
                    <input className="kk-input" name="contactPerson" placeholder="Full Name" type="text" />
                  </FormField>
                  <FormField label="Phone Number" required>
                    <input className="kk-input" name="phone" placeholder="98765 43210" type="tel" />
                  </FormField>
                </FormGrid>
                <FormField label="Business Location" required>
                  <input className="kk-input" name="businessLocation" placeholder="District, State" type="text" />
                </FormField>
                <FormField label="How can we work together?" required>
                  <textarea className="kk-input min-h-[160px]" name="message" placeholder="Briefly describe your goals..." rows={4} />
                </FormField>
              </FormSection>

              <FormActions>
                <span className="text-sm font-medium text-on-surface-variant">
                  This inquiry keeps the existing local submission pipeline and business fields.
                </span>
                <button type="submit" disabled={isSubmitting} className="kk-form-primary-button">
                  {isSubmitting ? "Submitting..." : t("partner.submit_inquiry")}
                </button>
              </FormActions>
            </form>
          </FormShell>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto rounded-[2rem] bg-secondary-fixed text-on-secondary-fixed-variant p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[300px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
          </div>
          <div className="max-w-2xl text-center md:text-left relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">{t("partner.rooted_in_trust_serving_indian_agriculture")}</h2>
            <p className="text-lg opacity-90">{t("partner.let_s_build_the_future_of_farming_together")}</p>
          </div>
          <div className="shrink-0 relative z-10">
            <a className="inline-flex items-center gap-3 bg-white text-secondary-container px-8 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-transform" href="mailto:partners@kisankamai.com">
              <span className="material-symbols-outlined">mail</span>
              Email our Strategy Team
            </a>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
}




