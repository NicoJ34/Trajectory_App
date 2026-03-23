# MVP1 REQUIREMENTS
## Trajectory — Web App Desktop, Données Locales

**Version:** 1.0
**Date:** 23 Mars 2026
**Statut:** Approuvé — prêt pour implémentation

---

## Contexte

MVP1 est une web app desktop (Next.js) avec toutes les données stockées localement dans le navigateur (IndexedDB via `localforage`). Aucun backend, aucune authentification, aucun déploiement requis. L'objectif est de valider l'UX et l'algorithme d'adaptation sur `localhost:3000` avant d'investir dans l'infrastructure cloud (MVP2).

---

## Stack Technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styles | Tailwind CSS |
| Composants UI | shadcn/ui |
| Stockage local | localforage (IndexedDB) |
| Dates | date-fns |
| Validation | Zod |
| Icônes | lucide-react |

---

## Décisions UX

| Décision | Choix |
|---|---|
| Langue interface | Français |
| Log de séance | Modal (Dialog shadcn/ui) |
| Séance manquée | Toujours loggable depuis la vue plan |
| Adaptation automatique | Banner discret + explication accessible |
| Onboarding sans course | Bloquant — une course cible est requise |

---

## REQ-01 — Structure & Navigation

### Description
L'application utilise une sidebar gauche fixe (220px) pour la navigation principale, visible sur toutes les pages post-onboarding. Le contenu principal est fluid avec un max-width de 900px centré. L'onboarding est une page pleine sans sidebar.

### Wireframe
```
┌─────────────┬──────────────────────────────────────────┐
│  TRAJECTORY │                                          │
│  ─────────  │          [contenu principal]             │
│  🏠 Dashboard│                                          │
│  📅 Mon Plan │                                          │
│  🏁 Courses  │                                          │
│  📊 Historique│                                         │
│  ⚙️ Réglages │                                          │
└─────────────┴──────────────────────────────────────────┘
```

### Routes
| Route | Page |
|---|---|
| `/` | Redirection → `/onboarding` si pas de profil, sinon `/dashboard` |
| `/onboarding` | Wizard 4 étapes (pleine page, sans sidebar) |
| `/dashboard` | Accueil quotidien |
| `/plan` | Vue plan hebdomadaire |
| `/races` | Calendrier des courses |
| `/history` | Historique des séances |
| `/settings` | Réglages profil |

### Critères d'acceptation
- [ ] La sidebar est visible et fonctionnelle sur toutes les pages sauf `/onboarding`
- [ ] Le lien actif dans la sidebar est visuellement mis en évidence
- [ ] La page `/` redirige automatiquement vers `/onboarding` si aucun profil n'existe dans localforage
- [ ] La page `/` redirige automatiquement vers `/dashboard` si un profil existe
- [ ] Toutes les routes sont accessibles via la sidebar sans rechargement de page
- [ ] Le layout est lisible sur un écran desktop ≥ 1280px de large

---

## REQ-02 — Onboarding (Wizard 4 Étapes)

### Description
L'onboarding est un wizard séquentiel qui collecte le profil du coureur, sa course cible, ses préférences d'entraînement, puis affiche un aperçu du plan généré. L'utilisateur doit valider chaque étape pour passer à la suivante. Une course cible est obligatoire pour terminer l'onboarding.

### Wireframe — Étape 1/4 : Profil Coureur
```
┌───────────────────────────────────────────────────────┐
│                    🏃 Trajectory                       │
│              "Your Perfect Race Path"                  │
│                                                       │
│  ●────○────○────○   Étape 1 sur 4                     │
│                                                       │
│  Expérience en course                                 │
│  ┌──────────┐ ┌─────────────┐ ┌──────────┐           │
│  │ Débutant │ │●Intermédiaire│ │  Avancé  │           │
│  │ < 1 an   │ │  1 - 3 ans  │ │  3+ ans  │           │
│  └──────────┘ └─────────────┘ └──────────┘           │
│                                                       │
│  Volume actuel    Jours/semaine disponibles           │
│  [  25  ] km/sem  [ 4 ▼ ]                             │
│                                                       │
│  Terrain préféré                                      │
│  ○ Route  ○ Trail  ● Les deux                         │
│                                                       │
│  Blessures récentes (optionnel)                       │
│  [________________________________]                   │
│                                                       │
│                              [  Continuer →  ]        │
└───────────────────────────────────────────────────────┘
```

