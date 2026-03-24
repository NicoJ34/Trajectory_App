# Skills Guide — Trajectory App

Guide de référence pour les skills Claude Code du projet. Décrit quand Claude doit invoquer chaque skill automatiquement.

---

```yaml
skills:
  - name: arch-check
    description: "Vérifier la conformité architecturale MVP1 avant de valider une tâche"
    purpose: "Garantir que le code respecte les contraintes MVP1 à chaque étape"
    when_to_use:
      - "Une tâche todo est sur le point d'être cochée"
      - "Des fichiers dans components/, pages/, ou engine/ ont été modifiés"
      - "L'utilisateur dit 'c'est bon', 'étape terminée', 'marque comme fini'"
      - "sprint-step est invoqué (arch-check est son étape 1)"
    example_prompt: "J'ai fini d'implémenter le composant WeeklyPlan"
    dependencies: "Read, Glob, Grep, Bash — Documentation/Technical_Architecture.md"

  - name: sprint-step
    description: "Exécuter la checklist complète de fin d'étape sprint"
    purpose: "Garantir tests, test plan manuel, PROGRESS.md et commit à chaque étape"
    when_to_use:
      - "Une étape de la todo list du sprint vient d'être implémentée"
      - "L'utilisateur dit 'j'ai fini cette étape', 'passe à la suite', 'next', 'on continue'"
      - "Un bloc d'implémentation du plan de sprint est complété"
    example_prompt: "Ok j'ai fini l'étape 2, on continue ?"
    dependencies: "arch-check, pre-commit, Vitest, tests/manual/sprint-N.md, PROGRESS.md"

  - name: new-sprint
    description: "Initialiser un nouveau sprint avec plan, branche et todo list"
    purpose: "Démarrer chaque sprint avec un plan approuvé avant toute implémentation"
    when_to_use:
      - "L'utilisateur dit 'on commence le sprint N', 'démarre le sprint', 'nouveau sprint'"
      - "L'utilisateur dit 'on attaque le sprint', 'let's start sprint N'"
      - "PROGRESS.md indique sprint actuel terminé et prochain sprint non démarré"
      - "Après un merge de sprint sur main, l'utilisateur veut continuer"
    example_prompt: "Allez, on attaque le sprint 4"
    dependencies: "Plans/, PROGRESS.md, git branch, TodoWrite"

  - name: pre-commit
    description: "Lancer les 3 quality gates obligatoires avant tout commit git"
    purpose: "Interdire les commits avec erreurs TypeScript, ESLint ou tests échoués"
    when_to_use:
      - "Avant toute commande 'git commit'"
      - "L'utilisateur dit 'committe', 'fais le commit', 'commit ça', 'crée le commit'"
      - "sprint-step atteint l'étape commit (étape 6)"
    example_prompt: "Ok committe l'étape"
    dependencies: "Bash — apps/web/ (tsc, next lint, vitest)"

  - name: end-of-sprint
    description: "Exécuter la checklist complète de clôture de sprint"
    purpose: "Valider le sprint avec tests complets, PROGRESS.md et merge sur main"
    when_to_use:
      - "Toutes les tâches TodoWrite du sprint sont cochées"
      - "L'utilisateur dit 'le sprint est terminé', 'fin de sprint', 'on a fini le sprint'"
      - "L'utilisateur dit 'c'est bon le sprint', 'sprint done'"
      - "L'utilisateur demande à merger la branche sur main"
    example_prompt: "C'est bon, le sprint 3 est terminé, on merge ?"
    dependencies: "Vitest, Playwright, tsc+lint, tests/manual/global-test-plan.md, PROGRESS.md"
```

---

## Séquence sprint complète

```
/new-sprint
  └─ plan approuvé → branche créée → TodoWrite
       └─ [implémentation étape 1]
            └─ /sprint-step
                 └─ arch-check → tests → vitest → test plan → PROGRESS.md → commit?
       └─ [implémentation étape 2]
            └─ /sprint-step
                 └─ ...
       └─ [implémentation étape N]
            └─ /sprint-step
/end-of-sprint
  └─ vitest + E2E + tsc/lint → test plan complet → PROGRESS.md → commit → merge main?
```

---

## Checklist trigger — "ce prompt déclenche le skill X"

| Prompt utilisateur | Skill déclenché |
|---|---|
| "J'ai fini d'implémenter X" | `/arch-check` + `/sprint-step` |
| "C'est bon, étape terminée" | `/sprint-step` |
| "Passe à la suite" | `/sprint-step` |
| "Committe l'étape" | `/pre-commit` → commit |
| "Fais le commit" | `/pre-commit` → commit |
| "On attaque le sprint N" | `/new-sprint` |
| "Démarre le sprint" | `/new-sprint` |
| "Le sprint est terminé" | `/end-of-sprint` |
| "On a fini le sprint" | `/end-of-sprint` |
| "On merge ?" | `/end-of-sprint` (si pas déjà fait) |
| "C'est quoi la suite ?" (après merge) | `/new-sprint` |
