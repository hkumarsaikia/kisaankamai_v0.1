import { AppLink } from "@/components/app-link";
import { createListingAction } from "@/app/actions";
import { FormField, FormGrid } from "@/components/forms/FormKit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/auth";
import { listOwnerBookings, listOwnerListings, listOwnerPayments } from "@/lib/server/repositories";
import { redirect } from "next/navigation";

const copy = {
  en: {
    eyebrow: "Owner workspace",
    title: "Manage listings, requests, and payouts",
    description: "Review your inventory, bookings, and payments from one calm dashboard.",
    familyTitle: "Workspace family",
    familyDescription: "Profile, settings, and payments stay visible from the same dashboard.",
    profileTitle: "Profile",
    settingsTitle: "Settings",
    paymentsTitle: "Payments",
    publishTitle: "Add a new listing",
    publishDescription: "Use the same listing flow whenever you need to publish equipment.",
    name: "Equipment name",
    category: "Category",
    district: "District",
    location: "Location",
    price: "Price per hour",
    descriptionField: "Description",
    images: "Images",
    submit: "Publish listing",
  },
  mr: {
    eyebrow: "मालक कार्यक्षेत्र",
    title: "यादी, विनंत्या आणि पेआउट्स सांभाळा",
    description: "तुमची उत्पादन यादी, बुकिंग्ज आणि पेमेंट्स एका शांत डॅशबोर्डमध्ये पाहा.",
    familyTitle: "कार्यक्षेत्र कुटुंब",
    familyDescription: "प्रोफाइल, सेटिंग्ज आणि पेमेंट्स एकाच उत्पादन पटलावर दिसतात.",
    profileTitle: "प्रोफाइल",
    settingsTitle: "सेटिंग्ज",
    paymentsTitle: "पेमेंट्स",
    publishTitle: "नवीन यादी जोडा",
    publishDescription: "उपकरण प्रकाशित करायचे असेल तेव्हा हाच उत्पादन यादी प्रवाह वापरा.",
    name: "उपकरणाचे नाव",
    category: "श्रेणी",
    district: "जिल्हा",
    location: "ठिकाण",
    price: "प्रति तास किंमत",
    descriptionField: "वर्णन",
    images: "प्रतिमा",
    submit: "यादी प्रकाशित करा",
  },
} as const;

