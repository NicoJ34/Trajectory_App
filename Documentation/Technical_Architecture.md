# TECHNICAL ARCHITECTURE
## Trajectory — Adaptive Running Training Planner

**Version:** 1.1
**Date:** 23 March 2026
**Status:** Approved

---

## Architecture by Phase

The architecture evolves across 4 MVP phases. Each phase is a working product — not a prototype.

### MVP1 — Local Web App

Zero infrastructure. Everything runs in the browser.

```
┌──────────────────────────────────────┐
│         Browser (localhost:3000)     │
│                                      │
│   Next.js App (static, no SSR/API)  │
│                                      │
│   ┌──────────────────────────────┐  │
│   │  Adaptation Engine (TS)      │  │
│   │  Plan Generator (TS)         │  │
│   └──────────────────────────────┘  │
│                  │                   │
│                  ▼                   │
│   ┌──────────────────────────────┐  │
│   │  IndexedDB (via localforage) │  │
│   │  — users, plans, sessions,   │  │
│   │    logs, constraints         │  │
│   └──────────────────────────────┘  │
└──────────────────────────────────────┘
```

No auth. No server. No deployment. Data lives in the browser until cleared.

---

### MVP2 — Web App + Cloud Backend

Same Next.js frontend. IndexedDB replaced by Supabase.

```
┌──────────────────────────────┐
│   Next.js App (Vercel)       │
└──────────────┬───────────────┘
               │ Supabase SDK
               ▼
  ┌────────────────────────┐
  │       Supabase         │
  │  PostgreSQL + Auth     │
  │  Edge Functions (cron) │
  └────────────────────────┘
```

---

### MVP3 / MVP4 — Mobile Apps

Expo app added alongside the web app. Same Supabase backend.

```
┌──────────────┐   ┌──────────────────────┐
│  Expo (iOS)  │   │   Next.js (Vercel)   │
│  Expo (Android)  └──────────┬───────────┘
└──────┬───────┘              │
       └──────────────────────┘
                  │ Supabase SDK
                  ▼
       ┌────────────────────┐
       │      Supabase      │
       └────────────────────┘
```

---

## Tech Stack

| Layer | MVP1 | MVP2 | MVP3/4 |
|---|---|---|---|
| Web | Next.js (local) | Next.js (Vercel) | — |
| Mobile | — | — | Expo (React Native) |
| Database | IndexedDB (browser) | Supabase / PostgreSQL | Supabase (shared) |
| Auth | None | Supabase Auth | Supabase Auth |
| Adaptation Engine | Client-side TypeScript | Supabase Edge Function | Supabase Edge Function |
| Language | TypeScript | TypeScript | TypeScript |

**Full target stack (MVP2+):**

| Layer | Technology | Rationale |
|---|---|---|
| Mobile | Expo (React Native) | Cross-platform iOS + Android, single codebase, OTA updates |
| Web | Next.js 14 (App Router) | React-based, Vercel-optimized, SSR for fast initial load |
| Language | TypeScript | Type safety, shared types across all surfaces |
| Backend / DB | Supabase | PostgreSQL + Auth + Storage + Edge Functions — no server to manage |
| Adaptation Engine | Supabase Edge Functions (Deno) | Serverless, triggered by cron or DB events |
| Monorepo | Turborepo | Shared packages between mobile and web (types, utils, API client) |
| Push Notifications | Expo Push Notifications | Wraps APNs (iOS) and FCM (Android) |
| Email | Resend (via Edge Function) | Transactional email for web notifications |
| CI/CD | EAS Build (mobile) + Vercel (web) | Automated builds and deployments |

---

## MVP1 — Local Storage Design

In MVP1, the browser's IndexedDB replaces the database. The library `localforage` provides a simple async key-value API over IndexedDB.

**Library:** `localforage` (wraps IndexedDB with a clean Promise API)

**Store structure (mirrors PRD data model):**

```
localforage stores:
  "profile"       → single UserProfile object
  "races"         → Record<id, Race>
  "plans"         → Record<id, Plan>
  "weeks"         → Record<id, Week>
  "sessions"      → Record<id, Session>
  "session_logs"  → Record<id, SessionLog>
  "constraints"   → Record<id, UserConstraint>
  "adaptation_logs" → Record<id, AdaptationLog>
```

