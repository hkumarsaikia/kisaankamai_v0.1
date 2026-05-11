"use client";

import { formatSubmissionError, postJson } from "@/lib/client/forms";
import { useLanguage } from "@/components/LanguageContext";
import { supportContact } from "@/lib/support-contact";
import { partnerInquirySchema } from "@/lib/validation/forms";
import { FormEvent, useState } from "react";
import { AppLink as Link } from "@/components/AppLink";

const ecosystemCards = [
  {
    icon: "account_balance",
    title: "Rural Finance",
    description:
      "Enable equipment owners to expand their fleet with tailored finance and risk assessment support.",
    highlights: ["Verified equipment owner leads", "Utilization data for risk assessment"],
    colorClass: "text-primary",
    bgClass: "bg-primary-fixed",
  },
  {
    icon: "local_shipping",
    title: "Logistics & Transport",
    description:
      "Support heavy machinery movement across rural hubs with seasonal route planning and reliable dispatch.",
    highlights: ["Predictable seasonal demand", "Route optimization support"],
    colorClass: "text-secondary",
    bgClass: "bg-secondary-fixed",
  },
  {
    icon: "agriculture",
    title: "OEMs & Dealers",
    description:
      "List new equipment for rental or showcase products to a high-intent network of farmers and owners.",
    highlights: ["Direct access to active farmers", "Product demonstration via rentals"],
    colorClass: "text-on-tertiary-container",
    bgClass: "bg-tertiary-fixed",
  },
];

const reasonsToPartner = [
  {
    icon: "verified_user",
    title: "Trusted Ground Network",
    description:
      "Deep operational presence and trust within rural farming communities in Maharashtra.",
  },
  {
    icon: "integration_instructions",
    title: "Seamless Tech Integration",
    description:
      "Modern platform flows that support finance, logistics, and dealer collaboration.",
  },
  {
    icon: "trending_up",
    title: "High Intent User Base",
    description:
      "Direct access to verified equipment owners and active commercial farmers.",
  },
];

const partnerMarathiCopy: Record<string, string> = {
  "Rural Finance": "ग्रामीण वित्त",
  "Enable equipment owners to expand their fleet with tailored finance and risk assessment support.": "उपकरण मालकांना योग्य वित्त आणि जोखीम मूल्यांकनाच्या मदतीने फ्लीट वाढवण्यास मदत करा.",
  "Verified equipment owner leads": "पडताळलेले उपकरण मालक लीड्स",
  "Utilization data for risk assessment": "जोखीम मूल्यांकनासाठी वापराची माहिती",
  "Logistics & Transport": "लॉजिस्टिक्स आणि वाहतूक",
  "Support heavy machinery movement across rural hubs with seasonal route planning and reliable dispatch.": "हंगामी मार्ग नियोजन आणि विश्वासार्ह डिस्पॅचसह ग्रामीण केंद्रांमध्ये जड यंत्रसामग्रीची वाहतूक समर्थित करा.",
  "Predictable seasonal demand": "अंदाज लावता येणारी हंगामी मागणी",
  "Route optimization support": "मार्ग नियोजन मदत",
  "OEMs & Dealers": "ओईएम आणि डीलर्स",
  "List new equipment for rental or showcase products to a high-intent network of farmers and owners.": "भाड्यासाठी नवीन उपकरणे नोंदवा किंवा सक्रिय शेतकरी आणि मालक नेटवर्कसमोर उत्पादने दाखवा.",
  "Direct access to active farmers": "सक्रिय शेतकर्‍यांशी थेट संपर्क",
  "Product demonstration via rentals": "भाडे व्यवहारातून उत्पादन प्रात्यक्षिक",
  "Trusted Ground Network": "विश्वासार्ह स्थानिक नेटवर्क",
  "Deep operational presence and trust within rural farming communities in Maharashtra.": "महाराष्ट्रातील ग्रामीण शेती समुदायांमध्ये मजबूत कार्यक्षेत्र आणि विश्वास.",
  "Seamless Tech Integration": "सुलभ तांत्रिक एकत्रीकरण",
  "Modern platform flows that support finance, logistics, and dealer collaboration.": "वित्त, लॉजिस्टिक्स आणि डीलर सहकार्याला मदत करणारे आधुनिक प्लॅटफॉर्म प्रवाह.",
  "High Intent User Base": "सक्रिय वापरकर्ता नेटवर्क",
  "Direct access to verified equipment owners and active commercial farmers.": "पडताळलेले उपकरण मालक आणि सक्रिय व्यावसायिक शेतकर्‍यांशी थेट संपर्क.",
};

