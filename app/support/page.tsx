import { LazyMap } from "@/components/LazyMap";
import { SUPPORT_HUB_MARKERS } from "@/lib/map-data";

const supportCategories = [
  ["key", "Rent", "भाड्याने घेणे"],
  ["agriculture", "List", "नोंदणी करा"],
  ["calendar_month", "Bookings", "बुकिंग"],
  ["payments", "Payments", "देयके"],
  ["local_shipping", "Machine", "मशीन/वितरण"],
  ["help", "General", "सामान्य प्रश्न"],
] as const;

const faqItems = [
  {
    question: "How is the equipment condition verified?",
    answer:
      "Every machine on Kisan Kamai undergoes a 20-point quality check by local hub managers before being listed.",
  },
  {
    question: "What happens if a breakdown occurs?",
    answer:
      "Contact our emergency helpline immediately. We dispatch a technician or arrange a replacement machine quickly based on local availability.",
  },
  {
    question: "Are there any hidden service charges?",
    answer:
      "No. The price you see includes clearly listed fees. Diesel and operator costs are shown before booking.",
  },
  {
    question: "How do I cancel a booking?",
    answer:
      "Cancellations made before the slot follow the booking terms shown during checkout. Our team can help review time-sensitive cases.",
  },
  {
    question: "How do I list multiple machines?",
    answer:
      "Owners can list multiple machines and manage them from the equipment workspace with listing and booking support.",
  },
];

