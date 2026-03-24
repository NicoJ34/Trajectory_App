# Test Plan — Sprint 0 — Navigation & Structure (REQ-01)

## Setup
- App lancée sur `http://localhost:3000`
- Aucun profil existant en IndexedDB

## Cas de test

| # | Action | Résultat attendu | Pass/Fail |
|---|---|---|---|
| TC-01 | Ouvrir `http://localhost:3000` | Redirect automatique vers `/onboarding` | Pass |
| TC-02 | Aller sur `/onboarding` | Page affichée SANS sidebar | Pass |
| TC-03 | Aller directement sur `/dashboard` | Page affichée AVEC sidebar visible (220px à gauche) | Pass |
| TC-04 | Aller sur `/dashboard` | Lien "Dashboard" mis en évidence dans la sidebar | Pass |
| TC-05 | Cliquer "Plan semaine" dans la sidebar | Navigation vers `/plan` sans rechargement complet de la page | Pass |
| TC-06 | Cliquer "Calendrier" dans la sidebar | Navigation vers `/races`, lien actif mis en évidence | Pass |
| TC-07 | Cliquer "Historique" dans la sidebar | Navigation vers `/history`, lien actif mis en évidence | Pass |
| TC-08 | Cliquer "Réglages" dans la sidebar | Navigation vers `/settings`, lien actif mis en évidence | Pass |
| TC-09 | Redimensionner la fenêtre à ≥1280px | Layout lisible, sidebar et contenu visibles | Pass |
| TC-10 | Rafraîchir la page sur `/dashboard` | Page se recharge correctement, sidebar toujours visible | Pass |

## Cas limites

| # | Scénario | Résultat attendu | Pass/Fail |
|---|---|---|---|
| CL-01 | Taper une URL inexistante (ex: `/foo`) | Page 404 Next.js, pas d'erreur JS dans la console | Pass |
| CL-02 | Ouvrir l'app dans un nouvel onglet | Même comportement que TC-01 | Pass |

## Résultat global
[x] Pass &nbsp;&nbsp; [ ] Fail

> Validé le 2026-03-24
