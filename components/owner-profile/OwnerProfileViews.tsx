"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { supportContact } from "@/lib/support-contact";

const dashboardBookings = [
  {
    name: "John Deere 5050D",
    price: "₹3,500",
    dateRange: "12 Oct - 15 Oct (3 Days)",
    owner: "Owner: Amol Shinde",
    status: "Confirmed",
    statusClass: "bg-emerald-100 text-emerald-800",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsrECKKQV6KB_aVIhfGHU3NZwr5wbps7eMTfSgp3Dc4-876XTdR4DbxF7YBY-ycJ8Kw4oUtSmp9b5hxUytx7Or0jc1nJbrDTCxJdTpGvrJDYkSdVNLWAD0KZ7A-fGGn9JnlvTy5z91YaL6NtvxvQSjJfAsKW8m6AHUBYuW89y4QU0I5AsCVanqidLzR3PsorIuvhrpegJHEG7jDlqWzZqbpvcVxrXhLB3FFIKT-DPLWWEAgHOMgfFt9mj58vuZgAT-7dvbWJCj0BuM",
    primaryAction: "Track Order",
    primaryClass: "bg-primary-container text-white hover:opacity-90",
  },
  {
    name: "Mahindra Rotavator",
    price: "₹1,200",
    dateRange: "18 Oct - 19 Oct (1 Day)",
    owner: "Owner: Ravi Gaikwad",
    status: "Pending Approval",
    statusClass: "bg-amber-100 text-amber-800",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB15SM3BX-16G88tZAvSYZYdz0_bLrzpiV9cAgBeo-OK3eHbVR5j6gboV7V8rAx_T07weF70XbDfjHxGn1EGdex1lVzhXvOi6Zf0qLlX1y0xsiz6lEWSqHxbmHlb_p-mS3-Ny3dRWd2egnv5bip0dF5bgG-_46ii0CZE68yWICuUUl4ZlYviYvHMgJDv8f7v0Ci_If4I0FSQ5iqLn_z6NWuyojonf3gSUoQA3-dt-48MkyBJ0lEYYKla4vfHLUlX21X6WVWOJ-sfGRv",
    primaryAction: "Track Order",
    primaryClass: "border border-primary-container text-primary-container hover:bg-emerald-50",
  },
];

const dashboardHistory = [
  {
    name: "Swaraj 744 FE",
    owner: "Owner: Kiran Patil",
    dates: "22 Sep - 24 Sep",
    amount: "₹7,200",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjKfTw_ch-hOlHGSR1zqO98qtRnuDaIrP0Un4I5m2wCBJ6sQcdwJC_VQAklPmJCaVm3MO5zM4eO-tMzONCrxyWTHoKABAk77naPbJhUg2o_Nw6DNF7gODR0V8k54D3xuo6WQJBqO5mbfNbTIevAmrADki54BJhE50zKHVt-mRqvjCrwkveb2eFTdTOBWjbM3MnXdiY6e06yy91xAHHhw2f2VvcllDWrkPM5obRWbyq8n69KoMmTjil9-4VSPMEo9v6d63DrptAny0Y",
  },
  {
    name: "3-Bottom Disc Plough",
    owner: "Owner: Sandeep Mane",
    dates: "10 Sep - 11 Sep",
    amount: "₹1,800",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB2kWK-2_mZ4G0Qu0bvYbbtdfmPggSIGWS2K2IjMA2PsCZUgKeMYrJFaDDs3ohwVFCGdSZQ-X_cZPVdvpDL80MfYpF5GVhdYkvnTjkgUFUav-N9xcQqlKMAsLLphzAiV2htfwUe-8NJPJ6TYTQFiAaGv1U-EDKyfgRN26oPuUzRUJnVM8uzT9giH_wKcupyEWJuPGZcF4XzbkJCM1yhTfR6vS2Mwn9_fl9ASQoC_rZe4ubIrHD8A47ZIjBlyfFaMLDP7FpZVb9h7D6x",
  },
];

