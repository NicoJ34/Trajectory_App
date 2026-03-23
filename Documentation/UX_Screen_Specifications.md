# UX SCREEN SPECIFICATIONS
## Trajectory — Adaptive Running Training Planner

**Version:** 1.0
**Date:** 23 March 2026
**Status:** Functional specs — wireframes to be produced by design team

---

## Purpose

This document defines what each screen must do and show. It is not a visual design document — layout and styling follow the Brand Guidelines. This spec ensures developers and designers share the same understanding of each screen's function before implementation.

---

## Screen Inventory

### Mobile App
1. Onboarding — Welcome
2. Onboarding — Profile Setup
3. Onboarding — Race Setup
4. Onboarding — Plan Preview
5. Dashboard (Home)
6. Weekly Plan View
7. Session Detail
8. Session Log Form
9. Constraint Input
10. Race Calendar
11. Profile & Settings

### Web App
1. Landing / Auth
2. Onboarding Flow (mirrors mobile, desktop layout)
3. Dashboard (Home)
4. Weekly Plan View (expanded)
5. Training History & Analytics
6. Race Calendar Management
7. Profile & Settings

---

## Mobile Screens

---

### M1 — Onboarding: Welcome

**Purpose:** First impression, communicate value proposition, drive sign-up

**Content:**
- App name + tagline: "Your Perfect Race Path"
- 3-slide carousel covering core USPs:
  1. "Plans that adapt to you" (adaptive planning)
  2. "Signal your life, we adjust" (context awareness)
  3. "From first run to finish line" (full plan to race)
- CTA: "Get Started" → M2
- Secondary: "Sign in" → auth flow

**Key requirement:** No data collection on this screen. Pure value communication.

---

### M2 — Onboarding: Profile Setup

**Purpose:** Collect the minimum needed to generate a plan. Keep it short — max 5 questions.

**Questions (in order):**
1. "What's your running experience?" — Beginner (< 1 year) / Intermediate (1-3 years) / Advanced (3+ years)
2. "How many km do you run per week currently?" — Numeric input or slider (0-100 km)
3. "How many days per week can you train?" — 3 / 4 / 5 / 6 days
4. "Do you prefer road, trail, or both?" — Road / Trail / Both
5. "Any recent injuries we should know about?" — Free text, optional ("No injuries" default)

**Navigation:** Progress bar (step 1 of 3). Back button. "Continue" CTA → M3.

**Validation:** Experience and weekly days are required. Others optional but encouraged.

---

### M3 — Onboarding: Race Setup

**Purpose:** Capture target race(s). This determines plan duration.

**Content:**
- "What race are you training for?" header
- Race card with:
  - Distance selector: 10K / Half-Marathon (21K) / Marathon (42K)
  - Race name (text input, optional)
  - Target date (date picker — must be > 8 weeks from today)
- "Add another race" option (up to 5 races, secondary CTA)
- Warning banner if selected date < 8 weeks away: "This is tight! Trajectory works best with 8+ weeks. You can continue, but expect an accelerated plan."

**Navigation:** Progress bar (step 2 of 3). Back to M2. "Generate My Plan" CTA → M4.

---

### M4 — Onboarding: Plan Preview

**Purpose:** Show the generated plan, build confidence, get commitment.

**Content:**
- "Your plan is ready" header
- Plan summary card:
  - Race name + distance + target date
  - Total weeks
  - Phase breakdown (e.g., "6 weeks base → 3 weeks build → 2 weeks taper")
  - First week preview: list of 5-6 sessions with type, distance/duration
- "Adjust plan" option: reduce days/week, change focus (secondary CTA → settings adjustment)
- "Start Training" CTA → Dashboard (M5)

**Key requirement:** Plan generation must complete within 3 seconds. Show loading state while generating.

---

### M5 — Dashboard (Home)

**Purpose:** Daily entry point. Answer "what do I do today?" at a glance.

**Content (top to bottom):**
1. **Header:** "Good morning, [Name]" + current date
2. **Today's Session card:**
   - Session type + icon (e.g., Easy Run, Strength)
   - Prescribed distance or duration
   - Intensity indicator (Easy / Moderate / Hard badge)
   - "Log Session" CTA
   - "Skip / Reschedule" option (secondary)
3. **Race Countdown:** "42 days to [Race Name]" with progress bar (weeks elapsed / total)
4. **Last Week Summary:** Sessions completed / sessions planned (e.g., "5/6 sessions — great week!")
5. **Quick nav bar:** Home | Week | History | Profile

**States:**
- Rest day: "Today is a rest day. Recovery is part of training."
- Session logged: checkmark + "Well done. See you tomorrow."
- No plan: onboarding CTA

---

### M6 — Weekly Plan View

**Purpose:** Full week overview. Show all sessions, allow quick navigation.

**Content:**
- Week header: "Week 4 of 14 — Base Phase"
- 7-day horizontal scroll or list
- Each day shows:
  - Day name + date
  - Session type + distance/duration
  - Status: Planned / Logged / Skipped / Rest
- Tapping a session → M7 (Session Detail)
- "Signal constraint for this week" floating button → M9

**Indicators:**
- Logged sessions: filled/colored
- Missed sessions: grayed out (no red — brand tone is supportive)
- Today: highlighted border

---

### M7 — Session Detail

**Purpose:** Full session info before and after logging.

**Content (pre-log state):**
- Session type + phase context
- Prescribed distance + estimated duration
- Intensity with explanation (e.g., "Easy — Zone 1-2. You should be able to hold a full conversation.")
- Tips for the session (e.g., "Today's long run: start slower than you think you need to.")
- Route/terrain: Road or Trail badge
- "Log this session" primary CTA
- "Mark as skipped" secondary CTA

