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

export function RenterPaymentsPanel({ payments }: { payments: PaymentSummary[] }) {
  const { langText } = useLanguage();
  const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pending = payments.filter((payment) => payment.status === "processing").reduce((sum, payment) => sum + payment.amount, 0);
  const refunded = payments.filter((payment) => payment.status === "refunded").reduce((sum, payment) => sum + payment.amount, 0);
  const paid = payments.filter((payment) => payment.status === "paid").reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-7 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-primary dark:text-emerald-50">
          {langText("Payments", "पेमेंट्स")}
        </h1>
        <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-on-surface-variant">
          {langText(
            "Review your spending totals, pending amounts, and the full payment history tied to your bookings.",
            "तुमचा खर्च, प्रलंबित रक्कम आणि बुकिंगशी जोडलेला पूर्ण पेमेंट इतिहास पहा."
          )}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label={langText("Total spent", "एकूण खर्च")} value={`₹${totalSpent.toLocaleString("en-IN")}`} />
        <StatCard label={langText("Paid", "भरलेले")} value={`₹${paid.toLocaleString("en-IN")}`} />
        <StatCard label={langText("Pending", "प्रलंबित")} value={`₹${pending.toLocaleString("en-IN")}`} />
        <StatCard label={langText("Refunded", "परतावा")} value={`₹${refunded.toLocaleString("en-IN")}`} />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-outline-variant px-6 py-5">
          <h2 className="text-lg font-black text-primary">{langText("Transaction history", "व्यवहार इतिहास")}</h2>
          <span className="text-sm font-bold text-on-surface-variant">{langText(`${payments.length} records`, `${payments.length} नोंदी`)}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{langText("Date", "दिनांक")}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{langText("Booking", "बुकिंग")}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{langText("Amount", "रक्कम")}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{langText("Method", "पद्धत")}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{langText("Status", "स्थिती")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {payments.map((payment) => (
                <tr key={payment.id} className="transition-colors hover:bg-surface-container-low">
                  <td className="px-6 py-4 text-sm font-semibold text-on-surface-variant">{payment.createdAt.slice(0, 10)}</td>
                  <td className="px-6 py-4 text-sm font-black text-primary">{payment.bookingId}</td>
                  <td className="px-6 py-4 text-sm font-black text-secondary">₹{payment.amount.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{payment.method}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-surface-container-low px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-on-surface-variant">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!payments.length ? (
                <tr>
                  <td className="px-6 py-8 text-sm text-on-surface-variant" colSpan={5}>
                    {langText("No payment records yet.", "अद्याप पेमेंट नोंदी नाहीत.")}
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-primary">{value}</p>
    </div>
  );
}
