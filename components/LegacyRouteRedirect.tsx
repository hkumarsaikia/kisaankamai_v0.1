"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type LegacyRouteRedirectProps = {
  target: string;
  title: string;
};

export function LegacyRouteRedirect({ target, title }: LegacyRouteRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(target);
  }, [router, target]);

  return (
    <main className="min-h-screen bg-background text-on-background flex items-center justify-center px-6">
      <div className="max-w-xl w-full rounded-3xl border border-emerald-200/60 bg-white shadow-xl p-8 text-center dark:bg-slate-900 dark:border-slate-800">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
          Route Updated
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          This legacy route has moved to the new profile URL. You are being redirected now.
        </p>
        <Link
          href={target}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-500"
        >
          Continue to the new profile
        </Link>
      </div>
    </main>
  );
}
