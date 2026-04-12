"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function FeedbackSuccessPage() {
  const { langText } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950 text-on-surface">
      <Header />
      <main className="flex-1 flex flex-col justify-center items-center py-12 px-4 @container bg-surface-container-low">
      <div className="max-w-[800px] w-full bg-surface rounded-2xl shadow-sm border border-outline-variant overflow-hidden flex flex-col">
        {/* Banner Image */}
        <div 
          className="w-full h-48 md:h-64 bg-center bg-no-repeat bg-cover flex-shrink-0"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA3pHhoYrxIxILklm6Aunfz7b4ceUsuyLodvQFZFsG2OeEN8kcUOXzdMKM56MamQn93-ZSMqz8WRr8tYCAmN-5plszKumXXugzKKs1xheLNU8majmm9AhCF7OfaVDqJ122GEzMqM9IEtQe_K34ZimNv3-YGDkFjd_QnocBmeZj_J3NfHPUTas0QgC1ILPZupjglWeGsus2Y2Zb8WKM7ilVESZrZ4CmX91vwc-F5Kby8xkU016gpnw_C5VpUKFffAfI4YsJXoEbft22R')" }}
        />
        
        {/* Content */}
        <div className="flex flex-col items-center px-6 py-10 md:px-12 text-center">
          {/* Success Icon */}
          <div className="h-16 w-16 bg-primary-container rounded-full flex items-center justify-center mb-6 shadow-sm">
            <span className="material-symbols-outlined text-4xl text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>

          <h1 className="text-on-surface font-headline text-3xl md:text-4xl font-bold leading-tight mb-4">
            {langText("Thank You for Your Feedback", "तुमच्या अभिप्रायासाठी धन्यवाद")}
          </h1>
          
          <p className="text-on-surface-variant text-base md:text-lg font-normal leading-relaxed max-w-2xl mb-10">
            {langText(
              "We've received your feedback. Our team reviews every suggestion to build a better Kisan Kamai for you.",
              "आम्हाला तुमचा अभिप्राय मिळाला आहे. तुमच्यासाठी उत्तम किसान कमाई तयार करण्यासाठी आमची टीम प्रत्येक सूचनेचे पुनरावलोकन करते."
            )}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row w-full max-w-[600px] gap-4 justify-center items-center">
            <Link 
              href="/"
              className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary-container text-on-primary-container hover:bg-primary transition-colors text-base font-label font-semibold w-full sm:w-auto shadow-sm"
            >
              <span className="truncate">{langText("Back to Home", "मुख्यपृष्ठावर जा")}</span>
            </Link>
            
            <Link 
              href="/rent-equipment"
              className="flex items-center justify-center rounded-lg h-12 px-6 bg-surface-container-high text-on-surface hover:bg-surface-dim transition-colors text-base font-label font-semibold w-full sm:w-auto"
            >
              <span className="truncate">{langText("Browse Equipment", "अवजारे शोधा")}</span>
            </Link>
            
            <Link 
              href="/support"
              className="flex items-center justify-center rounded-lg h-12 px-6 bg-transparent border border-outline text-on-surface hover:bg-surface-container transition-colors text-base font-label font-semibold w-full sm:w-auto"
            >
              <span className="truncate">{langText("Contact Support", "सपोर्ट संपर्क")}</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
  );
}
