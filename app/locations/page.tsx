"use client";

import { FormEvent, useState, useTransition } from "react";
import { submitCallbackRequestAction } from "@/lib/actions/firebase-data";
import { AppLink } from "@/components/AppLink";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LazyMap } from "@/components/LazyMap";
import { useLanguage } from "@/components/LanguageContext";
import { FormField, FormGrid, FormNotice, FormSection, FormShell, FormStepActions } from "@/components/forms/FormKit";
import { LOCATIONS_OVERVIEW_CIRCLES, LOCATIONS_OVERVIEW_MARKERS, REGIONAL_HUBS } from "@/lib/map-data";
import { callbackRequestSchema } from "@/lib/validation/forms";

export default function LocationsPage() {
  const { langText } = useLanguage();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState({
    fullName: "",
    phone: "",
    location: "",
    equipmentNeeded: "",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const parsed = callbackRequestSchema.safeParse(formState);
    if (!parsed.success) {
      setError(
        parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          "Please complete the expansion request correctly."
      );
      return;
    }

    startTransition(async () => {
      const result = await submitCallbackRequestAction(parsed.data);
      if (!result.ok) {
        setError(result.error || "Could not submit the expansion request right now.");
        return;
      }
      setSuccess("Expansion request saved locally. Our team can now review this cluster.");
      setStep(1);
      setFormState({ fullName: "", phone: "", location: "", equipmentNeeded: "" });
    });
  };

  return (
    <div className="kk-page flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <section className="mx-auto max-w-7xl px-6">
          <div className="rounded-[2rem] bg-primary px-8 py-12 text-white shadow-xl md:px-12">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-secondary-fixed">
              {langText("Coverage and expansion", "सेवा क्षेत्र आणि विस्तार")}
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              {langText("Real service coverage across Maharashtra", "महाराष्ट्रभर खरे सेवा कव्हरेज")}
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-medium text-white/82">
              {langText(
                "This page now uses the live website map stack instead of a decorative placeholder. Active hubs, emerging clusters, and expansion requests are all tied to the same shared map dataset.",
                "ही पेज आता केवळ सजावटी प्रतिमेऐवजी प्रत्यक्ष वेबसाइट नकाशा स्टॅक वापरते. सक्रिय हब, वाढणारे क्लस्टर आणि विस्तार विनंत्या एकाच सामायिक नकाशा डेटाशी जोडल्या आहेत."
              )}
            </p>
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-7xl gap-8 px-6 lg:grid-cols-[minmax(0,1.2fr)_380px]">
          <div className="kk-panel overflow-hidden p-4">
            <div className="mb-4 flex items-end justify-between gap-4 px-2">
              <div>
                <h2 className="text-2xl font-black text-primary">
                  {langText("Interactive service map", "इंटरॅक्टिव्ह सेवा नकाशा")}
                </h2>
                <p className="mt-2 text-sm font-medium text-on-surface-variant">
                  {langText("Leaflet/OpenStreetMap is used automatically on localhost when Google Maps is unavailable.", "लोकलहोस्टवर Google Maps उपलब्ध नसल्यास Leaflet/OpenStreetMap आपोआप वापरले जाते.")}
                </p>
              </div>
              <AppLink href="/support" className="kk-button-outline">
                {langText("Need help?", "मदत हवी आहे?")}
              </AppLink>
            </div>
            <LazyMap
              center={[17.05, 74.4]}
              zoom={8}
              markers={LOCATIONS_OVERVIEW_MARKERS}
              circles={LOCATIONS_OVERVIEW_CIRCLES}
              height="560px"
              className="rounded-[1.5rem]"
              showControls
            />
          </div>

          <FormShell
            eyebrow={langText("Expansion request", "विस्तार विनंती")}
            title={langText("Bring Kisan Kamai to your cluster", "तुमच्या क्लस्टरमध्ये किसान कमाई आणा")}
            description={langText(
              "This uses the same local callback request pipeline as the rest of the website. We kept the existing request details, but upgraded the experience into a guided flow.",
              "हे वेबसाइटवरील इतर भागांसारखेच स्थानिक callback request pipeline वापरते. विद्यमान तपशील तसेच ठेवून अनुभव guided flow मध्ये उन्नत केला आहे."
            )}
            step={step}
            totalSteps={2}
            aside={
              <div className="space-y-4">
                <h3 className="text-lg font-black text-primary">{langText("Live regional hubs", "सक्रिय प्रादेशिक हब")}</h3>
                <div className="space-y-3">
                  {REGIONAL_HUBS.map((hub) => (
                    <AppLink key={hub.slug} href={`/locations/${hub.slug}`} className="block rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 transition-colors hover:border-primary">
                      <p className="font-black text-on-surface">{hub.name}</p>
                      <p className="mt-1 text-sm font-medium text-on-surface-variant">{hub.description}</p>
                    </AppLink>
                  ))}
                </div>
              </div>
            }
          >
            <form onSubmit={handleSubmit}>
              {error ? <FormNotice tone="error">{error}</FormNotice> : null}
              {success ? <FormNotice tone="success">{success}</FormNotice> : null}

              {step === 1 ? (
                <FormSection
                  title={langText("Who should we contact?", "आम्ही कोणाशी संपर्क साधू?")}
                  description={langText("We only need the same core details already collected elsewhere in the site.", "साइटवरील इतर ठिकाणी घेतले जाणारे तेच मूलभूत तपशील येथे आवश्यक आहेत.")}
                >
                  <FormGrid>
                    <FormField label={langText("Full name", "पूर्ण नाव")} required>
                      <input className="kk-input" value={formState.fullName} onChange={(event) => setFormState((current) => ({ ...current, fullName: event.target.value }))} />
                    </FormField>
                    <FormField label={langText("Phone", "फोन")} required>
                      <input className="kk-input" value={formState.phone} onChange={(event) => setFormState((current) => ({ ...current, phone: event.target.value.replace(/\D/g, "").slice(0, 10) }))} />
                    </FormField>
                  </FormGrid>
                  <FormField label={langText("Village / taluka / district", "गाव / तालुका / जिल्हा")} required>
                    <input className="kk-input" value={formState.location} onChange={(event) => setFormState((current) => ({ ...current, location: event.target.value }))} />
                  </FormField>
                  <FormStepActions
                    nextLabel={langText("Continue to equipment need", "पुढे: उपकरणाची गरज")}
                    onNext={() => setStep(2)}
                    disableNext={!formState.fullName || !formState.phone || !formState.location}
                  />
                </FormSection>
              ) : (
                <FormSection
                  title={langText("What should launch first?", "सुरुवातीला काय सुरू व्हावे?")}
                  description={langText("Tell us the main machine or service your area needs first.", "तुमच्या भागाला सर्वात आधी कोणते यंत्र किंवा सेवा हवी आहे ते सांगा.")}
                >
                  <FormField label={langText("Primary equipment needed", "मुख्य आवश्यक उपकरण")} required>
                    <input className="kk-input" value={formState.equipmentNeeded} onChange={(event) => setFormState((current) => ({ ...current, equipmentNeeded: event.target.value }))} placeholder={langText("Tractors, sugarcane harvesters, drone spraying...", "ट्रॅक्टर, ऊस हार्वेस्टर, ड्रोन फवारणी...")} />
                  </FormField>
                  <FormStepActions
                    backLabel={langText("Back", "मागे")}
                    nextLabel={isPending ? langText("Submitting...", "सबमिट होत आहे...") : langText("Submit request", "विनंती पाठवा")}
                    onBack={() => setStep(1)}
                    submit
                    disableNext={isPending || !formState.equipmentNeeded}
                  />
                </FormSection>
              )}
            </form>
          </FormShell>
        </section>
      </main>
      <Footer />
    </div>
  );
}

