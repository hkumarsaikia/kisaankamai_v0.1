"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createBookingRecord,
  createListingRecord,
  createSubmissionRecord,
  deleteListingRecord,
  getListingById,
  normalizeRolePreference,
  removeLocalUploadIfExists,
  resetLocalPassword,
  toggleSavedListing,
  updateBookingStatus,
  updateListingRecord,
  updateLocalProfile,
} from "@/lib/server/local-data";
import { withLoggedAction } from "@/lib/server/bug-reporting";
import { uploadListingImage } from "@/lib/server/firebase-storage";
import {
  clearSessionCookie,
  getCurrentSession,
  loginAndCreateSession,
  registerAndCreateSession,
  setWorkspaceCookie,
} from "@/lib/server/local-auth";
import { resolvePortalHref } from "@/lib/workspace-routing.js";
import { mirrorAuthEvent } from "@/lib/server/sheets-mirror";
import {
  bookingRequestSchema,
  callbackRequestSchema,
  completeProfileSchema,
  feedbackSchema,
  loginInputSchema,
  registerInputSchema,
  supportRequestSchema,
} from "@/lib/validation/forms";
import type { RegisterInputPayload } from "@/lib/validation/forms";

interface ActionResult {
  ok: boolean;
  error?: string;
  redirectTo?: string;
}

const MAX_LISTING_IMAGES = 8;
const MAX_LISTING_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_LISTING_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function finishFormAction(result: ActionResult): void {
  if (!result.ok) {
    throw new Error(result.error || "Action failed.");
  }

  if (result.redirectTo) {
    redirect(result.redirectTo);
  }
}

function safeErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // `next build` may evaluate server action modules without an active IPC revalidation origin.
    // In that environment invalidation is a no-op anyway, so ignore only that specific build-time case.
    if (message.includes("localhost:undefined") || message.includes("Invalid URL")) {
      return;
    }

    throw error;
  }
}

function revalidateCommonPaths() {
  safeRevalidatePath("/");
  safeRevalidatePath("/rent-equipment");
  safeRevalidatePath("/owner-profile");
  safeRevalidatePath("/renter-profile");
  safeRevalidatePath("/owner-registration");
  safeRevalidatePath("/support");
  safeRevalidatePath("/feedback");
  safeRevalidatePath("/report");
  safeRevalidatePath("/coming-soon");
}

async function runLoggedAction<T>(
  name: string,
  args: unknown[],
  handler: () => Promise<T>
): Promise<T> {
  const wrapped = withLoggedAction(name, async () => handler(), { rawArgs: args });
  return wrapped();
}

async function saveListingImages(ownerUserId: string, listingId: string, files: File[]) {
  const validFiles = files.filter((file) => file.size > 0);
  if (!validFiles.length) {
    return [] as Array<{ objectPath: string; publicUrl: string }>;
  }

  if (validFiles.length > MAX_LISTING_IMAGES) {
    throw new Error(`Upload up to ${MAX_LISTING_IMAGES} listing images at a time.`);
  }

  for (const file of validFiles) {
    if (!ALLOWED_LISTING_IMAGE_TYPES.has(file.type)) {
      throw new Error("Upload JPG, PNG, WEBP, or AVIF images only.");
    }

    if (file.size > MAX_LISTING_IMAGE_BYTES) {
      throw new Error("Each listing image must be 8 MB or smaller.");
    }
  }

  const storedPaths = await Promise.all(
    validFiles.map((file) => uploadListingImage(ownerUserId, listingId, file))
  );

  return storedPaths;
}

export async function loginAction(input: { identifier: string; password: string }): Promise<ActionResult> {
  return runLoggedAction("loginAction", [input], async () => {
    const parsed = loginInputSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.flatten().formErrors[0] || "Invalid login details." };
    }

    try {
      const session = await loginAndCreateSession(parsed.data.identifier, parsed.data.password);
      if (!session) {
        return { ok: false, error: "Invalid email/phone or password." };
      }

      await mirrorAuthEvent({
        eventType: "login",
        session,
        identifier: parsed.data.identifier,
        outcome: "success",
        path: "/login",
      });

      return { ok: true, redirectTo: "/profile-selection" };
    } catch (error) {
      return { ok: false, error: safeErrorMessage(error, "Login failed.") };
    }
  });
}

