import { AppLink } from "@/components/app-link";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { getMarketingCopy } from "@/lib/content";
import type { Locale, SessionRecord } from "@/lib/types";

export function SiteHeader({ locale, session }: { locale: Locale; session: SessionRecord | null }) {
  const copy = getMarketingCopy(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <AppLink href="/" className="text-2xl font-black tracking-tight text-brand-800 dark:text-brand-100">
          {copy.brand}
        </AppLink>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex dark:text-slate-300">
          <AppLink href="/rent-equipment" className="hover:text-brand-700 dark:hover:text-brand-300">
            {copy.browse}
          </AppLink>
          <AppLink href="/list-equipment" className="hover:text-brand-700 dark:hover:text-brand-300">
            {copy.list}
          </AppLink>
          <AppLink href="/support" className="hover:text-brand-700 dark:hover:text-brand-300">
            {copy.support}
          </AppLink>
          <AppLink href="/feedback" className="hover:text-brand-700 dark:hover:text-brand-300">
            {copy.feedback}
          </AppLink>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle locale={locale} />
          <ThemeToggle />
          {session ? (
            <AppLink
              href={session.user.workspacePreference === "owner" ? "/owner-dashboard" : "/renter-dashboard"}
              className="rounded-full bg-brand-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
            >
              {session.user.fullName}
            </AppLink>
          ) : (
            <>
              <AppLink
                href="/login"
                className="hidden rounded-full border border-brand-700 px-4 py-2 text-sm font-bold text-brand-700 transition hover:bg-brand-50 md:block dark:border-brand-300 dark:text-brand-300 dark:hover:bg-brand-950/40"
              >
                {copy.login}
              </AppLink>
              <AppLink
                href="/register"
                className="rounded-full bg-brand-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
              >
                {copy.register}
              </AppLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
