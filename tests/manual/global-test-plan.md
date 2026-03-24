# Plan de Test Manuel Global — Trajectory App

> Document vivant — mis a jour apres chaque sprint.
> Chaque nouvelle fonctionnalite ajoute ses cas de test ici.
> Relancer l'integralite des cas a chaque fin de sprint.

---

## Prerequis

- App lancee sur `http://localhost:3000` (`~/Library/pnpm/pnpm --filter web dev`)
- Navigateur : Chrome (desktop, ≥1280px)
- IndexedDB vide (ou profil connu selon le cas de test)

Pour vider l'IndexedDB :
> DevTools → Application → Storage → Clear site data

---

## Sprint 0 — Navigation & Structure (REQ-01)

### Setup
- App lancee, aucun profil existant en IndexedDB

### Cas de test

| # | Action | Resultat attendu | Pass/Fail |
|---|---|---|---|
| TC-01 | Ouvrir `http://localhost:3000` | Redirect automatique vers `/onboarding` | Pass |
| TC-02 | Aller sur `/onboarding` | Page affichee SANS sidebar | Pass |
| TC-03 | Aller directement sur `/dashboard` | Page affichee AVEC sidebar visible (220px a gauche) | Pass |
| TC-04 | Aller sur `/dashboard` | Lien "Dashboard" mis en evidence dans la sidebar | Pass |
| TC-05 | Cliquer "Plan semaine" dans la sidebar | Navigation vers `/plan` sans rechargement complet de la page | Pass |
| TC-06 | Cliquer "Calendrier" dans la sidebar | Navigation vers `/races`, lien actif mis en evidence | Pass |
| TC-07 | Cliquer "Historique" dans la sidebar | Navigation vers `/history`, lien actif mis en evidence | Pass |
| TC-08 | Cliquer "Reglages" dans la sidebar | Navigation vers `/settings`, lien actif mis en evidence | Pass |
| TC-09 | Redimensionner la fenetre a ≥1280px | Layout lisible, sidebar et contenu visibles | Pass |
| TC-10 | Rafraichir la page sur `/dashboard` | Page se recharge correctement, sidebar toujours visible | Pass |

### Cas limites

| # | Scenario | Resultat attendu | Pass/Fail |
|---|---|---|---|
| CL-01 | Taper une URL inexistante (ex: `/foo`) | Page 404 Next.js, pas d'erreur JS dans la console | Pass |
| CL-02 | Ouvrir l'app dans un nouvel onglet | Meme comportement que TC-01 | Pass |

### Resultat Sprint 0
[x] Pass &nbsp;&nbsp; [ ] Fail

---

## Sprint 1 — Navigation Fix + Types TypeScript + DB layer (REQ-01 update, REQ-11)

### Setup
- App lancee sur `http://localhost:3000`
- IndexedDB vide

### Cas de test — Navigation

| # | Action | Resultat attendu | Pass/Fail |
|---|---|---|---|
| TC-11 | Aller sur `/dashboard` | Sidebar affiche : Dashboard, Nouvel objectif, Logger séance, Météo, Profil | |
| TC-12 | Aller sur `/dashboard` | Aucun lien "Plan semaine", "Calendrier", "Réglages" dans la sidebar | |
| TC-13 | Cliquer "Nouvel objectif" dans la sidebar | Navigation vers `/create-objective`, sidebar masquée | |
| TC-14 | Cliquer "Logger séance" dans la sidebar | Navigation vers `/logger`, lien actif mis en évidence | |
| TC-15 | Cliquer "Météo" dans la sidebar | Navigation vers `/weather`, lien actif mis en évidence | |
| TC-16 | Cliquer "Profil" dans la sidebar | Navigation vers `/profile`, lien actif mis en évidence | |
| TC-17 | Aller sur `/plan` | Redirect automatique vers `/dashboard` | |
| TC-18 | Aller sur `/races` | Redirect automatique vers `/create-objective` | |
| TC-19 | Aller sur `/settings` | Redirect automatique vers `/profile` | |
| TC-20 | Aller sur `/add-session` | Page affichée SANS sidebar | |

### Cas limites

| # | Scenario | Resultat attendu | Pass/Fail |
|---|---|---|---|
| CL-03 | Rafraichir sur `/logger` | Page reload correctement, sidebar visible | |
| CL-04 | Rafraichir sur `/create-objective` | Page reload correctement, sidebar masquée | |

### Resultat Sprint 1
[ ] Pass &nbsp;&nbsp; [ ] Fail

---

## Sprint 2 — Onboarding (REQ-02)

> A completer apres implementation du Sprint 2

---

## Sprint 3 — Dashboard + Plan hebdomadaire (REQ-04, REQ-05)

> A completer apres implementation du Sprint 3

---

## Sprint 4 — Log seance + Contraintes (REQ-06, REQ-07, REQ-08)

> A completer apres implementation du Sprint 4

---

## Sprint 5 — Calendrier courses + Reglages (REQ-09, REQ-10)

> A completer apres implementation du Sprint 5

---

## Sprint 6 — Tests bout-en-bout + Corrections (REQ-12)

> A completer apres implementation du Sprint 6

---

## Scenario bout-en-bout (fin MVP1)

> A completer apres Sprint 6 — parcours complet utilisateur de l'onboarding jusqu'au log de seance et adaptation du plan.
