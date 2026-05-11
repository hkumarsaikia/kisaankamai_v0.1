"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { OwnerRevenuePanel } from "@/components/workspace/OwnerRevenuePanel";
import { supportContact } from "@/lib/support-contact";

const bookingRequests = [
  {
    name: "Mahindra Yuvo 575 DI",
    renter: "Rajesh Deshmukh",
    location: "from Satara",
    total: "₹3,200",
    dateRange: "24 Oct - 26 Oct",
    duration: "3 Days",
    urgent: true,
    machineImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfu_AMK_TC8qMMVZ5e68Vj614f7M-Jvj39tLDf3BQJkq-OR0wlOV6NnKY023rSowbHNfyUR20P5q9Emgjo4e57yk4c-aACXJdZTlCLD205lUsSDSeqCy9E2TCpIP7z4Fvt3iHDiYNgRCVDnJB3NDcwl79hAdszGgm4yLyy0f7U7N9J_tB4bXx2XkjVYlAWGd5o9b53aF9pauVHDAIeeds_aa7VckpSTmbvjgEmlh9kYALpZ4nflwGb2cyeq4_Ih7RTZDPwgd3CIiRh",
    renterImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDx5bzL6bDQVA0JxAp7j3KMGj422zWVggwjN1uLMEN6YpdhDTjMjWHLXb_0V3dVd0WMlENhvLzIn426BpV8FXdPS88eGjjWb2YK4IpWBgH4aXhxV3uwZNLfBgajOd9yQhswUz1ZVqFEhjLJG_FKW9E9sLeR697KlUCScCYRDLMDl-t9mf5xwsJQudvzRFyYPPSv5jPOhU5v_omPSVzIiCTDoNc4oXdWzTRporMg1YH3LoPQoWVSEz4abYKQ3jGGBPZYgL9aOVZnMFfe",
  },
  {
    name: "Swaraj 744 FE",
    renter: "Anjali Patil",
    location: "from Karad",
    total: "₹1,850",
    dateRange: "28 Oct - 29 Oct",
    duration: "2 Days",
    urgent: false,
    machineImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXeWgkAV1x1OgBpa0auyHmBacTvv1IBdSuN6HHZuMz0giFUEgslR8DNPtxyaEFW_qQfI-SY6jGv3V3EMDAQxI5mZ10393zRusmkv2bKJ0Eath72hCyYwYPCNfDHP8rV_I0LBL3I8go1bhHdl5ramzkl-_47sR06qnJvglu5XQAz32-c5aMpqHKCutM2wE6jkFcfqQOO-oqQE7EbYADTp3cVHtBZTe3hEvuMKsI-i5SRaRyWrydi81W7U1m7BGa2bUrV19hlxUPJC1m",
    renterImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSq5F2cYUuHYvBmXAsvxfDZXj8e5KUW5MdWMRmUV_E7aVgcECHdB37efSooZU37aQMHE2uMlH5_qq8EXFprA_jz2AT0Bf8jhSMJYsvk5HDimpaD86TMoEyYlEhntgcyEt7YDAPS6Hbs2dKAGkjqWW5m5pgRzagnZ9MCEO2waJgg-VGJuzN5M3W_FDECvdn_c_mYGqSUvGZQpTe7vNh6Wq12hUw7sh2AryJuq-dWeNygpmLu3nl_7gSomHl4vsY_kHpoeLx5TgwK3fu",
  },
];

