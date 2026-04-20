"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useAuth } from "@/components/AuthContext";
import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { localizedText } from "@/lib/i18n";

export default function ListEquipmentPage() {
  const { user } = useAuth();

  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="add-listing"
      title={localizedText("Add New Listing", "नवीन लिस्टिंग जोडा")}
      subtitle={localizedText(
        "Use the guided listing flow and keep the live preview visible while you scroll.",
        "मार्गदर्शित लिस्टिंग फ्लो वापरा आणि स्क्रोल करताना लाइव्ह पूर्वावलोकन दिसत राहू द्या."
      )}
    >
      <div className="font-body text-on-surface antialiased">
        <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-6 lg:px-10 lg:py-8">
          <div>
            <h1 className="font-headline text-3xl font-extrabold text-primary md:text-4xl">List New Equipment</h1>
            <p className="mt-2 text-sm text-on-surface-variant">नवीन उपकरण जोडा</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-on-surface">
                  <span className="material-symbols-outlined text-secondary">info</span>
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block font-label text-sm font-medium text-on-surface-variant">Equipment Type *</label>
                    <select className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary">
                      <option>Select Type</option>
                      <option>Tractor</option>
                      <option>Harvester</option>
                      <option>Rotavator</option>
                      <option>Seeder</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label text-sm font-medium text-on-surface-variant">Brand / Manufacturer *</label>
                    <input className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary" placeholder="e.g. Mahindra, Swaraj" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label text-sm font-medium text-on-surface-variant">Model Name</label>
                    <input className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary" placeholder="e.g. 575 DI" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label text-sm font-medium text-on-surface-variant">HP / Capacity *</label>
                    <input className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary" placeholder="e.g. 45 HP" type="text" />
                    <p className="mt-1 text-xs text-on-surface-variant">Accurate HP/Capacity helps renters find the right equipment.</p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-on-surface">
                  <span className="material-symbols-outlined text-secondary">payments</span>
                  Pricing
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block font-label text-sm font-medium text-on-surface-variant">Hourly Rate (₹) *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">₹</span>
                      <input className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 pl-8 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary" placeholder="0.00" type="number" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label text-sm font-medium text-on-surface-variant">Minimum Hours *</label>
                    <input className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary" placeholder="e.g. 2" type="number" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-outline-variant/50 p-4 transition-colors hover:bg-surface-container-low">
                      <input className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                      <div>
                        <span className="block text-sm font-medium text-on-surface">Includes Driver/Operator</span>
                        <span className="block text-xs text-on-surface-variant">Check this if the rate includes an operator.</span>
                      </div>
                    </label>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-on-surface">
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  Location &amp; Service Area
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block font-label text-sm font-medium text-on-surface-variant">Base Village/Town *</label>
                      <input className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary" placeholder="Enter base location" type="text" />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-label text-sm font-medium text-on-surface-variant">Service Radius (km) *</label>
                      <input className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-sm focus:border-primary focus:ring-primary" placeholder="e.g. 15" type="number" />
                      <p className="mt-1 text-xs text-on-surface-variant">Maximum distance you are willing to travel.</p>
                    </div>
                  </div>
                  <div className="relative mt-6 h-48 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-high">
                    <img
                      className="h-full w-full object-cover grayscale opacity-50"
                      alt="Satara district map"
                      data-alt="Stylized map showing Satara district topography with markers for agriculture hubs and clean vector lines"
                      data-location="Satara, India"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE2XpOUK9ws4B1N6CsCWTe7S7UDqF8-gogrPFqOKFs_Lfe3KJhjTiiEr7JfQZsoWfGgMKUDSvQLDF533vqWJQrrctAM5ZqtLS_3nrqQVsB2AwwqagakQnPoPIWWlcf2h5qDg8UC3RWc6gqaPzlARv3Edd2a6a77ZL_rDbnQqjKiHD0d5e8591pumrwm_CEdlSy_OAHK-nduKvdRoDD9qBgCqRZhpWGCbIm0y3At9LEpOdDOiwUCKU8tPnYaLSJW_Ji3WHvJB_Mrl9G"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full border-2 border-primary bg-primary/20 p-8 animate-pulse" />
                      <div className="absolute flex items-center gap-2 rounded-full border border-primary bg-surface-container-lowest px-3 py-1.5 shadow-lg">
                        <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                          location_on
                        </span>
                        <span className="text-xs font-bold text-primary">Karad, Satara</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-on-surface">
                  <span className="material-symbols-outlined text-secondary">calendar_month</span>
                  Availability
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input defaultChecked className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary" name="availability" type="radio" />
                    <span className="text-sm font-medium text-on-surface">Available Now</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary" name="availability" type="radio" />
                    <span className="text-sm font-medium text-on-surface">Available from specific date</span>
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-on-surface">
                  <span className="material-symbols-outlined text-secondary">photo_camera</span>
                  Photos
                </h2>
                <div className="cursor-pointer rounded-xl border-2 border-dashed border-outline-variant/50 p-10 text-center transition-colors hover:bg-surface-container-low">
                  <span className="material-symbols-outlined mb-2 text-4xl text-outline">upload_file</span>
                  <p className="font-body font-medium text-on-surface">Click to upload or drag and drop</p>
                  <p className="mt-1 text-sm text-on-surface-variant">Upload at least 3 clear photos of your equipment.</p>
                </div>
              </section>

              <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-end">
                <Link href={user ? "/profile-selection" : "/register"} className="w-full rounded-lg border border-outline px-6 py-3 text-center font-label font-medium text-on-surface-variant transition-colors hover:bg-surface-variant sm:w-auto">
                  Cancel
                </Link>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-label font-medium text-on-primary shadow-sm transition-colors hover:bg-primary-container sm:w-auto" type="submit">
                  Publish Listing
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6 self-start">
                <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-xl">
                  <div className="relative aspect-[4/3]">
                    <img
                      className="h-full w-full object-cover"
                      alt="Powerful blue tractor preview"
                      data-alt="Powerful blue tractor with large tires parked in a lush green field under a clear blue sky"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEqtpz50nGqO5PXychK55yTwvYxHnpQvgY7YdcTK_wZJDASU4EzqAKbR_qU1-7K49zffPeSVaKRx51vhC2xAOLDAPxhBECAYCYwXuhLqq8feYZMidBF4zldokMW10bkfDS4AmZSYQaZwopI95ndz-ri-flHU9u0oUlCA7hzuFWDGAiIHsB9qRF1M_3o5Hl7gIBGneiGkMwoh-xF0Y40IaAEMh8td4aOpML_HiSUFoGTdyAiRDaQ7EPhBf1NLQ8EB5bcwlrgIImNmb7"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-surface-container-lowest/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur font-label">
                      Live Preview
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-secondary font-label">Tractor</p>
                        <h3 className="font-headline text-xl font-extrabold text-primary">Mahindra 575 DI</h3>
                      </div>
                      <div className="text-right">
                        <p className="font-headline text-lg font-black text-primary">₹850</p>
                        <p className="text-[10px] font-bold text-on-surface-variant font-label">PER HOUR</p>
                      </div>
                    </div>
                    <div className="mb-6 flex flex-wrap gap-2">
                      <span className="rounded bg-primary-fixed/50 px-2 py-1 text-[10px] font-bold text-on-primary-fixed font-label">45 HP</span>
                      <span className="rounded bg-primary-fixed/50 px-2 py-1 text-[10px] font-bold text-on-primary-fixed font-label">Power Steering</span>
                      <span className="rounded bg-primary-fixed/50 px-2 py-1 text-[10px] font-bold text-on-primary-fixed font-label">2022 Model</span>
                    </div>
                    <div className="flex items-center gap-3 border-t border-outline-variant/30 pt-4">
                      <div className="h-8 w-8 overflow-hidden rounded-full bg-surface-container-high">
                        <img
                          className="h-full w-full object-cover"
                          alt="Portrait of the owner"
                          data-alt="Portrait of a smiling Indian farmer in a white shirt with a green landscape in the background"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwok2EnfZT5USD1LJz32y3_ABau9sOGvXTwhePspXxEe3zcfrni3xkR84C3zdglew-2ihRO7PPDItpBmfbGLG0LWHwAWKDR3wO5pQHVHesVviwnaxqqCKVFiv4rwhhGAdvzgyefqjT_uIOBdHUpZc6YU3ErXFOQtkAiztE-L4ZG1Ib4NV9Scl6muOQNqmWS6rVQDJJhoG9njf7MS-p4fTdEfnqT6fPiJm7XCk6Jlzaqb1hewhTCB8Th1vf4-NA7P8JdnxX3xW8Zr7s"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-primary font-label">Sunil Deshmukh</p>
                        <p className="text-[10px] text-on-surface-variant font-label">Verified Owner • Karad</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-secondary-container/20 bg-secondary-fixed/30 p-6">
                  <h4 className="mb-2 flex items-center gap-2 font-headline text-sm font-bold text-on-secondary-fixed-variant">
                    <span className="material-symbols-outlined text-lg">verified_user</span>
                    Trust Policy
                  </h4>
                  <p className="font-body text-xs leading-relaxed text-on-secondary-fixed-variant/80">
                    Your listing will be reviewed within 24 hours. Ensure all information is accurate to avoid rejection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OwnerProfileWorkspaceShell>
  );
}
