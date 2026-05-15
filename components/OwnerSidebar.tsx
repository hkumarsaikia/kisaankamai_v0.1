"use client";

import { AppLink as Link } from "@/components/AppLink";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";

export const OwnerSidebar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { name: t("ownerSidebar.profile"), icon: "dashboard", path: "/owner-profile" },
    { name: t("ownerSidebar.add_new_listing"), icon: "add_circle", path: "/owner-profile/list-equipment" },
    { name: t("ownerSidebar.support"), icon: "help_center", path: "/support" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        aria-label={mobileMenuOpen ? "Close owner menu" : "Open owner menu"}
        className="lg:hidden fixed bottom-6 right-6 z-[60] p-4 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 active:scale-95 transition-[background-color,transform]"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className="material-symbols-outlined font-black" aria-hidden="true">
          {mobileMenuOpen ? "close" : "menu"}
        </span>
      </button>

      {/* Mobile Overlay */}
	      {mobileMenuOpen && (
	        <button
	          type="button"
	          aria-label="Close owner menu"
	          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
	          onClick={() => setMobileMenuOpen(false)}
	        />
	      )}

      {/* Sidebar Component */}
      <aside className={`h-screen w-64 fixed left-0 top-0 border-r border-emerald-900/50 bg-emerald-950 dark:bg-slate-950 flex flex-col p-4 gap-2 shadow-2xl z-50 transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 px-4 flex flex-col gap-1 mt-2">
          <h1 className="text-xl font-bold text-white tracking-tight">{t("common.brand")}</h1>
          <p className="text-xs text-emerald-400 font-medium tracking-wide">{t("ownerSidebar.section")}</p>
        </div>

        <nav className="flex flex-col gap-1 flex-grow">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-manrope text-sm font-medium tracking-tight transition-colors ${
                  isActive
                    ? "bg-emerald-800/50 text-white border-l-4 border-emerald-500"
                    : "text-emerald-100/70 hover:bg-emerald-900/30 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1 pb-4 lg:pb-0">
          <Link
            href="/owner-profile/list-equipment"
            onClick={() => setMobileMenuOpen(false)}
            className="flex justify-center items-center gap-3 px-4 py-3 bg-emerald-500 text-emerald-950 rounded-lg font-bold text-sm mb-4 transition-transform hover:brightness-110 active:scale-95 duration-150 ease-in-out"
          >
            <span className="material-symbols-outlined font-medium">add_circle</span>
            <span>{t("ownerSidebar.add_new_listing")}</span>
          </Link>
          <Link
            href="/logout"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-950/30 hover:text-red-100 rounded-lg transition-colors font-manrope text-sm font-medium tracking-tight w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>{t("ownerSidebar.sign_out")}</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