const browseResults = [
  {
    name: "John Deere 5050D",
    meta: "Tractor • 50 HP",
    distance: "Koregaon, Satara • 4.2 km away",
    price: "₹900 / hour",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBg6aRbteiOr_A1PwU8odbjZPzym56O_ne8tOLkhaQbv2I-bINBiFV5lCGw1mrx7uHxnycRuoSaRlT_G8bjtpHtCOxisNr4PfYtd92Y6BDflDuPiFkqOBqJfiv-7d3GOGBufO9rucHQ8PqLDK_iYDEjBaTQTAmjQEFoGuAdj-uj6GbqjH_hXpLTQr24ChJdKgf-o63S3Axtc6-8N4wqj9yym_SDTc4OVKG6EHhZD19jqsOoh6avfF62adRLK6QfM5fkxqHQRUiDcSUD",
  },
  {
    name: "Mahindra Rotavator",
    meta: "Implement • 6 feet",
    distance: "Karad, Satara • 12 km away",
    price: "₹1,200 / day",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB15SM3BX-16G88tZAvSYZYdz0_bLrzpiV9cAgBeo-OK3eHbVR5j6gboV7V8rAx_T07weF70XbDfjHxGn1EGdex1lVzhXvOi6Zf0qLlX1y0xsiz6lEWSqHxbmHlb_p-mS3-Ny3dRWd2egnv5bip0dF5bgG-_46ii0CZE68yWICuUUl4ZlYviYvHMgJDv8f7v0Ci_If4I0FSQ5iqLn_z6NWuyojonf3gSUoQA3-dt-48MkyBJ0lEYYKla4vfHLUlX21X6WVWOJ-sfGRv",
  },
  {
    name: "DJI Agras Drone T30",
    meta: "Sprayer • 30L",
    distance: "Pune District • 18 km away",
    price: "₹450 / acre",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHBC3Q5y_ORwgMVwxwsCHq2-7TzwpuPoDFAjxMPd08EvK2lGpoUMgu0y72siAvWjIEY-PnYvF3uBI8k5hm6c9QGwDeqYUK1hVKO5rHPbQsn0qQWU7XIgFdQm97MHJq4TbX7jJf59B_TzcFUZFe3Hx4fRxSmUm_vafNMETiI5PQSfxCzw2z9cC4UgCOsiUPYEYBmgI2NZMnW4_BTz581yRN4GQkCczyESEYDjWkszzUdWohSDtNFzPORVE65rsxwkXi2NVQKbpD4-G4",
  },
];

const ownerBookings = [
  {
    name: "John Deere 5050D",
    owner: "Owner: Vijay Jadhav",
    status: "Confirmed",
    actionOne: "Call Owner",
    actionTwo: "Cancel",
    actionThree: "Track",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBg6aRbteiOr_A1PwU8odbjZPzym56O_ne8tOLkhaQbv2I-bINBiFV5lCGw1mrx7uHxnycRuoSaRlT_G8bjtpHtCOxisNr4PfYtd92Y6BDflDuPiFkqOBqJfiv-7d3GOGBufO9rucHQ8PqLDK_iYDEjBaTQTAmjQEFoGuAdj-uj6GbqjH_hXpLTQr24ChJdKgf-o63S3Axtc6-8N4wqj9yym_SDTc4OVKG6EHhZD19jqsOoh6avfF62adRLK6QfM5fkxqHQRUiDcSUD",
  },
  {
    name: "Mahindra Rotavator 6ft",
    owner: "Owner: Suresh Kadam",
    status: "Active",
    actionOne: "Call Owner",
    actionTwo: "Details",
    actionThree: "Track",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB15SM3BX-16G88tZAvSYZYdz0_bLrzpiV9cAgBeo-OK3eHbVR5j6gboV7V8rAx_T07weF70XbDfjHxGn1EGdex1lVzhXvOi6Zf0qLlX1y0xsiz6lEWSqHxbmHlb_p-mS3-Ny3dRWd2egnv5bip0dF5bgG-_46ii0CZE68yWICuUUl4ZlYviYvHMgJDv8f7v0Ci_If4I0FSQ5iqLn_z6NWuyojonf3gSUoQA3-dt-48MkyBJ0lEYYKla4vfHLUlX21X6WVWOJ-sfGRv",
  },
];

