import { redirect } from "next/navigation";

export default async function ListEquipmentPage({
  searchParams,
}: {
  searchParams?: Promise<{ listingId?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const listingId = resolvedSearchParams?.listingId || "";
  const query = listingId ? `?listingId=${encodeURIComponent(listingId)}` : "";

  redirect(`/owner-profile/list-equipment${query}`);
}
