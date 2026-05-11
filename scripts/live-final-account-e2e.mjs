import fs from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import puppeteer from "puppeteer";
import { getAdminAuth, getAdminDb } from "./lib/firebase-admin.mjs";
import { loadRepoEnv, getRepoRoot } from "./lib/env.mjs";
import {
  cleanupFinalTestAccounts,
  getFinalTestManifest,
  seedFinalTestAccounts,
} from "./lib/final-test-accounts.mjs";

loadRepoEnv();

const REPO_ROOT = getRepoRoot();
const BASE_URL = (process.env.KK_LIVE_E2E_BASE_URL || "https://www.kisankamai.com").replace(/\/$/, "");
const RUN_ID = new Date().toISOString().replace(/[:.]/g, "-");
const RUN_DIR = path.join(REPO_ROOT, "logs", "runtime", "live-final-account-e2e", RUN_ID);
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 14;
const E2E_FORWARDED_IP = `203.0.113.${(Date.now() % 180) + 20}`;
const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAWElEQVR4nO3PAQ3AMAzAsH78OfckLi26IF0x9La3BwAAAAAAwO8FdsYI2BkjYGeMgJ0xAnbGCNgZI2BnjICdMQJ2xgjYGSNgZ4yAnTECdsYI2BkjYGcPHFQCNjJhwB4AAAAASUVORK5CYII=",
  "base64"
);

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function readSeedPasswords(manifest) {
  const latestSeedPath = path.join(REPO_ROOT, "logs", "runtime", "final-test-accounts", "latest-seed.json");
  const latestSeed = fs.existsSync(latestSeedPath)
    ? JSON.parse(fs.readFileSync(latestSeedPath, "utf8"))
    : null;

  const ownerPassword =
    process.env.KK_FINAL_TEST_OWNER_PASSWORD ||
    latestSeed?.accounts?.owner?.password ||
    "";
  const renterPassword =
    process.env.KK_FINAL_TEST_RENTER_PASSWORD ||
    latestSeed?.accounts?.renter?.password ||
    "";

  if (!ownerPassword || !renterPassword) {
    throw new Error(
      "Final test passwords are missing. Set KK_FINAL_TEST_OWNER_PASSWORD and KK_FINAL_TEST_RENTER_PASSWORD or seed the accounts first."
    );
  }

  return {
    owner: { ...manifest.owner, password: ownerPassword },
    renter: { ...manifest.renter, password: renterPassword },
  };
}

function makeScreenshotPath(name) {
  return path.join(RUN_DIR, `${name.replace(/[^a-z0-9-]+/gi, "-").toLowerCase()}.png`);
}

function makeImageFiles(prefix) {
  const dir = path.join(RUN_DIR, "images", prefix);
  fs.mkdirSync(dir, { recursive: true });
  return [1, 2, 3].map((index) => {
    const filePath = path.join(dir, `${prefix}-${index}.png`);
    fs.writeFileSync(filePath, PNG_BYTES);
    return filePath;
  });
}

async function clearNotificationsForUsers(db, userIds) {
  const snapshot = await db.collection("notifications").get();
  const batch = db.batch();
  let count = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (userIds.includes(data.userId)) {
      batch.delete(doc.ref);
      count += 1;
    }
  });

  if (count) {
    await batch.commit();
  }

  return count;
}

