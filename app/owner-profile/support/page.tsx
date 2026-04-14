"use client";

import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { submitSupportRequestAction } from "@/lib/actions/firebase-data";
import { FormField, FormNotice, FormSection } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";
import { supportRequestSchema } from "@/lib/validation/forms";
import { FormEvent, useState } from "react";

export default function SupportDashboard() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          "Please complete the support request form correctly."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitSupportRequestAction(parsed.data);
      if (!result.ok) {
        setError(result.error || "Could not submit your support ticket right now.");
        return;
      }

      setSuccess("Support ticket submitted. We will get back to you within 24 hours.");
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
            <h2 className="text-4xl font-black text-primary dark:text-emerald-50 tracking-tight leading-tight">Help Center <span className="text-secondary dark:text-amber-500">| मदत केंद्र</span></h2>
            <p className="text-on-surface-variant dark:text-slate-400 max-w-2xl font-medium leading-relaxed mt-2">
              Welcome to the Kisan Kamai Owner Support portal. We&apos;re here to ensure your equipment rental business runs smoothly.
              <br />
              <span className="text-primary dark:text-emerald-400 italic mt-1 block">किसान कमाई मालक मदत पोर्टलवर आपले स्वागत आहे. आम्ही तुमच्या व्यवसायाला पाठबळ देण्यासाठी सदैव तत्पर आहोत.</span>
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <input className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 dark:text-white" placeholder="Search for help... | मदत शोधा..." type="text" />
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
            <h3 className="font-headline font-bold text-lg mb-1 dark:text-emerald-50">Listings | सूचीकरण</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">How to list equipment, upload photos, and set prices.</p>
          </div>
          {/* Bookings Help */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all hover:border-orange-200 dark:hover:border-amber-700 group cursor-pointer">
            <div className="w-12 h-12 bg-orange-50 dark:bg-amber-900/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500 dark:group-hover:bg-amber-600 group-hover:text-white transition-colors text-orange-700 dark:text-amber-500">
              <span className="material-symbols-outlined text-3xl">event_available</span>
            </div>
            <h3 className="font-headline font-bold text-lg mb-1 dark:text-emerald-50">Bookings | बुकिंग</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Managing requests, confirmations, and scheduling.</p>
          </div>
          {/* Payments Help */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all hover:border-emerald-200 dark:hover:border-emerald-700 group cursor-pointer">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors text-emerald-700 dark:text-emerald-400">
              <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            </div>
            <h3 className="font-headline font-bold text-lg mb-1 dark:text-emerald-50">Payments | देयके</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Payout cycles, bank details, and commission rates.</p>
          </div>
          {/* Technical Help */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all hover:border-slate-300 dark:hover:border-slate-600 group cursor-pointer">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-500 group-hover:text-white transition-colors text-slate-700 dark:text-slate-400">
              <span className="material-symbols-outlined text-3xl">phonelink_setup</span>
            </div>
            <h3 className="font-headline font-bold text-lg mb-1 dark:text-emerald-50">Technical | तांत्रिक</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">App usage, account settings, and notification issues.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Support Form Column */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="material-symbols-outlined text-9xl">support_agent</span>
              </div>
              <h3 className="text-2xl font-black text-primary dark:text-emerald-50 mb-2 relative z-10">Submit a Request | तक्रार दाखल करा</h3>
              <p className="text-on-surface-variant dark:text-slate-400 mb-8 font-medium relative z-10">Describe your issue and we&apos;ll get back to you within 24 hours.</p>

              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                {error ? <FormNotice tone="error">{error}</FormNotice> : null}
                {success ? <FormNotice tone="success">{success}</FormNotice> : null}
                <FormSection title="Submit a Request | तक्रार दाखल करा" description="Describe the issue and we will get back to you within 24 hours.">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField label="Full Name | पूर्ण नाव">
                      <input className="kk-input" name="fullName" placeholder="Enter name" type="text" />
                    </FormField>
                    <FormField label="Phone Number | फोन नंबर">
                      <input className="kk-input" name="phone" placeholder="+91" type="tel" />
                    </FormField>
                  </div>
                  <div className="mt-6 space-y-6">
                    <FormField label="Category | प्रकार">
                      <select className="kk-input" name="category">
                        <option className="dark:bg-slate-800">Select issue type</option>
                        <option className="dark:bg-slate-800">Payment Issue</option>
                        <option className="dark:bg-slate-800">Equipment Damage</option>
                        <option className="dark:bg-slate-800">App Error</option>
                        <option className="dark:bg-slate-800">Profile Update</option>
                      </select>
                    </FormField>
                    <FormField label="Message | संदेश">
                      <textarea className="kk-input resize-y" name="message" placeholder="Describe your issue in detail..." rows={4}></textarea>
                    </FormField>
                    <Button className="mt-2 w-full md:w-auto" disabled={isSubmitting} type="submit">
                      {isSubmitting ? "Sending..." : "Send Ticket | तिकीट पाठवा"}
                      <span className="material-symbols-outlined">send</span>
                    </Button>
                  </div>
                </FormSection>
              </form>
            </div>

            {/* Recent Help Requests */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-primary dark:text-emerald-50 px-2">Your Recent Tickets | अलीकडील विनंत्या</h3>
              <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/50 shadow-sm">
                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-primary dark:text-emerald-50">Payment for Booking #2441</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Resolved 2 days ago</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg whitespace-nowrap">RESOLVED</span>
                </div>
                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">schedule</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-primary dark:text-emerald-50">Listing Photo Approval</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Updated 4 hours ago</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 rounded-lg whitespace-nowrap">IN PROGRESS</span>
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
                <h4 className="text-xl font-black mb-2">We&apos;ve got your back.</h4>
                <p className="text-on-primary-container dark:text-emerald-100/80 text-sm leading-relaxed mb-4">
                  Kisan Kamai ensures every owner is protected. From verification to safe payments, we build the trust so you can focus on farming.
                </p>
                <div className="flex items-center gap-2 text-on-tertiary-container dark:text-emerald-300 font-bold text-xs uppercase tracking-widest mt-6">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  Trusted by 10,000+ Owners
                </div>
              </div>
            </div>

            {/* Direct Contact Options */}
            <div className="space-y-4">
              <h4 className="font-headline font-bold text-lg px-2 dark:text-emerald-50">Contact Us Directly | थेट संपर्क</h4>
              <a className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-600 transition-all group" href="https://wa.me/#">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors text-emerald-600 dark:text-emerald-400 shrink-0">
                  <span className="material-symbols-outlined text-[24px]">chat</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">WhatsApp</p>
                  <p className="font-bold text-primary dark:text-emerald-50 text-sm">+91 98765 43210</p>
                </div>
              </a>
              <a className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-orange-500 transition-all group" href="tel:+">
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors text-orange-600 dark:text-orange-500 shrink-0">
                  <span className="material-symbols-outlined text-[24px]">call</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Call Support</p>
                  <p className="font-bold text-primary dark:text-emerald-50 text-sm">1800-Kisan-Kamai</p>
                </div>
              </a>
              <a className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-slate-600 transition-all group" href="mailto:support@kisankamai.in">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-800 dark:group-hover:bg-slate-700 group-hover:text-white transition-colors text-slate-600 dark:text-slate-400 shrink-0">
                  <span className="material-symbols-outlined text-[24px]">mail</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Email</p>
                  <p className="font-bold text-primary dark:text-emerald-50 text-sm">support@kisankamai.in</p>
                </div>
              </a>
            </div>

            {/* FAQ Sidebar Link */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Quick answers for everyone</p>
              <Link href="/faq">
                <button className="w-full py-3 border-2 border-emerald-900 dark:border-emerald-700 text-emerald-900 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-900 hover:text-white dark:hover:bg-emerald-800 transition-all">
                  Browse Help Library
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


