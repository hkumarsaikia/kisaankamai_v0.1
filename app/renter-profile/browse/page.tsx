import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { toggleSavedListingFormAction } from "@/lib/actions/local-data";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getPublicEquipmentList, isListingSavedByUser } from "@/lib/server/local-data";

export default async function BrowseEquipmentPage() {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  const listings = await getPublicEquipmentList();
  const savedLookup = await Promise.all(
    listings.map(async (listing) => [listing.id, await isListingSavedByUser(session.user.id, listing.id)] as const)
  );
  const savedMap = new Map(savedLookup);

  return (
    <>
      <div>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Browse Equipment</h1>
        <p className="text-slate-500 mt-1">Browse the live equipment catalog available to renters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {listings.map((item) => {
          const isSaved = savedMap.get(item.id);

          return (
            <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
              <div className="h-52 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                <Image className="object-cover" alt={item.name} src={item.coverImage} fill />
                <form action={toggleSavedListingFormAction.bind(null, item.id)} className="absolute top-4 right-4">
                  <button className="w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all">
                    <span className={`material-symbols-outlined text-[22px] ${isSaved ? "text-red-500" : "text-slate-500"}`} style={{ fontVariationSettings: isSaved ? "'FILL' 1" : undefined }}>
                      bookmark
                    </span>
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
                  <div className="flex gap-2">
                    <Link href={`/equipment/${item.id}`} className="text-sm font-bold text-primary border border-primary/20 px-4 py-2.5 rounded-xl hover:bg-primary/5 transition-all">
                      Details
                    </Link>
                    <Link href={`/booking/${item.id}`} className="text-sm font-bold text-white bg-primary px-5 py-2.5 rounded-xl hover:opacity-90 transition-all">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}


