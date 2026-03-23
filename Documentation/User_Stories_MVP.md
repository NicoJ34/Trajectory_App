# USER STORIES — MVP
## Trajectory — Adaptive Running Training Planner

**Version:** 1.0
**Date:** 23 March 2026
**Scope:** Phase 1 (Weeks 1-8) + Phase 2 (Weeks 9-12) per PRD roadmap

---

## Epic Overview

| Epic | Phase | PRD Section |
|---|---|---|
| E1 — Authentication & Onboarding | Phase 1 | Section 4, Journey 1 |
| E2 — Plan Generation | Phase 1 | Section 2, 5.1 |
| E3 — Weekly Plan View | Phase 1 | Section 5.1 |
| E4 — Session Logging | Phase 1 | Section 5.1 |
| E5 — Constraint Signaling | Phase 1 | Section 5.1 |
| E6 — Adaptation Engine | Phase 1 | Section 2, 5.1 |
| E7 — Dashboard | Phase 1 | Section 5.1 |
| E8 — Multi-Race Calendar | Phase 2 | Section 5.1 |
| E9 — Plan Flexibility | Phase 2 | Section 5.1 |

---

## E1 — Authentication & Onboarding

### US-101: Sign Up
**As an** intermediate runner discovering Trajectory,
**I want to** create an account with my email and password,
**So that** my training data is saved and secure.

**Acceptance Criteria:**
- [ ] I can enter email + password on the sign-up screen
- [ ] I receive a confirmation email after sign-up
- [ ] If my email is already registered, I see a clear error: "An account with this email already exists"
- [ ] Password must be at least 8 characters; shown inline if too short
- [ ] After confirmation, I am taken to the Profile Setup screen

---

### US-102: Sign In
**As a** returning user,
**I want to** sign in with my email and password,
**So that** I can access my existing training plan.

**Acceptance Criteria:**
- [ ] I can sign in with email + password
- [ ] If credentials are wrong, I see: "Incorrect email or password"
- [ ] After sign-in, I land on my Dashboard
- [ ] Session persists — I stay signed in on app restart (refresh token)

---

### US-103: Profile Setup
**As a** new user,
**I want to** enter my running profile (experience, weekly volume, availability, terrain preference),
**So that** Trajectory can generate a relevant training plan for me.

**Acceptance Criteria:**
- [ ] I can select my experience level: Beginner / Intermediate / Advanced
- [ ] I can enter my current weekly running volume (0-100 km)
- [ ] I can select available training days per week (3 / 4 / 5 / 6)
- [ ] I can select terrain preference: Road / Trail / Both
- [ ] I can optionally note recent injuries (free text)
- [ ] All required fields are validated before I can proceed
- [ ] I can go back to edit before confirming

---

### US-104: Race Setup
**As a** new user completing onboarding,
**I want to** enter my target race (distance + date),
**So that** Trajectory generates a plan that ends on my race day.

**Acceptance Criteria:**
- [ ] I can select race distance: 10K / Half-Marathon / Marathon
- [ ] I can optionally name my race
- [ ] I select a target date via date picker
- [ ] If the date is less than 8 weeks away, I see a warning: "This is tight! Trajectory works best with 8+ weeks. Your plan will be adapted."
- [ ] I can still proceed with a date < 8 weeks
- [ ] The plan duration in weeks is shown before I confirm: "Your plan: 14 weeks to [Race Name]"

---

### US-105: Plan Preview and Confirmation
**As a** new user,
**I want to** see a preview of my generated plan before starting,
**So that** I understand what I'm committing to.

**Acceptance Criteria:**
- [ ] After race setup, the plan is generated in < 3 seconds (loading indicator shown)
- [ ] I see: total weeks, phase breakdown, first week's sessions (type + distance/duration)
- [ ] I can confirm "Start Training" to lock in the plan
- [ ] I can request a minor adjustment (reduce days/week) and the plan regenerates
- [ ] After confirmation, I am taken to the Dashboard

---

## E2 — Plan Generation

