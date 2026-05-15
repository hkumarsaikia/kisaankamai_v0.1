import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const favicon = await readFile(path.join(process.cwd(), "public/brand/kisan-kamai-favicon.ico"));

  return new Response(favicon, {
    headers: {
      "Content-Type": "image/x-icon",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