export async function registerAction(input: RegisterInputPayload): Promise<ActionResult> {
  return runLoggedAction("registerAction", [input], async () => {
    const parsed = registerInputSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error:
          parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          "Invalid registration details.",
      };
    }

    try {
      const session = await registerAndCreateSession(parsed.data);
      if (!session) {
        return { ok: false, error: "Registration failed." };
      }

      await mirrorAuthEvent({
        eventType: "register",
        session,
        identifier: parsed.data.email || parsed.data.phone,
        outcome: "success",
        path: "/register",
        workspace: parsed.data.role,
      });

      revalidateCommonPaths();
      return { ok: true, redirectTo: "/register/success" };
    } catch (error) {
      return { ok: false, error: safeErrorMessage(error, "Registration failed.") };
    }
  });
}

export async function logoutAction(): Promise<ActionResult> {
  return runLoggedAction("logoutAction", [], async () => {
    const session = await getCurrentSession();
    await clearSessionCookie();
    await mirrorAuthEvent({
      eventType: "logout",
      session,
      outcome: "success",
      path: "/logout",
    });
    return { ok: true, redirectTo: "/" };
  });
}

export async function completeProfileAction(input: {
  phone: string;
  pincode: string;
  village?: string;
  address?: string;
  role: "renter" | "owner" | "both";
}): Promise<ActionResult> {
  return runLoggedAction("completeProfileAction", [input], async () => {
    const session = await getCurrentSession();
    if (!session) {
      return { ok: false, error: "Login required." };
    }

    const parsed = completeProfileSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error:
          parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          "Invalid profile details.",
      };
    }

    try {
      const preferredWorkspace = normalizeRolePreference(parsed.data.role);
      await updateLocalProfile(session.user.id, {
        phone: parsed.data.phone,
        pincode: parsed.data.pincode,
        village: parsed.data.village || session.profile.village,
        address: parsed.data.address || session.profile.address,
        rolePreference: preferredWorkspace,
      });
      await setWorkspaceCookie(preferredWorkspace);

      revalidateCommonPaths();
      return { ok: true, redirectTo: "/profile-selection" };
    } catch (error) {
      return { ok: false, error: safeErrorMessage(error, "Could not save profile.") };
    }
  });
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
  return runLoggedAction("updateProfileSettingsAction", [input], async () => {
    const session = await getCurrentSession();
    if (!session) {
      return { ok: false, error: "Login required." };
    }

    try {
      const preferredWorkspace = normalizeRolePreference(input.rolePreference);
      await updateLocalProfile(session.user.id, {
        fullName: input.fullName.trim(),
        phone: input.phone.trim(),
        village: input.village.trim(),
        address: input.address.trim(),
        pincode: input.pincode.trim(),
        fieldArea: Number(input.fieldArea),
        rolePreference: preferredWorkspace,
        email: session.user.email.includes("@kisankamai.local") ? undefined : session.user.email,
      });
      await setWorkspaceCookie(preferredWorkspace);

      revalidateCommonPaths();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: safeErrorMessage(error, "Could not update settings.") };
    }
  });
}

export async function resetPasswordAction(input: {
  identifier: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  return runLoggedAction("resetPasswordAction", [input], async () => {
    if (!input.password || input.password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }

    if (input.password !== input.confirmPassword) {
      return { ok: false, error: "Passwords do not match." };
    }

    try {
      await resetLocalPassword(input.identifier, input.password);
      return { ok: true, redirectTo: "/login" };
    } catch (error) {
      return { ok: false, error: safeErrorMessage(error, "Could not reset password.") };
    }
  });
}

export async function submitFeedbackAction(input: Parameters<typeof feedbackSchema.parse>[0]): Promise<ActionResult> {
  return runLoggedAction("submitFeedbackAction", [input], async () => {
    const parsed = feedbackSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error:
          parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          "Please complete the feedback form correctly.",
      };
    }

    const session = await getCurrentSession();
    await createSubmissionRecord({
      type: "feedback",
      payload: parsed.data as Record<string, unknown>,
      userId: session?.user.id,
    });
    return { ok: true, redirectTo: "/feedback/success" };
  });
}

