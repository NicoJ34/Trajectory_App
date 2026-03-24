# Plan — Sprint 0 : Setup projet

## Context

Le projet Trajectory App est entièrement documenté mais ne contient aucun code.
Sprint 0 pose le squelette technique (REQ-01) : monorepo, Next.js 14, dépendances, structure dossiers, sidebar, routes stub, redirect racine.
Aucune logique métier dans ce sprint — seulement la fondation sur laquelle les sprints suivants s'appuient.

---

## Étapes d'implémentation

### 1. Monorepo pnpm workspaces

Créer à la racine :
- `package.json` — root workspace (`"workspaces": ["apps/*", "packages/*"]`, scripts `dev`, `build`, `test`)
- `pnpm-workspace.yaml` — déclare les workspaces
- `.npmrc` — `shamefully-hoist=true` pour compatibilité shadcn

### 2. Bootstrap Next.js 14 dans `apps/web`

```bash
cd apps && npx create-next-app@14 web \
  --typescript --tailwind --eslint \
  --app --src-dir=false --import-alias="@/*"
```

Ajuster `tsconfig.json` : `"strict": true` (déjà activé par défaut avec create-next-app).

### 3. Installer les dépendances

Dans `apps/web/` :
```bash
pnpm add localforage date-fns zod
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @vitest/coverage-v8
pnpm add -D @playwright/test
```

Configurer `vitest.config.ts` et `playwright.config.ts` dans `apps/web/`.

### 4. Initialiser shadcn/ui

Créer `components.json` + installer `class-variance-authority clsx tailwind-merge lucide-react`.
Créer `lib/utils.ts` avec le helper `cn()`.

### 5. Créer le package partagé `packages/shared`

```
packages/shared/
  package.json          (name: "@trajectory/shared")
  tsconfig.json
  src/
    index.ts
    types/index.ts      (placeholder — Sprint 1)
    db/local.ts         (getProfile() via localforage)
    engine/             (Sprint 1)
    utils/              (Sprint 1)
```

Ajouter `@trajectory/shared: "workspace:*"` dans `apps/web/package.json`.
Ajouter les paths dans `apps/web/tsconfig.json`.
Ajouter `transpilePackages: ['@trajectory/shared']` dans `next.config.mjs`.

### 6. Structure dossiers `apps/web`

```
apps/web/
  app/
    layout.tsx              (RootLayout + AppLayout)
    page.tsx                (redirect racine — 'use client')
    onboarding/page.tsx     (stub — full page, pas de sidebar)
    dashboard/page.tsx      (stub)
    plan/page.tsx           (stub)
    races/page.tsx          (stub)
    history/page.tsx        (stub)
    settings/page.tsx       (stub)
  components/
    layout/
      Sidebar.tsx           (nav principale, 220px, usePathname)
      AppLayout.tsx         (wrapper conditionnel sidebar)
  lib/
    utils.ts                (cn() helper)
```

### 7. Sidebar.tsx

- Largeur fixe 220px, visible sur toutes les pages sauf `/onboarding`
- Navigation : Dashboard, Plan semaine, Calendrier, Historique, Réglages
- Lien actif mis en évidence (`usePathname`)
- Logo / nom app en haut

### 8. AppLayout.tsx

`'use client'` — masque la Sidebar sur les routes de `NO_SIDEBAR_ROUTES = ['/onboarding']`.

### 9. Redirect racine `app/page.tsx`

`'use client'` avec `useEffect` → `getProfile()` → `router.replace('/onboarding' | '/dashboard')`.

### 10. Lier les workspaces

```bash
~/Library/pnpm/pnpm install  # depuis la racine
```

---

## Fichiers créés / modifiés

| Fichier | Action |
|---|---|
| `package.json` (racine) | Créé |
| `pnpm-workspace.yaml` | Créé |
| `.npmrc` | Créé |
| `.gitignore` | Créé |
| `apps/web/` | Généré par create-next-app |
| `apps/web/vitest.config.ts` | Créé |
| `apps/web/playwright.config.ts` | Créé |
| `apps/web/next.config.mjs` | Modifié (transpilePackages) |
| `apps/web/tsconfig.json` | Modifié (paths @trajectory/shared) |
| `apps/web/lib/utils.ts` | Créé |
| `apps/web/components.json` | Créé |
| `apps/web/app/layout.tsx` | Modifié |
| `apps/web/app/page.tsx` | Modifié (redirect client) |
| `apps/web/app/onboarding/page.tsx` | Créé |
| `apps/web/app/dashboard/page.tsx` | Créé |
| `apps/web/app/plan/page.tsx` | Créé |
| `apps/web/app/races/page.tsx` | Créé |
| `apps/web/app/history/page.tsx` | Créé |
| `apps/web/app/settings/page.tsx` | Créé |
| `apps/web/components/layout/Sidebar.tsx` | Créé |
| `apps/web/components/layout/AppLayout.tsx` | Créé |
| `packages/shared/package.json` | Créé |
| `packages/shared/tsconfig.json` | Créé |
| `packages/shared/src/db/local.ts` | Créé |
| `packages/shared/src/types/index.ts` | Créé |
| `packages/shared/src/index.ts` | Créé |

---

## Vérification (Acceptance Criteria REQ-01)

1. `~/Library/pnpm/pnpm --filter web dev` → app sur `localhost:3000` sans erreur
2. `localhost:3000` → redirect vers `/onboarding` (pas de profil)
3. `/dashboard` → Sidebar visible, lien actif mis en évidence
4. Navigation Sidebar → SPA sans reload complet
5. `/onboarding` → Sidebar absente
6. `tsc --noEmit` → zéro erreur ✓
7. `next lint` → zéro warning ✓

---

## Contraintes MVP1 respectées

- Pas de routes API Next.js, pas de `use server`
- Données uniquement via `packages/shared/src/db/local.ts`
- Aucun appel réseau externe
- Fonctionne sur `localhost:3000` sans configuration serveur

---

## Statut

**Terminé** — commit `50945dc` sur `feat/sprint-0-setup` (2026-03-24)
