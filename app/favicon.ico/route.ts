import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const faviconPng = await readFile(path.join(process.cwd(), "public/brand/kisan-kamai-tractor-48.png"));

  return new Response(faviconPng, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
