"use client";

import { useAuth } from "@/components/AuthContext";

export default function RenterSettingsPage() {
  const { user, profile } = useAuth();

  return (
    <>
      <div>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          Settings / <span className="text-primary/60">सेटिंग्ज</span>
        </h1>
        <p className="text-slate-500 mt-1">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">person</span>
          <h2 className="text-lg font-bold text-primary">Profile Information</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Full Name</label>
            <input type="text" defaultValue={user?.name || profile?.fullName || ""} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-on-surface text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Email</label>
            <input type="email" defaultValue={user?.email || ""} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-on-surface text-sm outline-none focus:border-primary transition-all" readOnly />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Phone Number</label>
            <input type="tel" defaultValue={profile?.phone || ""} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-on-surface text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Village / Town</label>
            <input type="text" defaultValue={profile?.village || ""} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-on-surface text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Address</label>
            <input type="text" defaultValue={profile?.address || ""} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-on-surface text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Pincode</label>
            <input type="text" defaultValue={profile?.pincode || ""} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-on-surface text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-md">
            Save Changes
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">notifications</span>
          <h2 className="text-lg font-bold text-primary">Notification Preferences</h2>
        </div>
        <div className="p-6 space-y-5">
          {[
            { label: "Booking Confirmations", desc: "Get notified when a booking is confirmed", on: true },
            { label: "Payment Receipts", desc: "Receive receipts via email", on: true },
            { label: "Equipment Alerts", desc: "New equipment near you", on: false },
            { label: "Promotional Offers", desc: "Seasonal discounts and deals", on: false },
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-bold text-on-surface">{pref.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{pref.desc}</p>
              </div>
              <div className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${pref.on ? "bg-primary" : "bg-slate-300"}`}>
                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${pref.on ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Language & Region */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">language</span>
          <h2 className="text-lg font-bold text-primary">Language & Region</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Language</label>
            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-on-surface text-sm outline-none focus:border-primary transition-all">
              <option>English</option>
              <option>मराठी (Marathi)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">State</label>
            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-on-surface text-sm outline-none focus:border-primary transition-all">
              <option>Maharashtra</option>
              <option>Karnataka</option>
              <option>Madhya Pradesh</option>
            </select>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-red-50 dark:bg-red-950/10 rounded-xl overflow-hidden border border-red-200 dark:border-red-900/30">
        <div className="p-6 border-b border-red-200 dark:border-red-900/30 flex items-center gap-3">
          <span className="material-symbols-outlined text-red-500">warning</span>
          <h2 className="text-lg font-bold text-red-700 dark:text-red-400">Danger Zone</h2>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-red-700 dark:text-red-400">Delete Account</p>
            <p className="text-xs text-red-500/70 mt-0.5">This action is irreversible. All your data will be lost.</p>
          </div>
          <button className="px-5 py-2.5 border-2 border-red-500 text-red-600 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all">
            Delete Account
          </button>
        </div>
      </section>
    </>
  );
}
