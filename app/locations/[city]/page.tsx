import { redirect } from "next/navigation";
import { AppLink } from "@/components/AppLink";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LazyMap } from "@/components/LazyMap";
import { getRegionalHubBySlug } from "@/lib/map-data";

export function generateStaticParams() {
  return ["kalwan", "mukhed", "sangli", "satara", "kolhapur"].map((city) => ({ city }));
}

export default function RegionalHubPage({ params }: { params: { city: string } }) {
  const hub = getRegionalHubBySlug(params.city);
  if (!hub) {
    redirect(`/locations/${params.city}/no-results`);
  }

  return (
    <div className="kk-page flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <section className="mx-auto max-w-7xl px-6">
          <div className="rounded-[2rem] bg-surface-container-low p-6 shadow-sm md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary">{hub.district}</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-primary md:text-6xl">{hub.name}</h1>
            <p className="mt-5 max-w-3xl text-lg font-medium text-on-surface-variant">{hub.description}</p>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-7xl gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="kk-panel overflow-hidden p-4">
            <div className="mb-4 px-2">
              <h2 className="text-2xl font-black text-primary">Local hub map</h2>
              <p className="mt-2 text-sm font-medium text-on-surface-variant">
                This location page now uses the same live map stack as the homepage, support page, and equipment flows.
              </p>
            </div>
            <LazyMap
              center={[hub.lat, hub.lng]}
              zoom={10}
              markers={[
                {
                  lat: hub.lat,
                  lng: hub.lng,
                  label: hub.name,
                  sublabel: hub.description,
                  color: hub.color,
                },
              ]}
              circles={[{ lat: hub.lat, lng: hub.lng, radius: 24000, color: hub.color }]}
              height="520px"
              className="rounded-[1.5rem]"
              showControls
            />
          </div>

          <aside className="space-y-5">
            <div className="kk-panel p-6">
              <h2 className="text-xl font-black text-primary">Service notes</h2>
              <ul className="mt-4 space-y-3 text-sm font-medium text-on-surface-variant">
                <li>The hub is part of the shared typed map dataset in `lib/map-data.ts`.</li>
                <li>Leaflet is used automatically on localhost when Google Maps is unavailable.</li>
                <li>Equipment, support, and expansion flows can all reference this service region.</li>
              </ul>
            </div>
            <div className="kk-panel-muted p-6">
              <h2 className="text-xl font-black text-primary">Next actions</h2>
              <div className="mt-4 space-y-3">
                <AppLink href="/rent-equipment" className="kk-form-primary-button w-full">
                  Browse equipment
                </AppLink>
                <AppLink href="/support" className="kk-button-outline w-full">
                  Contact support
                </AppLink>
                <AppLink href="/locations" className="kk-button-outline w-full">
                  Back to all service regions
                </AppLink>
              </div>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
