# Setup & Replication Guide

This document provides setup instructions for the active Kisan Kamai root app. The current production development target is Ubuntu 26.04 LTS.

## 📋 General Requirements

- **Node.js**: Version 20.9.0 or higher is required by the current Next.js stack. The Ubuntu workspace uses Node `v24.15.0`.
- **npm**: Version 10.x or higher. The Ubuntu workspace uses npm `11.12.1`.
- **Git**: Required for repository management.

---

## 🪟 Windows Setup

1. **Install Node.js**: Download the LTS installer from [nodejs.org](https://nodejs.org/).
2. **Terminal**: Use PowerShell or Command Prompt (Run as Administrator for dependency installation).
3. **Setup**:
   ```powershell
   npm install
   npm run dev
   ```

---

## 🍏 macOS Setup

1. **Install Homebrew** (if not present):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. **Install Node.js**:
   ```bash
   brew install node
   ```
3. **Setup**:
   ```bash
   npm install
   npm run dev
   ```

---

## 🐧 Ubuntu / Linux Setup

Ubuntu requires specific system-level libraries to run the **Puppeteer** profiler agent correctly.

### 1. Install Node.js
Use the project-selected user-level Node runtime. The current Ubuntu workspace has Node `v24.15.0` and npm `11.12.1`.

The active frontend stack is Next.js 16, React 19, Tailwind CSS 4, and TypeScript 6. The app is App Router-only and uses Turbopack for production builds. Tailwind/PostCSS config files are `tailwind.config.mjs` and `postcss.config.mjs`.

Install dependencies from the lockfile:
```bash
PUPPETEER_SKIP_DOWNLOAD=true npm ci
```

The repo tracks `.npmrc` so npm cache stays project-local under `.cache/npm`. Use `PUPPETEER_SKIP_DOWNLOAD=true` during install so browser binaries are not downloaded into dependency folders.

### 2. Install Puppeteer System Dependencies
> [!IMPORTANT]
> Failure to install these libraries will cause Chromium-based browser checks to fail when launching in headless mode on Ubuntu.

Run the following command for Ubuntu 26.04 LTS:
```bash
sudo apt update
sudo apt install -y \
    ca-certificates fonts-liberation libasound2t64 libatk-bridge2.0-0t64 \
    libatk1.0-0t64 libc6 libcairo2 libcups2t64 libdbus-1-3 libexpat1 \
    libfontconfig1 libgbm1 libgcc-s1 libglib2.0-0t64 libgtk-3-0t64 \
    libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 \
    libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 \
    libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 \
    libxtst6 wget
```

Kisan Kamai uses system Chrome for Puppeteer/browser checks on Ubuntu:

```bash
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
```

### 3. Python

Use pyenv Python 3.12.10 for project scripts. Do not install Python packages into the OS Python.

```bash
python3 -m venv venv
. venv/bin/activate
python --version
```

Only install Python packages into this venv when a project script actually requires them.

### 4. NVIDIA GPU

The GTX 1650 is available through the NVIDIA driver and `/dev/dri/renderD*`. Use it for Chrome/Playwright rendering or profiling checks where possible. Lint, typecheck, build, Firebase CLI, and Firestore/Storage rules validation remain CPU-bound.

---

## ☁️ Firebase Production Runtime

The public site now runs from the repo root on Firebase App Hosting.

Required services:

1. **Firebase App Hosting** targeting the repo root.
2. **Firebase Authentication** for session-cookie backed sign-in.
3. **Cloud Firestore** for users, profiles, listings, bookings, payments, saved items, and submissions.
4. **Cloud Storage** for listing media uploads.
5. Optional **Google Sheets** workbook plus service account credentials for the best-effort operational mirror.
6. Optional **Sentry** DSNs for production observability.
7. Firebase Auth **phone test numbers** in Console for deterministic OTP validation.
8. Firebase Cloud Messaging **Web Push VAPID key** in Console for browser notifications.

Google account registration/login uses the Firebase Auth Google provider. Keep the provider enabled and keep these Authentication authorized domains present: `kisankamai.com`, `www.kisankamai.com`, and `gokisaan.firebaseapp.com`. The Firebase browser API key referrer allowlist must include the production site and Firebase auth handler origins. The root security headers must allow the Google/Firebase OAuth origins used by Firebase Auth (`accounts.google.com`, `apis.google.com`, and the Firebase auth domain).

---

## 🛠️ Replication Checklist

- [ ] `PUPPETEER_SKIP_DOWNLOAD=true npm ci` completed without errors.
- [ ] Firebase environment variables and Admin credentials are set.
- [ ] Firebase Auth Google provider is enabled and the production custom domains are authorized.
- [ ] Firebase Console has fictional phone numbers configured:
  - [ ] `+91 90000 00101` with code `123456`
  - [ ] `+91 90000 00102` with code `123456`
- [ ] Firebase Console has a Web Push VAPID key and the public key is exposed as `NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY`.
- [ ] `npm run dev` starts the server on port 3000.
- [ ] `npm run verify` passes.
- [ ] `npm run launch:gate` passes.

## Archived Reference

The pre-rebuild Windows-root reference and installed/generated local artifacts are archived under `old/`. Cross-agent handoff files are also archived there and are not part of the active root app.
