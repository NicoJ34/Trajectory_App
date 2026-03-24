# End of Sprint — Checklist de fin de sprint

Le sprint vient d'être complété. Exécute cette checklist complète avant de considérer le sprint comme terminé.

## 1. Tous les tests automatisés
```bash
cd apps/web && npx vitest run
```
**Si des tests échouent : STOP. Le sprint n'est pas terminé.**

## 2. TypeScript + ESLint
```bash
cd apps/web && npx tsc --noEmit && npx next lint
```
**Zéro erreur obligatoire.**

## 3. Test plan manuel complet
- Ouvre `tests/manual/global-test-plan.md`
- Affiche TOUS les cas de test du sprint en cours (TC-XX et CL-XX)
- **Demande à l'utilisateur d'exécuter tous ces cas**
- Attendre la confirmation Pass/Fail pour chaque cas
- **Si un cas échoue : STOP. Corriger avant de continuer.**

## 4. PROGRESS.md
Mets à jour `PROGRESS.md` :
- Marquer le sprint comme **Terminé** (avec la date)
- Mettre à jour la section "Prochaine tâche" avec le sprint suivant
- Ajouter une entrée dans l'Historique

## 5. Commit final
Créer un commit de clôture du sprint avec un message de type `chore:`.

## 6. Merge sur main
Demande à l'utilisateur : **"Souhaites-tu merger cette branche sur main ?"**
- Si oui : rappeler de faire une PR ou un merge manuel, et vérifier que main est propre après
- Si non : laisser la branche ouverte

---
Le sprint n'est considéré comme terminé que lorsque tous les tests (auto + manuels) sont verts.