async function cleanupE2EArtifacts(db, userIds, prefix = "KK Live E2E") {
  const listingsSnapshot = await db.collection("listings").get();
  const listings = listingsSnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data(), ref: doc.ref }))
    .filter((listing) => userIds.includes(listing.ownerUserId) && String(listing.name || "").startsWith(prefix));
  const listingIds = new Set(listings.map((listing) => listing.id));

  const bookingsSnapshot = await db.collection("bookings").get();
  const bookings = bookingsSnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data(), ref: doc.ref }))
    .filter((booking) => listingIds.has(booking.listingId));
  const bookingIds = new Set(bookings.map((booking) => booking.id));

  const [paymentsSnapshot, submissionsSnapshot, savedSnapshot, notificationsSnapshot] = await Promise.all([
    db.collection("payments").get(),
    db.collection("form-submissions").get(),
    db.collection("saved-items").get(),
    db.collection("notifications").get(),
  ]);

  const refs = [
    ...listings.map((item) => item.ref),
    ...bookings.map((item) => item.ref),
    ...paymentsSnapshot.docs
      .filter((doc) => bookingIds.has(doc.data().bookingId))
      .map((doc) => doc.ref),
    ...submissionsSnapshot.docs
      .filter((doc) => listingIds.has(doc.data().listingId))
      .map((doc) => doc.ref),
    ...savedSnapshot.docs
      .filter((doc) => listingIds.has(doc.data().listingId))
      .map((doc) => doc.ref),
    ...notificationsSnapshot.docs
      .filter((doc) => {
        const data = doc.data();
        return (
          userIds.includes(data.userId) &&
          (listingIds.has(data.data?.listingId) ||
            bookingIds.has(data.data?.bookingId) ||
            String(data.body || "").includes(prefix))
        );
      })
      .map((doc) => doc.ref),
  ];

  for (let index = 0; index < refs.length; index += 400) {
    const batch = db.batch();
    refs.slice(index, index + 400).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }

  return {
    listings: listings.length,
    bookings: bookings.length,
    refs: refs.length,
  };
}

async function launchBrowser() {
  return puppeteer.launch({
    headless: "new",
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--window-size=1440,1000",
    ],
    defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
  });
}

async function newContextPage(browser, label) {
  const context = browser.createBrowserContext
    ? await browser.createBrowserContext()
    : await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem("kk_language", "en");
      document.cookie = "kk_language=en; Path=/; SameSite=Lax";
    } catch {
      // Keep the live default if browser storage is unavailable.
    }
  });
  await page.setCookie({
    name: "kk_language",
    value: "en",
    domain: new URL(BASE_URL).hostname,
    path: "/",
  });
  const consoleMessages = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleMessages.push({
        type: message.type(),
        text: message.text(),
      });
    }
  });
  page.on("pageerror", (error) => {
    consoleMessages.push({
      type: "pageerror",
      text: error.message,
    });
  });
  page.__kkLabel = label;
  page.__kkConsoleMessages = consoleMessages;
  return { context, page };
}

async function exchangeCustomToken(customToken) {
  const tokenResponse = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        Referer: `${BASE_URL}/login`,
        "x-forwarded-for": E2E_FORWARDED_IP,
      },
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true,
      }),
    }
  );
  const tokenPayload = await tokenResponse.json().catch(() => null);
  if (!tokenResponse.ok || !tokenPayload?.idToken) {
    throw new Error(`Could not exchange Firebase custom token: ${JSON.stringify(tokenPayload)}`);
  }
  return tokenPayload.idToken;
}

async function newAuthenticatedPage(browser, label, account, workspace) {
  const { context, page } = await newContextPage(browser, label);
  const customToken = await getAdminAuth().createCustomToken(account.uid);
  const idToken = await exchangeCustomToken(customToken);
  const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_MS,
  });
  const cookieBase = {
    domain: new URL(BASE_URL).hostname,
    path: "/",
    secure: true,
    sameSite: "Lax",
    expires: Math.floor((Date.now() + SESSION_MAX_AGE_MS) / 1000),
  };
  await page.setCookie(
    {
      ...cookieBase,
      name: "kisan_kamai_session",
      value: sessionCookie,
      httpOnly: true,
    },
    {
      ...cookieBase,
      name: "kisan_kamai_workspace",
      value: workspace,
      httpOnly: true,
    },
    {
      ...cookieBase,
      name: "kk_language",
      value: "en",
      httpOnly: false,
    }
  );
  return { context, page };
}

async function goto(page, route) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle2", timeout: 60_000 });
}

