"use client";

import { ContentImage } from "@/components/ContentImage";
import { LazyMap } from "@/components/LazyMap";
import { useLanguage } from "@/components/LanguageContext";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AppLink as Link } from "@/components/AppLink";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useSmoothRouter } from "@/lib/client/useSmoothRouter";
import { HOMEPAGE_MARKERS } from "@/lib/map-data";
import { NORTHERN_MAHARASHTRA_SERVICE_AREAS } from "@/lib/service-areas.js";
import { assetPath } from "@/lib/site";
import { SharedIcon } from "@/components/SharedIcon";
import { resolvePortalHref } from "@/lib/workspace-routing.js";

const heroSlides = [
  {
    src: assetPath("/assets/generated/hero_tractor.png"),
    altEn: "Tractor ready for field work at sunrise",
    altMr: "सकाळच्या प्रकाशात शेतातील कामासाठी तयार ट्रॅक्टर",
  },
  {
    src: assetPath("/assets/generated/harvester_action.png"),
    altEn: "Harvester working through a crop field",
    altMr: "पिकाच्या शेतात काम करणारा हार्वेस्टर",
  },
  {
    src: assetPath("/assets/generated/seed_drill.png"),
    altEn: "Seed drill equipment prepared for the next sowing cycle",
    altMr: "पेरणीसाठी तयार ठेवलेले सीड ड्रिल उपकरण",
  },
  {
    src: assetPath("/assets/generated/farmer_handshake.png"),
    altEn: "Farmer and equipment owner agreeing on a rental",
    altMr: "शेतकरी आणि उपकरण मालक भाडे करार निश्चित करताना",
  },
  {
    src: assetPath("/assets/generated/modern_farm_tech.png"),
    altEn: "Modern farm machinery staged in a working field",
    altMr: "कामाच्या शेतात उभी आधुनिक कृषी यंत्रसामग्री",
  },
  {
    src: assetPath("/assets/generated/farm_yard.png"),
    altEn: "Farm equipment yard at dusk",
    altMr: "संध्याकाळी शेतातील यंत्रसामग्रीचे अंगण",
  },
] as const;

const serviceAreaTranslations = {
  "Kalwan Area": { en: "Kalwan Area", mr: "कळवण परिसर" },
  "Mukhed Area": { en: "Mukhed Area", mr: "मुखेड परिसर" },
} as const;

const markerLabelTranslations = {
  "Kalwan Area Hub": { en: "Kalwan Area Hub", mr: "कळवण परिसर केंद्र" },
  "Mukhed Area Hub": { en: "Mukhed Area Hub", mr: "मुखेड परिसर केंद्र" },
} as const;

const markerSublabelTranslations = {
  "Active regional expansion hub": { en: "Active regional expansion hub", mr: "सक्रिय प्रादेशिक विस्तार केंद्र" },
  "Primary expansion headquarters for the region": {
    en: "Primary expansion headquarters for the region",
    mr: "प्रदेशासाठी मुख्य विस्तार केंद्र",
  },
} as const;

const testimonials = [
  {
    quoteEn:
      "\"Renting a harvester through Kisan Kamai saved me 4 days of labor costs during the last peak season. The process was seamless.\"",
    quoteMr:
      "\"Kisan Kamai मधून हार्वेस्टर घेतल्यामुळे मागच्या हंगामात माझे ४ दिवसांचे मजुरीचे खर्च वाचले. संपूर्ण प्रक्रिया अतिशय सोपी होती.\"",
    name: "Rajesh Deshmukh",
    areaEn: "Kalwan Area",
    areaMr: "कळवण परिसर",
  },
  {
    quoteEn:
      "\"As a tractor owner, I was worried about utilization. Kisan Kamai helped me find local farmers who needed my equipment exactly when it was idle.\"",
    quoteMr:
      "\"ट्रॅक्टर मालक म्हणून मला वापर कमी होण्याची चिंता होती. Kisan Kamai मुळे माझे उपकरण रिकामे असताना त्याची गरज असलेले स्थानिक शेतकरी मला मिळाले.\"",
    name: "Sanjay Kulkarni",
    areaEn: "Mukhed Area",
    areaMr: "मुखेड परिसर",
  },
  {
    quoteEn:
      "\"The verification process for equipment is what makes me trust this platform. I know I am getting high-quality machinery every time.\"",
    quoteMr:
      "\"उपकरण पडताळणीची प्रक्रिया हीच मला या प्लॅटफॉर्मवर विश्वास ठेवायला भाग पाडते. प्रत्येक वेळी मला दर्जेदार यंत्रसामग्री मिळेल याची खात्री असते.\"",
    name: "Vikas More",
    areaEn: "Kalwan Area",
    areaMr: "कळवण परिसर",
  },
] as const;

