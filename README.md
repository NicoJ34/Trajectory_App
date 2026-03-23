# Trajectory

**Your Perfect Race Path** — An adaptive training planner for intermediate runners preparing for 10K to marathon distances.

---

## What is Trajectory?

Trajectory creates personalized running training plans that adapt in real-time based on your performance, life circumstances (travel, illness, equipment limits), and recovery signals. Unlike static plans, Trajectory modifies your weekly sessions while keeping your race date on track.

**Target users:** Intermediate runners (1-3 years experience) training for 10K, half-marathon, or marathon.

---

## Project Status

**Stage:** Pre-Development — Discovery & Requirements
**MVP Target:** Phase 1 (Weeks 1-8, see PRD roadmap)

---

## Documentation

| Document | Description | Status |
|---|---|---|
| [PRD](Documentation/PRD_Planificateur_Running_MVP.md) | Full product requirements, personas, features, data model, KPIs | Done |
| [Brand Guidelines](Documentation/Trajectory_Brand_Guidelines.md) | Brand identity, tone of voice, visual system, messaging | Done |
| [Platform Strategy](Documentation/Platform_Strategy.md) | Mobile + web usage model, surface responsibilities, distribution | Done |
| [Technical Architecture](Documentation/Technical_Architecture.md) | Tech stack, backend, data flow, infrastructure | Done |
| [Adaptation Algorithm Spec](Documentation/Algorithm_Adaptation_Spec.md) | Training methodology, plan generation rules, adaptation logic | Done |
| [UX Screen Specifications](Documentation/UX_Screen_Specifications.md) | Screen inventory, functional specs per surface | Done |
| [API Contract](Documentation/API_Contract.md) | Endpoints, request/response schemas, auth, error handling | Done |
| [User Stories MVP](Documentation/User_Stories_MVP.md) | Epics, user stories, acceptance criteria | Done |

---

## Tech Stack (Planned)

| Layer | Technology |
|---|---|
| Mobile | Expo (React Native) — iOS + Android |
| Web | Next.js |
| Backend / Database | Supabase (PostgreSQL + Auth + Storage) |
| Adaptation Engine | Supabase Edge Functions |
| Push Notifications | Expo Push + Email via Resend |
| Language | TypeScript (shared across all surfaces) |

---

## Key Features (MVP)

- Personalized training plan generated to your race date (minimum 8 weeks)
- Weekly adaptive adjustments based on performance and RPE
- Contextual constraint signaling (illness, travel, equipment limits)
- Session logging (distance, time, RPE, notes, elevation)
- Cross-training integration (strength, swimming, cycling, hiking)
- Multi-race calendar with automatic transition phases
- Dashboard with countdown, weekly summary, and next week preview

---

## Links

- PRD: [Documentation/PRD_Planificateur_Running_MVP.md](Documentation/PRD_Planificateur_Running_MVP.md)
- Brand: [Documentation/Trajectory_Brand_Guidelines.md](Documentation/Trajectory_Brand_Guidelines.md)
