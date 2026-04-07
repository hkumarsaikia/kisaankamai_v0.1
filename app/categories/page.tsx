"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import Link from "next/link";

export default function Categories() {
  const { langText } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#0f1a14]">
      <Header />
      <main className="flex-grow py-24 bg-surface-container-lowest dark:bg-[#0f1a14]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl font-black text-primary dark:text-emerald-50 mb-4 tracking-tight">{langText("All Equipment Categories", "सर्व उपकरण श्रेणी")}</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl text-lg">{langText("Browse our extensive range of agricultural equipment to find exactly what you need.", "आपल्याला नेमके काय हवे आहे हे शोधण्यासाठी आमच्या कृषी उपकरणांची विस्तृत श्रेणी ब्राउझ करा.")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: "tractors", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeYZkgPtT1CB2DRr74jXatRMZxsAdZPeHXb9EZLzta1OkRzg-51UM6cU9fwtEyq1Fxe0DNDNzxhmQpzS3XT78_inszbrqKHipCjgAtAnmQHJ2DF47aaWisB0j9cg9qookoOgvlXfRMwDoATcDX2mCgHeM9s4vkJZxH3lEP2bHUGRRcl3icIHYwaaW_JRHf9_ftAKddSlqzk-_RR_vgYXT_cdFYfpbZ-_bhdehYLIjyfwKUAnU5dqvcN1Lnuv1GZqT0MDreKEDaNYQv", name: "Tractors", mrName: "ट्रॅक्टर्स" },
              { id: "harvesters", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVmvbUiNz9Y79Yb45dHYtKeuMnBHJbbyltug7gB6AP4g77aPrvgd53M28uBrNqj3aMOSDVc7AArhGhEm1WgvEpfJrsJ52N7og-SIjmTqQvosoc6HHWBhO93tJO1TcYGg4AMunwMP4L3lNVCCxKnq9bIA44W5v82XwooWnyNy-iwGUQmTRSijWuY30IxW2ltnvhzFiDW7WREeNHUb4QETd4Z_u4t64CSreHmIK0tCFKrjDxjNyFRghffOI61VCF-YOAGZQfFfZfKpqi", name: "Harvesters", mrName: "हार्वेस्टर्स" },
              { id: "implements", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxAyAip2db-I7yhNxtnmMQiY4x8GjoDKqNbDpry_5Otkuux9iqpLbBaKpwcvVpPlI57lOgEwpHLrmy7C9lb6YuMJAPRO9Vrrdz4uNltn7v2BQvff5nFy7RxCRDIz6cVDrZWoR_aRGlz4n5Jkzx9CkpwPJFQlZ51TmGOnlZcMDz-uoeDVYHGFKL1iO4Jaq-_0Zs9hAUu57ILEypAsIwlzR4OQFotLlKfbtGuowQ3wQLUMV5f3dJDhvQ5-lFlBa-BA5hbDOPb4hkVs7K", name: "Implements", mrName: "उपकरणे" },
              { id: "ploughs", img: "https://images.unsplash.com/photo-1589922589088-34eb1bb9b2b3?auto=format&fit=crop&q=80", name: "Ploughs", mrName: "नांगर" },
              { id: "sprayers", img: "https://images.unsplash.com/photo-1530836369250-ef71a3f5e481?auto=format&fit=crop&q=80", name: "Sprayers", mrName: "फवारणी यंत्रे" },
              { id: "rotavators", img: "https://images.unsplash.com/photo-1615671524827-0cf04cb35be4?auto=format&fit=crop&q=80", name: "Rotavators", mrName: "रोटाव्हेटर्स" },
              { id: "seeders", img: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80", name: "Seeders", mrName: "सीडर्स" },
            ].map(cat => (
              <Link key={cat.id} href={`/models?category=${cat.id}`} className="group relative h-[400px] overflow-hidden rounded-3xl shadow-xl cursor-pointer block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat.name} src={cat.img} />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-3xl font-black text-white mb-2 tracking-wide">{langText(cat.name, cat.mrName)}</h3>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {langText("Browse Models", "मॉडेल्स पहा")} <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
