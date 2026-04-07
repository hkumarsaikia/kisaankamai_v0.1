"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

export default function ListEquipment() {
  const { langText } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#0f1a14]">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[870px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/80 to-transparent z-10"></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Farmer with tractor in sugarcane field" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpJNrHUhz2IVLOk8s20PA7GB7Td4tJa3tkVfqY2uvx4s3YdLgn1vqZX12LfmdgfhNIPSsL-yc67FdukLdGtl02Z8M_XgXPkHu5fN0MHfiib-OLwDso9DhjaNGZ85EJs484Lth2-XlFRgZ7D8Z7YwRujfWl6at-ANFRZ7JiNgI9_zqJOF9FThdiLwtaGJsEJxNTJw3kw9dTyquLXw2IL6PNz5OygaUfcoFoHdCDNRs4CqLnCQm0F9nbvG59y_VaMsoTZbnAUWgzUIM7" />
          </div>
          <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/20 text-secondary-container rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>stars</span>
                {langText("Empowering Rural Owners", "ग्रामीण मालकांना सक्षम बनवणे")}
              </span>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
                {langText("Your Equipment,", "तुमची उपकरणे,")} <br />
                <span className="text-on-tertiary-container">{langText("Your Extra Income.", "तुमचे अतिरिक्त उत्पन्न.")}</span>
              </h1>
              <p className="font-body text-xl text-on-primary-container/90 mb-10 leading-relaxed max-w-xl">
                {langText("List your tractors, harvesters, and implements on Kisan Kamai. Reach verified farmers across Sangli, Satara, and Kolhapur.", "तुमचे ट्रॅक्टर, हार्वेस्टर आणि उपकरणे किसान कमाईवर सूचीबद्ध करा. सांगली, सातारा आणि कोल्हापूरमधील सत्यापित शेतकऱ्यांपर्यंत पोहोचा.")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-secondary text-white px-8 py-4 rounded-xl font-headline font-bold text-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-secondary/20">
                  {langText("List and Earn Now", "सूचीबद्ध करा आणि कमवा")}
                </button>
                <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-white/20 active:scale-95 transition-all">
                  {langText("Check Earnings Potential", "कमाई क्षमता तपासा")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Why List Section */}
        <section className="py-24 bg-white dark:bg-emerald-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="font-headline text-4xl font-extrabold text-primary dark:text-emerald-50 mb-4">{langText("Why Partners Choose Kisan Kamai", "भागीदार किसान कमाई का निवडतात")}</h2>
                <p className="text-on-surface-variant dark:text-slate-400 text-lg">{langText("We build technology to ensure your expensive machinery is never sitting idle when it could be earning.", "आम्ही तंत्रज्ञान बनवतो जेणेकरून तुमची महागडी यंत्रसामग्री कधीही निष्क्रिय बसणार नाही जेव्हा ती कमवू शकते.")}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "speed", title: langText("Maximum Efficiency", "जास्तीत जास्त कार्यक्षमता"), desc: langText("Reduce downtime by filling gaps in your seasonal schedule. Our smart matching connects you with nearby demand instantly.", "तुमच्या हंगामी वेळापत्रकातील विश्रांती भरून काढा. आमचे स्मार्ट मॅचिंग तुम्हाला जवळच्या मागणीशी त्वरित जोडते.") },
                { icon: "verified_user", title: langText("Verified Trust", "सत्यापित विश्वास"), desc: langText("Every renter is identity-verified. We provide the security layer you need to lease your equipment with complete peace of mind.", "प्रत्येक भाडेकरू ओळख-सत्यापित आहे. तुमची उपकरणे पूर्ण मनःशांतीने भाडेपट्ट्यावर देण्यासाठी आम्ही सुरक्षा स्तर प्रदान करतो.") },
                { icon: "payments", title: langText("Secure Payments", "सुरक्षित पेमेंट"), desc: langText("No more chasing collections. Payments are handled securely through the platform and transferred directly to your bank account.", "आता संकलन मागेपुढे करण्याची गरज नाही. पेमेंट प्लॅटफॉर्मद्वारे सुरक्षितपणे हाताळले जातात आणि थेट तुमच्या बँक खात्यात हस्तांतरित होतात.") },
              ].map((item) => (
                <div key={item.title} className="p-8 rounded-3xl bg-surface-container-low dark:bg-emerald-900/20 border border-surface-container-highest dark:border-emerald-800/50 group hover:border-primary-container/30 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center mb-6 shadow-inner">
                    <span className="material-symbols-outlined text-on-primary-container text-3xl">{item.icon}</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-primary dark:text-emerald-50 mb-4">{item.title}</h3>
                  <p className="text-on-surface-variant dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3-Step Guide */}
        <section className="py-24 bg-primary-container relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full text-white fill-current" viewBox="0 0 100 100"><circle cx="100" cy="0" r="80"></circle></svg>
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white mb-4">{langText("Start Earning in Minutes", "मिनिटांत कमाई सुरू करा")}</h2>
              <p className="text-on-primary-container text-lg max-w-xl mx-auto">{langText("Three simple steps to transition from owner to professional equipment partner.", "मालकापासून व्यावसायिक उपकरण भागीदारापर्यंत जाण्यासाठी तीन सोपी पावले.")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
              <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-white/10 z-0"></div>
              {[
                { num: "1", title: langText("Create Profile", "प्रोफाइल तयार करा"), desc: langText("Enter your personal details and location. Set up your KYC to receive payments.", "तुमचे वैयक्तिक तपशील आणि स्थान प्रविष्ट करा. पेमेंट प्राप्त करण्यासाठी KYC सेट करा.") },
                { num: "2", title: langText("Add Details", "तपशील जोडा"), desc: langText("Upload clear photos, model information, and set your daily or hourly rental rates.", "स्पष्ट फोटो, मॉडेल माहिती अपलोड करा आणि तुमच्या दैनिक किंवा प्रति तास भाड्याचे दर सेट करा.") },
                { num: "3", title: langText("Go Live", "लाइव्ह करा"), desc: langText("Your listing is verified and published. Start receiving booking requests from local farmers.", "तुमची यादी सत्यापित आणि प्रकाशित केली जाते. स्थानिक शेतकऱ्यांकडून बुकिंग विनंत्या प्राप्त करणे सुरू करा.") },
              ].map((step, i) => (
                <div key={step.num} className={`flex flex-col items-center px-8 relative z-10 ${i > 0 ? "mt-16 md:mt-0" : ""}`}>
                  <div className={`w-24 h-24 rounded-full ${i === 2 ? "bg-on-tertiary-container text-white" : "bg-secondary-container text-on-secondary-container"} flex items-center justify-center text-3xl font-black mb-8 border-8 border-primary-container shadow-xl`}>{step.num}</div>
                  <h4 className="font-headline text-2xl font-bold text-white mb-3 text-center">{step.title}</h4>
                  <p className="text-on-primary-container text-center leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-24 bg-surface dark:bg-[#0f1a14]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-headline text-4xl font-extrabold text-primary dark:text-emerald-50">{langText("What Can You List?", "तुम्ही काय सूचीबद्ध करू शकता?")}</h2>
              <div className="flex gap-2">
                {["Sangli", "Satara", "Kolhapur"].map((d) => (
                  <span key={d} className="px-4 py-1 bg-primary/5 dark:bg-emerald-800/30 rounded-full text-primary dark:text-emerald-300 text-sm font-semibold border border-primary/10 dark:border-emerald-700">{d}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: langText("Tractors", "ट्रॅक्टर"), desc: langText("40HP - 90HP utility and heavy-duty tractors.", "40HP - 90HP उपयुक्त आणि हेवी-ड्यूटी ट्रॅक्टर."), img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBukZQoo5oJvbevO4qV7eu-5dby7ya1GJpkvTMIXTHsCIrNR6cgRzo54NK0074M6OhAGoPYJL7szxrJXEW3vAOYUh4e_pUxtCu3znzHcm7ShNPbxPIoP8acImacO4UjCMtLAGeP2mXB-JmZ78MhhwAzue44BgWw1EJwAMrFa3BWEYMmEMqYumO7OKgY92HBbto86xJyvIwUcgxhiqldIEd0n98NDTjiLHckPI4JRm7m_q_KXPMF5d_Qv7126uqqthXj-L1H8OJXQh4p" },
                { title: langText("Harvesters", "हार्वेस्टर"), desc: langText("Sugar cane, maize, and grain combine harvesters.", "ऊस, मका, आणि धान्य कंबाइन हार्वेस्टर."), img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC07V_J8rC9ZxUmwsJkDMPLUHPrVlFCfmLY6NrCUUoob2MglR3lPKgWnIl1Tb16YvOvE9Wdt-Iqeo8dF97x5ZlbTyhSu_8ax0tIXeAbxif6c6zi1G8mIqdv4_z88AqrjDPNGgCFJFN2jEjJOn3KHawqmuKn0k7psO3qpSSz_9Q74gdoP5Cm2HnzmqYgbS8YeQwce_YUqbJ-6TYD5icCHJAHSx5KvD88HDqlQVc0n7I6xV7vtPYTdEAE6xa_EVGjcKmBt_EFnCrcVCbM" },
                { title: langText("Implements", "उपकरणे"), desc: langText("Rotavators, seeders, plows, and sprayers.", "रोटाव्हेटर, सीडर, नांगर, आणि फवारणी यंत्रे."), img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWNILv7etn7BACAHYnqBIb4d8ktEUtzdDUp6alIpwc94MAjjKoI9hxCiggbV8_SsvJyYmq4pMBsLby8-7S6tdwZrLF8qMGRWduXvnORhMyuPWrracmAskfqO34CzCDw5zfkJG3qtLsPFMtisgo8rgOWaojAMva6bPQAwBdQFWtj6SOWHz9MgR_Xw0qwYb23vHe9MXWo2tUnWd46qkthXZN_gwFkn2u2M19IVTNFPNB5R52l-jj_1m8HT9OPCa9V9z-jSLXqR75jjIK" },
              ].map((cat) => (
                <div key={cat.title} className="relative group rounded-3xl overflow-hidden aspect-[4/5] shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={cat.img} />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="font-headline text-2xl font-bold text-white mb-2">{cat.title}</h3>
                    <p className="text-white/80 text-sm mb-4">{cat.desc}</p>
                    <button className="w-full py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl text-sm font-bold hover:bg-white/30 transition-all uppercase tracking-wider">{langText("List Now", "आता सूचीबद्ध करा")}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto rounded-[3rem] bg-on-tertiary-fixed relative overflow-hidden flex flex-col md:flex-row items-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="p-12 md:p-20 relative z-10 md:w-3/5">
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white mb-8">{langText("Ready to grow your farming business?", "तुमचा शेती व्यवसाय वाढवायला तयार?")}</h2>
              <p className="text-on-tertiary-fixed-variant text-xl mb-10 leading-relaxed">{langText("Join hundreds of equipment owners in South Maharashtra who are earning better through Kisan Kamai.", "दक्षिण महाराष्ट्रातील शेकडो उपकरण मालकांसोबत सामील व्हा जे किसान कमाईद्वारे चांगले कमावत आहेत.")}</p>
              <div className="flex flex-wrap gap-6">
                <button className="bg-white text-primary px-10 py-5 rounded-2xl font-headline font-extrabold text-xl shadow-xl hover:scale-105 active:scale-95 transition-all">{langText("Start Listing Today", "आज सूचीबद्ध करणे सुरू करा")}</button>
                <div className="flex flex-col">
                  <span className="text-white/60 text-sm font-semibold mb-1">{langText("Talk to an expert", "तज्ञाशी बोला")}</span>
                  <span className="text-white font-bold text-xl tracking-wide">+91 1800-KISAN-KAMAI</span>
                </div>
              </div>
            </div>
            <div className="md:w-2/5 p-12 md:p-20 flex justify-center items-center">
              <div className="relative">
                <div className="absolute -inset-10 bg-on-tertiary-container/30 blur-3xl rounded-full"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
                    </div>
                    <div>
                      <div className="font-bold text-lg">{langText("Verified Partner", "सत्यापित भागीदार")}</div>
                      <div className="text-sm text-white/70">{langText("Sangli District", "सांगली जिल्हा")}</div>
                    </div>
                  </div>
                  <blockquote className="text-lg italic leading-relaxed text-white/90">
                    {langText("\"Listing my rotavator during the off-season helped me cover its yearly maintenance and earn extra. The platform makes everything easy.\"", "\"ऑफ-सीझनमध्ये माझा रोटाव्हेटर सूचीबद्ध केल्यामुळे मला त्याच्या वार्षिक देखभालीचा खर्च भागवता आला आणि अतिरिक्त कमाई झाली. प्लॅटफॉर्म सर्व काही सोपे करतो.\"")}
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
