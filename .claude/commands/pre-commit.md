---
description: "Run mandatory quality gates before creating any git commit. Triggers: (1) about to execute 'git commit', (2) user says 'committe', 'commit', 'fais le commit', 'crée le commit', (3) sprint-step reaches the commit step. Runs in order: tsc --noEmit (zero errors), next lint (zero warnings), vitest run (all pass). Blocks commit on any failure."
allowed-tools: Bash
---

# Pre-Commit — Checklist obligatoire avant tout commit

Basé sur CLAUDE.md section "Avant chaque commit". Un commit avec des erreurs TypeScript ou des tests en échec est **INTERDIT**.

Exécuter les trois vérifications dans l'ordre depuis `apps/web/` :

## 1. TypeScript strict
```bash
cd apps/web && npx tsc --noEmit
```
**Zéro erreur. Si erreur : STOP, corriger.**

## 2. ESLint
```bash
cd apps/web && npx next lint
```
**Zéro warning, zéro erreur. Si warning : STOP, corriger.**

## 3. Tests Vitest
```bash
cd apps/web && npx vitest run
```
**Tous les tests doivent passer. Si échec : STOP, corriger.**

---
Si les 3 étapes sont vertes : le commit peut être créé.
Afficher un résumé : `✓ tsc | ✓ lint | ✓ vitest — prêt à committer`
