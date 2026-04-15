import { AppLink } from "@/components/app-link";
import { Badge } from "@/components/ui/badge";
import { getLocale } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/auth";
import { listRenterBookings, listRenterPayments, listSavedListings } from "@/lib/server/repositories";
import { redirect } from "next/navigation";

const copy = {
  en: {
    eyebrow: "Renter workspace",
    title: "Saved listings, bookings, and payments",
    description: "Review the equipment you saved, the requests you sent, and the payment trail tied to your account.",
    familyTitle: "Workspace family",
    familyDescription: "Profile, settings, and payments remain reachable from the same dashboard.",
    profileTitle: "Profile",
    settingsTitle: "Settings",
    paymentsTitle: "Payments",
    savedTitle: "Saved equipment",
    bookingsTitle: "Bookings",
    paymentsCardTitle: "Payments",
  },
  mr: {
    eyebrow: "भाडेकरू कार्यक्षेत्र",
    title: "सेव्ह केलेल्या याद्या, बुकिंग्ज आणि पेमेंट्स",
    description: "तुम्ही सेव्ह केलेली उपकरणे, पाठवलेल्या विनंत्या आणि खात्याशी जोडलेला पेमेंट प्रवाह पाहा.",
    familyTitle: "कार्यक्षेत्र कुटुंब",
    familyDescription: "प्रोफाइल, सेटिंग्ज आणि पेमेंट्स एकाच उत्पादन पटलावर उपलब्ध राहतात.",
    profileTitle: "प्रोफाइल",
    settingsTitle: "सेटिंग्ज",
    paymentsTitle: "पेमेंट्स",
    savedTitle: "सेव्ह केलेली उपकरणे",
    bookingsTitle: "बुकिंग्ज",
    paymentsCardTitle: "पेमेंट्स",
  },
} as const;

