# Trajectory App — Journal de Progression

> Mis a jour apres chaque commit significatif.
> Sert de reference entre les sessions de travail.

---

## Statut global

| Phase | Contenu | Statut |
|---|---|---|
| Documentation | PRD, architecture, algo, UX, API, user stories | Termine |
| Guardrails | CLAUDE.md, hooks, conventions | Termine |
| Sprint 0 | Setup Next.js + shadcn + localforage + structure | **Termine** (tests manuels valides 2026-03-24) |
| Sprint 1 | Navigation Fix + Types TypeScript + DB layer | **A faire** |
| Sprint 2 | Onboarding 4 etapes | A faire |
| Sprint 3 | Dashboard + Vue plan hebdomadaire | A faire |
| Sprint 4 | Log seance + contraintes | A faire |
| Sprint 5 | Calendrier courses + reglages | A faire |
| Sprint 6 | Tests bout-en-bout + corrections | A faire |

---

## Prochaine tache

**Sprint 1 — Navigation Fix + Types TypeScript + DB layer**
- Branche : `feat/sprint-1-foundation`
- Objectif : corriger la navigation vers les nouvelles routes UX, definir les 10 types TypeScript complets, implementer le DB layer localforage complet (10 stores)
- Acceptance criteria : REQ-01 (update), REQ-11
- Note : le plan de sprint a ete revise apres l'ajout des specs UX dans `UX Documentation/MVP1/`

---

## Historique

### 2026-03-24 — Sprint 0 : Setup projet
**Branche :** `feat/sprint-0-setup` (commits `50945dc` → `223f32f`)

- Monorepo pnpm workspaces (`apps/web`, `packages/shared`)
- Next.js 14 App Router, TypeScript strict, Tailwind CSS, ESLint
- Dependances : localforage, date-fns, zod, vitest, @testing-library/react, playwright
- shadcn/ui : `components.json` + helper `cn()`
- `packages/shared` : `getProfile()` via localforage, types placeholder
- `Sidebar.tsx` : 220px, 5 liens de navigation, lien actif via `usePathname`
- `AppLayout.tsx` : sidebar masquee sur `/onboarding`
- Root `page.tsx` : redirect client → `/onboarding` ou `/dashboard`
- 6 pages stub : `/onboarding`, `/dashboard`, `/plan`, `/races`, `/history`, `/settings`
- `Plans/sprint-0-setup.md` : plan du sprint archive
- Regles workflow ajoutees a `CLAUDE.md` : plan par sprint, commit par etape, MAJ PROGRESS.md
- `tsc --noEmit` : 0 erreur — `next lint` : 0 warning
- REQ-01 : **valide**

---

### 2026-03-23 — Guardrails
**Branche :** `chore/guardrails` → merge `main` (commit `979eac9`)

- Cree `CLAUDE.md` : regles projet (branches, commits, nommage, checklist architecture MVP1, strategie de tests)
- Cree `.claude/settings.json` : hook PostToolUse → `tsc --noEmit` apres chaque edition de fichier
- Repo GitHub passe en public

---

### 2026-03-23 — Documentation complete
**Branche :** `main` (commit `799253a`)

Tous les documents de specification crees et pousses :

| Document | Description |
|---|---|
| `Documentation/PRD_Planificateur_Running_MVP.md` | Product Requirements Document complet, roadmap 4 MVPs |
| `Documentation/Trajectory_Brand_Guidelines.md` | Identite visuelle, ton de voix, messaging |
| `Documentation/Platform_Strategy.md` | Strategie mobile + web, scope par MVP |
| `Documentation/Technical_Architecture.md` | Stack, architecture par phase, structure repo, dev setup |
| `Documentation/Algorithm_Adaptation_Spec.md` | Methodologie entrainement 80/20, regles generation plan, detection fatigue |
| `Documentation/UX_Screen_Specifications.md` | 11 ecrans mobile + 7 ecrans web, specs fonctionnelles |
| `Documentation/API_Contract.md` | Endpoints Supabase, schemas, auth, gestion erreurs (MVP2+) |
| `Documentation/User_Stories_MVP.md` | 9 epics, 20 user stories, acceptance criteria |
| `Documentation/MVP1_Requirements.md` | 12 requirements formels (REQ-01 a REQ-12) avec wireframes ASCII et ACs |

---

## Decisions prises

| Sujet | Decision |
|---|---|
| Roadmap | 4 MVPs progressifs : web local → web cloud → iOS → Android |
| MVP1 | Next.js 14 + localforage (IndexedDB), zero serveur, zero auth |
| Langue UI | Francais |
| Framework web | Next.js 14 (App Router) |
| Composants UI | shadcn/ui + Tailwind CSS |
| Stockage local | localforage (wraps IndexedDB) |
| Tests | Vitest + React Testing Library + Playwright |
| Commits | Conventional Commits (anglais) |
| Branches | `feat/sprint-N-*` — jamais de commit direct sur `main` |
| Log seance | Modal (shadcn Dialog) |
| Seance manquee | Toujours loggable (pas de limite de temps) |
| Adaptation | Banner discret + explication accessible |
| Onboarding | Bloquant si pas de course cible |
