import { redirect } from "next/navigation";

const CATALOG_SLUGS = [
  "tractors",
  "harvesters",
  "ploughs",
  "sprayers",
  "implements",
  "pumps",
  "rotavators",
  "balers",
  "seeders",
  "trolleys",
  "threshers",
];

export function generateStaticParams() {
  return CATALOG_SLUGS.map((slug) => ({ slug }));
}

type CatalogPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CatalogRedirect({ params }: CatalogPageProps) {
  const { slug } = await params;
  redirect(`/rent-equipment?query=${encodeURIComponent(slug)}`);
}
