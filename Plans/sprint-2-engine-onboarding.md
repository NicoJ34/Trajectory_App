# Plan — Sprint 2 : Moteur Algo + Onboarding + Create Objective

## Contexte

Sprint 1 a posé les fondations (types, DB layer, navigation). Sprint 2 implémente le cœur métier :
- Le moteur de génération de plan (pure function TypeScript, zéro UI)
- Le wizard onboarding 4 étapes (premier lancement)
- Le wizard create-objective 3 étapes (ajout de course post-onboarding)

**Requirements couverts :** REQ-02 (onboarding), REQ-03 (génération de plan)
**Branche :** `feat/sprint-2-engine-onboarding`

---

## Fondations réutilisables

- Types : `UserProfile`, `Race`, `Plan`, `Week`, `Session` → `packages/shared/src/types/index.ts`
- DB : `db.saveProfile()`, `db.savePlan()`, `db.saveWeek()`, `db.saveSession()` → `packages/shared/src/db/local.ts`
- `generateId()` → `packages/shared/src/utils/id.ts`

---

## Étape 1 — Utils : pace.ts + date.ts

### `packages/shared/src/utils/pace.ts`
- `calculatePace(distanceKm, durationMin): number`
- `formatPace(paceMinPerKm): string` — ex: "5'30\""
- `estimateDuration(distanceKm, paceMinPerKm): number`
- `getDefaultPace(level: ExperienceLevel, type: 'easy' | 'tempo'): number`

Paces défaut : beginner 7.0/6.0 — intermediate 6.0/5.0 — advanced 5.0/4.0

### `packages/shared/src/utils/date.ts`
- `weeksBetween(start, end): number`
- `getWeekStart(date): Date` — lundi de la semaine
- `addWeeks(date, n): Date`
- `toISODate(date): string`
- `getDayOfWeek(date): number`
- `getNextWeekday(from, targetDay): Date`

---

## Étape 2 — Moteur de génération : generator.ts

### `packages/shared/src/engine/generator.ts`
```typescript
generatePlan(profile: UserProfile, race: Race): { plan: Plan; weeks: Week[]; sessions: Session[] }
```

**Phases (REQ-03) :**
```
base       = semaines 1 → N-6
build      = semaines N-5 → N-3
peak       = semaine N-2
taper      = semaine N-1
race_week  = semaine N
```
Si totalWeeks < 8 : phases compressées, pas d'erreur.

**Volume :** +10%/sem, décharge ×0.80 toutes les 4 semaines, taper = peak×0.55, race_week = peak×0.25

**Sessions par phase :**
| Phase | Types |
|---|---|
| base | 2× easy_run, 1× long_run, 1× cross-training, reste = rest |
| build/peak | 2× easy_run, 1× long_run, 1× tempo_run, 1× cross-training, reste = rest |
| taper | 2× easy_run, 1× long_run réduit, reste = rest |
| race_week | 2× easy_run courts, 1× rest |

---

## Étape 3 — Onboarding `/onboarding`

State machine 4 étapes dans `page.tsx` :

| Étape | Champs | Requis |
|---|---|---|
| Step1Profile | experience, weeklyVolume, availableDays, terrain, injuries | experience, weeklyVolume, availableDays |
| Step2Race | distance, targetDate, name, elevationGain | distance, targetDate (non passée) |
| Step3Preferences | preferredLongRunDay, crossTraining, units | tous |
| Step4Preview | preview `generatePlan()`, CTA "Commencer" | — |

Sur "Commencer" : saveProfile + saveRace (status: 'active') + savePlan + saveWeek[] + saveSession[] → redirect `/dashboard`

---

## Étape 4 — Create Objective `/create-objective`

State machine 3 étapes :

| Étape | Contenu |
|---|---|
| Step1Distance | Cards : 10K / Semi / Marathon / Custom |
| Step2Details | Nom, date, objectif temps, dénivelé, notes |
| Step3Confirmation | Résumé + plan preview + CTA "Créer l'objectif" |

Charge `db.getProfile()` au montage. Sur confirmation : saveRace (status: 'planned') + savePlan + saveWeek[] + saveSession[] → redirect `/dashboard`

---

## Fichiers créés / modifiés

| Fichier | Action |
|---|---|
| `packages/shared/src/utils/pace.ts` | Créé |
| `packages/shared/src/utils/date.ts` | Créé |
| `packages/shared/src/engine/generator.ts` | Créé |
| `packages/shared/src/index.ts` | Modifié |
| `apps/web/app/onboarding/page.tsx` | Remplacé |
| `apps/web/app/onboarding/components/` | 5 composants créés |
| `apps/web/app/create-objective/page.tsx` | Remplacé |
| `apps/web/app/create-objective/components/` | 4 composants créés |
| `apps/web/__tests__/pace.test.ts` | Créé |
| `apps/web/__tests__/date.test.ts` | Créé |
| `apps/web/__tests__/generator.test.ts` | Créé |
| `apps/web/__tests__/onboarding.test.tsx` | Créé |
| `apps/web/__tests__/create-objective.test.tsx` | Créé |

---

## Vérification

1. `npx vitest run` → tous les tests passent
2. Onboarding : "Continuer" disabled si champs requis vides
3. Step2 : warning affiché si < 8 semaines
4. Step4 : preview plan affiché
5. "Commencer" → profile + race + plan + weeks + sessions en IndexedDB → redirect `/dashboard`
6. Create-objective : 3 étapes fonctionnelles → données sauvegardées
7. Tests manuels TC-21+ validés

---

## Contraintes MVP1

- `generatePlan` = pure function, zéro DB, zéro appel réseau
- Sauvegardes uniquement via `db.*`
- Composants `'use client'`, zéro `use server`

---

## Statut

**En cours** — branche `feat/sprint-2-engine-onboarding` (2026-03-24)
