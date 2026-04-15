"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useAuth } from "@/components/AuthContext";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useLanguage } from "@/components/LanguageContext";
import { OwnerSidebar } from "@/components/OwnerSidebar";
import { OwnerTopBar } from "@/components/OwnerTopBar";
import { OwnerListingWizard } from "@/components/forms/OwnerListingWizard";
import { OwnerRegistrationHeader } from "@/components/workspace/OwnerRegistrationHeader";
import { assetPath } from "@/lib/site";
import { supportContact } from "@/lib/support-contact";

export default function ListEquipmentPage() {
  const { user, profile } = useAuth();
  const { langText } = useLanguage();

  if (user && profile && user.roles.includes("owner")) {
    return (
      <div className="min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
        <OwnerSidebar />
        <OwnerTopBar />
        <main className="mt-16 flex min-h-[calc(100vh-4rem)] flex-col gap-8 p-6 md:p-8 lg:ml-64">
          <div className="mx-auto w-full max-w-7xl">
            <OwnerRegistrationHeader isEditing={false} />
            <OwnerListingWizard defaultVillage={profile.village} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />
      <main className="pb-20 pt-24">
        <section className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-lowest shadow-[0_24px_60px_-36px_rgba(20,59,46,0.45)]">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6 p-8 md:p-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary-container/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  {langText("List equipment", "उपकरणे सूचीबद्ध करा")}
                </span>
                <div className="space-y-3">
                  <h1 className="text-4xl font-black tracking-tight text-primary dark:text-emerald-50 md:text-6xl">
                    {langText("Turn your machine into a dependable earning line.", "तुमच्या मशीनला स्थिर कमाईत रूपांतरित करा.")}
                  </h1>
                  <p className="max-w-2xl text-base font-medium leading-8 text-on-surface-variant">
                    {langText(
                      "The new listing experience keeps the original form fields, validations, and Firebase-backed save flow, but presents them in the imported multi-section layout you asked for.",
                      "नवीन लिस्टिंग अनुभवात मूळ फॉर्म फील्ड, तपासणी आणि Firebase-आधारित सेव्ह फ्लो तसाच आहे, पण आता तो तुम्ही मागितलेल्या आयात केलेल्या बहु-विभागीय लेआउटमध्ये दिसतो."
                    )}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: "agriculture",
                      title: langText("Machine details", "मशीन तपशील"),
                      copy: langText("Type, horsepower, work types, and renter-facing description.", "प्रकार, हॉर्सपॉवर, कामाचे प्रकार आणि भाडेकर्‍यांसाठीचे वर्णन."),
                    },
                    {
                      icon: "image",
                      title: langText("Photos and pricing", "फोटो आणि किंमत"),
                      copy: langText("Cover imagery, hourly pricing, and publish status stay on one flow.", "कव्हर प्रतिमा, प्रति तास किंमत आणि प्रकाशित स्थिती एकाच फ्लोमध्ये राहते."),
                    },
                    {
                      icon: "distance",
                      title: langText("Coverage area", "सेवा क्षेत्र"),
                      copy: langText("District, radius, and operator preference are part of the same listing record.", "जिल्हा, त्रिज्या आणि ऑपरेटर प्राधान्य एकाच लिस्टिंग नोंदीचा भाग आहेत."),
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-[1.5rem] border border-outline-variant bg-surface-container-low p-5 shadow-sm">
                      <span className="material-symbols-outlined text-3xl text-primary">{item.icon}</span>
                      <h2 className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-primary">{item.title}</h2>
                      <p className="mt-2 text-sm font-medium leading-6 text-on-surface-variant">{item.copy}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={user ? "/profile-selection" : "/register"} className="kk-form-primary-button rounded-full px-6">
                    {user ? langText("Switch to owner workspace", "मालक वर्कस्पेस निवडा") : langText("Create owner account", "मालक खाते तयार करा")}
                  </Link>
                  <Link href="/login" className="kk-button-outline rounded-full px-6">
                    {langText("Sign in to continue", "पुढे जाण्यासाठी साइन इन करा")}
                  </Link>
                </div>
              </div>

              <div
                className="relative min-h-[340px] bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(135deg, rgba(20,59,46,0.88), rgba(20,59,46,0.58)), url('${assetPath("/assets/generated/modern_farm_tech.png")}')` }}
              >
                <div className="absolute inset-0 flex flex-col justify-between p-8 text-white md:p-10">
                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-fixed">
                      {langText("Listing flow", "लिस्टिंग फ्लो")}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        langText("Equipment details", "उपकरण तपशील"),
                        langText("Images", "प्रतिमा"),
                        langText("Pricing", "किंमत"),
                        langText("Location", "स्थान"),
                        langText("Review", "पुनरावलोकन"),
                      ].map((label) => (
                        <span key={label} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/85">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/15 bg-black/10 p-6 backdrop-blur-sm">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-primary-fixed">
                      {langText("Need help before listing?", "लिस्टिंगपूर्वी मदत हवी आहे?")}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/80">
                      {langText(
                        "Talk to the support desk for pricing guidance, coverage setup, or listing verification.",
                        "किंमत मार्गदर्शन, सेवा क्षेत्र सेटअप किंवा लिस्टिंग पडताळणीसाठी सपोर्टशी बोला."
                      )}
                    </p>
                    <div className="mt-5 space-y-2 text-sm font-semibold text-white/90">
                      <a href={supportContact.phoneHref} className="flex items-center gap-2 hover:text-primary-fixed">
                        <span className="material-symbols-outlined text-base">call</span>
                        {supportContact.phoneDisplay}
                      </a>
                      <a href={supportContact.whatsappHref} className="flex items-center gap-2 hover:text-primary-fixed">
                        <span className="material-symbols-outlined text-base">chat</span>
                        {supportContact.whatsappDisplay}
                      </a>
                      <a href={supportContact.emailHref} className="flex items-center gap-2 hover:text-primary-fixed">
                        <span className="material-symbols-outlined text-base">mail</span>
                        {supportContact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: langText("Prepare the profile", "प्रोफाइल तयार करा"),
                copy: langText("Sign in with the owner-enabled account and confirm your workspace.", "मालक-सक्षम खात्याने साइन इन करा आणि वर्कस्पेस पुष्टी करा."),
              },
              {
                step: "02",
                title: langText("Publish with the original form", "मूळ फॉर्मसह प्रकाशित करा"),
                copy: langText("The redesigned screen still submits the same Firebase-backed listing data.", "पुन्हा डिझाइन केलेली स्क्रीन तरीही त्याच Firebase-आधारित लिस्टिंग डेटाला सबमिट करते."),
              },
              {
                step: "03",
                title: langText("Track bookings and payouts", "बुकिंग आणि पेआउट ट्रॅक करा"),
                copy: langText("Approvals, revenue, and support remain inside the owner dashboard family.", "मंजुरी, कमाई आणि सपोर्ट मालक डॅशबोर्डमधूनच चालतात."),
              },
            ].map((item) => (
              <div key={item.step} className="rounded-[1.6rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-secondary">{item.step}</span>
                <h2 className="mt-3 text-xl font-black text-primary">{item.title}</h2>
                <p className="mt-3 text-sm font-medium leading-7 text-on-surface-variant">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
