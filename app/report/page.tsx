import { ContentImage } from "@/components/ContentImage";

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-background font-body text-on-background antialiased">
      <main className="pt-20">
        <section className="relative flex h-[400px] items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <ContentImage
              alt="Report a Problem"
              className="h-full w-full object-cover"
              data-alt="cinematic wide shot of a green tractor in a sprawling maharashtra farm at dawn with soft morning mist and golden sunlight"
              decoding="async"
              loading="lazy"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDprln7ei_-7KiHHUMhRaq3RPbGYAStHFc9k345CkGiggTfvSAe7LHkNV9H2R-yzCcb2F954B6sVfFlEyjr86aTHMksY7Pdl50EXBcMK0neZWBEFqJNEUHbanR1INlv_4BwH7QgTimp3zJS2d9oIeOrzhMu-EZxJeLof62W-9oekBbcMO53eyXg9J-WzmmncPNcu6fN3TeC1NbGqiDsyh6mQm8xeQ5ZmGwUISUiWEU1AQi7y-xWajGQWxA2QrOZp3ahSmQVe_1_HO5R"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container/90 via-primary-container/60 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 text-white">
            <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-6xl">
              Report a Problem <br />
              <span className="text-on-primary-container">समस्या रिपोर्ट करा</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg font-medium text-slate-200 md:text-xl">
              Tell us what went wrong. Our team is committed to resolving your concerns promptly in English and Marathi.
            </p>
          </div>
        </section>

        <section className="bg-surface py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-3xl font-bold text-primary-container">What happened? / काय झाले?</h2>
              <p className="font-medium text-slate-500">Select a category to start your report</p>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                ["info", "Wrong Equipment Details", "चुकीचे तपशील", ""],
                ["event_busy", "Booking Problem", "बुकिंग समस्या", ""],
                ["payments", "Payment Issue", "पेमेंट समस्या", ""],
                ["report_problem", "Safety Concern", "सुरक्षा चिंता", "text-error"],
              ].map(([icon, title, subtitle, iconClass]) => (
                <button
                  key={title}
                  className="group rounded-2xl border border-outline-variant bg-white p-6 text-left transition-all hover:border-primary-container hover:shadow-xl"
                  type="button"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-low transition-colors group-hover:bg-primary-container group-hover:text-white">
                    <span className={`material-symbols-outlined text-2xl ${iconClass}`}>{icon}</span>
                  </div>
                  <h3 className="font-bold text-primary-container">{title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-primary-container">Full Name / पूर्ण नाव</label>
                  <input className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary-container" placeholder="Enter your name" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-primary-container">Mobile Number / मोबाईल नंबर</label>
                  <input className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary-container" placeholder="+91 00000 00000" type="tel" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-primary-container">I am a / मी आहे</label>
                  <select className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary-container">
                    <option>Renter / भाडेकरी</option>
                    <option>Owner / मालक</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-primary-container">District / जिल्हा</label>
                  <select className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary-container">
                    <option>Pune</option>
                    <option>Nashik</option>
                    <option>Satara</option>
                    <option>Ahmednagar</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-primary-container">Booking ID / बुकिंग आयडी (Optional)</label>
                  <input className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary-container" placeholder="e.g. KK-45892" type="text" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-primary-container">Problem Title / विषयाची हेडलाईन</label>
                  <input className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary-container" placeholder="Briefly describe the issue" type="text" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-primary-container">Description / वर्णन</label>
                  <textarea className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 focus:ring-2 focus:ring-primary-container" placeholder="Tell us exactly what happened..." rows={5} />
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-primary-container">Urgency Level / निकडीची पातळी</label>
                  <div className="flex flex-wrap gap-3">
                    <button className="rounded-full border-2 border-slate-200 px-6 py-2 font-bold text-slate-500 transition-all hover:border-on-tertiary-container hover:text-on-tertiary-container" type="button">
                      Low
                    </button>
                    <button className="rounded-full border-2 border-slate-200 px-6 py-2 font-bold text-slate-500 transition-all hover:border-on-tertiary-container hover:text-on-tertiary-container" type="button">
                      Medium
                    </button>
                    <button className="rounded-full border-2 border-error bg-error/5 px-6 py-2 font-bold text-error" type="button">
                      High / Urgent
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-primary-container">Upload Proof / पुरावा अपलोड करा</label>
                  <div className="group cursor-pointer rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-lowest p-8 text-center transition-colors hover:border-primary-container">
                    <span className="material-symbols-outlined text-4xl text-slate-400 transition-colors group-hover:text-primary-container">
                      cloud_upload
                    </span>
                    <p className="mt-2 font-semibold text-slate-600">Drop files or click to upload</p>
                    <p className="mt-1 text-xs text-slate-400">PNG, JPG or PDF up to 5MB</p>
                  </div>
                </div>
              </div>

              <button className="w-full rounded-xl bg-primary-container py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.01] hover:shadow-primary-container/20 active:scale-95" type="button">
                Submit Report / रिपोर्ट सबमिट करा
              </button>
            </div>

            <div className="space-y-6">
              <div className="sticky top-28 rounded-3xl border border-secondary-container/20 bg-secondary-fixed/30 p-8">
                <h4 className="mb-4 font-bold text-on-secondary-fixed">Direct Support</h4>
                <div className="flex items-center gap-3 rounded-2xl bg-white/50 p-4">
                  <span className="material-symbols-outlined text-on-tertiary-container">support_agent</span>
                  <div>
                    <p className="text-sm font-bold text-primary-container">+91 1800-KISAN-HELP</p>
                    <p className="text-xs text-slate-500">9 AM - 7 PM, Mon-Sat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="fixed inset-0 z-[100] hidden items-center justify-center bg-primary-container/60 backdrop-blur-sm">
          <div className="mx-6 w-full max-w-lg rounded-[2.5rem] bg-white p-12 text-center shadow-2xl">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary-fixed">
              <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-container">Report Submitted!</h2>
            <p className="mb-10 font-medium text-slate-600">
              Your concern (Reference: #KK-29381) has been successfully logged. Our team will contact you within 24 hours.
            </p>
            <button className="w-full rounded-xl bg-primary-container py-4 text-lg font-bold text-white shadow-lg transition-all hover:opacity-90" type="button">
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
