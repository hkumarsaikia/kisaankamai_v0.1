"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LazyMap } from "@/components/LazyMap";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/ScrollReveal";
import { useLanguage } from "@/components/LanguageContext";
import { postJson, SubmissionError } from "@/lib/client/forms";
import { RENT_RESULTS_CIRCLES, RENT_RESULTS_MARKERS } from "@/lib/map-data";
import { callbackRequestSchema } from "@/lib/validation/forms";
import { useSmoothRouter } from "@/lib/client/useSmoothRouter";
import { FormEvent, ReactNode, useMemo, useState } from "react";

export default function RentEquipmentClient({
  initialLocation,
  initialQuery,
  children,
}: {
  initialLocation: string;
  initialQuery: string;
  children: ReactNode;
}) {
  const { t } = useLanguage();
  const router = useSmoothRouter();
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
        t("rent-equipment.RentEquipmentClient.location_not_found_in_our_system_showing_nearby_available_hubs")
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
        t("rent-equipment.RentEquipmentClient.please_fill_the_callback_form_correctly");
      setCallbackError(fieldError);
      return;
    }

    setIsSubmittingCallback(true);

    try {
      await postJson("/api/forms/callback-request", parsed.data);
      setCallbackSuccess(
        t("rent-equipment.RentEquipmentClient.callback_request_received_our_team_will_contact_you_shortly")
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
          t("rent-equipment.RentEquipmentClient.could_not_submit_your_callback_request_right_now")
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
                  className="kk-form-search-input"
                  placeholder={t("rent-equipment.RentEquipmentClient.enter_location_or_pincode")}
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
                  className="kk-form-search-input"
                  placeholder={t("rent-equipment.RentEquipmentClient.search_tractors_harvesters")}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && applySearch()}
                />
              </div>
              <button
                type="button"
                onClick={applySearch}
                className="kk-form-primary-button"
              >
                {t("rent-equipment.RentEquipmentClient.refresh_results")}
              </button>
            </div>

            {suggestionMsg ? (
              <div className="kk-form-muted-banner">
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
                  {t("rent-equipment.RentEquipmentClient.available_equipment")}
                </h1>
                <p className="mt-2 max-w-2xl font-medium text-on-surface-variant dark:text-slate-400">
                  {t("rent-equipment.RentEquipmentClient.browse_cached_listings_from_trusted_owners_results_revalidate_in_the_background_while_the_shell_stays_interactive")}
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
                    {t("rent-equipment.RentEquipmentClient.need_help_finding_the_right_machine")}
                  </h2>
                  <p className="mt-4 text-lg font-medium text-on-surface-variant dark:text-slate-400">
                    {t("rent-equipment.RentEquipmentClient.share_your_requirement_and_our_team_will_help_you_match_with_a_nearby_owner")}
                  </p>
                </div>

                <form
                  className="kk-form-compact-card w-full md:w-96"
                  onSubmit={handleCallbackSubmit}
                >
                  <h3 className="mb-5 text-lg font-black text-primary dark:text-emerald-50">
                    {t("rent-equipment.RentEquipmentClient.request_callback")}
                  </h3>
                  <div className="space-y-4">
                    <input
                      className="kk-input"
                      placeholder={t("rent-equipment.RentEquipmentClient.full_name")}
                      value={callbackForm.fullName}
                      onChange={(event) =>
                        setCallbackForm((prev) => ({ ...prev, fullName: event.target.value }))
                      }
                    />
                    <input
                      className="kk-input"
                      placeholder={t("rent-equipment.RentEquipmentClient.10_digit_phone_number")}
                      value={callbackForm.phone}
                      onChange={(event) =>
                        setCallbackForm((prev) => ({
                          ...prev,
                          phone: event.target.value.replace(/\D/g, "").slice(0, 10),
                        }))
                      }
                    />
                    <input
                      className="kk-input"
                      placeholder={t("rent-equipment.RentEquipmentClient.equipment_needed")}
                      value={callbackForm.equipmentNeeded}
                      onChange={(event) =>
                        setCallbackForm((prev) => ({ ...prev, equipmentNeeded: event.target.value }))
                      }
                    />
                    <input
                      className="kk-input"
                      placeholder={t("rent-equipment.RentEquipmentClient.village_location")}
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
                    className="kk-form-primary-button mt-5 w-full"
                  >
                    {isSubmittingCallback
                      ? t("rent-equipment.RentEquipmentClient.submitting")
                      : t("rent-equipment.RentEquipmentClient.get_free_callback")}
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
                markers={RENT_RESULTS_MARKERS}
                circles={RENT_RESULTS_CIRCLES}
                height="400px"
                className="rounded-3xl border-4 border-white shadow-2xl dark:border-slate-800"
                showControls
              />
            </ScrollRevealItem>
            <ScrollRevealItem>
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-secondary dark:text-amber-400">
                  {t("rent-equipment.RentEquipmentClient.trust_and_safety")}
                </span>
                <h2 className="mt-4 text-4xl font-black text-primary dark:text-emerald-50">
                  {t("rent-equipment.RentEquipmentClient.every_listing_is_reviewed_before_it_goes_live")}
                </h2>
                <div className="mt-8 space-y-6">
                  {[
                    t("rent-equipment.RentEquipmentClient.mechanical_inspections_for_listed_machinery"),
                    t("rent-equipment.RentEquipmentClient.transparent_pricing_with_verified_owners"),
                    t("rent-equipment.RentEquipmentClient.local_support_for_delivery_and_coordination"),
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

