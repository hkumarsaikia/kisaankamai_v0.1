"use client";

import { useLanguage } from "@/components/LanguageContext";
import { AppLink as Link } from "@/components/AppLink";
import { supportContact } from "@/lib/support-contact";

export default function TermsAndSafetyPage() {
  const { langText } = useLanguage();

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface selection:bg-primary-container selection:text-white">
      <main className="pt-20 tracking-tight">
        {/* Hero Section */}
        <section className="relative h-[450px] flex items-center justify-center overflow-hidden bg-primary-container">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover"
              alt="Lush green field in Maharashtra" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDltSi1i_6HGDAFLrlSUDFrky5M75B7VK9q---9vhn1fSwRcPwC0BU8GadHYCU3QjgP4FTVgy942SgO3gz_tU8U_KJyx3LLdjyjN5ytcbnWTrv4dgqodCXSESTrNyqZju3u4eAUR6-EVqm6yMpAdOdHddf398PmPbNnwSYUYFAiPeBuH1RjLNf1tHOpQWi4CLxpFk7IT9kSEtoaTgz5JR9y-gE4H3Rwidzz5gBeWnc3pHZXpWPqK3DnHfPnuwhwqSUxc6L2vc9RkGVZ"
            />
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
              {langText("Terms & Safety Guidelines", "अटी आणि सुरक्षितता नियम")}
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed max-w-2xl mx-auto">
              {langText(
                "Clear rules and safer renting for farmers and equipment owners.",
                "शेतकरी आणि अवजारे मालकांसाठी सुरक्षित आणि पारदर्शक नियम."
              )}
            </p>
          </div>
        </section>

        {/* Quick Summary Bento */}
        <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "handshake", color: "emerald", title: ["Direct Dealing", "थेट व्यवहार"], desc: ["Deal directly with the person who owns or needs the machine. No middlemen.", "मालक किंवा ग्राहकाशी थेट व्यवहार करा. मध्यस्थ नाही."] },
              { icon: "payment", color: "orange", title: ["No Online Payment", "नो ऑनलाइन पेमेंट"], desc: ["Kisan Kamai never asks for or processes payments online. Handle money directly.", "आम्ही ऑनलाइन पेमेंट स्वीकारत नाही. थेट पैसे द्या."] },
              { icon: "verified_user", color: "blue", title: ["Verify Before Deal", "तपासा आणि निवडा"], desc: ["Always verify identity and machine condition before finalizing any agreement.", "प्रत्यक्ष भेटून आणि मशीन तपासूनच व्यवहार निश्चित करा."] },
              { icon: "gavel", color: "purple", title: ["Responsible Use", "जबाबदार वापर"], desc: ["Misuse of the platform or abusive language will lead to permanent removal.", "प्लॅटफॉर्मचा गैरवापर केल्यास खाते कायमचे बंद केले जाईल."] }
            ].map((card, i) => (
              <div key={i} className="bg-surface-container-lowest p-8 rounded-3xl shadow-2xl shadow-primary/5 border border-outline-variant hover:border-primary/30 transition-all group">
                <div className={`w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors`}>
                  <span className="material-symbols-outlined text-3xl">{card.icon}</span>
                </div>
                <h3 className="font-black text-xl mb-3 text-primary">{langText(card.title[0], card.title[1])}</h3>
                <p className="text-on-surface-variant text-sm font-medium leading-relaxed">{langText(card.desc[0], card.desc[1])}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Role Section */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <div className="relative group">
                <img 
                  className="rounded-[2.5rem] shadow-2xl w-full h-[500px] object-cover"
                  alt="Farmer using smartphone" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkwAdVVVMsz8uJO_ua03geS19b-VfJGaKEbGshhu6lxqfM_Ygivz33MLfzU9bxDbQeFMAw59DNUGalG7dx6DB0JgjelwR-lo36vnjE3FjsFEZSBiovP8_i7s0bUB3XMVzF4aXBn1rCvirp3dQPh6zf0VzLQc3wVSDC9n4jPaHJURrdQO1_sJ8oaFM-iXc3dkh4j6uw-VO2w0aT4K6UAmSEqv1IU9wwJRcBgf6neGPUO-l5lHGSCtUZ54o-qx9cGRxPwbPbEBmLKzhK"
                />
                <div className="absolute -bottom-8 -right-8 hidden max-w-xs rounded-3xl border border-white/10 bg-primary-container p-10 text-white shadow-2xl transform transition-transform group-hover:-translate-y-2 md:block">
                  <span className="material-symbols-outlined text-white text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                  <p className="text-white font-black text-xl mb-2">{langText("Discovery Only", "केवळ संपर्क")}</p>
                  <p className="text-white/80 text-sm font-medium leading-relaxed">
                    {langText("We connect people. We do not manage money.", "आम्ही लोकांना जोडतो. आम्ही पैशांचे व्यवस्थापन करत नाही.")}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-8">
              <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight leading-tight">
                {langText("Kisan Kamai’s Platform Role", "किसान कमाईची भूमिका")}
              </h2>
              <div className="space-y-6 text-on-surface-variant text-lg font-medium">
                <p className="leading-relaxed">
                  {langText(
                    "Kisan Kamai is purely a Discovery and Connection platform. We provide tools for farmers to find equipment and owners to list machinery.",
                    "किसान कमाई हे पूर्णपणे संपर्क प्लॅटफॉर्म आहे. आम्ही शेतकरी आणि मालकांना एकमेकांसाठी शोध घेण्याकरिता सोय उपलब्ध करून देतो."
                  )}
                </p>
                <div className="space-y-4 pt-4">
                  {[
                    "We do not process payments.",
                    "We do not guarantee machine performance.",
                    "We do not manage logistics.",
                    "We do not arbitrate financial disputes."
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4 text-primary font-bold">
                      <span className="material-symbols-outlined text-secondary font-black">block</span>
                      <span>{langText(text, "आम्ही " + text)}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-surface-container-low p-8 rounded-3xl border-l-[6px] border-primary italic text-primary leading-relaxed font-black">
                  "आमची भूमिका केवळ शेतकरी आणि अवजारे मालकांना एकमेकांशी जोडण्याची आहे. आर्थिक व्यवहारांची जबाबदारी वापरकर्त्यांची असेल."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Checklist */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-primary-container rounded-[3.5rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
            <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/3">
                <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                  {langText("Essential Safety Checklist", "सुरक्षिततेची पडताळणी यादी")}
                </h2>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-sm font-black uppercase tracking-widest text-secondary-container mb-4">Rule #1</p>
                  <p className="font-black text-2xl leading-tight">
                    {langText("Never pay advance before seeing the machine.", "मशीन पाहण्यापूर्वी चुकूनही आगाऊ पैसे देऊ नका.")}
                  </p>
                </div>
              </div>
              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: ["Inspect Machine", "मशीन तपासा"], desc: ["Check for leaks, tire condition, and engine sound personally.", "प्रत्यक्ष जाऊन इंजिन, टायर आणि ऑईल गळती तपासा."] },
                  { title: ["Confirm Rate", "दर निश्चित करा"], desc: ["Agree on hourly or daily rate including fuel/driver costs.", "डिझेल आणि ड्रायव्हरच्या खर्चासह अंतिम दर ठरवा."] },
                  { title: ["Record Timing", "वेळेची नोंद ठेवा"], desc: ["Note down exact meter reading/time at start and end.", "कामाच्या सुरुवातीला आणि शेवटी रीटिंगची नोंद करा."] },
                  { title: ["Check Fuel", "डिझेल तपासा"], desc: ["Decide if fuel is provided by owner or renter.", "डिझेल मालक देणार की भाडेकरी, हे आधीच स्पष्ट करा."] }
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 p-8 rounded-3xl border border-white/5 flex gap-6 items-start hover:bg-white/15 transition-colors">
                    <div className="w-12 h-12 shrink-0 bg-secondary text-on-secondary rounded-2xl flex items-center justify-center font-black text-xl">{i + 1}</div>
                    <div>
                      <h4 className="font-black text-xl mb-2">{langText(item.title[0], item.title[1])}</h4>
                      <p className="text-white/70 text-sm font-medium leading-relaxed">{langText(item.desc[0], item.desc[1])}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Zero Tolerance Policy */}
        <section className="max-w-7xl mx-auto px-6 py-24 mb-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-primary mb-4 tracking-tighter">
              {langText("Zero Tolerance Policy", "कठोर धोरण")}
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto font-medium">
              {langText("The following behaviors will result in permanent account suspension.", "खालील वर्तणूक आढळल्यास खाते कायमचे बंद केले जाईल.")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "wrong_location", title: ["Fake Listings", "बनावट नोंदणी"], desc: ["Listing machines you do not own or using internet photos.", "दुसऱ्यांची मशीन किंवा इंटरनेटवरील फोटो वापरण्यास मनाई आहे."] },
              { icon: "person_off", title: ["Impersonation", "ओळख लपवणे"], desc: ["Misrepresenting your identity or business scale.", "तुमची खरी ओळख किंवा व्यवसायाची चुकीची माहिती देऊ नका."] },
              { icon: "voice_over_off", title: ["Abusive Language", "असभ्य भाषा"], desc: ["Threatening or harassing other users on call/message.", "इतर वापरकर्त्यांशी बोलताना असभ्य भाषेचा वापर करू नका."] }
            ].map((box, i) => (
              <div key={i} className="p-10 border border-error/25 bg-error-container/10 rounded-[2.5rem] text-center hover:scale-[1.02] transition-transform">
                <span className="material-symbols-outlined text-error text-6xl mb-8">{box.icon}</span>
                <h4 className="font-black text-2xl text-error mb-4">{langText(box.title[0], box.title[1])}</h4>
                <p className="text-error/80 text-sm font-bold leading-relaxed">{langText(box.desc[0], box.desc[1])}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Support CTA */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-outline-variant/30">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2 space-y-6">
              <p className="text-on-surface-variant font-medium text-lg leading-relaxed">
                {langText("Encountered a suspicious listing? Let us know to keep the community safe.", "काही संशयास्पद आढळल्यास, सर्वांच्या सुरक्षिततेसाठी आम्हाला कळवा.")}
              </p>
              <div className="pt-6 space-y-4">
                <div className="flex items-center gap-4 text-primary font-black text-xl">
                  <span className="material-symbols-outlined text-3xl">mail</span>
                  <span>{supportContact.email}</span>
                </div>
                <div className="flex items-center gap-4 text-primary font-black text-xl">
                  <span className="material-symbols-outlined text-3xl">call</span>
                  <span>{supportContact.phoneDisplay}</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-[2.5rem] bg-primary-container p-12 text-white shadow-2xl flex flex-col justify-between h-full">
                <div>
                   <p className="text-white/70 font-medium leading-relaxed mb-8">
                     {langText("Our support team is available Mon-Sat to help with platform usage.", "आमची टीम मदत करण्यासाठी सोमवार ते शनिवार उपलब्ध आहे.")}
                   </p>
                </div>
                <Link href="/support" className="bg-surface-container-lowest text-primary py-5 rounded-2xl font-black text-center hover:scale-105 active:scale-95 transition-all w-full">
                   {langText("Go to Support Center", "मदत केंद्रावर जा")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
