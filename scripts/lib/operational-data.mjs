function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "").slice(-10);
}

function safeJson(value) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function toListText(value) {
  if (!Array.isArray(value) || !value.length) {
    return "";
  }

  return value.map((entry) => String(entry)).join(" | ");
}

function sortDescendingByDate(items, key) {
  return [...items].sort((left, right) => String(right?.[key] || "").localeCompare(String(left?.[key] || "")));
}

function mapDocs(snapshot) {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function loadOperationalCollections(db) {
  const [
    usersSnapshot,
    profilesSnapshot,
    listingsSnapshot,
    bookingsSnapshot,
    paymentsSnapshot,
    savedItemsSnapshot,
    submissionsSnapshot,
    bugReportsSnapshot,
  ] = await Promise.all([
    db.collection("users").get(),
    db.collection("profiles").get(),
    db.collection("listings").get(),
    db.collection("bookings").get(),
    db.collection("payments").get(),
    db.collection("saved-items").get(),
    db.collection("form-submissions").get(),
    db.collection("bug-reports").get().catch(() => ({ docs: [] })),
  ]);

  return {
    users: mapDocs(usersSnapshot),
    profiles: mapDocs(profilesSnapshot),
    listings: mapDocs(listingsSnapshot),
    bookings: mapDocs(bookingsSnapshot),
    payments: mapDocs(paymentsSnapshot),
    savedItems: mapDocs(savedItemsSnapshot),
    submissions: mapDocs(submissionsSnapshot),
    bugReports: mapDocs(bugReportsSnapshot),
  };
}

export function buildOperationalWorkbookRows(data, options = {}) {
  const mirroredAt = options.mirroredAt || new Date().toISOString();
  const sourceLabel = options.sourceLabel || "firestore-backfill";
  const usersById = new Map(data.users.map((user) => [user.id, user]));
  const profilesById = new Map(data.profiles.map((profile) => [profile.userId || profile.id, profile]));

  const ownerIds = new Set();
  const renterIds = new Set();

  for (const user of data.users) {
    if (Array.isArray(user.roles) && user.roles.includes("owner")) {
      ownerIds.add(user.id);
    }
    if (Array.isArray(user.roles) && user.roles.includes("renter")) {
      renterIds.add(user.id);
    }
  }

  for (const profile of data.profiles) {
    const userId = profile.userId || profile.id;
    if (profile.rolePreference === "owner" || profile.rolePreference === "both") {
      ownerIds.add(userId);
    }
    if (!profile.rolePreference || profile.rolePreference === "renter" || profile.rolePreference === "both") {
      renterIds.add(userId);
    }
  }

  for (const listing of data.listings) {
    ownerIds.add(listing.ownerUserId);
  }

  for (const booking of data.bookings) {
    ownerIds.add(booking.ownerUserId);
    renterIds.add(booking.renterUserId);
  }

  for (const payment of data.payments) {
    ownerIds.add(payment.ownerUserId);
    renterIds.add(payment.renterUserId);
  }

  for (const savedItem of data.savedItems) {
    renterIds.add(savedItem.userId);
  }

  const accountRow = (userId, accountScope) => {
    const user = usersById.get(userId) || {};
    const profile = profilesById.get(userId) || {};

    return {
      mirrored_at: mirroredAt,
      user_id: userId,
      account_scope: accountScope,
      full_name: profile.fullName || user.displayName || user.email || userId,
      role_preference: profile.rolePreference || "",
      email: profile.email || user.email || "",
      phone: normalizePhone(profile.phone || user.phone),
      village: profile.village || "",
      address: profile.address || "",
      pincode: profile.pincode || "",
      field_area_acres: Number(profile.fieldArea || 0),
      farming_types: profile.farmingTypes || "",
      source: sourceLabel,
      record_state: "live",
    };
  };

  const owners = [...ownerIds].map((userId) => accountRow(userId, "owner")).sort((left, right) => left.full_name.localeCompare(right.full_name));
  const renters = [...renterIds].map((userId) => accountRow(userId, "renter")).sort((left, right) => left.full_name.localeCompare(right.full_name));

  const listings = sortDescendingByDate(data.listings, "updatedAt").map((listing) => ({
    mirrored_at: mirroredAt,
    listing_id: listing.id,
    owner_user_id: listing.ownerUserId || "",
    name: listing.name || "",
    slug: listing.slug || "",
    category: listing.category || "",
    category_label: listing.categoryLabel || "",
    status: listing.status || "",
    location: listing.location || "",
    district: listing.district || "",
    state: listing.state || "",
    price_per_hour: Number(listing.pricePerHour || 0),
    unit_label: listing.unitLabel || "",
    operator_included: Boolean(listing.operatorIncluded),
    rating: Number(listing.rating || 0),
    hp: listing.hp || "",
    distance_km: Number(listing.distanceKm || 0),
    available_from: listing.availableFrom || "",
    work_types: toListText(listing.workTypes),
    tags: toListText(listing.tags),
    owner_name: listing.ownerName || "",
    owner_location: listing.ownerLocation || "",
    owner_verified: Boolean(listing.ownerVerified),
    cover_image: listing.coverImage || "",
    gallery_image_1_url: Array.isArray(listing.galleryImages) ? listing.galleryImages[0] || "" : "",
    gallery_image_2_url: Array.isArray(listing.galleryImages) ? listing.galleryImages[1] || "" : "",
    gallery_image_3_url: Array.isArray(listing.galleryImages) ? listing.galleryImages[2] || "" : "",
    gallery_image_1_path: Array.isArray(listing.imagePaths) ? listing.imagePaths[0] || "" : "",
    gallery_image_2_path: Array.isArray(listing.imagePaths) ? listing.imagePaths[1] || "" : "",
    gallery_image_3_path: Array.isArray(listing.imagePaths) ? listing.imagePaths[2] || "" : "",
    gallery_count: Array.isArray(listing.galleryImages) ? listing.galleryImages.length : 0,
    image_path_count: Array.isArray(listing.imagePaths) ? listing.imagePaths.length : 0,
    created_at: listing.createdAt || "",
    updated_at: listing.updatedAt || "",
    source: sourceLabel,
  }));

  const bookings = sortDescendingByDate(data.bookings, "updatedAt").map((booking) => ({
    mirrored_at: mirroredAt,
    booking_id: booking.id,
    listing_id: booking.listingId || "",
    owner_user_id: booking.ownerUserId || "",
    renter_user_id: booking.renterUserId || "",
    status: booking.status || "",
    start_date: booking.startDate || "",
    end_date: booking.endDate || "",
    amount: Number(booking.amount || 0),
    created_at: booking.createdAt || "",
    updated_at: booking.updatedAt || "",
    source: sourceLabel,
  }));

  const payments = sortDescendingByDate(data.payments, "createdAt").map((payment) => ({
    mirrored_at: mirroredAt,
    payment_id: payment.id,
    booking_id: payment.bookingId || "",
    owner_user_id: payment.ownerUserId || "",
    renter_user_id: payment.renterUserId || "",
    amount: Number(payment.amount || 0),
    status: payment.status || "",
    method: payment.method || "",
    created_at: payment.createdAt || "",
    source: sourceLabel,
  }));

  const savedItems = sortDescendingByDate(data.savedItems, "createdAt").map((savedItem) => ({
    synced_at: mirroredAt,
    saved_item_id: `${savedItem.userId || ""}__${savedItem.listingId || ""}`,
    user_id: savedItem.userId || "",
    listing_id: savedItem.listingId || "",
    created_at: savedItem.createdAt || "",
    source: sourceLabel,
  }));

  const supportRequests = sortDescendingByDate(
    data.submissions.filter((submission) =>
      ["support-request", "feature-request", "report", "callback-request", "partner-inquiry", "owner-application"].includes(submission.type)
    ),
    "createdAt"
  ).map((submission) => {
    const payload = submission.payload || {};
    return {
      submitted_at: submission.createdAt || "",
      submission_id: submission.id,
      submission_type: submission.type,
      user_id: submission.userId || "",
      category: payload.category || "",
      subject: payload.subject || payload.title || "",
      urgency: payload.urgency || "",
      full_name: payload.fullName || "",
      phone: payload.phone || payload.mobileNumber || "",
      email: payload.email || "",
      source_path: payload.sourcePath || "",
      location: payload.location || payload.village || payload.district || "",
      equipment_needed: payload.equipmentNeeded || "",
      message: payload.message || payload.description || "",
      payload_json: safeJson(payload),
    };
  });

  const bookingRequests = sortDescendingByDate(
    data.submissions.filter((submission) => submission.type === "booking-request"),
    "createdAt"
  ).map((submission) => {
    const payload = submission.payload || {};
    return {
      submitted_at: submission.createdAt || "",
      submission_id: submission.id,
      user_id: submission.userId || "",
      listing_id: submission.listingId || "",
      equipment_id: payload.equipmentId || "",
      equipment_name: payload.equipmentName || "",
      field_location: payload.fieldLocation || "",
      field_pincode: payload.fieldPincode || "",
      work_type: payload.workType || "",
      start_date: payload.startDate || "",
      duration: payload.duration || "",
      task: payload.task || "",
      field_size: Number(payload.fieldSize || 0),
      phone: payload.phone || "",
      source_path: payload.sourcePath || "",
      payload_json: safeJson(payload),
    };
  });

  const feedback = sortDescendingByDate(
    data.submissions.filter((submission) => submission.type === "feedback"),
    "createdAt"
  ).map((submission) => {
    const payload = submission.payload || {};
    return {
      submitted_at: submission.createdAt || "",
      submission_id: submission.id,
      user_id: submission.userId || "",
      role: payload.role || "",
      category: payload.category || "",
      subject: payload.subject || "",
      rating: Number(payload.rating || 0),
      contact_me: Boolean(payload.contactMe),
      full_name: payload.fullName || "",
      mobile_number: payload.mobileNumber || payload.phone || "",
      message: payload.message || "",
      payload_json: safeJson(payload),
    };
  });

  const newsletterSubscriptions = sortDescendingByDate(
    data.submissions.filter((submission) => submission.type === "newsletter-subscription"),
    "createdAt"
  ).map((submission) => {
    const payload = submission.payload || {};
    return {
      submitted_at: submission.createdAt || "",
      submission_id: submission.id,
      user_id: submission.userId || "",
      email: payload.email || "",
      source_path: payload.sourcePath || "",
      payload_json: safeJson(payload),
    };
  });

  const comingSoonNotifications = sortDescendingByDate(
    data.submissions.filter((submission) => submission.type === "coming-soon-notify"),
    "createdAt"
  ).map((submission) => {
    const payload = submission.payload || {};
    const contact = String(payload.contact || "");
    const phoneDigits = contact.replace(/\D/g, "").slice(-10);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    return {
      submitted_at: submission.createdAt || "",
      submission_id: submission.id,
      user_id: submission.userId || "",
      contact,
      email: isEmail ? contact : "",
      phone: !isEmail && /^\d{10}$/.test(phoneDigits) ? phoneDigits : "",
      source_path: payload.sourcePath || "/coming-soon",
      payload_json: safeJson(payload),
    };
  });

  const bugReports = sortDescendingByDate(data.bugReports, "occurredAt").map((report) => ({
    occurred_at: report.occurredAt || "",
    bug_id: report.id,
    severity: report.severity || "",
    source: report.source || "",
    runtime: report.runtime || "",
    environment: report.environment || "",
    access_surface: report.accessSurface || "",
    pathname: report.pathname || "",
    url: report.url || "",
    method: report.method || "",
    status_code: report.statusCode || "",
    user_id: report.userId || "",
    active_workspace: report.activeWorkspace || "",
    request_id: report.requestId || "",
    fingerprint: report.fingerprint || "",
    handled: Boolean(report.handled),
    browser: report.client?.browser || "",
    os: report.client?.os || "",
    device_type: report.client?.deviceType || "",
    metric_name: report.performance?.metricName || "",
    metric_value: report.performance?.metricValue || "",
    error_name: report.error?.name || "",
    error_message: report.error?.message || "",
    truncated: Boolean(report.truncated),
  }));

  return {
    rows: {
      owners,
      renters,
      listings,
      bookings,
      payments,
      saved_items: savedItems,
      support_requests: supportRequests,
      booking_requests: bookingRequests,
      newsletter_subscriptions: newsletterSubscriptions,
      coming_soon_notifications: comingSoonNotifications,
      feedback,
      bug_reports: bugReports,
    },
    summary: {
      owners: owners.length,
      renters: renters.length,
      listings: listings.length,
      bookings: bookings.length,
      payments: payments.length,
      saved_items: savedItems.length,
      support_requests: supportRequests.length,
      booking_requests: bookingRequests.length,
      newsletter_subscriptions: newsletterSubscriptions.length,
      coming_soon_notifications: comingSoonNotifications.length,
      feedback: feedback.length,
      bug_reports: bugReports.length,
    },
  };
}
