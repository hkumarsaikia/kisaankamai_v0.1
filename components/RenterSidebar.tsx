"use client";

import { AppLink as Link } from "@/components/AppLink";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useLanguage } from "@/components/LanguageContext";

export const RenterSidebar = () => {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const userName = user?.name || profile?.fullName || t("renterSidebar.default_name");
  const initials = userName.substring(0, 1).toUpperCase();

  const navItems = [
    { name: t("renterSidebar.profile"), icon: "dashboard", path: "/renter-profile" },
    { name: t("renterSidebar.browse_equipment"), icon: "agriculture", path: "/rent-equipment" },
    { name: t("renterSidebar.my_bookings"), icon: "support_agent", path: "/support" },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-[60] p-4 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className="material-symbols-outlined font-black">
          {mobileMenuOpen ? "close" : "menu"}
        </span>
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`h-screen w-64 fixed left-0 top-0 border-r border-emerald-900/50 bg-emerald-950 dark:bg-slate-950 flex flex-col pt-6 shadow-2xl z-50 transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="px-6 mb-6">
          <span className="text-2xl font-black text-white">{t("common.brand")}</span>
        </div>

        {/* User Profile Section */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center border border-emerald-700 text-white font-bold">
            {initials}
          </div>
          <div>
            <p className="text-emerald-50 text-sm font-bold">{userName}</p>
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">{t("renterSidebar.role")}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 overflow-y-auto gap-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-emerald-800/50 text-white border-l-4 border-amber-500"
                    : "text-emerald-200/60 hover:bg-emerald-800/30 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto border-t border-white/5 px-2 py-2">
          <Link
            href="/profile-selection"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-4 text-emerald-200/60 hover:bg-emerald-800/30 hover:text-white text-sm font-semibold uppercase tracking-wider transition-all"
          >
            <span className="material-symbols-outlined">swap_horiz</span>
            <span>{t("renterSidebar.switch_to_owner")}</span>
          </Link>
          <Link
            href="/logout"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-4 text-emerald-200/60 hover:bg-red-950/30 hover:text-red-300 text-sm font-semibold uppercase tracking-wider transition-all text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>{t("renterSidebar.logout")}</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
