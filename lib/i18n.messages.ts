import { enMessages as enAutoMessages, mrMessages as mrAutoMessages } from "@/lib/i18n.auto";
import { enManualMessages, mrManualMessages } from "@/lib/i18n.manual";

export const enMessages = {
  ...enAutoMessages,
  ...enManualMessages,
} as const;

export const mrMessages = {
  ...mrAutoMessages,
  ...mrManualMessages,
} satisfies Record<keyof typeof enMessages, string>;
