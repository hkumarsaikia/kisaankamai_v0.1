"use client";

import { AppLink as Link } from "@/components/AppLink";

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col">
      <main className="relative flex-grow overflow-hidden pt-24">
        <div className="absolute inset-0">
          <img
            alt="Maharashtra agriculture background"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4vyr0eKi7GwjW9M6qdVc6FHTdXKJxnwx5pJzFI8yGT825tmztPjn58g_Bu-UZqdfEiq_muVE8_g5CJHt9yxPMfftaL2lHDKI0hxAeB73DIAv-afKQBGNjbR1_EjQ__XuL3X-nz75VK0iAq2HdMRSDdzb9cjX-s1GFD5OTtoAe2oG3Rg0zsXKLYlAElgqupC0gMBMOUpgh9sO1nsPXp2cZ34qSExKzD3po9cJpa0-QY_i1IqXDGZreG7rjO00bTyuJya3bbsd_QK7d"
          />
          <div className="absolute inset-0 bg-primary/45 backdrop-blur-[2px]" />
        </div>

        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-3xl items-center px-4 py-12">
          <div className="w-full rounded-[2rem] border border-white/20 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-xl md:p-12">
            <div className="mb-8 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary-container/20 bg-primary-container/10">
                <span className="material-symbols-outlined text-6xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="font-headline text-3xl font-extrabold leading-tight tracking-tight text-primary md:text-4xl">
                Account Created Successfully
                <span className="mt-2 block text-2xl font-bold md:text-3xl">खाते यशस्वीरित्या तयार केले</span>
              </h1>
              <div className="mx-auto my-6 h-px w-24 bg-secondary-container/30" />
              <p className="mx-auto max-w-lg text-sm font-medium leading-relaxed text-on-surface-variant md:text-base">
                Welcome to the community! Your account is now ready. Please log in to continue.
                <span className="mt-2 block font-semibold">समुदायामध्ये तुमचे स्वागत आहे! तुमचे खाते आता तयार आहे. पुढे जाण्यासाठी कृपया लॉगिन करा.</span>
              </p>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <Link
                href="/login"
                className="flex min-w-[240px] items-center justify-center gap-3 rounded-xl bg-primary-container px-8 py-4 font-bold text-on-primary-container shadow-lg transition-all hover:bg-primary"
              >
                <span className="font-headline tracking-wide">Login / लॉगिन करा</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link href="/" className="text-sm font-semibold text-primary-container underline-offset-4 transition-all hover:underline">
                Back to Homepage / मुख्यपृष्ठावर परत जा
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
