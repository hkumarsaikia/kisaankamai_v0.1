import { AppLink as Link } from "@/components/AppLink";
import { LocalizedText } from "@/components/LocalizedText";
import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { localizedText } from "@/lib/i18n";

export default function RenterProfileEarningsPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="bookings"
      title={localizedText("Renter Activity", "भाडेकरू क्रियाकलाप")}
      subtitle={localizedText(
        "Renters do not have earnings in Kisan Kamai. Use bookings and saved equipment to manage rentals.",
        "किसान कमाईमध्ये भाडेकरूंना कमाई डॅशबोर्ड नसतो. भाडे व्यवस्थापित करण्यासाठी बुकिंग आणि जतन केलेली उपकरणे वापरा."
      )}
    >
      <section className="rounded-3xl border border-outline-variant bg-white p-8 shadow-sm dark:bg-slate-950">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">
              <LocalizedText en="Renter flow" mr="भाडेकरू प्रवाह" />
            </p>
            <h2 className="mt-3 font-headline text-2xl font-black text-primary">
              <LocalizedText en="No renter earnings dashboard" mr="भाडेकरू कमाई डॅशबोर्ड नाही" />
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-on-surface-variant">
              <LocalizedText
                en="Earnings are only available to equipment owners. Continue to your renter bookings to track requests, confirmations, and completed rentals."
                mr="कमाई फक्त उपकरण मालकांसाठी उपलब्ध आहे. विनंत्या, पुष्टीकरणे आणि पूर्ण भाडे ट्रॅक करण्यासाठी तुमच्या भाडेकरू बुकिंगकडे जा."
              />
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/renter-profile/bookings"
              className="rounded-2xl bg-primary px-5 py-3 text-center text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <LocalizedText en="View Bookings" mr="बुकिंग पहा" />
            </Link>
            <Link
              href="/renter-profile/browse"
              className="rounded-2xl border border-outline-variant px-5 py-3 text-center text-sm font-bold text-primary transition-colors hover:bg-surface-container-low"
            >
              <LocalizedText en="Browse Equipment" mr="उपकरणे शोधा" />
            </Link>
          </div>
        </div>
      </section>
    </OwnerProfileWorkspaceShell>
  );
}