export async function submitSupportRequestAction(
  input: Parameters<typeof supportRequestSchema.parse>[0]
): Promise<ActionResult> {
  return runLoggedAction("submitSupportRequestAction", [input], async () => {
    const parsed = supportRequestSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error:
          parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          "Please complete the support form correctly.",
      };
    }

    const session = await getCurrentSession();
    await createSubmissionRecord({
      type: "support-request",
      payload: parsed.data as Record<string, unknown>,
      userId: session?.user.id,
    });
    return { ok: true };
  });
}

export async function submitCallbackRequestAction(
  input: Parameters<typeof callbackRequestSchema.parse>[0]
): Promise<ActionResult> {
  return runLoggedAction("submitCallbackRequestAction", [input], async () => {
    const parsed = callbackRequestSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error:
          parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          "Please complete the callback request correctly.",
      };
    }

    const session = await getCurrentSession();
    await createSubmissionRecord({
      type: "callback-request",
      payload: parsed.data as Record<string, unknown>,
      userId: session?.user.id,
    });
    return { ok: true };
  });
}

export async function createListingAction(formData: FormData): Promise<ActionResult> {
  return runLoggedAction("createListingAction", [formData], async () => {
    const session = await getCurrentSession();
    if (!session) {
      return { ok: false, error: "Login required." };
    }

    try {
      const listingId = `listing-${randomUUID().slice(0, 8)}`;
      const uploads = await saveListingImages(
        session.user.id,
        listingId,
        formData
          .getAll("images")
          .filter((value): value is File => value instanceof File)
      );
      const name = String(formData.get("name") || "").trim();
      const category = String(formData.get("category") || "equipment").trim().toLowerCase();
      const location = String(formData.get("location") || session.profile.village || "").trim();
      const district = String(formData.get("district") || location || "Maharashtra").trim();
      const state = String(formData.get("state") || "Maharashtra").trim();
      const description = String(formData.get("description") || "").trim();
      const pricePerHour = Number(formData.get("pricePerHour") || 0);
      const hp = String(formData.get("hp") || "N/A").trim();
      const workTypes = String(formData.get("workTypes") || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      const tags = String(formData.get("tags") || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      if (!name || !description || !location || !pricePerHour) {
        return { ok: false, error: "Name, location, description, and price are required." };
      }

      const categoryLabel = `${category.charAt(0).toUpperCase()}${category.slice(1)} • ${name.split(" ")[0]}`;
      const coverImage = uploads[0]?.publicUrl || "/assets/generated/hero_tractor.png";

      const listing = await createListingRecord({
        listingId,
        ownerUserId: session.user.id,
        name,
        category,
        categoryLabel,
        location,
        district,
        state,
        description,
        pricePerHour,
        unitLabel: String(formData.get("unitLabel") || "per hour").trim() || "per hour",
        rating: Number(formData.get("rating") || 4.8),
        hp,
        distanceKm: Number(formData.get("distanceKm") || 0),
        ownerName: session.profile.fullName,
        ownerLocation: `${location}, ${district}`,
        ownerVerified: true,
        coverImage,
        galleryImages: uploads.length ? uploads.map((upload) => upload.publicUrl) : [coverImage],
        imagePaths: uploads.length ? uploads.map((upload) => upload.objectPath) : [],
        tags: tags.length ? tags : ["Verified"],
        workTypes,
        operatorIncluded: formData.get("operatorIncluded") === "on",
        availableFrom: String(formData.get("availableFrom") || "").trim() || undefined,
        status: formData.get("status") === "paused" ? "paused" : "active",
      });

      revalidateCommonPaths();
      revalidatePath(`/equipment/${listing.id}`);
      return { ok: true, redirectTo: resolvePortalHref("owner") };
    } catch (error) {
      return { ok: false, error: safeErrorMessage(error, "Could not create listing.") };
    }
  });
}

export async function createListingFormAction(formData: FormData): Promise<void> {
  finishFormAction(await createListingAction(formData));
}

export async function updateListingAction(formData: FormData): Promise<ActionResult> {
  return runLoggedAction("updateListingAction", [formData], async () => {
    const session = await getCurrentSession();
    if (!session) {
      return { ok: false, error: "Login required." };
    }

    const listingId = String(formData.get("listingId") || "");
    if (!listingId) {
      return { ok: false, error: "Listing not found." };
    }

    const existing = await getListingById(listingId);
    if (!existing || existing.ownerUserId !== session.user.id) {
      return { ok: false, error: "Listing not found." };
    }

    try {
      const uploadedImages = await saveListingImages(
        session.user.id,
        listingId,
        formData
          .getAll("images")
          .filter((value): value is File => value instanceof File)
      );
      const imagePaths = uploadedImages.length
        ? uploadedImages.map((upload) => upload.objectPath)
        : existing.imagePaths;
      const galleryImages = uploadedImages.length
        ? uploadedImages.map((upload) => upload.publicUrl)
        : existing.galleryImages;
      const coverImage = uploadedImages[0]?.publicUrl || existing.coverImage;

      await updateListingRecord(listingId, session.user.id, {
        name: String(formData.get("name") || existing.name).trim(),
        category: String(formData.get("category") || existing.category).trim().toLowerCase(),
        categoryLabel:
          String(formData.get("categoryLabel") || "").trim() || existing.categoryLabel,
        location: String(formData.get("location") || existing.location).trim(),
        district: String(formData.get("district") || existing.district).trim(),
        state: String(formData.get("state") || existing.state).trim(),
        description: String(formData.get("description") || existing.description).trim(),
        pricePerHour: Number(formData.get("pricePerHour") || existing.pricePerHour),
        unitLabel: String(formData.get("unitLabel") || existing.unitLabel).trim(),
        hp: String(formData.get("hp") || existing.hp).trim(),
        imagePaths,
        galleryImages,
        coverImage,
        status: formData.get("status") === "paused" ? "paused" : "active",
        tags: String(formData.get("tags") || existing.tags.join(","))
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        workTypes: String(formData.get("workTypes") || existing.workTypes.join(","))
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        availableFrom:
          String(formData.get("availableFrom") || "").trim() || existing.availableFrom || undefined,
        operatorIncluded:
          formData.get("operatorIncluded") === null
            ? existing.operatorIncluded
            : formData.get("operatorIncluded") === "on",
      });

      revalidateCommonPaths();
      revalidatePath(`/equipment/${listingId}`);
      return { ok: true, redirectTo: resolvePortalHref("owner") };
    } catch (error) {
      return { ok: false, error: safeErrorMessage(error, "Could not update listing.") };
    }
  });
}

export async function updateListingFormAction(formData: FormData): Promise<void> {
  finishFormAction(await updateListingAction(formData));
}

export async function deleteListingAction(listingId: string): Promise<ActionResult> {
  return runLoggedAction("deleteListingAction", [listingId], async () => {
    const session = await getCurrentSession();
    if (!session) {
      return { ok: false, error: "Login required." };
    }

    const listing = await getListingById(listingId);
    if (!listing || listing.ownerUserId !== session.user.id) {
      return { ok: false, error: "Listing not found." };
    }

    try {
      await deleteListingRecord(listingId, session.user.id);
      await Promise.all(listing.imagePaths.map(removeLocalUploadIfExists));
      revalidateCommonPaths();
      revalidatePath(`/equipment/${listingId}`);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: safeErrorMessage(error, "Could not delete listing.") };
    }
  });
}

export async function deleteListingFormAction(listingId: string, formData: FormData): Promise<void> {
  void formData;
  finishFormAction(await deleteListingAction(listingId));
}

export async function toggleListingStatusAction(
  listingId: string,
  status: "active" | "paused"
): Promise<ActionResult> {
  return runLoggedAction("toggleListingStatusAction", [listingId, status], async () => {
    const session = await getCurrentSession();
    if (!session) {
      return { ok: false, error: "Login required." };
    }

    try {
      await updateListingRecord(listingId, session.user.id, { status });
      revalidateCommonPaths();
      revalidatePath(`/equipment/${listingId}`);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: safeErrorMessage(error, "Could not update listing status.") };
    }
  });
}

