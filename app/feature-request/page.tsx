"use client";

import { useLanguage } from "@/components/LanguageContext";

const featureHighlights = [
  {
    icon: "build",
    title: { en: "Better Tools for Farmers", mr: "शेतकऱ्यांसाठी अधिक चांगली साधने" },
    description: "Customized search and filters for crops and soils.",
    cacheKey: "feature-request.highlight.tools",
  },
  {
    icon: "calendar_today",
    title: { en: "Smarter Booking", mr: "अधिक स्मार्ट बुकिंग" },
    description: "Live availability and seasonal machine booking tools.",
    cacheKey: "feature-request.highlight.booking",
  },
  {
    icon: "map",
    title: { en: "Expanded Coverage", mr: "वाढलेले कव्हरेज" },
    description: "Bringing heavy machines directly to your village.",
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

export default function FeatureRequestPage() {
  const { langText, text } = useLanguage();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f9fbfa] dark:bg-slate-950">
      <main className="flex h-full grow flex-col pt-20">
        <div className="flex flex-1 justify-center px-4 py-5 md:px-40">
          <div className="flex w-full max-w-[960px] flex-1 flex-col">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[480px] flex-col items-center justify-center gap-6 bg-cover bg-center bg-no-repeat p-4 @[480px]:gap-8 @[480px]:rounded-lg"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCfj3_OKbru5os0rJzvKTDBDPpW5_BDrHKJtMrwajXYlumzwab5Z__wadjMlQdVbb8uf7L5CwdWIwDaGy1GZ8xwM6H048tyctq1v9AH-k-LRlHgHJ4ZwUpl4fCx2NKyok6w0SEfKcew6jWxd3TNlI0B7pBfQ96HJygxBfhLqnnVLjFz0bLV40BoBhcUAA6OAg106L3tbMtBuCmln-pc_oDHK9tk9oUBgAy7J7oFEWxGN9Z5a-V6RK5xL2ueooEKNrog6WV37etzGekm")',
                  }}
                >
                  <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-white @[480px]:text-5xl">
                      {langText(
                        "Tell us what feature would help your farming most",
                        "आम्हाला सांगा कोणती नवीन सुविधा तुम्हाला शेतीत मदत करेल"
                      )}
                    </h1>
                    <h2 className="text-sm font-normal leading-normal text-white @[480px]:text-base">
                      {text("Help us build the future of Kisan Kamai. We review every serious request from our community of farmers and owners.", {
                        cacheKey: "feature-request.hero-copy",
                      })}
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
                  {text("Your ideas help us improve our platform for everyone in the farming community.", {
                    cacheKey: "feature-request.why-copy",
                  })}
                </p>
              </div>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                {featureHighlights.map((item) => (
                  <div key={item.cacheKey} className="flex flex-1 flex-col gap-3 rounded-lg border border-[#d4e2de] bg-[#f9fbfa] p-4 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="text-[#101816] dark:text-emerald-400">
                      <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-base font-bold leading-tight text-[#101816] dark:text-white">
                        {langText(item.title.en, item.title.mr)}
                      </h2>
                      <p className="text-sm font-normal leading-normal text-[#5c8a7a] dark:text-emerald-300/70">
                        {text(item.description, { cacheKey: item.cacheKey })}
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
                <form className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className="font-label text-sm font-medium text-on-surface-variant">
                        {langText("Full Name", "पूर्ण नाव")}
                      </label>
                      <input
                        className="h-12 w-full rounded-lg border border-outline-variant bg-surface px-4 text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                        placeholder={langText("Enter your name", "तुमचे नाव टाका")}
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label text-sm font-medium text-on-surface-variant">
                        {langText("Mobile Number", "मोबाईल नंबर")}
                      </label>
                      <input
                        className="h-12 w-full rounded-lg border border-outline-variant bg-surface px-4 text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                        placeholder="+91"
                        type="tel"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className="font-label text-sm font-medium text-on-surface-variant">
                        {langText("Role", "भूमिका")}
                      </label>
                      <div className="relative">
                        <select
                          className="h-12 w-full appearance-none rounded-lg border border-outline-variant bg-surface px-4 text-on-surface outline-none transition-colors focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                          defaultValue=""
                        >
                          <option disabled value="">
                            {langText("Select your role", "तुमची भूमिका निवडा")}
                          </option>
                          <option value="farmer">{langText("Farmer", "शेतकरी")}</option>
                          <option value="owner">{langText("Equipment Owner", "उपकरण मालक")}</option>
                          <option value="partner">{langText("Partner", "भागीदार")}</option>
                          <option value="visitor">{langText("Visitor", "इतर")}</option>
                        </select>
                        <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-outline">
                          expand_more
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label text-sm font-medium text-on-surface-variant">
                        {langText("Village or District", "गाव किंवा जिल्हा")}
                      </label>
                      <input
                        className="h-12 w-full rounded-lg border border-outline-variant bg-surface px-4 text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                        placeholder={langText("e.g. Sangli, Satara", "उदा. सांगली, सातारा")}
                        type="text"
                      />
                    </div>
                  </div>

                  <hr className="my-2 border-outline-variant" />

                  <div className="flex flex-col gap-2">
                    <label className="font-label text-sm font-medium text-on-surface-variant">
                      {langText("Feature Category", "सुविधेचा प्रकार")}
                    </label>
                    <div className="relative">
                      <select
                        className="h-12 w-full appearance-none rounded-lg border border-outline-variant bg-surface px-4 text-on-surface outline-none transition-colors focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                        defaultValue=""
                      >
                        <option disabled value="">
                          {langText("What area does this relate to?", "ही सुविधा कोणत्या भागाशी संबंधित आहे?")}
                        </option>
                        <option value="discovery">{langText("Discovery and Search", "शोध आणि शोधयंत्र")}</option>
                        <option value="machine_types">{langText("New Machine Types", "नवीन मशीन प्रकार")}</option>
                        <option value="booking">{langText("Booking and Scheduling", "बुकिंग आणि वेळापत्रक")}</option>
                        <option value="payments">{langText("Payments and Pricing", "पेमेंट्स आणि किंमत")}</option>
                        <option value="support">{langText("Support and Help", "मदत आणि सपोर्ट")}</option>
                        <option value="trust">{langText("Trust and Safety", "विश्वास आणि सुरक्षा")}</option>
                        <option value="other">{langText("Other", "इतर")}</option>
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-outline">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label text-sm font-medium text-on-surface-variant">
                      {langText("Feature Title", "सुविधेचे नाव")}
                    </label>
                    <input
                      className="h-12 w-full rounded-lg border border-outline-variant bg-surface px-4 text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                      placeholder={langText("Brief summary of your idea", "तुमच्या कल्पनेचा थोडक्यात सारांश")}
                      type="text"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label text-sm font-medium text-on-surface-variant">
                      {langText("Describe Your Idea", "तुमची कल्पना सविस्तर सांगा")}
                    </label>
                    <textarea
                      className="w-full resize-y rounded-lg border border-outline-variant bg-surface p-4 text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                      placeholder={langText(
                        "How would this feature help you in your daily farming or business operations?",
                        "ही सुविधा तुमच्या दैनंदिन शेती किंवा व्यवसाय कामकाजात कशी मदत करेल?"
                      )}
                      rows={4}
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
                          className="has-[:checked]:border-primary-container has-[:checked]:bg-[#eaf1ee] relative flex cursor-pointer rounded-lg border border-outline-variant bg-surface p-4 transition-colors hover:bg-surface-container-low"
                        >
                          <input
                            defaultChecked={option.defaultChecked}
                            className="peer sr-only"
                            name="urgency"
                            type="radio"
                            value={option.value}
                          />
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-outline peer-checked:text-primary-container">{option.icon}</span>
                            <div>
                              <p className="text-sm font-medium text-on-surface">
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
                    />
                    <label className="cursor-pointer select-none text-sm text-on-surface-variant" htmlFor="contact_me">
                      {langText(
                        "It's okay to contact me to discuss this idea further.",
                        "या कल्पनेबद्दल अधिक चर्चा करण्यासाठी माझ्याशी संपर्क साधू शकता."
                      )}
                    </label>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      className="flex h-12 w-full items-center justify-center rounded-lg bg-primary-container px-6 text-base font-bold tracking-wide text-on-primary transition-colors hover:bg-[#0e2a21] sm:w-auto sm:min-w-[160px]"
                      type="button"
                    >
                      {langText("Submit Feature Request", "फीचर विनंती सबमिट करा")}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-primary-container px-4 py-20 text-on-primary">
              <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
                <span className="material-symbols-outlined mb-2 text-5xl text-inverse-primary">handshake</span>
                <h2 className="text-3xl font-black leading-tight tracking-tight md:text-4xl">
                  {text("Help us build the future of farm equipment access.", {
                    cacheKey: "feature-request.cta-title",
                  })}
                </h2>
                <p className="text-lg font-medium text-inverse-primary md:text-xl">
                  {langText(
                    "Help us shape the future of farm equipment access.",
                    "शेती उपकरणांच्या उपलब्धतेचे भविष्य घडवण्यासाठी आम्हाला मदत करा."
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