const faqs = [
  {
    questionEn: "How do I verify the condition of the equipment?",
    questionMr: "उपकरणाची स्थिती मी कशी पडताळू?",
    answerEn:
      "Every listed machine goes through an initial verification. Renters should still inspect the equipment at delivery before starting the rental period.",
    answerMr:
      "सूचीतील प्रत्येक मशीनची प्राथमिक पडताळणी केली जाते. तरीही भाडे सुरू करण्यापूर्वी उपकरण मिळाल्यावर स्वतः तपासणी करणे आवश्यक आहे.",
  },
  {
    questionEn: "What happens if the equipment breaks down during work?",
    questionMr: "कामाच्या वेळी उपकरण बिघडले तर काय होईल?",
    answerEn:
      "Owners are expected to respond to urgent breakdowns. Inform Kisan Kamai within 2 hours and we will coordinate the next available resolution.",
    answerMr:
      "तातडीच्या बिघाडासाठी मालकांनी प्रतिसाद देणे अपेक्षित आहे. २ तासांच्या आत Kisan Kamai ला कळवा, आम्ही पुढील उपलब्ध तोडगा समन्वयित करू.",
  },
  {
    questionEn: "Are there any hidden charges?",
    questionMr: "काही लपवलेले अतिरिक्त खर्च आहेत का?",
    answerEn:
      "No. The booking price shown to you is the expected payable amount, including equipment cost and any clearly stated operator charge.",
    answerMr:
      "नाही. तुम्हाला दिसणारी बुकिंग किंमत हीच अपेक्षित देय रक्कम असते, ज्यात उपकरणाचा खर्च आणि स्पष्टपणे नमूद केलेले ऑपरेटर शुल्क समाविष्ट असते.",
  },
  {
    questionEn: "How can I pay for my rental?",
    questionMr: "भाड्याचे पेमेंट मी कसे करू?",
    answerEn:
      "Confirm the final amount with the owner and settle directly offline. Kisan Kamai only records the booking request and owner-listed estimate.",
    answerMr:
      "अंतिम रक्कम मालकाशी निश्चित करा आणि ऑफलाइन थेट व्यवहार करा. Kisan Kamai फक्त बुकिंग विनंती आणि मालकाने दिलेला अंदाज नोंदवते.",
  },
] as const;

const homeRegisterSteps = [
  {
    icon: "search",
    number: "1",
    title: { en: "Search or List", mr: "शोधा किंवा सूचीबद्ध करा" },
  },
  {
    icon: "event_available",
    number: "2",
    title: { en: "Book and Manage", mr: "बुक करा आणि व्यवस्थापित करा" },
  },
  {
    icon: "agriculture",
    number: "3",
    title: { en: "Use and Earn", mr: "वापरा आणि कमवा" },
  },
  {
    icon: "verified_user",
    number: "4",
    title: { en: "Verified Support", mr: "पडताळलेला सपोर्ट" },
  },
] as const;

