# Sprint Step — Checklist de fin d'étape

L'étape courante vient d'être complétée. Exécute cette checklist dans l'ordre, sans sauter d'étape :

## 1. Tests automatisés
Lance les tests Vitest et affiche le résultat :
```bash
cd apps/web && npx vitest run
```
**Si des tests échouent : STOP. Corriger avant de continuer.**

## 2. Test plan manuel
- Ouvre `tests/manual/global-test-plan.md`
- Vérifie que la section du sprint en cours existe et contient les cas de test de l'étape qui vient d'être complétée
- Si des cas manquent, les ajouter maintenant
- Affiche les cas de test manuels à exécuter pour cette étape et **demande à l'utilisateur de les exécuter**

## 3. PROGRESS.md
Mets à jour `PROGRESS.md` pour refléter l'avancement de l'étape complétée.

## 4. Commit
Demande à l'utilisateur : **"Souhaites-tu committer cette étape sur la branche en cours ?"**
- Si oui : créer le commit avec un message Conventional Commits décrivant l'étape
- Si non : passer à l'étape suivante sans committer

---
Ne pas démarrer l'étape suivante avant que l'utilisateur ait répondu à la question de commit.
