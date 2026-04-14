import {
  DEMO_AUTH_CONFIG,
  clearDemoSession,
  getDemoLoginNote,
  isDemoLoginCredentials,
  isDemoRegistrationCredentials,
  readDemoLocalSession,
  setDemoWorkspace,
  startDemoLocalSession,
  updateDemoProfile,
} from "@/lib/demoAuth";
import type { RegisterInputPayload } from "@/lib/validation/forms";

interface ActionResult {
  ok: boolean;
  error?: string;
  redirectTo?: string;
}

const DEMO_SUBMISSIONS_KEY = "kisan-kamai-demo-submissions";

function appendDemoSubmission(type: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  const raw = window.localStorage.getItem(DEMO_SUBMISSIONS_KEY);
  const entries = raw ? (JSON.parse(raw) as Array<Record<string, unknown>>) : [];
  entries.push({
    id: `${type}-${Date.now()}`,
    type,
    payload,
    createdAt: new Date().toISOString(),
  });
  window.localStorage.setItem(DEMO_SUBMISSIONS_KEY, JSON.stringify(entries));
}

function requireDemoSession(): ActionResult | null {
  if (readDemoLocalSession()) {
    return null;
  }

  return {
    ok: false,
    error: "Login required.",
    redirectTo: "/login",
  };
}

export async function loginAction(input: { identifier: string; password: string }): Promise<ActionResult> {
  if (!DEMO_AUTH_CONFIG.enabled) {
    return { ok: false, error: "Demo login is disabled." };
  }

  if (!isDemoLoginCredentials(input.identifier, input.password)) {
    return { ok: false, error: getDemoLoginNote() };
  }

  startDemoLocalSession("renter");
  return { ok: true, redirectTo: "/profile-selection" };
}

export async function registerAction(input: RegisterInputPayload): Promise<ActionResult> {
  if (!DEMO_AUTH_CONFIG.enabled) {
    return { ok: false, error: "Demo registration is disabled." };
  }

  if (
    !isDemoRegistrationCredentials({
      phone: input.phone || "",
      email: input.email || "",
      password: input.password,
    })
  ) {
    return {
      ok: false,
      error: `Demo registration only accepts ${DEMO_AUTH_CONFIG.phone} / ${DEMO_AUTH_CONFIG.email} with the shared demo password.`,
    };
  }

  startDemoLocalSession(input.role === "owner" ? "owner" : "renter");
  updateDemoProfile({
    fullName: input.fullName || "Kisan Kamai Demo User",
    email: input.email || DEMO_AUTH_CONFIG.email,
    phone: input.phone || DEMO_AUTH_CONFIG.phone,
    address: input.address,
    village: input.village,
    pincode: input.pincode,
    fieldArea: input.fieldArea ? Number(input.fieldArea) : undefined,
  });

  return { ok: true, redirectTo: "/profile-selection" };
}

export async function logoutAction(): Promise<ActionResult> {
  clearDemoSession();
  return { ok: true, redirectTo: "/" };
}

export async function completeProfileAction(input: {
  phone: string;
  pincode: string;
  village?: string;
  address?: string;
  role: "renter" | "owner" | "both";
}): Promise<ActionResult> {
  const missingSession = requireDemoSession();
  if (missingSession) {
    return missingSession;
  }

  updateDemoProfile({
    phone: input.phone,
    pincode: input.pincode,
    village: input.village,
    address: input.address,
  });

  setDemoWorkspace(input.role === "owner" ? "owner" : "renter");
  return { ok: true, redirectTo: "/profile-selection" };
}

export async function updateProfileSettingsAction(input: {
  fullName: string;
  phone: string;
  village: string;
  address: string;
  pincode: string;
  fieldArea: number;
  rolePreference: "renter" | "owner" | "both";
}): Promise<ActionResult> {
  const missingSession = requireDemoSession();
  if (missingSession) {
    return missingSession;
  }

  updateDemoProfile({
    fullName: input.fullName,
    phone: input.phone,
    village: input.village,
    address: input.address,
    pincode: input.pincode,
    fieldArea: Number(input.fieldArea),
  });
  setDemoWorkspace(input.rolePreference === "owner" ? "owner" : "renter");
  return { ok: true };
}

