import { logoutAction, selectWorkspaceAction } from "@/app/actions";
import { AppLink } from "@/components/app-link";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/auth";
import { redirect } from "next/navigation";

const copy = {
  en: {
    eyebrow: "Authenticated",
    title: "Choose your workspace",
    description: "Signed in as {name}. Select the workspace that should open first. You can switch later.",
    renterLabel: "Browse + book",
    renterTitle: "Renter",
    renterBody: "Browse equipment, save listings, and submit booking requests across the service area.",
    renterButton: "Enter renter dashboard",
    ownerLabel: "List + manage",
    ownerTitle: "Owner",
    ownerBody: "Manage listings, review renter demand, and track payments from one dashboard.",
    ownerButton: "Enter owner dashboard",
    browsePublic: "Browse public marketplace",
    logout: "Log out",
  },
  mr: {
    eyebrow: "प्रमाणीकरण झाले",
    title: "तुमचे कार्यक्षेत्र निवडा",
    description: "{name} म्हणून साइन इन केले आहे. प्रथम उघडायचे कार्यक्षेत्र निवडा. नंतर बदलता येईल.",
    renterLabel: "पहा + बुक करा",
    renterTitle: "भाडेकरू",
    renterBody: "सेवा क्षेत्रातील उपकरणे पाहा, याद्या सेव्ह करा आणि बुकिंग विनंत्या पाठवा.",
    renterButton: "भाडेकरू डॅशबोर्ड उघडा",
    ownerLabel: "यादी + व्यवस्थापन",
    ownerTitle: "मालक",
    ownerBody: "याद्या सांभाळा, भाडेकरू मागणी पहा आणि एका डॅशबोर्डमधून पेमेंट्स ट्रॅक करा.",
    ownerButton: "मालक डॅशबोर्ड उघडा",
    browsePublic: "सार्वजनिक बाजारपेठ पाहा",
    logout: "बाहेर पडा",
  },
} as const;

export default async function ProfileSelectionPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const [locale, session, params] = await Promise.all([getLocale(), getCurrentSession(), searchParams]);
  if (!session) {
    redirect("/login");
  }

  if (!session.profile) {
    redirect("/register");
  }

  const page = copy[locale];
  const description = page.description.replace("{name}", session.user.fullName);

  return (
    <main className="relative overflow-hidden px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(43,157,109,0.12),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.08),_transparent_32%)]" />
      <div className="relative mx-auto max-w-4xl">
        <div className="rounded-[2.2rem] border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700 dark:text-brand-300">{page.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white">{page.title}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p>
          {params?.message ? (
            <p className="mt-4 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 dark:border-brand-900/40 dark:bg-brand-950/40 dark:text-brand-200">
              {params.message}
            </p>
          ) : null}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <form action={selectWorkspaceAction} className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <input type="hidden" name="workspace" value="renter" />
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{page.renterLabel}</p>
              <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{page.renterTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{page.renterBody}</p>
              <Button className="mt-6 w-full">{page.renterButton}</Button>
            </form>

            <form action={selectWorkspaceAction} className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <input type="hidden" name="workspace" value="owner" />
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{page.ownerLabel}</p>
              <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{page.ownerTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{page.ownerBody}</p>
              <Button className="mt-6 w-full">{page.ownerButton}</Button>
            </form>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <AppLink href="/rent-equipment" className="kk-button-secondary">
              {page.browsePublic}
            </AppLink>
            <form action={logoutAction}>
              <button className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-red-300 hover:text-red-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-red-700 dark:hover:text-red-300">
                {page.logout}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
