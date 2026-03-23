# ADAPTATION ALGORITHM SPECIFICATION
## Trajectory — Adaptive Running Training Planner

**Version:** 1.0
**Date:** 23 March 2026
**Status:** v1 — To be validated with beta testers (Week 9-12 per PRD roadmap)

---

## Purpose

This document defines the rules that power Trajectory's core value proposition: plans that adapt to the runner. It covers:

1. Training methodology (the base model)
2. Plan generation rules (how initial plans are structured)
3. Performance baseline calculation
4. Fatigue and signal detection
5. Adaptation decision tree
6. Cross-training load equivalence

This spec is intentionally kept rule-based for MVP. Machine learning or more sophisticated models are post-MVP.

---

## 1. Training Methodology

### Base Model: Polarized Training (80/20)

Trajectory uses a polarized training distribution as the foundation:

- **80% of weekly running volume** at low intensity (easy pace, Zone 1-2)
- **20% of weekly running volume** at high intensity (tempo, intervals, race pace)
- **0% in the "moderate" grey zone** — this zone accumulates fatigue without building fitness

This model is evidence-based (Seiler et al.), proven effective for amateur runners, and straightforward to implement with RPE as the intensity proxy.

### Intensity Zones (RPE-Based for MVP)

| Zone | RPE | Pace Feel | Session Types |
|---|---|---|---|
| Zone 1 (Easy) | 1-3 / 10 | Conversational, very comfortable | Easy run, recovery run, warm-up/cool-down |
| Zone 2 (Aerobic) | 4-5 / 10 | Comfortable, can speak in sentences | Long run (majority), easy run |
| Zone 3 (Tempo) | 6-7 / 10 | Comfortably hard, short sentences | Tempo run, cruise intervals |
| Zone 4 (Hard) | 8-9 / 10 | Very hard, few words | Interval sessions, hill repeats |

MVP uses a simplified 3-level RPE: **Easy / Moderate / Hard** (maps to Zone 1-2 / Zone 3 / Zone 4)

### Training Phases

Each plan follows a periodized structure divided into phases:

| Phase | Duration | Focus | Volume Trend |
|---|---|---|---|
| **Base** | Weeks 1 to N-6 | Build aerobic base, establish consistency | Progressive (+10%/week, deload every 4th) |
| **Build** | Weeks N-5 to N-3 | Increase intensity, race-specific work | Moderate volume, higher intensity |
| **Peak** | Week N-2 | Final quality sessions, confidence | Volume reduction begins |
| **Taper** | Week N-1 | Rest and sharpen, race-ready | Volume -40 to -60% vs. peak week |
| **Race Week** | Week N | Race day + recovery guidance | Minimal running, focus on readiness |

Where N = total plan duration in weeks (= weeks from start to race date, minimum 8).

---

## 2. Plan Generation Rules

### Session Type Distribution per Week (Base Phase)

| Plan Duration | Weekly Sessions | Easy Runs | Long Run | Tempo/Intensity | Cross-Training | Rest Days |
|---|---|---|---|---|---|---|
| 8-10 weeks | 5-6 | 2 | 1 | 1 | 1-2 | 1-2 |
| 11-14 weeks | 6 | 2 | 1 | 1-2 | 1 | 1 |
| 15+ weeks | 6-7 | 2-3 | 1 | 2 | 1 | 1 |

### Volume Progression Rules

- **Week-over-week increase:** Max +10% total weekly running volume
- **Deload week:** Every 4th week, reduce volume by -20 to -25% (recovery week)
- **Long run progression:** +1 km per week during base phase, capped at race distance -3 km (no need to run full marathon in training)
- **Taper:** Week N-1 = 50-60% of peak week volume; race week = 20-30%

### Starting Volume Calculation

Based on user's self-reported current weekly running volume during onboarding:

| Current Volume | Plan Start Volume |
|---|---|
| 0-20 km/week | 20 km/week |
| 20-40 km/week | User's current volume |
| 40+ km/week | User's current volume (plan builds from there) |

