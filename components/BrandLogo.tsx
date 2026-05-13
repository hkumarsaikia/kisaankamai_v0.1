type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showSubtitle?: boolean;
  inverse?: boolean;
};

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
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
        d="M16 32V20C16 17.8 17.8 16 20 16H28L34 22H46C48.2 22 50 23.8 50 26V36H48.5"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 16H30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M22 22H27L31 26H22V22Z" fill="currentColor" opacity="0.16" />
      <path d="M22 22H27L31 26H22V22Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M44 26V34M40 26V34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 22V12" stroke="var(--kk-logo-charcoal, #1f2937)" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 12H41L42 10" stroke="var(--kk-logo-charcoal, #1f2937)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="44" cy="44" r="8" fill="var(--kk-logo-surface, #ffffff)" stroke="var(--kk-logo-charcoal, #1f2937)" strokeWidth="4" />
      <circle cx="44" cy="44" r="3" fill="var(--kk-logo-accent, #ec5b13)" />
      <circle cx="22" cy="40" r="14" fill="var(--kk-logo-surface, #ffffff)" stroke="var(--kk-logo-charcoal, #1f2937)" strokeWidth="5" />
      <circle cx="22" cy="40" r="6" fill="var(--kk-logo-accent, #ec5b13)" />
      <path
        d="M6 40C6 31.16 13.16 24 22 24C27.5 24 31 26 34 30"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M12 36H6" stroke="var(--kk-logo-charcoal, #1f2937)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function BrandLogo({
  className = "",
  markClassName = "h-10 w-10",
  textClassName = "",
  showSubtitle = false,
  inverse = false,
}: BrandLogoProps) {
  return (
    <span
      className={`kk-brand-logo inline-flex items-center gap-2.5 ${inverse ? "kk-brand-logo-inverse" : ""} ${className}`}
      aria-label="Kisan Kamai"
    >
      <span className="kk-brand-logo-mark flex shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] dark:bg-slate-900 dark:text-primary-fixed">
        <LogoMark className={markClassName} />
      </span>
      <span className={`flex flex-col leading-none ${textClassName}`}>
        <span className="font-headline text-[1.45rem] font-black tracking-[-0.045em] text-slate-900 dark:text-emerald-50">
          <span className="text-primary dark:text-primary-fixed">Kisan</span>{" "}
          <span>
            Kamai<span className="text-secondary dark:text-secondary">.</span>
          </span>
        </span>
        {showSubtitle ? (
          <span className="mt-1 text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Smart Equipment Rental
          </span>
        ) : null}
      </span>
    </span>
  );
}
