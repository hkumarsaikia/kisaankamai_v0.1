import { AppLink } from "@/components/app-link";
import { submitFeedbackAction } from "@/app/actions";
import { FormField, FormGrid, FormShell } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n";

const copy = {
  en: {
    eyebrow: "Feedback",
    title: "Share feedback for the app",
    description: "Tell us what is working, what is not, and what should change next.",
    asideTitle: "How feedback is used",
    asideBody: "Feedback is reviewed alongside support requests so the team can prioritize the right fixes.",
    formTitle: "Send your feedback",
    formDescription: "Use the same fields every time so the payload stays predictable.",
    fullName: "Full name",
    contact: "Phone or email",
    topic: "Topic",
    subject: "Subject",
    message: "Detailed message",
    rating: "Overall rating",
    followUp: "Please contact me if clarification is needed",
    submit: "Submit feedback",
  },
  mr: {
    eyebrow: "अभिप्राय",
    title: "अॅपसाठी अभिप्राय द्या",
    description: "काय चांगले आहे, काय नाही, आणि पुढे काय बदलावे ते सांगा.",
    asideTitle: "अभिप्राय कशासाठी वापरला जातो",
    asideBody:
      "अभिप्राय मदत विनंत्यांसोबत पाहिला जातो, त्यामुळे टीम योग्य सुधारणा प्राधान्याने करू शकते.",
    formTitle: "तुमचा अभिप्राय पाठवा",
    formDescription: "माहितीची रचना अंदाजे राहावी म्हणून प्रत्येक वेळी हीच फील्ड्स वापरा.",
    fullName: "पूर्ण नाव",
    contact: "फोन किंवा ईमेल",
    topic: "विषय",
    subject: "शीर्षक",
    message: "सविस्तर संदेश",
    rating: "एकूण गुणांकन",
    followUp: "स्पष्टीकरण हवे असल्यास कृपया संपर्क करा",
    submit: "अभिप्राय पाठवा",
  },
} as const;

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const [locale, params] = await Promise.all([getLocale(), searchParams]);
  const page = copy[locale];

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(43,157,109,0.12),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.08),_transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(2,37,26,0.08),_transparent_30%)]" />

      <section className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/30 bg-white/80 px-5 py-3 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
          <div className="text-xl font-black tracking-tight text-slate-950 dark:text-white">Kisan Kamai</div>
          <div className="flex items-center gap-3">
            <AppLink href="/support" className="rounded-full border border-brand-700 px-4 py-2 text-sm font-bold text-brand-700 transition hover:bg-brand-50 dark:border-brand-300 dark:text-brand-300 dark:hover:bg-brand-950/40">
              {locale === "mr" ? "मदत" : "Support"}
            </AppLink>
            <AppLink href="/register" className="rounded-full bg-brand-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600">
              {locale === "mr" ? "खाते तयार करा" : "Create account"}
            </AppLink>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700 dark:text-brand-300">{page.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-6xl">{page.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{page.description}</p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
              <h2 className="text-xl font-black text-slate-950 dark:text-slate-50">{page.asideTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{page.asideBody}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900/85">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{locale === "mr" ? "फायरस्टोअर" : "Firestore"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {locale === "mr" ? "प्रत्येक अभिप्राय सुरक्षित नोंद म्हणून जमा होतो." : "Every feedback entry is stored as a secure record."}
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900/85">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{locale === "mr" ? "पुनरावलोकन" : "Review"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {locale === "mr" ? "अभिप्राय मदत विनंत्यांसह प्राधान्याने पाहिला जातो." : "Feedback is reviewed alongside support requests."}
                </p>
              </div>
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
                <p className="rounded-[1.25rem] border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800 dark:border-brand-900/40 dark:bg-brand-950/40 dark:text-brand-200">
                  {locale === "mr" ? "तुम्ही काहीही दिले तरी ते त्याच सुरक्षित नोंद प्रवाहात राहते." : "Whatever you send stays inside the same secure record flow."}
                </p>
              </div>
            }
          >
            {params?.message ? <div className="kk-form-banner mb-6">{params.message}</div> : null}
            <form action={submitFeedbackAction} className="grid gap-5">
              <FormGrid>
                <FormField label={page.fullName} required>
                  <input className="kk-input" name="fullName" placeholder={page.fullName} required />
                </FormField>
                <FormField label={page.contact} required>
                  <input className="kk-input" name="contact" placeholder={locale === "mr" ? "फोन किंवा ईमेल" : "Phone or email"} required />
                </FormField>
              </FormGrid>
              <FormGrid>
                <FormField label={page.topic} required>
                  <input className="kk-input" name="topic" placeholder={locale === "mr" ? "उदा. नोंदणी" : "e.g. Registration"} required />
                </FormField>
                <FormField label={page.subject} required>
                  <input className="kk-input" name="subject" placeholder={locale === "mr" ? "संक्षिप्त शीर्षक" : "Brief subject"} required />
                </FormField>
              </FormGrid>
              <FormField label={page.rating} required>
                <input className="kk-input" name="rating" type="number" min="1" max="5" step="1" defaultValue={5} required />
              </FormField>
              <FormField label={page.message} required>
                <textarea
                  className="kk-input min-h-[180px]"
                  name="message"
                  placeholder={locale === "mr" ? "तुमचा अनुभव सविस्तर लिहा" : "Describe your experience in detail"}
                  required
                />
              </FormField>
              <label className="kk-form-subtle flex items-start gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <input type="checkbox" name="followUp" className="mt-1 rounded border-slate-300" />
                <span>{page.followUp}</span>
              </label>
              <div className="flex justify-end">
                <Button type="submit">{page.submit}</Button>
              </div>
            </form>
          </FormShell>
        </div>
      </section>
    </main>
  );
}