export async function toggleListingStatusFormAction(
  listingId: string,
  status: "active" | "paused",
  formData: FormData
): Promise<void> {
  void formData;
  finishFormAction(await toggleListingStatusAction(listingId, status));
}

export async function createBookingAction(
  input: Parameters<typeof bookingRequestSchema.parse>[0]
): Promise<ActionResult> {
  return runLoggedAction("createBookingAction", [input], async () => {
    const session = await getCurrentSession();
    if (!session) {
      return { ok: false, error: "Login required." };
    }

    const parsed = bookingRequestSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error:
          parsed.error.flatten().formErrors[0] ||
          Object.values(parsed.error.flatten().fieldErrors).find((value) => value?.[0])?.[0] ||
          "Please complete the booking request correctly.",
      };
    }

    try {
      const listing = parsed.data.equipmentId ? await getListingById(parsed.data.equipmentId) : null;
      if (!listing) {
        return { ok: false, error: "Equipment not found." };
      }

      const approxHours = parsed.data.approxHours || 8;
      const amount = Math.max(1, Number(approxHours)) * listing.pricePerHour;
      const startDate =
        parsed.data.startDate || new Date().toISOString().slice(0, 10);
      const endDate = startDate;

      await createBookingRecord({
        listingId: listing.id,
        renterUserId: session.user.id,
        startDate,
        endDate,
        amount,
      });

      await createSubmissionRecord({
        type: "booking-request",
        payload: parsed.data as Record<string, unknown>,
        userId: session.user.id,
        listingId: listing.id,
      });

      revalidateCommonPaths();
      revalidatePath(`/equipment/${listing.id}`);
      return { ok: true, redirectTo: resolvePortalHref("renter") };
    } catch (error) {
      return { ok: false, error: safeErrorMessage(error, "Could not create booking.") };
    }
  });
}