### Wireframe — Étape 2/4 : Course Cible
```
│  ○────●────○────○   Étape 2 sur 4                     │
│                                                       │
│  Distance                                             │
│  ┌────────┐ ┌──────────────┐ ┌──────────┐            │
│  │  10 km │ │● Semi-marathon│ │ Marathon │            │
│  └────────┘ └──────────────┘ └──────────┘            │
│                                                       │
│  Nom de la course (optionnel)                         │
│  [ Ex : Marseille-Cassis 2026 __________ ]           │
│                                                       │
│  Date cible                                           │
│  [ 15 / 06 / 2026  📅 ]                              │
│                                                       │
│  ✅  14 semaines de préparation — parfait !           │
│  ⚠️  Si < 8 semaines : avertissement affiché          │
│                                                       │
│  + Ajouter une autre course (optionnel)               │
│                                                       │
│  [← Retour]                          [Continuer →]   │
```

### Wireframe — Étape 3/4 : Préférences
```
│  ○────○────●────○   Étape 3 sur 4                     │
│                                                       │
│  Quel jour veux-tu faire ta longue sortie ?           │
│  ○ Samedi   ● Dimanche                                │
│                                                       │
│  Cross-training préféré                               │
│  ┌──────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │●Renforcement│ │Natation│ │Vélo  │ │Marche  │       │
│  └──────────┘ └────────┘ └────────┘ └────────┘       │
│                                                       │
│  Unités de mesure                                     │
│  ● km   ○ miles                                       │
│                                                       │
│  [← Retour]                          [Continuer →]   │
```

### Wireframe — Étape 4/4 : Aperçu du Plan
```
│  ○────○────○────●   Ton plan est prêt !               │
│                                                       │
│  Semi-marathon · Marseille-Cassis · 15 juin          │
│  14 semaines · Terrain mixte                         │
│                                                       │
│  ┌────────┬──────────┬────────┬────────┐             │
│  │ 8 sem  │  3 sem   │ 2 sem  │ 1 sem  │             │
│  │  Base  │ Intensif │  Peak  │ Taper  │             │
│  └────────┴──────────┴────────┴────────┘             │
│                                                       │
│  Semaine 1 — Aperçu                                   │
│  Lun  Repos                                           │
│  Mar  Course facile · 6 km · Facile                  │
│  Mer  Renforcement · 40 min                           │
│  Jeu  Course facile · 8 km · Facile                  │
│  Ven  Repos                                           │
│  Sam  Tempo · 6 km · Modéré                          │
│  Dim  Longue sortie · 12 km · Facile                 │
│                                                       │
│  [← Ajuster]                  [🚀 Commencer →]        │
```

### Critères d'acceptation
- [ ] La barre de progression indique l'étape courante (1/4, 2/4, 3/4, 4/4)
- [ ] Le bouton "Continuer" est désactivé si les champs obligatoires ne sont pas remplis
- [ ] Le bouton "Retour" ramène à l'étape précédente sans perdre les données saisies
- [ ] **Étape 1** : Le niveau d'expérience est obligatoire. Volume (km/sem) et jours dispo sont obligatoires. Terrain et blessures sont optionnels.
- [ ] **Étape 2** : La distance est obligatoire. La date cible est obligatoire. Le nom est optionnel.
- [ ] **Étape 2** : Le nombre de semaines est calculé et affiché en temps réel dès qu'une date est saisie.
- [ ] **Étape 2** : Si la date cible est à moins de 8 semaines, un avertissement est affiché mais l'utilisateur peut continuer.
- [ ] **Étape 2** : Si la date cible est dans le passé, le bouton "Continuer" reste désactivé.
- [ ] **Étape 4** : Le plan est généré et affiché en moins de 2 secondes. Un indicateur de chargement est affiché pendant la génération.
- [ ] **Étape 4** : L'aperçu montre les 7 jours de la semaine 1 avec les séances détaillées.
- [ ] **Étape 4** : Un clic sur "Commencer" sauvegarde le profil et le plan dans localforage, puis redirige vers `/dashboard`.
- [ ] Après l'onboarding, un retour sur `/onboarding` redirige vers `/dashboard`.

