# Setup & Replication Guide

This document provides detailed setup instructions for Windows, macOS, and Ubuntu to ensure the Kisan Kamai project can be replicated accurately across different environments.

## 📋 General Requirements

- **Node.js**: Version 18.17.0 or higher is required.
- **npm**: Version 9.x or higher (standard with Node 18+).
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
We recommend using the NodeSource repository for the latest LTS:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install Puppeteer System Dependencies
> [!IMPORTANT]
> Failure to install these libraries will cause Chromium-based browser checks to fail when launching in headless mode on Ubuntu.

Run the following command for Ubuntu 22.04 and 24.04:
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

---

## ☁️ Firebase Production Runtime

The public site now runs from the repo root on Firebase App Hosting.

Required services:

1. **Firebase App Hosting** targeting the repo root.
2. **Firebase Authentication** for session-cookie backed sign-in.
3. **Cloud Firestore** for users, profiles, listings, bookings, payments, saved items, and submissions.
4. **Cloud Storage** for listing media uploads.
5. Optional **Sentry** or Google Cloud logging for production observability.

---

## 🛠️ Replication Checklist

- [ ] `npm install` completed without errors.
- [ ] Firebase environment variables and Admin credentials are set.
- [ ] `npm run dev` starts the server on port 3000.
- [ ] `npm run verify` passes.

## Cross-Agent Handoff Setup

If you want to share session context between Codex and Antigravity through the repo:

1. Keep the handoff system in `agents/codex-antigravity-sync/`.
2. Install the shared launcher into Codex and Antigravity:
   ```bash
   npm run cross-agent:install
   ```
3. Create `agents/codex-antigravity-sync/config/local.json` only if you want optional exported transcript drop-folder support.
4. Run the launcher manually by name when you want to refresh the pack.
5. Do not configure it to auto-run.

Use `agents/codex-antigravity-sync/docs/README.md` for the subsystem contract, `agents/codex-antigravity-sync/docs/UPDATER.md` for refresh behavior, `agents/codex-antigravity-sync/docs/CONSUMER.md` for read order, and `agents/codex-antigravity-sync/docs/REFERENCES.md` for supported reference forms.