export async function toggleSavedListingAction(listingId: string): Promise<ActionResult> {
  return runLoggedAction("toggleSavedListingAction", [listingId], async () => {
    const session = await getCurrentSession();
    if (!session) {
      return { ok: false, error: "Login required." };
    }

    try {
      await toggleSavedListing(session.user.id, listingId);
      revalidateCommonPaths();
      revalidatePath(`/equipment/${listingId}`);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: safeErrorMessage(error, "Could not update saved items.") };
    }
  });
}

export async function toggleSavedListingFormAction(listingId: string, formData: FormData): Promise<void> {
  void formData;
  finishFormAction(await toggleSavedListingAction(listingId));
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: "pending" | "upcoming" | "active" | "confirmed" | "completed" | "cancelled"
): Promise<ActionResult> {
  return runLoggedAction("updateBookingStatusAction", [bookingId, status], async () => {
    const session = await getCurrentSession();
    if (!session) {
      return { ok: false, error: "Login required." };
    }

    try {
      await updateBookingStatus(bookingId, session.user.id, status);
      revalidateCommonPaths();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: safeErrorMessage(error, "Could not update booking status.") };
    }
  });
}

export async function updateBookingStatusFormAction(
  bookingId: string,
  status: "pending" | "upcoming" | "active" | "confirmed" | "completed" | "cancelled",
  formData: FormData
): Promise<void> {
  void formData;
  finishFormAction(await updateBookingStatusAction(bookingId, status));
}

export async function saveFcmTokenAction(token: string): Promise<ActionResult> {
  return runLoggedAction("saveFcmTokenAction", [token], async () => {
    const session = await getCurrentSession();
    if (!session) {
      return { ok: false, error: "Login required" };
    }
    const { saveFcmToken } = await import("@/lib/server/firebase-data");
    await saveFcmToken(session.user.id, token);
    return { ok: true };
  });
}

export async function selectWorkspaceAction(
  workspace: "owner" | "renter"
): Promise<ActionResult> {
  return runLoggedAction("selectWorkspaceAction", [workspace], async () => {
    const session = await getCurrentSession();
    if (!session) {
      return { ok: false, error: "Login required.", redirectTo: "/login" };
    }

    try {
      await updateLocalProfile(session.user.id, {
        rolePreference: workspace,
      });
      await setWorkspaceCookie(workspace);
      revalidateCommonPaths();

      return {
        ok: true,
        redirectTo: resolvePortalHref(workspace),
      };
    } catch (error) {
      return { ok: false, error: safeErrorMessage(error, "Could not switch workspace.") };
    }
  });
}
