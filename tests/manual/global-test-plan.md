# Plan de Test Manuel Global — Trajectory App

> Index de tous les plans de test par sprint.
> Chaque sprint a son propre fichier détaillé.
> Ce document indique le statut global de chaque sprint.

---

## Prérequis communs

- App lancée sur `http://localhost:3000` (`pnpm --filter web dev`)
- Navigateur : Chrome (desktop, ≥1280px)
- IndexedDB vide sauf indication contraire

Pour vider l'IndexedDB :
> DevTools → Application → Storage → Clear site data

---

## Statut par sprint

| Sprint | Fonctionnalité | Requirements | Fichier | Statut |
|---|---|---|---|---|
| Sprint 0 | Navigation & Structure | REQ-01 | [sprint-0.md](sprint-0.md) | ✅ Pass (2026-03-24) |
| Sprint 1 | Navigation Fix + Types + DB Layer | REQ-01 update, REQ-11 | [sprint-1.md](sprint-1.md) | ✅ Pass (2026-03-24) |
| Sprint 2 | Onboarding + Create Objective | REQ-02 | [sprint-2.md](sprint-2.md) | ✅ Pass (2026-03-24) |
| Sprint 3 | Dashboard + Plan hebdomadaire | REQ-04, REQ-05 | [sprint-3.md](sprint-3.md) | 🔄 Tests manuels à valider |
| Sprint 4 | Log séance + Contraintes | REQ-06, REQ-07, REQ-08 | [sprint-4.md](sprint-4.md) | ⏳ À faire |
| Sprint 5 | Calendrier courses + Réglages | REQ-09, REQ-10 | [sprint-5.md](sprint-5.md) | ⏳ À faire |
| Sprint 6 | Tests bout-en-bout + Corrections | REQ-12 | [sprint-6.md](sprint-6.md) | ⏳ À faire |

---

## Scénario bout-en-bout (fin MVP1)

> À compléter après Sprint 6 — parcours complet utilisateur de l'onboarding jusqu'au log de séance et adaptation du plan.
