"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { account, databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { ID, OAuthProvider } from "appwrite";

export default function RegisterPage() {
  const { langText } = useLanguage();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    village: "",
    fieldArea: "",
    password: ""
  });

  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [role] = useState("renter"); // Default to renter

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    if (errors.pincode) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.pincode;
        return next;
      });
    }
    if (val.length === 6) {
       fetchPincodeDetails(val);
    } else {
       setSuggestions([]);
       setShowSuggestions(false);
    }
  };

  const fetchPincodeDetails = async (code: string) => {
    setIsPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === "Success") {
        setSuggestions(data[0].PostOffice || []);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (e) {
      console.error("Error fetching pincode:", e);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsPincodeLoading(false);
    }
  };

  const selectPincodeLocation = (office: any) => {
    setPincode(office.Pincode);
    setShowSuggestions(false);
    setFormData(prev => ({
      ...prev,
      village: `${office.Name}, ${office.District}`
    }));
  };

  const sendOtp = async () => {
    if (phone.length !== 10) {
      setErrors(prev => ({ ...prev, phone: langText("Enter a valid 10-digit number.", "वैध १० अंकी नंबर टाका.") }));
      return;
    }
    setIsSendingOtp(true);
    setOtpError("");
    try {
      // Simulation delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setOtpSent(true);
      console.log("Simulated OTP sent to:", phone);
    } catch {
      setOtpError("Failed to send OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (otpCode.length !== 6) {
      setOtpError(langText("Enter 6-digit code.", "६-अंकी कोड टाका."));
      return;
    }
    setIsVerifyingOtp(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Acceptance logic
      if (otpCode === "123456" || otpCode.length === 6) {
        setOtpVerified(true);
        setOtpError("");
      } else {
        setOtpError("Invalid OTP.");
      }
    } catch {
      setOtpError("Error verifying OTP.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = langText("Enter your full name.", "तुमचे पूर्ण नाव प्रविष्ट करा.");
    if (!formData.address.trim()) newErrors.address = langText("Enter your address.", "tumcha पत्ता प्रविष्ट करा.");
    if (!formData.village.trim()) newErrors.village = langText("Enter city/village.", "शहर/गाव प्रविष्ट करा.");
    if (pincode.length !== 6) newErrors.pincode = langText("Enter valid 6-digit pincode.", "वैध पिनकोड टाका.");
    if (!formData.fieldArea || parseFloat(formData.fieldArea) <= 0) newErrors.fieldArea = langText("Enter field area.", "शेती क्षेत्र टाका.");
    if (phone.length !== 10) newErrors.phone = langText("Enter 10-digit phone.", "१० अंकी फोन टाका.");
    if (!otpVerified) newErrors.phone = langText("Verify with OTP first.", "आधी OTP सत्यापित करा.");
    if (formData.password.length < 6) newErrors.password = langText("Min 6 characters.", "किमान ६ वर्ण.");

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const email = formData.email || `${phone}@kisankamai.com`;
      setIsPincodeLoading(true);
      try {
        const user = await account.create(ID.unique(), email, formData.password, formData.fullName);
        await account.createEmailPasswordSession(email, formData.password);
        await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.userCollectionId,
          user.$id,
          {
            fullName: formData.fullName,
            email: email,
            phone: phone,
            address: formData.address,
            village: formData.village,
            pincode: pincode,
            fieldArea: parseFloat(formData.fieldArea),
            role: role
          }
        );
        setShowPopup(true);
        setTimeout(() => router.push("/login"), 3000);
      } catch (error: any) {
        console.error("Auth error:", error);
        setErrors({ submit: error.message });
      } finally {
        setIsPincodeLoading(false);
      }
    }
  };

  const handleGoogleRegister = () => {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/verify-contact`,
      `${window.location.origin}/register`
    );
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col relative overflow-x-hidden">
      <Header />
      
      <main className="flex-grow relative flex items-center justify-center pt-28 pb-12">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-primary/60 z-10 mix-blend-multiply"></div>
          <img alt="Farming background" className="w-full h-full object-cover object-center" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8i8TjLswgZrM-W8Hx2oyVVWIqQ6JW2cecAWf61lw9qYCLshtLmRIlAG2Xip2L_lyX4RXiOHxvusw0Uiy5191L6wOBfSBwk29Y2LGCmONpoJncEOlkuWp5vARqXzNDEsVxNTnddxJ70BAgihWTFwnAQ1b9BbLPId6Y1LDVxFN2srNNbSCGc0EBDw4UK7Yd7Q0ok1frvhuV4Pznx86kYPhhRbgNqiczhuydijYZa2FKiz3oWqmNjl2P57vS9HDDcUB_6j6-udVsWBuz"/>
        </div>
        
        <div className="relative z-20 w-full max-w-3xl mx-auto px-4 py-8">
          <div className="rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-white/20 bg-white/95 backdrop-blur-xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 text-emerald-800">
               <span className="font-headline font-black text-2xl tracking-tight">Kisan Kamai</span>
            </div>
            
            <div className="p-8 sm:p-10 flex-grow">
              <div className="mb-8 text-center sm:text-left">
                <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 mb-2 tracking-tight">{langText("Create account", "नवीन खाते तयार करा")}</h1>
                <p className="font-body text-slate-600 text-base">{langText("Simplify your farming journey", "तुमचा शेती प्रवास सोपा करा")}</p>
              </div>
              
              <form className="space-y-6" onSubmit={handleRegister} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label text-sm font-semibold text-slate-700" htmlFor="fullName">{langText("Full Name", "पूर्ण नाव")}<span className="text-red-500 ml-1">*</span></label>
                    <input className={`kk-input ${errors.fullName ? 'border-red-400' : ''}`} id="fullName" placeholder="John Doe" type="text" value={formData.fullName} onChange={handleInputChange}/>
                    {errors.fullName && <p className="text-red-500 text-xs font-bold">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-sm font-semibold text-slate-700" htmlFor="email">{langText("Email (Optional)", "ईमेल (पर्यायी)")}</label>
                    <input className="kk-input" id="email" placeholder="email@example.com" type="email" value={formData.email} onChange={handleInputChange}/>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-700" htmlFor="address">{langText("Address", "पत्ता")}<span className="text-red-500 ml-1">*</span></label>
                  <input className={`kk-input ${errors.address ? 'border-red-400' : ''}`} id="address" placeholder="Street name" value={formData.address} onChange={handleInputChange}/>
                  {errors.address && <p className="text-red-500 text-xs font-bold">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="font-label text-sm font-semibold text-slate-700">{langText("Village", "गाव")}<span className="text-red-500 ml-1">*</span></label>
                    <input className={`kk-input ${errors.village ? 'border-red-400' : ''}`} id="village" placeholder="Village" value={formData.village} onChange={handleInputChange}/>
                    {errors.village && <p className="text-red-500 text-xs font-bold">{errors.village}</p>}
                  </div>
                  
                  <div className="space-y-2 relative">
                    <label className="font-label text-sm font-semibold text-slate-700">{langText("Pin Code", "पिन कोड")}<span className="text-red-500 ml-1">*</span></label>
                    <input className={`kk-input ${errors.pincode ? 'border-red-400' : ''}`} placeholder="6 digits" value={pincode} onChange={handlePincodeChange} maxLength={6}/>
                    {errors.pincode && <p className="text-red-500 text-xs font-bold">{errors.pincode}</p>}
                    
                    {!isPincodeLoading && showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-[105%] left-0 w-full bg-white border rounded-xl shadow-lg z-50 max-h-40 overflow-y-auto">
                        {suggestions.map((o, i) => (
                          <div key={i} onClick={() => selectPincodeLocation(o)} className="p-3 hover:bg-emerald-50 cursor-pointer text-sm border-b last:border-0">
                            <strong>{o.Name}</strong>, {o.District}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="font-label text-sm font-semibold text-slate-700">{langText("Acres", "एकर")}</label>
                    <input className={`kk-input ${errors.fieldArea ? 'border-red-400' : ''}`} id="fieldArea" type="number" step="0.5" placeholder="0" value={formData.fieldArea} onChange={handleInputChange}/>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-label text-sm font-semibold text-slate-700">{langText("Phone Number", "फोन नंबर")}<span className="text-red-500 ml-1">*</span></label>
                    <div className="flex gap-2">
                      <div className={`flex flex-grow kk-input p-0 overflow-hidden items-center ${errors.phone ? 'border-red-400' : ''}`}>
                        <span className="px-3 border-r bg-slate-50 text-slate-500 font-bold">+91</span>
                        <input className="flex-grow border-none px-4 py-3 outline-none focus:ring-0 font-bold tracking-widest" maxLength={10} placeholder="10 digits" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} disabled={otpVerified}/>
                      </div>
                      {!otpVerified && (
                        <button type="button" onClick={sendOtp} disabled={isSendingOtp || phone.length !== 10} className="px-5 bg-secondary text-white font-black rounded-xl hover:bg-orange-800 disabled:opacity-50 transition-all">
                          {isSendingOtp ? "..." : otpSent ? langText("Resend", "पुन्हा") : langText("Send OTP", "OTP पाठवा")}
                        </button>
                      )}
                      {otpVerified && (
                        <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-4 rounded-xl font-bold border border-emerald-200">
                          <span className="material-symbols-outlined text-sm">verified</span> Verified
                        </div>
                      )}
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs font-bold">{errors.phone}</p>}
                  </div>

                  {otpSent && !otpVerified && (
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top-1 mt-2">
                      <label className="text-xs font-black uppercase text-emerald-800 mb-2 block tracking-widest">{langText("Apply OTP", "OTP लागू करा")}</label>
                      <div className="flex gap-2">
                        <input className="kk-input flex-grow text-center tracking-[0.5em] font-black" placeholder="000000" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}/>
                        <button type="button" onClick={verifyOtp} disabled={isVerifyingOtp} className="px-6 bg-emerald-700 text-white font-black rounded-xl hover:bg-emerald-800 whitespace-nowrap">
                           {isVerifyingOtp ? "..." : langText("Verify OTP", "OTP सत्यापित")}
                        </button>
                      </div>
                      {otpError && <p className="text-red-500 text-[11px] font-bold mt-2 text-center">{otpError}</p>}
                      <p className="text-[10px] text-emerald-600 font-bold mt-2 text-center uppercase tracking-tighter">Use any 6 digits for testing</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-700" htmlFor="password">{langText("Password", "पासवर्ड")}<span className="text-red-500 ml-1">*</span></label>
                  <input className={`kk-input ${errors.password ? 'border-red-400' : ''}`} id="password" type="password" placeholder="Create password" value={formData.password} onChange={handleInputChange}/>
                  {errors.password && <p className="text-red-500 text-xs font-bold">{errors.password}</p>}
                </div>

                <button className="w-full py-4 bg-emerald-900 text-white text-base font-black rounded-xl shadow-lg hover:bg-emerald-950 transition-all uppercase tracking-widest" type="submit">
                  {langText("Create Kisan Kamai Account", "खाते तयार करा")}
                </button>

                <div className="relative flex items-center gap-4 py-2">
                  <div className="flex-grow border-t"></div>
                  <span className="text-xs font-bold text-slate-400">OR</span>
                  <div className="flex-grow border-t"></div>
                </div>

                <button type="button" onClick={handleGoogleRegister} className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-4 rounded-xl border hover:bg-slate-50 transition-all shadow-sm">
                  <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G"/>
                  <span>{langText("Sign up with Google", "Google सह नोंदणी करा")}</span>
                </button>
              </form>
            </div>
            
            <div className="bg-slate-50 py-6 px-10 text-center border-t border-slate-200">
              <p className="font-body text-sm font-medium text-slate-600">
                {langText("Already have an account?", "आधीच खाते आहे?")}{" "}
                <Link className="font-black text-secondary hover:text-orange-900 underline ml-1" href="/login">
                  {langText("Login", "लॉगिन करा")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full mx-4 shadow-2xl text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl text-emerald-600">check_circle</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{langText("Account Created!", "खाते तयार झाले!")}</h3>
            <p className="text-slate-600 mb-8 font-medium">{langText("Your Kisan Kamai account created successfully. Please login.", "तुमचे खाते यशस्वीरित्या तयार झाले आहे. कृपया लॉगिन करा.")}</p>
            <button onClick={() => router.push('/login')} className="w-full bg-emerald-900 text-white font-bold py-4 rounded-xl shadow-md">
                 {langText("Go to Login", "लॉगिनला जा")}
            </button>
          </div>
        </div>
      )}

      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}
