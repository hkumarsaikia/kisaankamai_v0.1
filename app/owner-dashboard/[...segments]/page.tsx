import { LegacyRouteRedirect } from "@/components/LegacyRouteRedirect";

type OwnerDashboardLegacyCatchAllPageProps = {
  params: {
    segments: string[];
  };
};

const OWNER_DASHBOARD_SEGMENTS = [
  ["add-listing"],
  ["bookings"],
  ["equipment"],
  ["revenue"],
  ["settings"],
  ["support"]
];

export function generateStaticParams() {
  return OWNER_DASHBOARD_SEGMENTS.map((segments) => ({ segments }));
}

export default function OwnerDashboardLegacyCatchAllPage({
  params
}: OwnerDashboardLegacyCatchAllPageProps) {
  const target = `/owner-profile/${params.segments.join("/")}`;
  return <LegacyRouteRedirect target={target} title="Owner Profile" />;
}

