"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

interface FAQItem {
  q: string;
  qMr: string;
  a: string;
  aMr: string;
}

function FAQAccordion({ item, color }: { item: FAQItem; color: string }) {
  const [open, setOpen] = useState(false);
  const { langText } = useLanguage();
  return (
    <div className="bg-surface-container-lowest dark:bg-slate-900/40 rounded-xl border border-outline-variant dark:border-slate-800/50 overflow-hidden shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full p-6 flex justify-between items-center cursor-pointer hover:bg-surface-container-low dark:hover:bg-slate-900/50 transition-colors group text-left">
        <div className="flex-1 pr-4">
          <h3 className="font-bold text-lg text-on-surface dark:text-emerald-50">{langText(item.q, item.qMr)}</h3>
        </div>
        <span className={`material-symbols-outlined ${color} transition-transform ${open ? "rotate-180" : ""}`}>expand_more</span>
      </button>
      {open && (
        <div className="px-6 pb-6 text-on-surface-variant dark:text-slate-300 border-t border-slate-50 dark:border-slate-800/50 pt-4 bg-white/50 dark:bg-slate-950/30">
          <p>{langText(item.a, item.aMr)}</p>
        </div>
      )}
    </div>
  );
}

const rentingFAQs: FAQItem[] = [
  { q: "How do I book a tractor or harvester?", qMr: "मी ट्रॅक्टर किंवा हार्वेस्टर कसं बुक करू शकतो?", a: "You can browse available equipment in your area, select your required dates, and click 'Book Now'. We will connect you with the owner to finalize the schedule.", aMr: "तुम्ही तुमच्या परिसरातील उपलब्ध उपकरणे पाहू शकता, तुमच्या तारखा निवडा आणि 'Book Now' वर क्लिक करा. आम्ही तुम्हाला मालकाशी जोडून देऊ." },
  { q: "Are there any transport charges?", qMr: "वाहतूक खर्च अतिरिक्त आहे का?", a: "Transport charges depend on the distance between the equipment location and your farm. These are usually discussed and finalized with the owner before booking.", aMr: "वाहतूक खर्च उपकरणे आणि तुमच्या शेतामधील अंतरावर अवलंबून असतो. बुकिंग करण्यापूर्वी मालकाशी यावर चर्चा केली जाते." },
  { q: "Can I cancel a booking?", qMr: "मी बुकिंग रद्द करू शकतो का?", a: "Yes, you can cancel a booking up to 24 hours before the scheduled start time for a full refund. Cancellations within 24 hours may incur a small fee.", aMr: "होय, निर्धारित वेळेच्या 24 तास अगोदर बुकिंग रद्द करून पूर्ण परतावा मिळू शकतो. 24 तासांच्या आत रद्द केल्यास थोडे शुल्क लागू शकते." },
];

const listingFAQs: FAQItem[] = [
  { q: "How much does it cost to list my tractor?", qMr: "माझा ट्रॅक्टर सूचीबद्ध करण्यासाठी किती खर्च येईल?", a: "Listing your equipment on Kisan Kamai is currently free. We only charge a small platform fee when you successfully receive a paid booking through us.", aMr: "किसान कमाईवर तुमची उपकरणे सूचीबद्ध करणे सध्या विनामूल्य आहे. जेव्हा तुम्हाला आमच्यामार्फत बुकिंग मिळते, तेव्हाच आम्ही शुल्क घेतो." },
  { q: "What documents do I need to list?", qMr: "सूचीबद्ध करण्यासाठी मला कोणती कागदपत्रे लागतील?", a: "You'll need your Aadhar/PAN card, equipment registration documents, and clear photos of your equipment. Our team will guide you through the verification process.", aMr: "तुम्हाला तुमचे आधार/पॅन कार्ड, उपकरण नोंदणी कागदपत्रे, आणि तुमच्या उपकरणाचे स्पष्ट फोटो लागतील. आमची टीम पडताळणी प्रक्रियेत तुम्हाला मार्गदर्शन करेल." },
];

const paymentFAQs: FAQItem[] = [
  { q: "Can I pay after the work is done?", qMr: "काम पूर्ण झाल्यानंतर मी पैसे देऊ शकतो का?", a: "A small advance may be required to confirm the booking. The remaining balance is typically paid directly to the operator once the service is completed.", aMr: "बुकिंग निश्चित करण्यासाठी आगाऊ रक्कम द्यावी लागेल. उर्वरित रक्कम काम पूर्ण झाल्यावर ऑपरेटरला दिली जाते." },
  { q: "What payment methods do you accept?", qMr: "तुम्ही कोणत्या पेमेंट पद्धती स्वीकारता?", a: "We accept UPI (Google Pay, PhonePe, Paytm), bank transfer, and cash payments at our regional hubs.", aMr: "आम्ही UPI (Google Pay, PhonePe, Paytm), बँक ट्रान्सफर आणि आमच्या प्रादेशिक हबवर रोख पेमेंट स्वीकारतो." },
];

