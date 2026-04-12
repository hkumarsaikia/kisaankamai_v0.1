"use client";

import { useLanguage } from "@/components/LanguageContext";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function FeedbackPage() {
  const { langText } = useLanguage();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/feedback/success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950 text-on-surface">
      <Header />
      <main className="flex-grow flex flex-col items-center pb-20">
      {/* Hero Section */}
      <section className="w-full max-w-[1200px] px-4 md:px-8 py-8 md:py-12 mt-4">
        <div className="relative w-full rounded-2xl overflow-hidden bg-surface-container shadow-sm border border-surface-variant flex flex-col md:flex-row min-h-[300px]">
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-primary-container z-10">
            <h1 className="text-on-primary font-headline text-3xl md:text-5xl font-bold leading-tight mb-4">
              {langText("Share Your Feedback", "तुमचे अभिप्राय कळवा")}
            </h1>
            <p className="text-on-primary-container font-body text-base md:text-lg max-w-md">
              {langText(
                "Help us improve Kisan Kamai for every farmer and equipment owner.",
                "प्रत्येक शेतकरी आणि उपकरण मालकासाठी किसान कमाई सुधारण्यास आम्हाला मदत करा."
              )}
            </p>
          </div>
          <div
            className="absolute inset-0 md:relative md:w-[45%] opacity-30 md:opacity-100 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA8Xr4lg_H-izzJrrcejcw45UXzCzstoO5DhWjUiCzPQl7r63nMHpKCjm44kOpnkjjrxBxEp8nX_pMfD9JQmAqaiGoatR1ac_-I4kCOjqvQPs2T0Zui_OLEYTlWAVcK9TUr6oMbabE9LTHbEMEK6Ylb6QYzY1UFFQeWAUtxRlOm99rUnxMQ_7mrC5RDTik0hmPYx-a2UpU5hbsvrf4L5QWP_grh7vLxy_ou4OoZV81SSUms7UyrSTFhtTOUNQ4TuEqOpxNG8U9DstKz')",
            }}
          ></div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="w-full max-w-[800px] px-4 md:px-8">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-variant p-6 md:p-10">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            {/* Personal Info Group */}
            <fieldset className="flex flex-col gap-6">
              <legend className="sr-only">{langText("Personal Information", "वैयक्तिक माहिती")}</legend>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-2">
                  <label htmlFor="fullName" className="font-headline font-semibold text-on-surface text-base">
                    {langText("Full Name", "पूर्ण नाव")} <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    required
                    placeholder={langText("Enter your full name", "तुमचे पूर्ण नाव प्रविष्ट करा")}
                    className="form-input w-full rounded-lg border border-outline bg-surface focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 font-body text-on-surface"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label htmlFor="mobileNumber" className="font-headline font-semibold text-on-surface text-base">
                    {langText("Mobile Number", "मोबाईल नंबर")} <span className="text-error">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    required
                    placeholder={langText("Enter 10 digit number", "१० अंकी नंबर प्रविष्ट करा")}
                    className="form-input w-full rounded-lg border border-outline bg-surface focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 font-body text-on-surface"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-headline font-semibold text-on-surface text-base">
                  {langText("Email", "ईमेल")} <span className="text-on-surface-variant font-normal text-sm">({langText("Optional", "पर्यायी")})</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder={langText("Enter your email address", "तुमचा ईमेल ॲड्रेस प्रविष्ट करा")}
                  className="form-input w-full rounded-lg border border-outline bg-surface focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 font-body text-on-surface"
                />
              </div>
            </fieldset>

            <hr className="border-surface-variant" />

            {/* Feedback Details Group */}
            <fieldset className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label className="font-headline font-semibold text-on-surface text-base">
                  {langText("I am a...", "मी एक...")} <span className="text-error">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { val: "farmer", en: "Farmer", mr: "शेतकरी" },
                    { val: "owner", en: "Equipment Owner", mr: "मालक" },
                    { val: "partner", en: "Partner", mr: "भागीदार" },
                    { val: "visitor", en: "Visitor", mr: "अभ्यागत", def: true },
                  ].map((role) => (
                    <label key={role.val} className="cursor-pointer group">
                      <input type="radio" name="role" value={role.val} defaultChecked={role.def} className="peer sr-only" />
                      <div className="px-5 py-2.5 rounded-full border border-outline bg-surface text-on-surface font-label text-sm font-medium transition-all peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary-container hover:bg-surface-container-high">
                        {langText(role.en, role.mr)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="font-headline font-semibold text-on-surface text-base">
                  {langText("Feedback Category", "अभिप्रायाची श्रेणी")} <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    required
                    className="form-select w-full rounded-lg border border-outline bg-surface focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 font-body text-on-surface appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      {langText("Select a category...", "एक श्रेणी निवडा...")}
                    </option>
                    <option value="website">{langText("Website Experience", "वेबसाईट अनुभव")}</option>
                    <option value="booking">{langText("Booking Experience", "बुकिंग अनुभव")}</option>
                    <option value="listing">{langText("Listing Experience", "लिस्टिंग अनुभव")}</option>
                    <option value="support">{langText("Support Experience", "सपोर्ट अनुभव")}</option>
                    <option value="payment">{langText("Payment & Pricing", "पेमेंट आणि किंमत")}</option>
                    <option value="suggestion">{langText("Suggestion", "सूचना")}</option>
                    <option value="issue">{langText("Report an Issue", "समस्येची तक्रार करा")}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
                    <span className="material-symbols-outlined text-xl">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="font-headline font-semibold text-on-surface text-base">
                  {langText("Subject", "विषय")} <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  placeholder={langText("Brief subject of your feedback", "तुमच्या अभिप्रायाचा संक्षिप्त विषय")}
                  className="form-input w-full rounded-lg border border-outline bg-surface focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 font-body text-on-surface"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-headline font-semibold text-on-surface text-base">
                  {langText("Feedback Message", "संदेश")} <span className="text-error">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder={langText("Please describe your experience or suggestion in detail...", "कृपया तुमचा अनुभव किंवा सूचना सविस्तर सांगा...")}
                  className="form-textarea w-full rounded-lg border border-outline bg-surface focus:border-primary focus:ring-1 focus:ring-primary p-4 font-body text-on-surface resize-y"
                ></textarea>
              </div>
            </fieldset>

            {/* Rating & Final Options */}
            <fieldset className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label className="font-headline font-semibold text-on-surface text-base">
                  {langText("Overall Satisfaction", "एकूण समाधान")}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" className="text-outline hover:text-tertiary-container transition-colors">
                      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 mt-2">
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    id="contactMe"
                    className="form-checkbox w-5 h-5 rounded border-outline text-primary focus:ring-primary bg-surface cursor-pointer"
                  />
                </div>
                <label htmlFor="contactMe" className="font-body text-on-surface text-sm cursor-pointer">
                  {langText("Contact me about this feedback", "या अभिप्रायाबाबत माझ्याशी संपर्क साधा")}
                </label>
              </div>
            </fieldset>

            {/* Submit Area */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-surface-variant">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">lock</span>
                <span className="font-body text-sm">
                  {langText("Your feedback is handled securely.", "तुमचा अभिप्राय सुरक्षितपणे हाताळला जातो.")}
                </span>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-primary text-on-primary font-label font-bold rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary whitespace-nowrap shadow-sm"
              >
                {langText("Submit Feedback", "सबमिट करा")}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
    <Footer />
  </div>
  );
}
