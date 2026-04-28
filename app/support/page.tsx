"use client";

import { LazyMap } from "@/components/LazyMap";
import { useLanguage } from "@/components/LanguageContext";
import { postJson } from "@/lib/client/forms";
import { SUPPORT_HUB_MARKERS } from "@/lib/map-data";
import { supportContact } from "@/lib/support-contact";
import { type FormEvent, useState, useTransition } from "react";

const supportCategories = [
  {
    icon: "key",
    value: "Rental Inquiry",
    label: { en: "Rent", mr: "भाडे" },
    description: { en: "Find or book equipment", mr: "उपकरण शोधा किंवा बुक करा" },
  },
  {
    icon: "agriculture",
    value: "Equipment Listing",
    label: { en: "List", mr: "नोंदणी" },
    description: { en: "Publish owner equipment", mr: "मालकाची उपकरणे प्रकाशित करा" },
  },
  {
    icon: "calendar_month",
    value: "Booking Support",
    label: { en: "Bookings", mr: "बुकिंग" },
    description: { en: "Booking dates and changes", mr: "बुकिंग तारीख आणि बदल" },
  },
  {
    icon: "payments",
    value: "Payment Issue",
    label: { en: "Payments", mr: "देयके" },
    description: { en: "Payment or pricing help", mr: "पेमेंट किंवा किंमत मदत" },
  },
  {
    icon: "local_shipping",
    value: "Machine Delivery",
    label: { en: "Machine", mr: "मशीन" },
    description: { en: "Delivery and coordination", mr: "वितरण आणि समन्वय" },
  },
  {
    icon: "help",
    value: "Technical Support",
    label: { en: "General", mr: "सामान्य" },
    description: { en: "General platform support", mr: "सामान्य प्लॅटफॉर्म मदत" },
  },
] as const;

const regionalHubs = [
  {
    city: "Kalwan",
    detail: {
      en: "Northern Maharashtra service hub",
      mr: "उत्तर महाराष्ट्र सेवा केंद्र",
    },
  },
  {
    city: "Mukhed",
    detail: {
      en: "Nanded-region support headquarters",
      mr: "नांदेड विभाग सहाय्य मुख्यालय",
    },
  },
] as const;

