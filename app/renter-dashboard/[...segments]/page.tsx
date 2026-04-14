import { LegacyRouteRedirect } from "@/components/LegacyRouteRedirect";

type RenterDashboardLegacyCatchAllPageProps = {
  params: {
    segments: string[];
  };
};

const RENTER_DASHBOARD_SEGMENTS = [
  ["bookings"],
  ["browse"],
  ["payments"],
  ["saved"],
  ["settings"],
  ["switch-profile"]
];

export function generateStaticParams() {
  return RENTER_DASHBOARD_SEGMENTS.map((segments) => ({ segments }));
}

export default function RenterDashboardLegacyCatchAllPage({
  params
}: RenterDashboardLegacyCatchAllPageProps) {
  const target = `/renter-profile/${params.segments.join("/")}`;
  return <LegacyRouteRedirect target={target} title="Renter Profile" />;
}

