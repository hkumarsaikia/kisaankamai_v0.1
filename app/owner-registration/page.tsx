import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/server/local-auth";

const previewImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDkU1MDeqjUKzld2Xll9nkvPbvF0gMqRaji9Gm7O3jaoKRJtWk3XHh63cCoKryTrkdH-hxl07dCiVnZzYhS2ZGgAQ_vxTq4Jl9PWQPPkr6QTtNMyT7uy-v7ry0HNPBRWnX0bz1IiJeGDQ84XeK7OWe9fEQXY3oHJfm1bhvzRkoV36Ge5w6fbxAzr8wmMjmdu6-nhXRNsSxP8l0BTo8e-5nNVLXK45smzYtLK57qRlrwZdtQzGlyvMWmmlx6V1Tgvd5bhzpXvXvppKmk";

const steps = [
  ["info", "Basic Info"],
  ["image", "Images"],
  ["payments", "Pricing"],
  ["location_on", "Location"],
  ["person", "Operator"],
] as const;

export default async function OwnerRegistrationPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/profile-selection");
  }

  return (
    <div className="bg-surface font-body text-on-surface pt-28 pb-24">
      <main className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-primary mb-2">List Your Equipment</h1>
          <p className="text-on-surface-variant mb-8">आपले उपकरण भाड्याने देण्यासाठी नोंदणी करा</p>
          <div className="flex items-center justify-between border-b border-outline-variant overflow-x-auto whitespace-nowrap">
            {steps.map(([icon, label], index) => (
              <div key={label} className={`px-4 pb-4 flex items-center gap-2 ${index === 0 ? "text-primary font-bold border-b-2 border-primary" : "text-outline border-b-2 border-transparent"}`}>
                <span className="material-symbols-outlined text-lg">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-surface-container-lowest p-8 rounded-xl border border-surface-container-highest shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">agriculture</span>
                Equipment Details / उपकरणाची माहिती
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-on-surface-variant">Equipment Type / उपकरणाचा प्रकार</label>
                  <select className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all">
                    <option>Select Type</option>
                    <option>Tractor (ट्रॅक्टर)</option>
                    <option>Harvester (कापणी यंत्र)</option>
                    <option>Rotavator (रोटाव्हेटर)</option>
                    <option>Seeder (पेरणी यंत्र)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-on-surface-variant">Brand / मेक</label>
                  <input className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. John Deere" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-on-surface-variant">Model &amp; Year / मॉडेल आणि वर्ष</label>
                  <input className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. 5050E, 2022" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-on-surface-variant">Horsepower / अश्वशक्ती (HP)</label>
                  <input className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. 45" type="number" />
                </div>
              </div>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-xl border border-surface-container-highest shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">add_a_photo</span>
                Photos / फोटो
              </h2>
              <p className="text-sm text-on-surface-variant mb-6">Upload clear photos of your equipment for better visibility.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="aspect-square border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center bg-surface-container-low cursor-default">
                  <span className="material-symbols-outlined text-3xl text-outline mb-2">upload</span>
                  <span className="text-xs font-bold text-on-surface-variant">Add Cover</span>
                </div>
                <div className="relative group aspect-square rounded-xl overflow-hidden shadow-sm">
                  <Image alt="Equipment preview" src={previewImage} fill className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center bg-surface-container-low cursor-not-allowed">
                  <span className="material-symbols-outlined text-outline/50">image</span>
                </div>
                <div className="aspect-square border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center bg-surface-container-low cursor-not-allowed">
                  <span className="material-symbols-outlined text-outline/50">image</span>
                </div>
              </div>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-xl border border-surface-container-highest shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">currency_rupee</span>
                Pricing &amp; Billing / किंमत आणि बिलिंग
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-on-surface-variant">Rate per Hour / प्रति तास दर</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">₹</span>
                    <input className="w-full pl-10 p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" placeholder="800" type="number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-on-surface-variant">Rate per Acre / प्रति एकर दर (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">₹</span>
                    <input className="w-full pl-10 p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary" placeholder="1200" type="number" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-surface-container-highest bg-white shadow-xl">
              <div className="relative aspect-[4/3]">
                <Image src={previewImage} alt="Equipment listing preview" fill className="object-cover" />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur">
                  Live Preview
                </div>
              </div>
              <div className="p-6">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-secondary">Tractor</p>
                    <h3 className="text-xl font-extrabold text-primary">Mahindra 575 DI</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-primary">₹850</p>
                    <p className="text-[10px] font-bold text-on-surface-variant">PER HOUR</p>
                  </div>
                </div>
                <div className="mb-6 flex flex-wrap gap-2">
                  {["45 HP", "Power Steering", "2022 Model"].map((tag) => (
                    <span key={tag} className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 border-t border-surface-container-highest pt-4">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full bg-surface-container-high">
                    <Image src={previewImage} alt="Verified owner avatar" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">{session.profile.fullName || session.user.name || "Verified Owner"}</p>
                    <p className="text-[10px] text-on-surface-variant">Verified Owner • {session.profile.village || "Maharashtra"}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-secondary-container/20 bg-secondary-fixed/30 p-6">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-on-secondary-fixed-variant">
                <span className="material-symbols-outlined text-lg">verified_user</span>
                Trust Policy
              </h4>
              <p className="text-xs leading-relaxed text-on-secondary-fixed-variant/80">
                Your listing will be reviewed within 24 hours. Ensure all information is accurate to avoid rejection.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