export async function resetPasswordAction(input: {
  identifier: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  if (input.password !== input.confirmPassword) {
    return { ok: false, error: "Passwords do not match." };
  }

  if (!isDemoLoginCredentials(input.identifier, DEMO_AUTH_CONFIG.password)) {
    return {
      ok: false,
      error: "The shared demo identity is the only password reset target on the Pages demo.",
    };
  }

  return { ok: true, redirectTo: "/login" };
}

export async function submitFeedbackAction(input: Record<string, unknown>): Promise<ActionResult> {
  appendDemoSubmission("feedback", input);
  return { ok: true, redirectTo: "/feedback/success" };
}

export async function submitSupportRequestAction(input: Record<string, unknown>): Promise<ActionResult> {
  appendDemoSubmission("support-request", input);
  return { ok: true };
}

export async function submitCallbackRequestAction(input: Record<string, unknown>): Promise<ActionResult> {
  appendDemoSubmission("callback-request", input);
  return { ok: true };
}

export async function createListingAction(formData: FormData): Promise<ActionResult> {
  appendDemoSubmission("listing-create", Object.fromEntries(formData.entries()));
  return { ok: true, redirectTo: "/owner-profile/equipment" };
}

export async function createListingFormAction(formData: FormData): Promise<void> {
  void formData;
}

export async function updateListingAction(formData: FormData): Promise<ActionResult> {
  appendDemoSubmission("listing-update", Object.fromEntries(formData.entries()));
  return { ok: true, redirectTo: "/owner-profile/equipment" };
}

export async function updateListingFormAction(formData: FormData): Promise<void> {
  void formData;
}

export async function deleteListingAction(listingId: string): Promise<ActionResult> {
  appendDemoSubmission("listing-delete", { listingId });
  return { ok: true };
}

export async function deleteListingFormAction(listingId: string, formData: FormData): Promise<void> {
  void listingId;
  void formData;
}

export async function toggleListingStatusAction(
  listingId: string,
  status: "active" | "paused"
): Promise<ActionResult> {
  appendDemoSubmission("listing-status", { listingId, status });
  return { ok: true };
}

export async function toggleListingStatusFormAction(
  listingId: string,
  status: "active" | "paused",
  formData: FormData
): Promise<void> {
  void listingId;
  void status;
  void formData;
}

export async function createBookingAction(input: Record<string, unknown>): Promise<ActionResult> {
  const missingSession = requireDemoSession();
  if (missingSession) {
    return missingSession;
  }

  appendDemoSubmission("booking-request", input);
  return { ok: true, redirectTo: "/profile-selection" };
}

export async function toggleSavedListingAction(listingId: string): Promise<ActionResult> {
  const missingSession = requireDemoSession();
  if (missingSession) {
    return missingSession;
  }

  appendDemoSubmission("saved-toggle", { listingId });
  return { ok: true };
}

export async function toggleSavedListingFormAction(listingId: string, formData: FormData): Promise<void> {
  void listingId;
  void formData;
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: "pending" | "upcoming" | "active" | "confirmed" | "completed" | "cancelled"
): Promise<ActionResult> {
  appendDemoSubmission("booking-status", { bookingId, status });
  return { ok: true };
}

export async function updateBookingStatusFormAction(
  bookingId: string,
  status: "pending" | "upcoming" | "active" | "confirmed" | "completed" | "cancelled",
  formData: FormData
): Promise<void> {
  void bookingId;
  void status;
  void formData;
}

export async function selectWorkspaceAction(workspace: "owner" | "renter"): Promise<ActionResult> {
  const nextSession = setDemoWorkspace(workspace);
  if (!nextSession) {
    return { ok: false, error: "Login required.", redirectTo: "/login" };
  }

  return {
    ok: true,
    redirectTo: workspace === "owner" ? "/owner-profile" : "/renter-profile",
  };
}