**Data access layer:** A `db/` module in `/packages/shared` exposes typed functions (`getProfile()`, `savePlan()`, `listSessionLogs()`, etc.) that call localforage in MVP1. In MVP2, the same function signatures are reimplemented to call Supabase — the rest of the app code doesn't change.

```typescript
// packages/shared/src/db/interface.ts
// MVP1: implemented with localforage
// MVP2: reimplemented with supabase client
export interface DB {
  getProfile(): Promise<UserProfile | null>
  saveProfile(profile: UserProfile): Promise<void>
  createRace(race: Race): Promise<Race>
  // ... all entities
}
```

**Adaptation Engine in MVP1:** Runs as a pure TypeScript function called client-side (on page load / after session log). No cron — the user manually triggers "Generate next week" or it runs automatically when they open the Weekly Plan view.

---

## Repository Structure

### MVP1 (simplified)
```
trajectory/
├── apps/
│   └── web/                  # Next.js app (MVP1: no SSR/API routes needed)
│       ├── app/              # App Router pages
│       └── components/
├── packages/
│   └── shared/
│       ├── types/            # Entity types (User, Plan, Session, etc.)
│       ├── utils/            # Pace calculators, RPE helpers, date utils
│       ├── db/               # Data access layer (localforage in MVP1)
│       │   ├── interface.ts  # DB interface (shared contract)
│       │   └── local.ts      # localforage implementation
│       └── engine/           # Adaptation + plan generation algorithm
│           ├── generator.ts  # Plan generation
│           └── adaptation.ts # Fatigue detection + adaptation rules
└── package.json
```

### MVP2+ (full monorepo)
```
trajectory/
├── apps/
│   ├── mobile/               # Expo React Native app (MVP3+)
│   │   ├── app/              # Expo Router screens
│   │   └── components/
│   └── web/                  # Next.js app
│       ├── app/              # App Router pages
│       └── components/
├── packages/
│   ├── shared/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── db/
│   │   │   ├── interface.ts  # Same interface as MVP1
│   │   │   ├── local.ts      # localforage (kept for reference/testing)
│   │   │   └── supabase.ts   # Supabase implementation (MVP2)
│   │   └── engine/           # Same engine code as MVP1
│   └── ui/                   # Shared design system (v1.1)
├── supabase/
│   ├── migrations/           # DB schema
│   ├── functions/            # Edge Functions
│   └── seed.sql
├── turbo.json
└── package.json
```

---

## Database

**Engine:** PostgreSQL via Supabase

Schema maps directly to the data model defined in PRD Section 6:

| Table | Key Fields | Notes |
|---|---|---|
| `users` | id, age, experience_level, injury_history, timezone, preferences | Extends Supabase Auth user |
| `races` | id, user_id, name, distance_km, target_date, status, order | status: planned / active / completed |
| `plans` | id, user_id, race_id, start_date, end_date, duration_weeks, phase | phase: prep / recovery / transition |
| `weeks` | id, plan_id, week_number, adjustments_made, adjustment_reason | |
| `sessions` | id, week_id, type, prescribed_distance_km, prescribed_duration_min, target_intensity, road_or_trail | type: easy_run / tempo_run / long_run / strength / swim / bike / hike |
| `session_logs` | id, session_id, user_id, distance_km, duration_min, rpe, user_notes, elevation_gain_m, pace_kmh | pace_kmh is calculated field |
| `user_constraints` | id, user_id, week_id, constraint_type, description, duration_days, affected_sessions | constraint_type: illness / travel / equipment_limit / time_limit |
| `adaptation_logs` | id, plan_id, week_id, trigger_reason, changes_made, timestamp | trigger_reason: pace_drop / rpe_high / user_signal / other |

**Row Level Security (RLS):** All tables have RLS enabled. Users can only read/write their own data. No data sharing between users in MVP.

---

## Authentication

- **Provider:** Supabase Auth
- **MVP methods:** Email + password, Magic link
- **v1.1:** OAuth (Google Sign-In, Sign in with Apple)
- **Session:** JWT access tokens (1 hour expiry) + refresh tokens (stored securely in mobile Keychain / web HttpOnly cookie)
- **Mobile deep link:** `trajectory://auth/callback` for magic link handling

---

## Adaptation Engine

