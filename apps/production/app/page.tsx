import Image from "next/image";
import { AppLink } from "@/components/app-link";
import { LazyMap } from "@/components/lazy-map";
import { getMarketingCopy } from "@/lib/content";
import { getLocale } from "@/lib/i18n";
import { homepageCircles, homepageMarkers } from "@/lib/map-data";

export default async function HomePage() {
  const locale = await getLocale();
  const copy = getMarketingCopy(locale);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(43,157,109,0.18),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.16),_transparent_35%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-brand-800 dark:border-brand-900/60 dark:bg-brand-950/40 dark:text-brand-200">
              Kisan Kamai
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 dark:text-white md:text-6xl">
              {copy.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{copy.heroBody}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <AppLink href="/rent-equipment" className="kk-button-primary">
                {copy.browse}
              </AppLink>
              <AppLink href="/register" className="kk-button-secondary">
                {copy.register}
              </AppLink>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -rotate-3 rounded-[2rem] bg-brand-100/70 blur-2xl dark:bg-brand-900/30" />
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <Image
                src="/assets/generated/hero_tractor.png"
                alt="Hero tractor"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-950 dark:text-white">{copy.areasTitle}</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Live support coverage starts across the current operating hubs and is designed to expand district by district without breaking booking or owner onboarding flows.
            </p>
          </div>
          <LazyMap center={[17.1, 74.28]} zoom={7} markers={homepageMarkers} circles={homepageCircles} height="440px" />
        </div>
      </section>
    </main>
  );
}