async function clickByText(page, text, selector = "button, a") {
  const clicked = await page.evaluate(
    ({ text, selector }) => {
      const needle = text.toLowerCase();
      const candidates = Array.from(document.querySelectorAll(selector));
      const element = candidates.find((node) => (node.textContent || "").trim().toLowerCase().includes(needle));
      if (!element) {
        return false;
      }
      element.click();
      return true;
    },
    { text, selector }
  );

  if (!clicked) {
    throw new Error(`Could not click element containing text: ${text}`);
  }
}

async function setFieldByLabel(page, label, value) {
  const updated = await page.evaluate(
    ({ label, value }) => {
      const needle = label.toLowerCase();
      const labels = Array.from(document.querySelectorAll("label"));
      const wrapper = labels.find((node) => (node.textContent || "").toLowerCase().includes(needle));
      const input =
        wrapper?.querySelector("input, textarea, select") ||
        wrapper?.parentElement?.querySelector("input, textarea, select");
      if (!input) {
        return false;
      }

      const element = input;
      const proto = Object.getPrototypeOf(element);
      const descriptor = Object.getOwnPropertyDescriptor(proto, "value");
      if (descriptor?.set) {
        descriptor.set.call(element, value);
      } else {
        element.value = value;
      }
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    },
    { label, value }
  );

  if (!updated) {
    throw new Error(`Could not set field with label: ${label}`);
  }
}

async function setInputById(page, id, value) {
  await page.waitForSelector(`#${id}`, { timeout: 20_000 });
  await page.evaluate(
    ({ id, value }) => {
      const element = document.getElementById(id);
      const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), "value");
      if (descriptor?.set) {
        descriptor.set.call(element, value);
      } else {
        element.value = value;
      }
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
    },
    { id, value }
  );
}

async function waitForUrl(page, matcher, timeout = 45_000) {
  await page.waitForFunction(
    (source) => new RegExp(source).test(window.location.href),
    { timeout },
    matcher.source
  );
}

async function waitForText(page, text, timeout = 30_000) {
  await page.waitForFunction(
    (needle) => document.body.innerText.toLowerCase().includes(String(needle).toLowerCase()),
    { timeout },
    text
  );
}

async function login(page, account) {
  await goto(page, "/login");
  await setInputById(page, "phone", account.phone);
  await setInputById(page, "password", account.password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60_000 }).catch(() => undefined),
    page.click("button[type='submit']"),
  ]);
  await waitForUrl(page, /\/profile-selection|\/complete-profile|\/owner-profile|\/renter-profile/, 60_000);
}

async function selectWorkspace(page, workspace) {
  await goto(page, "/profile-selection");
  await clickByText(page, workspace === "owner" ? "I am an Owner" : "I am a Renter", "button");
  await waitForUrl(page, workspace === "owner" ? /\/owner-profile/ : /\/renter-profile/, 60_000);
}

async function registerViaUi(page, account, password, district) {
  await goto(page, "/register");
  await setFieldByLabel(page, "Full name", account.profile.fullName);
  await setFieldByLabel(page, "Mobile number", account.phone);
  await setFieldByLabel(page, "Password", password);
  await setFieldByLabel(page, "Village or town", account.profile.village);
  await setFieldByLabel(page, "District", district);
  await setFieldByLabel(page, "Pincode", account.profile.pincode);
  await page.click("button[type='submit']");
  await waitForText(page, "Verify your mobile number", 90_000);
  for (const digit of account.otpCode.split("")) {
    await page.keyboard.type(digit);
    await delay(50);
  }
  await page.click("button[type='submit']");
  await waitForText(page, "Account created", 90_000);
}

