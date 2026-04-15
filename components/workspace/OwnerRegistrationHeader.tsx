"use client";

import { useLanguage } from "@/components/LanguageContext";

export function OwnerRegistrationHeader({ isEditing }: { isEditing: boolean }) {
  const { langText } = useLanguage();

  return (
    <section className="mb-8 overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-lowest shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 p-7 md:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-secondary">
            <span className="material-symbols-outlined text-base">{isEditing ? "edit" : "add_circle"}</span>
            {isEditing ? langText("Edit listing", "लिस्टिंग संपादित करा") : langText("Add listing", "लिस्टिंग जोडा")}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-primary dark:text-emerald-50 md:text-5xl">
            {isEditing
              ? langText("Refine your equipment listing.", "तुमची उपकरणांची लिस्टिंग सुधारित करा.")
              : langText("Publish a new equipment listing.", "नवीन उपकरण लिस्टिंग प्रकाशित करा.")}
          </h1>
          <p className="max-w-2xl text-sm font-medium leading-7 text-on-surface-variant md:text-base">
            {isEditing
              ? langText(
                  "Update the same fields, images, and pricing already used by the current listing flow.",
                  "सध्याच्या लिस्टिंग प्रवाहात वापरलेली तीच फील्ड, प्रतिमा आणि किंमत अपडेट करा."
                )
              : langText(
                  "Create a listing that is ready for renters and looks consistent with the new owner workspace.",
                  "भाडेकरींसाठी तयार आणि नवीन मालक वर्कस्पेसशी सुसंगत अशी लिस्टिंग तयार करा."
                )}
          </p>
        </div>
        <div className="bg-primary-container p-7 md:p-10 text-white">
          <h2 className="text-lg font-black">{langText("What you will set up", "तुम्ही काय सेट कराल")}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/85">
            <li>{langText("Machine details and price", "मशीनचे तपशील आणि किंमत")}</li>
            <li>{langText("Photos, tags, and coverage area", "फोटो, टॅग्स आणि कव्हरेज क्षेत्र")}</li>
            <li>{langText("Status and review before publishing", "प्रकाशित करण्यापूर्वी स्थिती आणि पुनरावलोकन")}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
