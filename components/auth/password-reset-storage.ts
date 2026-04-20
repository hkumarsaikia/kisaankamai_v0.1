export const RESET_IDENTIFIER_KEY = "kk.passwordReset.identifier";
export const RESET_VERIFIED_KEY = "kk.passwordReset.verified";

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

export function maskResetIdentifier(identifier: string) {
  const trimmed = identifier.trim();

  if (trimmed.includes("@")) {
    const [name, domain] = trimmed.split("@");
    if (!name || !domain) {
      return "your registered contact";
    }

    return `${name.slice(0, 2)}${"*".repeat(Math.max(name.length - 2, 3))}@${domain}`;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 4) {
    return `${"*".repeat(Math.max(digits.length - 4, 4))}${digits.slice(-4)}`;
  }

  return "your registered contact";
}
