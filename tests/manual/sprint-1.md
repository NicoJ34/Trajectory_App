# Test Plan — Sprint 1 — Navigation Fix + Types + DB Layer (REQ-01 update, REQ-11)

## Setup
- App lancée sur `http://localhost:3000`
- IndexedDB vide

## Cas de test — Navigation

| # | Action | Résultat attendu | Pass/Fail |
|---|---|---|---|
| TC-11 | Aller sur `/dashboard` | Sidebar affiche : Dashboard, Nouvel objectif, Logger séance, Météo, Profil | Pass |
| TC-12 | Aller sur `/dashboard` | Aucun lien "Plan semaine", "Calendrier", "Réglages" dans la sidebar | Pass |
| TC-13 | Cliquer "Nouvel objectif" dans la sidebar | Navigation vers `/create-objective`, sidebar masquée | Pass |
| TC-14 | Cliquer "Logger séance" dans la sidebar | Navigation vers `/logger`, lien actif mis en évidence | Pass |
| TC-15 | Cliquer "Météo" dans la sidebar | Navigation vers `/weather`, lien actif mis en évidence | Pass |
| TC-16 | Cliquer "Profil" dans la sidebar | Navigation vers `/profile`, lien actif mis en évidence | Pass |
| TC-17 | Aller sur `/plan` | Redirect automatique vers `/dashboard` | Pass |
| TC-18 | Aller sur `/races` | Redirect automatique vers `/create-objective` | Pass |
| TC-19 | Aller sur `/settings` | Redirect automatique vers `/profile` | Pass |
| TC-20 | Aller sur `/add-session` | Page affichée SANS sidebar | Pass |

## Cas limites

| # | Scénario | Résultat attendu | Pass/Fail |
|---|---|---|---|
| CL-03 | Rafraîchir sur `/logger` | Page reload correctement, sidebar visible | Pass |
| CL-04 | Rafraîchir sur `/create-objective` | Page reload correctement, sidebar masquée | Pass |

## Résultat global
[x] Pass &nbsp;&nbsp; [ ] Fail

> Validé le 2026-03-24
