import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { parseJsonBody } from "@/lib/server/http";
import { translateWithGoogleFallback } from "@/lib/i18n.fallback.server";

const translationFallbackSchema = z.object({
  text: z.string().trim().min(1).max(5000),
  sourceLanguage: z.enum(["en", "mr"]).default("en"),
  targetLanguage: z.enum(["en", "mr"]),
  cacheKey: z.string().trim().min(1).max(240).optional(),
});

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("i18n-fallback", async (request: NextRequest) => {
  const payload = await parseJsonBody(request, translationFallbackSchema);
  const result = await translateWithGoogleFallback(payload);

  return NextResponse.json(result);
});
