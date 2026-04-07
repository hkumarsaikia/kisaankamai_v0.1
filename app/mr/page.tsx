import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function HomeMarathi() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[600px] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900">
            <div className="w-full h-full bg-gradient-to-r from-primary-container/90 to-transparent flex items-center px-6 md:px-12 lg:px-24">
              <div className="max-w-2xl z-10">
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mt-4">
                  तुमची शेती आधुनिक करा,<br /> उत्पन्न वाढवा
                </h1>
                <p className="text-primary-fixed text-lg md:text-xl mt-6 leading-relaxed">
                  भारताच्या विश्वसनीय ॲग्रीटेक मार्केटप्लेसमध्ये सामील व्हा. उच्च दर्जाची उपकरणे भाड्याने घ्या किंवा तुमची उपकरणे सूचीबद्ध करून कमवा. ४००+ गावांमध्ये सक्रिय.
                </p>
                <div className="flex flex-wrap gap-4 mt-10">
                  <button className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-xl font-bold hover:brightness-105 transition-all">
                    उपकरणे ब्राउझ करा
                  </button>
                  <button className="bg-white/10 text-white backdrop-blur-sm border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
                    तुमचा ट्रॅक्टर सूचीबद्ध करा
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Strip */}
        <section className="border-b border-outline-variant/30 bg-surface dark:bg-inverse-surface">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-primary dark:text-primary-fixed">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div>
                <p className="font-bold text-sm text-on-surface">पारदर्शक किंमत</p>
                <p className="text-xs text-on-surface-variant">कोणतेही लपवलेले शुल्क नाही.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-primary dark:text-primary-fixed">
                <span className="material-symbols-outlined">security</span>
              </div>
              <div>
                <p className="font-bold text-sm text-on-surface">सुरक्षित बुकिंग</p>
                <p className="text-xs text-on-surface-variant">प्रत्येक भाड्यासाठी पूर्ण संरक्षण.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-primary dark:text-primary-fixed">
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
              <div>
                <p className="font-bold text-sm text-on-surface">लवचिक वेळापत्रक</p>
                <p className="text-xs text-on-surface-variant">दैनिक किंवा साप्ताहिक पर्याय.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
