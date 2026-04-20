"use client";

import { ContentImage } from "@/components/ContentImage";
import { LazyMap } from "@/components/LazyMap";
import { useLanguage } from "@/components/LanguageContext";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AppLink as Link } from "@/components/AppLink";
import { useState, useEffect } from "react";
import { useSmoothRouter } from "@/lib/client/useSmoothRouter";
import { HOMEPAGE_MARKERS } from "@/lib/map-data";
import { NORTHERN_MAHARASHTRA_SERVICE_AREAS } from "@/lib/service-areas.js";
import { assetPath } from "@/lib/site";

const heroImages = [
  assetPath("/assets/generated/hero_tractor.png"),
  assetPath("/assets/generated/harvester_action.png"),
  assetPath("/assets/generated/seed_drill.png"),
  assetPath("/assets/generated/farmer_handshake.png"),
  assetPath("/assets/generated/modern_farm_tech.png"),
  assetPath("/assets/generated/farm_yard.png")
];

export default function Home() {
  const { t } = useLanguage();
  const router = useSmoothRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
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
            {heroImages.map((src, index) => (
              <ContentImage key={src} className={`w-full h-full object-cover md:object-[center_15%] absolute inset-0 transition-opacity duration-1000 ${ index === currentSlide ? "opacity-100" : "opacity-0" }`} alt="Agricultural Equipment Imagery" src={src} loading="lazy" decoding="async" />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-black/30"></div>
            
            {/* Slider Controls */}
            <button 
              onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
              aria-label="Show previous hero image"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-20"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
              aria-label="Show next hero image"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-20"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6 mt-16 lg:mt-0">
                <span className="w-2 h-2 bg-secondary rounded-full transform dark:bg-amber-400"></span>
                <span className="text-sm font-label font-bold uppercase tracking-widest">Now Serving Northern Maharashtra</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                {t("home.modern_machinery_for_every_farm")}
              </h1>
              <p className="text-xl text-white/80 mb-10 max-w-lg leading-relaxed">
                {t("home.rent_high_quality_agricultural_equipment_from_trusted_local_owners_smarter_farming_powered_by_technology_rooted_in_trust")}
              </p>
              <div className="bg-white dark:bg-slate-950 p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl border border-transparent dark:border-slate-800">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800/50">
                  <span className="material-symbols-outlined text-secondary dark:text-emerald-400">location_on</span>
                  <select 
                    className="w-full border-none focus:ring-0 text-on-surface dark:text-emerald-50 bg-transparent cursor-pointer font-medium"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  >
                    <option className="dark:bg-slate-900 dark:text-slate-100 text-slate-800" value="" disabled>{t("home.select_location")}</option>
                    <option className="dark:bg-slate-900 dark:text-slate-100 text-slate-800" value="Kalwan">{t("home.kalwan")}</option>
                    <option className="dark:bg-slate-900 dark:text-slate-100 text-slate-800" value="Mukhed">{t("home.mukhed")}</option>
                    <option className="dark:bg-slate-900 dark:text-slate-100 text-slate-800" value="More locations coming soon..." disabled>{t("home.more_locations_coming_soon")}</option>
                  </select>
                </div>
                <div className="flex-1 flex items-center gap-3 px-4 py-3">
                  <span className="material-symbols-outlined text-secondary dark:text-emerald-400">agriculture</span>
                  <input 
                    className="w-full border-none focus:ring-0 text-on-surface dark:text-emerald-50 placeholder:text-slate-400 dark:placeholder-slate-500 bg-transparent font-medium" 
                    placeholder={t("home.search_tractors_harvesters")} 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button onClick={handleSearch} className="bg-secondary dark:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-secondary/90 dark:hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">search</span>
                  {t("home.search_now")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-24 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-black text-primary dark:text-emerald-50 mb-4 tracking-tight">{t("home.explore_equipment_categories")}</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-xl">{t("home.from_land_preparation_to_harvesting_find_the_right_tool_for_every_stage_of_your_farming_cycle")}</p>
              </div>
              <Link className="text-secondary font-bold flex items-center gap-2 hover:gap-3 transition-all" href="/categories">
                {t("home.view_all_categories")} <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {/* Tractors */}
              <Link href="/rent-equipment?query=tractors" className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg cursor-pointer block">
                <ContentImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="High-horsepower tractor parked in a vibrant green farm field" src={assetPath("/assets/generated/hero_tractor.png")} loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">{t("home.tractors")}</h3>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    {t("home.browse_models")} <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </div>
                </div>
              </Link>
              {/* Harvesters */}
              <Link href="/rent-equipment?query=harvesters" className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg cursor-pointer block">
                <ContentImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Combine harvester working through a wheat field" src={assetPath("/assets/generated/harvester_action.png")} loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">{t("home.harvesters")}</h3>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    {t("home.browse_models")} <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </div>
                </div>
              </Link>
              {/* Implements */}
              <Link href="/rent-equipment?query=implements" className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg cursor-pointer block">
                <ContentImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Agricultural implements including a rotavator and seed drill" src={assetPath("/assets/generated/implement_4k.png")} loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">{t("home.implements")}</h3>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    {t("home.browse_models")} <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </div>
                </div>
              </Link>
              {/* Ploughs */}
              <Link href="/rent-equipment?query=ploughs" className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg cursor-pointer block">
                <ContentImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Ploughing" src={assetPath("/assets/generated/plough_4k.png")} loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">{t("home.ploughs")}</h3>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    {t("home.browse_models")} <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </div>
                </div>
              </Link>
              {/* Sprayers */}
              <Link href="/rent-equipment?query=sprayers" className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg cursor-pointer block">
                <ContentImage className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Sprayer" src={assetPath("/assets/generated/sprayer.png")} loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">{t("home.sprayers")}</h3>
                  <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    {t("home.browse_models")} <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Kisan Kamai */}
        <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div className="relative">
                <ContentImage className="rounded-[2.5rem] shadow-2xl relative z-10" alt="Indian farmer leaning against a tractor with pride" src={assetPath("/assets/generated/hero_tractor.png")} loading="lazy" decoding="async" />
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/5 rounded-full -z-0"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full -z-0"></div>
              </div>
              <div>
                <h2 className="text-4xl font-black text-primary dark:text-emerald-50 mb-8 tracking-tight leading-tight">
                  {t("home.rooted_in_trust")}<br />{t("home.driven_by_technology")}
                </h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-slate-900/60 rounded-xl flex items-center justify-center text-primary-container dark:text-emerald-400 flex-shrink-0">
                      <span className="material-symbols-outlined">verified_user</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 dark:text-white">{t("home.vetted_equipment_owners")}</h4>
                      <p className="text-slate-600 dark:text-slate-400">{t("home.every_owner_on_our_platform_undergoes_a_rigorous_verification_process_to_ensure_reliability_and_safety")}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-slate-900/60 rounded-xl flex items-center justify-center text-primary-container dark:text-emerald-400 flex-shrink-0">
                      <span className="material-symbols-outlined">support_agent</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 dark:text-white">{t("home.24_7_local_support")}</h4>
                      <p className="text-slate-600 dark:text-slate-400">{t("home.our_team_is_available_round_the_clock_to_help_with_booking_issues_or_equipment_technicalities")}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-slate-900/60 rounded-xl flex items-center justify-center text-primary-container dark:text-emerald-400 flex-shrink-0">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 dark:text-white">{t("home.fair_pricing_promise")}</h4>
                      <p className="text-slate-600 dark:text-slate-400">{t("home.transparent_rates_with_no_hidden_costs_we_ensure_fair_value_for_both_renters_and_equipment_owners")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Operating Area Map */}
        <section className="py-24 bg-surface-container-low dark:bg-slate-950/50">
          <ScrollReveal className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-4">
                <h2 className="text-4xl font-black text-primary dark:text-emerald-50 mb-6 tracking-tight">{t("home.expanding_across_maharashtra")}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">{t("home.we_are_currently_focused_on_providing_the_best_service_within_these_three_core_districts_ensuring_fast_delivery_and_local_support")}</p>
                <ul className="space-y-4">
                  {NORTHERN_MAHARASHTRA_SERVICE_AREAS.map(({ areaLabel }) => (
                    <li key={areaLabel} className="flex items-center gap-3 font-bold text-lg text-primary dark:text-emerald-50">
                      <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-xs">✓</span> {areaLabel}
                    </li>
                  ))}
                </ul>
                <div className="mt-12 p-6 bg-white dark:bg-slate-900/40 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/50">
                  <p className="text-sm font-label text-slate-500 dark:text-slate-400 mb-2">{t("home.are_you_from_another_district")}</p>
                  <Link className="text-secondary dark:text-amber-400 font-bold underline underline-offset-4" href="/support">{t("home.notify_me_when_you_launch_nearby")}</Link>
                </div>
              </div>
              <div className="md:col-span-8">
                <div className="bg-white dark:bg-slate-900/40 p-4 rounded-[2rem] shadow-xl border border-white dark:border-slate-800/50">
                  <div className="w-full h-[500px] rounded-[1.5rem] overflow-hidden">
                    <LazyMap
                      center={[16.85, 74.27]}
                      zoom={9}
                      markers={HOMEPAGE_MARKERS}
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
        <section className="py-24 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-black text-primary dark:text-emerald-50 text-center mb-16 tracking-tight">{t("home.rooted_success_stories")}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-surface-container-low dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                <div className="flex gap-1 text-amber-500 mb-6">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-8 italic leading-relaxed">&quot;Renting a harvester through Kisan Kamai saved me 4 days of labor costs during the last peak season. The process was seamless.&quot;</p>
                <div className="flex items-center gap-4">
                  <ContentImage className="w-12 h-12 rounded-full object-cover" alt="Rajesh Deshmukh" src={assetPath("/assets/generated/farmer_portrait.png")} loading="lazy" decoding="async" />
                  <div>
                    <h5 className="font-bold text-primary dark:text-emerald-50">Rajesh Deshmukh</h5>
                    <p className="text-xs font-label text-slate-400">Kalwan Area</p>
                  </div>
                </div>
              </div>
              {/* Other stories... */}
              <div className="bg-surface-container-low dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                <div className="flex gap-1 text-amber-500 mb-6">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-8 italic leading-relaxed">&quot;As a tractor owner, I was worried about utilization. Kisan Kamai helped me find local farmers who needed my equipment exactly when it was idle.&quot;</p>
                <div className="flex items-center gap-4">
                  <ContentImage className="w-12 h-12 rounded-full object-cover" alt="Sanjay Kulkarni" src={assetPath("/assets/generated/farmer_portrait.png")} loading="lazy" decoding="async" />
                  <div>
                    <h5 className="font-bold text-primary dark:text-emerald-50">Sanjay Kulkarni</h5>
                    <p className="text-xs font-label text-slate-400">Mukhed Area</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-low dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                <div className="flex gap-1 text-amber-500 mb-6">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-8 italic leading-relaxed">&quot;The verification process for equipment is what makes me trust this platform. I know I&apos;m getting high-quality machinery every time.&quot;</p>
                <div className="flex items-center gap-4">
                  <ContentImage className="w-12 h-12 rounded-full object-cover" alt="Vikas More" src={assetPath("/assets/generated/farmer_portrait.png")} loading="lazy" decoding="async" />
                  <div>
                    <h5 className="font-bold text-primary dark:text-emerald-50">Vikas More</h5>
                    <p className="text-xs font-label text-slate-400">Kalwan Area</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-surface-container-low dark:bg-slate-950/50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl font-black text-primary dark:text-emerald-50 text-center mb-16 tracking-tight">{t("home.frequently_asked_questions")}</h2>
            <div className="space-y-4">
              <details className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <h4 className="font-bold text-lg text-primary dark:text-emerald-50">How do I verify the condition of the equipment?</h4>
                  <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-45 group-open:text-primary">add</span>
                </summary>
                <p className="mt-4 text-slate-600 dark:text-slate-400">All equipment listed undergoes a preliminary verification. We also encourage renters to inspect the machinery upon delivery before signing off on the rental period.</p>
              </details>
              {/* Other FAQs... */}
              <details className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <h4 className="font-bold text-lg text-primary dark:text-emerald-50">What happens if the equipment breaks down during work?</h4>
                  <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-45 group-open:text-primary">add</span>
                </summary>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Don't worry. Our platform requires owners to handle immediate malfunctions. You must notify us within 2 hours of breakdown, and you will receive a prorated refund or replacement equipment depending on availability.</p>
              </details>
              <details className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <h4 className="font-bold text-lg text-primary dark:text-emerald-50">Are there any hidden service charges?</h4>
                  <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-45 group-open:text-primary">add</span>
                </summary>
                <p className="mt-4 text-slate-600 dark:text-slate-400">No. The price you see at booking is exactly what you pay. It includes the equipment cost, and if required, the driver's fee. Kisan Kamai takes a small transparent commission directly from the owner's payout.</p>
              </details>
              <details className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <h4 className="font-bold text-lg text-primary dark:text-emerald-50">How can I pay for my rental?</h4>
                  <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-45 group-open:text-primary">add</span>
                </summary>
                <p className="mt-4 text-slate-600 dark:text-slate-400">You can pay securely via UPI, Credit/Debit cards, Net Banking, or choose Cash on Delivery directly to the equipment owner when the machinery arrives at your field.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-primary text-white overflow-hidden relative">
          <div className="absolute inset-0 z-0">
            <ContentImage className="w-full h-full object-cover opacity-20 grayscale" alt="Tractors parked in a rural equipment yard at dusk" src={assetPath("/assets/generated/farm_yard.png")} loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-primary/80"></div>
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
