import { AppLink } from "@/components/app-link";
import { submitSupportAction } from "@/app/actions";
import { FormField, FormGrid, FormShell } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n";

const copy = {
  en: {
    eyebrow: "Support & Help Center",
    title: "Reach the help desk",
    description: "Send a support request and we will keep it tied to your account record.",
    asideTitle: "How it works",
    asideBody:
      "Support requests are stored centrally so they can be reviewed alongside the matching account and booking context.",
    formTitle: "Tell us what happened",
    formDescription: "All fields are required. Keep the message short, clear, and actionable.",
    fullName: "Full name",
    phone: "Phone",
    category: "Category",
    message: "Message",
    submit: "Submit support request",
  },
  mr: {
    eyebrow: "मदत केंद्र",
    title: "सहाय्य केंद्राशी संपर्क करा",
    description: "सपोर्ट विनंती पाठवा; ती तुमच्या खाते नोंदीशी जोडलेली राहील.",
    asideTitle: "हे कसे चालते",
    asideBody:
      "सपोर्ट विनंत्या एकत्रितपणे साठवल्या जातात, त्यामुळे त्यांचा खाते आणि बुकिंग संदर्भासह आढावा घेता येतो.",
    formTitle: "काय घडले ते कळवा",
    formDescription: "सर्व फील्ड आवश्यक आहेत. संदेश थोडक्यात, स्पष्ट आणि कृतीयोग्य ठेवा.",
    fullName: "पूर्ण नाव",
    phone: "फोन",
    category: "श्रेणी",
    message: "संदेश",
    submit: "मदत विनंती पाठवा",
  },
} as const;