### Session Duration vs. Distance

Sessions are prescribed in **both distance AND estimated duration** based on the user's recent pace:

```
estimated_duration = prescribed_distance / rolling_easy_pace
```

If no sessions logged yet (Week 1), use default paces from onboarding:
- Beginner: 7:00 min/km easy, 5:30 min/km tempo
- Intermediate: 6:00 min/km easy, 4:45 min/km tempo
- Advanced: 5:00 min/km easy, 4:00 min/km tempo

---

## 3. Performance Baseline Calculation

The rolling baseline is recalculated after each session log.

### Easy Run Pace Baseline

Tracks average pace for **easy runs only** (RPE = Easy). Tempo and hard sessions are excluded to avoid baseline inflation.

```
rolling_easy_pace = average(last N easy run paces)
```

Where N = min(session count, 6). Uses last 6 easy runs maximum for responsiveness.

### RPE Trend

Tracks consistency of perceived effort vs. prescribed intensity:

```
rpe_trend = (count of sessions logged as "Hard" in last 3 weeks) / (total sessions in last 3 weeks)
```

High rpe_trend (> 0.5 on prescribed easy sessions) is a fatigue signal.

### Consistency Score

```
consistency_score = (sessions_logged / sessions_prescribed) over last 4 weeks
```

Used for adaptation decisions and KPI tracking.

---

## 4. Signal Detection

### Fatigue Signals

The algorithm checks for fatigue signals each Sunday (cron) and after each session log.

| Signal | Condition | Severity |
|---|---|---|
| Pace drop | rolling_easy_pace degrades > 8% over 2 consecutive weeks | Medium |
| High RPE | > 50% of sessions logged as "Hard" in last 2 weeks (on easy-prescribed sessions) | Medium |
| User signal | User reports illness, injury, or excessive fatigue via constraint input | High |
| Low consistency | consistency_score < 0.6 over last 3 weeks | Low |

### Overtraining Early Warning

If **two or more Medium signals** are detected simultaneously, classify as **High** severity.

### Positive Signals

| Signal | Condition |
|---|---|
| Strong performance | rolling_easy_pace improves > 5% over 3 weeks |
| High consistency | consistency_score > 0.9 over 4 weeks |
| Low RPE | > 70% of sessions logged as "Easy" |

Positive signals can trigger plan progression (increase challenge).

---

## 5. Adaptation Decision Tree

### On Fatigue Signal (High Severity)

Triggered by: user-reported illness/injury, or 2+ medium signals

```
1. Reduce next week's running volume by 20-30%
2. Replace all tempo/intensity sessions with easy runs
3. Add 1 rest day (remove lowest-priority session)
4. Notify user: "We've detected fatigue signals. Your plan has been adjusted to help you recover."
5. Log to adaptation_logs (trigger_reason: user_signal or pace_drop+rpe_high)
```

If user reports **injury to a specific body part**, also:
- Remove high-impact sessions (replace running with swim or bike if available)
- Add note to session descriptions: "Low impact only — listen to your body"

### On Fatigue Signal (Medium Severity — single signal)

```
1. Reduce next week's running volume by 10%
2. Reduce intensity of 1 tempo session (convert to easy run)
3. Notify user with explanation
4. Log to adaptation_logs
```

### On Low Consistency (Low Severity)

```
1. No volume reduction
2. Simplify the week slightly (fewer session types, clearer instructions)
3. Log to adaptation_logs (trigger_reason: other)
4. No notification (avoid nagging)
```

### On Positive Signals

```
1. Increase next week's volume by +5% (in addition to normal +10%, capped at +15% total)
2. Add 1 optional intensity session (labeled "optional — attempt if feeling strong")
3. No notification (let the user notice the challenge)
4. Log to adaptation_logs (trigger_reason: other)
```

### On User Constraint (Travel, Equipment Limit, Time Limit)

