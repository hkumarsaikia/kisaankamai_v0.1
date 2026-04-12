"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
=======
import { account, databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { DEMO_AUTH_CONFIG, getDemoLoginNote, isDemoRegistrationCredentials, startDemoSession } from "@/lib/demoAuth";
import { ID, OAuthProvider } from "appwrite";
import { auth } from "@/lib/firebase";
import { TEAM_REVIEW_CONFIG, isTeamReviewRegistration } from "@/lib/teamReview";
>>>>>>> 30ed3e1d4c9aed32cc903a3a18066a3681038ae1
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

export default function RegisterPage() {
  const sendOtpButtonId = "register-send-otp-button";
  const { langText } = useLanguage();
  const { user, loading } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const [isLocalhostOtpMode, setIsLocalhostOtpMode] = useState(false);
  const isDemoMode = DEMO_AUTH_CONFIG.enabled;

  useEffect(() => {
    if (!loading && user) {
      router.push("/owner-dashboard");
    }
  }, [user, loading, router]);

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
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  const isLocalOtpHost = () =>
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  const clearRecaptchaVerifier = () => {
    if (!recaptchaVerifierRef.current) {
      return;
    }

    try {
      recaptchaVerifierRef.current.clear();
    } catch {}

    recaptchaVerifierRef.current = null;
  };

  const resetOtpFlow = ({ clearError = true }: { clearError?: boolean } = {}) => {
    clearRecaptchaVerifier();
    setConfirmationResult(null);
    setOtpSent(false);
    setOtpVerified(false);
    setOtpCode("");
    setTimer(0);
    setIsTimerActive(false);

    if (clearError) {
      setOtpError("");
    }
  };

  const getFirebaseOtpErrorMessage = (error: { code?: string; message?: string }) => {
    const isLocalhostHost = isLocalOtpHost();

    switch (error.code) {
      case "auth/operation-not-allowed":
        return langText(
          "Phone OTP is not enabled in the gokisaan Firebase project.",
          "gokisaan Firebase प्रोजेक्टमध्ये फोन OTP सक्षम केलेले नाही."
        );
      case "auth/unauthorized-domain":
        return isLocalhostHost
          ? langText(
              "Localhost supports only Firebase test phone numbers. Use a test number configured in gokisaan Firebase Auth.",
              "localhost वर फक्त Firebase test phone numbers चालतात. gokisaan Firebase Auth मध्ये सेट केलेला test number वापरा."
            )
          : langText(
              "This domain is not authorized for Firebase phone OTP. Add it to the gokisaan Firebase Auth allowed domains.",
              "हा domain Firebase phone OTP साठी authorized नाही. तो gokisaan Firebase Auth allowed domains मध्ये जोडा."
            );
      case "auth/invalid-phone-number":
        return langText(
          "Enter a valid 10-digit Indian mobile number.",
          "वैध १०-अंकी भारतीय मोबाईल नंबर टाका."
        );
      case "auth/too-many-requests":
        return langText(
          "Too many OTP attempts. Please wait a little before trying again.",
          "खूप OTP प्रयत्न झाले. कृपया थोडा वेळ थांबा आणि पुन्हा प्रयत्न करा."
        );
      case "auth/captcha-check-failed":
        return langText(
          "Phone verification could not be completed. Please resend the OTP.",
          "फोन पडताळणी पूर्ण झाली नाही. कृपया OTP पुन्हा पाठवा."
        );
      case "auth/quota-exceeded":
        return langText(
          "Firebase OTP quota is currently exhausted. Please try again later.",
          "Firebase OTP quota सध्या संपले आहे. कृपया नंतर पुन्हा प्रयत्न करा."
        );
      case "auth/invalid-app-credential":
      case "auth/missing-app-credential":
        return langText(
          "App verification expired. Please send the OTP again.",
          "App verification ची मुदत संपली. कृपया OTP पुन्हा पाठवा."
        );
      default:
        return error.message || langText(
          "Failed to send OTP. Please try again.",
          "OTP पाठवण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा."
        );
    }
  };

  const createRecaptchaVerifier = () => {
    const isLocalhostHost = isLocalOtpHost();

    clearRecaptchaVerifier();
    auth.settings.appVerificationDisabledForTesting = isLocalhostHost;

    const verifier = new RecaptchaVerifier(auth, sendOtpButtonId, {
      size: "invisible",
      callback: () => {
        setOtpError("");
      },
      "expired-callback": () => {
        resetOtpFlow({ clearError: false });
        setOtpError(
          langText(
            "Verification expired. Please send the OTP again.",
            "पडताळणीची मुदत संपली. कृपया OTP पुन्हा पाठवा."
          )
        );
      }
    });

    recaptchaVerifierRef.current = verifier;
    return verifier;
  };

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

  useEffect(() => {
    setIsLocalhostOtpMode(isLocalOtpHost());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // Initialize reCAPTCHA once on mount — the container div is rendered
  // outside the form at the bottom of the page so React re-renders
  // never unmount it.
  useEffect(() => {
<<<<<<< HEAD
    if (typeof window === 'undefined') return;
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch { }
      window.recaptchaVerifier = undefined;
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {},
    });
=======
    return () => {
      clearRecaptchaVerifier();
    };
>>>>>>> 30ed3e1d4c9aed32cc903a3a18066a3681038ae1
  }, []);

  const selectPincodeLocation = (office: any) => {
    setPincode(office.Pincode);
    setShowSuggestions(false);
    setFormData(prev => ({
      ...prev,
      village: `${office.Name}, ${office.District}`
    }));
  };

  const redirectAuthenticatedUser = async () => {
    const authenticatedUser = await account.get();

    try {
      const profile = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.userCollectionId,
        authenticatedUser.$id
      );

      if (profile.role === "owner") {
        router.push("/owner-dashboard");
      } else if (profile.role === "renter") {
        router.push("/renter-dashboard");
      } else {
        router.push("/profile-selection");
      }
    } catch {
      router.push("/profile-selection");
    }
  };

  const sendOtp = async () => {
    if (isDemoMode) {
      setOtpError(
        langText(
          "OTP is disabled in demo mode. Use the shared demo credentials and submit the form.",
          "Demo mode मध्ये OTP बंद आहे. Shared demo credentials वापरून फॉर्म submit करा."
        )
      );
      return;
    }

    // 1. Enforce full validation before sending OTP
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = langText("Enter your full name.", "तुमचे पूर्ण नाव प्रविष्ट करा.");
    if (!formData.address.trim()) newErrors.address = langText("Enter your address.", "tumcha पत्ता प्रविष्ट करा.");
    if (!formData.village.trim()) newErrors.village = langText("Enter city/village.", "शहर/गाव प्रविष्ट करा.");
    if (pincode.length !== 6) newErrors.pincode = langText("Enter valid 6-digit pincode.", "वैध पिनकोड टाका.");
    if (!formData.fieldArea || parseFloat(formData.fieldArea) <= 0) newErrors.fieldArea = langText("Enter field area.", "शेती क्षेत्र टाका.");
    if (phone.length !== 10) newErrors.phone = langText("Enter 10-digit phone.", "१० अंकी फोन टाका.");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = document.getElementById(Object.keys(newErrors)[0]);
      if (firstErrorField) firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (isTimerActive) return;

    setIsSendingOtp(true);
    resetOtpFlow();
    try {
      const appVerifier = createRecaptchaVerifier();
      const confirmation = await signInWithPhoneNumber(auth, "+91" + phone, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setTimer(60);
      setIsTimerActive(true);
    } catch (err: any) {
<<<<<<< HEAD
      // Reset verifier on failure so Resend gets a clean instance
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch { }
        window.recaptchaVerifier = undefined;
      }
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
      setOtpError(err.message || "Failed to send OTP. Please check your number.");
=======
      console.error("Firebase OTP Error:", err);
      resetOtpFlow({ clearError: false });
      setOtpError(getFirebaseOtpErrorMessage(err));
>>>>>>> 30ed3e1d4c9aed32cc903a3a18066a3681038ae1
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (isDemoMode) {
      setOtpError(
        langText(
          "OTP verification is disabled in demo mode.",
          "Demo mode मध्ये OTP verification बंद आहे."
        )
      );
      return;
    }

    if (otpCode.length !== 6) {
      setOtpError(langText("Enter 6-digit code.", "६-अंकी कोड टाका."));
      return;
    }
    setIsVerifyingOtp(true);
    try {
      if (confirmationResult) {
         await confirmationResult.confirm(otpCode);
         setOtpVerified(true);
         setIsTimerActive(false);
         setTimer(0);
         setOtpError("");
      } else {
         throw new Error("No active session. Please resend OTP.");
      }
    } catch (err: any) {
      console.error("Firebase OTP Verify Error:", err);
      if (err?.code === "auth/invalid-verification-code") {
        setOtpError(langText("Invalid OTP. Please try again.", "अवैध OTP. कृपया पुन्हा प्रयत्न करा."));
      } else {
        resetOtpFlow({ clearError: false });
        setOtpError(err.message || langText("OTP verification failed. Please resend OTP.", "OTP पडताळणी अयशस्वी. कृपया OTP पुन्हा पाठवा."));
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    const nextPhone = value.replace(/\D/g, "").slice(0, 10);

    if (nextPhone !== phone && (otpSent || otpVerified || confirmationResult || otpCode)) {
      resetOtpFlow();
    }

    setPhone(nextPhone);

    if (errors.phone) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.phone;
        return next;
      });
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isDemoMode) {
      if (!isDemoRegistrationCredentials({ phone, email: formData.email, password: formData.password })) {
        setErrors({
          submit: langText(
            `Demo credentials only. Enter ${DEMO_AUTH_CONFIG.phone}, ${DEMO_AUTH_CONFIG.email}, and ${DEMO_AUTH_CONFIG.password}.`,
            `फक्त demo credentials वापरा. ${DEMO_AUTH_CONFIG.phone}, ${DEMO_AUTH_CONFIG.email}, आणि ${DEMO_AUTH_CONFIG.password} टाका.`
          )
        });
        return;
      }

      setErrors({});
      startDemoSession();
      window.location.href = "/profile-selection";
      return;
    }
    
    const newErrors: Record<string, string> = {};
    const isSharedTeamReviewRegistration = isTeamReviewRegistration({
      phone,
      email: formData.email,
      password: formData.password
    });

    if (!formData.fullName.trim()) newErrors.fullName = langText("Enter your full name.", "तुमचे पूर्ण नाव प्रविष्ट करा.");
    if (!formData.address.trim()) newErrors.address = langText("Enter your address.", "tumcha पत्ता प्रविष्ट करा.");
    if (!formData.village.trim()) newErrors.village = langText("Enter city/village.", "शहर/गाव प्रविष्ट करा.");
    if (pincode.length !== 6) newErrors.pincode = langText("Enter valid 6-digit pincode.", "वैध पिनकोड टाका.");
    if (!formData.fieldArea || parseFloat(formData.fieldArea) <= 0) newErrors.fieldArea = langText("Enter field area.", "शेती क्षेत्र टाका.");
    if (phone.length !== 10) newErrors.phone = langText("Enter 10-digit phone.", "१० अंकी फोन टाका.");
    if (!otpVerified && !isSharedTeamReviewRegistration) newErrors.phone = langText("Verify with OTP first.", "आधी OTP सत्यापित करा.");
    if (formData.password.length < 6) newErrors.password = langText("Min 6 characters.", "किमान ६ वर्ण.");

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const email = formData.email || `${phone}@kisankamai.com`;
      setIsPincodeLoading(true);
      try {
<<<<<<< HEAD
        // 1. Create Firebase Auth user
        const cred = await createUserWithEmailAndPassword(auth, email, formData.password);
        await updateProfile(cred.user, { displayName: formData.fullName });

        // 2. Save profile to Firestore
        await setDoc(doc(db, "users", cred.user.uid), {
          fullName: formData.fullName,
          email: email,
          phone: phone,
          address: formData.address,
          village: formData.village,
          pincode: pincode,
          fieldArea: parseFloat(formData.fieldArea),
          role: role,
          createdAt: new Date().toISOString(),
        });
=======
        if (isSharedTeamReviewRegistration && TEAM_REVIEW_CONFIG.enabled) {
          try {
            await account.createEmailPasswordSession(TEAM_REVIEW_CONFIG.email, TEAM_REVIEW_CONFIG.password);
          } catch (error: any) {
            const maybeMissingSharedAccount =
              error?.code === 401 ||
              error?.code === 404 ||
              /invalid credentials|user/i.test(error?.message || "");

            if (maybeMissingSharedAccount) {
              setErrors({
                submit: langText(
                  "Shared team review account is not ready yet. Add APPWRITE_API_KEY, run npm run bootstrap:test-user, then try again.",
                  "Shared team review account अजून तयार नाही. APPWRITE_API_KEY जोडा, npm run bootstrap:test-user चालवा, आणि पुन्हा प्रयत्न करा."
                )
              });
              return;
            }

            throw error;
          }

          await redirectAuthenticatedUser();
          return;
        }

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
>>>>>>> 30ed3e1d4c9aed32cc903a3a18066a3681038ae1
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

<<<<<<< HEAD
  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/profile-selection");
    } catch {
      setErrors({ submit: langText("Google sign-up failed.", "Google नोंदणी अयशस्वी.") });
    }
=======
  const handleGoogleRegister = () => {
    if (isDemoMode) {
      setErrors({
        submit: langText(
          "Google sign-up is disabled in demo mode. Use the shared demo credentials instead.",
          "Demo mode मध्ये Google sign-up बंद आहे. त्याऐवजी shared demo credentials वापरा."
        )
      });
      return;
    }

    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/verify-contact`,
      `${window.location.origin}/register`
    );
>>>>>>> 30ed3e1d4c9aed32cc903a3a18066a3681038ae1
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col relative overflow-x-hidden">
      <Header />
      
      <main className="flex-grow relative flex items-center justify-center pt-28 pb-12">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-primary/60 z-10 mix-blend-multiply"></div>
          <img alt="Farming background" className="w-full h-full object-cover object-center" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8i8TjLswgZrM-W8Hx2oyVVWIqQ6JW2cecAWf61lw9qYCLshtLmRIlAG2Xip2L_lyX4RXiOHxvusw0Uiy5191L6wOBfSBwk29Y2LGCmONpoJncEOlkuWp5vARqXzNDEsVxNTnddxJ70BAgihWTFwnAQ1b9BbLPId6Y1LDVxFN2srNNbSCGc0EBDw4UK7Yd7Q0ok1frvhuV4Pznx86kYPhhRbgNqiczhuydijYZa2FKiz3oWqmNjl2P57vS9HDDcUB_6j6-udVsWBuz"loading="lazy" decoding="async" />
        </div>
        
        <div className="relative z-20 w-full max-w-3xl mx-auto px-4 py-8">
          <div className="rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 text-emerald-800 dark:text-emerald-400">
               <span className="font-headline font-black text-2xl tracking-tight">Kisan Kamai</span>
            </div>
            
            <div className="p-8 sm:p-10 flex-grow">
              <div className="mb-8 text-center sm:text-left">
<<<<<<< HEAD
                <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-slate-50 mb-2 tracking-tight">{langText("Create account", "नवीन खाते तयार करा")}</h1>
                <p className="font-body text-slate-600 dark:text-slate-400 text-base">{langText("Simplify your farming journey", "तुमचा शेती प्रवास सोपा करा")}</p>
=======
                <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 mb-2 tracking-tight">{langText("Create account", "नवीन खाते तयार करा")}</h1>
                <p className="font-body text-slate-600 text-base">{langText("Simplify your farming journey", "तुमचा शेती प्रवास सोपा करा")}</p>
                {isDemoMode ? (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                    {langText(
                      `Demo mode is active. Enter ${DEMO_AUTH_CONFIG.phone}, ${DEMO_AUTH_CONFIG.email}, and ${DEMO_AUTH_CONFIG.password}. Extra profile fields and OTP are ignored.`,
                      `Demo mode सुरू आहे. ${DEMO_AUTH_CONFIG.phone}, ${DEMO_AUTH_CONFIG.email}, आणि ${DEMO_AUTH_CONFIG.password} टाका. बाकी profile fields आणि OTP दुर्लक्षित केले जातील.`
                    )}
                  </div>
                ) : null}
>>>>>>> 30ed3e1d4c9aed32cc903a3a18066a3681038ae1
              </div>
              
              <form className="space-y-6" onSubmit={handleRegister} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="fullName">{langText("Full Name", "पूर्ण नाव")}<span className="text-red-500 ml-1">*</span></label>
                    <input className={`kk-input ${errors.fullName ? 'border-red-400' : ''}`} id="fullName" name="name" autoComplete="name" placeholder="John Doe" type="text" value={formData.fullName} onChange={handleInputChange}/>
                    {errors.fullName && <p className="text-red-500 text-xs font-bold">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">{langText("Email (Optional)", "ईमेल (पर्यायी)")}</label>
                    <input className="kk-input" id="email" name="email" autoComplete="email" placeholder="email@example.com" type="email" value={formData.email} onChange={handleInputChange}/>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="address">{langText("Address", "पत्ता")}<span className="text-red-500 ml-1">*</span></label>
                  <input className={`kk-input ${errors.address ? 'border-red-400' : ''}`} id="address" name="street-address" autoComplete="street-address" placeholder="Street name" value={formData.address} onChange={handleInputChange}/>
                  {errors.address && <p className="text-red-500 text-xs font-bold">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="font-label text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="village">{langText("Village", "गाव")}<span className="text-red-500 ml-1">*</span></label>
                    <input className={`kk-input ${errors.village ? 'border-red-400' : ''}`} id="village" name="address-level2" autoComplete="address-level2" placeholder="Village" value={formData.village} onChange={handleInputChange}/>
                    {errors.village && <p className="text-red-500 text-xs font-bold">{errors.village}</p>}
                  </div>
                  
                  <div className="space-y-2 relative">
                    <label className="font-label text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="pincode">{langText("Pin Code", "पिन कोड")}<span className="text-red-500 ml-1">*</span></label>
                    <input className={`kk-input ${errors.pincode ? 'border-red-400' : ''}`} id="pincode" name="postal-code" autoComplete="postal-code" placeholder="6 digits" value={pincode} onChange={handlePincodeChange} maxLength={6}/>
                    {errors.pincode && <p className="text-red-500 text-xs font-bold">{errors.pincode}</p>}
                    
                    {!isPincodeLoading && showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-[105%] left-0 w-full bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-lg z-50 max-h-40 overflow-y-auto">
                        {suggestions.map((o, i) => (
                          <div key={i} onClick={() => selectPincodeLocation(o)} className="p-3 hover:bg-emerald-50 dark:hover:bg-slate-700 cursor-pointer text-sm border-b dark:border-slate-700 last:border-0 dark:text-slate-200">
                            <strong>{o.Name}</strong>, {o.District}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

<<<<<<< HEAD
                  <div className="space-y-2">
                    <label className="font-label text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="fieldArea">{langText("Acres", "एकर")}</label>
                    <input className={`kk-input ${errors.fieldArea ? 'border-red-400' : ''}`} id="fieldArea" name="fieldArea" autoComplete="off" type="number" step="0.5" placeholder="0" value={formData.fieldArea} onChange={handleInputChange}/>
                  </div>
=======
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-700">{langText("Acres", "एकर")}</label>
                  <input className={`kk-input ${errors.fieldArea ? 'border-red-400' : ''}`} id="fieldArea" type="number" step="0.5" placeholder="0" value={formData.fieldArea} onChange={handleInputChange}/>
                  {errors.fieldArea && <p className="text-red-500 text-xs font-bold">{errors.fieldArea}</p>}
                </div>
>>>>>>> 30ed3e1d4c9aed32cc903a3a18066a3681038ae1
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-label text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="phone">{langText("Phone Number", "फोन नंबर")}<span className="text-red-500 ml-1">*</span></label>
                    <div className="flex gap-2">
                      <div className={`flex flex-grow kk-input p-0 overflow-hidden items-center ${errors.phone ? 'border-red-400' : ''}`}>
<<<<<<< HEAD
                        <span className="px-3 border-r dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold">+91</span>
                        <input id="phone" name="tel" autoComplete="tel-national" className="flex-grow border-none px-4 py-3 outline-none focus:ring-0 font-bold tracking-widest bg-transparent dark:text-slate-100 dark:placeholder-slate-500" maxLength={10} placeholder="10 digits" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} disabled={otpVerified}/>
=======
                        <span className="px-3 border-r bg-slate-50 text-slate-500 font-bold">+91</span>
                        <input className="flex-grow border-none px-4 py-3 outline-none focus:ring-0 font-bold tracking-widest" maxLength={10} placeholder="10 digits" value={phone} onChange={(e) => handlePhoneChange(e.target.value)} disabled={otpVerified}/>
>>>>>>> 30ed3e1d4c9aed32cc903a3a18066a3681038ae1
                      </div>
                      {!isDemoMode && !otpVerified && (
                        <button id={sendOtpButtonId} type="button" onClick={sendOtp} disabled={isSendingOtp || phone.length !== 10 || isTimerActive} className="px-5 bg-secondary text-white font-black rounded-xl hover:bg-orange-800 disabled:opacity-50 transition-all min-w-[120px]">
                          {isSendingOtp ? "..." : isTimerActive ? `${timer}s` : otpSent ? langText("Resend", "पुन्हा") : langText("Send OTP", "OTP पाठवा")}
                        </button>
                      )}
<<<<<<< HEAD
                      {otpVerified && (
                        <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-4 rounded-xl font-bold border border-emerald-200 dark:border-emerald-800">
=======
                      {!isDemoMode && otpVerified && (
                        <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-4 rounded-xl font-bold border border-emerald-200">
>>>>>>> 30ed3e1d4c9aed32cc903a3a18066a3681038ae1
                          <span className="material-symbols-outlined text-sm">verified</span> Verified
                        </div>
                      )}
                      {isDemoMode && (
                        <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-4 rounded-xl font-bold border border-amber-200 whitespace-nowrap">
                          <span className="material-symbols-outlined text-sm">visibility</span> Demo
                        </div>
                      )}
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs font-bold">{errors.phone}</p>}
                    {isDemoMode ? (
                      <p className="text-[11px] font-bold text-slate-500 max-w-md">
                        {getDemoLoginNote()}
                      </p>
                    ) : isLocalhostOtpMode ? (
                      <p className="text-[11px] font-bold text-slate-500 max-w-md">
                        {langText(
                          "Localhost uses Firebase test phone numbers only. Add the number and 6-digit code in gokisaan Firebase Auth before testing.",
                          "localhost वर फक्त Firebase test phone numbers चालतात. test करण्यापूर्वी gokisaan Firebase Auth मध्ये नंबर आणि ६-अंकी code जोडा."
                        )}
                      </p>
                    ) : null}
                    {!isDemoMode && !otpSent && otpError && <p className="text-red-500 text-[11px] font-bold mt-1 max-w-sm">{otpError}</p>}
                  </div>

                  {!isDemoMode && otpSent && !otpVerified && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                      <div className="flex gap-2">
                        <div className="flex flex-grow kk-input p-0 overflow-hidden items-center">
                          <span className="px-3 border-r dark:border-slate-700 bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 font-bold flex items-center h-full">
                            <span className="material-symbols-outlined text-lg">shield</span>
                          </span>
                          <input id="otp" name="one-time-code" autoComplete="one-time-code" className="flex-grow w-full border-none bg-transparent dark:text-slate-100 dark:placeholder-slate-500 text-center tracking-[0.5em] font-black focus:ring-0" placeholder="000000" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}/>
                        </div>
                        <button type="button" onClick={verifyOtp} disabled={isVerifyingOtp} className="px-6 bg-emerald-700 text-white font-black rounded-xl hover:bg-emerald-800 dark:hover:bg-emerald-600 whitespace-nowrap transition-all shadow-md active:scale-95">
                           {isVerifyingOtp ? "..." : langText("Verify OTP", "OTP सत्यापित")}
                        </button>
                      </div>
                      {otpError && <p className="text-red-500 text-[11px] font-bold mt-2 text-center">{otpError}</p>}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-slate-700" htmlFor="password">{langText("Password", "पासवर्ड")}<span className="text-red-500 ml-1">*</span></label>
                  <input className={`kk-input ${errors.password ? 'border-red-400' : ''}`} id="password" name="new-password" autoComplete="new-password" type="password" placeholder="Create password" value={formData.password} onChange={handleInputChange}/>
                  {errors.password && <p className="text-red-500 text-xs font-bold">{errors.password}</p>}
                </div>

                {errors.submit && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {errors.submit}
                  </div>
                )}

                <button className="w-full py-4 bg-emerald-900 text-white text-base font-black rounded-xl shadow-lg hover:bg-emerald-950 transition-all uppercase tracking-widest" type="submit">
                  {isDemoMode ? langText("Start Demo Session", "Demo Session सुरू करा") : langText("Create Kisan Kamai Account", "खाते तयार करा")}
                </button>

<<<<<<< HEAD
                <div className="relative flex items-center gap-4 py-2">
                  <div className="flex-grow border-t dark:border-slate-700"></div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">OR</span>
                  <div className="flex-grow border-t dark:border-slate-700"></div>
                </div>

                <button type="button" onClick={handleGoogleRegister} className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold py-4 rounded-xl border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                  <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G"loading="lazy" decoding="async" />
                  <span>{langText("Sign up with Google", "Google सह नोंदणी करा")}</span>
                </button>
=======
                {!isDemoMode ? (
                  <>
                    <div className="relative flex items-center gap-4 py-2">
                      <div className="flex-grow border-t"></div>
                      <span className="text-xs font-bold text-slate-400">OR</span>
                      <div className="flex-grow border-t"></div>
                    </div>

                    <button type="button" onClick={handleGoogleRegister} className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-4 rounded-xl border hover:bg-slate-50 transition-all shadow-sm">
                      <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G"loading="lazy" decoding="async" />
                      <span>{langText("Sign up with Google", "Google सह नोंदणी करा")}</span>
                    </button>
                  </>
                ) : null}
>>>>>>> 30ed3e1d4c9aed32cc903a3a18066a3681038ae1
              </form>
            </div>

            
            <div className="bg-slate-50 dark:bg-slate-900/50 py-6 px-10 text-center border-t border-slate-200 dark:border-slate-800">
              <p className="font-body text-sm font-medium text-slate-600 dark:text-slate-400">
                {langText("Already have an account?", "आधीच खाते आहे?")}{" "}
                <Link className="font-black text-secondary hover:text-emerald-500 underline ml-1" href="/login">
                  {langText("Login", "लॉगिन करा")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 max-w-sm w-full mx-4 shadow-2xl text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl text-emerald-600 dark:text-emerald-400">check_circle</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">{langText("Account Created!", "खाते तयार झाले!")}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">{langText("Your Kisan Kamai account created successfully. Please login.", "तुमचे खाते यशस्वीरित्या तयार झाले आहे. कृपया लॉगिन करा.")}</p>
            <button onClick={() => router.push('/login')} className="w-full bg-emerald-900 dark:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-md">
                 {langText("Go to Login", "लॉगिनला जा")}
            </button>
          </div>
        </div>
      )}

      <div className="relative z-20">
        <Footer />
      </div>

      {/* reCAPTCHA container — must stay outside the form and never unmount */}
      <div id="recaptcha-container" style={{ position: 'fixed', bottom: 0, zIndex: -1 }}></div>
    </div>
  );
}
