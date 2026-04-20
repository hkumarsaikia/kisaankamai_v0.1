type SupportTeamContact = {
  name: string;
  email: string;
  phoneE164: string;
  phoneDisplay: string;
  whatsappE164: string;
  whatsappDisplay: string;
};

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

function withLinks(contact: SupportTeamContact) {
  return {
    ...contact,
    emailHref: `mailto:${contact.email}`,
    phoneHref: buildTelHref(contact.phoneE164),
    whatsappHref: buildWhatsappHref(contact.whatsappE164),
  };
}

export const supportTeamContacts = [
  {
    name: "Pratik Shinde",
    email: "pratikshinde6416@gmail.com",
    phoneE164: "+917385204960",
    phoneDisplay: "+91 73852 04960",
    whatsappE164: "+917385204960",
    whatsappDisplay: "+91 73852 04960",
  },
  {
    name: "Rohit Nikaam",
    email: "nikamrohit3531@gmail.com",
    phoneE164: "+918485883531",
    phoneDisplay: "+91 84858 83531",
    whatsappE164: "+918485883531",
    whatsappDisplay: "+91 84858 83531",
  },
] satisfies SupportTeamContact[];

export const supportContact = {
  primaryContactName: supportTeamContacts[1].name,
  serviceHours: "8 AM to 8 PM",
  ...withLinks(supportTeamContacts[1]),
};

export const supportRoster = supportTeamContacts.map(withLinks);
