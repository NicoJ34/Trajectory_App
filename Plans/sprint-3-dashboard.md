# Plan Sprint 3 — Dashboard + Vue Plan Hebdomadaire

**Branche :** `feat/sprint-3-dashboard`
**REQ couverts :** REQ-04 (Dashboard), REQ-05 (Vue Plan Hebdomadaire)

## Contexte

Le Sprint 2 a livré l'onboarding et la génération du plan. Les données (profil, race, plan, semaines, sessions) sont maintenant en IndexedDB. Le Sprint 3 expose ces données dans l'UI : la page Dashboard répond à "que dois-je faire aujourd'hui ?" et la vue Plan hebdomadaire donne une vision complète de la semaine.

Note : le modal de log de séance (REQ-06) est traité au Sprint 4. En Sprint 3, le bouton "Enregistrer la séance" et le clic sur une session dans la vue plan sont des **placeholders** (bouton visible mais inactif, ou lien vers `/logger`).

---

## Étapes

### Étape 1 — Sidebar + route `/plan`
- `apps/web/components/layout/Sidebar.tsx` → ajouter "Mon Plan" (`/plan`) après Dashboard
- `apps/web/app/plan/page.tsx` → remplacer le redirect par le composant de vue plan (étape 5)

### Étape 2 — Hook `useDashboardData`
- `apps/web/hooks/useDashboardData.ts`
- Charge : profile, activeRace, plan, currentWeek, todaySessions, todayLogs, lastWeekSessions, lastWeekLogs, daysToRace

### Étape 3 — Composants Dashboard
- `apps/web/app/dashboard/components/TodaySessionCard.tsx`
- `apps/web/app/dashboard/components/RaceCountdown.tsx`
- `apps/web/app/dashboard/components/LastWeekSummary.tsx`
- `apps/web/app/dashboard/components/WeekStrip.tsx`
- `apps/web/app/dashboard/page.tsx`

### Étape 4 — Hook `useWeeklyPlan`
- `apps/web/hooks/useWeeklyPlan.ts`
- Navigation par weekOffset (0 = semaine courante)

### Étape 5 — Vue Plan Hebdomadaire
- `apps/web/app/plan/components/WeekHeader.tsx`
- `apps/web/app/plan/components/SessionRow.tsx`
- `apps/web/app/plan/components/WeekFooter.tsx`
- `apps/web/app/plan/page.tsx`

### Étape 6 — Tests
- `apps/web/__tests__/dashboard.test.tsx`
- `apps/web/__tests__/weekly-plan.test.tsx`
- `tests/manual/sprint-3.md`

---

## Utilitaires à réutiliser

| Fonction | Fichier |
|---|---|
| `db.getProfile()`, `db.listRaces()`, `db.getPlanByRaceId()` | `packages/shared/src/db/local.ts` |
| `db.listWeeksByPlan()`, `db.listSessionsByWeek()` | `packages/shared/src/db/local.ts` |
| `db.listSessionsByDate()`, `db.getSessionLog()` | `packages/shared/src/db/local.ts` |
| `db.listAdaptationLogsByWeek()` | `packages/shared/src/db/local.ts` |
| `toISODate()`, `getWeekStart()`, `addWeeks()`, `weeksBetween()` | `packages/shared/src/utils/date.ts` |
| `estimateDuration()` | `packages/shared/src/utils/pace.ts` |
| `generateId()` | `packages/shared/src/utils/id.ts` |
