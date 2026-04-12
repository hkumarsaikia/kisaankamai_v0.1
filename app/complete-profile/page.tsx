"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { useAuth } from "@/components/AuthContext";
import { databases, APPWRITE_CONFIG } from "@/lib/appwrite";

export default function CompleteProfile() {
  const router = useRouter();
  const { langText } = useLanguage();
  const { user, profile, loading, isProfileComplete, refreshProfile } = useAuth();
  
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && isProfileComplete) {
      router.push("/profile-selection");
    }
  }, [user, loading, isProfileComplete, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10 || pincode.length !== 6) {
      setError(langText("Please enter valid phone and pincode.", "कृपया वैध फोन आणि पिनकोड प्रविष्ट करा."));
      return;
    }
    setIsVerifying(true);
    try {
      // Check if document exists first
      try {
        await databases.getDocument(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.userCollectionId, user!.$id);
        // Update
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId, 
          APPWRITE_CONFIG.userCollectionId, 
          user!.$id, 
          {
            phone,
            pincode,
            role: profile?.role || "renter"
          }
        );
      } catch {
        // Create if not exists
        await databases.createDocument(
          APPWRITE_CONFIG.databaseId, 
          APPWRITE_CONFIG.userCollectionId, 
          user!.$id, 
          {
            phone,
            pincode,
            fullName: user!.name || "User",
            email: user!.email || "",
            role: "renter" // Default role
          }
        );
      }
      
      await refreshProfile();
      router.push("/profile-selection");
    } catch (err: any) {
      console.error("Profile save error:", err);
      setError("Failed to save profile: " + err.message);
    }
    setIsVerifying(false);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
        <div className="kk-glass w-full max-w-xl p-8 lg:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-primary dark:text-emerald-50 mb-2">
              {langText("Complete Your Profile", "तुमची प्रोफाइल पूर्ण करा")}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              {langText("Just a few more details to get you started.", "सुरू करण्यासाठी फक्त काही अधिक तपशील.")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                {langText("Phone Number", "फोन नंबर")}
              </label>
              <input
                className="kk-input"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                {langText("Pin Code", "पिन कोड")}
              </label>
              <input
                className="kk-input"
                placeholder="6-digit pin code"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
            </div>

            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isVerifying ? <span className="material-symbols-outlined animate-spin">sync</span> : null}
              {langText("Complete Profile", "प्रोफाइल पूर्ण करा")}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