### US-201: Generate Plan to Race Date
**As a** user who has completed onboarding,
**I want** the system to generate a full training plan from today to my race date,
**So that** every week is purposeful and leads to race readiness.

**Acceptance Criteria:**
- [ ] Plan duration = weeks from today to race date (minimum 8)
- [ ] Plan follows base → build → peak → taper phases
- [ ] Weekly volume starts from user's current volume and progresses +10%/week with deload every 4th week
- [ ] Each week contains: easy runs, 1 long run, 1 tempo (build/peak phases), 1 cross-training, rest days
- [ ] Sessions are assigned to days based on user's available training days
- [ ] Long run is assigned to a weekend day (Saturday or Sunday)
- [ ] Plan is stored in database and linked to the user's race

---

### US-202: Validate Minimum Plan Duration
**As a** user trying to create a plan for a race in 5 weeks,
**I want** to be warned that this is below the recommended minimum,
**So that** I set realistic expectations about my preparation quality.

**Acceptance Criteria:**
- [ ] If race date < 8 weeks away, a warning is shown during race setup
- [ ] Warning text: "5 weeks is below our recommended 8-week minimum. We'll create a compressed plan, but results may vary."
- [ ] User can proceed or change the date
- [ ] If user proceeds, plan is generated with compressed phases (no rejection)

---

## E3 — Weekly Plan View

### US-301: View Current Week's Sessions
**As a** runner in an active plan,
**I want to** see all my sessions for the current week in one view,
**So that** I can plan my week around my training.

**Acceptance Criteria:**
- [ ] I can see all 7 days of the current week
- [ ] Each day shows: session type, prescribed distance or duration, intensity (Easy/Moderate/Hard), terrain (Road/Trail)
- [ ] Rest days are shown as "Rest" or "Recovery"
- [ ] Logged sessions are visually distinguished from unlogged ones
- [ ] Today is highlighted
- [ ] I can navigate to previous and next weeks

---

### US-302: View Session Detail
**As a** runner before a training session,
**I want to** see a full description of what's expected in today's session,
**So that** I know exactly how to execute it.

**Acceptance Criteria:**
- [ ] Tapping a session shows: type, distance, estimated duration, intensity level with explanation, terrain, coaching tip
- [ ] Intensity explanation is in plain language (e.g., "Easy — you should be able to hold a full conversation")
- [ ] I can log the session directly from the detail screen
- [ ] I can mark it as skipped from the detail screen

---

## E4 — Session Logging

### US-401: Log a Completed Session
**As a** runner who just finished a training session,
**I want to** quickly record what I did (distance, time, effort),
**So that** Trajectory can track my progress and adapt my plan.

**Acceptance Criteria:**
- [ ] Log form shows: distance (km), duration (hh:mm), RPE (Easy/Moderate/Hard), optional notes, optional elevation gain
- [ ] Distance and duration are pre-filled with prescribed values
- [ ] I can adjust any field before saving
- [ ] Pace is calculated automatically on save: pace = duration / distance
- [ ] After saving, the session is marked as "Logged" in the weekly view
- [ ] I receive a brief confirmation message (not a full-page modal)
- [ ] The form can be completed in under 60 seconds

---

### US-402: Log a Session Offline
**As a** runner in an area without connectivity,
**I want to** log my session even without internet,
**So that** my data isn't lost.

**Acceptance Criteria:**
- [ ] Session log form works with no internet connection
- [ ] Logged session is stored locally (AsyncStorage)
- [ ] When connectivity returns, the local session syncs to the server automatically
- [ ] User sees a sync status indicator (synced / pending sync)
- [ ] No data is lost between offline logging and online sync

---

### US-403: Log a Skipped Session
**As a** runner who missed a planned session,
**I want to** mark it as skipped without penalty,
**So that** my log is accurate and Trajectory knows about the gap.

**Acceptance Criteria:**
- [ ] I can mark any session as "Skipped"
- [ ] The UI uses neutral, non-judgmental language: "Session skipped — no worries, life happens."
- [ ] Skipped sessions are counted in the consistency score but not highlighted negatively
- [ ] I can optionally add a note about why I skipped

