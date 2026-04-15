import { createListingAction } from "@/app/actions";
import { FormField, FormGrid, FormSection, FormShell } from "@/components/forms/FormKit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/auth";
import { redirect } from "next/navigation";

const copy = {
  en: {
    eyebrow: "Owner listing flow",
    title: "List your equipment for the marketplace",
    description: "Keep the same listing contract, but present it with a clearer, calmer publishing flow.",
    asideTitle: "Publishing checklist",
    asideBody:
      "Clear equipment names, location coverage, and media help renters trust the listing before they request a booking.",
    basicsTitle: "Listing basics",
    basicsDescription: "These fields map directly to the listing contract.",
    mediaTitle: "Description and media",
    mediaDescription: "Add the same description and media payload the action already expects.",
    name: "Equipment name",
    category: "Category",
    district: "District",
    location: "Location",
    price: "Price per hour",
    operator: "Operator included",
    descriptionField: "Description",
    images: "Images",
    submit: "Publish listing",
    statusTitle: "Ready to publish",
    statusBody: "The form stays connected to Firebase Auth, Firestore, and Storage only.",
  },
  mr: {
    eyebrow: "मालक नोंदणी प्रवाह",
    title: "बाजारपेठेत तुमची यंत्रसामग्री नोंदवा",
    description: "याच यादी कराराला जपत, प्रकाशन प्रवाह अधिक स्पष्ट आणि शांत ठेवा.",
    asideTitle: "प्रकाशन तपासणी सूची",
    asideBody:
      "उपकरणाचे स्पष्ट नाव, स्थान कव्हरेज आणि मीडिया मुळे बुकिंग मागण्यापूर्वी भाडेकरूला विश्वास मिळतो.",
    basicsTitle: "मूलभूत माहिती",
    basicsDescription: "ही फील्ड्स थेट यादी कराराशी जुळतात.",
    mediaTitle: "वर्णन आणि मीडिया",
    mediaDescription: "क्रियेला जी वर्णन आणि मीडिया माहिती अपेक्षित आहे, तीच जोडा.",
    name: "उपकरणाचे नाव",
    category: "श्रेणी",
    district: "जिल्हा",
    location: "ठिकाण",
    price: "प्रति तास किंमत",
    operator: "ऑपरेटर समाविष्ट",
    descriptionField: "वर्णन",
    images: "प्रतिमा",
    submit: "यादी प्रकाशित करा",
    statusTitle: "प्रकाशनासाठी तयार",
    statusBody: "हे फॉर्म फक्त Firebase Auth, Firestore आणि Storage शी जोडलेले राहते.",
  },
} as const;

