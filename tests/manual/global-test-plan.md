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

### Cas limites

| # | Scenario | Resultat attendu | Pass/Fail |
|---|---|---|---|
| CL-03 | Rafraichir sur `/logger` | Page reload correctement, sidebar visible | Pass |
| CL-04 | Rafraichir sur `/create-objective` | Page reload correctement, sidebar masquée | Pass |

### Resultat Sprint 1
[x] Pass &nbsp;&nbsp; [ ] Fail

---

## Sprint 2 — Onboarding (REQ-02)

### Setup
- `pnpm --filter web dev` → http://localhost:3000
- Vider l'IndexedDB entre chaque test : DevTools → Application → IndexedDB → Clear

### Cas de test — Onboarding wizard

| # | Action | Résultat attendu | Pass/Fail |
|---|---|---|---|
| TC-21 | Aller sur `/onboarding` | Step 1/4 affiché, barre de progression à 25% | Pass |
| TC-22 | Étape 1 : ne rien remplir | Bouton "Continuer →" désactivé | Pass |
| TC-23 | Étape 1 : cliquer "Intermédiaire", saisir volume=40, jours=5 | Bouton "Continuer →" activé | Pass |
| TC-24 | Cliquer "Continuer →" depuis Step 1 | Step 2/4 affiché, barre à 50% | Pass |
| TC-25 | Étape 2 : ne pas sélectionner de distance | Bouton "Continuer →" désactivé | Pass |
| TC-26 | Étape 2 : cliquer "Marathon" | Carte Marathon sélectionnée (bordure mise en évidence) | Pass |
| TC-27 | Étape 2 : essayer de sélectionner une date dans le passé | Impossible de sélectionner une date passée (bloqué par le champ date) | Pass |
| TC-28 | Étape 2 : saisir une date dans 3 semaines | Warning "Moins de 8 semaines" affiché, bouton activé | Pass |
| TC-29 | Étape 2 : saisir une date dans 20 semaines | Compteur "X semaines de préparation" affiché, bouton activé | Pass |
| TC-30 | Cliquer "← Retour" depuis Step 2 | Retour à Step 1 avec données préservées | Pass |
| TC-31 | Naviguer Step 2 → Step 3 | Step 3/4 affiché, barre à 75% | Pass |
| TC-32 | Étape 3 : ne rien remplir | Bouton "Voir mon plan →" désactivé | Pass |
| TC-33 | Étape 3 : sélectionner Dimanche, Renforcement, km | Bouton "Voir mon plan →" activé | Pass |
| TC-34 | Cliquer "Voir mon plan →" | Step 4/4 affiché, "Génération en cours…" puis plan présenté | Pass |
| TC-35 | Step 4 : vérifier le contenu | Nombre de semaines, phases (Base/Build/Peak/Taper), sessions semaine 1 visibles | Pass |
| TC-36 | Step 4 : cliquer "Commencer 🚀" | Bouton passe à "Enregistrement…" puis redirect vers `/dashboard` | Pass |
| TC-37 | Après redirect : vérifier IndexedDB | profile + race + plan + weeks + sessions présents dans les stores | Pass |

### Cas limites

| # | Scénario | Résultat attendu | Pass/Fail |
|---|---|---|---|
| CL-05 | Saisir "Trail / Autre" à l'étape 2 sans remplir la distance personnalisée | Bouton "Continuer →" désactivé | Pass |
| CL-06 | Saisir "Trail / Autre" avec une distance custom (ex: 80 km) | Bouton activé, distanceKm = 80 en IndexedDB | Pass |
| CL-07 | Plan < 8 semaines : vérifier la Step 4 | Plan généré sans erreur, phases compressées affichées | Pass |
| CL-08 | Rafraîchir la page en cours d'onboarding | Retour à Step 1 (état non persisté entre rechargements, comportement attendu MVP1) | Pass |

### Résultat Sprint 2 (Onboarding)
[x] Pass &nbsp;&nbsp; [ ] Fail

---

### Cas de test — Create Objective wizard

| # | Action | Résultat attendu | Pass/Fail |
|---|---|---|---|
| TC-38 | Aller sur `/create-objective` | Step 1/3 affiché, barre de progression à 33% | Pass |
| TC-39 | Étape 1 : ne rien sélectionner | Bouton "Continuer →" désactivé | Pass |
| TC-40 | Étape 1 : cliquer "Semi-marathon" | Carte Semi-marathon mise en évidence, bouton activé | Pass |
| TC-41 | Étape 1 : cliquer "Trail / Autre" sans remplir la distance | Champ distance custom affiché, bouton désactivé | Pass |
| TC-42 | Étape 1 : saisir 80 km en mode custom | Bouton "Continuer →" activé | Pass |
| TC-43 | Cliquer "Continuer →" depuis Step 1 | Step 2/3 affiché | Pass |
| TC-44 | Étape 2 : laisser la date vide | Bouton "Continuer →" désactivé | Pass |
| TC-45 | Étape 2 : saisir une date passée | Erreur "La date doit être dans le futur", bouton désactivé | Pass |
| TC-46 | Étape 2 : saisir une date dans 20 semaines | Bouton activé, compteur semaines affiché | Pass |
| TC-47 | Cliquer "Continuer →" depuis Step 2 | Step 3/3 affiché avec résumé course et plan preview | Pass |
| TC-48 | Step 3 : vérifier le résumé | Distance, date, dénivelé (si rempli) visibles | Pass |
| TC-49 | Step 3 : cliquer "Créer l'objectif" | "Enregistrement…" puis redirect vers `/dashboard` | Pass |
| TC-50 | Après redirect : vérifier IndexedDB | race (status=planned) + plan + weeks + sessions présents | Pass |

### Cas limites

| # | Scénario | Résultat attendu | Pass/Fail |
|---|---|---|---|
| CL-09 | Accéder à `/create-objective` sans profil existant en IndexedDB | Message d'erreur à l'étape 3 (profil requis) | Pass |
| CL-10 | Cliquer "← Retour" depuis Step 3 | Retour à Step 2 avec données préservées | Pass |
| CL-11 | Course < 8 semaines : étape 3 | Plan généré avec phases compressées, pas d'erreur | Pass |

### Résultat Sprint 2 (Create Objective)
[x] Pass &nbsp;&nbsp; [ ] Fail

---

### Résultat Sprint 2 global
[x] Pass &nbsp;&nbsp; [ ] Fail

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
