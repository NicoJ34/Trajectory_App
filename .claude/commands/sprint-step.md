# Sprint Step — Checklist de fin d'étape

L'étape courante vient d'être complétée. Exécute cette checklist dans l'ordre strict défini dans CLAUDE.md, sans sauter d'étape :

## 1. Checklist architecture
Avant de valider l'étape, vérifier mentalement (ou invoquer `/arch-check`) :
- Pas de routes API Next.js, pas de `use server`
- Données uniquement via `packages/shared/db/local.ts`
- Moteur algo dans `packages/shared/engine/` — pas dans les composants
- Aucun appel réseau externe, pas d'auth, single user

**Si un point n'est pas respecté : corriger avant de continuer.**

## 2. Écrire les tests
Écrire tous les tests unitaires et composants (Vitest + React Testing Library) pertinents pour le code produit dans cette étape.

## 3. Lancer les tests automatisés
```bash
cd apps/web && npx vitest run
```
**Si des tests échouent : STOP. Corriger avant de continuer.**

## 4. Test plan manuel
- Le test plan de chaque sprint est dans son propre fichier : `tests/manual/sprint-N.md`
- Si le fichier n'existe pas encore, le créer avec le format standard (Setup, Cas de test, Cas limites, Résultat global)
- Vérifier que le fichier contient les cas de test de cette étape — si des cas manquent, les ajouter
- Mettre à jour le statut dans `tests/manual/global-test-plan.md` (tableau des sprints) après validation
- Afficher les cas à exécuter et **demander à l'utilisateur de les exécuter**
- **Attendre la confirmation Pass/Fail avant de continuer**

## 5. PROGRESS.md
Mettre à jour `PROGRESS.md` pour refléter l'avancement de l'étape complétée.

## 6. Commit
Demander à l'utilisateur : **"Souhaites-tu committer cette étape sur la branche en cours ?"**
- Si oui : lancer `/pre-commit` puis créer le commit (Conventional Commits)
- Si non : passer à l'étape suivante

---
Ne pas démarrer l'étape suivante avant que l'utilisateur ait répondu à la question de commit.