async function publishListing(page, input) {
  await goto(page, "/list-equipment");
  await waitForText(page, "List New Equipment");
  await setFieldByLabel(page, "Brand / Manufacturer", input.brand);
  await setFieldByLabel(page, "Model Name", input.model);
  await setFieldByLabel(page, "HP / Capacity", input.hp);
  await setFieldByLabel(page, "Hourly Rate", String(input.pricePerHour));
  await setFieldByLabel(page, "Minimum Hours", "2");
  await setFieldByLabel(page, "Base Village/Town", input.location);
  await setFieldByLabel(page, "District", input.district);
  await setFieldByLabel(page, "Service Radius", "6");
  await setFieldByLabel(page, "Work types", input.workTypes);
  const fileInputs = await page.$$('input[type="file"][accept="image/*"]');
  if (fileInputs.length < input.imageFiles.length) {
    throw new Error(`Expected ${input.imageFiles.length} listing photo inputs, found ${fileInputs.length}.`);
  }
  for (const [index, filePath] of input.imageFiles.entries()) {
    await fileInputs[index].uploadFile(filePath);
  }
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 90_000 }).catch(() => undefined),
    clickByText(page, "Publish Listing", "button"),
  ]);
  await waitForUrl(page, /\/owner-profile/, 90_000);
}

async function getListingByName(db, name) {
  const snapshot = await db.collection("listings").where("name", "==", name).limit(1).get();
  if (snapshot.empty) {
    return null;
  }
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

async function waitForListing(db, name) {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    const listing = await getListingByName(db, name);
    if (listing) {
      return listing;
    }
    await delay(1500);
  }
  throw new Error(`Timed out waiting for listing ${name}`);
}

async function bookListing(page, listingId, input) {
  await goto(page, `/equipment/${listingId}`);
  await setFieldByLabel(page, "Field Location", input.fieldLocation);
  await setFieldByLabel(page, "Field Pincode", input.fieldPincode);
  await setFieldByLabel(page, "Start Date", input.startDate);
  await setFieldByLabel(page, "Approx Hours", input.approxHours);
  await setFieldByLabel(page, "Phone Number", input.phone);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60_000 }).catch(() => undefined),
    page.click("button[type='submit']"),
  ]);
  await waitForUrl(page, /\/renter-profile/, 60_000);
}

async function assertOwnListingBlocked(page, listingId) {
  await goto(page, `/equipment/${listingId}`);
  await setFieldByLabel(page, "Field Location", "Own listing test field");
  await setFieldByLabel(page, "Field Pincode", "411045");
  await setFieldByLabel(page, "Approx Hours", "2");
  await setFieldByLabel(page, "Phone Number", "9000000101");
  await page.click("button[type='submit']");
  await waitForText(page, "You cannot book your own listings", 15_000);
}

async function waitForBooking(db, listingId, renterUserId, startDate) {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    const snapshot = await db.collection("bookings").where("listingId", "==", listingId).get();
    const booking = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .find((item) => item.renterUserId === renterUserId && item.startDate === startDate);
    if (booking) {
      return booking;
    }
    await delay(1500);
  }
  throw new Error(`Timed out waiting for booking on listing ${listingId}`);
}

async function notificationSnapshot(db, userId) {
  const snapshot = await db.collection("notifications").where("userId", "==", userId).get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((left, right) => String(right.createdAt || "").localeCompare(String(left.createdAt || "")));
}

async function waitForNotification(db, userId, predicate, label) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    const notifications = await notificationSnapshot(db, userId);
    const notification = notifications.find(predicate);
    if (notification) {
      return notification;
    }
    await delay(1500);
  }
  throw new Error(`Timed out waiting for notification: ${label}`);
}

async function fetchNotificationsFromPage(page) {
  return page.evaluate(async () => {
    const response = await fetch("/api/notifications", {
      credentials: "include",
      cache: "no-store",
    });
    return {
      status: response.status,
      payload: await response.json().catch(() => null),
    };
  });
}

async function updateBookingStatusUi(page, route, buttonText) {
  await goto(page, route);
  await clickByText(page, buttonText, "button");
  await delay(1200);
}

