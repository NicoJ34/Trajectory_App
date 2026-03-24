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