const savedEquipment = [
  {
    name: "John Deere 5050D",
    meta: "Tractor • 50 HP",
    distance: "Koregaon, Satara (4.2 km away)",
    price: "₹900 / hour",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBg6aRbteiOr_A1PwU8odbjZPzym56O_ne8tOLkhaQbv2I-bINBiFV5lCGw1mrx7uHxnycRuoSaRlT_G8bjtpHtCOxisNr4PfYtd92Y6BDflDuPiFkqOBqJfiv-7d3GOGBufO9rucHQ8PqLDK_iYDEjBaTQTAmjQEFoGuAdj-uj6GbqjH_hXpLTQr24ChJdKgf-o63S3Axtc6-8N4wqj9yym_SDTc4OVKG6EHhZD19jqsOoh6avfF62adRLK6QfM5fkxqHQRUiDcSUD",
  },
  {
    name: "Multicrop Seed Drill",
    meta: "Implement • 9 Row",
    distance: "Satara Road (11 km away)",
    price: "₹800 / acre",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_HLz7VSN4J3FBfsFFmZMKP4-xNIgoaxhDdfeqzHQZfKVyV73fRjbpeZeqP1ql7nti2m5bFQaASrmR-ceTBMG-sXQmb7KojMkosbcfVw9sfRcglt9NMORgVWh_TG1vj0vU79-bHjDXLQAnjb8MXmh7x1CpRggdmBZHzu4-j1zm6G9wS0KWRJ89qebLOd8lCSRYn80aV9fvhL29ivtXEIe7RIv0fksRbBqBTBMXheRrz0XRX7YEXdNiOZAW_FcdLf79sWVi9PT1HTCd",
  },
  {
    name: "Kubota Harvester DC-68G",
    meta: "Harvester • Diesel",
    distance: "Karad (21 km away)",
    price: "₹2,200 / hour",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSZX-mOsMuIEggPZWypkGDd9h8d-B5TiXfMslfVJg8xO8-NMTQWUAU0wFieneSJ0vgQbuMk9dmVIZFRzvBLNJck-88KEX5KOa7hXLa5F9llVguI5jJDDCsbfaO9Qv5qpd9pL1H21tFTLPvOl3H-toiOZfYcqLjJGTD76fk12FItJG37moN9W438EuNOnu50V3AQzr8ibacy46ACpocN4WVp1ic7jXUUvL2EgcTbzjF_YZDDE8UEqN8B50rd4wf7gvFDrjyYJiAJSHL",
  },
];

const supportSummary = [
  {
    title: "Pending owner confirmation",
    detail: "Booking #BK-2194 • John Deere 5050D",
  },
  {
    title: "Resolved payment clarification",
    detail: "Ticket #SP-102 • Updated yesterday",
  },
];

