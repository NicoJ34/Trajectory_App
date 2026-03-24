# Test Plan — Sprint 3 — Dashboard + Vue Plan Hebdomadaire (REQ-04, REQ-05)

## Setup
- `pnpm --filter web dev` → http://localhost:3000
- Avoir complété l'onboarding avec une course dans ~12 semaines (IndexedDB remplie)
- Pour réinitialiser : DevTools → Application → Storage → Clear site data

---

## Cas de test — Dashboard (REQ-04)

| # | Action | Résultat attendu | Pass/Fail |
|---|---|---|---|
| TC-51 | Aller sur `/dashboard` après onboarding | Page s'affiche avec header "Bonjour 👋" + date du jour | |
| TC-52 | Observer la carte "Séance du jour" | Si séance prévue : type + distance + intensité + bouton "Enregistrer la séance" | |
| TC-53 | Carte "Séance du jour" si pas de plan actif | Bouton "Créer mon plan →" visible | |
| TC-54 | Bloc Compte à rebours | Nombre de jours + nom de la course + barre de progression | |
| TC-55 | Bloc Semaine passée | "X / Y séances" + message encourageant | |
| TC-56 | WeekStrip (aperçu semaine) | 7 cases Lun→Dim avec symboles (○ prévu, ● fait, ─ repos) | |
| TC-57 | Actualiser la page `/dashboard` | Données rechargées depuis IndexedDB, affichage identique | |
| TC-58 | Skeleton pendant le chargement | Rectangles gris animés avant que les données apparaissent | |

## Cas limites — Dashboard

| # | Scénario | Résultat attendu | Pass/Fail |
|---|---|---|---|
| CL-12 | Aller sur `/dashboard` sans profil | Carte "Séance du jour" affiche CTA vers `/onboarding` | |
| CL-13 | Séance du jour : jour de repos | "Aujourd'hui c'est repos…" affiché | |

---

## Cas de test — Sidebar (REQ-01 update)

| # | Action | Résultat attendu | Pass/Fail |
|---|---|---|---|
| TC-59 | Observer la sidebar | Lien "Mon Plan" présent entre Dashboard et Nouvel objectif | |
| TC-60 | Cliquer "Mon Plan" dans la sidebar | Navigation vers `/plan`, lien actif mis en évidence | |

---

## Cas de test — Vue Plan Hebdomadaire (REQ-05)

| # | Action | Résultat attendu | Pass/Fail |
|---|---|---|---|
| TC-61 | Aller sur `/plan` | Semaine courante affichée (numéro, phase, dates) | |
| TC-62 | Observer les 7 lignes | Chaque jour affiché avec type séance ou "Repos" | |
| TC-63 | Lignes avec séance | Type + distance + intensité + statut (○ Prévu) | |
| TC-64 | Lignes sans séance | "Repos" affiché | |
| TC-65 | Lignes passées sans log | Statut "– Manqué" grisé | |
| TC-66 | Bas de page | Volume total en km + durée estimée | |
| TC-67 | Cliquer "←" | Semaine précédente affichée, numéro décrémenté | |
| TC-68 | Cliquer "→" | Semaine suivante affichée, numéro incrémenté | |
| TC-69 | Première semaine : bouton "←" | Bouton désactivé (opacity réduite) | |
| TC-70 | Dernière semaine : bouton "→" | Bouton désactivé (opacity réduite) | |
| TC-71 | Bouton "Signaler une contrainte" | Visible mais grisé, mention "Disponible au Sprint 4" | |
| TC-72 | Cliquer une ligne "Prévu" | Redirige vers `/logger` | |

## Cas limites — Vue Plan

| # | Scénario | Résultat attendu | Pass/Fail |
|---|---|---|---|
| CL-14 | Aller sur `/plan` sans profil | "Aucun plan actif" + CTA vers `/onboarding` | |
| CL-15 | Naviguer vers une semaine très future | Données affichées, toutes les séances en "○ Prévu" | |
| CL-16 | Naviguer vers une semaine passée | Séances non loggées en "– Manqué" | |

---

## Résultat global
[ ] Pass &nbsp;&nbsp; [ ] Fail