export default async function OwnerDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const [locale, session, params] = await Promise.all([getLocale(), getCurrentSession(), searchParams]);
  if (!session) {
    redirect("/login");
  }

  const [listings, bookings, payments] = await Promise.all([
    listOwnerListings(session.user.uid),
    listOwnerBookings(session.user.uid),
    listOwnerPayments(session.user.uid),
  ]);
  const page = copy[locale];
  const totalEarnings = payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(43,157,109,0.12),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.1),_transparent_34%)]" />
      <div className="relative min-h-screen">
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 border-r border-slate-200 bg-white/95 backdrop-blur z-40 dark:border-slate-800 dark:bg-slate-950/95">
          <div className="px-6 py-8">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-brand-700 dark:text-brand-300">agriculture</span>
              <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white">Kisan Kamai</span>
            </div>
          </div>
          <div className="px-4 mb-6">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-white">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight text-slate-950 dark:text-white">{session.user.fullName}</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {locale === "mr" ? "पुष्टीकृत भागीदार" : "Verified partner"}
                </span>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            <div className="flex items-center gap-3 rounded-xl bg-brand-50 px-4 py-3 font-bold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>calendar_today</span>
              <span className="text-sm font-medium">{locale === "mr" ? "बुकिंग्ज" : "Bookings"}</span>
            </div>
            <AppLink href="/list-equipment" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition hover:bg-slate-50 dark:hover:bg-slate-900">
              <span className="material-symbols-outlined">agriculture</span>
              <span className="text-sm font-medium">{locale === "mr" ? "माझी यादी" : "My equipment"}</span>
            </AppLink>
            <AppLink href="/support" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition hover:bg-slate-50 dark:hover:bg-slate-900">
              <span className="material-symbols-outlined">support_agent</span>
              <span className="text-sm font-medium">{locale === "mr" ? "मदत" : "Support"}</span>
            </AppLink>
            <AppLink href="/feedback" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition hover:bg-slate-50 dark:hover:bg-slate-900">
              <span className="material-symbols-outlined">feedback</span>
              <span className="text-sm font-medium">{locale === "mr" ? "अभिप्राय" : "Feedback"}</span>
            </AppLink>
          </nav>
          <div className="p-4 space-y-2 border-t border-slate-200 dark:border-slate-800">
            <AppLink href="/list-equipment" className="flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-600">
              <span className="material-symbols-outlined text-sm">add</span>
              {locale === "mr" ? "नवीन यादी" : "Add new listing"}
            </AppLink>
          </div>
        </aside>

        <div className="lg:ml-64">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{page.eyebrow}</p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">{page.title}</h1>
                <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{page.description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="accent">{session.user.fullName}</Badge>
                <Badge variant="success">{locale === "mr" ? "मालक" : "Owner"}</Badge>
              </div>
            </div>

            {params?.message ? (
              <p className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 dark:border-brand-900/40 dark:bg-brand-950/40 dark:text-brand-200">
                {params.message}
              </p>
            ) : null}

            <div className="mt-10 grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
              <div className="grid gap-6">
                <div className="kk-card">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-black">{locale === "mr" ? "क्षणिक मोजमाप" : "Live metrics"}</h2>
                    <Badge variant="accent">{locale === "mr" ? "लाइव्ह" : "Live"}</Badge>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {[
                      { label: locale === "mr" ? "याद्या" : "Listings", value: listings.length },
                      { label: locale === "mr" ? "बुकिंग्ज" : "Bookings", value: bookings.length },
                      { label: locale === "mr" ? "पेमेंट्स" : "Payments", value: payments.length },
                    ].map((metric) => (
                      <div key={metric.label} className="rounded-[1.25rem] bg-slate-100 p-4 dark:bg-slate-800">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{metric.label}</p>
                        <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{metric.value}</p>
                      </div>
                    ))}
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
                        {locale === "mr" ? "पेमेंट history आणि settlements" : "Payment history and settlements"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="kk-card">
                  <h2 className="text-xl font-black">{locale === "mr" ? "बुकिंग आढावा" : "Booking overview"}</h2>
                  <div className="mt-4 space-y-4">
                    {bookings.length ? (
                      bookings.slice(0, 2).map((booking) => (
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
              </div>

              <div className="grid gap-6">
                <div className="kk-card">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-black">{page.publishTitle}</h2>
                    <Badge variant="success">{locale === "mr" ? "नवीन" : "New"}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{page.publishDescription}</p>
                  <form action={createListingAction} className="mt-5 grid gap-5" encType="multipart/form-data">
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
                      <FormField label={locale === "mr" ? "ऑपरेटर" : "Operator"}>
                        <div className="kk-form-subtle flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          <input type="checkbox" name="operatorIncluded" className="rounded border-slate-300" />
                          {locale === "mr" ? "ऑपरेटर समाविष्ट" : "Operator included"}
                        </div>
                      </FormField>
                    </FormGrid>
                    <FormField label={page.descriptionField} required>
                      <textarea
                        className="kk-input min-h-[140px]"
                        name="description"
                        placeholder={locale === "mr" ? "यंत्र, स्थिती आणि कामाचे कव्हरेज वर्णन करा" : "Describe the machine, condition, and work coverage"}
                        required
                      />
                    </FormField>
                    <FormField label={page.images}>
                      <input className="kk-input" type="file" name="images" accept="image/*" multiple />
                    </FormField>
                    <div className="flex justify-end">
                      <Button type="submit">{page.submit}</Button>
                    </div>
                  </form>
                </div>

                <div className="kk-card">
                  <h2 className="text-xl font-black">{locale === "mr" ? "अलीकडील यादी" : "Recent listings"}</h2>
                  <div className="mt-4 space-y-4">
                    {listings.length ? (
                      listings.slice(0, 3).map((listing) => (
                        <div key={listing.id} className="rounded-[1.25rem] border border-slate-200 p-4 dark:border-slate-800">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-black text-slate-950 dark:text-white">{listing.name}</h3>
                              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                {listing.location}, {listing.district}
                              </p>
                            </div>
                            <Badge variant="success">{listing.status}</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-300">{locale === "mr" ? "अजून कोणतीही यादी नाही." : "No listings yet."}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
              <div className="kk-card">
                <h2 className="text-xl font-black">{locale === "mr" ? "कमाईचा आढावा" : "Earnings overview"}</h2>
                <p className="mt-3 text-4xl font-black text-slate-950 dark:text-white">₹{totalEarnings}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {locale === "mr" ? "नोंदवलेल्या पेमेंट्सवर आधारित एकूण कमाई." : "Total earnings based on recorded payments."}
                </p>
              </div>
              <div className="kk-card">
                <h2 className="text-xl font-black">{locale === "mr" ? "संपर्क मदत" : "Support"}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {locale === "mr"
                    ? "मार्गदर्शन, बुकिंग, किंवा यादी बदलांसाठी आमच्याशी संपर्क करा."
                    : "Contact us for guidance, bookings, or listing changes."}
                </p>
                <div className="mt-5 flex justify-start">
                  <AppLink href="/support" className="kk-button-secondary">
                    {locale === "mr" ? "मदत केंद्र" : "Support center"}
                  </AppLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