export default function SupportPage() {
  return (
    <div className="bg-background text-on-background font-body min-h-screen">
      <main className="pt-20">
        <section className="relative flex h-[420px] items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-primary-container/40 z-10" />
          <img
            className="absolute inset-0 h-full w-full object-cover"
            alt="Panoramic sugarcane field in Maharashtra at sunrise"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK2cmkJApn0nVehtGu1-O_Jh3H-OClLodq9_KX4xxh_OGVj2OqUEJYC-MWqpXMUvo8s6YGuo2rAKTsiptklUZYK2GXmxUasToDyjIKYgZ6d2J_Pkgub_7fiQpQNhcEv8VxQuR8hODqErTQw7TKGyWGg3m2JAGHHxB4iYLF2PqEyPLJBNp5wBelH0ryDM7vxtqJjeDkfd2rhmMS92lXx-3DhPg-r4N2sbauY7gJLOnTcq-cElZZkta36SlaL4MJEYWW9Gmijhd13vep"
          />
          <div className="relative z-20 px-6 text-center">
            <h1 className="font-headline text-4xl font-extrabold text-white md:text-6xl">
              We&apos;re here to help
              <br />
              <span className="font-semibold text-3xl md:text-5xl">आम्ही मदतीसाठी येथे आहोत</span>
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {supportCategories.map(([icon, title, subtitle]) => (
              <div
                key={title}
                className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 text-center transition-all hover:border-surface-tint hover:shadow-xl"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-fixed text-primary-container">
                  <span className="material-symbols-outlined text-3xl">{icon}</span>
                </div>
                <h3 className="font-bold text-primary">{title}</h3>
                <p className="text-sm text-on-surface-variant">{subtitle}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-5">
          <div className="rounded-3xl border border-emerald-900/5 bg-white p-10 shadow-sm lg:col-span-3">
            <h2 className="text-3xl font-extrabold text-primary">Send us a message</h2>
            <p className="mb-8 mt-2 text-on-surface-variant">
              आम्हाला संदेश पाठवा - आमची टीम लवकरच संपर्क साधेल.
            </p>
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-primary">Full Name / पूर्ण नाव</span>
                  <input className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 outline-none focus:ring-2 focus:ring-primary" placeholder="Rahul Patil" type="text" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-primary">Phone / फोन नंबर</span>
                  <input className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 outline-none focus:ring-2 focus:ring-primary" placeholder="+91 00000 00000" type="tel" />
                </label>
              </div>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-primary">Category / वर्गवारी</span>
                <select className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 outline-none focus:ring-2 focus:ring-primary">
                  <option>Rental Inquiry</option>
                  <option>Equipment Listing</option>
                  <option>Payment Issue</option>
                  <option>Technical Support</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-primary">Message / संदेश</span>
                <textarea className="min-h-[150px] w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 outline-none focus:ring-2 focus:ring-primary" placeholder="Tell us how we can help..." />
              </label>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container py-4 text-lg font-bold text-white" type="button">
                Submit Request / विनंती सबमिट करा
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl bg-primary-container p-8 text-white">
              <h3 className="text-2xl font-bold">Direct Channels</h3>
              <div className="mt-6 space-y-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <span className="material-symbols-outlined text-white">call</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">Call Us</p>
                    <p className="mt-1 text-xl font-bold">+91 1800 555 0123</p>
                    <p className="text-sm text-white/70">8 AM - 8 PM Daily</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <span className="material-symbols-outlined text-white">forum</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">WhatsApp</p>
                    <p className="mt-1 text-xl font-bold">Chat with Kisan Mitra</p>
                    <p className="text-sm text-white/70">Marathi &amp; English Support</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <span className="material-symbols-outlined text-white">mail</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">Email</p>
                    <p className="mt-1 text-xl font-bold">support@kisankamai.com</p>
                    <p className="text-sm text-white/70">24/48 hr response</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-tertiary-container p-8 text-white">
              <div className="mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary-fixed">verified_user</span>
                <h4 className="font-bold text-lg">Owner Support Priority</h4>
              </div>
              <p className="text-sm leading-relaxed text-white/80">
                Are you an equipment owner? Use our specialized helpline for machine maintenance and deployment coordination.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low px-6 py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-12 md:flex-row md:items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-extrabold text-primary">Regional Support Hubs</h2>
              <p className="mt-6 text-lg leading-relaxed text-on-surface-variant">
                We understand rural India. Our physical hubs in Southern Maharashtra ensure that help is never too far away from your village.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  ["Sangli", "Central Distribution & Support Hub"],
                  ["Satara", "Equipment Inspection Center"],
                  ["Kolhapur", "Owner Onboarding & Training"],
                ].map(([city, detail]) => (
                  <div key={city} className="flex items-center justify-between rounded-2xl border border-outline-variant bg-white p-6">
                    <div>
                      <p className="text-xl font-bold text-primary">{city}</p>
                      <p className="text-sm text-on-surface-variant">{detail}</p>
                    </div>
                    <span className="material-symbols-outlined text-secondary">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl">
                <LazyMap
                  center={[16.82, 74.57]}
                  zoom={8}
                  markers={SUPPORT_HUB_MARKERS}
                  height="400px"
                  className="rounded-none"
                  showControls
                  deferUntilVisible={false}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-24">
          <h2 className="mb-12 text-center text-4xl font-extrabold text-primary">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details
                key={item.question}
                className="overflow-hidden rounded-2xl border border-outline-variant bg-white"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-6">
                  <span className="text-lg font-bold text-primary">{item.question}</span>
                  <span className="material-symbols-outlined">expand_more</span>
                </summary>
                <div className="border-t border-outline-variant/50 px-6 pb-6 pt-4 text-on-surface-variant">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto mb-16 max-w-7xl px-6">
          <div className="rounded-[40px] border border-white bg-surface-container-high p-12 text-center">
            <h3 className="mb-12 text-3xl font-extrabold text-primary">Rooted in trust, driven by support</h3>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
              {[
                ["verified", "Verified Owners"],
                ["gavel", "Legal Protection"],
                ["handshake", "Fair Pricing"],
              ].map(([icon, label]) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                    <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative flex min-h-[280px] items-center overflow-hidden">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            alt="Smiling Indian farmer standing in a golden wheat field at sunset"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdj-by0sXYvLBIrvGYViSBZkk5i4Nr-zEtpE0S9WPbZKTBOPq7lkgPu1oJ5sgap8nM1Ozpout85-xGpst9bAssJz0A6HWCMDQZW9VbUPBzUy2YAu5Cim_0V_X6iVIYR23J7y7yTHYhcFdbMewyoWe30Qeuu6pyKp8cn9KOnR0g5MZ6wZ5fVAW4r1gzB401zBKPEQN8uQ1fc7XctKpeopjg9mAWI-wEa2v6KvVHVibhPqq2tYH6pv4LJf7RTFlNZ1ZaBl7SN3LKuHEZ"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/80 to-transparent" />
          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 px-8 py-12 md:flex-row">
            <div className="text-white">
              <h2 className="text-4xl font-extrabold">Need help right now?</h2>
              <p className="mt-2 text-xl text-primary-fixed-dim">त्वरीत मदतीची आवश्यकता आहे? आम्हाला कॉल करा.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 rounded-2xl bg-secondary px-10 py-5 text-lg font-bold text-white shadow-xl transition-colors hover:bg-on-secondary-fixed-variant" type="button">
                <span className="material-symbols-outlined">call</span>
                Call Support
              </button>
              <button className="rounded-2xl bg-[#1f9d57] px-10 py-5 text-lg font-bold text-white shadow-xl transition-colors hover:bg-[#178045]" type="button">
                WhatsApp
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
