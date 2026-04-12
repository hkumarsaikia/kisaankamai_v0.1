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
> Failure to install these libraries will cause the `profiler_agent.mjs` script to crash when attempting to launch Chromium.

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

## ☁️ Appwrite Infrastructure Replication

To replicate the backend performance monitoring system:

1. **Project ID**: Create a project in Appwrite with ID `69d918770025e8d680f6`.
2. **Database**: Create a database named `kisan-kamai-db`.
3. **Collections**:
   - `performance_insights`: Attributes (`pageUrl`, `lcp`, `cls`, `loadTime`, `timestamp`).
   - `live_performance_logs`: Attributes (`sessionId`, `batchData`, `timestamp`).
4. **Storage**: Create a bucket named `performance_traces` for trace storage.
5. **API Key**: Generate an API key with `users.read`, `users.write`, `databases.read`, `databases.write`, `documents.write`, and `files.write` scopes for the autonomous agent and the shared team-review bootstrap script.

---

## 🛠️ Replication Checklist

- [ ] `npm install` completed without errors.
- [ ] Environment variables for Firebase and Appwrite are set.
- [ ] `npm run dev` starts the server on port 3000.
- [ ] `node scripts/profiler_agent.mjs` successfully captures a trace (requires the system dependencies listed above).