---

## REQ-03 — Génération de Plan

### Description
L'algorithme génère un plan d'entraînement complet depuis aujourd'hui jusqu'à la date de la course. Le plan est structuré en phases (Base, Build, Peak, Taper) avec une progression de volume de +10% par semaine et une semaine de décharge toutes les 4 semaines.

### Règles de génération
- Durée = nombre de semaines entières entre aujourd'hui et la date de course (minimum 8)
- Phases : Base (jusqu'à N-6), Build (N-5 à N-3), Peak (N-2), Taper (N-1), Race Week (N)
- Volume de départ = volume actuel saisi par l'utilisateur (ou 20 km/sem si < 20 km)
- Progression = +10%/semaine, décharge = -20% toutes les 4 semaines
- Long run = le jour préféré de l'utilisateur (samedi ou dimanche)
- Cross-training = 1 session/semaine du type préféré de l'utilisateur
- Distribution 80/20 : 80% volume facile, 20% intensif (tempo uniquement en phases Build et Peak)

### Critères d'acceptation
- [ ] Le plan généré couvre exactement la période de aujourd'hui à la date de course
- [ ] Le plan contient une `Week` pour chaque semaine, avec ses `Session[]`
- [ ] Chaque semaine Base contient : 2 easy runs, 1 long run, 1 cross-training, repos
- [ ] Chaque semaine Build/Peak contient : 2 easy runs, 1 long run, 1 tempo, 1 cross-training, repos
- [ ] La dernière semaine (Taper) a un volume réduit de 50% par rapport au pic
- [ ] Le long run est toujours assigné au jour préféré (samedi ou dimanche)
- [ ] La progression de volume ne dépasse pas +10% par semaine
- [ ] Une semaine de décharge (volume -20%) apparaît toutes les 4 semaines
- [ ] Si la course est à moins de 8 semaines, le plan est généré avec des phases compressées (pas de rejet)
- [ ] Le plan est sauvegardé dans localforage sous la clé du plan ID

---

## REQ-04 — Dashboard

### Description
Page d'accueil quotidienne. Répond à la question "que dois-je faire aujourd'hui ?" en un coup d'œil. Affiche la séance du jour, le compte à rebours de la course, le résumé de la semaine passée, et une mini-vue de la semaine courante.

### Wireframe
```
┌─────────────┬──────────────────────────────────────────┐
│  TRAJECTORY │  Bonjour 👋  Lundi 23 mars               │
│  ─────────  ├──────────────────────────────────────────┤
│ ●Dashboard  │                                          │
│  Mon Plan   │  ┌──────────────────────────────────────┐│
│  Courses    │  │  SÉANCE DU JOUR                      ││
│  Historique │  │  🏃 Course facile                     ││
│  Réglages   │  │  8 km  ·  ~50 min  ·  Facile         ││
│             │  │  Route ou Trail au choix              ││
│             │  │  "Start slower than you think."      ││
│             │  │  [  ✓ Enregistrer la séance  ]       ││
│             │  │  [  › Voir les détails        ]       ││
│             │  └──────────────────────────────────────┘│
│             │                                          │
│             │  ┌───────────────┐ ┌────────────────┐   │
│             │  │ COMPTE À REBOURS│ │ SEMAINE PASSÉE │   │
│             │  │   84 jours    │ │   5 / 6  ✓     │   │
│             │  │  Marseille-   │ │  Bonne semaine! │   │
│             │  │  Cassis       │ │                │   │
│             │  └───────────────┘ └────────────────┘   │
│             │                                          │
│             │  Aperçu semaine                          │
│             │  Lun●  Mar○  Mer✓  Jeu○  Ven─  Sam○  Dim○│
└─────────────┴──────────────────────────────────────────┘
```

### États de la carte "Séance du jour"
| Situation | Affichage |
|---|---|
| Séance prévue non logguée | Carte avec détails + bouton "Enregistrer" |
| Jour de repos | "Aujourd'hui c'est repos. La récupération fait partie de l'entraînement." |
| Séance déjà logguée | Résumé (distance, durée, RPE) + message d'encouragement |
| Aucun plan actif | CTA vers l'onboarding |

### Critères d'acceptation
- [ ] Le dashboard charge les données depuis localforage au montage de la page
- [ ] La séance du jour correspond à la session dont `session_date` === date d'aujourd'hui
- [ ] Un clic sur "Enregistrer la séance" ouvre le modal de log (REQ-06)
- [ ] Le compte à rebours affiche le nombre de jours jusqu'à la prochaine course active
- [ ] Le résumé de la semaine passée affiche "X / Y séances" complétées
- [ ] Le message de la semaine passée est encourageant quelle que soit la valeur (pas de messages négatifs)
- [ ] La mini-vue hebdomadaire affiche les 7 jours avec statut visuel (prévu / fait / repos / manqué)
- [ ] Si aucune séance n'est prévue aujourd'hui, l'état "repos" est affiché
- [ ] Si la séance du jour est déjà logguée, le bouton "Enregistrer" est remplacé par le résumé

---

## REQ-05 — Vue Plan Hebdomadaire

### Description
Vue complète des 7 jours de la semaine sélectionnée. Permet la navigation entre semaines, l'accès au détail de chaque séance, et la signalisation de contraintes. Affiche un banner si la semaine a été adaptée automatiquement.

### Wireframe
```
┌─────────────┬──────────────────────────────────────────┐
│  TRAJECTORY │  Semaine 4 · Phase Base · 23-29 mars     │
│             ├──────────────────────────────────────────┤
│ ●Mon Plan   │  ← Sem. 3     [Semaine actuelle]  Sem. 5→│
│             │                                          │
│             │  [!] Plan ajusté cette semaine › Pourquoi?│  ← si adapté
│             │                                          │
│             │  ┌────┬──────────────────────┬──────────┐│
│             │  │Jour│ Séance               │ Statut   ││
│             │  ├────┼──────────────────────┼──────────┤│
│             │  │Lun │ Repos                │    ─     ││
│             │  │Mar │🏃 Course facile · 8km│ ○ Prévu  ││
│             │  │Mer │💪 Renforcement · 40m │ ✓ Fait   ││
│             │  │Jeu │🏃 Course facile · 6km│ ○ Prévu  ││
│             │  │Ven │ Repos                │    ─     ││
│             │  │Sam │⚡ Tempo · 7km        │ ○ Prévu  ││
│             │  │Dim │🏃 Longue · 14km      │ ○ Prévu  ││
│             │  └────┴──────────────────────┴──────────┘│
│             │                                          │
│             │  Volume : 35 km · 4h30 estimées          │
│             │  [⚠️ Signaler une contrainte cette sem.] │
└─────────────┴──────────────────────────────────────────┘
```

### Statuts des séances
| Statut | Icône | Condition |
|---|---|---|
| Prévu | ○ | Séance future non logguée |
| Fait | ✓ | SessionLog existe pour cette session |
| Manqué | — (grisé) | Date passée, pas de log, pas de skip |
| Passé | → | Marqué comme skipped par l'utilisateur |
| Repos | ─ | Aucune séance prévue ce jour |

### Critères d'acceptation
- [ ] La semaine courante est affichée par défaut au chargement
- [ ] Les boutons ← → permettent de naviguer vers la semaine précédente et suivante
- [ ] Cliquer sur une séance ouvre le modal de log (REQ-06)
- [ ] Cliquer sur une séance déjà logguée ouvre le modal avec les données pré-remplies (édition)
- [ ] Le numéro de semaine, la phase et les dates sont affichés dans l'en-tête
- [ ] Le volume total de la semaine (km + durée estimée) est affiché en bas
- [ ] Si la semaine a été adaptée, un banner discret est affiché avec un lien "Pourquoi ?"
- [ ] Cliquer sur "Pourquoi ?" affiche une explication en langage courant (tirée de l'AdaptationLog)
- [ ] Le bouton "Signaler une contrainte" est toujours visible et ouvre le modal de contrainte (REQ-07)
- [ ] Les séances de toutes les semaines passées sont toujours accessibles et loggables

---

## REQ-06 — Log de Séance (Modal)

### Description
Modal de saisie pour enregistrer une séance réalisée. Pré-rempli avec les valeurs prescrites. Calcule l'allure en temps réel. Déclenche une vérification d'adaptation après enregistrement.

### Wireframe
```
┌─────────────────────────────────────────┐
│  Enregistrer la séance         [✕]      │
│  Course facile · Mardi 24 mars          │
├─────────────────────────────────────────┤
│  Distance réalisée                      │
│  [  8.2  ] km   (prescrit : 8 km)      │
│                                         │
│  Durée                                  │
│  [ 0h ] [ 52 ] min                      │
│                                         │
│  Effort ressenti                        │
│  ┌────────┐  ┌──────────┐  ┌─────────┐ │
│  │  😌    │  │   💪     │  │   😤   │ │
│  │ Facile │  │  Modéré  │  │ Difficile│ │
│  └────────┘  └──────────┘  └─────────┘ │
│                                         │
│  Notes (optionnel)                      │
│  [________________________________]     │
│                                         │
│  Dénivelé (optionnel)                   │
│  [ 120 ] m                              │
│                                         │
│  Allure calculée : 6'21"/km             │
│                                         │
│  [  Passer  ]      [  ✓ Enregistrer  ] │
└─────────────────────────────────────────┘
```

### Critères d'acceptation
- [ ] Le modal s'ouvre depuis le dashboard ou la vue plan hebdomadaire
- [ ] Le titre du modal affiche le type de séance et la date
- [ ] La distance est pré-remplie avec la valeur prescrite, modifiable
- [ ] La durée est pré-remplie avec la durée estimée, modifiable
- [ ] Le RPE est une sélection visuelle à 3 options (Facile / Modéré / Difficile), aucune option sélectionnée par défaut
- [ ] L'allure est calculée automatiquement en min/km dès que distance ET durée sont renseignées
- [ ] Pour les séances de cross-training (renforcement, natation, etc.) : le champ distance est masqué, seule la durée est obligatoire
- [ ] Le bouton "Enregistrer" est désactivé si distance (pour les courses) ou durée est absente, ou si RPE n'est pas sélectionné
- [ ] Un clic sur "Passer" marque la séance comme skipped et ferme le modal
- [ ] Après enregistrement : toast de confirmation, modal fermé, vue mise à jour
- [ ] Après enregistrement : l'algorithme d'adaptation vérifie s'il y a des signaux de fatigue et adapte si nécessaire
- [ ] Le SessionLog est sauvegardé dans localforage avec l'allure calculée
- [ ] Si le modal est ouvert sur une séance déjà logguée, les champs sont pré-remplis avec les valeurs existantes (mode édition)

---

## REQ-07 — Signaler une Contrainte (Modal)

### Description
Modal permettant à l'utilisateur de signaler un événement qui affecte son entraînement pour la semaine en cours. Déclenche l'algorithme d'adaptation après soumission.

### Wireframe
```
┌─────────────────────────────────────────┐
│  Cette semaine...              [✕]      │
│  Signaler une contrainte                │
├─────────────────────────────────────────┤
│  Que se passe-t-il ?                    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ✈️  En déplacement             │    │
│  ├─────────────────────────────────┤    │
│  │ 🤒  Fatigue / pas bien         │    │
│  ├─────────────────────────────────┤    │
│  │ 🏋️  Équipement non dispo       │    │
│  ├─────────────────────────────────┤    │
│  │ ⏰  Manque de temps            │    │
│  ├─────────────────────────────────┤    │
│  │ ✏️  Autre                      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Si fatigue sélectionnée]              │
│  Sévérité   ● Légère   ○ Modérée        │
│                                         │
│  Précisions (optionnel)                 │
│  [________________________________]     │
│                                         │
│  [Annuler]       [Adapter mon plan]     │
└─────────────────────────────────────────┘
```

### Sous-options par type
| Type | Sous-options |
|---|---|
| En déplacement | Jours concernés (optionnel), route uniquement ? (oui/non) |
| Fatigue / pas bien | Sévérité : Légère / Modérée |
| Équipement non dispo | Quoi : Salle / Piscine / Vélo / Autre |
| Manque de temps | Nombre de jours affectés |
| Autre | Champ texte libre |

### Critères d'acceptation
- [ ] Le modal est accessible depuis la vue plan hebdomadaire
- [ ] Un seul type de contrainte peut être sélectionné à la fois
- [ ] Les sous-options s'affichent uniquement après sélection d'un type
- [ ] Le bouton "Adapter mon plan" est désactivé si aucun type n'est sélectionné
- [ ] Après soumission : la contrainte est sauvegardée dans localforage
- [ ] Après soumission : l'algorithme d'adaptation est appelé et modifie les sessions de la semaine
- [ ] Après soumission : toast "Ton plan pour cette semaine a été ajusté."
- [ ] La vue plan hebdomadaire est mise à jour automatiquement pour refléter les nouvelles sessions
- [ ] Le banner "Plan ajusté" (REQ-05) apparaît sur la vue plan après l'adaptation

---

## REQ-08 — Algorithme d'Adaptation

### Description
L'algorithme analyse les performances récentes et les contraintes signalées pour adapter les sessions de la semaine suivante. Il tourne en client-side TypeScript (pas de serveur en MVP1). Déclenché après chaque log de séance et après chaque soumission de contrainte.

### Règles d'adaptation (cf. Algorithm_Adaptation_Spec.md)

**Signaux de fatigue :**
- Pace drop : allure facile dégradée de >8% sur 2 semaines consécutives
- RPE élevé : >50% des séances logguées comme "Difficile" sur easy-prescribed sessions (2 semaines)
- Signal utilisateur : contrainte de type "fatigue" ou "blessure"

**Réponses :**
| Sévérité | Action |
|---|---|
| Légère (1 signal medium) | Volume -10%, 1 tempo converti en facile |
| Haute (2+ signaux ou signal user) | Volume -20-30%, tous les tempos → facile, +1 jour repos |
| Contrainte voyage | Sessions trail → route, long run raccourci si jours voyage |
| Contrainte équipement | Sessions gym → alternative sans équipement |
| Contrainte temps | Durées réduites proportionnellement, priorité : long run > facile > tempo > cross-training |

### Critères d'acceptation
- [ ] L'algorithme calcule le rolling pace baseline sur les 6 derniers easy runs logués
- [ ] Le pace drop est détecté si la moyenne des 2 dernières semaines est >8% inférieure à la baseline
- [ ] Le signal RPE est détecté si >50% des sessions faciles des 2 dernières semaines sont logguées "Difficile"
- [ ] En cas de signal léger (1 signal medium) : le volume de la semaine suivante est réduit de 10% et 1 tempo est converti en facile
- [ ] En cas de signal fort (2+ signaux ou signal user) : volume -20-30%, tous les tempos → facile, rest day ajouté
- [ ] Les contraintes utilisateur modifient les sessions de la semaine courante (pas la suivante)
- [ ] Chaque adaptation est enregistrée dans un `AdaptationLog` avec la raison et les changements effectués
- [ ] Si aucun signal n'est détecté, aucune adaptation n'est faite (semaine inchangée)
- [ ] Les sessions modifiées ont une note explicative (ex : "Volume réduit suite à signaux de fatigue")

---

## REQ-09 — Calendrier des Courses

### Description
Page listant toutes les courses planifiées par l'utilisateur avec leur statut, le plan associé, et une frise temporelle. Permet d'ajouter, modifier ou supprimer une course.

### Wireframe
```
┌─────────────┬──────────────────────────────────────────┐
│  TRAJECTORY │  Mes Courses            [+ Ajouter]      │
│  ─────────  ├──────────────────────────────────────────┤
│ ●Courses    │                                          │
│             │  🟢 EN COURS                             │
│             │  Semi-marathon · Marseille-Cassis        │
│             │  15 juin 2026 · 84 jours · Semaine 4/14  │
│             │                          [Voir le plan]  │
│             │                                          │
│             │  🔵 PLANIFIÉ                             │
│             │  Marathon · Paris 2026                   │
│             │  12 octobre 2026 · 203 jours             │
│             │  Commence après récupération (2 sem)     │
│             │              [Modifier]  [Supprimer]     │
│             │                                          │
│             │  Frise temporelle                        │
│             │  Mars──[Sem4/14]────Juin🏁──Récup──Oct🏁  │
└─────────────┴──────────────────────────────────────────┘
```

### Statuts des courses
| Statut | Condition |
|---|---|
| 🟢 En cours | Plan actif, date future |
| 🔵 Planifié | Course future, plan pas encore commencé |
| ✅ Terminée | Date passée |

### Critères d'acceptation
- [ ] Toutes les courses sauvegardées sont affichées, triées par date croissante
- [ ] Chaque carte affiche : nom, distance, date, jours restants, statut
- [ ] Pour les courses "En cours" : numéro de semaine et phase sont affichés
- [ ] Le bouton "+ Ajouter" ouvre un formulaire (modal ou inline) avec : distance, nom, date cible
- [ ] Une nouvelle course génère automatiquement son plan et l'enchaîne au plan précédent
- [ ] Une phase de récupération de 2 semaines est insérée automatiquement entre deux plans
- [ ] Le bouton "Modifier" permet de changer le nom ou la date cible d'une course planifiée
- [ ] Modifier la date cible recalcule et met à jour le plan correspondant
- [ ] Le bouton "Supprimer" affiche une confirmation avant suppression (dialog shadcn)
- [ ] La suppression d'une course supprime aussi son plan et toutes ses semaines/sessions de localforage
- [ ] La frise temporelle reflète toutes les courses et phases de récupération dans l'ordre

---

## REQ-10 — Réglages

### Description
Page permettant de modifier le profil coureur et les préférences, d'exporter les données en JSON et d'effacer toutes les données locales.

### Wireframe
```
┌─────────────┬──────────────────────────────────────────┐
│  TRAJECTORY │  Réglages                                │
│  ─────────  ├──────────────────────────────────────────┤
│ ●Réglages   │  Profil coureur                          │
│             │  Niveau          [Intermédiaire ▼]       │
│             │  Volume actuel   [  25  ] km/semaine     │
│             │  Dispo/semaine   [  4   ] jours          │
│             │  Terrain         [Mixte ▼]               │
│             │                                          │
│             │  Préférences                             │
│             │  Longue sortie   [Dimanche ▼]            │
│             │  Cross-training  [Renforcement ▼]        │
│             │  Unités          ● km   ○ miles          │
│             │                                          │
│             │  Données                                 │
│             │  [Exporter mes données (JSON)]           │
│             │  [Effacer toutes les données]            │
│             │                                          │
│             │                    [Enregistrer]         │
└─────────────┴──────────────────────────────────────────┘
```

### Critères d'acceptation
- [ ] Les champs sont pré-remplis avec les valeurs actuelles du profil au chargement
- [ ] Le bouton "Enregistrer" sauvegarde les modifications dans localforage
- [ ] Un toast de confirmation est affiché après l'enregistrement
- [ ] "Exporter mes données" génère un fichier `trajectory-export-YYYY-MM-DD.json` téléchargeable contenant toutes les données (profil, courses, plans, logs)
- [ ] "Effacer toutes les données" affiche un dialog de confirmation avant d'agir
- [ ] Après effacement : toutes les données localforage sont supprimées et l'utilisateur est redirigé vers `/onboarding`

---

## REQ-11 — Persistance des Données (LocalForage)

### Description
Toutes les données sont stockées dans IndexedDB via `localforage`. Chaque entité a son propre store. Les données survivent au rechargement de la page et à la fermeture du navigateur tant que le cache n'est pas vidé manuellement.

### Stores localforage
| Store | Contenu | Clé |
|---|---|---|
| `trajectory_profile` | UserProfile (unique) | `"profile"` |
| `trajectory_races` | Race[] | ID de la course |
| `trajectory_plans` | Plan[] | ID du plan |
| `trajectory_weeks` | Week[] | ID de la semaine |
| `trajectory_sessions` | Session[] | ID de la session |
| `trajectory_session_logs` | SessionLog[] | ID du log |
| `trajectory_constraints` | UserConstraint[] | ID de la contrainte |
| `trajectory_adaptation_logs` | AdaptationLog[] | ID du log |

### Critères d'acceptation
- [ ] Les données sont présentes après un rechargement de page (`F5`)
- [ ] Les données sont présentes après fermeture et réouverture du navigateur
- [ ] Aucune donnée n'est perdue lors de la navigation entre les pages de l'app
- [ ] L'effacement manuel (REQ-10) vide tous les stores
- [ ] Les opérations d'écriture sont asynchrones et n'impactent pas la fluidité de l'UI
- [ ] En cas d'erreur d'écriture (stockage plein), un message d'erreur clair est affiché

---

## REQ-12 — Comportement Général & Qualité

### Description
Exigences transversales couvrant les performances, les états vides, les messages d'erreur et l'accessibilité de base.

### Performance
| Action | Cible |
|---|---|
| Chargement d'une page | < 2 secondes |
| Génération du plan | < 2 secondes |
| Algorithme d'adaptation | < 1 seconde |
| Sauvegarde d'un log | < 500 ms |
| Ouverture d'un modal | < 200 ms |

### États vides
| Écran | Message |
|---|---|
| Dashboard sans plan | "Commence par configurer ta première course →" (CTA vers onboarding) |
| Plan sans séances | "Ton plan est en cours de génération..." |
| Courses sans course | "Tu n'as pas encore de course planifiée. [+ Ajouter une course]" |
| Historique sans logs | "Enregistre ta première séance pour voir ton historique ici." |

### Critères d'acceptation
- [ ] Toutes les pages chargent en moins de 2 secondes depuis localforage
- [ ] Tous les états vides sont traités avec un message clair et un CTA si pertinent
- [ ] Aucun écran ne reste bloqué sur un état de chargement infini
- [ ] Les erreurs de validation de formulaire sont affichées inline (pas d'alert() browser)
- [ ] Tous les modals peuvent être fermés avec la touche `Escape`
- [ ] L'app est utilisable sans souris (navigation clavier basique)
- [ ] Les contrastes de couleur respectent les couleurs définies dans les Brand Guidelines (`#1B3A6B`, `#D4A574`, `#F9F7F3`)
- [ ] Aucune console error en usage normal

---

## Structure de Fichiers Cible

```
trajectory/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── layout.tsx           ← layout global avec sidebar
│       │   ├── page.tsx             ← redirect /onboarding ou /dashboard
│       │   ├── onboarding/page.tsx
│       │   ├── dashboard/page.tsx
│       │   ├── plan/page.tsx
│       │   ├── races/page.tsx
│       │   ├── history/page.tsx
│       │   └── settings/page.tsx
│       ├── components/
│       │   ├── layout/Sidebar.tsx
│       │   ├── onboarding/StepProfile.tsx
│       │   ├── onboarding/StepRace.tsx
│       │   ├── onboarding/StepPreferences.tsx
│       │   ├── onboarding/StepPlanPreview.tsx
│       │   ├── dashboard/TodaySession.tsx
│       │   ├── dashboard/RaceCountdown.tsx
│       │   ├── dashboard/WeekMiniView.tsx
│       │   ├── plan/WeekView.tsx
│       │   ├── plan/SessionRow.tsx
│       │   ├── session/LogSessionModal.tsx
│       │   └── constraints/ConstraintModal.tsx
│       └── lib/utils.ts
└── packages/
    └── shared/
        ├── types/index.ts
        ├── db/interface.ts
        ├── db/local.ts
        └── engine/
            ├── generator.ts
            └── adaptation.ts
```

---

## Sprints d'Implémentation

| Sprint | Contenu | Requirements couverts |
|---|---|---|
| **0** | Setup Next.js + shadcn + localforage + structure | REQ-11 (stores), REQ-01 (navigation) |
| **1** | Types TypeScript + DB layer + moteur algo | REQ-11, REQ-03, REQ-08 |
| **2** | Onboarding 4 étapes | REQ-02, REQ-03 |
| **3** | Dashboard + Vue plan hebdomadaire | REQ-04, REQ-05 |
| **4** | Log séance + contraintes | REQ-06, REQ-07, REQ-08 |
| **5** | Calendrier courses + réglages | REQ-09, REQ-10 |
| **6** | Test bout en bout + corrections | REQ-12 |

---

**Document Owner:** Product / Engineering
**Créé :** 23 Mars 2026
**Prochaine révision :** Fin Sprint 2 (post-onboarding validé)
