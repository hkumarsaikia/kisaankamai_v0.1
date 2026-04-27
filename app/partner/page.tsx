"use client";

import { SubmissionError, postJson } from "@/lib/client/forms";
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

const nextSteps = [
  {
    step: "1",
    title: "Submission Review",
    description: "Our strategic team reviews your proposal within 2-3 business days.",
  },
  {
    step: "2",
    title: "Introductory Call",
    description: "If aligned, we schedule a brief call to understand mutual synergies.",
  },
  {
    step: "3",
    title: "Pilot Planning",
    description: "Develop a localized pilot integration plan for targeted districts.",
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

export default function PartnerPage() {
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
          "Please complete the enquiry form correctly."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await postJson("/api/forms/partner-inquiry", parsed.data);
      setSuccess("Enquiry received. Our partnership team will contact you within 24 hours.");
      event.currentTarget.reset();
    } catch (submitError) {
      if (submitError instanceof SubmissionError) {
        setError(submitError.message);
      } else {
        setError("Could not submit your enquiry right now.");
      }
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
          <div className="kk-dark-image-overlay" />
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-4xl font-black tracking-[-0.03em] md:text-5xl lg:text-6xl">
              Expand Agricultural Access in Maharashtra
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-fixed md:text-lg">
              Join the trusted network revolutionizing rural agriculture. We connect farmers with
              high-quality equipment, financing, and support across Western Maharashtra.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#enquiry-form"
                className="kk-deep-cta inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-bold"
              >
                Apply for Partnership
              </a>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/80 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-white/10"
              >
                Explore Ecosystem
              </Link>
            </div>
          </div>
        </section>

        <section className="px-1 py-16" id="ecosystem">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
              The Kisan Kamai Ecosystem
            </h2>
            <p className="mt-4 text-base leading-relaxed text-on-surface-variant md:text-lg">
              We are building a robust network to support modern farming. Partner with us to
              deliver value directly to rural equipment owners and farming communities.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {ecosystemCards.map((card) => (
              <article
                key={card.title}
                className="rounded-xl border border-outline-variant/40 bg-surface-container-low p-8 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-lg ${card.bgClass} ${card.colorClass}`}>
                  <span className="material-symbols-outlined text-3xl">{card.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{card.description}</p>
                <ul className="mt-6 space-y-2">
                  {card.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2 text-sm text-on-surface">
                      <span className={`material-symbols-outlined text-sm ${card.colorClass}`}>check_circle</span>
                      {highlight}
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
                Premium Partnership Enquiry
              </h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Submit your details to discuss strategic integration with the Kisan Kamai network.
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
                  Business Details
                </h3>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-on-surface">Company Name *</span>
                    <input
                      className="h-12 w-full rounded-lg border border-outline bg-surface-container-lowest px-4 text-sm text-on-surface outline-none transition-shadow focus:border-primary focus:ring-1 focus:ring-primary"
                      name="organizationName"
                      placeholder="e.g. Mahila Vikas Agro"
                      type="text"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-on-surface">Partnership Type *</span>
                    <select
                      className="h-12 w-full rounded-lg border border-outline bg-surface-container-lowest px-4 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      defaultValue=""
                      name="partnerType"
                    >
                      <option value="" disabled>
                        Select Category
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
                      Operating Regions in Maharashtra *
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
                  Contact Person
                </h3>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-on-surface">Full Name *</span>
                    <input
                      className="h-12 w-full rounded-lg border border-outline bg-surface-container-lowest px-4 text-sm text-on-surface outline-none transition-shadow focus:border-primary focus:ring-1 focus:ring-primary"
                      name="contactPerson"
                      placeholder="Your full name"
                      type="text"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-on-surface">Mobile Number *</span>
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
                  Proposal Details
                </h3>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-on-surface">
                    Brief Description of Proposed Partnership *
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
                  {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-primary-fixed-dim/30 bg-primary-container p-6 text-white shadow-sm">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  rule_folder
                </span>
                Next Steps
              </h3>
              <ol className="relative mt-5 space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-primary-fixed-dim/30 before:content-['']">
                {nextSteps.map((step) => (
                  <li key={step.step} className="relative z-10 flex gap-4">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-fixed text-xs font-bold text-primary">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-base font-bold">{step.title}</h4>
                      <p className="mt-1 text-sm text-primary-fixed-dim">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl border border-outline-variant bg-surface-container-low p-6 shadow-sm">
              <h3 className="text-lg font-bold text-on-surface">Why Partner With Us?</h3>
              <div className="mt-4 space-y-4">
                {reasonsToPartner.map((reason) => (
                  <div key={reason.title} className="flex gap-3">
                    <span className="material-symbols-outlined mt-0.5 text-secondary">{reason.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{reason.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                        {reason.description}
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
                <h4 className="text-sm font-bold text-on-surface">Need immediate assistance?</h4>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Contact our corporate relations desk at{" "}
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