function HomeRegisterTile({ langText }: { langText: (enText: string, mrText?: string) => string }) {
  const { user, activeWorkspace } = useAuth();
  const registerHref = user
    ? resolvePortalHref(activeWorkspace === "owner" ? "owner" : "renter")
    : "/register";

  return (
    <aside
      className="kk-depth-tile relative w-full max-w-[390px] overflow-hidden rounded-[2rem] border border-white/80 bg-white p-6 text-primary shadow-[0_30px_80px_-35px_rgba(0,0,0,0.7)] dark:border-white/10 dark:bg-surface-container-lowest dark:text-emerald-50 lg:justify-self-end"
      aria-label={langText("Kisan Kamai registration tile", "किसान कमाई नोंदणी टाइल")}
    >
      <div className="relative z-10">
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/15 bg-primary/10 dark:border-white/15 dark:bg-white/10">
            <span className="material-symbols-outlined text-3xl text-primary dark:text-lime-300">agriculture</span>
          </div>
        </div>

        <div className="mb-7 text-center">
          <h2 className="text-3xl font-black leading-tight tracking-tight">
            {langText("Rent, List & Grow", "भाडे घ्या, सूचीबद्ध करा आणि वाढा")}
            <span className="mt-1 block text-xl font-semibold text-primary/80 dark:text-emerald-100">
              {langText("with Confidence", "विश्वासाने")}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-on-surface-variant dark:text-emerald-100/70">
            {langText(
              "Trusted farm equipment access across Northern Maharashtra.",
              "उत्तर महाराष्ट्रात विश्वासार्ह कृषी उपकरणांची उपलब्धता."
            )}
          </p>
        </div>

        <div className="mb-7 grid grid-cols-2 gap-x-5 gap-y-4">
          {homeRegisterSteps.map((step) => (
            <div key={step.number} className="flex items-start gap-3">
              <div className="relative shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 bg-primary/10 dark:border-white/15 dark:bg-white/10">
                  <span className="material-symbols-outlined text-xl text-primary dark:text-emerald-50">{step.icon}</span>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-black text-white dark:bg-secondary-container dark:text-secondary">
                  {step.number}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-black text-primary dark:text-emerald-50">{langText(step.title.en, step.title.mr)}</h3>
              </div>
            </div>
          ))}
        </div>

        <Link
          href={registerHref}
          className="kk-flow-button block w-full rounded-2xl bg-secondary px-6 py-4 text-center text-lg font-black text-white shadow-[0_16px_35px_-24px_rgba(0,0,0,0.7)] dark:bg-secondary-container dark:text-secondary"
        >
          <span className="relative z-10">{langText("Register Now", "आता नोंदणी करा")}</span>
        </Link>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-on-surface-variant dark:text-emerald-100/60">
          <span className="material-symbols-outlined text-xl text-primary dark:text-lime-300">verified</span>
          <span>{langText("Secure. Reliable. Built for Farmers.", "सुरक्षित. विश्वासार्ह. शेतकऱ्यांसाठी बनवलेले.")}</span>
        </div>
      </div>
    </aside>
  );
}

