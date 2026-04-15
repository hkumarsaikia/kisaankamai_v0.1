"use client";

import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";

type ListingSummary = {
  id: string;
  name: string;
  status: string;
  coverImage: string;
  location: string;
  district: string;
  pricePerHour: number;
};

type BookingSummary = {
  id: string;
  status: string;
  amount: number;
  startDate: string;
  endDate: string;
  listing?: { name?: string | null } | null;
  renterProfile?: { fullName?: string | null } | null;
};

type PaymentSummary = {
  id: string;
  status: string;
  amount: number;
};

export function OwnerWorkspaceOverview({
  ownerName,
  village,
  pincode,
  listings,
  bookings,
  payments,
}: {
  ownerName: string;
  village?: string | null;
  pincode?: string | null;
  listings: ListingSummary[];
  bookings: BookingSummary[];
  payments: PaymentSummary[];
}) {
  const { langText } = useLanguage();

  const activeListings = listings.filter((listing) => listing.status === "active");
  const pendingBookings = bookings.filter((booking) => booking.status === "pending");
  const revenueInFlow = payments
    .filter((payment) => payment.status === "paid" || payment.status === "processing")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const featuredListings = listings.slice(0, 2);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-lowest shadow-[0_24px_60px_-36px_rgba(20,59,46,0.45)]">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6 p-7 md:p-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary-container/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
              <span className="material-symbols-outlined text-base">dashboard</span>
              {langText("Owner dashboard", "मालक डॅशबोर्ड")}
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight text-primary dark:text-emerald-50 md:text-5xl">
                {langText(`Welcome back, ${ownerName}.`, `पुन्हा स्वागत आहे, ${ownerName}.`)}
              </h1>
              <p className="max-w-2xl text-sm font-medium leading-7 text-on-surface-variant md:text-base">
                {langText(
                  "Track active listings, approvals, and payouts from one polished workspace.",
                  "सक्रिय लिस्टिंग, मंजुरी आणि पेआउट्स एका स्वच्छ वर्कस्पेसमधून पाहा."
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/owner-registration" className="kk-button-outline rounded-full border-primary/20 bg-primary text-white hover:bg-primary-container">
                <span className="material-symbols-outlined text-[18px]">add</span>
                {langText("Add listing", "लिस्टिंग जोडा")}
              </Link>
              <Link href="/owner-profile/bookings" className="kk-button-outline rounded-full">
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                {langText("Bookings", "बुकिंग")}
              </Link>
              <Link href="/owner-profile/revenue" className="kk-button-outline rounded-full">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                {langText("Revenue", "कमाई")}
              </Link>
            </div>
          </div>

          <div className="border-t border-outline-variant bg-surface-container-low p-7 md:p-8 lg:border-l lg:border-t-0">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <MetricCard
                label={langText("Active listings", "सक्रिय लिस्टिंग")}
                value={activeListings.length}
                note={langText(`${listings.length} total listings`, `${listings.length} एकूण लिस्टिंग`)}
              />
              <MetricCard
                label={langText("Pending approvals", "प्रलंबित मंजुरी")}
                value={pendingBookings.length}
                note={langText("Requests waiting for review", "पुनरावलोकनासाठी वाट पाहणाऱ्या विनंत्या")}
              />
              <MetricCard
                label={langText("Revenue in flow", "प्रक्रियेत कमाई")}
                value={`₹${revenueInFlow.toLocaleString("en-IN")}`}
                note={langText(`${payments.length} payment records`, `${payments.length} पेमेंट नोंदी`)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-primary">{langText("Recent bookings", "अलीकडील बुकिंग")}</h2>
                <p className="text-sm font-medium text-on-surface-variant">
                  {langText("The newest approvals and active jobs are shown here.", "नवीन मंजुरी आणि सक्रिय कामे येथे दिसतात.")}
                </p>
              </div>
              <Link href="/owner-profile/bookings" className="text-sm font-bold text-secondary hover:underline">
                {langText("View all", "सर्व पहा")}
              </Link>
            </div>
            <div className="space-y-3">
              {bookings.slice(0, 4).map((booking) => (
                <div key={booking.id} className="rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-black text-primary">{booking.listing?.name || langText("Equipment", "उपकरण")}</p>
                      <p className="text-xs font-medium text-on-surface-variant">
                        {booking.renterProfile?.fullName || langText("Renter", "भाडेकरी")} • {booking.startDate} - {booking.endDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-on-surface-variant">{booking.status}</span>
                      <span className="text-sm font-black text-secondary">₹{booking.amount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              ))}
              {!bookings.length ? (
                <div className="rounded-2xl border border-dashed border-outline-variant p-6 text-sm text-on-surface-variant">
                  {langText(
                    "No bookings yet. New requests will appear here once renters start booking.",
                    "अद्याप बुकिंग नाहीत. भाडेकरी बुकिंग सुरू केल्यानंतर नवीन विनंत्या येथे दिसतील."
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-primary">{langText("Top listings", "टॉप लिस्टिंग")}</h2>
                <p className="text-sm font-medium text-on-surface-variant">
                  {langText("Your strongest earning listings are surfaced first.", "तुमची सर्वोत्तम कमाई करणारी लिस्टिंग आधी दाखवली आहेत.")}
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {featuredListings.map((listing) => (
                <article key={listing.id} className="overflow-hidden rounded-[1.5rem] border border-outline-variant bg-surface-container-low">
                  <div className="relative h-44">
                    <Image src={listing.coverImage} alt={listing.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                      {listing.status}
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-4 p-4">
                    <div>
                      <h3 className="font-black text-primary">{listing.name}</h3>
                      <p className="text-xs font-medium text-on-surface-variant">{listing.location}, {listing.district}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-secondary">₹{listing.pricePerHour}/hr</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">
                        {langText("Local pricing", "स्थानिक दर")}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
              {!featuredListings.length ? (
                <div className="rounded-[1.5rem] border border-dashed border-outline-variant p-6 text-sm text-on-surface-variant">
                  {langText("Add your first listing to populate this section.", "हा विभाग भरण्यासाठी तुमची पहिली लिस्टिंग जोडा.")}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
              {langText("Owner snapshot", "मालकाचा आढावा")}
            </h2>
            <dl className="mt-5 space-y-4 text-sm">
              <Row label={langText("Name", "नाव")} value={ownerName} />
              <Row label={langText("Village", "गाव")} value={village || langText("Not set", "निश्चित नाही")} />
              <Row label={langText("Pincode", "पिनकोड")} value={pincode || langText("Not set", "निश्चित नाही")} />
            </dl>
          </section>

          <section className="overflow-hidden rounded-[2rem] border border-outline-variant bg-primary text-white shadow-[0_22px_50px_-28px_rgba(20,59,46,0.65)]">
            <div className="relative p-6">
              <span className="material-symbols-outlined absolute -right-3 -bottom-2 text-[6rem] text-white/10">support_agent</span>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary-fixed">
                {langText("Need help?", "मदत हवी आहे?")}
              </p>
              <h3 className="mt-3 text-xl font-black">
                {langText("Support is one tap away.", "मदत फक्त एका टॅपवर.")}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-primary-fixed">
                {langText(
                  "Use the support center for booking issues, listing help, and payments.",
                  "बुकिंग समस्या, लिस्टिंग मदत आणि पेमेंटसाठी सपोर्ट सेंटर वापरा."
                )}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/owner-profile/support" className="rounded-full bg-white px-4 py-3 text-center text-sm font-black text-primary transition-colors hover:bg-primary-fixed">
                  {langText("Owner support", "मालक सपोर्ट")}
                </Link>
                <Link href="/support" className="rounded-full border border-white/20 bg-white/10 px-4 py-3 text-center text-sm font-black text-white transition-colors hover:bg-white/15">
                  {langText("General support", "सामान्य मदत")}
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
    <div className="rounded-[1.5rem] border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>
      <div className="mt-2 text-2xl font-black tracking-tight text-primary">{value}</div>
      <p className="mt-1 text-xs font-semibold text-on-surface-variant">{note}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="font-black text-primary">{value}</dd>
    </div>
  );
}
