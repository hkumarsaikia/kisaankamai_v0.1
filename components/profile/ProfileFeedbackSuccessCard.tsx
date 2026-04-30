"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import type { LocalizedText } from "@/lib/i18n";

type DisplayText = string | LocalizedText;

type ProfileFeedbackSuccessCardProps = {
  primaryHref: string;
  primaryLabel: DisplayText;
  secondaryHref: string;
  secondaryLabel: DisplayText;
  message: DisplayText;
};

export function ProfileFeedbackSuccessCard({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  message,
}: ProfileFeedbackSuccessCardProps) {
  const { langText } = useLanguage();
  const displayText = (value: DisplayText) =>
    typeof value === "string" ? value : langText(value.en, value.mr);

  return (
    <div className="mx-auto max-w-3xl rounded-[2.5rem] bg-white p-8 text-center shadow-sm dark:bg-slate-900 md:p-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-fixed text-primary">
        <span className="material-symbols-outlined text-4xl">task_alt</span>
      </div>
      <h2 className="mt-6 text-4xl font-black text-primary">
        {langText("Feedback Submitted Successfully", "अभिप्राय यशस्वीरित्या सबमिट झाला")}
      </h2>
      <p className="mt-3 text-lg font-semibold text-on-surface-variant">{displayText(message)}</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href={primaryHref} className="rounded-xl bg-primary-container px-6 py-3 text-sm font-bold text-white">
          {displayText(primaryLabel)}
        </Link>
        <Link
          href={secondaryHref}
          className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-100"
        >
          {displayText(secondaryLabel)}
        </Link>
      </div>
    </div>
  );
}
