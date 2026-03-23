# API CONTRACT
## Trajectory — Adaptive Running Training Planner

**Version:** 1.0
**Date:** 23 March 2026
**Status:** Draft — implementation-ready for MVP

---

## Overview

Trajectory's backend is Supabase. The API is a combination of:

1. **Supabase Auto-generated REST API** — standard CRUD on all tables, accessed via the Supabase JS SDK
2. **Supabase Edge Functions** — custom logic endpoints (plan generation, adaptation engine)

All requests are authenticated via Supabase JWT. Row Level Security (RLS) enforces data isolation per user.

**Base URL (REST):** `https://<project-ref>.supabase.co/rest/v1/`
**Edge Functions URL:** `https://<project-ref>.supabase.co/functions/v1/`

---

## Authentication

### Sign Up
```
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response 200:
{
  "access_token": "string",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "string",
  "user": { "id": "uuid", "email": "string" }
}
```

### Sign In
```
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response 200: (same as sign up)
```

### Refresh Token
```
POST /auth/v1/token?grant_type=refresh_token
Content-Type: application/json

{
  "refresh_token": "string"
}

Response 200: new access_token + refresh_token
```

### Sign Out
```
POST /auth/v1/logout
Authorization: Bearer <access_token>

Response 204: No content
```

---

## Headers (All Authenticated Requests)

```
Authorization: Bearer <access_token>
apikey: <supabase_anon_key>
Content-Type: application/json
```

---

## Users

### Get Current User Profile
```
GET /rest/v1/users?id=eq.<user_id>&select=*

Response 200:
[{
  "id": "uuid",
  "age": number | null,
  "experience_level": "beginner" | "intermediate" | "advanced",
  "injury_history": "string | null",
  "timezone": "string",
  "preferences": {
    "notification_time": "string",  // e.g., "20:00"
    "units": "km" | "miles",
    "weekly_review_day": "sunday" | "monday" | ...,
    "preferred_cross_training": "strength" | "swim" | "bike" | "hike"
  },
  "expo_push_token": "string | null"
}]
```

### Update User Profile
```
PATCH /rest/v1/users?id=eq.<user_id>
Content-Type: application/json

{
  "age": number,
  "experience_level": "intermediate",
  "injury_history": "string",
  "preferences": { ... }
}

Response 204: No content
```

---

## Races

### List User Races
```
GET /rest/v1/races?user_id=eq.<user_id>&order=target_date.asc&select=*

Response 200:
[{
  "id": "uuid",
  "user_id": "uuid",
  "name": "string",
  "distance_km": number,  // 10, 21.1, or 42.2
  "target_date": "date",  // ISO 8601: "2026-10-12"
  "status": "planned" | "active" | "completed",
  "order": number,
  "created_at": "timestamp"
}]
```

### Create Race
```
POST /rest/v1/races
Content-Type: application/json

{
  "user_id": "uuid",
  "name": "string",
  "distance_km": number,
  "target_date": "date",
  "order": number
}

Response 201:
{ "id": "uuid", ...race fields }
```

### Update Race
```
PATCH /rest/v1/races?id=eq.<race_id>

{
  "target_date": "date",  // for date push
  "status": "active" | "completed"
}

Response 204
```

### Delete Race
```
DELETE /rest/v1/races?id=eq.<race_id>

Response 204
```

---

## Plans

### Get Plan for a Race
```
GET /rest/v1/plans?race_id=eq.<race_id>&select=*,weeks(*)

Response 200:
[{
  "id": "uuid",
  "user_id": "uuid",
  "race_id": "uuid",
  "start_date": "date",
  "end_date": "date",
  "duration_weeks": number,
  "phase": "prep" | "recovery" | "transition",
  "created_at": "timestamp",
  "weeks": [
    {
      "id": "uuid",
      "plan_id": "uuid",
      "week_number": number,
      "adjustments_made": boolean,
      "adjustment_reason": "string | null"
    }
  ]
}]
```

---

## Weeks

### Get Week with Sessions
```
GET /rest/v1/weeks?id=eq.<week_id>&select=*,sessions(*)

Response 200:
[{
  "id": "uuid",
  "plan_id": "uuid",
  "week_number": number,
  "adjustments_made": false,
  "adjustment_reason": null,
  "sessions": [
    {
      "id": "uuid",
      "week_id": "uuid",
      "type": "easy_run" | "tempo_run" | "long_run" | "strength" | "swim" | "bike" | "hike",
      "prescribed_distance_km": number | null,
      "prescribed_duration_min": number,
      "target_intensity": "easy" | "moderate" | "hard",
      "notes": "string | null",
      "session_date": "date",
      "road_or_trail": "road" | "trail" | "either"
    }
  ]
}]
```

---

## Sessions

### Get Session Detail (with Log if exists)
```
GET /rest/v1/sessions?id=eq.<session_id>&select=*,session_logs(*)

Response 200:
[{
  ...session fields,
  "session_logs": [{
    "id": "uuid",
    "distance_km": number,
    "duration_min": number,
    "rpe": "easy" | "moderate" | "hard",
    "user_notes": "string | null",
    "elevation_gain_m": number | null,
    "pace_kmh": number,
    "timestamp": "timestamp"
  }]
}]
```

