"use client";

import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCFDqpgBNh_iSFxu6BnSUjhemjcnwINmEx85nczk8NTJFvDv91MQAV1ZfsdPf-BrF3ORNfulx-azG104Kn7cyltCDWUGNiJraeUlLEqZVZAHhf1MnXW18zqlTEqirhcykBnO2p0X-qr7rRvvdEi0b95KykGwjF3CDZo3GE-wfeU9sc2lmQAyCEnTNSVb0f8zLd3F2fHaa_KaaxY4yVxCWm6Cf-P8LR_YlbtTIzaNyklPjpnYXSdWkJdf7g6elT8x5p2jd-3vuF44IQj";

const originImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD7lqrLaju14oegHChisqOBxeowCA7nROS-prY8iwdyWwVHcSqFD77cJ3HSg_cFVb_JFviTQngCsUILwzLGnfDbovp2zpu08TkQpYuoWK82yHevDiJq5EldVTjdS3EZnQKIgbCm1-232g7X6fT4F3QEGJ_ZtL5whLkedXTQSlXmSIiC0f1G4HVfeUKEjlfeit0ND12LTtRZ7TuBxaYM3RCcO0opxwn5VQHJu3vg68WaM8Ku0oLLZNO_v0Hh_sUPwmyapPAhGdc8BKLP";

const values = [
  {
    icon: "verified_user",
    title: { en: "Trust", mr: "विश्वास" },
    copy: "Every machine and owner on our platform undergoes a rigorous verification process.",
    cacheKey: "about.value.trust",
  },
  {
    icon: "lightbulb",
    title: { en: "Innovation", mr: "नवोन्मेष" },
    copy: "Leveraging modern technology to solve age-old rural agricultural challenges.",
    cacheKey: "about.value.innovation",
  },
  {
    icon: "groups",
    title: { en: "Community", mr: "समुदाय" },
    copy: "Deeply rooted in Sangli, Satara, and Kolhapur, serving our local farming brothers.",
    cacheKey: "about.value.community",
  },
];

const metrics = [
  { value: "50+", label: { en: "Districts Covered", mr: "५०+ जिल्हे" } },
  { value: "12k+", label: { en: "Verified Equipments", mr: "१२,०००+ पडताळणी केलेली यंत्रे" } },
  { value: "85k+", label: { en: "Farmer Users", mr: "८५,०००+ शेतकरी सभासद" } },
];

const team = [
  "Rohit Nikaam",
  "Pratik Shinde",
  "Harshwardhan Shinde",
  "Raksha Sonawane",
];

