# Development & Replication Guide

This document contains low-level technical details required for developers to replicate the exact environment of Kisan Kamai v0.1.

## 📦 Package Management

We use `npm` as the primary package manager. Ensure your current working directory contains `package.json` before running these commands.

### Key Dependencies Breakdown

```json
{
  "dependencies": {
    "next": "^14.2.3",
    "appwrite": "^24.1.1",
    "node-appwrite": "^23.1.0",
    "puppeteer": "^24.40.0",
    "framer-motion": "^12.38.0",
    "web-vitals": "^5.2.0"
  }
}
```

### Full Clean Install
If you experience environment drift, perform a full node_modules purge:
- **Windows**: `rimraf node_modules && npm install`
- **macOS/Ubuntu**: `rm -rf node_modules package-lock.json && npm install`

---

## 🛠️ Replication Steps in Detail

### 1. Codebase Acquisition
```bash
git clone https://github.com/hkumarsaikia/kisaankamai_v0.1.git
cd kisaankamai_v0.1
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=69d918770025e8d680f6
NEXT_PUBLIC_DEMO_AUTH_MODE=true
NEXT_PUBLIC_DEMO_PHONE=8761085453
NEXT_PUBLIC_DEMO_EMAIL=test@example.com
NEXT_PUBLIC_DEMO_PASSWORD=Test@12345
```

### 3. Database Initialization
Manual setup is required in the Appwrite Console until migration scripts are finalized:
1.  **Buckets**: Name must be `performance_traces`.
2.  **Collections**: Set the Permissions to `Any` (or `Users`) for the `live_performance_logs` to allow client-side ingestion.

---

## 🚀 Execution Commands

| Task | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Standard hot-reloading Next.js environment. |
| **Production Build** | `npm run build` | Generates the `.next` optimized bundle. |
| **Profiling agent** | `node scripts/profiler_agent.mjs` | Runs the Puppeteer profiler. |
| **Linting** | `npm run lint` | Runs ESLint for code quality checks. |
| **Type Checking** | `npm run typecheck` | Validates TypeScript types across the project. |


### 3. OTP Authentication Testing
If you encounter "Quota Exceeded" errors with Appwrite SMS, the project has been updated to use Firebase for OTP.
For testing, use the following real number:
- **Phone Number**: `8761085453`
- **Behavior**: An actual OTP will be sent to the user. You must request the OTP from the user (`hkumarsaikia`) via chat/scratchpad to complete the login process if you are in a testing or automated environment.

### 4. Public Demo Mode
For team review without Appwrite, OTP, or backend setup, enable demo mode and expose the dev server through the repo-managed Cloudflare Quick Tunnel helper.

1. Add the `NEXT_PUBLIC_DEMO_*` values to `.env.local`.
2. Run `npm run dev:public`.
3. Run `npm run tunnel:public`.
4. Copy the printed `https://*.trycloudflare.com` URL and share it with teammates.

Teammates can sign in with either of the following and the same password:
- **Phone Login**: `8761085453`
- **Email Login**: `test@example.com`
- **Password**: `Test@12345`

In demo mode, `/login` accepts only those shared credentials and creates a browser-local demo session. `/register` also accepts that exact shared identity, skips OTP, and starts the same ready-made demo session without touching Appwrite.

The helper prefers an existing `cloudflared` install. If it is not already on your machine, it downloads a portable `cloudflared` binary into `.cache/cloudflared/` and uses that automatically. No Cloudflare account login is required for this temporary Quick Tunnel flow.

The public URL is temporary. It only works while both `npm run dev:public` and `npm run tunnel:public` are still running on your machine.

`tunnel.log` is overwritten with the current live Cloudflare URL each time the helper starts. Old URLs should be treated as dead after the tunnel process stops or restarts.

---

## 🧪 System Verification

To verify a successful replication:
1.  **Frontend**: Browse to `http://localhost:3000`. Open DevTools Console. You should see "Performance Tracking Started" after 5 seconds of interaction.
2.  **Backend**: Run `node scripts/profiler_agent.mjs`. Check Appwrite Storage -> `performance_traces`. A new `.json` file should appear.
