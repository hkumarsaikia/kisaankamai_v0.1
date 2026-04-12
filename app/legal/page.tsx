"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

export default function LegalCenter() {
  const { langText } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950">
      <Header />
      <main className="flex-grow pt-28 pb-12 px-6 max-w-7xl mx-auto">

<div className="flex flex-col lg:flex-row gap-12">
{/*  Side Navigation / Tabs  */}
<aside className="lg:w-1/4 space-y-4">
<div className="sticky top-28 space-y-2">
<h4 className="px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">{langText("Documents", "दस्तऐवज")}</h4>
<button className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 bg-primary-container text-on-primary">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined">policy</span>
<span className="font-semibold">{langText("Privacy Policy", "गोपनीयता धोरण")}</span>
</div>
<span className="material-symbols-outlined text-sm">chevron_right</span>
</button>
<button className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:bg-surface-container-high text-on-surface">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined">gavel</span>
<span className="font-semibold">Terms of Service</span>
</div>
<span className="material-symbols-outlined text-sm">chevron_right</span>
</button>
<button className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:bg-surface-container-high text-on-surface">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined">event_busy</span>
<span className="font-semibold">Cancellation Policy</span>
</div>
<span className="material-symbols-outlined text-sm">chevron_right</span>
</button>
<button className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:bg-surface-container-high text-on-surface">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined">payments</span>
<span className="font-semibold">Refund Policy</span>
</div>
<span className="material-symbols-outlined text-sm">chevron_right</span>
</button>
<div className="mt-8 p-6 rounded-2xl bg-secondary-container/10 border border-secondary-container/20">
<span className="material-symbols-outlined text-secondary text-3xl mb-3">help_center</span>
<h5 className="font-bold text-on-surface mb-2">Need clarification?</h5>
<p className="text-sm text-on-surface-variant mb-4">Our support team is available to help you understand our policies.</p>
<a className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:underline" href="#">
                            Contact Support
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
</a>
</div>
</div>
</aside>
{/*  Main Content Area  */}
<div className="lg:w-3/4">
<div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-surface-container">
{/*  Language Toggle within content  */}
<div className="flex justify-end mb-8">
<div className="inline-flex p-1 bg-surface-container rounded-lg">
<button className="px-4 py-1.5 rounded-md text-sm font-semibold bg-white shadow-sm text-primary">English</button>
<button className="px-4 py-1.5 rounded-md text-sm font-semibold text-on-surface-variant hover:text-on-surface">मराठी</button>
</div>
</div>
{/*  Policy Content  */}
<div className="legal-content">
<h2 className="!mt-0">1. Introduction / प्रस्तावना</h2>
<p>Welcome to Kisan Kamai. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
<p className="font-medium text-primary italic">Kisan Kamai मध्ये आपले स्वागत आहे. आम्ही तुमच्या गोपनीयतेचा आदर करतो आणि तुमच्या वैयक्तिक डेटाचे संरक्षण करण्यासाठी वचनबद्ध आहोत.</p>
<h2>2. Data Collection / डेटा संकलन</h2>
<p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
<ul>
<li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
<li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
<li><strong>Financial Data:</strong> includes bank account and payment card details.</li>
<li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased or listed from us.</li>
</ul>
<h2>3. How We Use Your Data / आम्ही तुमचा डेटा कसा वापरतो</h2>
<p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
<div className="grid md:grid-cols-2 gap-4 my-6">
<div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30">
<h4 className="font-bold text-primary mb-2 flex items-center gap-2">
<span className="material-symbols-outlined text-lg">contract</span>
                                    Contract Fulfillment
                                </h4>
<p className="text-sm !mb-0">To facilitate the rental agreement between equipment owners and renters.</p>
</div>
<div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30">
<h4 className="font-bold text-primary mb-2 flex items-center gap-2">
<span className="material-symbols-outlined text-lg">security</span>
                                    Security &amp; Safety
                                </h4>
<p className="text-sm !mb-0">To verify identities and maintain the integrity of our agricultural marketplace.</p>
</div>
</div>
<h2>4. Data Sharing / डेटा शेअरिंग</h2>
<p>We may share your personal data with the parties set out below for the purposes set out in this policy:</p>
<ul>
<li>Equipment Owners: When you book equipment, your contact details are shared with the owner.</li>
<li>Payment Processors: To handle secure financial transactions.</li>
<li>Logistics Partners: To coordinate equipment transport where applicable.</li>
</ul>
<div className="mt-12 p-8 rounded-3xl bg-primary text-white relative overflow-hidden">
<div className="relative z-10">
<h3 className="!mt-0 text-white">Commitment to Indian Farmers</h3>
<p className="text-emerald-100 !mb-0">We understand the importance of trust in rural communities. Your data is never sold to third-party marketing agencies. Our platform is built to empower Indian agriculture, not exploit it.</p>
</div>
<div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 bg-emerald-800/30 rounded-full blur-3xl"></div>
</div>
<h2>5. Terms of Service Snapshot / सेवा अटींचा आढावा</h2>
<p>By using Kisan Kamai, you agree to follow our operational guidelines, including timely payments, responsible equipment usage, and honest listings.</p>
<h3>Cancellation Policy / रद्द करण्याचे धोरण</h3>
<ul className="list-none !pl-0 space-y-4">
<li className="flex items-start gap-4">
<div className="w-8 h-8 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-700 font-bold text-xs">01</div>
<div>
<p className="font-bold text-on-surface !mb-1">24-Hour Free Cancellation</p>
<p className="text-sm !mb-0">Bookings cancelled within 24 hours of booking (and at least 48 hours before the start date) receive a full refund.</p>
</div>
</li>
<li className="flex items-start gap-4">
<div className="w-8 h-8 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-700 font-bold text-xs">02</div>
<div>
<p className="font-bold text-on-surface !mb-1">Late Cancellations</p>
<p className="text-sm !mb-0">Cancellations made less than 48 hours before the start date may incur a 15% service fee.</p>
</div>
</li>
</ul>
</div>
<div className="mt-12 pt-8 border-t border-surface-container flex flex-col md:flex-row items-center justify-between gap-6">
<div className="text-on-surface-variant text-sm">
                            Need a PDF copy for your records?
                        </div>
<div className="flex gap-4">
<button className="flex items-center gap-2 px-4 py-2 border border-outline rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined text-lg">download</span>
                                Download English (PDF)
                            </button>
<button className="flex items-center gap-2 px-4 py-2 border border-outline rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined text-lg">download</span>
                                Download Marathi (PDF)
                            </button>
</div>
</div>
</div>
{/*  Related Links Bento Section  */}
<div className="grid md:grid-cols-2 gap-6 mt-12">
<div className="group p-6 bg-white rounded-2xl border border-surface-container hover:shadow-lg transition-all cursor-pointer">
<div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined">help</span>
</div>
<h4 className="font-bold text-on-surface mb-2">FAQs</h4>
<p className="text-sm text-on-surface-variant">Frequently asked questions about our terms and usage.</p>
</div>
<div className="group p-6 bg-white rounded-2xl border border-surface-container hover:shadow-lg transition-all cursor-pointer">
<div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined">contact_support</span>
</div>
<h4 className="font-bold text-on-surface mb-2">Legal Contact</h4>
<p className="text-sm text-on-surface-variant">Reach out directly to our legal compliance team for inquiries.</p>
</div>
</div>
</div>
</div>
      </main>
      <Footer />
    </div>
  );
}
