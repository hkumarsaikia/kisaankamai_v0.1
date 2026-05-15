"use client";

import { useLanguage } from "@/components/LanguageContext";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showSubtitle?: boolean;
};

export function LogoMark({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 32V20C16 17.7909 17.7909 16 20 16H28L34 22H46C48.2091 22 50 23.7909 50 26V36H48.5"
        stroke="#15803d"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 16H30" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
      <path d="M22 22H27L31 26H22V22Z" fill="#15803d" opacity="0.15" />
      <path d="M22 22H27L31 26H22V22Z" stroke="#15803d" strokeWidth="2" strokeLinejoin="round" />
      <path d="M44 26V34M40 26V34" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 22V12" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 12H41L42 10" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="44" cy="44" r="8" fill="#ffffff" stroke="#1f2937" strokeWidth="4" />
      <circle cx="44" cy="44" r="3" fill="#f59e0b" />
      <circle cx="22" cy="40" r="14" fill="#ffffff" stroke="#1f2937" strokeWidth="5" />
      <circle cx="22" cy="40" r="6" fill="#f59e0b" />
      <path
        d="M6 40C6 31.16 13.16 24 22 24C27.5 24 31 26 34 30"
        stroke="#15803d"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M12 36H6" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function BrandLogo({
  className = "",
  markClassName = "h-16 w-16",
  textClassName = "",
  showSubtitle = false,
}: BrandLogoProps) {
  const { t, langText } = useLanguage();
  const brandName = t("common.brand");
  const brandParts = brandName.split(/\s+/).filter(Boolean);
  const firstPart = brandParts[0] || brandName;
  const secondPart = brandParts.slice(1).join(" ");
  const subtitle = langText("Smart Equipment Rental", "स्मार्ट उपकरण भाडे");
  const accessibleLabel = showSubtitle ? `${brandName} ${subtitle}` : brandName;

  return (
    <span
      className={`kk-brand-logo inline-flex items-center gap-[10px] ${className}`}
      aria-label={accessibleLabel}
    >
      <span className="kk-brand-logo-mark flex shrink-0 items-center justify-center">
        <LogoMark className={markClassName} />
      </span>
      <span className={`kk-brand-logo-text flex min-w-0 flex-col justify-center leading-none ${textClassName}`}>
        <span className="whitespace-nowrap font-label text-[1.95rem] font-extrabold leading-[1.05] tracking-[-0.03em]">
          <span className="text-[#15803d]">{firstPart}</span>
          {secondPart ? (
            <>
              {" "}
              <span className="text-[#1f2937]">{secondPart}</span>
            </>
          ) : null}
        </span>
        {showSubtitle ? (
          <span className="mt-1 font-label text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#6b7280]">
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}
