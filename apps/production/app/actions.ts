"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession, setWorkspaceCookie } from "@/lib/server/auth";
import { bookingSchema, supportSchema } from "@/lib/server/forms";
import {
  createBooking,
  createListingFromFormData,
  createSubmission,
  toggleSavedListing,
  updateWorkspacePreference,
} from "@/lib/server/repositories";

function redirectBack(path: string, message: string) {
  redirect(`${path}${path.includes("?") ? "&" : "?"}message=${encodeURIComponent(message)}`);
}

export async function selectWorkspaceAction(formData: FormData) {
  const session = await requireSession();
  const workspace = formData.get("workspace") === "owner" ? "owner" : "renter";
  await updateWorkspacePreference(session.user.uid, workspace);
  await setWorkspaceCookie(workspace);
  redirect(workspace === "owner" ? "/owner-dashboard" : "/renter-dashboard");
}

export async function logoutAction() {
  const { clearSession } = await import("@/lib/server/auth");
  await clearSession();
  redirect("/");
}

export async function createListingAction(formData: FormData) {
  const session = await requireSession();
  if (!session.profile) {
    redirectBack("/profile-selection", "Complete your profile before listing equipment.");
  }

  await createListingFromFormData(session.user.uid, formData);
  revalidatePath("/owner-dashboard");
  revalidatePath("/rent-equipment");
  redirectBack("/owner-dashboard", "Listing created.");
}

export async function toggleSavedAction(formData: FormData) {
  const session = await requireSession();
  const listingId = String(formData.get("listingId") || "");
  if (!listingId) {
    redirectBack("/rent-equipment", "Missing listing.");
  }

  await toggleSavedListing(session.user.uid, listingId);
  revalidatePath("/rent-equipment");
  revalidatePath("/renter-dashboard");
}

export async function createBookingAction(formData: FormData) {
  const session = await requireSession();
  const parsed = bookingSchema.safeParse({
    listingId: String(formData.get("listingId") || ""),
    listingName: String(formData.get("listingName") || ""),
    ownerUid: String(formData.get("ownerUid") || ""),
    fieldLocation: String(formData.get("fieldLocation") || ""),
    workType: String(formData.get("workType") || ""),
    approxHours: formData.get("approxHours") ? Number(formData.get("approxHours")) : undefined,
    startDate: String(formData.get("startDate") || ""),
  });

  if (!parsed.success) {
    redirectBack("/rent-equipment", "Please complete the booking form.");
    return;
  }

  await createBooking(session.user.uid, session.user.fullName, parsed.data);
  revalidatePath("/renter-dashboard");
  revalidatePath("/owner-dashboard");
  redirectBack("/renter-dashboard", "Booking request created.");
}

export async function submitSupportAction(formData: FormData) {
  const session = await requireSession().catch(() => null);
  const parsed = supportSchema.safeParse({
    fullName: String(formData.get("fullName") || ""),
    phone: String(formData.get("phone") || ""),
    category: String(formData.get("category") || ""),
    message: String(formData.get("message") || ""),
  });

  if (!parsed.success) {
    redirectBack("/support", "Please complete all support fields.");
    return;
  }

  await createSubmission("support", parsed.data, session?.user.uid);
  redirectBack("/support", "Support request submitted.");
}