The adaptation engine is the core of Trajectory's value proposition. It runs as a Supabase Edge Function.

### Trigger Conditions

1. **Weekly cron** — Every Sunday at 20:00 UTC, generate the next week's adapted plan for all active users
2. **On session log** — After a session is logged, update the rolling performance baseline; check for immediate fatigue signals

### Edge Function: `adapt-plan`

**Input:** `{ userId, planId, weekId }`

**Process:**
1. Fetch last 4 weeks of session logs for the user
2. Calculate rolling pace baseline (average pace over logged easy runs)
3. Check for fatigue signals (see Algorithm Spec for rules)
4. Fetch any active `user_constraints` for the upcoming week
5. Apply adaptation rules → generate modified session list for Week N+1
6. Write updated sessions to `sessions` table
7. Write adaptation record to `adaptation_logs`
8. Trigger push notification or email to user

**Execution time target:** < 3 seconds per user

### Scaling Consideration

For MVP with < 100 active users, Sunday cron runs sequentially. At scale, this becomes a queue-based fan-out. This refactor is not needed for MVP.

---

## Data Flow: Session Logging

```
User logs session (mobile)
        │
        ▼
AsyncStorage (offline buffer)
        │
   connectivity?
   YES ──────────────────────────────────────────────┐
   NO → waits for sync                               │
                                                     ▼
                                         Supabase: INSERT session_log
                                                     │
                                                     ▼
                                    DB trigger → adapt-plan Edge Function
                                                     │
                                              update rolling baseline
                                                     │
                                         fatigue signal detected?
                                         YES → generate adapted week
                                               send push notification
                                         NO  → no action
```

---

## Data Flow: Weekly Plan Generation (Cron)

```
Sunday 20:00 UTC cron fires
        │
        ▼
For each active plan:
        │
        ▼
adapt-plan Edge Function
        │
        ├── fetch last 4 weeks session_logs
        ├── fetch upcoming user_constraints
        ├── calculate pace trend + RPE trend
        ├── apply adaptation algorithm
        ├── write Week N+1 sessions
        ├── write adaptation_log entry
        └── send notification (push / email)
```

---

## Push Notifications

- **Service:** Expo Push Notifications (wraps APNs + FCM)
- **Token storage:** `expo_push_token` field on `users` table
- **Sending:** Expo Push API called from Edge Function via HTTP
- **MVP notifications:**
  - Weekly plan ready (Sunday evening)
  - Fatigue alert with adapted plan
  - Race countdown (7 days before target date)

---

## Third-Party Integrations (v1.1+)

| Integration | Purpose | API |
|---|---|---|
| Garmin Connect | Import HR + pace data from device | Garmin Health API |
| Apple HealthKit | Import workouts from Apple Watch | HealthKit (native iOS) |
| Strava | Import logged runs; optional sync | Strava API v3 |

None of these are required for MVP. RPE-based session logging covers MVP needs.

---

## Environment Configuration

```
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # Edge Functions only, never client-side

# Expo (mobile)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# Next.js (web)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Email
RESEND_API_KEY=              # Edge Functions only
```

---

## Security Principles

- All database access from clients goes through Supabase RLS — no direct SQL from app
- `SERVICE_ROLE_KEY` is never exposed to client-side code
- User data is isolated by RLS policies — no cross-user data access
- Push tokens stored per-user; only the owning user's Edge Function call sends to that token
- No PII beyond what's needed: age (not birthdate), experience level, race goals

---

## Development Setup

### MVP1 — Local (minimal setup)

```bash
# Prerequisites: Node 20+, pnpm

git clone https://github.com/NicoJ34/Trajectory_App
cd Trajectory_App

pnpm install

# Run web app — that's it, no other services needed
pnpm --filter web dev

# Open http://localhost:3000
# All data is stored in your browser's IndexedDB
```

### MVP2+ — With Supabase

```bash
# Additional prerequisites: Supabase CLI, Supabase account

# Copy env file
cp apps/web/.env.example apps/web/.env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Apply DB migrations
supabase db push

# Run web app
pnpm --filter web dev

# Run mobile app (MVP3+)
pnpm --filter mobile start
```

---

**Document Owner:** Engineering Lead
**Last Updated:** 23 March 2026
**Next Review:** Upon stack finalization / first sprint kickoff