export default function PartnerPage() {
  const { langText } = useLanguage();
  const tr = (value: string) => langText(value, partnerMarathiCopy[value] || value);
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
          langText("Please complete the enquiry form correctly.", "कृपया चौकशी फॉर्म योग्यरीत्या पूर्ण करा.")
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await postJson("/api/forms/partner-inquiry", parsed.data);
      setError("");
      setSuccess(langText("Enquiry received. Our partnership team will contact you within 24 hours.", "चौकशी प्राप्त झाली. आमची भागीदारी टीम २४ तासांत संपर्क करेल."));
      event.currentTarget.reset();
    } catch (submitError) {
      setSuccess("");
      setError(formatSubmissionError(submitError, langText("Could not submit your enquiry right now.", "आत्ता तुमची चौकशी सबमिट करता आली नाही.")));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-primary-container px-6 pb-12 pt-16 text-white shadow-md md:px-12 md:pb-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBGvUW1pyMSm542J9EtkW-M2MoUvI42nDbcFq-GqQCvxthRJrHAny67FAM2h7NW67l95VCBjI_OieY5IsqWFCx2PZuTqesmOGOhm1OIrJtS6XF2VyuSqzgwDwdbsN6LpkKxY-1gIBGdyjtgA2Vw5paH0TH5-i_1B5fSyhI8_Q9n9dn5Fuh2xdszZ1ndnUVTFLdY08m6_u3pXFqvTXuOLVfpwuAY_EHG4IOWFEYgboIwRrqS8RTqONfFPSX_JnoqwmWO-wc4MoWg30Lf")',
            }}
          />
          <div className="kk-banner-image-overlay" />
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-4xl font-black tracking-[-0.03em] md:text-5xl lg:text-6xl">
              {langText("Expand Agricultural Access in Maharashtra", "महाराष्ट्रात कृषी उपकरणांची उपलब्धता वाढवा")}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-fixed md:text-lg">
              {langText(
                "Join the trusted network revolutionizing rural agriculture. We connect farmers with high-quality equipment, financing, and support across Western Maharashtra.",
                "ग्रामीण शेतीला नवी दिशा देणार्‍या विश्वासार्ह नेटवर्कमध्ये सहभागी व्हा. आम्ही शेतकर्‍यांना उच्च प्रतीची उपकरणे, वित्त आणि सहाय्याशी जोडतो."
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#enquiry-form"
                className="kk-deep-cta inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-bold"
              >
                {langText("Apply for Partnership", "भागीदारीसाठी अर्ज करा")}
              </a>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/80 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-white/10"
              >
                {langText("Explore Ecosystem", "इकोसिस्टम पहा")}
              </Link>
            </div>
          </div>
        </section>

        <section className="px-1 py-16" id="ecosystem">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
              {langText("The Kisan Kamai Ecosystem", "किसान कमाई इकोसिस्टम")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-on-surface-variant md:text-lg">
              {langText(
                "We are building a robust network to support modern farming. Partner with us to deliver value directly to rural equipment owners and farming communities.",
                "आधुनिक शेतीला पाठबळ देण्यासाठी आम्ही मजबूत नेटवर्क उभारत आहोत. ग्रामीण उपकरण मालक आणि शेती समुदायांपर्यंत थेट मूल्य पोहोचवण्यासाठी आमच्यासोबत भागीदारी करा."
              )}
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {ecosystemCards.map((card) => (
              <article
                key={card.title}
                className="kk-depth-tile rounded-xl border border-outline-variant/40 bg-surface-container-low p-8 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-lg ${card.bgClass} ${card.colorClass}`}>
                  <span className="material-symbols-outlined text-3xl">{card.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface">{tr(card.title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{tr(card.description)}</p>
                <ul className="mt-6 space-y-2">
                  {card.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2 text-sm text-on-surface">
                      <span className={`material-symbols-outlined text-sm ${card.colorClass}`}>check_circle</span>
                      {tr(highlight)}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 px-1 lg:grid-cols-[1.6fr_0.8fr]" id="enquiry-form">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm md:p-10">
            <div className="border-b border-outline-variant pb-6">
              <h2 className="text-2xl font-bold text-on-surface md:text-3xl">
                {langText("Premium Partnership Enquiry", "भागीदारी चौकशी")}
              </h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                {langText(
                  "Submit your details to discuss strategic integration with the Kisan Kamai network.",
                  "किसान कमाई नेटवर्कसोबत भागीदारीबद्दल चर्चा करण्यासाठी तुमची माहिती सबमिट करा."
                )}
              </p>
            </div>

            <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
              {error ? (
                <div className="rounded-xl border border-error/30 bg-error-container/25 px-4 py-3 text-sm font-medium text-error">
                  {error}
                </div>
              ) : null}
              {success ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {success}
                </div>
              ) : null}

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">business</span>
                  {langText("Business Details", "व्यवसाय तपशील")}
                </h3>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-on-surface">{langText("Company Name *", "कंपनीचे नाव *")}</span>
                    <input
                      className="h-12 w-full rounded-lg border border-outline bg-surface-container-lowest px-4 text-sm text-on-surface outline-none transition-shadow focus:border-primary focus:ring-1 focus:ring-primary"
                      name="organizationName"
                      placeholder="e.g. Mahila Vikas Agro"
                      type="text"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-on-surface">{langText("Partnership Type *", "भागीदारी प्रकार *")}</span>
                    <select
                      className="h-12 w-full rounded-lg border border-outline bg-surface-container-lowest px-4 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      defaultValue=""
                      name="partnerType"
                    >
                      <option value="" disabled>
                        {langText("Select Category", "प्रकार निवडा")}
                      </option>
                      <option value="Finance / NBFC">Finance / NBFC</option>
                      <option value="Equipment OEM / Dealer">Equipment OEM / Dealer</option>
                      <option value="Logistics / Transport">Logistics / Transport</option>
                      <option value="FPO / NGO">FPO / NGO</option>
                      <option value="Agri-Technology Integration">Agri-Technology Integration</option>
                      <option value="Other Strategic Alliance">Other Strategic Alliance</option>
                    </select>
                  </label>
                  <label className="space-y-1.5 md:col-span-2">
                    <span className="text-sm font-medium text-on-surface">
                      {langText("Operating Regions in Maharashtra *", "महाराष्ट्रातील कार्यक्षेत्र *")}
                    </span>
                    <input
                      className="h-12 w-full rounded-lg border border-outline bg-surface-container-lowest px-4 text-sm text-on-surface outline-none transition-shadow focus:border-primary focus:ring-1 focus:ring-primary"
                      name="businessLocation"
                      placeholder="e.g. Pune, Satara, Sangli districts"
                      type="text"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                  {langText("Contact Person", "संपर्क व्यक्ती")}
                </h3>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-on-surface">{langText("Full Name *", "पूर्ण नाव *")}</span>
                    <input
                      className="h-12 w-full rounded-lg border border-outline bg-surface-container-lowest px-4 text-sm text-on-surface outline-none transition-shadow focus:border-primary focus:ring-1 focus:ring-primary"
                      name="contactPerson"
                      placeholder="Your full name"
                      type="text"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-on-surface">{langText("Mobile Number *", "मोबाईल क्रमांक *")}</span>
                    <div className="flex">
                      <span className="flex items-center justify-center rounded-l-lg border border-r-0 border-outline bg-surface-container px-3 text-sm text-on-surface-variant">
                        +91
                      </span>
                      <input
                        className="h-12 w-full rounded-r-lg border border-outline bg-surface-container-lowest px-4 text-sm text-on-surface outline-none transition-shadow focus:border-primary focus:ring-1 focus:ring-primary"
                        name="phone"
                        placeholder="10-digit mobile number"
                        type="tel"
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">description</span>
                  {langText("Proposal Details", "प्रस्ताव तपशील")}
                </h3>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-on-surface">
                    {langText("Brief Description of Proposed Partnership *", "भागीदारी प्रस्तावाचे संक्षिप्त वर्णन *")}
                  </span>
                  <textarea
                    className="min-h-[160px] w-full rounded-lg border border-outline bg-surface-container-lowest p-4 text-sm text-on-surface outline-none transition-shadow focus:border-primary focus:ring-1 focus:ring-primary"
                    name="message"
                    placeholder="How do you envision working with Kisan Kamai? What value does it bring to the rural ecosystem?"
                  />
                </label>
              </div>

              <div className="flex justify-end border-t border-outline-variant pt-4">
                <button
                  className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-lg bg-primary-container px-8 py-3 text-base font-bold text-white shadow-md transition-colors hover:bg-primary"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? langText("Submitting...", "सबमिट करत आहे...") : langText("Submit Enquiry", "चौकशी सबमिट करा")}
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-6">
            <div className="kk-depth-tile rounded-xl border border-outline-variant bg-surface-container-low p-6 shadow-sm">
              <h3 className="text-lg font-bold text-on-surface">{langText("Why Partner With Us?", "आमच्यासोबत भागीदारी का?")}</h3>
              <div className="mt-4 space-y-4">
                {reasonsToPartner.map((reason) => (
                  <div key={reason.title} className="flex gap-3">
                    <span className="material-symbols-outlined mt-0.5 text-secondary">{reason.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{tr(reason.title)}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                        {tr(reason.description)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-on-surface-variant">
                <span className="material-symbols-outlined text-2xl">support_agent</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">{langText("Need immediate assistance?", "तातडीची मदत हवी आहे का?")}</h4>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {langText("Contact our corporate relations desk at", "आमच्या भागीदारी टीमशी संपर्क साधा")}{" "}
                  <a className="font-semibold text-primary hover:underline" href={supportContact.emailHref}>
                    {supportContact.email}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