function FeedbackForm({
  title,
  subtitle,
  fields,
  successHref,
}: {
  title: string;
  subtitle: string;
  fields: React.ReactNode;
  successHref: string;
}) {
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(successHref);
  };

  return (
    <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-10">
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
          <span className="material-symbols-outlined text-3xl">rate_review</span>
        </div>
        <div>
          <h2 className="text-3xl font-black text-primary">{title}</h2>
          <p className="mt-2 text-sm text-on-surface-variant">{subtitle}</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {fields}
        <div className="flex flex-col justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row dark:border-slate-800">
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container px-6 py-3 text-sm font-bold text-white"
          >
            Submit Request
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export function OwnerProfileDashboardContent() {
  return (
    <div className="space-y-10">
      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-on-surface dark:text-slate-100">
            Active Bookings <span className="font-normal text-on-surface-variant dark:text-slate-400">/ सक्रिय बुकिंग्ज</span>
          </h2>
          <Link href="/renter-profile/bookings" className="text-sm font-bold text-primary-container hover:underline">
            View All
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {dashboardBookings.map((booking) => (
            <article
              key={booking.name}
              className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={booking.image} alt={booking.name} className="h-full w-full object-cover" />
                <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${booking.statusClass}`}>
                  {booking.status}
                </span>
              </div>
              <div className="space-y-5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-on-surface dark:text-slate-100">{booking.name}</h3>
                    <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">{booking.owner}</p>
                  </div>
                  <p className="text-right text-lg font-extrabold text-primary-container dark:text-emerald-200">
                    {booking.price}
                    <span className="block text-xs font-medium text-on-surface-variant dark:text-slate-400">
                      per day
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant dark:text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">event</span>
                  {booking.dateRange}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition ${booking.primaryClass}`}
                  >
                    {booking.primaryAction}
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">call</span>
                      Call
                    </span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-on-surface dark:text-slate-100">
            Recent History <span className="font-normal text-on-surface-variant dark:text-slate-400">/ अलीकडील व्यवहार</span>
          </h2>
          <Link href="/renter-profile/bookings" className="text-sm font-bold text-primary-container hover:underline">
            View All
          </Link>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full min-w-[42rem] text-left">
            <thead className="bg-slate-50 dark:bg-slate-950/70">
              <tr>
                {["Equipment", "Dates", "Total Amount", "Status", "Action"].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {dashboardHistory.map((item) => (
                <tr key={item.name}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-on-surface dark:text-slate-100">{item.name}</p>
                        <p className="text-xs text-on-surface-variant dark:text-slate-400">{item.owner}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant dark:text-slate-400">{item.dates}</td>
                  <td className="px-6 py-4 text-sm font-bold text-on-surface dark:text-slate-100">{item.amount}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button type="button" className="text-sm font-bold text-primary-container hover:underline">
                      Re-book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function OwnerProfileBrowseContent() {
  const gridItems = Array.from({ length: 12 }, (_, index) => browseResults[index % browseResults.length]);

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_auto]">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400">
              Equipment Search | उपकरण शोध
            </span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder="e.g. Tractor, Rotavator..."
              type="text"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400">
              Date | तारीख
            </span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              type="date"
            />
          </label>
          <div className="flex items-end">
            <button type="button" className="w-full rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white">
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-on-surface dark:text-slate-100">
              Available Equipment <span className="font-normal text-on-surface-variant dark:text-slate-400">(42 Results)</span>
            </h2>
          </div>
          <button type="button" className="text-sm font-bold text-primary-container hover:underline">
            Sort by Closest
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {gridItems.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <img src={item.image} alt={item.name} className="aspect-square w-full object-cover" />
              <div className="space-y-3 p-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-on-surface dark:text-slate-100">{item.name}</h3>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400">{item.meta}</p>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400">{item.distance}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-extrabold text-primary-container dark:text-emerald-200">{item.price}</p>
                  <Link href="/equipment/5" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              type="button"
              className={`h-10 w-10 rounded-full text-sm font-bold ${
                page === 1
                  ? "bg-primary text-white"
                  : "border border-slate-200 bg-white text-on-surface dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-on-surface dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            ...
          </button>
        </div>
      </section>
    </div>
  );
}

export function OwnerProfileBookingsContent() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-black text-primary">My Bookings / माझे बुकिंग्ज</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Track all your confirmed, active, and recently completed machine rentals.
            </p>
          </div>
          <Link
            href="/renter-profile/browse"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container px-5 py-3 text-sm font-bold text-white"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Rent New Equipment
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {["All Bookings", "Pending", "Confirmed", "Active", "Completed"].map((item, index) => (
            <button
              key={item}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                index === 0
                  ? "bg-primary text-white"
                  : "border border-slate-200 bg-white text-on-surface dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto pb-3">
          <div className="flex min-w-max gap-5">
            {ownerBookings.map((booking) => (
              <article
                key={booking.name}
                className="flex aspect-square w-[20rem] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-surface-container-low shadow-sm dark:border-slate-800 dark:bg-slate-950/60"
              >
                <img src={booking.image} alt={booking.name} className="aspect-square w-full object-cover" />
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-on-surface dark:text-slate-100">{booking.name}</h3>
                        <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">{booking.owner}</p>
                      </div>
                      <span className="inline-flex rounded-full bg-primary-fixed px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary-container">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <button type="button" className="rounded-xl bg-primary-container px-3 py-2.5 text-xs font-bold text-white">
                      {booking.actionOne}
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-on-surface dark:border-slate-700 dark:text-slate-100"
                    >
                      {booking.actionTwo}
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-on-surface dark:border-slate-700 dark:text-slate-100"
                    >
                      {booking.actionThree}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function OwnerProfileSavedContent() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xl font-semibold text-on-surface-variant dark:text-slate-400">जतन केलेली उपकरणे</p>
          <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-400">
            You have <strong className="text-on-surface dark:text-slate-100">5 items</strong> in your shortlist.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-on-surface dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          Clear Saved
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {["Availability", "Closest to me"].map((item) => (
          <button
            key={item}
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-on-surface dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {item}
          </button>
        ))}
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {savedEquipment.map((item) => (
          <article
            key={item.name}
            className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="relative h-56">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary-container shadow-sm"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  bookmark
                </span>
              </button>
              <div className="absolute right-4 top-4 rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-white">
                Ready to Book
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-on-surface dark:text-slate-100">{item.name}</h3>
                  <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">{item.meta}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-on-surface-variant dark:text-slate-400">{item.distance}</p>
              <div className="mt-5 flex items-center justify-between">
                <p className="text-lg font-extrabold text-primary-container dark:text-emerald-200">{item.price}</p>
                <Link href="/equipment/5" className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white">
                  View Details
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export function OwnerProfileSettingsContent() {
  return (
    <div className="grid gap-8 xl:grid-cols-[1.35fr_0.75fr]">
      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-start gap-5">
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-kBTfaqPh7O5NiLKNbk4R3_5FPl4NAtFurpvHj2nV6hg7djjnmpMOSq-4yg_MkeDTEGrfdoYAQzrGNcviRVGMd7nud7bWMNMdFWbm3iTOCVPdlRp4cds9jQ9ujPkIwPah1z_22j_QxTUEiFkbDStCbOHRJEvmYsXz7HbLVqzxSnjEyShEs3IuOFhEaQm4ktYTgBI3v1AydWdS0DaDiAEvGP2eQk-FUj3MvPZyPkIq1p7ygtdzkR8dXvrWHDMrIm40bb_SUj6souCQ"
                alt="Namdev Patil"
                className="h-24 w-24 rounded-full object-cover"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 rounded-full bg-primary-container p-2 text-white shadow"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
            <div>
              <h2 className="text-3xl font-black text-primary">Settings / सेटिंग्ज</h2>
              <p className="mt-2 text-sm text-on-surface-variant">Manage your renter profile, preferences, and account controls.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-primary">Personal Information</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Full Name</span>
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" defaultValue="Namdev Patil" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Email</span>
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" defaultValue="namdev.patil@example.com" />
            </label>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-primary">Farming Profile</h3>
          <div className="mt-6 grid gap-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-on-surface">Primary Crops</p>
              <div className="flex flex-wrap gap-2">
                {["Sugarcane", "Vegetables", "Fruits", "Grains"].map((item) => (
                  <button key={item} type="button" className="rounded-full bg-primary-fixed px-4 py-2 text-sm font-medium text-primary">
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-on-surface">Common Work</p>
              <div className="flex flex-wrap gap-2">
                {["Ploughing", "Harvesting", "Spraying", "Sowing"].map((item) => (
                  <button key={item} type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-on-surface dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-primary">Notification Preferences / सूचना प्राधान्ये</h3>
          <div className="mt-5 space-y-3">
            {["Booking updates", "Owner call alerts", "Saved equipment alerts"].map((item, index) => (
              <label key={item} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950">
                <span className="text-sm font-medium text-on-surface dark:text-slate-100">{item}</span>
                <input defaultChecked={index !== 1} type="checkbox" className="h-5 w-5 accent-primary" />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-red-100 bg-white p-6 shadow-sm dark:border-red-900/60 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-red-600">Danger Zone / धोक्याचे क्षेत्र</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              className="rounded-2xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 dark:border-red-900/60"
            >
              Deactivate Account
            </button>
            <button
              type="button"
              className="rounded-2xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 dark:border-red-900/60"
            >
              Delete Permanently
            </button>
          </div>
        </section>
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-28 space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-on-surface dark:text-slate-100">Unsaved Changes</h3>
          <p className="text-sm text-on-surface-variant dark:text-slate-400">
            Save Changes from this panel. It stays visible while you scroll, just like the current settings page.
          </p>
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white">
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Changes
          </button>
          <button
            type="button"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-200"
          >
            Discard
          </button>
          <div className="rounded-2xl bg-surface-container-low p-4 dark:bg-slate-950/70">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Save</p>
            <p className="mt-2 text-sm text-on-surface-variant">
              Use Save Changes after editing personal information, farming profile, or notification preferences.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function OwnerProfileSupportContent() {
  return (
    <div className="space-y-8">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["assignment_late", "Booking Issue"],
          ["payments", "Payment Help"],
          ["person", "Account Help"],
          ["verified_user", "Verification Help"],
        ].map(([icon, label]) => (
          <div
            key={label}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
            <h3 className="mt-4 text-lg font-bold text-on-surface dark:text-slate-100">{label}</h3>
          </div>
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-black text-primary">Send a Support Request</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Provide details about your issue and our team will review it shortly.</p>
          <form className="mt-6 space-y-5">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Briefly describe the issue</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="Example: Need help with booking confirmation"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Issue Details</span>
              <textarea
                className="min-h-[180px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="Provide details about your issue..."
              />
            </label>
            <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-6 py-3 text-sm font-bold text-white">
              Submit Request
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>

        <div className="space-y-5">
          <section className="rounded-[1.75rem] bg-primary-container p-6 text-white shadow-sm">
            <h3 className="text-xl font-black">Need Immediate Help?</h3>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-fixed">WhatsApp Support</p>
                <p className="mt-1 text-lg font-bold">{supportContact.whatsappDisplay}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-fixed">Call Support</p>
                <p className="mt-1 text-lg font-bold">{supportContact.phoneDisplay}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-primary">Your Ticket Summary</h3>
              <button type="button" className="text-sm font-bold text-primary-container hover:underline">
                View All History
              </button>
            </div>
            <div className="space-y-4">
              {supportSummary.map((item) => (
                <div key={item.title} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="font-bold text-on-surface dark:text-slate-100">{item.title}</p>
                  <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

export function OwnerProfileFeedbackContent() {
  return (
    <FeedbackForm
      title="Help Us Improve Kisan Kamai"
      subtitle="Share your suggestions and service feedback for the renter experience."
      successHref="/renter-profile/feedback/success"
      fields={
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Full Name</span>
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Enter your full name" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Mobile Number</span>
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Enter your mobile number" />
            </label>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">Location</span>
            <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="e.g. Pune, Maharashtra" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">Suggestion Summary</span>
            <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Summarize your suggestion in a few words" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">Details</span>
            <textarea className="min-h-[180px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Please describe how this feature would help you..." />
          </label>
        </>
      }
    />
  );
}

export function OwnerProfileFeedbackSuccessContent() {
  return (
    <div className="mx-auto max-w-3xl rounded-[2.5rem] bg-white p-8 text-center shadow-sm dark:bg-slate-900 md:p-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-fixed text-primary">
        <span className="material-symbols-outlined text-4xl">task_alt</span>
      </div>
      <h2 className="mt-6 text-4xl font-black text-primary">Request Submitted Successfully</h2>
      <p className="mt-3 text-lg font-semibold text-on-surface-variant">विनंती यशस्वीरित्या सबमिट केली</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/renter-profile" className="rounded-xl bg-primary-container px-6 py-3 text-sm font-bold text-white">
          Back to Dashboard
        </Link>
        <Link href="/renter-profile/bookings" className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-100">
          My Bookings
        </Link>
      </div>
    </div>
  );
}