async function resetPasswordBackendFlow(account, nextPassword) {
  const requestResponse = await fetch(`${BASE_URL}/api/auth/password-reset/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": E2E_FORWARDED_IP,
    },
    body: JSON.stringify({ identifier: account.phone }),
  });
  const requestPayload = await requestResponse.json().catch(() => null);
  if (!requestResponse.ok || !requestPayload?.ok) {
    throw new Error(`Password reset request failed: ${JSON.stringify(requestPayload)}`);
  }

  const customToken = await getAdminAuth().createCustomToken(account.uid);
  const idToken = await exchangeCustomToken(customToken);

  const completeResponse = await fetch(`${BASE_URL}/api/auth/password-reset/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": E2E_FORWARDED_IP,
    },
    body: JSON.stringify({
      idToken,
      password: nextPassword,
      confirmPassword: nextPassword,
    }),
  });
  const completePayload = await completeResponse.json().catch(() => null);
  if (!completeResponse.ok || !completePayload?.ok) {
    throw new Error(`Password reset complete failed: ${JSON.stringify(completePayload)}`);
  }

  return {
    request: requestPayload,
    complete: completePayload,
  };
}

async function run() {
  fs.mkdirSync(RUN_DIR, { recursive: true });
  const manifest = getFinalTestManifest();
  const accounts = readSeedPasswords(manifest);
  const db = getAdminDb();
  const userIds = [manifest.owner.uid, manifest.renter.uid];
  const summary = {
    runId: RUN_ID,
    baseUrl: BASE_URL,
    startedAt: new Date().toISOString(),
    checks: [],
    screenshots: [],
    consoleMessages: {},
    artifactsCleaned: null,
  };

  const browser = await launchBrowser();
  try {
    await cleanupE2EArtifacts(db, userIds);
    await cleanupFinalTestAccounts({ db, auth: getAdminAuth(), dryRun: false });

    const registrationProbe = {
      owner: { ok: false, error: "" },
      renter: { ok: false, error: "" },
    };
    for (const role of ["owner", "renter"]) {
      const { context, page } = await newContextPage(browser, `register-${role}`);
      try {
        const account = role === "owner" ? manifest.owner : manifest.renter;
        const password = role === "owner" ? accounts.owner.password : accounts.renter.password;
        await registerViaUi(page, account, password, role === "owner" ? "Sangli" : "Satara");
        registrationProbe[role] = { ok: true, error: "" };
        await page.screenshot({ path: makeScreenshotPath(`register-${role}-success`), fullPage: false });
      } catch (error) {
        registrationProbe[role] = {
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        };
        await page.screenshot({ path: makeScreenshotPath(`register-${role}-probe`), fullPage: false }).catch(() => undefined);
      } finally {
        summary.consoleMessages[page.__kkLabel] = page.__kkConsoleMessages;
        await context.close();
      }
    }
    summary.checks.push({ name: "registration-ui-probe", ...registrationProbe });

    await seedFinalTestAccounts({
      db,
      auth: getAdminAuth(),
      ownerPassword: accounts.owner.password,
      renterPassword: accounts.renter.password,
      dryRun: false,
    });
    await clearNotificationsForUsers(db, userIds);

    const resetPassword = `KkOwnerReset${Date.now()}Aa1!`;
    const resetResult = await resetPasswordBackendFlow(accounts.owner, resetPassword);
    summary.checks.push({
      name: "forgot-password-request-and-complete",
      ok: true,
      maskedPhone: resetResult.request.maskedPhone,
      uid: resetResult.complete.uid,
    });

    {
      const { context, page } = await newContextPage(browser, "owner-reset-login");
      try {
        await login(page, { ...accounts.owner, password: resetPassword });
        summary.checks.push({ name: "login-after-forgot-password", ok: true });
        await page.screenshot({ path: makeScreenshotPath("owner-reset-login"), fullPage: false });
      } finally {
        summary.consoleMessages[page.__kkLabel] = page.__kkConsoleMessages;
        await context.close();
      }
    }

    await seedFinalTestAccounts({
      db,
      auth: getAdminAuth(),
      ownerPassword: accounts.owner.password,
      renterPassword: accounts.renter.password,
      dryRun: false,
    });
    await clearNotificationsForUsers(db, userIds);

    const ownerListingName = `KK Live E2E Owner Tractor ${RUN_ID.slice(0, 16)}`;
    const renterListingName = `KK Live E2E Renter Tractor ${RUN_ID.slice(0, 16)}`;

    {
      const { context, page } = await newAuthenticatedPage(
        browser,
        "owner-publish-and-own-book",
        accounts.owner,
        "owner"
      );
      try {
        await publishListing(page, {
          brand: "KK Live E2E Owner",
          model: `Tractor ${RUN_ID.slice(0, 16)}`,
          hp: "52 HP",
          pricePerHour: 1450,
          location: "Sangli",
          district: "Sangli",
          workTypes: "Ploughing, Transport",
          imageFiles: makeImageFiles("owner-listing"),
        });
        const listing = await waitForListing(db, ownerListingName);
        summary.checks.push({
          name: "owner-published-listing",
          ok: true,
          listingId: listing.id,
          imageCount: listing.galleryImages?.length || 0,
          status: listing.status,
        });
        await selectWorkspace(page, "renter");
        await assertOwnListingBlocked(page, listing.id);
        summary.checks.push({ name: "owner-renter-mode-own-listing-blocked", ok: true, listingId: listing.id });
        await page.screenshot({ path: makeScreenshotPath("owner-own-listing-blocked"), fullPage: false });
      } finally {
        summary.consoleMessages[page.__kkLabel] = page.__kkConsoleMessages;
        await context.close();
      }
    }

    const ownerListing = await waitForListing(db, ownerListingName);

    {
      const { context, page } = await newAuthenticatedPage(
        browser,
        "renter-books-owner-listing",
        accounts.renter,
        "renter"
      );
      try {
        await bookListing(page, ownerListing.id, {
          fieldLocation: "Satara rental field",
          fieldPincode: "415001",
          startDate: "2026-06-05",
          approxHours: "3",
          phone: accounts.renter.phone,
        });
        const booking = await waitForBooking(db, ownerListing.id, accounts.renter.uid, "2026-06-05");
        await waitForNotification(
          db,
          accounts.owner.uid,
          (item) => item.data?.bookingId === booking.id && /new booking request/i.test(item.title || ""),
          "owner new booking request"
        );
        await waitForNotification(
          db,
          accounts.renter.uid,
          (item) => item.data?.bookingId === booking.id && /booking request sent/i.test(item.title || ""),
          "renter booking request sent"
        );
        const inbox = await fetchNotificationsFromPage(page);
        summary.checks.push({
          name: "renter-booked-owner-listing",
          ok: true,
          bookingId: booking.id,
          status: booking.status,
          renterInboxStatus: inbox.status,
          renterUnread: inbox.payload?.unreadCount,
        });
        await page.screenshot({ path: makeScreenshotPath("renter-booked-owner-listing"), fullPage: false });
      } finally {
        summary.consoleMessages[page.__kkLabel] = page.__kkConsoleMessages;
        await context.close();
      }
    }

    const declinedBooking = await waitForBooking(db, ownerListing.id, accounts.renter.uid, "2026-06-05");
    {
      const { context, page } = await newAuthenticatedPage(
        browser,
        "owner-declines-booking",
        accounts.owner,
        "owner"
      );
      try {
        await updateBookingStatusUi(page, "/owner-profile/bookings", "Decline");
        await waitForNotification(
          db,
          accounts.renter.uid,
          (item) => item.data?.bookingId === declinedBooking.id && /booking declined/i.test(item.title || ""),
          "renter booking declined"
        );
        const refreshed = (await db.collection("bookings").doc(declinedBooking.id).get()).data();
        summary.checks.push({
          name: "owner-declined-booking-and-renter-notified",
          ok: refreshed?.status === "cancelled",
          bookingId: declinedBooking.id,
          status: refreshed?.status,
        });
      } finally {
        summary.consoleMessages[page.__kkLabel] = page.__kkConsoleMessages;
        await context.close();
      }
    }

    {
      const { context, page } = await newAuthenticatedPage(
        browser,
        "renter-publishes-listing",
        accounts.renter,
        "owner"
      );
      try {
        await publishListing(page, {
          brand: "KK Live E2E Renter",
          model: `Tractor ${RUN_ID.slice(0, 16)}`,
          hp: "48 HP",
          pricePerHour: 1320,
          location: "Satara",
          district: "Satara",
          workTypes: "Rotavator, Transport",
          imageFiles: makeImageFiles("renter-listing"),
        });
        const listing = await waitForListing(db, renterListingName);
        summary.checks.push({
          name: "renter-account-published-owner-listing",
          ok: true,
          listingId: listing.id,
          imageCount: listing.galleryImages?.length || 0,
          status: listing.status,
        });
      } finally {
        summary.consoleMessages[page.__kkLabel] = page.__kkConsoleMessages;
        await context.close();
      }
    }

    const renterListing = await waitForListing(db, renterListingName);
    {
      const { context, page } = await newAuthenticatedPage(
        browser,
        "owner-books-renter-listing",
        accounts.owner,
        "renter"
      );
      try {
        await bookListing(page, renterListing.id, {
          fieldLocation: "Sangli reciprocal field",
          fieldPincode: "416416",
          startDate: "2026-06-07",
          approxHours: "2",
          phone: accounts.owner.phone,
        });
        const booking = await waitForBooking(db, renterListing.id, accounts.owner.uid, "2026-06-07");
        await waitForNotification(
          db,
          accounts.renter.uid,
          (item) => item.data?.bookingId === booking.id && /new booking request/i.test(item.title || ""),
          "renter-owner new booking request"
        );
        summary.checks.push({
          name: "owner-account-booked-renter-owner-listing",
          ok: true,
          bookingId: booking.id,
          status: booking.status,
        });
      } finally {
        summary.consoleMessages[page.__kkLabel] = page.__kkConsoleMessages;
        await context.close();
      }
    }

    const approvedBooking = await waitForBooking(db, renterListing.id, accounts.owner.uid, "2026-06-07");
    {
      const { context, page } = await newAuthenticatedPage(
        browser,
        "renter-owner-approves-booking",
        accounts.renter,
        "owner"
      );
      try {
        await updateBookingStatusUi(page, "/owner-profile/bookings", "Approve");
        await waitForNotification(
          db,
          accounts.owner.uid,
          (item) => item.data?.bookingId === approvedBooking.id && /booking confirmed|booking scheduled|booking updated/i.test(item.title || ""),
          "owner-renter booking approved"
        );
        const refreshed = (await db.collection("bookings").doc(approvedBooking.id).get()).data();
        summary.checks.push({
          name: "renter-owner-approved-booking-and-owner-renter-notified",
          ok: refreshed?.status === "confirmed",
          bookingId: approvedBooking.id,
          status: refreshed?.status,
        });
      } finally {
        summary.consoleMessages[page.__kkLabel] = page.__kkConsoleMessages;
        await context.close();
      }
    }

    for (const route of ["/owner-profile", "/renter-profile", "/rent-equipment", "/rent-equipment?query=balers"]) {
      const { context, page } = await newContextPage(browser, `smoke-${route}`);
      try {
        await goto(page, route);
        const smoke = await page.evaluate(() => ({
          title: document.title,
          bodyText: document.body.innerText.slice(0, 240),
          hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        }));
        summary.checks.push({ name: `route-smoke:${route}`, ok: true, ...smoke });
      } finally {
        summary.consoleMessages[page.__kkLabel] = page.__kkConsoleMessages;
        await context.close();
      }
    }

    summary.artifactsCleaned = await cleanupE2EArtifacts(db, userIds);
    summary.completedAt = new Date().toISOString();
    writeJson(path.join(RUN_DIR, "summary.json"), summary);
    console.log(JSON.stringify(summary, null, 2));
  } catch (error) {
    summary.failedAt = new Date().toISOString();
    summary.error = error instanceof Error ? error.stack || error.message : String(error);
    summary.artifactsCleaned = await cleanupE2EArtifacts(db, userIds).catch((cleanupError) => ({
      error: cleanupError instanceof Error ? cleanupError.message : String(cleanupError),
    }));
    writeJson(path.join(RUN_DIR, "summary.json"), summary);
    console.error(JSON.stringify(summary, null, 2));
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
