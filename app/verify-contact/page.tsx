"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { account, databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function VerifyContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // User context
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  // Input states
  const [name, setName] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");

  // Form handling
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Formatting and suggestions
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [village, setVillage] = useState("");

  // OTP details
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(59);

  // Load account on mount
  useEffect(() => {
    async function loadAccount() {
      try {
        const user = await account.get();
        // Check if user document already exists
        try {
          const doc = await databases.getDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.userCollectionId,
            user.$id
          );
          if (doc) {
            // Already verified and document exists, redirect to profile selection
            router.push("/profile-selection");
            return;
          }
        } catch (dbErr: any) {
          // Document not found is fine, we are here to complete the profile
          if (dbErr.code !== 404) {
             console.error("Database check error:", dbErr);
          }
        }

        setUserId(user.$id);
        setEmail(user.email);
        if (user.name) {
          setName(user.name);
        }
      } catch (err) {
        console.error("No active session:", err);
        router.push("/login"); // Redirect to login if not authenticated
      } finally {
        setLoading(false);
      }
    }
    loadAccount();
  }, [router]);

  // Resend timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handlePincodeChange = async (val: string) => {
    val = val.replace(/\D/g, "").slice(0, 6);
    setPincode(val);
    if (errors.pincode) setErrors(prev => { const n = {...prev}; delete n.pincode; return n; });
    
    if (val.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
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
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectPincodeLocation = (office: any) => {
    setPincode(office.Pincode);
    setShowSuggestions(false);
    setVillage(`${office.Name}, ${office.District}`);
  };

  const handleRequestOtp = async () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Full Name is required";
    if (pincode.length !== 6) newErrors.pincode = "6-digit Pin Code is required";
    if (phone.length !== 10) newErrors.phone = "10-digit Phone Number is required";
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSendingOtp(true);
      try {
        // Simulation delay for OTP sending
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStep(2);
        setResendTimer(59);
      } catch {
        setErrors({ submit: "Failed to send OTP. Please try again." });
      } finally {
        setIsSendingOtp(false);
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    setOtpError("");

    // Move to next input
    if (value !== "" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otpValues[index] === "" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otpValues.join("");
    if (code.length !== 6) {
      setOtpError("Invalid OTP. Please check and try again.");
      return;
    }

    setIsVerifying(true);
    setOtpError("");

    try {
      // Setup Simulation for testing: any 6 digit code or exactly "123456"
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (code === "123456" || code.length === 6) {
        // Success -> Create user document
        await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.userCollectionId,
          userId,
          {
            fullName: name,
            email: email,
            phone: phone,
            pincode: pincode,
            village: village,
            role: "renter", // Default role
            fieldArea: 0,
            address: village // Using village as fallback address since not collected
          }
        );

        // Name might have been updated during the profile step
        if (name !== (await account.get()).name) {
             await account.updateName(name);
        }

        // Successfully created user context, move to profile selection
        window.location.href = "/profile-selection";
      } else {
        setOtpError("Invalid OTP. Please check and try again.");
      }
    } catch {
      setOtpError("Database error during verification. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
     return (
       <div className="bg-surface min-h-screen flex items-center justify-center">
         <div className="flex gap-1.5 p-6 animate-pulse">
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 rounded-full bg-primary animate-bounce"></div>
         </div>
       </div>
     );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col overflow-x-hidden relative">
      <Header />

      <main className="flex-grow pt-28 pb-12 relative flex items-center justify-center">
        {/* Background Imagery */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-surface to-surface-container/50 opacity-90"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="absolute top-0 right-0 w-1/2 h-full object-cover mix-blend-overlay opacity-20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV0-MxLuHs8OSUPnH54Falhov6x8BfedXlBEmENI0wLBPe6EVlktzQ0z2w1nE4PioD0L8F8jUy8ZJ-pQK41gpB3AkOJNaXtc-81oZ1t8ZxpgBJHHRjkOAO3XWl4XVwGpYYIET90NtSxBVyHHcrs3JGchhwRoROyJMerYL58P43R_DBmRLu7kCk3mU-HWJ2KCm7AmBKeHl_KTX1RxIUhI67svCJP4yzWF3IV4HKvz0LlVlZnuYaa6iR3ZWAjfMOicJ_gTPCNjzJhsD1" alt="Farm field"/>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="absolute bottom-0 left-0 w-1/3 h-1/2 object-cover mix-blend-overlay opacity-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP3FEFoz-OjxXibOfuhZu67-WdPubyWKjSsKZCuNYdgtpNugYWYPYPafs9Rld1oowCEIAakNZv7UDA-z6RCNS1cmW11xm4mYwvQFsQUwDAyOM1c2hxgZ6827qIXs5W9AKZ0dBkR9T1V6GT8kagkLKFRBQSO5Ovlm-Y0m3NEDqJIDUDQXHoSZHT-auS8UiHzf-Bb_UwzZbSPuOTtYKhooahn0SHJf1MuicT22XK2n27wx0Z-TTJ7X9IiR32cS97Lh2v0YRqXKm_gUmP" alt="Soil"/>
        </div>

        <div className="relative z-10 w-full max-w-xl px-4 py-8">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-slate-700/30 shadow-2xl overflow-hidden transition-all duration-500">
            <div className="p-8 md:p-12">
              
              {/* Heading Section */}
              <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container mb-6 shadow-inner">
                   <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>
                     {step === 1 ? 'contact_page' : 'vibration'}
                   </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight mb-2">
                  {step === 1 ? 'Complete your Profile' : 'Verify your mobile number'}
                </h1>
                <p className="text-xl font-medium text-primary/70 mb-4">
                  {step === 1 ? 'आपली माहिती पूर्ण करा' : 'आपल्या मोबाईल क्रमांकाची पडताळणी करा'}
                </p>
                
                {step === 2 && (
                  <div className="flex items-center justify-center gap-3 bg-surface-container/50 rounded-full py-2 px-4 w-fit mx-auto border border-outline-variant/30">
                    <span className="text-on-surface-variant font-semibold tracking-widest">+91-{phone.slice(0, 4)}-XXX-{phone.slice(7)}</span>
                    <button onClick={() => setStep(1)} className="text-secondary font-bold text-xs hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Edit Number
                    </button>
                  </div>
                )}
              </div>

              {/* Step 1: Details Details */}
              {step === 1 && (
                <div className="space-y-6">
                  {errors.submit && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold text-center border border-red-200">
                       {errors.submit}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="font-label text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                    <input 
                      className={`kk-input ${errors.name ? 'border-error ring-1 ring-error/20' : ''}`} 
                      placeholder="Enter your name" 
                      value={name} 
                      onChange={(e) => {setName(e.target.value); setErrors(prev => {const n = {...prev}; delete n.name; return n;})}}
                    />
                    {errors.name && <p className="text-error text-xs font-bold">{errors.name}</p>}
                  </div>

                  <div className="space-y-2 relative">
                    <label className="font-label text-sm font-semibold text-slate-700">Pin Code <span className="text-red-500">*</span></label>
                    <input 
                      className={`kk-input ${errors.pincode ? 'border-error ring-1 ring-error/20' : ''}`} 
                      placeholder="6 digit PIN code" 
                      value={pincode} 
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      maxLength={6}
                    />
                    {errors.pincode && <p className="text-error text-xs font-bold">{errors.pincode}</p>}
                    
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-[105%] left-0 w-full bg-white border border-outline-variant/30 rounded-xl shadow-lg z-50 max-h-40 overflow-y-auto">
                        {suggestions.map((o, i) => (
                          <div key={i} onClick={() => selectPincodeLocation(o)} className="p-3 hover:bg-emerald-50 cursor-pointer text-sm border-b last:border-b-0">
                            <strong>{o.Name}</strong>, {o.District}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="font-label text-sm font-semibold text-slate-700">Phone Number <span className="text-red-500">*</span></label>
                    <div className={`flex kk-input p-0 overflow-hidden items-center ${errors.phone ? 'border-error ring-1 ring-error/20' : ''}`}>
                      <span className="px-4 border-r border-outline-variant/30 bg-surface-container-lowest text-slate-500 font-bold">+91</span>
                      <input 
                        className="flex-grow border-none px-4 py-3 outline-none focus:ring-0 font-bold tracking-widest bg-transparent" 
                        maxLength={10} 
                        placeholder="10 digit mobile" 
                        value={phone} 
                        onChange={(e) => {setPhone(e.target.value.replace(/\D/g, '')); setErrors(prev => {const n = {...prev}; delete n.phone; return n;})}}
                      />
                    </div>
                    {errors.phone && <p className="text-error text-xs font-bold">{errors.phone}</p>}
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleRequestOtp} 
                      disabled={isSendingOtp}
                      className="w-full bg-[#143B2E] text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl shadow-primary-container/20 hover:bg-[#00251a] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {isSendingOtp ? (
                        <span className="animate-pulse">Sending OTP...</span>
                      ) : (
                        <>
                          <span>Send OTP / ओटीपी पाठवा</span>
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: OTP Input */}
              {step === 2 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div>
                    <div className="flex justify-between gap-2 md:gap-3 mb-8">
                      {otpValues.map((digit, index) => (
                        <input 
                          key={index}
                          ref={(el) => { otpInputRefs.current[index] = el }}
                          className={`w-12 h-14 md:w-16 md:h-20 text-center text-2xl font-bold rounded-2xl border-2 transition-all focus:ring-0 text-on-surface ${
                            otpError && !digit ? 'border-error bg-error-container/20 text-error focus:border-error' : 'border-outline-variant bg-surface-container-lowest focus:border-secondary'
                          }`}
                          maxLength={1} 
                          type="text" 
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        />
                      ))}
                    </div>
                    
                    {otpError && (
                      <div className="flex items-center gap-2 text-error text-sm font-medium animate-in slide-in-from-top-1 mb-6 px-1">
                        <span className="material-symbols-outlined text-base">error</span>
                        <span>{otpError}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <button 
                      onClick={handleVerifyOtp}
                      disabled={isVerifying || otpValues.includes("")}
                      className="w-full bg-[#143B2E] text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl shadow-primary-container/20 hover:bg-[#00251a] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {isVerifying ? (
                        <span className="animate-pulse">Verifying...</span>
                      ) : (
                        <>
                          <span>Verify and Continue / पडताळणी करा आणि पुढे जा</span>
                          <span className="material-symbols-outlined">check_circle</span>
                        </>
                      )}
                    </button>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
                      <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                        <span className="material-symbols-outlined text-lg">timer</span>
                        <span>Resend in: <span className="text-secondary font-bold">00:{resendTimer.toString().padStart(2, '0')}</span></span>
                      </div>
                      <button 
                        onClick={() => {
                          if (resendTimer === 0) {
                            handleRequestOtp();
                          }
                        }}
                        disabled={resendTimer > 0}
                        className={`font-bold transition-colors ${resendTimer > 0 ? 'text-on-surface-variant/40 cursor-not-allowed' : 'text-secondary cursor-pointer hover:underline'}`}
                      >
                         Resend OTP / पुन्हा ओटीपी पाठवा
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer Loader Simulation */}
            {isVerifying && (
              <div className="bg-surface-container-high/50 p-4 flex items-center justify-center gap-3 border-t border-outline-variant/20 animate-in fade-in">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 rounded-full bg-secondary animate-bounce"></div>
                </div>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Encrypting Connection</span>
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">verified_user</span>
              <span className="text-xs font-bold text-primary">Secure Gateway</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">encrypted</span>
              <span className="text-xs font-bold text-primary">256-bit SSL</span>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}
