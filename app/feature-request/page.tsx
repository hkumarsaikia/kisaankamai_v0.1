"use client";

import { type FormEvent, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { formatSubmissionError, postJson } from "@/lib/client/forms";

const featureHighlights = [
  {
    icon: "build",
    title: { en: "Better Tools for Farmers", mr: "शेतकऱ्यांसाठी अधिक चांगली साधने" },
    description: {
      en: "Customized search and filters for crops and soils.",
      mr: "पिके आणि मातीसाठी उपयुक्त शोध आणि फिल्टर.",
    },
    cacheKey: "feature-request.highlight.tools",
  },
  {
    icon: "calendar_today",
    title: { en: "Smarter Booking", mr: "अधिक स्मार्ट बुकिंग" },
    description: {
      en: "Live availability and seasonal machine booking tools.",
      mr: "लाईव्ह उपलब्धता आणि हंगामी मशीन बुकिंग साधने.",
    },
    cacheKey: "feature-request.highlight.booking",
  },
  {
    icon: "map",
    title: { en: "Expanded Coverage", mr: "वाढलेले कव्हरेज" },
    description: {
      en: "Bringing heavy machines directly to your village.",
      mr: "जड मशीन थेट तुमच्या गावापर्यंत आणण्यासाठी मदत.",
    },
    cacheKey: "feature-request.highlight.coverage",
  },
];

const urgencyOptions = [
  {
    icon: "priority_high",
    value: "immediate",
    label: { en: "Immediate", mr: "तातडीचे" },
  },
  {
    icon: "calendar_month",
    value: "season",
    label: { en: "This Season", mr: "या हंगामात" },
    defaultChecked: true,
  },
  {
    icon: "trending_up",
    value: "future",
    label: { en: "Future", mr: "भविष्यात" },
  },
];

const initialFormState = {
  fullName: "",
  phone: "",
  role: "",
  location: "",
  category: "",
  title: "",
  description: "",
  urgency: "season",
  contactMe: false,
};

export default function FeatureRequestPage() {
  const { langText } = useLanguage();
  const [formState, setFormState] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  const updateField = <K extends keyof typeof formState>(field: K, value: (typeof formState)[K]) => {
    setFormState((current) => ({ ...current, [field]: value }));
    setError("");
    setStatusMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setStatusMessage("");

    try {
      await postJson<{ ok: boolean; id: string }>("/api/forms/feature-request", {
        fullName: formState.fullName,
        phone: formState.phone,
        role: formState.role,
        location: formState.location,
        category: formState.category,
        title: formState.title,
        description: formState.description,
        urgency: formState.urgency,
        contactMe: formState.contactMe,
        sourcePath: "/feature-request",
      });

      setFormState(initialFormState);
      setError("");
      setStatusMessage(langText("Submitted. Thank you for sharing your idea.", "सबमिट झाले. तुमची कल्पना शेअर केल्याबद्दल धन्यवाद."));
    } catch (submitError) {
      setStatusMessage("");
      setError(formatSubmissionError(submitError, langText("Could not submit your feature request.", "तुमची फीचर विनंती सबमिट करता आली नाही.")));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f9fbfa] dark:bg-slate-950">
      <main className="flex h-full grow flex-col pt-20">
        <div className="flex flex-1 justify-center px-4 py-5 md:px-40">
          <div className="flex w-full max-w-[960px] flex-1 flex-col">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="relative flex min-h-[480px] flex-col items-center justify-center gap-6 overflow-hidden bg-cover bg-center bg-no-repeat p-4 @[480px]:gap-8 @[480px]:rounded-lg"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCfj3_OKbru5os0rJzvKTDBDPpW5_BDrHKJtMrwajXYlumzwab5Z__wadjMlQdVbb8uf7L5CwdWIwDaGy1GZ8xwM6H048tyctq1v9AH-k-LRlHgHJ4ZwUpl4fCx2NKyok6w0SEfKcew6jWxd3TNlI0B7pBfQ96HJygxBfhLqnnVLjFz0bLV40BoBhcUAA6OAg106L3tbMtBuCmln-pc_oDHK9tk9oUBgAy7J7oFEWxGN9Z5a-V6RK5xL2ueooEKNrog6WV37etzGekm")',
                  }}
                >
                  <div className="kk-banner-image-overlay" />
                  <div className="relative z-10 flex flex-col gap-2 text-center">
                    <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-white @[480px]:text-5xl">
                      {langText(
                        "Tell us what feature would help your farming most",
                        "आम्हाला सांगा कोणती नवीन सुविधा तुम्हाला शेतीत मदत करेल"
                      )}
                    </h1>
                    <h2 className="text-sm font-normal leading-normal text-white @[480px]:text-base">
                      {langText(
                        "Help us build the future of Kisan Kamai. We review every serious request from our community of farmers and owners.",
                        "किसान कमाईचे भविष्य घडवण्यासाठी मदत करा. शेतकरी आणि मालकांकडून आलेली प्रत्येक महत्त्वाची विनंती आम्ही तपासतो."
                      )}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-4">
                <h1 className="max-w-[720px] text-[32px] font-bold leading-tight tracking-[-0.033em] text-[#101816] dark:text-white @[480px]:text-4xl @[480px]:font-black">
                  {langText("Why Request a Feature?", "नवीन सुविधा का सुचवावी?")}
                </h1>
                <p className="max-w-[720px] text-base font-normal leading-normal text-[#101816] dark:text-slate-300">
                  {langText(
                    "Your ideas help us improve our platform for everyone in the farming community.",
                    "तुमच्या कल्पना शेती समुदायातील सर्वांसाठी आमचे व्यासपीठ अधिक चांगले करण्यात मदत करतात."
                  )}
                </p>
              </div>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                {featureHighlights.map((item) => (
                  <div key={item.cacheKey} className="kk-depth-tile flex flex-1 flex-col gap-3 rounded-lg border border-[#d4e2de] bg-[#f9fbfa] p-4 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="text-[#101816] dark:text-emerald-400">
                      <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-base font-bold leading-tight text-[#101816] dark:text-white">
                        {langText(item.title.en, item.title.mr)}
                      </h2>
                      <p className="text-sm font-normal leading-normal text-[#5c8a7a] dark:text-emerald-300/70">
                        {langText(item.description.en, item.description.mr)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-on-surface">
              {langText("Share Your Idea", "तुमची कल्पना सांगा")}
            </h2>

            <div className="w-full px-4 pb-12">
              <div className="rounded-xl border border-outline-variant bg-surface p-6 shadow-sm md:p-8">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
	                      <label htmlFor="feature-full-name" className="font-label text-sm font-medium text-on-surface-variant">
	                        {langText("Full Name", "पूर्ण नाव")}
	                      </label>
	                      <input
	                        id="feature-full-name"
	                        name="fullName"
	                        autoComplete="name"
                        className="h-12 w-full rounded-lg border border-outline-variant bg-surface px-4 text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                        placeholder={langText("Enter your name", "तुमचे नाव टाका")}
                        type="text"
                        value={formState.fullName}
                        onChange={(event) => updateField("fullName", event.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
	                      <label htmlFor="feature-phone" className="font-label text-sm font-medium text-on-surface-variant">
	                        {langText("Mobile Number", "मोबाईल नंबर")}
	                      </label>
	                      <input
	                        id="feature-phone"
	                        name="phone"
	                        autoComplete="tel"
                        className="h-12 w-full rounded-lg border border-outline-variant bg-surface px-4 text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                        placeholder="+91"
                        type="tel"
                        value={formState.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
	                      <label htmlFor="feature-role" className="font-label text-sm font-medium text-on-surface-variant">
	                        {langText("Role", "भूमिका")}
	                      </label>
	                      <div className="relative">
	                        <select
	                          id="feature-role"
	                          name="role"
                          className="kk-select-control h-12 w-full appearance-none rounded-lg border border-outline-variant bg-surface bg-none px-4 pr-12 text-on-surface outline-none transition-colors focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                          value={formState.role}
                          onChange={(event) => updateField("role", event.target.value)}
                          disabled={isSubmitting}
                          required
                        >
                          <option disabled value="">
                            {langText("Select your role", "तुमची भूमिका निवडा")}
                          </option>
                          <option value="farmer">{langText("Farmer", "शेतकरी")}</option>
                          <option value="owner">{langText("Equipment Owner", "उपकरण मालक")}</option>
                          <option value="partner">{langText("Partner", "भागीदार")}</option>
                          <option value="other">{langText("Other", "इतर")}</option>
                        </select>
                        <span className="kk-select-arrow material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-outline">
                          expand_more
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
	                      <label htmlFor="feature-location" className="font-label text-sm font-medium text-on-surface-variant">
	                        {langText("Village or District", "गाव किंवा जिल्हा")}
	                      </label>
	                      <input
	                        id="feature-location"
	                        name="location"
	                        autoComplete="address-level2"
                        className="h-12 w-full rounded-lg border border-outline-variant bg-surface px-4 text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                        placeholder={langText("e.g. Sangli, Satara", "उदा. सांगली, सातारा")}
                        type="text"
                        value={formState.location}
                        onChange={(event) => updateField("location", event.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <hr className="my-2 border-outline-variant" />

                  <div className="flex flex-col gap-2">
	                    <label htmlFor="feature-category" className="font-label text-sm font-medium text-on-surface-variant">
	                      {langText("Feature Category", "सुविधेचा प्रकार")}
	                    </label>
	                    <div className="relative">
	                      <select
	                        id="feature-category"
	                        name="category"
                        className="kk-select-control h-12 w-full appearance-none rounded-lg border border-outline-variant bg-surface bg-none px-4 pr-12 text-on-surface outline-none transition-colors focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                        value={formState.category}
                        onChange={(event) => updateField("category", event.target.value)}
                        disabled={isSubmitting}
                        required
                      >
                        <option disabled value="">
                          {langText("What area does this relate to?", "ही सुविधा कोणत्या भागाशी संबंधित आहे?")}
                        </option>
                        <option value="discovery">{langText("Discovery and Search", "शोध आणि शोधयंत्र")}</option>
                        <option value="machine_types">{langText("New Machine Types", "नवीन मशीन प्रकार")}</option>
                        <option value="booking">{langText("Booking and Scheduling", "बुकिंग आणि वेळापत्रक")}</option>
                        <option value="payments">{langText("Pricing & Settlement", "किंमत आणि थेट व्यवहार")}</option>
                        <option value="support">{langText("Support and Help", "मदत आणि सपोर्ट")}</option>
                        <option value="trust">{langText("Trust and Safety", "विश्वास आणि सुरक्षा")}</option>
                        <option value="other">{langText("Other", "इतर")}</option>
                      </select>
                      <span className="kk-select-arrow material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-outline">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
	                    <label htmlFor="feature-title" className="font-label text-sm font-medium text-on-surface-variant">
	                      {langText("Feature Title", "सुविधेचे नाव")}
	                    </label>
	                    <input
	                      id="feature-title"
	                      name="title"
                      className="h-12 w-full rounded-lg border border-outline-variant bg-surface px-4 text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                      placeholder={langText("Brief summary of your idea", "तुमच्या कल्पनेचा थोडक्यात सारांश")}
                      type="text"
                      value={formState.title}
                      onChange={(event) => updateField("title", event.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
	                    <label htmlFor="feature-description" className="font-label text-sm font-medium text-on-surface-variant">
	                      {langText("Describe Your Idea", "तुमची कल्पना सविस्तर सांगा")}
	                    </label>
	                    <textarea
	                      id="feature-description"
	                      name="description"
                      className="w-full resize-y rounded-lg border border-outline-variant bg-surface p-4 text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                      placeholder={langText(
                        "How would this feature help you in your daily farming or business operations?",
                        "ही सुविधा तुमच्या दैनंदिन शेती किंवा व्यवसाय कामकाजात कशी मदत करेल?"
                      )}
                      rows={4}
                      value={formState.description}
                      onChange={(event) => updateField("description", event.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="font-label text-sm font-medium text-on-surface-variant">
                      {langText("How urgent is this need?", "ही गरज किती तातडीची आहे?")}
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {urgencyOptions.map((option) => (
                        <label
                          key={option.value}
                          className="has-[:checked]:border-primary-container has-[:checked]:bg-primary-container has-[:checked]:text-white relative flex cursor-pointer rounded-lg border border-outline-variant bg-surface p-4 text-on-surface transition-colors hover:bg-surface-container-low"
                        >
                          <input
                            className="peer sr-only"
                            name="urgency"
                            type="radio"
                            value={option.value}
                            checked={formState.urgency === option.value}
                            onChange={() => updateField("urgency", option.value)}
                            disabled={isSubmitting}
                          />
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-outline peer-checked:text-white">{option.icon}</span>
                            <div>
                              <p className="text-sm font-medium text-current">
                                {langText(option.label.en, option.label.mr)}
                              </p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <input
                      className="size-5 cursor-pointer rounded border-outline-variant text-primary-container focus:ring-primary-container"
                      id="contact_me"
                      type="checkbox"
                      checked={formState.contactMe}
                      onChange={(event) => updateField("contactMe", event.target.checked)}
                      disabled={isSubmitting}
                    />
                    <label className="cursor-pointer select-none text-sm text-on-surface-variant" htmlFor="contact_me">
                      {langText(
                        "It's okay to contact me to discuss this idea further.",
                        "या कल्पनेबद्दल अधिक चर्चा करण्यासाठी माझ्याशी संपर्क साधू शकता."
                      )}
                    </label>
                  </div>

	                {error ? <p className="text-sm font-semibold text-error" role="alert">{error}</p> : null}
                  {statusMessage ? (
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      <span className="material-symbols-outlined text-[18px]">task_alt</span>
                      {statusMessage}
                    </p>
                  ) : null}

                  <div className="flex justify-end pt-4">
                    <button
                      className="kk-flow-button flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-6 text-base font-bold tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[160px]"
                      type="submit"
                      disabled={isSubmitting}
                      data-loading={isSubmitting ? "true" : "false"}
                      aria-busy={isSubmitting}
                    >
                      {isSubmitting ? <span className="kk-flow-spinner" aria-hidden="true" /> : null}
                      {isSubmitting
	                        ? langText("Submitting…", "सबमिट होत आहे…")
                        : langText("Submit Feature Request", "फीचर विनंती सबमिट करा")}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-primary-container px-4 py-20 text-white">
              <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
                <span className="material-symbols-outlined mb-2 text-5xl text-inverse-primary dark:text-primary-fixed">handshake</span>
                <h2 className="text-3xl font-black leading-tight tracking-tight md:text-4xl">
                  {langText(
                    "Help us shape the future of farm equipment access.",
                    "शेती उपकरणांच्या उपलब्धतेचे भविष्य घडवण्यासाठी मदत करा."
                  )}
                </h2>
                <p className="text-lg font-medium text-inverse-primary dark:text-primary-fixed md:text-xl">
                  {langText(
                    "Every serious request is reviewed by the Kisan Kamai team.",
                    "प्रत्येक महत्त्वाची विनंती किसान कमाई टीम तपासते."
                  )}
                </p>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