---

## Session Logs

### Create Session Log
```
POST /rest/v1/session_logs
Content-Type: application/json

{
  "session_id": "uuid",
  "user_id": "uuid",
  "distance_km": number,
  "duration_min": number,
  "rpe": "easy" | "moderate" | "hard",
  "user_notes": "string | null",
  "elevation_gain_m": number | null,
  "timestamp": "timestamp"
  // pace_kmh is calculated by a DB trigger: (distance_km / duration_min) * 60
}

Response 201:
{ "id": "uuid", "pace_kmh": number, ...all fields }
```

### List Session Logs (History)
```
GET /rest/v1/session_logs?user_id=eq.<user_id>&order=timestamp.desc&limit=50

Response 200: array of session_log objects
```

### Update Session Log (edit a logged session)
```
PATCH /rest/v1/session_logs?id=eq.<log_id>

{
  "distance_km": number,
  "duration_min": number,
  "rpe": "easy" | "moderate" | "hard",
  "user_notes": "string"
}

Response 204
```

---

## User Constraints

### Create Constraint
```
POST /rest/v1/user_constraints
Content-Type: application/json

{
  "user_id": "uuid",
  "week_id": "uuid",
  "constraint_type": "illness" | "travel" | "equipment_limit" | "time_limit",
  "description": "string",
  "duration_days": number,
  "affected_sessions": ["session_id_1", "session_id_2"]
}

Response 201: constraint object
```

### Get Constraints for a Week
```
GET /rest/v1/user_constraints?week_id=eq.<week_id>&select=*

Response 200: array of constraint objects
```

---

## Adaptation Logs

### Get Adaptation History for a Plan
```
GET /rest/v1/adaptation_logs?plan_id=eq.<plan_id>&order=timestamp.desc&select=*

Response 200:
[{
  "id": "uuid",
  "plan_id": "uuid",
  "week_id": "uuid",
  "trigger_reason": "pace_drop" | "rpe_high" | "user_signal" | "other",
  "changes_made": [
    {
      "type": "volume_reduction",
      "description": "Reduced weekly volume by 20%",
      "sessions_affected": ["session_id_1"]
    }
  ],
  "timestamp": "timestamp"
}]
```

---

## Edge Functions

### Generate Plan
Called after onboarding when user confirms their race setup.

```
POST /functions/v1/generate-plan
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "userId": "uuid",
  "raceId": "uuid"
}

Response 200:
{
  "planId": "uuid",
  "durationWeeks": number,
  "phases": [
    { "name": "base", "startWeek": 1, "endWeek": 8 },
    { "name": "build", "startWeek": 9, "endWeek": 11 },
    { "name": "peak", "startWeek": 12, "endWeek": 12 },
    { "name": "taper", "startWeek": 13, "endWeek": 13 }
  ],
  "firstWeekSessions": [ ...session objects ]
}

Error 400:
{ "error": "RACE_TOO_SOON", "message": "Race date is less than 8 weeks away. Plan generated with accelerated schedule." }
```

### Adapt Plan (Trigger Manually or via Cron)
```
POST /functions/v1/adapt-plan
Authorization: Bearer <service_role_key>  // server-side only
Content-Type: application/json

{
  "userId": "uuid",
  "planId": "uuid",
  "weekId": "uuid"
}

Response 200:
{
  "adapted": boolean,
  "triggerReason": "pace_drop" | "rpe_high" | "user_signal" | "other" | null,
  "changes": [
    {
      "type": "volume_reduction" | "intensity_reduction" | "session_swap" | "rest_day_added",
      "description": "string",
      "sessionsAffected": ["uuid"]
    }
  ]
}
```

### Push Notification (Internal, called from other Edge Functions)
```
POST /functions/v1/send-notification
Authorization: Bearer <service_role_key>
Content-Type: application/json

{
  "userId": "uuid",
  "type": "weekly_plan_ready" | "fatigue_alert" | "race_countdown" | "session_reminder",
  "data": { ... }  // type-specific payload
}

Response 200: { "sent": boolean }
```

---

## Error Codes

| HTTP Status | Error Code | Description |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Missing or invalid field |
| 400 | `RACE_TOO_SOON` | Race date < 8 weeks |
| 401 | `UNAUTHORIZED` | Missing or invalid JWT |
| 403 | `FORBIDDEN` | RLS block — user accessing another user's data |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `CONFLICT` | Duplicate resource (e.g., log already exists for session) |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

All error responses follow this format:
```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description"
}
```

---

## Data Types Reference

| Type | Format | Example |
|---|---|---|
| UUID | RFC 4122 v4 | `"550e8400-e29b-41d4-a716-446655440000"` |
| Date | ISO 8601 | `"2026-10-12"` |
| Timestamp | ISO 8601 with TZ | `"2026-03-23T20:00:00.000Z"` |
| RPE | Enum | `"easy"` / `"moderate"` / `"hard"` |
| Distance | Float (km) | `10.5` |
| Duration | Integer (minutes) | `65` |
| Pace | Float (km/h) | `9.23` |

---

**Document Owner:** Engineering Lead
**Last Updated:** 23 March 2026
**Next Review:** Upon first API implementation sprint
