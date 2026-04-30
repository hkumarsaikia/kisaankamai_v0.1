"use client";

import { useLanguage } from "@/components/LanguageContext";

const featureHighlights = [
  {
    icon: "build",
    title: { en: "Better Tools for Farmers", mr: "शेतकऱ्यांसाठी अधिक चांगली साधने" },
    description: "Customized search and filters for crops and soils.",
    cacheKey: "feedback.highlight.tools",
  },
  {
    icon: "event_available",
    title: { en: "Smarter Booking", mr: "अधिक स्मार्ट बुकिंग" },
    description: "Live availability and seasonal machine booking tools.",
    cacheKey: "feedback.highlight.booking",
  },
  {
    icon: "explore",
    title: { en: "Expanded Coverage", mr: "वाढलेले कव्हरेज" },
    description: "Bringing heavy machines directly to your village.",
    cacheKey: "feedback.highlight.coverage",
  },
];

export default function FeedbackPage() {
  const { langText, text } = useLanguage();

  return (
    <main className="min-h-screen bg-[#f9fbfa] dark:bg-slate-950 font-body">
      <div className="pt-20">
        <section className="relative min-h-[480px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover"
              alt="Vibrant green agricultural field in Maharashtra with a modern tractor working the soil"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfj3_OKbru5os0rJzvKTDBDPpW5_BDrHKJtMrwajXYlumzwab5Z__wadjMlQdVbb8uf7L5CwdWIwDaGy1GZ8xwM6H048tyctq1v9AH-k-LRlHgHJ4ZwUpl4fCx2NKyok6w0SEfKcew6jWxd3TNlI0B7pBfQ96HJygxBfhLqnnVLjFz0bLV40BoBhcUAA6OAg106L3tbMtBuCmln-pc_oDHK9tk9oUBgAy7J7oFEWxGN9Z5a-V6RK5xL2ueooEKNrog6WV37etzGekm"
            />
            <div className="kk-banner-image-overlay" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
              {langText(
                "Tell us what feature would help your farming most",
                "आम्हाला सांगा कोणती नवीन सुविधा तुम्हाला शेतीत मदत करेल"
              )}
            </h1>
            <p className="text-lg md:text-xl opacity-90 font-medium max-w-2xl mx-auto">
              {text("Help us build the future of Kisan Kamai. We review every serious request from our community of farmers and owners.", {
                cacheKey: "feedback.hero-copy",
              })}
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-[#101816] dark:text-emerald-400 text-[32px] md:text-4xl font-black leading-tight">
                {langText("Why Request a Feature?", "नवीन सुविधा का सुचवावी?")}
              </h2>
              <p className="text-[#101816]/70 dark:text-slate-400 text-lg font-medium max-w-3xl">
                {text("Your ideas help us improve our platform for everyone in the farming community.", {
                  cacheKey: "feedback.why-copy",
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featureHighlights.map((item) => (
                <div key={item.cacheKey} className="kk-depth-tile flex flex-col gap-4 p-6 rounded-2xl border border-[#d4e2de] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <div className="w-12 h-12 bg-[#eaf1ee] dark:bg-emerald-950 flex items-center justify-center rounded-xl text-primary dark:text-emerald-400">
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-[#101816] dark:text-emerald-50 text-xl font-bold mb-2">
                      {langText(item.title.en, item.title.mr)}
                    </h3>
                    <p className="text-[#5c8a7a] dark:text-slate-400 text-sm font-medium">
                      {text(item.description, { cacheKey: item.cacheKey })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-20">
          <h2 className="text-[#101816] dark:text-emerald-50 text-[22px] font-black mb-8 px-2 border-l-4 border-primary">
            {langText("Share Your Idea", "तुमची कल्पना सांगा")}
          </h2>

          <div className="bg-emerald-950 text-white rounded-[2.5rem] p-12 md:p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-emerald-400 mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>
              handshake
            </span>
            <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              {text("Help us build the future of farm equipment access.", {
                cacheKey: "feedback.cta-title",
              })}
            </h3>
            <p className="text-emerald-200/70 text-lg md:text-xl font-medium mb-0">
              {langText(
                "Help us shape the next chapter of equipment access for every farmer.",
                "प्रत्येक शेतकऱ्यासाठी उपकरण उपलब्धतेचा पुढचा अध्याय घडवण्यासाठी आम्हाला मदत करा."
              )}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
