const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Kisan Kamai">
  <rect width="64" height="64" rx="18" fill="#f9fafb"/>
  <path d="M16 32V20C16 17.8 17.8 16 20 16H28L34 22H46C48.2 22 50 23.8 50 26V36H48.5" fill="none" stroke="#15803d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 16H30" stroke="#15803d" stroke-width="4" stroke-linecap="round"/>
  <path d="M22 22H27L31 26H22V22Z" fill="#15803d" opacity=".16"/>
  <path d="M22 22H27L31 26H22V22Z" fill="none" stroke="#15803d" stroke-width="2" stroke-linejoin="round"/>
  <path d="M44 26V34M40 26V34" stroke="#15803d" stroke-width="2" stroke-linecap="round"/>
  <path d="M38 22V12" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
  <path d="M36 12H41L42 10" stroke="#1f2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="44" cy="44" r="8" fill="#ffffff" stroke="#1f2937" stroke-width="4"/>
  <circle cx="44" cy="44" r="3" fill="#f59e0b"/>
  <circle cx="22" cy="40" r="14" fill="#ffffff" stroke="#1f2937" stroke-width="5"/>
  <circle cx="22" cy="40" r="6" fill="#f59e0b"/>
  <path d="M6 40C6 31.16 13.16 24 22 24C27.5 24 31 26 34 30" fill="none" stroke="#15803d" stroke-width="4" stroke-linecap="round"/>
  <path d="M12 36H6" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
</svg>`;

export function GET() {
  return new Response(faviconSvg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
