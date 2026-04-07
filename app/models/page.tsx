"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const modelData: Record<string, { en: string, mr: string, items: { name: string, hp: string, img: string }[] }> = {
  tractors: {
    en: "Tractors", mr: "ट्रॅक्टर्स",
    items: [
      { name: "Mahindra Novo 575 DI", hp: "45 HP", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPWvvZ2_8Ow_lDSICAFb-m0-q7-C6hfmNe0OFRKjjnZNC7RB2l4iZHqAqaLuXM_DGnjdYjX2rQq0kWL-Cerb7tsdEjd2OnRXwWyat8dGsCfcn--c9uoHlW09eECIqulVEJsPO7_m7XtJhc_vfnx9VAJZoDcEh-0Dvx2FHxDvJXSCDvBXMj75C3LlLQ4tdV5Uy_tMVbNkUqay_NOBamyMUTFvr4fLw_zFV77s74J06hs8wqCh4ZuA2RLdMKEQeEKtj4umKvgQhhUaZw" },
      { name: "Swaraj 744 FE", hp: "48 HP", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeYZkgPtT1CB2DRr74jXatRMZxsAdZPeHXb9EZLzta1OkRzg-51UM6cU9fwtEyq1Fxe0DNDNzxhmQpzS3XT78_inszbrqKHipCjgAtAnmQHJ2DF47aaWisB0j9cg9qookoOgvlXfRMwDoATcDX2mCgHeM9s4vkJZxH3lEP2bHUGRRcl3icIHYwaaW_JRHf9_ftAKddSlqzk-_RR_vgYXT_cdFYfpbZ-_bhdehYLIjyfwKUAnU5dqvcN1Lnuv1GZqT0MDreKEDaNYQv" },
      { name: "John Deere 5310", hp: "55 HP", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrJd8wXQ7v_L4qWf1xN6Rk_8e6p_zL9f_V50Yf2gO-o4fU5zG1cR4D0Y7D1mQ3Y5o9qXm3nLQv02X4Wn9gT1rN5cR5qWf0tD5l1P8Vn1s9WkW8l-Y_pL-078R8q054T_xG_sE6V21yO_5yD3xRZWp_9DqB5YQ6h4Z5m4D9_kL_w51sVn1L5Z3P_mZ0" }
    ]
  },
  harvesters: {
    en: "Harvesters", mr: "हार्वेस्टर्स",
    items: [
      { name: "John Deere W70 Combine", hp: "100 HP", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ7oUvUALj7SDziTR9cKw09jxax1tKS_b7sXUeHrrZUckyODiJNtoKOiZkGkteJORMFJDU6c0Y8ql6Ly2g-JfnrT1gOqzyUBhs9_jfA36Hd62B-1vEbibVr3a12XNRY7r1Uhx0jQynG8Q_ew6UPFUJxi358BbidrUEfTBHZUT2Isoce5MfM8Tski9j12lk5DORg23MdNwo6zwFGAETPGdT72HNrlEsiRRWKDsBmV54gWFxdHnYsyyqPXD2-ZVVwzbfKFlxiRjWwMnM" },
      { name: "Preet 987", hp: "76 HP", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_v8o7J7s8J8K8Wp8j2Qp8c8qZ5u6K_m3R3l8o9P_Q90V2jZ_8m5m_K_T_Y7N_c8h2H_u6b9Y_4w9q_Q_j3v3J2z6t5R3N_V_6X6r8r7K9qR8Y8c1K4h7T9D9w8k9f2q2H_mR2c4L9v_j7w2w7X9t3P9X9p8w_k9Q_t8L_p6V_h9n2T_" }
    ]
  },
  ploughs: {
    en: "Ploughs", mr: "नांगर",
    items: [
      { name: "Lemken Reversible", hp: "Suitable for 45+ HP", img: "https://images.unsplash.com/photo-1589922589088-34eb1bb9b2b3?auto=format&fit=crop&q=80" }
    ]
  },
  sprayers: {
    en: "Sprayers", mr: "फवारणी यंत्रे",
    items: [
      { name: "ASPEE Boom Sprayer", hp: "Tractor Mounted", img: "https://images.unsplash.com/photo-1530836369250-ef71a3f5e481?auto=format&fit=crop&q=80" }
    ]
  },
  implements: {
    en: "Implements", mr: "उपकरणे",
    items: [
        { name: "Shaktiman Rotavator", hp: "6 ft width", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_f2OYvabqpLh_n0dq9_3mv54MBqVantkDYpjoJMb6HdjTMv-oLLJCORZ925eiNFubIR4E_8S6HIAtQrT0qDVr3B7_jbq799cBMsVuQzjZokvhcV1dy__bbAjsP6Tnfw7FDqS9MNcUGJ-spP2OwKzBafBMgzDgCj5UbgiOvezlHbEIpbcE3yCh0xIZSl1viwRkWL2ZIv6g1-m05KRcgQQV6yYf8_cpNDJneomhV5-QsOElD-fUOua-TK1csQa4fufEmguRnY5zVzQb" }
    ]
  }
};

function ModelsInner() {
  const { langText } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const categoryParam = searchParams.get("category") || "tractors";
  const category = modelData[categoryParam] ? modelData[categoryParam] : modelData.tractors;

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#0f1a14]">
      <Header />
      <main className="flex-grow py-16 bg-surface-container-lowest dark:bg-[#0f1a14]">
        <div className="max-w-7xl mx-auto px-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-secondary font-bold mb-8 hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            {langText("Back to Categories", "श्रेणींवर परत जा")}
          </button>
          
          <div className="mb-12">
            <h1 className="text-4xl font-black text-primary dark:text-emerald-50 mb-2">
              {langText(`${category.en} Models`, `${category.mr} मॉडेल्स`)}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {langText(`Select a model to view available listings and start renting.`, `उपलब्ध सूची पाहण्यासाठी आणि भाड्याने देण्यासाठी मॉडेल निवडा.`)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.items.map((item) => (
              <div key={item.name} className="bg-white dark:bg-emerald-900/20 rounded-2xl overflow-hidden shadow-lg border border-outline-variant/20 dark:border-emerald-800/50 hover:shadow-xl transition-all">
                <div className="h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary dark:text-emerald-50">{item.name}</h3>
                  <div className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 mb-4">
                    {item.hp}
                  </div>
                  <Link href={`/rent-equipment?query=${encodeURIComponent(item.name)}`} className="block w-full text-center bg-secondary text-white py-3 rounded-lg font-bold hover:bg-secondary/90 transition-colors">
                    {langText("View Listings", "सूची पहा")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Models() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ModelsInner />
    </Suspense>
  );
}
