"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLocale } from "@/lib/i18n";
import { requireSession, setWorkspaceCookie } from "@/lib/server/auth";
import { bookingSchema, feedbackSchema, supportSchema } from "@/lib/server/forms";
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

function localeMessage(locale: "en" | "mr", english: string, marathi: string) {
  return locale === "mr" ? marathi : english;
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
  const locale = await getLocale();
  if (!session.profile) {
    redirectBack(
      "/profile-selection",
      localeMessage(locale, "Complete your profile before listing equipment.", "उपकरण नोंदवण्यापूर्वी तुमची प्रोफाइल पूर्ण करा.")
    );
  }

  await createListingFromFormData(session.user.uid, formData);
  revalidatePath("/owner-dashboard");
  revalidatePath("/rent-equipment");
  redirectBack("/owner-dashboard", localeMessage(locale, "Listing created.", "यादी तयार झाली."));
}

export async function toggleSavedAction(formData: FormData) {
  const session = await requireSession();
  const locale = await getLocale();
  const listingId = String(formData.get("listingId") || "");
  if (!listingId) {
    redirectBack("/rent-equipment", localeMessage(locale, "Missing listing.", "यादीची माहिती सापडली नाही."));
  }

  await toggleSavedListing(session.user.uid, listingId);
  revalidatePath("/rent-equipment");
  revalidatePath("/renter-dashboard");
}

export async function createBookingAction(formData: FormData) {
  const session = await requireSession();
  const locale = await getLocale();
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
    redirectBack(
      "/rent-equipment",
      localeMessage(locale, "Please complete the booking form.", "कृपया बुकिंग फॉर्म पूर्ण करा.")
    );
    return;
  }

  await createBooking(session.user.uid, session.user.fullName, parsed.data);
  revalidatePath("/renter-dashboard");
  revalidatePath("/owner-dashboard");
  redirectBack("/renter-dashboard", localeMessage(locale, "Booking request created.", "बुकिंग विनंती तयार झाली."));
}

export async function submitSupportAction(formData: FormData) {
  const session = await requireSession().catch(() => null);
  const locale = await getLocale();
  const parsed = supportSchema.safeParse({
    fullName: String(formData.get("fullName") || ""),
    phone: String(formData.get("phone") || ""),
    category: String(formData.get("category") || ""),
    message: String(formData.get("message") || ""),
  });

  if (!parsed.success) {
    redirectBack("/support", localeMessage(locale, "Please complete all support fields.", "कृपया सर्व सपोर्ट फील्ड पूर्ण करा."));
    return;
  }

  await createSubmission("support", parsed.data, session?.user.uid);
  redirectBack("/support", localeMessage(locale, "Support request submitted.", "सपोर्ट विनंती पाठवली."));
}

export async function submitFeedbackAction(formData: FormData) {
  const session = await requireSession().catch(() => null);
  const locale = await getLocale();
  const parsed = feedbackSchema.safeParse({
    fullName: String(formData.get("fullName") || ""),
    contact: String(formData.get("contact") || ""),
    topic: String(formData.get("topic") || ""),
    subject: String(formData.get("subject") || ""),
    message: String(formData.get("message") || ""),
    rating: Number(formData.get("rating") || 0),
    followUp: String(formData.get("followUp") || "") === "on",
  });

  if (!parsed.success) {
    redirectBack("/feedback", localeMessage(locale, "Please complete all feedback fields.", "कृपया सर्व अभिप्राय फील्ड पूर्ण करा."));
    return;
  }

  await createSubmission("feedback", parsed.data, session?.user.uid);
  redirectBack("/feedback", localeMessage(locale, "Feedback submitted.", "अभिप्राय पाठवला."));
}