const completedItems = [
  {
    title: "Rotavator Attachment",
    earned: "₹1,200 Earned",
    completedOn: "Completed 12 Oct",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdqNOAoCPN8x0nsEZC8ySbNFRQhgNTr8XGeglYme_oheUE-k1yvgLhZtw5MZd2AnHdZBTUP9xgRxwNDjSjuqiAOcuSnP4MChkAFQSOkgcz-1_hGr-OJ2z1tDzf8sOQDTVJu296cAO1lslwFCoXrwyZpVsm9_gqgIrzYeHEFMt-F63fydM-fghS4V_bZ3tWF-zGPQyrV1SPq8Z5g7MRNMeFK1jcr99JJnCYiEAXJ-d_Egi_TGMI-UBGEi5auHaJpN3nUrA4eeHXZSJM",
  },
  {
    title: "Seed Drill - 9 Row",
    earned: "₹2,450 Earned",
    completedOn: "Completed 08 Oct",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDD7UN56-Z2_tDkc9fBsx1kXCYvgZSc6DtKZ-iIbjFzKKvMiNQE2_kpTFOJZoJ-82Rl4k669AmPzsKzGuPiXxOak6Vuxv0dB_GJ43522eiid2WvxFDwZlPR5TT_2cyO_fpq84se2YAe019WzFiJbgxenW7R1UEyPbtFk2TWOiosq0Rq0ibIK90moqEjMBqjhwkvB7Y8xTgAb4VIiP9m5kV09cXfp4gu4is9YrmHaBy1aNtTQKG1UP5PVwJ_D_QZFRZuk63-qQbjJXKG",
  },
];

const dashboardTasks = [
  {
    title: "Review Equipment Gallery",
    icon: "add_a_photo",
    href: "/list-equipment",
  },
  {
    title: "Review Availability",
    icon: "edit_calendar",
    href: "/owner-profile/bookings",
  },
];

const equipmentCards = [
  {
    name: "Mahindra 575 DI",
    meta: "Tractor • 45 HP",
    status: "Active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBEqtpz50nGqO5PXychK55yTwvYxHnpQvgY7YdcTK_wZJDASU4EzqAKbR_qU1-7K49zffPeSVaKRx51vhC2xAOLDAPxhBECAYCYwXuhLqq8feYZMidBF4zldokMW10bkfDS4AmZSYQaZwopI95ndz-ri-flHU9u0oUlCA7hzuFWDGAiIHsB9qRF1M_3o5Hl7gIBGneiGkMwoh-xF0Y40IaAEMh8td4aOpML_HiSUFoGTdyAiRDaQ7EPhBf1NLQ8EB5bcwlrgIImNmb7",
  },
  {
    name: "John Deere 5310",
    meta: "Tractor • 55 HP",
    status: "High Demand",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDo30tOlVIugzS_7jgt7kuk4aZ7kUqq9s-awHCixPh5aJzriB9MdVMO_H8faueekx3BhnItbI7F9XHhH4zuKIaF9ytFaC1HBrDuwcwkJP2zNE4TjwSfJfRxCdGrJNjdWHI_XIy3QlKbJpKYN1BQc8PuvrbXd0eqpnzPL69L64J3Fh6MgVgqVIgV2AAqhlsNTDGhoevjEujKOzHb_9ZtXhCy7m6BQisG1w5zXAaKltdC4njE3nE7IBh2gKFoGN2BcjSYpCJ5H4xkb3yw",
  },
  {
    name: "Rotavator 6 ft",
    meta: "Implement • PTO Ready",
    status: "Paused",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB15SM3BX-16G88tZAvSYZYdz0_bLrzpiV9cAgBeo-OK3eHbVR5j6gboV7V8rAx_T07weF70XbDfjHxGn1EGdex1lVzhXvOi6Zf0qLlX1y0xsiz6lEWSqHxbmHlb_p-mS3-Ny3dRWd2egnv5bip0dF5bgG-_46ii0CZE68yWICuUUl4ZlYviYvHMgJDv8f7v0Ci_If4I0FSQ5iqLn_z6NWuyojonf3gSUoQA3-dt-48MkyBJ0lEYYKla4vfHLUlX21X6WVWOJ-sfGRv",
  },
];

