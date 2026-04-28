"use client";

import { type FormEvent, useEffect, useState } from "react";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { loginAction } from "@/lib/actions/local-data";

const collageTiles = [
  {
    className: "col-span-5 row-span-6",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_pcRi7kqAR57jlutMIa12HOJnU_9q3iInzLHc0nMY9xx0b5IHaLNAEfa9Ssfgi2ns2LFedCH_oZcTOAr3Hfvi49ZsgiKvFE9b7hsmJ-kU9hlgHoNtuG53dODDCb-960DUnL5SL6rCrSYkv7MSIy34UsaMpXN4H988Cfb5j1fVBJq4O3EUSw0jEJiJzuU9LYyGSRONAlfc7gmgD7Dkq-CkaqP2nypiWlG7sptJGw8Q3r8QZEUjextFG4-WyM6ePMe37JC-WPqXCOaT",
  },
  {
    className: "col-span-7 row-span-4",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhG2qAkWx4YRhXVOwVwDIYnJ2RBDKYq_HG7rBOpDy1QQSyz7fI8lKhmuL3FMrqynLMDJ2aa4ONVz1shtrpSJAtie3PKzMRkXgxzXQtHvF2eSLU3p4RnOZCimoEnM2Nv_OWCbLSJRkVg98m5_TBKWo4BAHhYbxq7slGwVHoTa8rqa624Exf6JR35BfwO40PhaM1uD380Q2YVPpfVfFaj0igWCOBH1uplA_lc_w2PROYG-je7zbBYEE1-VvBi8FzPMY4kQKMpIbIU5oU",
  },
  {
    className: "col-span-3 row-span-6",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCPliM4zCgbkjzQ2PDyIhXJwYKu22V0x4kvFCJAcrVqvQIcHCEGeR7sjRINQFuD1afhsbWHP6UZaJCmfaFKynXLXeG7Yf5pOCOp6PwpDoeWkslI4_K_9xIHgmJGuxqlDo-rb87ttAlnAJ880r8xlV6gLEpsGteEQrCxDfo9Hpv4oFn9rHYa64feiASJfRTCgDICpKJ3PVimJEzWY6N228FSnBVauwYL5Xor6gJdmgShSrpjOU4E_00GI-8QP0dh28HZuzYIRMZLiw1N",
  },
  {
    className: "col-span-7 row-span-4",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBV7vj9X1VdEt0syXe9h5Qf0sy6c2TGocRc-QhKPdTAuOQzpeUj4xVbzvJzY9G9-zrVOImIQpJldku8HV8VxgpWEmFycmIN_RVpxRuvbWxflff1hXDlXotZsThAYVSli1lFHlS6R5GJGjylaDjJmmpv5OZmXv0M4faKaMgTrcNCf0x-M30vmreHm_dh9b2uuUwEn-D9VPmaryJRERtdh5PmkksU7tSysfFQt6nNOYeORzev5raE0rA_-vPKNit7Gi_8RRT7PiFNOiDW",
  },
  {
    className: "col-span-4 row-span-4",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDH660fQmy5SHxapGGMyLHpABbs4WzGa0l-t8LHgTD8qbYMgcsoH1w1mvgwSN11XmYT1RjtbToWZhEG3TIRC_R9P8_IGZU0HleM79DHh42vmnPudSGNOCTG-qzWdRvAmAOwogVg-YgNwLdhqwXgWbrF4sNC0DPi4A7zZcyb8vXdmAdGNiQgajwSQHXdgyrVfYTF9m6J06lRM6tCRuILUTuAO6fIi_YzMP_hvGKPdIIUonfAfDMXhZZv38YrVAGiELz_ltCRxBfCQ7tz",
  },
  {
    className: "col-span-3 row-span-4",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_pcRi7kqAR57jlutMIa12HOJnU_9q3iInzLHc0nMY9xx0b5IHaLNAEfa9Ssfgi2ns2LFedCH_oZcTOAr3Hfvi49ZsgiKvFE9b7hsmJ-kU9hlgHoNtuG53dODDCb-960DUnL5SL6rCrSYkv7MSIy34UsaMpXN4H988Cfb5j1fVBJq4O3EUSw0jEJiJzuU9LYyGSRONAlfc7gmgD7Dkq-CkaqP2nypiWlG7sptJGw8Q3r8QZEUjextFG4-WyM6ePMe37JC-WPqXCOaT",
  },
  {
    className: "col-span-2 row-span-6",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhG2qAkWx4YRhXVOwVwDIYnJ2RBDKYq_HG7rBOpDy1QQSyz7fI8lKhmuL3FMrqynLMDJ2aa4ONVz1shtrpSJAtie3PKzMRkXgxzXQtHvF2eSLU3p4RnOZCimoEnM2Nv_OWCbLSJRkVg98m5_TBKWo4BAHhYbxq7slGwVHoTa8rqa624Exf6JR35BfwO40PhaM1uD380Q2YVPpfVfFaj0igWCOBH1uplA_lc_w2PROYG-je7zbBYEE1-VvBi8FzPMY4kQKMpIbIU5oU",
  },
];

