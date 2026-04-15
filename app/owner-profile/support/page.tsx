"use client";

import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { submitSupportRequestAction } from "@/lib/actions/local-data";
import { FormField, FormNotice, FormSection } from "@/components/forms/FormKit";
import { supportContact } from "@/lib/support-contact";
import { Button } from "@/components/ui/button";
import { supportRequestSchema } from "@/lib/validation/forms";
import { FormEvent, useState } from "react";

export default function SupportDashboard() {
  const { langText } = useLanguage();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copy = {
    invalidForm: langText("Please complete the support request form correctly.", "कृपया सपोर्ट विनंती फॉर्म योग्यरित्या पूर्ण करा."),
    submitFailed: langText("Could not submit your support ticket right now.", "सध्या तुमचे सपोर्ट तिकीट पाठवता आले नाही."),
    submitSuccess: langText("Support ticket submitted. We will get back to you within 24 hours.", "सपोर्ट तिकीट पाठवले गेले आहे. आम्ही 24 तासांच्या आत तुमच्याशी संपर्क करू."),
    heroTitle: langText("Help Center", "मदत केंद्र"),
    heroBody: langText(
      "Welcome to the Kisan Kamai owner support portal. We are here to keep your equipment business running smoothly.",
      "किसान कमाई मालक मदत पोर्टलवर आपले स्वागत आहे. तुमचा उपकरण व्यवसाय सुरळीत चालू राहावा यासाठी आम्ही येथे आहोत."
    ),
    searchPlaceholder: langText("Search for help...", "मदत शोधा..."),
    supportCards: [
      {
        title: langText("Listings", "सूचीकरण"),
        body: langText("How to list equipment, upload photos, and set prices.", "उपकरणे कशी सूचीबद्ध करायची, फोटो कसे अपलोड करायचे आणि दर कसे ठरवायचे."),
      },
      {
        title: langText("Bookings", "बुकिंग"),
        body: langText("Managing requests, confirmations, and scheduling.", "विनंत्या, पुष्टीकरणे आणि वेळापत्रक व्यवस्थापित करा."),
      },
      {
        title: langText("Payments", "देयके"),
        body: langText("Payout cycles, bank details, and commission rates.", "पेआउट सायकल, बँक तपशील आणि कमिशन दर."),
      },
      {
        title: langText("Technical", "तांत्रिक"),
        body: langText("App usage, account settings, and notification issues.", "अॅप वापर, खाते सेटिंग्ज आणि सूचना-संबंधित अडचणी."),
      },
    ],
    requestTitle: langText("Submit a request", "विनंती पाठवा"),
    requestBody: langText("Describe your issue and we will get back to you within 24 hours.", "तुमची अडचण सांगा आणि आम्ही 24 तासांच्या आत प्रतिसाद देऊ."),
    fullName: langText("Full Name", "पूर्ण नाव"),
    phone: langText("Phone Number", "फोन नंबर"),
    category: langText("Category", "प्रकार"),
    message: langText("Message", "संदेश"),
    enterName: langText("Enter name", "नाव टाका"),
    selectIssueType: langText("Select issue type", "अडचणीचा प्रकार निवडा"),
    paymentIssue: langText("Payment Issue", "पेमेंट समस्या"),
    equipmentDamage: langText("Equipment Damage", "उपकरणाचे नुकसान"),
    appError: langText("App Error", "अॅप त्रुटी"),
    profileUpdate: langText("Profile Update", "प्रोफाइल अपडेट"),
    describeIssue: langText("Describe your issue in detail...", "तुमची अडचण तपशीलवार सांगा..."),
    sending: langText("Sending...", "पाठवत आहे..."),
    sendTicket: langText("Send Ticket", "तिकीट पाठवा"),
    recentTickets: langText("Your Recent Tickets", "तुमची अलीकडील विनंत्या"),
    paymentTicket: langText("Payment for Booking #2441", "बुकिंग #2441 साठी पेमेंट"),
    resolvedAgo: langText("Resolved 2 days ago", "2 दिवसांपूर्वी निकाली काढले"),
    resolved: langText("Resolved", "निकाली"),
    listingApproval: langText("Listing Photo Approval", "लिस्टिंग फोटो मंजुरी"),
    updatedAgo: langText("Updated 4 hours ago", "4 तासांपूर्वी अद्यतनित"),
    inProgress: langText("In Progress", "प्रगतीत"),
    reassuranceTitle: langText("We have your back.", "आम्ही तुमच्यासोबत आहोत."),
    reassuranceBody: langText(
      "Kisan Kamai protects every owner with verification, safer payouts, and a responsive support team.",
      "किसान कमाई प्रत्येक मालकासाठी पडताळणी, सुरक्षित पेआउट आणि तत्पर सपोर्ट टीमसह संरक्षण देते."
    ),
    trustedOwners: langText("Trusted by 10,000+ owners", "10,000+ मालकांचा विश्वास"),
    contactUs: langText("Contact us directly", "आमच्याशी थेट संपर्क साधा"),
    callSupport: langText("Call Support", "सपोर्टला कॉल करा"),
    quickAnswers: langText("Quick answers for everyone", "सर्वांसाठी जलद उत्तरे"),
    browseLibrary: langText("Browse Help Library", "मदत संग्रह पहा"),
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    const parsed = supportRequestSchema.safeParse({
      fullName: form.get("fullName"),
      phone: form.get("phone"),
      email: "",
      category: form.get("category"),
      message: form.get("message"),
      sourcePath: "/owner-profile/support",
    });

    if (!parsed.success) {
      setError(
        parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          copy.invalidForm
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitSupportRequestAction(parsed.data);
      if (!result.ok) {
        setError(result.error || copy.submitFailed);
        return;
      }

      setSuccess(copy.submitSuccess);
      event.currentTarget.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Support Hero / Intro Section */}
      <section className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-primary dark:text-emerald-50 tracking-tight leading-tight">{copy.heroTitle}</h2>
            <p className="text-on-surface-variant dark:text-slate-400 max-w-2xl font-medium leading-relaxed mt-2">
              {copy.heroBody}
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <input className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 dark:text-white" placeholder={copy.searchPlaceholder} type="text" />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          </div>
        </div>

        {/* Bento Grid - Support Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Listing Help */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all hover:border-emerald-200 dark:hover:border-emerald-700 group cursor-pointer">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors text-emerald-700 dark:text-emerald-400">
              <span className="material-symbols-outlined text-3xl">post_add</span>
            </div>
            <h3 className="font-headline font-bold text-lg mb-1 dark:text-emerald-50">{copy.supportCards[0].title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{copy.supportCards[0].body}</p>
          </div>
          {/* Bookings Help */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all hover:border-orange-200 dark:hover:border-amber-700 group cursor-pointer">
            <div className="w-12 h-12 bg-orange-50 dark:bg-amber-900/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500 dark:group-hover:bg-amber-600 group-hover:text-white transition-colors text-orange-700 dark:text-amber-500">
              <span className="material-symbols-outlined text-3xl">event_available</span>
            </div>
            <h3 className="font-headline font-bold text-lg mb-1 dark:text-emerald-50">{copy.supportCards[1].title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{copy.supportCards[1].body}</p>
          </div>
          {/* Payments Help */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all hover:border-emerald-200 dark:hover:border-emerald-700 group cursor-pointer">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors text-emerald-700 dark:text-emerald-400">
              <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            </div>
            <h3 className="font-headline font-bold text-lg mb-1 dark:text-emerald-50">{copy.supportCards[2].title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{copy.supportCards[2].body}</p>
          </div>
          {/* Technical Help */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all hover:border-slate-300 dark:hover:border-slate-600 group cursor-pointer">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-500 group-hover:text-white transition-colors text-slate-700 dark:text-slate-400">
              <span className="material-symbols-outlined text-3xl">phonelink_setup</span>
            </div>
            <h3 className="font-headline font-bold text-lg mb-1 dark:text-emerald-50">{copy.supportCards[3].title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{copy.supportCards[3].body}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Support Form Column */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="material-symbols-outlined text-9xl">support_agent</span>
              </div>
              <h3 className="text-2xl font-black text-primary dark:text-emerald-50 mb-2 relative z-10">{copy.requestTitle}</h3>
              <p className="text-on-surface-variant dark:text-slate-400 mb-8 font-medium relative z-10">{copy.requestBody}</p>

              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                {error ? <FormNotice tone="error">{error}</FormNotice> : null}
                {success ? <FormNotice tone="success">{success}</FormNotice> : null}
                <FormSection title={copy.requestTitle} description={copy.requestBody}>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField label={copy.fullName}>
                      <input className="kk-input" name="fullName" placeholder={copy.enterName} type="text" />
                    </FormField>
                    <FormField label={copy.phone}>
                      <input className="kk-input" name="phone" placeholder="+91" type="tel" />
                    </FormField>
                  </div>
                  <div className="mt-6 space-y-6">
                    <FormField label={copy.category}>
                      <select className="kk-input" name="category">
                        <option className="dark:bg-slate-800">{copy.selectIssueType}</option>
                        <option className="dark:bg-slate-800">{copy.paymentIssue}</option>
                        <option className="dark:bg-slate-800">{copy.equipmentDamage}</option>
                        <option className="dark:bg-slate-800">{copy.appError}</option>
                        <option className="dark:bg-slate-800">{copy.profileUpdate}</option>
                      </select>
                    </FormField>
                    <FormField label={copy.message}>
                      <textarea className="kk-input resize-y" name="message" placeholder={copy.describeIssue} rows={4}></textarea>
                    </FormField>
                    <Button className="mt-2 w-full md:w-auto" disabled={isSubmitting} type="submit">
                      {isSubmitting ? copy.sending : copy.sendTicket}
                      <span className="material-symbols-outlined">send</span>
                    </Button>
                  </div>
                </FormSection>
              </form>
            </div>

            {/* Recent Help Requests */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-primary dark:text-emerald-50 px-2">{copy.recentTickets}</h3>
              <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/50 shadow-sm">
                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-primary dark:text-emerald-50">{copy.paymentTicket}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{copy.resolvedAgo}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg whitespace-nowrap">{copy.resolved}</span>
                </div>
                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">schedule</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-primary dark:text-emerald-50">{copy.listingApproval}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{copy.updatedAgo}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 rounded-lg whitespace-nowrap">{copy.inProgress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Contact Info Column */}
          <div className="space-y-8">
            {/* Trust & Reassurance Card */}
            <div className="bg-primary-container dark:bg-emerald-900/80 p-6 rounded-3xl text-white shadow-sm overflow-hidden relative">
              <div className="relative mb-6 h-32 overflow-hidden rounded-xl">
                <Image
                  alt="Agriculture Scene"
                  className="object-cover grayscale opacity-60"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFt3CXXerkBJIc6-_qQumYHHFQV8eciEbcTGHyMl78up8HHSHKYUxEdmwVsOjtK4yUl-XEhlzFjpUgK3_VHiBYELNIjJfNZgI3SE63pgp93VapX21zJC5mbtioXpCj_j4KVdEmg5hetUAfeGZzcbRXn0uZFEtK9GhLDhDECoE-MFMNfHqQfAL2JnpMi3tUQjcipZPt7uY63npTXGN8W7jRfKS-4TERA9DRQwX0H4JR7q9f-4HBDa8BJkn_maqERQxT7tiON-niC-Ua"
                  fill
                  sizes="(min-width: 1024px) 360px, 100vw"
                />
              </div>
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-2">{copy.reassuranceTitle}</h4>
                <p className="text-on-primary-container dark:text-emerald-100/80 text-sm leading-relaxed mb-4">
                  {copy.reassuranceBody}
                </p>
                <div className="flex items-center gap-2 text-on-tertiary-container dark:text-emerald-300 font-bold text-xs uppercase tracking-widest mt-6">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  {copy.trustedOwners}
                </div>
              </div>
            </div>

            {/* Direct Contact Options */}
            <div className="space-y-4">
              <h4 className="font-headline font-bold text-lg px-2 dark:text-emerald-50">{copy.contactUs}</h4>
              <a className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-600 transition-all group" href={supportContact.whatsappHref}>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors text-emerald-600 dark:text-emerald-400 shrink-0">
                  <span className="material-symbols-outlined text-[24px]">chat</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">WhatsApp</p>
                  <p className="font-bold text-primary dark:text-emerald-50 text-sm">{supportContact.whatsappDisplay}</p>
                </div>
              </a>
              <a className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-orange-500 transition-all group" href={supportContact.phoneHref}>
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors text-orange-600 dark:text-orange-500 shrink-0">
                  <span className="material-symbols-outlined text-[24px]">call</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{copy.callSupport}</p>
                  <p className="font-bold text-primary dark:text-emerald-50 text-sm">{supportContact.phoneDisplay}</p>
                </div>
              </a>
              <a className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-slate-600 transition-all group" href={supportContact.emailHref}>
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-800 dark:group-hover:bg-slate-700 group-hover:text-white transition-colors text-slate-600 dark:text-slate-400 shrink-0">
                  <span className="material-symbols-outlined text-[24px]">mail</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Email</p>
                  <p className="font-bold text-primary dark:text-emerald-50 text-sm">{supportContact.email}</p>
                </div>
              </a>
            </div>

            {/* FAQ Sidebar Link */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">{copy.quickAnswers}</p>
              <Link href="/faq">
                <button className="w-full py-3 border-2 border-emerald-900 dark:border-emerald-700 text-emerald-900 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-900 hover:text-white dark:hover:bg-emerald-800 transition-all">
                  {copy.browseLibrary}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


