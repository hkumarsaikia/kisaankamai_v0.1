"use client";
import { useLanguage } from "@/components/LanguageContext";
import { AppLink as Link } from "@/components/AppLink";

export default function HowItWorksPage() {
  const { langText } = useLanguage();

  return (
    <div className="min-h-screen bg-background font-body text-on-background selection:bg-secondary-container selection:text-on-secondary-container">
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[500px] flex items-center overflow-hidden bg-primary-container">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/80 to-transparent z-10"></div>
            <img 
              className="w-full h-full object-cover grayscale-[20%] brightness-[70%]" 
              alt="Modern tractor working in a vast lush green field" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_pmsUO3wIQ354R-5js0wLwWEAY9NoXJfRWv3B2CZbgbTJhcNcmanT9Q9gErPOkKJG1Ti59VifdaS4544Ep1Q16wPoOpP8zpn_TYHpZnswbTH7GLRccvmqdOfiEMcuEjJjL-cPpkR1NUHsZI1jNual8ZO75xHEiqM8PY0MhbdTPobtsOyg7P7T3wybSbKqKjIEMUloOM0WNVu9k56_4BfzQiahkF3YqUCwJWnU_ISpsoqcngnlKSvxqtZixhDTuWCR0z94fNwf8Gxp"
            />
          </div>
          <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 w-full text-white">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-extrabold font-headline leading-tight mb-6">
                {langText("How Kisan Kamai Works", "किसान कमाई कशी काम करते")}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 font-medium">
                {langText(
                  "Helping farmers and equipment owners connect easily, quickly, and with more trust.",
                  "शेतकरी आणि अवजारे मालकांना सहज, जलद आणि अधिक विश्वासाने जोडण्यास मदत करणे."
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Renter Process */}
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-3xl font-extrabold text-primary mb-4 font-headline">
                {langText("For Renters: Find What You Need", "भाड्याने घेणाऱ्यांसाठी: तुम्हाला काय हवे ते शोधा")}
              </h2>
              <p className="text-slate-600 max-w-2xl font-medium">
                {langText(
                  "Rent high-quality farming equipment from trusted owners in your local area with simple steps.",
                  "साध्या टप्प्यांसह तुमच्या स्थानिक भागातील विश्वसनीय मालकांकडून उच्च-गुणवत्तेची शेती उपकरणे भाड्याने घ्या."
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: "search", title: ["Search equipment", "उपकरणे शोधा"], desc: ["Browse tractors, harvesters, or implements based on your location and crop requirements.", "तुमच्या ठिकाणानुसार ट्रॅक्टर, हार्वेस्टर किंवा अवजारे शोधा."] },
                { icon: "visibility", title: ["View details & owner", "तपशील आणि मालक पहा"], desc: ["Check equipment condition, specs, and owner profile to ensure a good fit.", "उपकरणाची स्थिती, तपशील आणि मालकाची माहिती तपासा."] },
                { icon: "contact_support", title: ["Contact owner", "मालकाशी संपर्क साधा"], desc: ["Call the owner directly through the platform to discuss availability and pricing.", "उपलब्धता आणि किमतीबद्दल चर्चा करण्यासाठी थेट मालकाशी संपर्क साधा."] },
                { icon: "handshake", title: ["Finalize directly", "थेट व्यवहार पूर्ण करा"], desc: ["Meet in person, verify the machine, and complete the transaction without middle-men.", "प्रत्यक्ष भेटा, मशीन तपासा आणि मध्यस्थाशिवाय व्यवहार पूर्ण करा."] },
              ].map((step, idx) => (
                <div key={idx} className="relative group p-8 bg-white rounded-2xl border border-outline-variant shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-container text-white flex items-center justify-center rounded-full font-black text-xl shadow-lg ring-4 ring-surface">
                    {idx + 1}
                  </div>
                  <div className="mb-6 text-secondary transform group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
                  </div>
                  <h3 className="text-xl font-black mb-3 text-primary">{langText(step.title[0], step.title[1])}</h3>
                  <p className="text-on-surface-variant text-sm font-medium leading-relaxed">{langText(step.desc[0], step.desc[1])}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Owner Process */}
        <section className="py-24 bg-surface-container-low overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-2/5 space-y-6">
                <h2 className="text-3xl font-extrabold text-primary font-headline leading-tight">
                  {langText("For Owners: Earn More from Your Assets", "मालकांसाठी: तुमच्या उपकरणांमधून अधिक कमवा")}
                </h2>
                <p className="text-on-surface-variant font-medium leading-relaxed">
                  {langText(
                    "List your machines and get requests from verified local farmers looking for rental solutions.",
                    "तुमची मशीन नोंदवा आणि भाड्याने उपकरण शोधणाऱ्या शेतकाऱ्यांकडून विनंत्या मिळवा."
                  )}
                </p>
                <div className="space-y-4 pt-4 text-primary font-black">
                  {[
                    ["No listing fees", "नोंदणी शुल्क नाही"],
                    ["Local verified leads", "स्थानिक सत्यापित ग्राहक"],
                    ["Complete control over terms", "अटींवर पूर्ण नियंत्रण"]
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary font-black">check_circle</span>
                      <span>{langText(benefit[0], benefit[1])}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { step: "01", title: ["List equipment", "उपकरण नोंदवा"], desc: ["Select the machine type and add basic model info to get started.", "मशीनचा प्रकार निवडा आणि मूलभूत माहिती जोडा."] },
                  { step: "02", title: ["Add details/photos", "फोटो आणि तपशील जोडा"], desc: ["Upload real photos and describe the condition to attract serious renters.", "खरे फोटो अपलोड करा आणि उपकरणाची स्थिती स्पष्ट करा."] },
                  { step: "03", title: ["Receive requests", "विनंत्या मिळवा"], desc: ["Farmers will see your listing and contact you via phone directly.", "शेतकरी तुमची नोंदणी पाहतील आणि थेट फोनद्वारे संपर्क साधतील."] },
                  { step: "04", title: ["Discuss terms directly", "थेट चर्चा करा"], desc: ["Negotiate price, duration, and delivery directly with the renter.", "किंमत आणि कालावधीबद्दल थेट ग्राहकाशी चर्चा करा."] }
                ].map((item, i) => (
                  <div key={i} className="p-8 bg-white rounded-3xl shadow-sm border border-outline-variant hover:border-secondary transition-colors group">
                    <span className="text-secondary font-black text-lg mb-2 block tracking-tight group-hover:translate-x-1 transition-transform">{langText("Step " + item.step, "टप्पा " + item.step)}</span>
                    <h4 className="text-xl font-black text-primary mb-2 line-clamp-1">{langText(item.title[0], item.title[1])}</h4>
                    <p className="text-on-surface-variant text-sm font-medium">{langText(item.desc[0], item.desc[1])}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-primary mb-4 font-headline uppercase tracking-tight">
                {langText("Why Trust Kisan Kamai?", "किसान कमाईवर विश्वास का ठेवायचा?")}
              </h2>
              <p className="text-on-surface-variant max-w-xl mx-auto font-medium italic">
                {langText("We provide the platform, but you control the deal. Transparent, local, and reliable.", "आम्ही प्लॅटफॉर्म देतो, पण व्यवहार तुम्ही ठरवता. पारदर्शक आणि स्थानिक.")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "location_on", title: ["Local access", "स्थानिक उपलब्धता"], desc: ["Find machines in your own district or village.", "तुमच्या स्वतःच्या जिल्ह्यात किंवा गावात मशीन शोधा."] },
                { icon: "person_pin", title: ["Direct connection", "थेट संपर्क"], desc: ["No middlemen. Speak directly to the machine owner.", "मध्यस्थ नाही. थेट मालकाशी बोला."] },
                { icon: "fact_check", title: ["Transparent details", "पारदर्शक तपशील"], desc: ["Get clear specs and photos before you call.", "कॉल करण्यापूर्वी स्पष्ट फोटो आणि माहिती मिळवा."] },
                { icon: "foundation", title: ["Built for Maharashtra", "महाराष्ट्रासाठी खास"], desc: ["Designed specifically for local agricultural needs.", "स्थानिक शेतीच्या गरजांसाठी खास तयार केलेले."] }
              ].map((card, i) => (
                <div key={i} className="p-8 bg-surface-container-lowest border border-outline-variant/60 rounded-3xl text-center hover:bg-primary-container/5 transition-colors">
                  <div className="w-16 h-16 bg-primary-container/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                    <span className="material-symbols-outlined text-4xl">{card.icon}</span>
                  </div>
                  <h4 className="font-black text-primary mb-3 text-lg">{langText(card.title[0], card.title[1])}</h4>
                  <p className="text-on-surface-variant text-sm font-medium leading-relaxed">{langText(card.desc[0], card.desc[1])}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Important Disclaimer */}
        <section className="py-12 bg-background">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-red-50 border-2 border-red-200 p-10 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                <span className="material-symbols-outlined text-9xl text-red-900">warning</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-red-900 mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined font-black">gpp_maybe</span>
                  {langText("Important Disclaimer", "महत्वाच्या सूचना")}
                </h3>
                <div className="text-red-900 font-bold leading-relaxed space-y-4">
                  <p>
                    {langText(
                      "Kisan Kamai does not collect or process payments on the platform. Agreements happen directly between users. Kisan Kamai is a marketplace platform and does not own any equipment.",
                      "किसान कमाई प्लॅटफॉर्मवर पेमेंट गोळा करत नाही किंवा त्यावर प्रक्रिया करत नाही. वापरकर्त्यांमध्ये थेट व्यवहार होतात."
                    )}
                  </p>
                  <p className="text-xl uppercase tracking-tight bg-red-900 text-white p-4 rounded-xl text-center">
                    {langText(
                      "Always verify machine condition before paying.",
                      "पेमेंट करण्यापूर्वी नेहमी मशीनची स्थिती तपासा."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 mb-12">
          <div className="max-w-5xl mx-auto bg-primary-container rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8 font-headline leading-tight">
                {langText("Ready to use Kisan Kamai?", "किसान कमाई वापरण्यास तयार आहात?")}
              </h2>
              <p className="text-white/80 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
                {langText("Join the growing community of smart farmers and owners in Maharashtra today.", "आजच महाराष्ट्रातील स्मार्ट शेतकरी आणि मालकांच्या वाढत्या समुदायात सामील व्हा.")}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/rent-equipment" className="px-12 py-5 bg-secondary-container text-on-secondary-container font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg">
                  <span className="material-symbols-outlined font-black">search</span>
                  {langText("Browse Equipment", "उपकरणे शोधा")}
                </Link>
                <Link href="/owner-benefits" className="px-12 py-5 bg-white text-primary-container font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg">
                  <span className="material-symbols-outlined font-black">workspace_premium</span>
                  {langText("Owner Benefits", "मालकांचे फायदे")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