export default function LoginPage() {
  const { langText } = useLanguage();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPleaseLogin, setShowPleaseLogin] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("pleaseLogin") !== "1") {
      return;
    }

    setShowPleaseLogin(true);
    const timer = window.setTimeout(() => setShowPleaseLogin(false), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await loginAction({ phone, password });
      if (!result.ok) {
        setError(result.error || langText("Login failed.", "लॉगिन अयशस्वी झाले."));
        return;
      }

      window.location.href = result.redirectTo || "/profile-selection";
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : langText("Login failed.", "लॉगिन अयशस्वी झाले."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="kk-auth-page">
      {showPleaseLogin ? (
        <div className="fixed left-1/2 top-28 z-50 -translate-x-1/2 rounded-full bg-primary-container px-5 py-3 text-sm font-bold text-white shadow-2xl transition-opacity">
          {langText("Please login", "कृपया लॉगिन करा")}
        </div>
      ) : null}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 bg-primary">
        {collageTiles.slice(0, 4).map((tile) => (
          <div
            key={tile.image + tile.className}
            className="relative min-h-0 min-w-0"
            style={{
              backgroundImage: `url(${tile.image})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              filter: "brightness(0.85)",
            }}
          />
        ))}
        <div className="kk-dark-image-overlay" />
      </div>

      <main className="relative z-10 flex min-h-[calc(100svh-5rem)] items-center justify-center px-6 pb-12 pt-28 sm:pb-16">
        <div className="kk-auth-card w-full max-w-[540px] overflow-hidden p-8 md:p-14">
          <div className="space-y-10">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-container/10 ring-1 ring-primary-container/20">
                <span
                  className="material-symbols-outlined text-5xl text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  agriculture
                </span>
              </div>
              <div className="space-y-1">
                <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-background">
                  {langText("Welcome to Kisan Kamai", "किसान कमाईमध्ये स्वागत आहे")}
                </h1>
                <p className="font-headline text-sm font-bold text-on-surface-variant">
                  {langText("Sign in to your account", "आपल्या खात्यात साइन इन करा")}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <label
                    className="ml-1 text-[12px] font-bold uppercase tracking-[0.15em] text-outline"
                    htmlFor="phone"
                  >
                    {langText("Mobile number", "मोबाईल नंबर")}
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-outline transition-colors group-focus-within:text-primary">
                      call
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value);
                        setError("");
                      }}
                      placeholder="+91 90000 00000"
                      className="kk-auth-input py-5 pl-14 pr-5"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="ml-1 flex items-center justify-between">
                    <label
                      className="text-[12px] font-bold uppercase tracking-[0.15em] text-outline"
                      htmlFor="password"
                    >
                      {langText("Password", "पासवर्ड")}
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-bold uppercase tracking-widest text-secondary transition-colors hover:text-primary"
                    >
                      {langText("Forgot password?", "पासवर्ड विसरलात?")}
                    </Link>
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-outline transition-colors group-focus-within:text-primary">
                      lock
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="••••••••"
                      className="kk-auth-input py-5 pl-14 pr-14"
                      disabled={isSubmitting}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-primary"
                      aria-label={langText("Toggle password visibility", "पासवर्ड दृश्यमानता बदला")}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {error ? <p className="text-sm font-semibold text-error">{error}</p> : null}

                <div className="space-y-8 pt-4 text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-container py-5 text-lg font-bold text-white shadow-[0_12px_24px_-8px_rgba(20,59,46,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_32px_-12px_rgba(20,59,46,0.6)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    <span>
                      {isSubmitting
                        ? langText("Please wait...", "कृपया प्रतीक्षा करा...")
                        : langText("Login to Kisan Kamai", "किसान कमाईमध्ये लॉगिन करा")}
                    </span>
                    <span className="material-symbols-outlined text-2xl transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </button>

                  <p className="text-sm font-semibold text-on-surface-variant">
                    {langText("New to Kisan Kamai?", "किसान कमाईमध्ये नवीन आहात?")}{" "}
                    <Link href="/register" className="font-extrabold text-primary hover:underline">
                      {langText("Create Account", "खाते तयार करा")}
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
