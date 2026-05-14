"use client";

import { useLanguage } from "@/components/LanguageContext";

type PaymentSummary = {
  id: string;
  bookingId: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
};

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function OwnerRevenuePanel({
  payments,
  linkedBookings,
}: {
  payments: PaymentSummary[];
  linkedBookings: number;
}) {
  const { language, langText } = useLanguage();
  const locale = language === "mr" ? "mr-IN" : "en-IN";

  const totalEstimatedValue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const openEstimatedValue = payments
    .filter((payment) => payment.status !== "completed" && payment.status !== "paid" && payment.status !== "cancelled" && payment.status !== "refunded")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const completedEstimatedValue = payments
    .filter((payment) => payment.status === "completed" || payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-7 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-primary dark:text-emerald-50">
          {langText("Booking Value", "बुकिंग मूल्य")}
        </h1>
        <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-on-surface-variant">
          {langText(
            "See owner-listed rental values and booking-linked estimates in one place. Money is settled directly between owner and renter.",
            "मालकाने दिलेले भाडे मूल्य आणि बुकिंग-संबंधित अंदाज एकाच ठिकाणी पहा. पैशांचा व्यवहार मालक आणि भाडेकरू थेट करतात."
          )}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label={langText("Total estimated value", "एकूण अंदाजित मूल्य")} value={formatCurrency(totalEstimatedValue, locale)} />
        <StatCard label={langText("Completed booking value", "पूर्ण बुकिंग मूल्य")} value={formatCurrency(completedEstimatedValue, locale)} />
        <StatCard label={langText("Open booking value", "उघडे बुकिंग मूल्य")} value={formatCurrency(openEstimatedValue, locale)} />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-outline-variant px-6 py-5">
          <h2 className="text-lg font-black text-primary">{langText("Booking value history", "बुकिंग मूल्य इतिहास")}</h2>
          <span className="text-sm font-bold text-on-surface-variant">{langText(`${linkedBookings} linked bookings`, `${linkedBookings} जोडलेली बुकिंग`)}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{langText("Date", "दिनांक")}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{langText("Booking", "बुकिंग")}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{langText("Amount", "रक्कम")}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{langText("Settlement", "व्यवहार")}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{langText("Status", "स्थिती")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {payments.map((payment) => (
                <tr key={payment.id} className="transition-colors hover:bg-surface-container-low">
                  <td className="px-6 py-4 text-sm font-semibold text-on-surface-variant">{payment.createdAt.slice(0, 10)}</td>
                  <td className="px-6 py-4 text-sm font-black text-primary">{payment.bookingId}</td>
                  <td className="px-6 py-4 text-sm font-black text-secondary">{formatCurrency(payment.amount, locale)}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {langText("Direct Settlement", "थेट व्यवहार")}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-surface-container-low px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                      {bookingValueStatusLabel(payment.status, langText)}
                    </span>
                  </td>
                </tr>
              ))}
              {!payments.length ? (
                <tr>
                  <td className="px-6 py-8 text-sm text-on-surface-variant" colSpan={5}>
                    {langText("No booking value records yet.", "अद्याप बुकिंग मूल्य नोंदी नाहीत.")}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function bookingValueStatusLabel(
  status: string,
  langText: (english: string, marathi: string) => string
) {
  switch (status) {
    case "paid":
    case "completed":
      return langText("Completed", "पूर्ण झाले");
    case "refunded":
    case "cancelled":
      return langText("Cancelled", "रद्द झाले");
    case "confirmed":
      return langText("Confirmed", "पुष्टी झाले");
    default:
      return langText("Pending", "प्रलंबित");
  }
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-primary">{value}</p>
    </div>
  );
}
