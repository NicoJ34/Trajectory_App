# Plan — Sprint 1 : Navigation Fix + Types TypeScript + DB Layer

## Contexte

Les specs UX ajoutées dans `UX Documentation/MVP1/TRAJECTORY_PAGES_SPECIFICATIONS.md` définissent une structure de pages différente de celle codée dans Sprint 0. La sidebar et les routes stub héritées du Sprint 0 ne correspondent plus à la navigation réelle de l'app.

Ce sprint corrige l'écart de navigation, pose les 10 types TypeScript qui font fonctionner toute la couche data, et remplace le stub `getProfile()` par un DB layer localforage complet (10 stores).

Aucune UI métier dans ce sprint — les sprints suivants s'appuient sur ces fondations.

**Requirements couverts :** REQ-01 (update navigation), REQ-11 (localforage persistence)

---

## Étapes d'implémentation

### 1. Navigation Fix

Mettre à jour la sidebar et les routes pour correspondre aux UX specs.

**`apps/web/components/layout/Sidebar.tsx`** — remplacer les 5 navItems :
```
/dashboard        Dashboard         LayoutDashboard
/create-objective Nouvel objectif   Target
/logger           Logger séance     PenLine
/weather          Météo             CloudSun
/profile          Profil            User
```

**`apps/web/components/layout/AppLayout.tsx`** — étendre `NO_SIDEBAR_ROUTES` :
- Ajouter `/create-objective`, `/add-session` (flows wizard sans sidebar)
- Passer à `pathname.startsWith(route)` pour couvrir les sous-routes

**Stubs à créer :**
- `apps/web/app/logger/page.tsx`
- `apps/web/app/create-objective/page.tsx`
- `apps/web/app/add-session/page.tsx`
- `apps/web/app/weather/page.tsx`
- `apps/web/app/profile/page.tsx`

**Redirects depuis les anciennes routes :**
- `apps/web/app/plan/page.tsx` → `redirect('/dashboard')`
- `apps/web/app/races/page.tsx` → `redirect('/create-objective')`
- `apps/web/app/settings/page.tsx` → `redirect('/profile')`

**`apps/web/app/page.tsx`** — mettre à jour l'import de `getProfile` → `db.getProfile()`

### 2. Types TypeScript complets

**`packages/shared/src/types/index.ts`** — remplacer le placeholder par 10 types + enums :

Types : `UserProfile`, `Race`, `Plan`, `Week`, `Session`, `SessionLog`, `UserConstraint`, `AdaptationLog`, `ReferenceTime`, `TrainingLocation`

Enums : `ExperienceLevel`, `Terrain`, `CrossTraining`, `Units`, `RaceDistance`, `RaceStatus`, `PlanPhase`, `SessionType`, `IntensityLevel`, `RPELevel`, `MoodLevel`, `WeatherCondition`, `ConstraintType`, `ConstraintSeverity`, `AdaptationTrigger`

**`packages/shared/src/types/schemas.ts`** — schémas Zod pour validation :
- `UserProfileSchema`, `RaceSchema`, `SessionLogSchema`, `UserConstraintSchema`

Installer zod dans `packages/shared` : `pnpm --filter @trajectory/shared add zod`

### 3. DB Layer complet

**`packages/shared/src/utils/id.ts`** — `generateId()` via `crypto.randomUUID` avec fallback

**`packages/shared/src/db/interface.ts`** — interface `DB` complète :
- CRUD pour les 10 entités
- `exportAll(): Promise<Record<string, unknown>>`
- `clearAll(): Promise<void>`

**`packages/shared/src/db/local.ts`** — implémentation localforage complète :

10 stores :
```
trajectory_profile        → UserProfile (clé "profile")
trajectory_races          → Race (clé id)
trajectory_plans          → Plan (clé id)
trajectory_weeks          → Week (clé id)
trajectory_sessions       → Session (clé id)
trajectory_session_logs   → SessionLog (clé id)
trajectory_constraints    → UserConstraint (clé id)
trajectory_adaptation_logs → AdaptationLog (clé id)
trajectory_reference_times → ReferenceTime (clé id)
trajectory_locations      → TrainingLocation (clé id)
```

**`packages/shared/src/index.ts`** — exporter tous les nouveaux modules

---

## Fichiers créés / modifiés

| Fichier | Action |
|---|---|
| `apps/web/components/layout/Sidebar.tsx` | Modifié — nouvelles routes UX |
| `apps/web/components/layout/AppLayout.tsx` | Modifié — NO_SIDEBAR_ROUTES étendu |
| `apps/web/app/page.tsx` | Modifié — `db.getProfile()` |
| `apps/web/app/logger/page.tsx` | Créé (stub) |
| `apps/web/app/create-objective/page.tsx` | Créé (stub) |
| `apps/web/app/add-session/page.tsx` | Créé (stub) |
| `apps/web/app/weather/page.tsx` | Créé (stub) |
| `apps/web/app/profile/page.tsx` | Créé (stub) |
| `apps/web/app/plan/page.tsx` | Modifié → redirect `/dashboard` |
| `apps/web/app/races/page.tsx` | Modifié → redirect `/create-objective` |
| `apps/web/app/settings/page.tsx` | Modifié → redirect `/profile` |
| `apps/web/vitest.config.ts` | Modifié — alias `@trajectory/shared`, setupFiles |
| `apps/web/vitest.setup.ts` | Créé — import `@testing-library/jest-dom` |
| `apps/web/__tests__/Sidebar.test.tsx` | Créé — 4 tests navigation |
| `apps/web/__tests__/schemas.test.ts` | Créé — 12 tests Zod |
| `apps/web/__tests__/db.test.ts` | Créé — 6 tests DB mock |
| `packages/shared/src/types/index.ts` | Remplacé — 10 types + 15 enums |
| `packages/shared/src/types/schemas.ts` | Créé — 4 schémas Zod |
| `packages/shared/src/db/interface.ts` | Créé — interface DB |
| `packages/shared/src/db/local.ts` | Remplacé — implémentation complète |
| `packages/shared/src/utils/id.ts` | Créé |
| `packages/shared/src/index.ts` | Modifié — exports complets |
| `packages/shared/package.json` | Modifié — ajout zod |

---

## Vérification (Acceptance Criteria REQ-01 update + REQ-11)

1. Sidebar affiche : Dashboard, Nouvel objectif, Logger séance, Météo, Profil
2. `/plan` → redirect `/dashboard`, `/races` → redirect `/create-objective`, `/settings` → redirect `/profile`
3. `/create-objective` et `/add-session` → sidebar masquée
4. `npx tsc --noEmit` → zéro erreur
5. `npx next lint` → zéro warning
6. `npx vitest run` → 22 tests passent
7. Tests manuels TC-11 à TC-20 + CL-03/04 validés dans `tests/manual/global-test-plan.md`

---

## Contraintes MVP1 respectées

- Pas de routes API Next.js, pas de `use server`
- Données uniquement via `packages/shared/src/db/local.ts`
- Aucun appel réseau externe
- Fonctionne sur `localhost:3000` sans configuration serveur

---

## Statut

**Terminé** — commits `20620d7` → `242201a` sur `feat/sprint-1-foundation` (2026-03-24)
