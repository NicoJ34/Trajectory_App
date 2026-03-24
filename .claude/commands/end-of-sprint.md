# End of Sprint — Checklist de fin de sprint

Le sprint vient d'être complété. Exécute cette checklist complète avant de considérer le sprint comme terminé. Basé sur CLAUDE.md section "En fin de sprint".

## 1. Tous les tests automatisés
```bash
cd apps/web && npx vitest run
```
**Si des tests échouent : STOP. Le sprint n'est pas terminé.**

## 2. Tests E2E (si disponibles)
```bash
pnpm --filter web test:e2e
```
Si Playwright n'est pas encore configuré pour ce sprint, noter explicitement "E2E : N/A ce sprint".

## 3. TypeScript + ESLint
```bash
cd apps/web && npx tsc --noEmit && npx next lint
```
**Zéro erreur, zéro warning obligatoire.**

## 4. Test plan manuel complet
- Ouvrir `tests/manual/global-test-plan.md`
- Afficher **TOUS** les cas de test du sprint en cours (TC-XX et CL-XX)
- **Demander à l'utilisateur d'exécuter tous ces cas**
- Attendre la confirmation Pass/Fail pour chaque cas
- **Si un cas échoue : STOP. Corriger avant de continuer.**
- Cocher le résultat global `[x] Pass` dans le fichier

## 5. PROGRESS.md
Mettre à jour `PROGRESS.md` :
- Marquer le sprint comme **Terminé** (avec la date)
- Mettre à jour la section "Prochaine tâche" avec le sprint suivant
- Ajouter une entrée dans l'Historique avec les fichiers créés/modifiés et les REQ validés

## 6. Commit de clôture
Créer un commit `chore: update PROGRESS.md — Sprint N complete, Sprint N+1 next`.

## 7. Merge sur main
Demander à l'utilisateur : **"Souhaites-tu merger cette branche sur main ?"**
- Rappeler : jamais de commit direct sur main — passer par une PR ou un merge manuel vérifié
- Si oui : proposer la commande de merge
- Si non : laisser la branche ouverte

---
Le sprint n'est considéré comme terminé que lorsque tous les tests (auto + manuels) sont verts et que PROGRESS.md est à jour.