---

### US-404: Log Cross-Training Session
**As a** runner who completed a strength or swim session,
**I want to** log it in the same app as my runs,
**So that** my full training load is tracked.

**Acceptance Criteria:**
- [ ] Cross-training log form shows: activity type (confirmed from session), duration (minutes), RPE, notes
- [ ] No distance field for non-running activities (except cycling, which optionally shows km)
- [ ] Logged data stored in session_logs with correct session_id
- [ ] Cross-training sessions appear in history alongside running sessions

---

## E5 — Constraint Signaling

### US-501: Signal a Weekly Constraint
**As a** runner with a constraint affecting my training (travel, illness, etc.),
**I want to** tell Trajectory what's happening this week,
**So that** my plan is adjusted instead of me just missing sessions.

**Acceptance Criteria:**
- [ ] I can access constraint input from the Weekly Plan View
- [ ] I can select constraint type: Travelling / Feeling ill or tired / Equipment not available / Time limited / Other
- [ ] Each type shows relevant sub-options (e.g., for Travel: dates affected, road-only)
- [ ] After submitting, the plan for the week is updated within 30 seconds
- [ ] I see a confirmation: "Your plan has been adjusted for this week."
- [ ] The adapted sessions replace the original ones in the weekly view
- [ ] I can dismiss without submitting (no constraint applied)

---

### US-502: View Why My Plan Changed
**As a** runner whose plan was automatically adapted,
**I want to** understand why my sessions changed,
**So that** I trust the system and feel informed.

**Acceptance Criteria:**
- [ ] When a week has been adapted, an indicator is shown in the Weekly Plan View: "Plan adjusted this week"
- [ ] Tapping the indicator shows: reason for change + list of modifications made (e.g., "Volume reduced by 15% due to detected fatigue")
- [ ] The explanation is in plain language, not technical terms
- [ ] I can override the adaptation and restore the original plan (with confirmation warning)

---

## E6 — Adaptation Engine

### US-601: Auto-Detect Fatigue and Adapt Plan
**As a** runner showing signs of fatigue (pace dropping, high RPE),
**I want** Trajectory to automatically adjust my upcoming week,
**So that** I recover without abandoning my plan.

**Acceptance Criteria:**
- [ ] The system checks for fatigue signals every Sunday (cron) and after each session log
- [ ] Fatigue triggers: pace drop > 8% over 2 weeks, OR > 50% of sessions logged as "Hard" on easy-prescribed sessions
- [ ] When triggered: next week's volume is reduced by 10-20%, at least 1 tempo converted to easy run
- [ ] User receives a notification: "We've detected some fatigue. Your plan has been adjusted to help you recover."
- [ ] The adaptation is logged with reason in adaptation_logs
- [ ] User can accept or override the adaptation

---

### US-602: Adapt Plan for User-Reported Illness
**As a** runner who is sick and has signaled illness,
**I want** my training week to be significantly reduced,
**So that** I don't overtrain while my body heals.

**Acceptance Criteria:**
- [ ] When illness constraint is submitted, volume is reduced by 20-30%
- [ ] All intensity sessions are converted to easy runs or rest
- [ ] Message: "Your body needs rest to recover. We've lightened your week."
- [ ] If user reports injury (sub-type), running sessions are replaced with low-impact cross-training where possible
- [ ] Adaptation logged with trigger_reason: user_signal

---

### US-603: Positive Adaptation — Increase Challenge
**As a** runner who is consistently performing well,
**I want** Trajectory to recognize my progress and slightly increase the challenge,
**So that** I keep improving.

**Acceptance Criteria:**
- [ ] Positive signals: pace improves > 5% over 3 weeks AND consistency score > 90%
- [ ] When detected: next week's volume increased by an additional 5% (capped at +15% total)
- [ ] An optional challenge session may be added (labeled "Optional — attempt if feeling strong")
- [ ] No notification for positive adaptation (users discover it naturally)
- [ ] Logged in adaptation_logs

