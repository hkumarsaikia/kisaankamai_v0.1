"use client";

import { useState, useEffect } from "react";
import { account } from "@/lib/appwrite";

export default function SettingsDashboard() {
  const [userName, setUserName] = useState("Owner");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  useEffect(() => {
    account.get().then((u) => {
      setUserName(u.name || "Owner");
      setEmail(u.email || "");
      setPhone(u.phone || "");
    }).catch(() => {});
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-on-surface dark:text-emerald-50 tracking-tight font-headline">Settings</h2>
          <p className="text-on-surface-variant dark:text-slate-400 font-body mt-1">Manage your account preferences and business profile.</p>
        </div>

        <div className="space-y-8">
          {/* Section: Personal Info */}
          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-surface-container-lowest dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">person</span>
                <h3 className="font-bold text-on-surface dark:text-emerald-50">Personal Information <span className="text-on-surface-variant/60 dark:text-slate-500 font-normal ml-2">| वैयक्तिक माहिती</span></h3>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Full Name (नाव)</label>
                <input 
                  className="w-full bg-surface-container-low dark:bg-slate-800 border-none rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600/50 transition-all dark:text-white" 
                  type="text" 
                  defaultValue={userName} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Phone Number (फोन नंबर)</label>
                <input 
                  className="w-full bg-surface-container-low dark:bg-slate-800 border-none rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600/50 transition-all dark:text-white opacity-60 cursor-not-allowed" 
                  type="tel" 
                  disabled
                  defaultValue={phone || "Not Set"} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Email Address (ईमेल)</label>
                <input 
                  className="w-full bg-surface-container-low dark:bg-slate-800 border-none rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600/50 transition-all dark:text-white opacity-60 cursor-not-allowed" 
                  type="email" 
                  disabled
                  defaultValue={email || "Not Set"} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Village/City (गाव/शहर)</label>
                <input 
                  className="w-full bg-surface-container-low dark:bg-slate-800 border-none rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600/50 transition-all dark:text-white" 
                  type="text" 
                  defaultValue="Baramati" 
                />
              </div>
            </div>
            
            <div className="px-6 py-4 bg-surface-container-lowest dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button className="bg-primary hover:bg-primary-container dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold hover:scale-[1.02] active:scale-95 transition-all">Save Changes</button>
            </div>
          </section>

          {/* Section: Business Preferences */}
          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-surface-container-lowest dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">business_center</span>
                <h3 className="font-bold text-on-surface dark:text-emerald-50">Business Preferences <span className="text-on-surface-variant/60 dark:text-slate-500 font-normal ml-2">| व्यवसाय प्राधान्ये</span></h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Service Districts (सेवा जिल्हे)</label>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium">Pune <span className="material-symbols-outlined text-sm cursor-pointer hover:text-emerald-950 dark:hover:text-emerald-100">close</span></span>
                  <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium">Ahmednagar <span className="material-symbols-outlined text-sm cursor-pointer hover:text-emerald-950 dark:hover:text-emerald-100">close</span></span>
                  <button className="inline-flex items-center gap-1 border-2 border-dashed border-slate-300 dark:border-slate-700 px-3 py-1 rounded-full text-sm text-slate-500 dark:text-slate-400 hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">
                    <span className="material-symbols-outlined text-sm">add</span> Add District
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Preferred Language (प्राधान्य दिलेली भाषा)</label>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-4 rounded-lg border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 font-bold">English</button>
                    <button className="flex-1 py-2 px-4 rounded-lg border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:border-emerald-200 dark:hover:border-slate-600 transition-all">मराठी</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-surface-container-lowest dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button className="bg-primary hover:bg-primary-container dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold hover:scale-[1.02] active:scale-95 transition-all">Update Preferences</button>
            </div>
          </section>

          {/* Section: Notifications */}
          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-surface-container-lowest dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">notifications_active</span>
                <h3 className="font-bold text-on-surface dark:text-emerald-50">Notifications <span className="text-on-surface-variant/60 dark:text-slate-500 font-normal ml-2">| सूचना</span></h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="font-bold text-on-surface dark:text-emerald-50">SMS Alerts</p>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400">Receive booking updates via text message</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="font-bold text-on-surface dark:text-emerald-50">WhatsApp Notifications</p>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400">Get instant alerts on WhatsApp for new requests</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="font-bold text-on-surface dark:text-emerald-50">Earnings Reports</p>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400">Monthly summary of your revenue</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Security */}
          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-surface-container-lowest dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">lock</span>
                <h3 className="font-bold text-on-surface dark:text-emerald-50">Security <span className="text-on-surface-variant/60 dark:text-slate-500 font-normal ml-2">| सुरक्षा</span></h3>
              </div>
            </div>
            
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-on-surface dark:text-emerald-50">Change Password</p>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">Last updated 3 months ago</p>
              </div>
              <button className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-surface-container-low dark:hover:bg-slate-800 transition-all w-full sm:w-auto mt-2 sm:mt-0">Update Password</button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