export default function AboutPage() {
  const { langText, text } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-on-background">
      <main className="pt-20">
        <section className="relative flex min-h-[640px] items-center overflow-hidden">
          <Image
            src={heroImage}
            alt="Expansive lush green sugarcane fields in western Maharashtra at sunrise"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/55 to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
            <div className="max-w-3xl">
              <h1 className="font-headline text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
                {langText(
                  "Empowering Indian Agriculture Through Shared Growth",
                  "सामूहिक प्रगतीद्वारे भारतीय शेतीचे सक्षमीकरण"
                )}
              </h1>
              <p className="mt-6 font-headline text-2xl font-semibold leading-relaxed text-primary-fixed/90">
                {text("A marketplace rooted in trust, local access, and shared prosperity for farmers and owners.", {
                  cacheKey: "about.hero-subtitle",
                })}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-24 md:grid-cols-2">
          <PurposeCard
            icon="track_changes"
            title={{ en: "Mission", mr: "आमचे ध्येय" }}
            copy={{
              en: "To democratize access to advanced agricultural machinery, ensuring every farmer has the tools to succeed regardless of their land size.",
              mr: "प्रगत कृषी यंत्रसामग्रीचा वापर सर्वांसाठी सुलभ करणे, जेणेकरून प्रत्येक शेतकऱ्याकडे त्यांच्या जमिनीच्या आकारानुसार यशासाठी आवश्यक साधने असतील.",
            }}
          />
          <PurposeCard
            dark
            icon="visibility"
            title={{ en: "Vision", mr: "आमचे स्वप्न" }}
            copy={{
              en: "To become the backbone of rural agricultural logistics, fostering a connected ecosystem of prosperity across India.",
              mr: "ग्रामीण कृषी लॉजिस्टिकचा कणा बनणे आणि संपूर्ण भारतात समृद्धीची जोडलेली परिसंस्था निर्माण करणे.",
            }}
          />
        </section>

        <section className="bg-surface-container py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">
            <div>
              <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary">
                {langText("The Origin Story", "आमची सुरुवात")}
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-relaxed text-on-surface-variant">
                <p>
                  {langText(
                    "Founded in the heart of Western Maharashtra, Kisan Kamai was born from a simple observation: while modern farming equipment existed, it was often out of reach for the smallholder farmer.",
                    "पश्चिम महाराष्ट्राच्या मध्यभागी स्थापन झालेल्या किसान कमाईचा जन्म एका साध्या निरीक्षणातून झाला: आधुनिक शेतीची साधने उपलब्ध असतानाही, ती सामान्य शेतकऱ्यांच्या आवाक्याबाहेर होती."
                  )}
                </p>
                <p>
                  {langText(
                    "We set out to bridge the gap between equipment owners with idle capacity and farmers in need of specialized machinery, creating a marketplace built on trust and mutual growth.",
                    "आम्ही यंत्रमालक आणि गरजवंत शेतकरी यांच्यातील दरी सांधण्यासाठी विश्वास आणि सामूहिक प्रगती या तत्त्वावर आधारित हे व्यासपीठ तयार केले आहे."
                  )}
                </p>
              </div>
            </div>
            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] shadow-2xl">
              <Image
                src={originImage}
                alt="Modern red tractor parked in a vibrant green sugarcane field in Sangli"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24">
          <SectionTitle title={{ en: "Core Values", mr: "आमची मूल्ये" }} />
          <div className="grid gap-12 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.cacheKey} className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-4xl">{value.icon}</span>
                </div>
                <h3 className="text-2xl font-bold">{langText(value.title.en, value.title.mr)}</h3>
                <p className="mt-4 text-on-surface-variant">{text(value.copy, { cacheKey: value.cacheKey })}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary py-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 text-center md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label.en} className="flex flex-col gap-2">
                <span className="font-headline text-5xl font-extrabold text-on-primary-container">{metric.value}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-primary-fixed">
                  {langText(metric.label.en, metric.label.mr)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24">
          <SectionTitle title={{ en: "Meet the Team", mr: "आमचे नेतृत्व" }} />
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {team.map((person) => (
              <div
                key={person}
                className="rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-8 text-center"
              >
                <h4 className="text-lg font-bold">{person}</h4>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function PurposeCard({
  icon,
  title,
  copy,
  dark = false,
}: {
  icon: string;
  title: { en: string; mr: string };
  copy: { en: string; mr: string };
  dark?: boolean;
}) {
  const { langText } = useLanguage();

  return (
    <div className={`flex flex-col gap-6 rounded-[1.5rem] p-10 ${dark ? "bg-primary-container text-on-primary-container" : "border border-outline-variant/30 bg-surface-container-low"}`}>
      <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${dark ? "bg-on-primary-container text-primary-container" : "bg-primary-container text-on-primary-container"}`}>
        <span className="material-symbols-outlined text-4xl">{icon}</span>
      </div>
      <div>
        <h2 className={`font-headline text-3xl font-bold ${dark ? "text-white" : "text-primary"}`}>
          {langText(title.en, title.mr)}
        </h2>
        <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-primary-fixed/90" : "text-on-surface-variant"}`}>
          {langText(copy.en, copy.mr)}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: { en: string; mr: string } }) {
  const { langText } = useLanguage();

  return (
    <div className="mb-16 text-center">
      <h2 className="font-headline text-4xl font-extrabold text-primary">
        {langText(title.en, title.mr)}
      </h2>
    </div>
  );
}
