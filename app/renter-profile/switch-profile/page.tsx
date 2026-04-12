"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

export default function SwitchProfilePage() {
  const { user, profile } = useAuth();
  const userName = user?.name || profile?.fullName || "Farmer";

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-4">
          Switch Workspace
        </h1>
        <h2 className="text-2xl font-bold text-secondary mb-6">
          कार्यक्षेत्र बदला
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Choose which profile to use. You are currently on the <strong className="text-primary">Renter</strong> profile, {userName}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Renter Profile - Current */}
        <div className="relative bg-white dark:bg-slate-900 rounded-2xl border-2 border-primary shadow-lg p-8 flex flex-col items-center text-center">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Current</span>
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-primary">agriculture</span>
          </div>
          <h3 className="text-2xl font-bold text-primary mb-2">Renter Profile</h3>
          <p className="text-slate-500 text-sm mb-6">Browse and rent equipment from verified owners across Maharashtra.</p>
          <div className="space-y-2 text-left w-full mb-6">
            {["Browse & book equipment", "Track active bookings", "Payment history", "Save favorites"].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="material-symbols-outlined text-emerald-500 text-[16px]">check_circle</span>{f}
              </div>
            ))}
          </div>
          <button disabled className="w-full py-3 bg-emerald-100 text-primary rounded-xl font-bold cursor-not-allowed">
            Currently Active
          </button>
        </div>

        {/* Owner Profile */}
        <Link href="/owner-profile" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col items-center text-center hover:shadow-lg hover:border-amber-400 transition-all group">
          <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors">
            <span className="material-symbols-outlined text-4xl text-amber-600">dashboard</span>
          </div>
          <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-2">Owner Profile</h3>
          <p className="text-slate-500 text-sm mb-6">List your equipment and earn income from your agricultural fleet.</p>
          <div className="space-y-2 text-left w-full mb-6">
            {["List your machines", "Manage bookings & revenue", "Track earnings", "Add new equipment"].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="material-symbols-outlined text-amber-500 text-[16px]">check_circle</span>{f}
              </div>
            ))}
          </div>
          <span className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold text-center group-hover:bg-amber-600 transition-colors">
            Switch to Owner →
          </span>
        </Link>
      </div>
    </div>
  );
}
