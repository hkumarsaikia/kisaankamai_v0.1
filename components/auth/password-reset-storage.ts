export const RESET_IDENTIFIER_KEY = "kk.passwordReset.identifier";
export const RESET_VERIFIED_KEY = "kk.passwordReset.verified";
export const RESET_PHONE_E164_KEY = "kk.passwordReset.phoneE164";
export const RESET_MASKED_PHONE_KEY = "kk.passwordReset.maskedPhone";
export const RESET_ID_TOKEN_KEY = "kk.passwordReset.idToken";
export const RESET_VERIFICATION_ID_KEY = "kk.passwordReset.verificationId";

export function getResetStorageItem(key: string) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setResetStorageItem(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeResetStorageItem(key: string) {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Storage can be blocked in private or hardened browser sessions.
  }
}

export function clearPasswordResetStorage() {
  [
    RESET_IDENTIFIER_KEY,
    RESET_VERIFIED_KEY,
    RESET_PHONE_E164_KEY,
    RESET_MASKED_PHONE_KEY,
    RESET_ID_TOKEN_KEY,
    RESET_VERIFICATION_ID_KEY,
  ].forEach(removeResetStorageItem);
}

export function maskResetIdentifier(identifier: string) {
  const trimmed = identifier.trim();

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 4) {
    return `${"*".repeat(Math.max(digits.length - 4, 4))}${digits.slice(-4)}`;
  }

  return "your registered mobile number";
}