export default async function ListEquipmentPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const [locale, session, params] = await Promise.all([getLocale(), getCurrentSession(), searchParams]);
  if (!session) {
    redirect("/login");
  }

  const page = copy[locale];

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(16,185,129,0.12),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(251,146,60,0.12),_transparent_32%)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700 dark:text-brand-300">{page.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-6xl">{page.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{page.description}</p>
        </div>

        {params?.message ? (
          <p className="mx-auto mt-8 max-w-3xl rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 dark:border-brand-900/40 dark:bg-brand-950/40 dark:text-brand-200">
            {params.message}
          </p>
        ) : null}

        <div className="mt-12 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <FormShell
            eyebrow={page.eyebrow}
            locale={locale}
            title={page.title}
            description={page.description}
            step={1}
            totalSteps={4}
            aside={
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-950 dark:text-slate-50">{page.asideTitle}</h3>
                <p className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">{page.asideBody}</p>
                <div className="rounded-[1.25rem] border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800 dark:border-brand-900/40 dark:bg-brand-950/40 dark:text-brand-200">
                  {page.statusTitle}: {page.statusBody}
                </div>
              </div>
            }
          >
            <form action={createListingAction} className="grid gap-5" encType="multipart/form-data">
              <FormSection title={page.basicsTitle} description={page.basicsDescription}>
                <FormGrid>
                  <FormField label={page.name} required>
                    <input className="kk-input" name="name" placeholder={page.name} required />
                  </FormField>
                  <FormField label={page.category} required>
                    <input className="kk-input" name="category" placeholder={page.category} required />
                  </FormField>
                  <FormField label={page.district} required>
                    <input className="kk-input" name="district" placeholder={page.district} required />
                  </FormField>
                  <FormField label={page.location} required>
                    <input className="kk-input" name="location" placeholder={page.location} required />
                  </FormField>
                  <FormField label={page.price} required>
                    <input className="kk-input" type="number" min="1" step="1" name="pricePerHour" placeholder="800" required />
                  </FormField>
                  <FormField label={page.operator}>
                    <div className="kk-form-subtle flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <input type="checkbox" name="operatorIncluded" className="rounded border-slate-300" />
                      {page.operator}
                    </div>
                  </FormField>
                </FormGrid>
              </FormSection>

              <FormSection title={page.mediaTitle} description={page.mediaDescription}>
                <div className="grid gap-5">
                  <FormField label={page.descriptionField} required>
                    <textarea
                      className="kk-input min-h-[150px]"
                      name="description"
                      placeholder={
                        locale === "mr"
                          ? "यंत्रसामग्री, स्थिती आणि कामाचे कव्हरेज वर्णन करा"
                          : "Describe the machine, condition, and work coverage"
                      }
                      required
                    />
                  </FormField>
                  <FormField label={page.images}>
                    <input className="kk-input" type="file" name="images" accept="image/*" multiple />
                  </FormField>
                  <div className="flex justify-end">
                    <Button type="submit">{page.submit}</Button>
                  </div>
                </div>
              </FormSection>
            </form>
          </FormShell>

          <div className="grid gap-6">
            <div className="kk-card">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-black">{locale === "mr" ? "प्रकाशन स्थिती" : "Publishing status"}</h2>
                <Badge variant="accent">{locale === "mr" ? "मसुदा" : "Draft"}</Badge>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.25rem] bg-slate-100 p-4 dark:bg-slate-800">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {locale === "mr" ? "पायरी 1" : "Step 1"}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {locale === "mr" ? "मूलभूत माहिती पूर्ण करा" : "Complete the basic details"}
                  </p>
                </div>
                <div className="rounded-[1.25rem] bg-slate-100 p-4 dark:bg-slate-800">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {locale === "mr" ? "पायरी 2" : "Step 2"}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {locale === "mr" ? "प्रतिमा आणि वर्णन जोडा" : "Add media and description"}
                  </p>
                </div>
                <div className="rounded-[1.25rem] bg-slate-100 p-4 dark:bg-slate-800">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {locale === "mr" ? "पायरी 3" : "Step 3"}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {locale === "mr" ? "किंमत आणि उपलब्धता तपासा" : "Review pricing and availability"}
                  </p>
                </div>
                <div className="rounded-[1.25rem] bg-slate-100 p-4 dark:bg-slate-800">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {locale === "mr" ? "पायरी 4" : "Step 4"}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {locale === "mr" ? "प्रकाशित करून Firestore मध्ये पाठवा" : "Publish and send to Firestore"}
                  </p>
                </div>
              </div>
            </div>
            <div className="kk-card">
              <h2 className="text-xl font-black">{locale === "mr" ? "प्रसिद्धी टिप्स" : "Publishing tips"}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <li>{locale === "mr" ? "• स्पष्ट नाव आणि श्रेणी वापरा." : "• Use a clear name and category."}</li>
                <li>{locale === "mr" ? "• जिल्हा आणि location नेहमी जुळवा." : "• Keep district and location accurate."}</li>
                <li>{locale === "mr" ? "• चांगल्या प्रतिमा रेंटरचा विश्वास वाढवतात." : "• Good images improve renter trust."}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
