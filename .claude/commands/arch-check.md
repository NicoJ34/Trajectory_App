# Arch Check — Checklist architecture MVP1

Basé sur CLAUDE.md section "Checklist Architecture". À exécuter avant de marquer une tâche comme terminée.

Lire les fichiers de l'étape courante et vérifier chaque point. Répondre explicitement ✓ ou ✗ pour chacun.

## Respect MVP1 — Technical_Architecture.md

- [ ] **Pas de routes API Next.js** — aucun fichier `app/api/**/route.ts`
- [ ] **Pas de `use server` / SSR** — composants en `'use client'` ou Server Components purs sans data fetching serveur
- [ ] **Données uniquement via `packages/shared/db/local.ts`** — aucun accès direct à localforage dans les composants ou pages
- [ ] **Moteur algo dans `packages/shared/engine/`** — pas de logique de calcul dans les composants React
- [ ] **Structure de fichiers conforme** — PascalCase composants, camelCase hooks/utils, `page.tsx` pour les pages

## Scope MVP1 — Platform_Strategy.md

- [ ] **Aucun appel réseau externe** — pas de `fetch()` vers une API tierce (sauf Open-Meteo sur `/weather` qui est l'exception documentée)
- [ ] **Pas d'auth, pas de session utilisateur** — aucun cookie, token, ou middleware d'auth
- [ ] **Fonctionne sur `localhost:3000` sans configuration serveur** — zero variable d'environnement requise
- [ ] **Single user / single profile** — pas de gestion multi-utilisateurs

## Acceptance Criteria du sprint en cours

Vérifier dans `Documentation/MVP1_Requirements.md` les acceptance criteria du REQ correspondant au sprint :
- Sprint 0 → REQ-01 | Sprint 1 → REQ-01 update + REQ-11
- Sprint 2 → REQ-02, REQ-03 | Sprint 3 → REQ-04, REQ-05
- Sprint 4 → REQ-06, REQ-07, REQ-08 | Sprint 5 → REQ-09, REQ-10
- Sprint 6 → REQ-12 + scénario bout-en-bout

---
Si un point est ✗ : corriger avant de passer à la suite.
Afficher le résultat sous forme de tableau ✓/✗.
