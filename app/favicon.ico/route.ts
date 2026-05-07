const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Kisan Kamai">
  <rect width="64" height="64" rx="18" fill="#143b2e"/>
  <circle cx="22" cy="42" r="7" fill="#c2ecd9"/>
  <circle cx="46" cy="42" r="7" fill="#c2ecd9"/>
  <path d="M15 38h36l-5-14H26l-5 14Z" fill="#ffffff"/>
  <path d="M27 24h18l-3-8H30l-3 8Z" fill="#ec5b13"/>
  <path d="M17 37h8m13 0h13" stroke="#143b2e" stroke-width="4" stroke-linecap="round"/>
</svg>`;

export function GET() {
  return new Response(faviconSvg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
