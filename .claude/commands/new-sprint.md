# New Sprint — Démarrage d'un sprint

Basé sur CLAUDE.md section "Avant de commencer chaque sprint". À invoquer au début de chaque nouveau sprint.

## 1. Identifier le sprint
Demander (ou déduire depuis PROGRESS.md) :
- Numéro du sprint (N)
- Nom court du sprint (ex: `engine-onboarding`)
- Branche cible : `feat/sprint-N-nom`
- REQ couverts

## 2. Entrer en plan mode
Passer en mode plan (`/plan`) pour préparer le plan détaillé avant toute implémentation.

Le plan doit inclure :
- **Contexte** : pourquoi ce sprint, quel problème il résout
- **Étapes numérotées** avec fichiers cibles pour chacune
- **Fonctions/utilitaires existants** à réutiliser (ne pas recréer)
- **Section Vérification** : comment tester le sprint end-to-end

Format de référence : voir `Plans/sprint-0-setup.md`

## 3. Sauvegarder le plan
Une fois approuvé, sauvegarder dans :
```
Plans/sprint-N-nom.md
```
ex: `Plans/sprint-2-engine-onboarding.md`

## 4. Créer la branche
```bash
git checkout -b feat/sprint-N-nom
```

## 5. Committer le plan
```bash
git add Plans/sprint-N-nom.md
git commit -m "chore: add Sprint N plan — nom"
```

## 6. Démarrer l'implémentation
Créer la todo list avec TodoWrite, puis traiter chaque étape en invoquant `/sprint-step` à la fin de chacune.

---
Ne jamais commencer à coder avant que le plan soit approuvé par l'utilisateur.