```
For constraint_type = travel:
  - Replace trail sessions with road sessions
  - Shorten long run if travel days overlap (reduce by proportion of travel days)
  - Keep total volume as close to target as possible

For constraint_type = equipment_limit:
  - Remove sessions requiring unavailable equipment
  - Replace gym/strength sessions with bodyweight alternatives
  - Note in session description: "No gym available — adapted to bodyweight"

For constraint_type = time_limit:
  - Reduce all session durations proportionally
  - Prioritize: Long run > Easy runs > Tempo > Cross-training
  - If week is severely time-limited (< 50% normal), apply fatigue protocol above
```

### Race Date Push

If the user requests to push the race date back:

```
1. Recalculate plan end_date = new race date
2. Recalculate duration_weeks
3. Insert additional weeks between current position and new end_date
4. Apply normal phase progression to the extended plan
5. Do NOT retroactively change completed weeks
```

Maximum date push: 4 weeks without user confirmation; beyond 4 weeks, show warning that it constitutes a significant change.

---

## 6. Cross-Training Load Equivalence

Cross-training sessions contribute to overall weekly load. MVP uses a simplified equivalence model.

### Load Units

1 Load Unit (LU) = 1 km of easy running

| Activity | 1 hour = X LU | Notes |
|---|---|---|
| Easy run | ~8-10 LU (distance-based) | Primary metric: km |
| Tempo run | ~15 LU per hour | Higher load per time |
| Strength (gym) | 5 LU | Muscular fatigue, lower cardio |
| Swimming | 6 LU per hour | Low impact |
| Cycling | 4 LU per hour | Lower running-specific load |
| Hiking | 3 LU per hour | Low intensity |

### Usage in Fatigue Calculation

Weekly total load = sum of (session LU) across all session_logs in the week.

If weekly_total_load > target_weekly_load * 1.2, flag as potential overload (even if pace and RPE look fine).

---

## 7. Plan Generation Algorithm (Pseudocode)

```
function generatePlan(user, race):
  weeks = ceil(daysBetween(today, race.target_date) / 7)
  if weeks < 8: warn user, proceed anyway

  plan = new Plan(user, race, weeks)

  phases = assignPhases(weeks)  // base / build / peak / taper / race week

  for each week in plan:
    phase = phases[week.number]
    targetVolume = calculateTargetVolume(user.currentVolume, week.number, phase)
    sessions = buildSessionSchedule(user, phase, targetVolume)
    week.sessions = sessions

  return plan


function buildSessionSchedule(user, phase, targetVolume):
  sessions = []

  // Long run: always on the user's preferred weekend day
  sessions.push(LongRun(distance: longRunDistance(targetVolume, phase)))

  // Easy runs: fill remaining volume at ~60% of target volume
  easyVolume = targetVolume * 0.60 - longRunDistance
  sessions.push(EasyRun(distance: easyVolume * 0.5))  // split into 2 easy runs
  sessions.push(EasyRun(distance: easyVolume * 0.5))

  // Intensity: 20% of volume, only in build/peak phases
  if phase in [build, peak]:
    sessions.push(TempoRun(distance: targetVolume * 0.20))

  // Cross-training: 1 session, type based on user preference
  sessions.push(CrossTraining(type: user.preferredCrossTraining, duration: 45))

  // Rest days: fill remaining days
  return sessions
```

---

## 8. Open Questions (To Validate Post-Beta)

- **Optimal deload frequency**: Every 4th week works for most; some users may need every 3rd
- **Pace baseline for mixed terrain**: Trail pace is ~1-2 min/km slower than road — should they be tracked separately?
- **RPE calibration**: Users self-report RPE inconsistently; consider in-app calibration session (Week 1 time trial)
- **Recovery between races**: Current spec uses 1-2 weeks minimum; validate with beta runners if this is enough
- **Strength session load**: The 5 LU/hour for strength may undercount muscular fatigue impact on next-day running sessions

---

**Document Owner:** Product / Engineering Lead
**Last Updated:** 23 March 2026
**Next Review:** Post-MVP beta testing (Week 10)