export default function SupportPage() {
  const { langText } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [submitState, setSubmitState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [formState, setFormState] = useState({
    fullName: "",
    phone: "",
    email: "",
    category: "Rental Inquiry",
    message: "",
  });

  const submitLabel =
    submitState === "pending"
      ? langText("Submitting...", "सबमिट करत आहे...")
      : submitState === "success"
        ? langText("Submitted", "सबमिट झाले")
        : langText("Submit Request", "विनंती सबमिट करा");

  const updateField = (field: keyof typeof formState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitState("pending");

    startTransition(async () => {
      try {
        await postJson<{ ok: boolean; id: string }>("/api/forms/support-request", {
          fullName: formState.fullName,
          phone: formState.phone,
          email: formState.email || undefined,
          category: formState.category,
          message: formState.message,
          sourcePath: "/support",
        });
        setSubmitState("success");
      } catch (submitError) {
        setSubmitState("error");
        setError(submitError instanceof Error ? submitError.message : langText("Support request failed.", "सहाय्य विनंती अयशस्वी झाली."));
      }
    });
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-background">
      <main className="pt-20">
        <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            alt="Panoramic sugarcane field in Maharashtra at sunrise"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK2cmkJApn0nVehtGu1-O_Jh3H-OClLodq9_KX4xxh_OGVj2OqUEJYC-MWqpXMUvo8s6YGuo2rAKTsiptklUZYK2GXmxUasToDyjIKYgZ6d2J_Pkgub_7fiQpQNhcEv8VxQuR8hODqErTQw7TKGyWGg3m2JAGHHxB4iYLF2PqEyPLJBNp5wBelH0ryDM7vxtqJjeDkfd2rhmMS92lXx-3DhPg-r4N2sbauY7gJLOnTcq-cElZZkta36SlaL4MJEYWW9Gmijhd13vep"
          />
          <div className="relative z-10 px-6 text-center">
            <h1 className="font-headline text-4xl font-extrabold text-white md:text-6xl">
              {langText("We're here to help", "आम्ही मदतीसाठी येथे आहोत")}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-white/85">
              {langText(
                "Reach the Kisan Kamai team for rentals, listings, bookings, and account support.",
                "भाडे, उपकरण नोंदणी, बुकिंग आणि खाते मदतीसाठी किसान कमाई टीमशी संपर्क करा."
              )}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {supportCategories.map((category) => {
              const selected = formState.category === category.value;

              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => updateField("category", category.value)}
                  className={`rounded-2xl border p-6 text-center transition-all ${
                    selected
                      ? "border-primary bg-primary-container text-white shadow-xl"
                      : "border-outline-variant bg-surface-container-lowest text-on-surface hover:border-surface-tint hover:shadow-xl"
                  }`}
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-container text-white">
                    <span className="material-symbols-outlined text-3xl">{category.icon}</span>
                  </div>
                  <h3 className="font-bold">{langText(category.label.en, category.label.mr)}</h3>
                  <p className={`mt-1 text-sm ${selected ? "text-white/85" : "text-on-surface-variant dark:text-primary-fixed-dim"}`}>
                    {langText(category.description.en, category.description.mr)}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-5">
          <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm lg:col-span-3 md:p-10">
            <h2 className="text-3xl font-extrabold text-primary">
              {langText("Send us a message", "आम्हाला संदेश पाठवा")}
            </h2>
            <p className="mb-8 mt-2 text-on-surface-variant">
              {langText("Our team will contact you as soon as possible.", "आमची टीम लवकरच तुमच्याशी संपर्क साधेल.")}
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-primary">{langText("Full Name", "पूर्ण नाव")}</span>
                  <input
                    value={formState.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    className="kk-input"
                    placeholder={langText("Rahul Patil", "राहुल पाटील")}
                    type="text"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-primary">{langText("Phone", "फोन नंबर")}</span>
                  <input
                    value={formState.phone}
                    onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="kk-input"
                    placeholder={langText("Enter 10 digit mobile number", "१० अंकी मोबाईल नंबर टाका")}
                    type="tel"
                    inputMode="numeric"
                    required
                  />
                </label>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-primary">{langText("Email", "ईमेल")}</span>
                  <input
                    value={formState.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className="kk-input"
                    placeholder="name@example.com"
                    type="email"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-primary">{langText("Category", "वर्गवारी")}</span>
                  <select
                    value={formState.category}
                    onChange={(event) => updateField("category", event.target.value)}
                    className="kk-input"
                  >
                    {supportCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {langText(category.label.en, category.label.mr)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-primary">{langText("Message", "संदेश")}</span>
                <textarea
                  value={formState.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  className="kk-input min-h-[150px]"
                  placeholder={langText("Tell us how we can help...", "आम्ही कशी मदत करू शकतो ते सांगा...")}
                  required
                />
              </label>
              {error ? (
                <div className="rounded-xl border border-error/20 bg-error-container px-4 py-3 text-sm font-medium text-error">
                  {error}
                </div>
              ) : null}
              <button
                className={`kk-flow-button flex w-full items-center justify-center gap-2 rounded-xl py-4 text-lg font-bold text-white ${
                  submitState === "success" ? "bg-emerald-600" : "bg-primary-container"
                }`}
                type="submit"
                disabled={isPending}
                data-loading={isPending ? "true" : "false"}
                aria-busy={isPending}
              >
                {isPending ? <span className="kk-flow-spinner" aria-hidden="true" /> : null}
                {submitLabel}
                <span className="material-symbols-outlined">
                  {submitState === "success" ? "task_alt" : "send"}
                </span>
              </button>
            </form>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div id="direct-channels" className="rounded-3xl bg-primary-container p-8 text-white">
              <h3 className="text-2xl font-bold">{langText("Direct Channels", "थेट संपर्क")}</h3>
              <div className="mt-6 space-y-8">
                <ContactLine icon="call" title={langText("Call Us", "कॉल करा")} primary={supportContact.phoneDisplay} secondary={`${supportContact.serviceHours} ${langText("Daily", "दररोज")}`} />
                <ContactLine icon="forum" title="WhatsApp" primary={langText(`Chat with ${supportContact.primaryContactName}`, `${supportContact.primaryContactName} यांच्याशी चॅट करा`)} secondary={supportContact.whatsappDisplay} />
                <ContactLine icon="mail" title={langText("Email", "ईमेल")} primary={supportContact.email} secondary={langText("24/48 hr response", "२४/४८ तासांत प्रतिसाद")} />
              </div>
            </div>

            <div className="rounded-3xl bg-tertiary-container p-8 text-white">
              <div className="mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary-fixed">verified_user</span>
                <h4 className="text-lg font-bold">{langText("Owner Support Priority", "मालकांसाठी प्राधान्य सहाय्य")}</h4>
              </div>
              <p className="text-sm leading-relaxed text-white/80">
                {langText(
                  "Equipment owners can use this channel for listing, maintenance, and deployment coordination.",
                  "उपकरण मालक नोंदणी, देखभाल आणि वितरण समन्वयासाठी हा संपर्क वापरू शकतात."
                )}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low px-6 py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-12 md:flex-row md:items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-extrabold text-primary">
                {langText("Regional Support Hubs", "प्रादेशिक सहाय्य केंद्रे")}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-on-surface-variant">
                {langText(
                  "Current public support coverage is focused on Kalwan and Mukhed.",
                  "सध्या सार्वजनिक सहाय्य कळवण आणि मुखेड भागांवर केंद्रित आहे."
                )}
              </p>
              <div className="mt-8 space-y-4">
                {regionalHubs.map((hub) => (
                  <div key={hub.city} className="flex items-center justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
                    <div>
                      <p className="text-xl font-bold text-primary">{hub.city}</p>
                      <p className="text-sm text-on-surface-variant">{langText(hub.detail.en, hub.detail.mr)}</p>
                    </div>
                    <span className="material-symbols-outlined text-secondary">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="overflow-hidden rounded-[2.5rem] border-8 border-surface-container-lowest shadow-2xl">
                <LazyMap
                  center={[19.62, 75.58]}
                  zoom={6}
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

        <section className="relative flex min-h-[280px] items-center overflow-hidden">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            alt="Smiling Indian farmer standing in a golden wheat field at sunset"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdj-by0sXYvLBIrvGYViSBZkk5i4Nr-zEtpE0S9WPbZKTBOPq7lkgPu1oJ5sgap8nM1Ozpout85-xGpst9bAssJz0A6HWCMDQZW9VbUPBzUy2YAu5Cim_0V_X6iVIYR23J7y7yTHYhcFdbMewyoWe30Qeuu6pyKp8cn9KOnR0g5MZ6wZ5fVAW4r1gzB401zBKPEQN8uQ1fc7XctKpeopjg9mAWI-wEa2v6KvVHVibhPqq2tYH6pv4LJf7RTFlNZ1ZaBl7SN3LKuHEZ"
          />
          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 px-8 py-12 md:flex-row">
            <div className="text-white">
              <h2 className="text-4xl font-extrabold">{langText("Need help right now?", "आत्ताच मदत हवी आहे का?")}</h2>
              <p className="mt-2 text-xl text-primary-fixed-dim">
                {langText("Call or message our support team.", "आमच्या सहाय्य टीमला कॉल किंवा संदेश करा.")}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#direct-channels"
                className="kk-deep-cta flex items-center gap-2 rounded-2xl px-10 py-5 text-lg font-bold"
              >
                <span className="material-symbols-outlined">call</span>
                {langText("Call Support", "सहाय्याला कॉल करा")}
              </a>
              <a
                href={supportContact.whatsappHref}
                className="rounded-2xl bg-[#1f9d57] px-10 py-5 text-lg font-bold text-white shadow-xl transition-colors hover:bg-[#178045]"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ContactLine({
  icon,
  title,
  primary,
  secondary,
}: {
  icon: string;
  title: string;
  primary: string;
  secondary: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
        <span className="material-symbols-outlined text-white">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">{title}</p>
        <p className="mt-1 break-words text-xl font-bold">{primary}</p>
        <p className="text-sm text-white/70">{secondary}</p>
      </div>
    </div>
  );
}