export default async function RenterDashboardPage() {
  const [locale, session] = await Promise.all([getLocale(), getCurrentSession()]);
  if (!session) {
    redirect("/login");
  }

  const [savedListings, bookings, payments] = await Promise.all([
    listSavedListings(session.user.uid),
    listRenterBookings(session.user.uid),
    listRenterPayments(session.user.uid),
  ]);
  const page = copy[locale];
  const totalSpent = payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(16,185,129,0.1),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(249,115,22,0.08),_transparent_34%)]" />
      <div className="relative min-h-screen">
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-72 border-r border-slate-200 bg-white/95 backdrop-blur z-50 dark:border-slate-800 dark:bg-slate-950/95">
          <div className="px-6 py-8">
            <div className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-950 dark:text-white">
              <span className="material-symbols-outlined text-3xl text-brand-700 dark:text-brand-300">agriculture</span>
              Kisan Kamai
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{session.user.fullName}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {session.profile?.village || (locale === "mr" ? "प्रोफाइल नाही" : "No profile")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            <div className="flex items-center gap-3 rounded-xl bg-brand-50 px-4 py-3 font-bold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>dashboard</span>
              {locale === "mr" ? "डॅशबोर्ड" : "Dashboard"}
            </div>
            <AppLink href="/rent-equipment" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition hover:bg-slate-50 dark:hover:bg-slate-900">
              <span className="material-symbols-outlined">explore</span>
              {locale === "mr" ? "उपकरणे शोधा" : "Browse equipment"}
            </AppLink>
            <AppLink href="/support" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition hover:bg-slate-50 dark:hover:bg-slate-900">
              <span className="material-symbols-outlined">support_agent</span>
              {locale === "mr" ? "मदत" : "Support"}
            </AppLink>
            <AppLink href="/feedback" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition hover:bg-slate-50 dark:hover:bg-slate-900">
              <span className="material-symbols-outlined">feedback</span>
              {locale === "mr" ? "अभिप्राय" : "Feedback"}
            </AppLink>
          </nav>
        </aside>

        <div className="lg:ml-72">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-950 dark:text-white">{page.title}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">{page.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="accent">{session.user.fullName}</Badge>
                <Badge variant="success">{locale === "mr" ? "भाडेकरू" : "Renter"}</Badge>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="grid gap-6">
                <div className="kk-card">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-black">{locale === "mr" ? "सक्रिय बुकिंग्ज" : "Active bookings"}</h2>
                    <Badge variant="accent">{bookings.length}</Badge>
                  </div>
                  <div className="mt-4 space-y-4">
                    {bookings.length ? (
                      bookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="rounded-[1.25rem] border border-slate-200 p-4 dark:border-slate-800">
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{booking.status}</p>
                          <h3 className="mt-2 text-lg font-black text-slate-950 dark:text-white">{booking.listingName}</h3>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{booking.fieldLocation}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-300">{locale === "mr" ? "अजून कोणतीही बुकिंग नाही." : "No bookings yet."}</p>
                    )}
                  </div>
                </div>

                <div className="kk-card">
                  <h2 className="text-xl font-black">{page.familyTitle}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{page.familyDescription}</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{page.profileTitle}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {session.profile ? session.profile.village : locale === "mr" ? "प्रोफाइल उपलब्ध नाही" : "No profile loaded"}
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{page.settingsTitle}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {locale === "mr" ? "भाषा, थीम आणि मदत" : "Language, theme, and support"}
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{page.paymentsTitle}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {locale === "mr" ? "बुकिंगशी जोडलेला payment trail" : "Payment trail tied to bookings"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="kk-card">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-black">{page.savedTitle}</h2>
                    <Badge variant="accent">{savedListings.length}</Badge>
                  </div>
                  <div className="mt-4 space-y-4">
                    {savedListings.length ? (
                      savedListings.slice(0, 3).map((listing) => (
                        <div key={listing.id} className="rounded-[1.25rem] border border-slate-200 p-4 dark:border-slate-800">
                          <h3 className="text-lg font-black text-slate-950 dark:text-white">{listing.name}</h3>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            {listing.location}, {listing.district}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-300">{locale === "mr" ? "अजून कोणतीही सेव्ह केलेली यादी नाही." : "No saved listings yet."}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="kk-card">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-black">{page.bookingsTitle}</h2>
                    <Badge variant="accent">{bookings.length}</Badge>
                  </div>
                  <div className="mt-4 space-y-4">
                    {bookings.length ? (
                      bookings.slice(0, 4).map((booking) => (
                        <div key={booking.id} className="rounded-[1.25rem] border border-slate-200 p-4 dark:border-slate-800">
                          <h3 className="text-lg font-black text-slate-950 dark:text-white">{booking.listingName}</h3>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{booking.fieldLocation}</p>
                          <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{booking.status}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-300">{locale === "mr" ? "अजून कोणतीही बुकिंग नाही." : "No bookings yet."}</p>
                    )}
                  </div>
                </div>

                <div className="kk-card">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-black">{page.paymentsCardTitle}</h2>
                    <Badge variant="success">{payments.length}</Badge>
                  </div>
                  <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">₹{totalSpent}</p>
                  <div className="mt-4 space-y-4">
                    {payments.length ? (
                      payments.slice(0, 4).map((payment) => (
                        <div key={payment.id} className="rounded-[1.25rem] border border-slate-200 p-4 dark:border-slate-800">
                          <p className="text-lg font-black text-slate-950 dark:text-white">₹{payment.amount}</p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{payment.method}</p>
                          <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{payment.status}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-300">{locale === "mr" ? "अजून कोणतेही पेमेंट नाही." : "No payments yet."}</p>
                    )}
                  </div>
                </div>

                <div className="kk-card">
                  <h2 className="text-xl font-black">{locale === "mr" ? "सहाय्य आणि सेटिंग्ज" : "Support and settings"}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {locale === "mr"
                      ? "भाषा, मदत आणि खाते बदल एकाच पटलात ठेवले आहेत."
                      : "Language, support, and account controls stay inside this page."}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <AppLink href="/support" className="kk-button-secondary">
                      {locale === "mr" ? "मदत केंद्र" : "Support center"}
                    </AppLink>
                    <AppLink href="/feedback" className="kk-button-secondary">
                      {locale === "mr" ? "अभिप्राय" : "Feedback"}
                    </AppLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