export default function Home() {
  const { t, langText } = useLanguage();
  const router = useSmoothRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const homepageMarkers = HOMEPAGE_MARKERS.map((marker) => ({
    ...marker,
    label: langText(
      markerLabelTranslations[marker.label as keyof typeof markerLabelTranslations]?.en || marker.label,
      markerLabelTranslations[marker.label as keyof typeof markerLabelTranslations]?.mr || marker.label
    ),
    sublabel: marker.sublabel
      ? langText(
          markerSublabelTranslations[marker.sublabel as keyof typeof markerSublabelTranslations]?.en || marker.sublabel,
          markerSublabelTranslations[marker.sublabel as keyof typeof markerSublabelTranslations]?.mr || marker.sublabel
        )
      : undefined,
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    router.push(`/rent-equipment?location=${encodeURIComponent(searchLocation)}&query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex flex-col text-on-surface">
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[870px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {heroSlides.map((slide, index) => (
              <ContentImage
                key={slide.src}
                className={`w-full h-full object-cover md:object-[center_15%] absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
                alt={langText(slide.altEn, slide.altMr)}
                src={slide.src}
                loading={index === 0 ? "eager" : "lazy"}
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
              />
            ))}
            <div className="kk-banner-image-overlay z-10" />

            {/* Slider Controls */}
            <button 
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              aria-label={langText("Show previous hero image", "मागील हिरो प्रतिमा दाखवा")}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-20"
            >
              <SharedIcon name="chevron-left" className="h-6 w-6" />
            </button>
            <button 
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
              aria-label={langText("Show next hero image", "पुढील हिरो प्रतिमा दाखवा")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-20"
            >
              <SharedIcon name="chevron-right" className="h-6 w-6" />
            </button>
          </div>
          <div className="relative z-10 mx-auto grid w-full max-w-[min(1480px,calc(100vw-48px))] items-center justify-between gap-12 px-0 py-28 md:py-20 lg:grid-cols-[minmax(560px,760px)_minmax(320px,390px)] xl:gap-28 2xl:gap-36">
            <div className="max-w-2xl text-white lg:justify-self-start">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6 mt-16 lg:mt-0">
                <span className="w-2 h-2 bg-secondary rounded-full transform dark:bg-amber-400"></span>
                <span className="text-sm font-label font-bold uppercase tracking-widest">
                  {langText("Now Serving Northern Maharashtra", "आता उत्तर महाराष्ट्रात सेवा उपलब्ध")}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                {t("home.modern_machinery_for_every_farm")}
              </h1>
              <p className="text-xl text-white/80 mb-10 max-w-lg leading-relaxed">
                {t("home.rent_high_quality_agricultural_equipment_from_trusted_local_owners_smarter_farming_powered_by_technology_rooted_in_trust")}
              </p>
              <div className="bg-surface-container-lowest p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl border border-outline-variant">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-outline-variant">
                  <SharedIcon name="location" className="h-5 w-5 text-secondary dark:text-emerald-400" />
                  <select 
                    className="w-full border-none focus:ring-0 text-on-surface bg-transparent cursor-pointer font-medium"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  >
                    <option className="bg-surface-container-lowest text-on-surface" value="" disabled>{t("home.select_location")}</option>
                    <option className="bg-surface-container-lowest text-on-surface" value="Kalwan">{t("home.kalwan")}</option>
                    <option className="bg-surface-container-lowest text-on-surface" value="Mukhed">{t("home.mukhed")}</option>
                    <option className="bg-surface-container-lowest text-on-surface" value="More locations coming soon..." disabled>{t("home.more_locations_coming_soon")}</option>
                  </select>
                </div>
                <div className="flex-1 flex items-center gap-3 px-4 py-3">
                  <SharedIcon name="agriculture" className="h-5 w-5 text-secondary dark:text-emerald-400" />
                  <input 
                    className="w-full border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant bg-transparent font-medium"
                    placeholder={t("home.search_tractors_harvesters")} 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button onClick={handleSearch} className="kk-deep-cta kk-flow-button px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2">
                  <SharedIcon name="search" className="h-5 w-5" />
                  {t("home.search_now")}
                </button>
              </div>
            </div>
            <HomeRegisterTile langText={langText} />
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-black text-primary dark:text-emerald-50 mb-4 tracking-tight">{t("home.explore_equipment_categories")}</h2>
                <p className="text-on-surface-variant max-w-xl">{t("home.from_land_preparation_to_harvesting_find_the_right_tool_for_every_stage_of_your_farming_cycle")}</p>
              </div>
              <Link className="text-secondary font-bold flex items-center gap-2 hover:gap-3 transition-all" href="/categories">
                {t("home.view_all_categories")} <SharedIcon name="arrow-right" className="h-5 w-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {/* Tractors */}
              <Link href="/rent-equipment?query=tractors" className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg cursor-pointer block">
                <ContentImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={langText("High-horsepower tractor parked in a vibrant green farm field", "हिरव्यागार शेतात उभा असलेला उच्च क्षमतेचा ट्रॅक्टर")} src={assetPath("/assets/generated/hero_tractor.png")} loading="lazy" decoding="async" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/35 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">{t("home.tractors")}</h3>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    {t("home.browse_models")} <SharedIcon name="chevron-right" className="h-4 w-4" />
                  </div>
                </div>
              </Link>
              {/* Harvesters */}
              <Link href="/rent-equipment?query=harvesters" className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg cursor-pointer block">
                <ContentImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={langText("Combine harvester working through a wheat field", "गव्हाच्या शेतात काम करणारा कॉम्बाईन हार्वेस्टर")} src={assetPath("/assets/generated/harvester_action.png")} loading="lazy" decoding="async" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/35 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">{t("home.harvesters")}</h3>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    {t("home.browse_models")} <SharedIcon name="chevron-right" className="h-4 w-4" />
                  </div>
                </div>
              </Link>
              {/* Implements */}
              <Link href="/rent-equipment?query=implements" className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg cursor-pointer block">
                <ContentImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={langText("Agricultural implements including a rotavator and seed drill", "रोटाव्हेटर आणि सीड ड्रिलसह कृषी अवजारे")} src={assetPath("/assets/generated/implement_4k.png")} loading="lazy" decoding="async" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/35 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">{t("home.implements")}</h3>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    {t("home.browse_models")} <SharedIcon name="chevron-right" className="h-4 w-4" />
                  </div>
                </div>
              </Link>
              {/* Ploughs */}
              <Link href="/rent-equipment?query=ploughs" className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg cursor-pointer block">
                <ContentImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={langText("Plough working through prepared soil", "तयार जमिनीत चालणारा नांगर")} src={assetPath("/assets/generated/plough_4k.png")} loading="lazy" decoding="async" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/35 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">{t("home.ploughs")}</h3>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    {t("home.browse_models")} <SharedIcon name="chevron-right" className="h-4 w-4" />
                  </div>
                </div>
              </Link>
              {/* Sprayers */}
              <Link href="/rent-equipment?query=sprayers" className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg cursor-pointer block">
                <ContentImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={langText("Crop sprayer ready for field coverage", "शेतात फवारणीसाठी तयार स्प्रेयर")} src={assetPath("/assets/generated/sprayer.png")} loading="lazy" decoding="async" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/35 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">{t("home.sprayers")}</h3>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    {t("home.browse_models")} <SharedIcon name="chevron-right" className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Kisan Kamai */}
        <section className="py-24 bg-surface overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div className="relative">
                <ContentImage className="rounded-[2.5rem] shadow-2xl relative z-10" alt={langText("Indian farmer leaning against a tractor with pride", "अभिमानाने ट्रॅक्टरला टेकून उभा भारतीय शेतकरी")} src={assetPath("/assets/generated/hero_tractor.png")} loading="lazy" decoding="async" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-primary dark:text-emerald-50 mb-8 tracking-tight leading-tight">
                  {t("home.rooted_in_trust")}<br />{t("home.driven_by_technology")}
                </h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                      <SharedIcon name="verified" className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 text-on-surface">{t("home.vetted_equipment_owners")}</h4>
                      <p className="text-on-surface-variant">{t("home.every_owner_on_our_platform_undergoes_a_rigorous_verification_process_to_ensure_reliability_and_safety")}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                      <SharedIcon name="support" className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 text-on-surface">{t("home.24_7_local_support")}</h4>
                      <p className="text-on-surface-variant">{t("home.our_team_is_available_round_the_clock_to_help_with_booking_issues_or_equipment_technicalities")}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                      <SharedIcon name="payments" className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 text-on-surface">{t("home.fair_pricing_promise")}</h4>
                      <p className="text-on-surface-variant">{t("home.transparent_rates_with_no_hidden_costs_we_ensure_fair_value_for_both_renters_and_equipment_owners")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Operating Area Map */}
        <section className="py-24 bg-surface-container-low">
          <ScrollReveal className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-4">
                <h2 className="text-4xl font-black text-primary dark:text-emerald-50 mb-6 tracking-tight">{t("home.expanding_across_maharashtra")}</h2>
                <p className="text-on-surface-variant mb-8">{t("home.we_are_currently_focused_on_providing_the_best_service_within_these_three_core_districts_ensuring_fast_delivery_and_local_support")}</p>
                <ul className="space-y-4">
                  {NORTHERN_MAHARASHTRA_SERVICE_AREAS.map(({ areaLabel }) => (
                    <li key={areaLabel} className="flex items-center gap-3 font-bold text-lg text-primary dark:text-emerald-50">
                      <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-xs">✓</span>{" "}
                      {langText(
                        serviceAreaTranslations[areaLabel as keyof typeof serviceAreaTranslations]?.en || areaLabel,
                        serviceAreaTranslations[areaLabel as keyof typeof serviceAreaTranslations]?.mr || areaLabel
                      )}
                    </li>
                  ))}
                </ul>
                <div className="kk-depth-tile mt-12 p-6 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant">
                  <p className="text-sm font-label text-on-surface-variant mb-2">{t("home.are_you_from_another_district")}</p>
                  <Link className="text-secondary dark:text-amber-400 font-bold underline underline-offset-4" href="/support">{t("home.notify_me_when_you_launch_nearby")}</Link>
                </div>
              </div>
              <div className="md:col-span-8">
                <div className="bg-surface-container-lowest p-4 rounded-[2rem] shadow-xl border border-outline-variant">
                  <div className="w-full h-[500px] rounded-[1.5rem] overflow-hidden">
                    <LazyMap
                      center={[16.85, 74.27]}
                      zoom={9}
                      markers={homepageMarkers}
                      height="100%"
                      showControls={true}
                      deferUntilVisible={false}
                      className="rounded-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Farmer Stories (Visual Only Stars) */}
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-black text-primary dark:text-emerald-50 text-center mb-16 tracking-tight">{t("home.rooted_success_stories")}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((item) => (
                <div key={item.name} className="kk-depth-tile bg-surface-container-low p-8 rounded-3xl border border-outline-variant">
                  <div className="flex gap-1 text-amber-500 mb-6">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <SharedIcon key={`${item.name}-star-${index}`} name="star" className="h-5 w-5" />
                    ))}
                  </div>
                  <p className="text-on-surface-variant mb-8 italic leading-relaxed">
                    {langText(item.quoteEn, item.quoteMr)}
                  </p>
                  <div className="flex items-center gap-4">
                    <ContentImage className="w-12 h-12 rounded-full object-cover" alt={item.name} src={assetPath("/assets/generated/farmer_portrait.png")} loading="lazy" decoding="async" />
                    <div>
                      <h5 className="font-bold text-primary dark:text-emerald-50">{item.name}</h5>
                      <p className="text-xs font-label text-on-surface-variant">{langText(item.areaEn, item.areaMr)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl font-black text-primary dark:text-emerald-50 text-center mb-16 tracking-tight">{t("home.frequently_asked_questions")}</h2>
            <div className="space-y-4">
              {faqs.map((item) => (
                <details key={item.questionEn} className="group rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <h4 className="font-bold text-lg text-primary dark:text-emerald-50">
                      {langText(item.questionEn, item.questionMr)}
                    </h4>
                    <SharedIcon name="plus" className="h-5 w-5 text-outline transition-transform group-open:rotate-45 group-open:text-primary" />
                  </summary>
                  <p className="mt-4 text-on-surface-variant">
                    {langText(item.answerEn, item.answerMr)}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-primary text-white overflow-hidden relative">
          <div className="absolute inset-0 z-0">
            <ContentImage className="w-full h-full object-cover" alt={langText("Tractors parked in a rural equipment yard at dusk", "संध्याकाळी ग्रामीण यंत्रसामग्रीच्या अंगणात उभे असलेले ट्रॅक्टर")} src={assetPath("/assets/generated/farm_yard.png")} loading="lazy" decoding="async" />
            <div className="kk-banner-image-overlay" />
          </div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl font-black mb-8 leading-tight">{t("home.ready_to_transform_your_farming_journey")}</h2>
            <p className="text-xl text-white/70 mb-12">{t("home.join_thousands_of_farmers_in_maharashtra_using_kisan_kamai_to_access_world_class_machinery_today")}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/rent-equipment" className="bg-secondary text-white px-10 py-5 rounded-xl text-lg font-black hover:bg-secondary/90 shadow-xl transition-all text-center">
                {t("home.browse_equipment")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