**Content (post-log state):**
- Logged data summary (distance, time, RPE, pace)
- Comparison: Prescribed vs. Actual
- Motivational message based on performance

---

### M8 — Session Log Form

**Purpose:** Record what actually happened. Fast and frictionless — target < 60 seconds to complete.

**Fields:**
1. Distance (km) — numeric input with +/- buttons. Pre-filled with prescribed distance.
2. Duration (hh:mm) — time picker. Pre-filled with estimated duration.
3. Effort (RPE) — 3-option visual selector: Easy / Moderate / Hard (not a 1-10 scale for MVP)
4. Notes — optional free text (placeholder: "How did it feel? Anything notable?")
5. Elevation gain (m) — optional numeric, relevant for trail sessions

**Navigation:** "Save Session" CTA. Auto-calculates pace on save.

**Shortcut:** If user taps "Log Session" from Dashboard and all looks right, allow one-tap confirm ("Logged as planned — all good?") with option to edit.

---

### M9 — Constraint Input

**Purpose:** Let users signal life events that affect training for the upcoming week.

**Content:**
- "Anything affecting your training this week?" header
- Constraint type selector:
  - Travelling (sub-fields: dates affected, road-only or limited equipment)
  - Feeling ill or tired (sub-fields: severity — mild / moderate)
  - Equipment not available (sub-fields: what's unavailable — gym / bike / pool)
  - Time limited this week (sub-fields: how many days affected)
  - Other (free text)
- "Apply to plan" CTA → triggers adaptation engine
- "No constraints — I'm good" dismiss option

**Trigger:** Accessible from Weekly Plan View (floating button) or Sunday notification.

---

### M10 — Race Calendar

**Purpose:** View all planned races and their plan status.

**Content:**
- List of races in chronological order
- Each race card:
  - Race name + distance + target date
  - Status badge: In Preparation / Upcoming / Completed
  - Weeks remaining (if active)
  - Plan phase (if active)
- "Add race" CTA (limited on mobile — redirect to web for full management)
- Tap race → plan overview for that race

---

### M11 — Profile & Settings

**Content:**
- User profile (name, experience level, weekly days)
- Notification preferences (push on/off per type)
- Units (km / miles)
- Preferred weekly review day (default Sunday)
- Account: email, password change, sign out
- About / version

---

## Web Screens

---

### W1 — Landing / Auth

**Purpose:** Entry point for new and returning users.

**Content:**
- Hero: tagline + value prop + "Start free" CTA
- Feature highlights (3 sections matching USPs from brand guidelines)
- Sign in / Sign up forms
- No separate marketing pages needed for MVP — this page handles both landing and auth

---

### W2 — Onboarding (Web)

Same flow as mobile (M2-M4) but in a multi-step wizard layout optimized for desktop. All questions visible in a two-column layout. Plan preview shows a full calendar-style week view.

---

### W3 — Dashboard (Web)

**Expanded version of M5. Left sidebar navigation.**

**Layout:**
- Left sidebar: nav links (Dashboard, Weekly Plan, History, Race Calendar, Settings)
- Main area:
  - Today's session card (same as mobile)
  - Race countdown banner
  - Weekly overview (current week, all 7 days)
  - Last 4 weeks trend chart (volume + consistency %)

---

### W4 — Weekly Plan View (Web)

**Full calendar grid showing the current week.**

**Content:**
- 7-day grid with sessions per day
- Each session: type, distance, intensity, log status
- Side panel: click any session to see detail and log it
- Week navigation: previous / next week arrows
- Constraint input panel (integrated in sidebar, not a separate screen)
- Adaptation log: "Why did your plan change this week?" expandable section (shows adaptation_logs entry)

---

### W5 — Training History & Analytics

**Purpose:** Visualize progress over time. Available on web only for MVP (mobile shows summary only).

**Content:**
- Weekly volume chart (bar chart — last 12 weeks)
- Easy run pace trend (line chart — improving over time)
- Consistency score per week (% sessions completed)
- Session log table: filterable by type, date range
- RPE distribution (pie or bar: % Easy / Moderate / Hard)

---

### W6 — Race Calendar Management

**Purpose:** Add, edit, remove races. View full training timeline.

**Content:**
- Timeline view: horizontal scroll showing all plan phases for all races
- Race list with edit/delete per race
- "Add race" form: distance, name, target date, terrain preference
- Transition phases shown between races (labeled "Recovery" or "Transition")
- Warning for overlapping plans or < 8 week window

---

### W7 — Profile & Settings (Web)

Extended version of mobile settings. Includes:
- All mobile settings
- Connected accounts (Strava, Garmin — v1.1 placeholders)
- Data export (CSV of all session logs)
- Account deletion

---

## Navigation Flows

### First-Time User (Mobile)
```
Welcome → Profile Setup → Race Setup → Plan Preview → Dashboard
```

### Returning User — Daily (Mobile)
```
Push notification → Dashboard → Session Detail → Session Log Form → Dashboard (updated)
```

### Weekly Review (Mobile or Web)
```
Sunday notification → Weekly Plan View → Constraint Input → Adapted Plan View
```

### Race Management (Web)
```
Race Calendar → Add Race → Plan Preview → Timeline View
```

---

## Error & Empty States

| Screen | Empty State | Error State |
|---|---|---|
| Dashboard | No plan yet → "Let's set up your first race" CTA | API error → "Something went wrong. Pull to refresh." |
| Weekly Plan | No sessions → "Your week hasn't been generated yet" | — |
| Session Log | — | Invalid input → inline field validation |
| Race Calendar | No races → "Add your first race" CTA | — |
| History | No data yet → "Log your first session to start seeing your progress" | — |

---

**Document Owner:** Product / Design Lead
**Last Updated:** 23 March 2026
**Next Review:** Upon design system delivery (Q2 2026)
