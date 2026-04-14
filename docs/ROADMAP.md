# Project Roadmap

The vision for Kisan Kamai is to become the premier agricultural equipment marketplace in Western India. This roadmap outlines the development phases from MVP to at-scale platform.

## 📍 Current Phase: Dual-Surface Stabilization (v0.1) - [IN PROGRESS]
Focus on stabilizing the repo into a clear split between the GitHub Pages demo surface and the Firebase-only production surface.
- [x] Bilingual Support (English/Marathi).
- [x] Root demo surface exports to GitHub Pages.
- [x] Firebase-only production app exists under `apps/production`.
- [x] Dynamic map surfaces are standardized on the shared map stack.
- [x] Dynamic Region Maps (Leaflet).
- [ ] Complete parity migration of market-critical flows into `apps/production`.

---

## 🏗️ Phase 2: Engagement (v0.2)
Enhancing user interaction and direct communication between owners and renters.
- [ ] **Smart Messaging System**: Real-time chat via Firebase for inquiry handling.
- [ ] **User Authentication**: Secure Login/Register flows for personalized profiles.
- [ ] **Booking Request Logic**: Initial non-payment reservation system.
- [ ] **Equipment Reviews**: Feedback system for service quality.

---

## 💳 Phase 3: Transaction (v0.3)
Formalizing the rental business logic and financial transparency.
- [ ] **Payment Integration**: Razorpay/Stripe for secure rental deposits.
- [ ] **KYC Verification**: Trust-building for equipment safety and insurance.
- [ ] **Rent Calculation Engine**: Automated pricing based on hours/acreage.
- [ ] **Mobile App (PWA)**: Better accessibility in rural areas with low network.

---

## 📈 Phase 4: Intelligence (v1.0)
Leveraging data to provide value-added services to the agricultural community.
- [ ] **Predictive Demand Maps**: AI-driven insights for owners on where to deploy equipment.
- [ ] **Weather-Linked Renting**: Adjusting equipment availability based on local climate data.
- [ ] **Maintenance Reminders**: IoT-lite integration for tracking equipment health.
- [ ] **Farmer Network Expansion**: Communities and knowledge-sharing blocks.

---

## 🗺️ Roadmap Diagram

The roadmap progresses in four major layers:

- **Phase 1** establishes the split runtime model: GitHub Pages demo at the root and Firebase production in `apps/production`, while keeping the shared product language coherent.
- **Phase 2** adds engagement systems such as messaging, stronger user identity, booking flows, and reviews.
- **Phase 3** formalizes transactions through payments, KYC, pricing logic, and stronger mobile support.
- **Phase 4** extends the platform with intelligence features such as demand forecasting, weather-linked availability, maintenance reminders, and community tooling.