const trustFAQs: FAQItem[] = [
  { q: "How do you verify equipment owners?", qMr: "तुम्ही उपकरणे मालकांची पडताळणी कशी करता?", a: "We verify owners through mobile number verification, local background checks in active districts, and user reviews after every rental job.", aMr: "आम्ही मोबाईल नंबर पडताळणी, स्थानिक तपासणी आणि प्रत्येक भाड्याच्या कामानंतर युजर रिव्ह्यूद्वारे मालकांची पडताळणी करतो." },
  { q: "Is my payment safe?", qMr: "माझे पेमेंट सुरक्षित आहे का?", a: "Yes, all payments are processed through our secure payment gateway. Your booking is protected by the Kisan Kamai Guarantee—payment is only released after work completion.", aMr: "होय, सर्व पेमेंट आमच्या सुरक्षित पेमेंट गेटवेद्वारे प्रक्रिया केली जातात. तुमचे बुकिंग किसान कमाई गॅरंटीने संरक्षित आहे—काम पूर्ण झाल्यानंतरच पेमेंट रिलीज होते." },
];

export default function FAQ() {
  const { langText } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-emerald-50 mb-4 tracking-tight">{langText("How can we help you?", "आम्ही तुम्हाला कशी मदत करू शकतो?")}</h1>
            <p className="text-lg text-on-surface-variant dark:text-slate-400 font-medium">{langText("Find answers to common questions about renting and listing on Kisan Kamai.", "किसान कमाईवर भाड्याने घेणे आणि सूचीबद्ध करण्याबद्दल सामान्य प्रश्नांची उत्तरे शोधा.")}</p>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {/* Renting */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-primary-fixed dark:border-slate-700">
                <span className="material-symbols-outlined text-primary dark:text-emerald-400 text-3xl">shopping_cart</span>
                <div>
                  <h2 className="text-2xl font-bold text-primary dark:text-emerald-50">{langText("Renting Equipment", "उपकरणे भाड्याने घेणे")}</h2>
                </div>
              </div>
              {rentingFAQs.map((faq) => <FAQAccordion key={faq.q} item={faq} color="text-primary dark:text-emerald-400" />)}
            </section>

            {/* Listing */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-secondary-fixed dark:border-amber-800">
                <span className="material-symbols-outlined text-secondary dark:text-amber-400 text-3xl">sell</span>
                <div>
                  <h2 className="text-2xl font-bold text-secondary dark:text-amber-400">{langText("Listing Equipment", "उपकरणे सूचीबद्ध करणे")}</h2>
                </div>
              </div>
              {listingFAQs.map((faq) => <FAQAccordion key={faq.q} item={faq} color="text-secondary dark:text-amber-400" />)}
            </section>

            {/* Booking & Payment */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-tertiary-fixed dark:border-amber-700">
                <span className="material-symbols-outlined text-tertiary-container dark:text-amber-500 text-3xl">payments</span>
                <div>
                  <h2 className="text-2xl font-bold text-tertiary dark:text-amber-300">{langText("Booking & Payment", "बुकिंग आणि पेमेंट")}</h2>
                </div>
              </div>
              {paymentFAQs.map((faq) => <FAQAccordion key={faq.q} item={faq} color="text-tertiary-container dark:text-amber-500" />)}
            </section>

            {/* Trust & Safety */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-outline dark:border-slate-800">
                <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-400 text-3xl">verified_user</span>
                <div>
                  <h2 className="text-2xl font-bold text-on-surface dark:text-emerald-50">{langText("Trust & Safety", "विश्वास आणि सुरक्षा")}</h2>
                </div>
              </div>
              {trustFAQs.map((faq) => <FAQAccordion key={faq.q} item={faq} color="text-on-surface-variant dark:text-slate-400" />)}
            </section>
          </div>

          {/* Contact CTA */}
          <div className="mt-24 p-8 md:p-12 bg-primary-container rounded-3xl relative overflow-hidden">
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{langText("Still have questions?", "अजून प्रश्न आहेत?")}</h2>
              <p className="text-on-primary-container text-lg mb-8">{langText("Our team is ready to help you find the right equipment or help you list your own.", "आमची टीम तुम्हाला योग्य उपकरणे शोधण्यात किंवा तुमची स्वतःची सूचीबद्ध करण्यात मदत करण्यास तयार आहे.")}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors">
                  <span className="material-symbols-outlined">call</span>
                  {langText("Call Support", "सपोर्ट कॉल करा")}
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined">chat</span>
                  {langText("WhatsApp Us", "व्हॉट्सअ‍ॅप करा")}
                </button>
              </div>
              <p className="mt-6 text-white/80 font-semibold font-mukta">{langText("Contact: +91 98765 43210", "संपर्क करा: +91 98765 43210")}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
