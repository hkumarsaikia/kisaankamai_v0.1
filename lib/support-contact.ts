const DEFAULT_SUPPORT_EMAIL = "support@kisankamai.com";
const DEFAULT_SUPPORT_PHONE_E164 = "+918001234567";
const DEFAULT_SUPPORT_PHONE_DISPLAY = "+91 80012 34567";

function normalizeDigits(value: string) {
  return value.replace(/[^\d]/g, "");
}

function buildTelHref(phoneE164: string) {
  const digits = normalizeDigits(phoneE164);
  return digits ? `tel:+${digits}` : `tel:${phoneE164}`;
}

function buildWhatsappHref(phoneE164: string) {
  const digits = normalizeDigits(phoneE164);
  return digits ? `https://wa.me/${digits}` : "https://wa.me/";
}

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || DEFAULT_SUPPORT_EMAIL;
const supportPhoneE164 = process.env.NEXT_PUBLIC_SUPPORT_PHONE || DEFAULT_SUPPORT_PHONE_E164;
const supportPhoneDisplay = process.env.NEXT_PUBLIC_SUPPORT_PHONE_DISPLAY || DEFAULT_SUPPORT_PHONE_DISPLAY;
const supportWhatsappDisplay = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_DISPLAY || supportPhoneDisplay;

export const supportContact = {
  email: supportEmail,
  emailHref: `mailto:${supportEmail}`,
  phoneE164: supportPhoneE164,
  phoneDisplay: supportPhoneDisplay,
  phoneHref: buildTelHref(supportPhoneE164),
  whatsappDisplay: supportWhatsappDisplay,
  whatsappHref: buildWhatsappHref(supportPhoneE164),
  serviceHours: "8 AM to 8 PM",
};
