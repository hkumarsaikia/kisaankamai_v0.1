"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LazyMap } from "@/components/LazyMap";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/ScrollReveal";
import { useLanguage } from "@/components/LanguageContext";
import { postJson, SubmissionError } from "@/lib/client/forms";
import { IS_PAGES_BUILD } from "@/lib/runtime";
import { callbackRequestSchema } from "@/lib/validation/forms";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useMemo, useState } from "react";

const nearbyMarkers = [
  { lat: 16.86, lng: 74.57, label: "Mahindra 575 DI", sublabel: "₹800/hr • 4.2 km away", color: "#00251a" },
  { lat: 16.84, lng: 74.52, label: "John Deere W70", sublabel: "₹2,500/hr • 8.5 km away", color: "#934a24" },
  { lat: 16.87, lng: 74.55, label: "Shaktiman Rotavator", sublabel: "₹350/hr • 1.2 km away", color: "#693c00" },
];

export default function RentEquipmentClient({
  initialLocation,
  initialQuery,
  children,
}: {
  initialLocation: string;
  initialQuery: string;
  children: ReactNode;
}) {
  const { langText } = useLanguage();
  const router = useRouter();
  const [location, setLocation] = useState(initialLocation);
  const [query, setQuery] = useState(initialQuery);
  const [callbackError, setCallbackError] = useState("");
  const [callbackSuccess, setCallbackSuccess] = useState("");
  const [isSubmittingCallback, setIsSubmittingCallback] = useState(false);
  const [suggestionMsg, setSuggestionMsg] = useState("");

  const [callbackForm, setCallbackForm] = useState({
    fullName: "",
    phone: "",
    equipmentNeeded: initialQuery || "",
    location: initialLocation || "",
  });

  const normalizedLocation = useMemo(() => location.trim(), [location]);

  const applySearch = () => {
    const params = new URLSearchParams();
    if (normalizedLocation) params.set("location", normalizedLocation);
    if (query.trim()) params.set("query", query.trim());

    const nextHref = params.toString() ? `/rent-equipment?${params.toString()}` : "/rent-equipment";
    router.replace(nextHref);

    if (/^\d{6}$/.test(normalizedLocation) && normalizedLocation !== "423501" && normalizedLocation !== "431715") {
      setSuggestionMsg(
        langText(
          "Location not found in our system. Showing nearby available hubs.",
          "आमच्या सिस्टममध्ये स्थान आढळले नाही. जवळील उपलब्ध हब दाखवत आहोत."
        )
      );
    } else {
      setSuggestionMsg("");
    }
  };

  const handleCallbackSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCallbackError("");
    setCallbackSuccess("");

    const parsed = callbackRequestSchema.safeParse(callbackForm);
    if (!parsed.success) {
      const fieldError =
        parsed.error.flatten().formErrors[0] ||
        Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
        langText("Please fill the callback form correctly.", "कृपया callback फॉर्म योग्यरित्या भरा.");
      setCallbackError(fieldError);
      return;
    }

    setIsSubmittingCallback(true);

    try {
      if (!IS_PAGES_BUILD) {
        await postJson("/api/forms/callback-request", parsed.data);
      }
      setCallbackSuccess(
        langText(
          "Callback request received. Our team will contact you shortly.",
          "Callback विनंती मिळाली. आमची टीम लवकरच तुमच्याशी संपर्क करेल."
        )
      );
      setCallbackForm({
        fullName: "",
        phone: "",
        equipmentNeeded: "",
        location: normalizedLocation,
      });
    } catch (error) {
      if (error instanceof SubmissionError) {
        setCallbackError(error.message);
      } else {
        setCallbackError(
          langText(
            "Could not submit your callback request right now.",
            "सध्या तुमची callback विनंती पाठवता आली नाही."
          )
        );
      }
    } finally {
      setIsSubmittingCallback(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow">
        <section className="sticky top-[72px] z-40 border-b border-outline-variant/30 bg-white dark:border-slate-800/50 dark:bg-slate-950">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative w-full md:w-1/3">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400">
                  location_on
                </span>
                <input
                  className="w-full rounded-xl border-none bg-surface-container-low py-3 pl-12 pr-4 font-medium focus:ring-2 focus:ring-primary-container dark:bg-slate-900/50 dark:text-white"
                  placeholder={langText("Enter location or pincode", "स्थान किंवा पिनकोड टाका")}
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  onBlur={applySearch}
                  onKeyDown={(event) => event.key === "Enter" && applySearch()}
                />
              </div>
              <div className="relative w-full md:w-1/2">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400">
                  search
                </span>
                <input
                  className="w-full rounded-xl border-none bg-surface-container-low py-3 pl-12 pr-4 font-medium focus:ring-2 focus:ring-primary-container dark:bg-slate-900/50 dark:text-white"
                  placeholder={langText("Search tractors, harvesters...", "ट्रॅक्टर, हार्वेस्टर शोधा...")}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && applySearch()}
                />
              </div>
              <button
                type="button"
                onClick={applySearch}
                className="rounded-xl bg-primary-container px-6 py-3 font-black text-white transition-colors hover:bg-primary dark:bg-emerald-700 dark:hover:bg-emerald-600"
              >
                {langText("Refresh Results", "निकाल अद्यतनित करा")}
              </button>
            </div>

            {suggestionMsg ? (
              <div className="rounded-lg border border-amber-200 bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                {suggestionMsg}
              </div>
            ) : null}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8">
          <ScrollReveal className="mb-10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h1 className="text-3xl font-black text-primary dark:text-emerald-50">
                  {langText("Available Equipment", "उपलब्ध उपकरणे")}
                </h1>
                <p className="mt-2 max-w-2xl font-medium text-on-surface-variant dark:text-slate-400">
                  {langText(
                    "Browse cached listings from trusted owners. Results revalidate in the background while the shell stays interactive.",
                    "विश्वसनीय मालकांकडील cached listings पाहा. page shell interactive राहते आणि results background मध्ये अद्ययावत होतात."
                  )}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {children}

          <ScrollReveal className="mt-20">
            <div className="rounded-3xl bg-gradient-to-r from-emerald-100 to-amber-50 p-1 dark:from-emerald-900/50 dark:to-amber-900/20">
              <div className="flex flex-col justify-between gap-8 rounded-[22px] bg-white/70 p-8 backdrop-blur-xl md:flex-row md:p-12 dark:bg-slate-950/60">
                <div className="max-w-xl">
                  <h2 className="text-3xl font-black text-primary dark:text-emerald-50">
                    {langText("Need help finding the right machine?", "योग्य मशीन शोधण्यासाठी मदत हवी आहे?")}
                  </h2>
                  <p className="mt-4 text-lg font-medium text-on-surface-variant dark:text-slate-400">
                    {langText(
                      "Share your requirement and our team will help you match with a nearby owner.",
                      "तुमची गरज सांगा आणि आमची टीम तुम्हाला जवळच्या मालकाशी जोडेल."
                    )}
                  </p>
                </div>

                <form
                  className="w-full rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-xl md:w-96 dark:border-slate-800/50 dark:bg-slate-900/50"
                  onSubmit={handleCallbackSubmit}
                >
                  <h3 className="mb-5 text-lg font-black text-primary dark:text-emerald-50">
                    {langText("Request Callback", "कॉलबॅक विनंती")}
                  </h3>
                  <div className="space-y-4">
                    <input
                      className="w-full rounded-xl bg-surface-container-low px-4 py-3 font-medium dark:bg-slate-900/60 dark:text-white"
                      placeholder={langText("Full name", "पूर्ण नाव")}
                      value={callbackForm.fullName}
                      onChange={(event) =>
                        setCallbackForm((prev) => ({ ...prev, fullName: event.target.value }))
                      }
                    />
                    <input
                      className="w-full rounded-xl bg-surface-container-low px-4 py-3 font-medium dark:bg-slate-900/60 dark:text-white"
                      placeholder={langText("10-digit phone number", "१० अंकी फोन नंबर")}
                      value={callbackForm.phone}
                      onChange={(event) =>
                        setCallbackForm((prev) => ({
                          ...prev,
                          phone: event.target.value.replace(/\D/g, "").slice(0, 10),
                        }))
                      }
                    />
                    <input
                      className="w-full rounded-xl bg-surface-container-low px-4 py-3 font-medium dark:bg-slate-900/60 dark:text-white"
                      placeholder={langText("Equipment needed", "आवश्यक उपकरण")}
                      value={callbackForm.equipmentNeeded}
                      onChange={(event) =>
                        setCallbackForm((prev) => ({ ...prev, equipmentNeeded: event.target.value }))
                      }
                    />
                    <input
                      className="w-full rounded-xl bg-surface-container-low px-4 py-3 font-medium dark:bg-slate-900/60 dark:text-white"
                      placeholder={langText("Village / location", "गाव / स्थान")}
                      value={callbackForm.location}
                      onChange={(event) =>
                        setCallbackForm((prev) => ({ ...prev, location: event.target.value }))
                      }
                    />
                  </div>

                  {callbackError ? (
                    <p className="mt-4 text-sm font-semibold text-red-600 dark:text-red-400">{callbackError}</p>
                  ) : null}
                  {callbackSuccess ? (
                    <p className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-400">{callbackSuccess}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmittingCallback}
                    className="mt-5 w-full rounded-xl bg-secondary py-4 font-black uppercase tracking-wide text-white transition-transform hover:scale-[0.99] disabled:opacity-60"
                  >
                    {isSubmittingCallback
                      ? langText("Submitting...", "पाठवत आहे...")
                      : langText("Get Free Callback", "विनामूल्य कॉलबॅक मिळवा")}
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>

          <ScrollRevealGroup className="mt-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <ScrollRevealItem>
              <LazyMap
                center={[16.855, 74.56]}
                zoom={12}
                markers={nearbyMarkers}
                circles={[{ lat: 16.855, lng: 74.56, radius: 4000, color: "#10b981" }]}
                height="400px"
                className="rounded-3xl border-4 border-white shadow-2xl dark:border-slate-800"
                showControls
              />
            </ScrollRevealItem>
            <ScrollRevealItem>
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-secondary dark:text-amber-400">
                  {langText("Trust & Safety", "विश्वास व सुरक्षा")}
                </span>
                <h2 className="mt-4 text-4xl font-black text-primary dark:text-emerald-50">
                  {langText("Every listing is reviewed before it goes live.", "प्रत्येक listing live होण्यापूर्वी तपासली जाते.")}
                </h2>
                <div className="mt-8 space-y-6">
                  {[
                    langText("Mechanical inspections for listed machinery.", "सूचीबद्ध मशीनची यांत्रिक तपासणी."),
                    langText("Transparent pricing with verified owners.", "सत्यापित मालकांसह पारदर्शक किंमत."),
                    langText("Local support for delivery and coordination.", "डिलिव्हरी आणि समन्वयासाठी स्थानिक सपोर्ट."),
                  ].map((item) => (
                    <div key={item} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900 dark:bg-slate-900/50 dark:text-emerald-400">
                        <span className="material-symbols-outlined">verified</span>
                      </div>
                      <p className="font-medium text-on-surface-variant dark:text-slate-400">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollRevealItem>
          </ScrollRevealGroup>
        </section>
      </main>
      <Footer />
    </div>
  );
}
