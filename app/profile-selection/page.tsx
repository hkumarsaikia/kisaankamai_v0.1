"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/components/LanguageContext";
import { assetPath } from "@/lib/site";
import { localizedText } from "@/lib/i18n";

const profileCards = [
  {
    href: "/owner-profile",
    icon: "agriculture",
    accent: "text-primary-container dark:text-emerald-400",
    surface: "bg-primary-container/10 dark:bg-emerald-500/10",
    button: "bg-primary-container text-white dark:bg-emerald-700",
    title: localizedText("Owner Profile / मालक प्रोफाइल", "मालक प्रोफाइल / Owner Profile"),
    description: localizedText(
      "Set up listings, manage bookings, track earnings, and run your owner workspace.",
      "लिस्टिंग तयार करा, बुकिंग व्यवस्थापित करा, कमाई ट्रॅक करा आणि तुमचे मालक वर्कस्पेस चालवा."
    ),
    cta: localizedText(
      "Go to Owner Profile / मालक प्रोफाइलवर जा",
      "मालक प्रोफाइलवर जा / Go to Owner Profile"
    ),
  },
  {
    href: "/renter-profile",
    icon: "handshake",
    accent: "text-secondary dark:text-amber-500",
    surface: "bg-secondary/10 dark:bg-amber-500/10",
    button: "bg-secondary text-white dark:bg-amber-500",
    title: localizedText("Renter Profile / भाडेकरी प्रोफाइल", "भाडेकरी प्रोफाइल / Renter Profile"),
    description: localizedText(
      "Track rentals, browse equipment, view bookings, and get support.",
      "भाड्याने घेतलेली अवजारे, बुकिंग ट्रॅक करा आणि सपोर्ट मिळवा."
    ),
    cta: localizedText(
      "Go to Renter Profile / भाडेकरी प्रोफाइलवर जा",
      "भाडेकरी प्रोफाइलवर जा / Go to Renter Profile"
    ),
  },
];

export default function ProfileSelectionPage() {
  const { langText } = useLanguage();

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-surface text-on-surface">
      <div className="fixed inset-0 z-0">
        <img className="h-full w-full object-cover opacity-10 dark:opacity-20" src={assetPath("/assets/generated/modern_farm_tech.png")} alt="Maharashtra farm fields" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/80 to-surface dark:from-slate-950/60 dark:via-slate-950/85 dark:to-slate-950" />
      </div>

      <header className="fixed top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 shadow-sm backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/80">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-12">
          <Link href="/" className="text-xl font-black tracking-tighter text-primary dark:text-emerald-400">
            Kisan Kamai
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageToggle compact />
            <Link href="/" className="hidden text-sm font-semibold tracking-tight text-slate-600 transition-colors hover:text-secondary dark:text-slate-400 dark:hover:text-amber-500 sm:inline">
              {langText("Sign Out", "साइन आउट")}
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 container mx-auto flex-grow px-6 pb-20 pt-32 lg:px-12">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-primary dark:text-emerald-400 md:text-5xl">
            {langText("Choose your profile / तुमची प्रोफाइल निवडा", "तुमची प्रोफाइल निवडा / Choose your profile")}
          </h1>
          <p className="text-lg font-medium text-on-surface-variant">
            {langText(
              "Select the workspace you want to enter for this session.",
              "या सत्रासाठी तुम्हाला प्रवेश करायचा असलेला वर्कस्पेस निवडा."
            )}
          </p>
        </div>

        <div className="mx-auto mb-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {profileCards.map((card) => (
            <div
              key={card.href}
              className="group relative rounded-3xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-xl shadow-surface-container-high/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary-container/40 dark:bg-slate-900/40 dark:shadow-black/20"
            >
              <div className="flex h-full flex-col">
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${card.surface}`}>
                  <span className={`material-symbols-outlined text-4xl ${card.accent}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {card.icon}
                  </span>
                </div>
                <div className="mb-8">
                  <h2 className={`mb-3 text-2xl font-bold font-headline ${card.accent}`}>{langText(card.title)}</h2>
                  <p className="leading-relaxed text-on-surface-variant">{langText(card.description)}</p>
                </div>
                <Link
                  href={card.href}
                  className={`mt-auto flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold tracking-tight transition-all group-hover:shadow-lg ${card.button}`}
                >
                  {langText(card.cta)}
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-4xl space-y-10">
          <div className="mx-auto flex w-fit items-center justify-center gap-3 rounded-full border border-outline-variant/20 bg-surface-container/50 px-6 py-3 text-sm font-medium text-on-surface-variant/80">
            <span className="material-symbols-outlined text-lg">info</span>
            <p>
              {langText(
                "Your access may depend on the role selected during registration.",
                "तुमचा प्रवेश नोंदणीदरम्यान निवडलेल्या भूमिकेवर अवलंबून असू शकतो."
              )}
            </p>
          </div>

          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-primary-container p-6 text-on-primary shadow-lg md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                <span className="material-symbols-outlined text-white">support_agent</span>
              </div>
              <div>
                <p className="text-lg font-bold leading-tight">
                  {langText("Need help choosing the right profile?", "योग्य प्रोफाइल निवडण्यात मदत हवी आहे?")}
                </p>
                <p className="text-sm text-on-primary-container">
                  {langText("Contact support in Marathi or English.", "मराठी किंवा इंग्रजीमध्ये सपोर्टशी संपर्क साधा.")}
                </p>
              </div>
            </div>
            <Link href="/support" className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary-container transition-colors hover:bg-surface-bright">
              {langText("Contact Support", "सपोर्टशी संपर्क साधा")}
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full border-t border-slate-200 bg-[#23272D] px-6 py-8 dark:border-slate-800 dark:bg-black lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-xs font-normal uppercase tracking-widest text-slate-500">
            {langText("© 2026 Kisan Kamai. Sustainable Agriculture for India.", "© 2026 किसान कमाई. भारतीय शेतीसाठी शाश्वत उपाय.")}
          </div>
          <div className="flex gap-8">
            <Link href="/legal" className="text-xs font-normal uppercase tracking-widest text-slate-500 transition-colors hover:text-white">
              {langText("Privacy Policy", "गोपनीयता धोरण")}
            </Link>
            <Link href="/legal" className="text-xs font-normal uppercase tracking-widest text-slate-500 transition-colors hover:text-white">
              {langText("Terms of Service", "सेवा अटी")}
            </Link>
            <Link href="/support" className="text-xs font-normal uppercase tracking-widest text-slate-500 transition-colors hover:text-white">
              {langText("Contact Support", "सपोर्ट")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
