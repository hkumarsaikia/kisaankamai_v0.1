"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";

export const OwnerSidebar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
      // Failsafe
      window.location.href = "/login";
    }
  };

  const navItems = [
    { name: "Dashboard", icon: "dashboard", path: "/owner-dashboard" },
    { name: "My Equipment", icon: "agriculture", path: "/owner-dashboard/equipment" },
    { name: "Bookings", icon: "calendar_month", path: "/owner-dashboard/bookings" },
    { name: "Earnings", icon: "payments", path: "/owner-dashboard/revenue" },
    { name: "Settings", icon: "settings", path: "/owner-dashboard/settings" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
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

      {/* Sidebar Component */}
      <aside className={`h-screen w-64 fixed left-0 top-0 border-r border-emerald-900/50 bg-emerald-950 dark:bg-slate-950 flex flex-col p-4 gap-2 shadow-2xl z-50 transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 px-4 flex flex-col gap-1 mt-2">
          <h1 className="text-xl font-bold text-white tracking-tight">Kisan Kamai</h1>
          <p className="text-xs text-emerald-400 font-medium tracking-wide">Owner Portal</p>
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
            href="/owner-dashboard/add-listing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex justify-center items-center gap-3 px-4 py-3 bg-emerald-500 text-emerald-950 rounded-lg font-bold text-sm mb-4 transition-transform hover:brightness-110 active:scale-95 duration-150 ease-in-out"
          >
            <span className="material-symbols-outlined font-medium">add_circle</span>
            <span>Add New Listing</span>
          </Link>
          <Link
            href="/owner-dashboard/support"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-emerald-100/70 hover:bg-emerald-900/30 hover:text-white rounded-lg transition-colors font-manrope text-sm font-medium tracking-tight"
          >
            <span className="material-symbols-outlined">help_center</span>
            <span>Support</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-950/30 hover:text-red-100 rounded-lg transition-colors font-manrope text-sm font-medium tracking-tight w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
