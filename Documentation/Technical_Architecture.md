# TECHNICAL ARCHITECTURE
## Trajectory — Adaptive Running Training Planner

**Version:** 1.0
**Date:** 23 March 2026
**Status:** Approved

---

## Architecture Overview

Trajectory is a mobile-first + web application built on a shared backend. The architecture prioritizes developer velocity for a solo/small team, minimizes infrastructure management, and supports the adaptive planning loop defined in the PRD.

```
┌─────────────────────┐    ┌─────────────────────┐
│   Mobile App        │    │   Web App           │
│   Expo (RN)         │    │   Next.js           │
│   iOS + Android     │    │   Vercel            │
└────────┬────────────┘    └────────┬────────────┘
         │                          │
         └──────────┬───────────────┘
                    │ Supabase SDK (TypeScript)
                    ▼
         ┌──────────────────────┐
         │     Supabase         │
         │  ┌────────────────┐  │
         │  │  PostgreSQL DB │  │
         │  └────────────────┘  │
         │  ┌────────────────┐  │
         │  │  Auth (JWT)    │  │
         │  └────────────────┘  │
         │  ┌────────────────┐  │
         │  │  Edge Functions│  │ ← Adaptation Engine
         │  └────────────────┘  │
         │  ┌────────────────┐  │
         │  │  Storage       │  │
         │  └────────────────┘  │
         └──────────────────────┘
```

---

## Tech Stack

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

## Repository Structure

```
trajectory/
├── apps/
│   ├── mobile/          # Expo React Native app
│   │   ├── app/         # Expo Router screens
│   │   ├── components/
│   │   └── ...
│   └── web/             # Next.js app
│       ├── app/         # App Router pages
│       ├── components/
│       └── ...
├── packages/
│   ├── shared/          # Shared TypeScript types, utils
│   │   ├── types/       # Database entity types (User, Plan, Session, etc.)
│   │   ├── utils/       # Pace calculators, RPE helpers, date formatters
│   │   └── api/         # Supabase client factory
│   └── ui/              # Shared design system components (optional, v1.1)
├── supabase/
│   ├── migrations/      # Database schema migrations
│   ├── functions/       # Edge Functions (adaptation engine, notifications)
│   └── seed.sql         # Development seed data
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

```bash
# Prerequisites: Node 20+, pnpm, Supabase CLI, Expo CLI

git clone https://github.com/NicoJ34/Trajectory_App
cd Trajectory_App

pnpm install

# Start Supabase locally
supabase start

# Apply migrations
supabase db push

# Run web app
pnpm --filter web dev

# Run mobile app
pnpm --filter mobile start
```

---

**Document Owner:** Engineering Lead
**Last Updated:** 23 March 2026
**Next Review:** Upon stack finalization / first sprint kickoff
