import { AppLink } from "@/components/app-link";
import { getMarketingCopy } from "@/lib/content";
import type { Locale } from "@/lib/types";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = getMarketingCopy(locale);

  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-slate-300 dark:border-slate-800">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-black text-white">{copy.brand}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">{copy.footer}</p>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-300">Navigate</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <AppLink href="/rent-equipment" className="hover:text-white">{copy.browse}</AppLink>
            <AppLink href="/list-equipment" className="hover:text-white">{copy.list}</AppLink>
            <AppLink href="/support" className="hover:text-white">{copy.support}</AppLink>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-300">Domain</h3>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Canonical production URL: <span className="font-semibold text-white">www.kisankamai.com</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