const supportTickets = [
  {
    title: "Pending verification follow-up",
    detail: "Ticket #OW-301 • Awaiting documents",
  },
  {
    title: "Resolved direct-settlement question",
    detail: "Ticket #OW-277 • Closed yesterday",
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

export function RenterProfileDashboardContent() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">Owner Profile</p>
                <h2 className="mt-2 text-4xl font-black text-primary">Good Morning, Ramesh</h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Review incoming requests, update equipment, and keep your listings moving.
                </p>
              </div>
              <button type="button" className="text-sm font-bold text-primary-container hover:underline">
                View all requests
              </button>
            </div>

            <div className="mt-8 space-y-4">
              {bookingRequests.map((request) => (
                <div key={request.name} className="rounded-[1.5rem] border border-slate-200 bg-surface-container-low p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="flex flex-col gap-4 md:flex-row">
                    <img src={request.machineImage} alt={request.name} className="h-32 w-full rounded-[1.25rem] object-cover md:h-24 md:w-28" />
                    <div className="flex flex-1 items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-on-surface dark:text-slate-100">{request.name}</h3>
                        <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">
                          {request.renter} {request.location}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-primary-container">{request.dateRange}</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-100">
                          Decline
                        </button>
                        <button type="button" className="rounded-xl bg-primary-container px-4 py-2 text-sm font-bold text-white">
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {dashboardTasks.map((task) => (
            <Link
              key={task.title}
              href={task.href}
              className="flex items-center justify-between rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl text-primary">{task.icon}</span>
                <div>
                  <p className="font-bold text-on-surface dark:text-slate-100">{task.title}</p>
                  <p className="text-sm text-on-surface-variant">Quick owner workflow</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function RenterProfileBookingsContent() {
  const { langText } = useLanguage();

  return (
    <div className="space-y-8">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
            {langText("New Requests", "नवीन विनंत्या")}
            <span className="rounded-full bg-secondary-container px-2 py-0.5 text-xs text-on-secondary-container">3</span>
          </h2>
          <button type="button" className="text-sm font-bold text-secondary hover:underline">
            {langText("View in Marathi", "इंग्रजीत पहा")}
          </button>
        </div>

        <div className="overflow-x-auto pb-3">
          <div className="flex min-w-max gap-5">
            {bookingRequests.map((request) => (
              <article
                key={request.name}
                className="group flex aspect-square w-[20rem] flex-col overflow-hidden rounded-[1.75rem] border border-surface-container-highest bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative aspect-square overflow-hidden bg-surface-container">
                  <img
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={request.name}
                    src={request.machineImage}
                  />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary shadow-sm">
                      {request.total}
                    </span>
                    {request.urgent ? (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
                        Urgent
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-primary">{request.name}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-7 w-7 overflow-hidden rounded-full bg-surface-container-highest">
                          <img className="h-full w-full object-cover" alt={request.renter} src={request.renterImage} />
                        </div>
                        <span className="text-sm font-semibold text-on-surface">
                          {request.renter}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-on-surface-variant">{request.location}</p>
                    </div>
                    <div className="space-y-2 text-xs font-bold text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-secondary">calendar_month</span>
                        <span>{request.dateRange}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-secondary">history</span>
                        <span>{request.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <button className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary/90" type="button">
                      Approve
                    </button>
                    <button className="rounded-xl border border-surface-container-highest px-3 py-2.5 text-xs font-bold text-on-surface transition-colors hover:bg-surface-container" type="button">
                      Decline
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-container-highest text-primary transition-colors hover:bg-surface-container" type="button">
                      <span className="material-symbols-outlined">phone</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Recently Completed</h2>
          <button className="text-sm font-bold text-on-surface-variant transition-colors hover:text-primary" type="button">
            View All History
          </button>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex min-w-max gap-4">
            {completedItems.map((item) => (
              <div key={item.title} className="flex w-80 items-center gap-4 rounded-xl border border-surface-container-highest bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="h-12 w-12 overflow-hidden rounded-lg bg-surface-container">
                  <img className="h-full w-full object-cover" alt={item.title} src={item.image} />
                </div>
                <div className="flex-1">
                  <span className="block text-xs font-black uppercase tracking-tighter text-on-surface-variant">{item.completedOn}</span>
                  <h4 className="text-sm font-bold text-primary">{item.title}</h4>
                  <span className="text-xs font-medium text-secondary">{item.earned}</span>
                </div>
                <span className="material-symbols-outlined text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function RenterProfileBrowseContent() {
  return (
    <div className="space-y-8">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black text-primary">My Equipment</h2>
            <p className="mt-2 text-sm text-on-surface-variant">Equipment Directory</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-100">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter &amp; Sort
            </button>
            <Link href="/list-equipment" className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-5 py-3 text-sm font-bold text-white">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add New Listing
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {equipmentCards.map((item) => (
          <article
            key={item.name}
            className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <img src={item.image} alt={item.name} className="aspect-[4/3] w-full object-cover" />
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-on-surface dark:text-slate-100">{item.name}</h3>
                  <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">{item.meta}</p>
                </div>
                <span className="rounded-full bg-primary-fixed px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary-container">
                  {item.status}
                </span>
              </div>
              <div className="flex gap-3">
                <button type="button" className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-100">
                  Edit
                </button>
                <button type="button" className="flex-1 rounded-xl bg-primary-container px-4 py-3 text-sm font-bold text-white">
                  Details
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[1.75rem] border border-dashed border-outline-variant bg-surface-container-low p-8 text-center dark:border-slate-700 dark:bg-slate-950/60">
        <h3 className="text-2xl font-black text-primary">Grow your fleet</h3>
        <p className="mt-3 text-sm text-on-surface-variant">Add another listing to reach more farmers and expand your seasonal bookings.</p>
        <Link href="/list-equipment" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add New Listing
        </Link>
      </section>
    </div>
  );
}

export function RenterProfileSettingsContent() {
  return (
    <div className="grid gap-8 xl:grid-cols-[1.35fr_0.75fr]">
      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-start gap-5">
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCExv3QOuibAX6OClfz_t075pUbPpJfzqx6sb25CiutKAmBrXyTH1QWiiPw-IW4p5WgJr3Dmm5g5mCx6isTHJzUsHMEW_vpFKttBYWOMjfGTCUxD3GX0E0jCk4LmKjk3uwBC42kquNUrTDYImmkeAjgiHZmhUCvsyaUAo-6qFhAGCwvj9j9M0yI2mPGM7qxvaED16FYQe-i4v3ins77rZpK6wLZFqza2K80SQHrw_rUlDaG0pHpssIDt2u1KfQiEk0X4VVCY3_OBKOq"
                alt="Rajesh Kumar"
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
              <p className="mt-2 text-sm text-on-surface-variant">Manage your owner profile, notifications, and account controls.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-primary">Personal Information</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Full Name</span>
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" defaultValue="Rajesh Kumar" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Location Details</span>
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" defaultValue="Pune, Maharashtra" />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-on-surface">Farm &amp; Workspace</span>
              <textarea className="min-h-[150px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" defaultValue="Service radius: Pune, Satara, Sangli. Fleet focused on tractors and seasonal implements." />
            </label>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-primary">Notification Preferences</h3>
          <div className="mt-5 space-y-3">
            {["New booking requests", "Booking reminders", "Support updates"].map((item, index) => (
              <label key={item} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950">
                <span className="text-sm font-medium text-on-surface dark:text-slate-100">{item}</span>
                <input defaultChecked={index !== 2} type="checkbox" className="h-5 w-5 accent-primary" />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-red-100 bg-white p-6 shadow-sm dark:border-red-900/60 dark:bg-slate-900">
          <h3 className="text-xl font-bold text-red-600">Danger Zone</h3>
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
          <h3 className="text-lg font-bold text-on-surface dark:text-slate-100">Save Changes</h3>
          <p className="text-sm text-on-surface-variant dark:text-slate-400">
            Review your owner profile details and keep your contact information current.
          </p>
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white">
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save All Changes
          </button>
          <button
            type="button"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-200"
          >
            Discard Changes
          </button>
        </div>
      </aside>
    </div>
  );
}

export function RenterProfileSupportContent() {
  return (
    <div className="space-y-8">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["event_busy", "Booking Issue"],
          ["inventory_2", "Listing Issue"],
          ["handshake", "Pricing & Settlement"],
          ["verified_user", "Verification"],
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
          <h2 className="text-2xl font-black text-primary">Support | मदत</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Raise a support request for listing, booking, or verification issues.</p>
          <form className="mt-6 space-y-5">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Brief description of the issue</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="Example: Booking approval pending"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Issue Details</span>
              <textarea
                className="min-h-[180px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="Please provide details, booking IDs, or any relevant context..."
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
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-fixed">Call Support</p>
                <p className="mt-1 text-lg font-bold">{supportContact.phoneDisplay}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-fixed">WhatsApp Support</p>
                <p className="mt-1 text-lg font-bold">{supportContact.whatsappDisplay}</p>
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
              {supportTickets.map((item) => (
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

export function RenterProfileFeedbackContent() {
  return (
    <FeedbackForm
      title="Help us build better tools for equipment owners"
      subtitle="Share platform, fleet, or booking feedback for the owner experience."
      successHref="/owner-profile/feedback/success"
      fields={
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Owner Details</span>
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="e.g. Ramesh Patil" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-on-surface">Contact Number</span>
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="+91 90000 00000" />
            </label>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">Location / Service Area</span>
            <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="e.g. Pune, Nashik" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">Equipment Type</span>
            <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="e.g. Tractor, Harvester" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-on-surface">Request Details</span>
            <textarea className="min-h-[180px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="Please describe what you need and how it would help your business..." />
          </label>
        </>
      }
    />
  );
}

export function RenterProfileFeedbackSuccessContent() {
  return (
    <div className="mx-auto max-w-3xl rounded-[2.5rem] bg-white p-8 text-center shadow-sm dark:bg-slate-900 md:p-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-fixed text-primary">
        <span className="material-symbols-outlined text-4xl">task_alt</span>
      </div>
      <h2 className="mt-6 text-4xl font-black text-primary">Request Submitted Successfully</h2>
      <p className="mt-3 text-lg font-semibold text-on-surface-variant">विनंती यशस्वीरित्या सबमिट केली</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/owner-profile" className="rounded-xl bg-primary-container px-6 py-3 text-sm font-bold text-white">
          Back to Dashboard
        </Link>
        <Link href="/owner-profile/browse" className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-100">
          My Equipment
        </Link>
      </div>
    </div>
  );
}

const earningsPayments = [
  {
    id: "pay_1",
    amount: 12800,
    method: "Direct Settlement",
    status: "completed",
    createdAt: "2026-04-12T09:20:00.000Z",
    bookingId: "BK-4821",
  },
  {
    id: "pay_2",
    amount: 5400,
    method: "Direct Settlement",
    status: "completed",
    createdAt: "2026-04-14T16:45:00.000Z",
    bookingId: "BK-4838",
  },
  {
    id: "pay_3",
    amount: 3200,
    method: "Direct Settlement",
    status: "pending",
    createdAt: "2026-04-16T11:15:00.000Z",
    bookingId: "BK-4845",
  },
  {
    id: "pay_4",
    amount: 1800,
    method: "Direct Settlement",
    status: "cancelled",
    createdAt: "2026-04-17T08:10:00.000Z",
    bookingId: "BK-4851",
  },
];

export function RenterProfileEarningsContent() {
  return <OwnerRevenuePanel linkedBookings={earningsPayments.length} payments={earningsPayments} />;
}
