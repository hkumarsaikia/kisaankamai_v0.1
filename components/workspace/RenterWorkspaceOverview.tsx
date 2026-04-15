"use client";

import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";

type BookingSummary = {
  id: string;
  status: string;
  amount: number;
  startDate: string;
  endDate: string;
  listing?: { name?: string | null; coverImage?: string | null; district?: string | null } | null;
  ownerProfile?: { fullName?: string | null } | null;
};

type SavedListingSummary = {
  id: string;
  name: string;
  coverImage: string;
  categoryLabel: string;
  pricePerHour: number;
};

type PaymentSummary = {
  id: string;
  amount: number;
  method: string;
  status: string;
  bookingId: string;
};

export function RenterWorkspaceOverview({
  renterName,
  bookings,
  payments,
  savedListings,
}: {
  renterName: string;
  bookings: BookingSummary[];
  payments: PaymentSummary[];
  savedListings: SavedListingSummary[];
}) {
  const { langText } = useLanguage();
  const activeBookings = bookings.filter((booking) => booking.status === "active" || booking.status === "confirmed");
  const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-outline-variant bg-primary text-white shadow-[0_24px_60px_-36px_rgba(20,59,46,0.55)]">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6 p-7 md:p-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white/90">
              <span className="material-symbols-outlined text-base">agriculture</span>
              {langText("Renter dashboard", "भाडेकरी डॅशबोर्ड")}
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                {langText(`Good to see you, ${renterName}.`, `पुन्हा पाहून आनंद झाला, ${renterName}.`)}
              </h1>
              <p className="max-w-2xl text-sm font-medium leading-7 text-white/80 md:text-base">
                {langText(
                  "Track current jobs, saved equipment, and payment history from a cleaner renter workspace.",
                  "चालू कामे, जतन केलेली उपकरणे आणि पेमेंट इतिहास एका स्वच्छ भाडेकरी वर्कस्पेसमधून पाहा."
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/rent-equipment" className="kk-button-outline rounded-full border-white/15 bg-white text-primary hover:bg-primary-fixed">
                <span className="material-symbols-outlined text-[18px]">search</span>
                {langText("Browse equipment", "उपकरणे शोधा")}
              </Link>
              <Link href="/renter-profile/bookings" className="kk-button-outline rounded-full border-white/15 bg-white/10 text-white hover:bg-white/15">
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                {langText("Bookings", "बुकिंग")}
              </Link>
              <Link href="/renter-profile/payments" className="kk-button-outline rounded-full border-white/15 bg-white/10 text-white hover:bg-white/15">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                {langText("Payments", "पेमेंट्स")}
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10 bg-black/10 p-7 md:p-8 lg:border-l lg:border-t-0">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <MetricCard label={langText("Active bookings", "सक्रिय बुकिंग")} value={activeBookings.length} note={langText("Jobs in progress", "सध्या चालू कामे")} />
              <MetricCard label={langText("Saved listings", "जतन केलेली उपकरणे")} value={savedListings.length} note={langText("Ready to rebook later", "नंतर पुन्हा बुक करण्यासाठी तयार")} />
              <MetricCard label={langText("Total spent", "एकूण खर्च")} value={`₹${totalSpent.toLocaleString("en-IN")}`} note={langText(`${payments.length} payment records`, `${payments.length} पेमेंट नोंदी`)} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.4fr_0.95fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-primary">{langText("Active bookings", "सक्रिय बुकिंग")}</h2>
                <p className="text-sm font-medium text-on-surface-variant">
                  {langText("Current jobs and confirmations appear here first.", "सध्याची कामे आणि पुष्टीकरणे येथे आधी दिसतात.")}
                </p>
              </div>
              <Link href="/renter-profile/bookings" className="text-sm font-bold text-secondary hover:underline">
                {langText("View all", "सर्व पहा")}
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {activeBookings.slice(0, 2).map((booking) => (
                <article key={booking.id} className="overflow-hidden rounded-[1.5rem] border border-outline-variant bg-surface-container-low">
                  <div className="relative h-44">
                    <Image
                      src={booking.listing?.coverImage || "/assets/generated/hero_tractor.png"}
                      alt={booking.listing?.name || "Equipment"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                      {booking.status}
                    </span>
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="font-black text-primary">{booking.listing?.name || langText("Equipment", "उपकरण")}</h3>
                      <p className="text-xs font-medium text-on-surface-variant">
                        {booking.listing?.district || langText("Maharashtra", "महाराष्ट्र")}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-dashed border-outline-variant pt-3 text-xs font-semibold text-on-surface-variant">
                      <span>{booking.startDate} - {booking.endDate}</span>
                      <span className="font-black text-secondary">₹{booking.amount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-on-surface-variant">
                      <span>{booking.ownerProfile?.fullName || langText("Owner", "मालक")}</span>
                      <Link href="/support" className="font-bold text-secondary hover:underline">
                        {langText("Help", "मदत")}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
              {!activeBookings.length ? (
                <div className="rounded-[1.5rem] border border-dashed border-outline-variant p-6 text-sm text-on-surface-variant">
                  {langText(
                    "No active bookings yet. Browse equipment to start a new rental.",
                    "अद्याप सक्रिय बुकिंग नाहीत. नवीन भाडे सुरू करण्यासाठी उपकरणे पहा."
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-primary">{langText("Saved equipment", "जतन केलेली उपकरणे")}</h2>
                <p className="text-sm font-medium text-on-surface-variant">
                  {langText("Quickly reopen the listings you have already shortlisted.", "पूर्वी जतन केलेली लिस्टिंग पटकन पुन्हा उघडा.")}
                </p>
              </div>
              <Link href="/renter-profile/saved" className="text-sm font-bold text-secondary hover:underline">
                {langText("Open saved", "जतन केलेली उघडा")}
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {savedListings.slice(0, 3).map((item) => (
                <article key={item.id} className="overflow-hidden rounded-[1.5rem] border border-outline-variant bg-surface-container-low">
                  <div className="relative h-36">
                    <Image src={item.coverImage} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-secondary">{item.categoryLabel}</p>
                      <h3 className="font-black text-primary">{item.name}</h3>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-on-surface-variant">₹{item.pricePerHour}/hr</span>
                      <Link href="/booking" className="font-black text-secondary hover:underline">
                        {langText("Book", "बुक करा")}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
              {!savedListings.length ? (
                <div className="rounded-[1.5rem] border border-dashed border-outline-variant p-6 text-sm text-on-surface-variant">
                  {langText("Save equipment from browse pages to see it here.", "हे पाहण्यासाठी ब्राउझ पेजवरून उपकरणे जतन करा.")}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
              {langText("Recent payments", "अलीकडील पेमेंट्स")}
            </h2>
            <div className="mt-5 space-y-3">
              {payments.slice(0, 4).map((payment) => (
                <div key={payment.id} className="rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-primary">{payment.bookingId}</p>
                      <p className="text-xs font-medium text-on-surface-variant">{payment.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-secondary">₹{payment.amount.toLocaleString("en-IN")}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{payment.status}</p>
                    </div>
                  </div>
                </div>
              ))}
              {!payments.length ? (
                <p className="text-sm text-on-surface-variant">{langText("No payment records yet.", "अद्याप पेमेंट नोंदी नाहीत.")}</p>
              ) : null}
            </div>
          </section>

          <section className="overflow-hidden rounded-[2rem] border border-outline-variant bg-secondary text-white shadow-[0_22px_50px_-28px_rgba(147,74,36,0.55)]">
            <div className="relative p-6">
              <span className="material-symbols-outlined absolute -right-3 -bottom-2 text-[6rem] text-white/10">support_agent</span>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary-fixed">
                {langText("Need help?", "मदत हवी आहे?")}
              </p>
              <h3 className="mt-3 text-xl font-black">
                {langText("Support is ready when you need it.", "मदत कधीही तयार आहे.")}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-secondary-fixed">
                {langText(
                  "Use support for booking questions, payment issues, or help finding equipment.",
                  "बुकिंग प्रश्न, पेमेंट समस्या किंवा उपकरण शोधण्यासाठी सपोर्ट वापरा."
                )}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/support" className="rounded-full bg-white px-4 py-3 text-center text-sm font-black text-secondary transition-colors hover:bg-secondary-fixed">
                  {langText("Contact support", "सपोर्टशी संपर्क")}
                </Link>
                <Link href="/rent-equipment" className="rounded-full border border-white/20 bg-white/10 px-4 py-3 text-center text-sm font-black text-white transition-colors hover:bg-white/15">
                  {langText("Browse equipment", "उपकरणे शोधा")}
                </Link>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: number | string;
  note: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">{label}</p>
      <div className="mt-2 text-2xl font-black tracking-tight">{value}</div>
      <p className="mt-1 text-xs font-semibold text-white/70">{note}</p>
    </div>
  );
}