---

## E7 — Dashboard

### US-701: See Today's Session at a Glance
**As a** runner opening the app in the morning,
**I want to** immediately see what I'm supposed to do today,
**So that** I can plan my day accordingly.

**Acceptance Criteria:**
- [ ] Dashboard shows today's session as the primary content (type, distance/duration, intensity)
- [ ] If no session today, shows "Rest day" with a brief note
- [ ] If session already logged today, shows "Session complete" with summary
- [ ] Race countdown visible on dashboard (e.g., "42 days to [Race Name]")
- [ ] Dashboard loads within 2 seconds

---

### US-702: See Last Week's Summary
**As a** runner reviewing my progress,
**I want to** see a quick summary of last week's training,
**So that** I feel a sense of accomplishment and stay motivated.

**Acceptance Criteria:**
- [ ] Dashboard shows: sessions completed / sessions planned (e.g., "5 of 6 sessions")
- [ ] Brief encouraging message based on consistency (> 80%: "Great week!", 60-80%: "Good effort!", < 60%: "We'll build from here.")
- [ ] No negative language for low consistency

---

## E8 — Multi-Race Calendar (Phase 2)

### US-801: Add Multiple Races to Calendar
**As a** runner planning both a half-marathon in June and a marathon in October,
**I want to** add both races to Trajectory,
**So that** my full year of training is managed in one place.

**Acceptance Criteria:**
- [ ] I can add up to 5 races to my training calendar
- [ ] Races are ordered chronologically automatically
- [ ] Each race has its own preparation plan
- [ ] A transition/recovery phase (1-2 weeks) is automatically inserted between races
- [ ] The calendar view shows all plans chained: "Plan 1 (14 weeks) → Recovery (2 weeks) → Plan 2 (20 weeks)"

---

### US-802: View Full Training Timeline
**As a** runner with multiple races planned,
**I want to** see a visual overview of my entire training year,
**So that** I understand the big picture.

**Acceptance Criteria:**
- [ ] The Race Calendar screen shows all races with their dates and plan phases
- [ ] Timeline shows current position ("You are here — Week 6 of 14")
- [ ] Transition phases between races are labeled
- [ ] I can tap any race to see its plan details

---

## E9 — Plan Flexibility (Phase 2)

### US-901: Push Race Date Back
**As a** runner who needs to delay my target race (due to injury or life circumstances),
**I want to** push my race date back by a few weeks,
**So that** my plan extends without me having to start over.

**Acceptance Criteria:**
- [ ] I can change the target date for any active race
- [ ] If new date is > 2 weeks later than current, I see a confirmation: "This will extend your plan by X weeks. Continue?"
- [ ] Plan weeks are recalculated: additional weeks inserted maintaining correct phase progression
- [ ] Already completed weeks are not affected
- [ ] New date must be at least 2 weeks away from current date (immediate races cannot be pushed)

---

## Non-Functional Requirements

| Requirement | Target |
|---|---|
| App load time (cold start) | < 3 seconds |
| Plan generation time | < 3 seconds |
| Adaptation Engine cron (per user) | < 3 seconds |
| Session log save | < 1 second |
| Dashboard load (authenticated) | < 2 seconds |
| Offline session log sync | Within 30 seconds of reconnect |
| API error rate | < 1% |
| Mobile crash rate | < 0.1% per session |

---

## Out of Scope for MVP

The following are explicitly excluded from MVP (Phase 1 + 2) scope:

- Heart rate zone integration (v1.1)
- Strava / Garmin / Apple Health import (v1.1)
- Social / community features (post-MVP)
- AI audio coaching during runs (post-MVP)
- Weather-based adaptation (post-MVP)
- Nutrition and sleep tracking (post-MVP)
- Triathlon / multi-sport planning (post-MVP)

---

**Document Owner:** Product Lead
**Last Updated:** 23 March 2026
**Next Review:** Sprint 1 kickoff
