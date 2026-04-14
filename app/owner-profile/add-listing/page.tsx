import { redirect } from "next/navigation";

export default async function LegacyAddListingPage({
  searchParams,
}: {
  searchParams?: { listingId?: string };
}) {
  const listingId = searchParams?.listingId;

  redirect(
    listingId
      ? `/owner-registration?listingId=${encodeURIComponent(listingId)}`
      : "/owner-registration"
  );
}
