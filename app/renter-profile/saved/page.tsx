import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { toggleSavedListingFormAction } from "@/lib/actions/firebase-data";
import { getCurrentSession } from "@/lib/server/firebase-auth";
import { getRenterSavedListings } from "@/lib/server/firebase-data";

export default async function SavedEquipmentPage() {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  const savedItems = await getRenterSavedListings(session.user.id);

  return (
    <>
      <div>
        <h2 className="text-3xl font-extrabold text-primary tracking-tight">
          Saved Equipment <span className="text-secondary ml-2 font-normal text-lg">/ जतन केलेली उपकरणे</span>
        </h2>
        <p className="text-slate-500 mt-2">{savedItems.length} items saved</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {savedItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
            <div className="h-52 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
              <Image className="object-cover" alt={item.name} src={item.coverImage} fill />
              <form action={toggleSavedListingFormAction.bind(null, item.id)} className="absolute top-4 right-4">
                <button className="w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all">
                  <span className="material-symbols-outlined text-red-500 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                </button>
              </form>
            </div>
            <div className="p-6">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{item.categoryLabel}</span>
              <h3 className="text-xl font-bold text-primary mt-1">{item.name}</h3>
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span>{item.district}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-amber-500">star</span>{item.rating.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="font-bold text-primary text-lg">₹{item.pricePerHour}/hr</p>
                <Link href={`/booking/${item.id}`} className="text-sm font-bold text-white bg-primary px-5 py-2.5 rounded-xl hover:opacity-90 transition-all">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!savedItems.length ? (
        <section className="bg-gradient-to-br from-primary-container to-[#00251a] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-2">Need something else?</h3>
            <p className="text-emerald-100/80 max-w-md">Browse the active local inventory and start saving equipment for your next booking.</p>
          </div>
          <Link href="/renter-profile/browse" className="relative z-10 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-lg">
            Browse All Equipment
          </Link>
        </section>
      ) : null}
    </>
  );
}


