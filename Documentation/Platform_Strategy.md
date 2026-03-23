# PLATFORM & DISTRIBUTION STRATEGY
## Trajectory — Adaptive Running Training Planner

**Version:** 1.1
**Date:** 23 March 2026
**Status:** Approved

---

## Delivery Phasing

Trajectory is built and released in 4 progressive MVPs. Each phase adds a new surface or infrastructure layer, validated before the next is built.

| Phase | Surface | Data Storage | Auth | Goal |
|---|---|---|---|---|
| **MVP1** | Web (desktop) | Local — IndexedDB in browser | None | Validate UX + algorithm locally |
| **MVP2** | Web (desktop) | Online — Supabase / PostgreSQL | Email + password | Add persistence, multi-device, deploy |
| **MVP3** | iOS mobile | Online — shared with MVP2 | Supabase Auth | First mobile surface |
| **MVP4** | Android mobile | Online — shared with MVP2 | Supabase Auth | Full mobile coverage |

**Rationale:** Starting with a local web app eliminates all infrastructure complexity during the validation phase. No server, no auth, no deployment — just the product. Cloud and mobile come once the core experience is proven.

---

## Overview

Trajectory is ultimately delivered on two complementary surfaces:

1. **Web App** (MVP1 → MVP2) — desktop-first, then responsive
2. **Mobile App** (MVP3 → MVP4) — iOS first, then Android

This ordering reflects both validation priorities and development efficiency: the web allows fast iteration without app store cycles, and a single backend (Supabase) serves all surfaces from MVP2 onward.

---

## Surface Responsibilities

### Mobile App — "In the moment"

The mobile app owns all time-sensitive, low-friction interactions that happen before, during, or after a run.

**Core capabilities:**
- View today's planned session
- Log a completed session (distance, time, RPE, notes, elevation)
- Check the current week's plan
- Receive and respond to push notifications (weekly plan ready, fatigue alert, race countdown)
- Signal weekly constraints (illness, travel, equipment limits)
- Quick dashboard glance (streak, countdown, next session)

**Platform:** iOS + Android via Expo (React Native)
**Key requirement:** Offline session logging with sync on reconnect — runners may not have connectivity post-run

---

### Web App — "Planning and review"

The web app owns higher-complexity interactions that benefit from a larger screen and keyboard.

**Core capabilities:**
- Onboarding and initial profile setup
- Race calendar management (add/edit/remove races, set target dates)
- Weekly plan editing and constraint input (desktop-friendly forms)
- Full training history and analytics dashboard
- Plan overview (all phases: prep → transition → next race)
- Account and notification settings

**Platform:** Next.js, deployed to Vercel
**Key requirement:** Responsive design — web must be usable on mobile browsers as a fallback

---

## Feature Matrix

| Feature | Mobile | Web |
|---|---|---|
| Session logging | Primary | Secondary (available) |
| View daily session | Primary | Available |
| Weekly plan view | Primary | Primary |
| Race calendar management | View only | Primary |
| Onboarding | Supported | Primary |
| Analytics / history | Summary | Full |
| Constraint signaling | Primary | Available |
| Push notifications | Yes | Email only |
| Offline support | Yes | No |
| Settings / profile | Basic | Full |

---

## Shared Layer

Both surfaces share:

- **TypeScript types** — Data models from PRD Section 6 defined once, used everywhere
- **Supabase SDK** — Same API client for auth, database queries, and real-time subscriptions
- **Business logic utilities** — Plan calculation helpers, pace formatters, RPE mappings
- **API contract** — Both surfaces call the same Supabase endpoints and Edge Functions

Shared code will be extracted to a `/packages/shared` directory in a monorepo setup (Turborepo recommended).

---

## Distribution

### Mobile
- **iOS:** App Store (Apple Developer Program required — $99/year)
- **Android:** Google Play Store ($25 one-time registration fee)
- **Build tooling:** EAS Build (Expo Application Services) for OTA updates and native builds
- **MVP release:** TestFlight (iOS) + Internal Testing (Android) for beta phase

### Web
- **Hosting:** Vercel (free tier sufficient for MVP)
- **Domain:** To be configured (e.g., trajectoryapp.io)
- **CI/CD:** Auto-deploy from main branch via Vercel GitHub integration

---

## Authentication Strategy

Single auth system shared across both surfaces:

- **Provider:** Supabase Auth
- **Methods:** Email + password (MVP), OAuth via Google/Apple (v1.1)
- **Session handling:** JWT tokens, managed by Supabase client SDK on both surfaces
- **Deep linking:** Mobile app handles trajectory:// scheme for magic link auth flows

---

## Offline Strategy (Mobile)

Session logging must work offline:

1. User logs session without connectivity
2. Session stored locally in AsyncStorage / SQLite (via Expo SQLite)
3. On next app open with connectivity, local sessions sync to Supabase
4. Conflict resolution: local timestamp wins (user is source of truth for logged sessions)

The plan and weekly schedule are read-only on mobile; they do not need offline editing.

---

## Notifications

| Trigger | Mobile (Push) | Web (Email) |
|---|---|---|
| Weekly plan ready (Sunday) | Yes | Yes |
| Fatigue/adaptation alert | Yes | Yes |
| Missed session reminder | Yes | No |
| Race countdown (7 days before) | Yes | Yes |
| Session logged confirmation | No | No |

Push notification service: **Expo Push Notifications** (wraps APNs + FCM)
Email service: **Resend** (via Supabase Edge Function trigger)

---

## Scope per Phase

### MVP1 — Web, Local
- Full feature set of the app (onboarding, plan generation, session logging, adaptation, dashboard)
- All data in IndexedDB — no auth, no server, no deployment required
- Runs on `localhost:3000` — developer and close testers only
- No notifications (no backend to send them)
- Single user / single profile

### MVP2 — Web, Online
- Same feature set, data migrated to Supabase
- Auth: email + password
- Deployed on Vercel (public URL)
- Email notifications via Resend
- Multi-race calendar
- Beta testers (5-10 users)

### MVP3 — iOS
- Mobile-optimized subset: dashboard, weekly plan, session logging, constraint input
- Race management stays on web (larger screens)
- Push notifications via Expo Push
- Offline session logging with sync
- TestFlight beta → App Store

### MVP4 — Android
- Same scope as MVP3
- Android-specific testing (FCM notifications, Play Store policies)
- Google Play Internal Testing → Play Store

---

**Document Owner:** Product / Engineering Lead
**Last Updated:** 23 March 2026
**Next Review:** Upon MVP completion (Week 8)
