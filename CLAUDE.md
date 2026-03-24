# Trajectory App — Claude Code Rules

## Projet

Application web de planification d'entrainement running, adaptative. MVP1 = web local (Next.js + localforage, zero serveur, zero auth).

**Docs de reference :**
- Architecture : `Documentation/Technical_Architecture.md`
- Scope MVP1 : `Documentation/Platform_Strategy.md`
- Requirements : `Documentation/MVP1_Requirements.md`
- Algorithme : `Documentation/Algorithm_Adaptation_Spec.md`

---

## Workflow Sprint

**Avant de commencer chaque sprint :**
1. Preparer un plan detaille (contexte, etapes, fichiers cibles, verification)
2. Sauvegarder le plan dans `Plans/sprint-N-nom.md` (ex: `Plans/sprint-0-setup.md`)
3. Faire approuver le plan avant d'implementer
4. Committer le plan avec le code du sprint

**Format du plan :** voir `Plans/sprint-0-setup.md` comme reference.

**Pendant l'implementation :**
- A chaque etape de la todo list completee :
  1. Ecrire tous les tests unitaires et automatises pertinents pour le code produit
  2. Si applicable, ajouter les cas de test manuels dans `tests/manual/global-test-plan.md` (document vivant) et demander a l'utilisateur de les executer
  3. Lancer les tests — ne pas passer a l'etape suivante si des tests echouent
  4. Mettre a jour `PROGRESS.md`
  5. Demander a l'utilisateur s'il veut committer sur la branche en cours

- En fin de sprint :
  1. Relancer tous les tests (unit + composants + e2e si disponible)
  2. Relire `tests/manual/global-test-plan.md` et demander a l'utilisateur d'executer tous les cas de la section du sprint en cours
  3. Le sprint n'est pas considere comme termine tant que tous les tests ne passent pas
  4. Mettre a jour `PROGRESS.md` (statut global, historique, prochaine tache)
  5. Demander a l'utilisateur s'il veut merger la branche sur `main`

---

## Regles de branches Git

| Regle | Detail |
|---|---|
| `main` est protege | Jamais de commit direct sur `main` |
| Branche par sprint | `feat/sprint-0-setup`, `feat/sprint-1-types`, etc. |
| Hotfix | `fix/description-courte` |
| Merge | PR de la branche vers `main` — verifier manuellement avant merge |

---

## Conventions

**Commits** (Conventional Commits, en anglais) :
```
feat: add onboarding step 1 profile form
fix: correct pace calculation when duration is zero
chore: install localforage and date-fns
docs: update README
refactor: extract pace calculator to shared utils
test: add unit tests for plan generator
```

**Nommage des fichiers** :
| Type | Convention | Exemple |
|---|---|---|
| Composants React | PascalCase | `Sidebar.tsx`, `LogSessionModal.tsx` |
| Hooks | camelCase + `use` prefix | `useProfile.ts` |
| Utilitaires | camelCase | `formatPace.ts` |
| Pages Next.js | `page.tsx` | `app/dashboard/page.tsx` |
| Types | PascalCase | `UserProfile`, `SessionLog` |

**TypeScript** : mode strict, zero `any`.

**Langue UI** : Francais.

---

## Avant chaque commit — checklist obligatoire

```bash
# Depuis apps/web/
npx tsc --noEmit    # zero erreur TypeScript
npx next lint       # zero warning ESLint
npx vitest run      # tous les tests passent
```

Un commit avec des erreurs TypeScript ou des tests en echec est INTERDIT.

---

## Checklist Architecture (avant de marquer une tache comme terminee)

### Respect MVP1 (Technical_Architecture.md)
- [ ] Pas de routes API Next.js (100% client-side)
- [ ] Pas de `use server` / SSR
- [ ] Donnees uniquement via `packages/shared/db/local.ts` (localforage)
- [ ] Moteur algo dans `packages/shared/engine/` — pas dans les composants
- [ ] Structure de fichiers conforme au repo layout

### Scope MVP1 (Platform_Strategy.md)
- [ ] Aucun appel reseau externe
- [ ] Pas d'auth, pas de session utilisateur
- [ ] Fonctionne sur `localhost:3000` sans configuration serveur
- [ ] Single user / single profile

### Acceptance Criteria par sprint (MVP1_Requirements.md)
- Sprint 0 → REQ-01
- Sprint 1 → REQ-03, REQ-11
- Sprint 2 → REQ-02
- Sprint 3 → REQ-04, REQ-05
- Sprint 4 → REQ-06, REQ-07, REQ-08
- Sprint 5 → REQ-09, REQ-10
- Sprint 6 → REQ-12 + scenario bout-en-bout

---

## Strategie de Tests

**Regle** : chaque nouvelle fonctionnalite doit etre couverte par des tests avant d'etre consideree comme terminee.

| Type | Outil | Cible |
|---|---|---|
| Unit tests | Vitest | Moteur algo, calculs pace, utils dates, validation Zod |
| Component tests | Vitest + React Testing Library | Composants React, interactions, etats |
| E2E tests | Playwright | Flux complets : onboarding, log seance, adaptation |
| Manual test plan | `tests/manual/sprint-N.md` | Cas limites, rendu visuel |

**Format test plan manuel** (`tests/manual/sprint-N.md`) :
```markdown
# Test Plan — Sprint N — [Feature]

## Setup
- Conditions initiales

## Cas de test
| # | Action | Resultat attendu | Pass/Fail |
|---|---|---|---|
| TC-01 | | | |

## Cas limites
| # | Scenario | Resultat attendu | Pass/Fail |
|---|---|---|---|

## Resultat global
[ ] Pass  [ ] Fail
```

---

## Skills disponibles — Quand les invoquer

Claude doit invoquer ces skills automatiquement dans les contextes suivants :

| Skill | Declencher quand... |
|---|---|
| `/arch-check` | Avant de cocher une tache todo ; apres avoir modifie components/pages/engine |
| `/sprint-step` | Des qu'une etape du sprint est implementee |
| `/new-sprint` | L'utilisateur veut commencer un nouveau sprint |
| `/pre-commit` | Avant tout `git commit` (y compris depuis sprint-step) |
| `/end-of-sprint` | Toutes les etapes du sprint sont terminees ; l'utilisateur veut merger |

**Regle** : ne jamais skip un skill de la sequence sprint. L'ordre est :
`/new-sprint` → [implementation] → `/sprint-step` (×N) → `/end-of-sprint` → merge main

---

## Commandes utiles

```bash
# Lancer l'app
pnpm --filter web dev          # http://localhost:3000

# Tests
pnpm --filter web test         # Vitest unit + component
pnpm --filter web test:e2e     # Playwright

# Verification avant commit
cd apps/web && npx tsc --noEmit && npx next lint

# Installer un composant shadcn/ui
cd apps/web && npx shadcn@latest add [composant]
```

---

## Stack MVP1

| Couche | Outil |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styles | Tailwind CSS |
| Composants UI | shadcn/ui |
| Stockage local | localforage (IndexedDB) |
| Dates | date-fns |
| Validation | Zod |
| Tests unit/component | Vitest + React Testing Library |
| Tests E2E | Playwright |