export default async function SupportPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const [locale, params] = await Promise.all([getLocale(), searchParams]);
  const page = copy[locale];

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(43,157,109,0.12),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.1),_transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(2,37,26,0.08),_transparent_30%)]" />

      <section className="relative overflow-hidden pt-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="text-xl font-black tracking-tight text-slate-950 dark:text-white">Kisan Kamai</div>
          <div className="flex items-center gap-3">
            <AppLink href="/login" className="rounded-full border border-brand-700 px-4 py-2 text-sm font-bold text-brand-700 transition hover:bg-brand-50 dark:border-brand-300 dark:text-brand-300 dark:hover:bg-brand-950/40">
              {locale === "mr" ? "साइन इन" : "Sign in"}
            </AppLink>
            <AppLink href="/register" className="rounded-full bg-brand-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600">
              {locale === "mr" ? "खाते तयार करा" : "Create account"}
            </AppLink>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700 dark:text-brand-300">{page.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-6xl">{page.title}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{page.description}</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: locale === "mr" ? "खाते आणि लॉगिन" : "Account & Login",
                body:
                  locale === "mr"
                    ? "पासवर्ड, प्रोफाइल आणि पडताळणी सेटिंग्ज सांभाळा."
                    : "Manage password, profile, and verification settings.",
                icon: "account_circle",
              },
              {
                title: locale === "mr" ? "यादी आणि उपकरणे" : "Listing & Equipment",
                body:
                  locale === "mr"
                    ? "यंत्रसामग्री जोडणे आणि उपलब्धता व्यवस्थापन."
                    : "Help with adding machinery and managing availability.",
                icon: "agriculture",
              },
              {
                title: locale === "mr" ? "विश्वास आणि सुरक्षा" : "Trust & Safety",
                body:
                  locale === "mr"
                    ? "पडताळणी, सुरक्षा टिपा आणि वाद निवारण."
                    : "Verification, safety tips, and dispute resolution.",
                icon: "verified_user",
              },
              {
                title: locale === "mr" ? "संपर्क समर्थन" : "Contact support",
                body:
                  locale === "mr"
                    ? "कठीण समस्यांसाठी आमच्या एजंटशी बोला."
                    : "Reach our human agents for complex issues.",
                icon: "contact_support",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-surface-container-low px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <h2 className="text-2xl font-black text-brand-700 dark:text-brand-300">{locale === "mr" ? "लोकप्रिय विषय" : "Popular topics"}</h2>
            <div className="space-y-4">
              {[
                locale === "mr" ? "प्रोफाइल कशी पूर्ण करावी" : "How to complete profile setup",
                locale === "mr" ? "जवळची उपकरणे शोधणे" : "Finding equipment near you",
                locale === "mr" ? "संशयास्पद हालचालींची तक्रार" : "Reporting suspicious activity",
                locale === "mr" ? "पेमेंट पद्धती आणि सुरक्षा" : "Payment methods and security",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white p-4 shadow-soft dark:bg-slate-900">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black text-brand-700 dark:text-brand-300">{locale === "mr" ? "वारंवार विचारले जाणारे प्रश्न" : "FAQs"}</h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  q: locale === "mr" ? "मी उपकरणे कशी भाड्याने घेऊ शकतो?" : "How do I rent equipment on Kisan Kamai?",
                  a:
                    locale === "mr"
                      ? "श्रेणी ब्राउझ करा, स्थान निवडा, उपलब्ध यादी पहा, आणि बुकिंग विनंती पाठवा."
                      : "Browse categories, select your location, view available listings, and send a booking request.",
                },
                {
                  q: locale === "mr" ? "माझे पेमेंट सुरक्षित आहे का?" : "Is my payment secure?",
                  a:
                    locale === "mr"
                      ? "होय, एन्क्रिप्टेड गेटवे आणि एस्क्रो-आधारित प्रवाह वापरला जातो."
                      : "Yes, encrypted gateways and an escrow-based flow are used.",
                },
                {
                  q: locale === "mr" ? "मालकाची पडताळणी कशी करावी?" : "How do I verify a machinery owner?",
                  a:
                    locale === "mr"
                      ? "प्रोफाइलवरील Verified बॅज पहा. आम्ही ओळख आणि पत्त्याचे पुरावे तपासतो."
                      : 'Look for the Verified badge. Identity and address proofs are checked.',
                },
              ].map((item) => (
                <div key={item.q} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                    <h3 className="text-sm font-black text-slate-950 dark:text-white">{item.q}</h3>
                  </div>
                  <div className="px-5 py-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] bg-primary-container p-8 text-white shadow-soft">
              <h2 className="text-3xl font-black">{locale === "mr" ? "आम्हाला थेट कळवा" : "Report a concern"}</h2>
              <p className="mt-3 text-sm leading-7 text-white/80">
                {locale === "mr"
                  ? "सुरक्षेशी संबंधित समस्या, संशयास्पद यादी, किंवा वापरातील अडचणी आम्हाला सांगा."
                  : "Tell us about safety issues, suspicious listings, or operational problems."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: locale === "mr" ? "वापरकर्ता तक्रार" : "Report a user", icon: "person_cancel" },
                { title: locale === "mr" ? "यादी तक्रार" : "Report a listing", icon: "block" },
                { title: locale === "mr" ? "सुरक्षा समस्या" : "Safety issue", icon: "gpp_maybe" },
                { title: locale === "mr" ? "पेमेंट प्रश्न" : "Payment question", icon: "payments" },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                  <span className="material-symbols-outlined text-brand-700 dark:text-brand-300">{item.icon}</span>
                  <h3 className="mt-4 text-sm font-black text-slate-950 dark:text-white">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>

          <FormShell
            eyebrow={page.eyebrow}
            locale={locale}
            title={page.formTitle}
            description={page.formDescription}
            aside={
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-950 dark:text-slate-50">{page.asideTitle}</h3>
                <p className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">{page.asideBody}</p>
                <div className="rounded-[1.25rem] border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800 dark:border-brand-900/40 dark:bg-brand-950/40 dark:text-brand-200">
                  {locale === "mr" ? "तुमची विनंती योग्य नोंद प्रवाहातच राहते." : "Your request stays inside the same record flow."}
                </div>
              </div>
            }
          >
            {params?.message ? <div className="kk-form-banner mb-6">{params.message}</div> : null}
            <form action={submitSupportAction} className="grid gap-5">
              <FormGrid>
                <FormField label={page.fullName} required>
                  <input className="kk-input" name="fullName" placeholder={page.fullName} required />
                </FormField>
                <FormField label={page.phone} required>
                  <input className="kk-input" name="phone" placeholder="+91XXXXXXXXXX" required />
                </FormField>
              </FormGrid>
              <FormField label={page.category} required>
                <input className="kk-input" name="category" placeholder={page.category} required />
              </FormField>
              <FormField label={page.message} required>
                <textarea className="kk-input min-h-[180px]" name="message" placeholder={locale === "mr" ? "काय मदत हवी आहे?" : "How can we help?"} required />
              </FormField>
              <div className="flex justify-end">
                <Button type="submit">{page.submit}</Button>
              </div>
            </form>
          </FormShell>
        </div>
      </section>

      <section className="relative px-6 pb-20">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-brand-200 bg-brand-50 px-8 py-10 text-center shadow-soft dark:border-brand-900/40 dark:bg-brand-950/30">
          <h2 className="text-3xl font-black text-slate-950 dark:text-white">{locale === "mr" ? "अजूनही मदत हवी आहे?" : "Still need help?"}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {locale === "mr"
              ? "फोन, ईमेल, किंवा फॉर्ममधून आम्हाला संपर्क करा. आम्ही चालू उत्पादन प्रवाहाशी सुसंगत राहून उत्तर देऊ."
              : "Contact us by phone, email, or the form. We respond in line with the current production story."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <AppLink href="#form" className="rounded-full bg-brand-700 px-5 py-3 text-sm font-black text-white transition hover:bg-brand-600">
              {locale === "mr" ? "फॉर्मकडे जा" : "Jump to form"}
            </AppLink>
            <AppLink href="/feedback" className="rounded-full border border-brand-700 px-5 py-3 text-sm font-black text-brand-700 transition hover:bg-brand-50 dark:border-brand-300 dark:text-brand-300">
              {locale === "mr" ? "अभिप्राय पाठवा" : "Send feedback"}
            </AppLink>
          </div>
        </div>
      </section>
    </main>
  );
}
