# DOCUMENT DE SPÉCIFICATIONS PRODUIT (PRD)
## Trajectory — Adaptive Running Training Planner

**Nom de Projet:** Trajectory  
**Nom d'App:** Trajectory  
**Version:** 1.0 MVP  
**Date:** 23 Mars 2026  
**Stade:** Discovery & Requirements

---

## 📋 Résumé Exécutif

Ce document définit les exigences produit pour **Trajectory**, une application de planification d'entraînement de running adaptatif, conçue pour les coureurs amateurs intermédiaires (1-3 ans d'expérience) se préparant pour des distances entre 10 km et 42 km (10K, semi-marathon, marathon).

### Proposition de Valeur Principale
**Trajectory** crée des plans d'entraînement personnalisés qui s'adaptent en temps réel en fonction de :
- L'historique de performance de l'utilisateur
- Les contraintes contextuelles (maladie, voyage)
- Les signaux de récupération

**Contrairement aux apps statiques**, Trajectory modifie intelligemment les séances hebdomadaires tout en maintenant la trajectoire vers la date de course ciblée.

**Tagline:** "Your Perfect Race Path" / "Votre Trajectoire Parfaite"

### Scope
L'MVP se concentre sur le **running route et trail**, avec des activités de cross-training intégrées (renforcement musculaire, natation, cyclisme, marche rapide/hiking) pour prévenir les blessures et améliorer la condition physique globale.

### Modèle de Planification
- **Plan jusqu'à la date d'épreuve** : La durée du plan est déterminée par la date cible de l'épreuve (pas de "8-12 semaines" fixes)
- **Minimum 8 semaines** : Si une épreuve est à <8 semaines, Trajectory avertit l'utilisateur que c'est trop court pour une préparation optimale
- **Plusieurs épreuves planifiées** : L'utilisateur peut planifier plusieurs épreuves dans son calendrier. Trajectory enchaîne automatiquement les plans (phase de préparation → récupération → nouvelle préparation)

---

## 1. Énoncé du Problème

### Situation Actuelle

Les coureurs amateurs s'entraînant pour des épreuves de distance moyenne (10K–marathon) font face à plusieurs obstacles :

- **Accès limité à des plans structurés**  
  Les plans génériques (Strava), chers (coach personnel) ou dispersés (YouTube, Reddit, essai-erreur) manquent de cohérence et d'accessibilité.

- **Les plans statiques ne s'adaptent pas**  
  Si un coureur tombe malade, voyage ou surentraîne, il abandonne soit le plan, soit fait des ajustements ad-hoc qui déraillent la progression.

- **Absence d'approche unifiée du cross-training**  
  Les coureurs improvisent les travaux supplémentaires (renforcement, récupération) sans comprendre leur impact sur la préparation à la course.

- **Aucun mécanisme pour signaler les contraintes**  
  Les apps ne savent pas que l'utilisateur est malade, en déplacement ou sans équipement, ce qui crée de la friction et des abandons.

### Point de Douleur Principal

**Les coureurs amateurs intermédiaires ont besoin d'un plan d'entraînement structuré qui s'adapte automatiquement à leur progression, leurs circonstances de vie et leur état de récupération — sans coach personnel ni recalcul manuel chaque semaine.**

### Opportunité

Une app qui détecte les tendances de performance et ajuste automatiquement les séances hebdomadaires (volume, intensité, type) tout en gardant l'objectif de course intacte pourrait devenir la compagne de confiance de ce segment, comblant le fossé entre les plans génériques gratuits et le coaching coûteux.

---

## 2. Vue d'Ensemble de la Solution

### Vision

**Une compagne d'entraînement personnalisée et adaptative qui apprend de vos courses et ajuste votre plan en temps réel. Vous vous concentrez sur l'exécution ; Trajectory gère la stratégie.**

### Comment Ça Marche (Boucle Principale)

#### 1️⃣ Configuration Utilisateur
Le coureur rentre son profil : âge, expérience, niveau de forme physique actuel, et ses épreuves cibles (une ou plusieurs) avec distance et date pour chacune, disponibilité hebdomadaire, historique de blessures.

L'app calcule automatiquement la durée du plan pour chaque épreuve en fonction de la date cible (minimum 8 semaines ; alerte si <8 semaines).

#### 2️⃣ Génération du Plan
L'app génère un plan personnalisé jusqu'à la date d'épreuve (minimum 8 semaines) avec une structure hebdomadaire : plusieurs séances de running (facile, tempo, longue distance, sprints) + cross-training (renforcement, natation, cyclisme, marche).

Si l'utilisateur a plusieurs épreuves planifiées, l'app enchaîne automatiquement :
- Plan de préparation pour épreuve 1 (jusqu'à la date)
- Phase de récupération/transition
- Plan de préparation pour épreuve 2 (jusqu'à la date)
- Et ainsi de suite...

#### 3️⃣ Adaptation Hebdomadaire
Chaque semaine, Trajectory examine les performances passées (allure, volume, RPE) et les contraintes contextuelles (l'utilisateur signale maladie, voyage, limites d'équipement). Elle ajuste les séances de la semaine suivante en conséquence.

#### 4️⃣ Enregistrement des Séances
Après chaque séance, l'utilisateur enregistre : distance, durée, effort (RPE), notes, gain d'altitude.

#### 5️⃣ Ajustements Intelligents
Si la performance baisse ou l'utilisateur signale du stress, l'app peut :
- Réduire le volume des séances
- Baisser l'intensité
- Ajouter un jour de récupération
- Repousser la date de l'objectif

Si la progression est bonne, augmenter le défi.

### Différenciateurs Clés

✅ **Adaptation Dynamique**  
Les plans évoluent chaque semaine, pas statiques.

✅ **Conscience Contextuelle**  
Les utilisateurs peuvent signaler des contraintes (maladie, voyage, nouvel environnement).

✅ **Entraînement Holistique**  
Le cross-training intégré (renforcement, natation, cyclisme) est lié à l'objectif principal.

✅ **Dates de Course Flexibles**  
Possibilité de repousser si la progression l'exige.

---

## 3. Utilisateurs Cibles & Personas

### Segment Principal

**Coureurs amateurs intermédiaires (1–3 ans d'entraînement régulier) se préparant pour des épreuves 10K–marathon.**

### Persona 1 : Alex — L'Améliorateur Structuré

**Profil**
- Âge : 28–35 ans
- Entraîne 5–6 jours/semaine
- A complété un semi-marathon l'année dernière, vise maintenant un marathon ou un record 10K
- Très connecté tech (Strava, montre Garmin, enregistre tout)
- Voyage occasionnellement pour le travail

**Besoins Clés**
- Plan structuré avec un focus hebdomadaire clair
- Moyen facile d'enregistrer et tracker
- Capacité à s'adapter lors de déplacements

**Frustrations**
- Les plans génériques semblent ennuyeux
- L'ajustement manuel est fastidieux
- Peur du surentraînement

---

### Persona 2 : Jamie — Le Coureur en Reconversion

**Profil**
- Âge : 35–50 ans
- Revient à la course après 2–3 ans d'arrêt
- Récente entorse légère au genou, très prudent
- Modérément tech-savvy (usage basique du smartphone, ne track pas obsessivement les métriques)
- Vise un semi-marathon dans 4 mois, nerveux vis-à-vis des blessures

**Besoins Clés**
- Progression conservatrice, consciente des blessures
- Guidance claire sur la récupération
- Assurance que le plan ne va pas le casser

**Frustrations**
- Peur du surentraînement
- Pas de guidance sur quand se reposer
- Doute sur le volume d'entraînement

---

### Persona 3 : Taylor — L'Optimiseur Axé sur les Objectifs

**Profil**
- Âge : 25–32 ans
- Coureur compétitif ayant complété plusieurs marathons
- Très connecté (wearables, apps, moniteur cardiaque)
- Vise à raser 10–15 minutes sur son temps de marathon
- Voyage pour les courses ; entraîne parfois en trail

**Besoins Clés**
- Plan piloté par les données avec zones d'intensité
- Insight sur la progression hebdomadaire
- Capacité à intégrer le cross-training

**Frustrations**
- L'app actuelle ne tient pas compte des changements de vie
- Impossible de modifier l'intensité à la volée
- Plans trail vs. route séparés

---

## 4. Parcours Utilisateur & Workflows

### Parcours 1 : Onboarding & Création du Plan

1. **Inscription de l'utilisateur**  
   L'utilisateur crée un compte et choisit running comme sport principal.

2. **Profilage Initial**  
   L'app demande : âge, niveau d'expérience, historique de blessures, volume hebdomadaire actuel, course cible (distance + date), préférence terrain (route/trail/les deux), jours d'entraînement disponibles/semaine.

3. **Génération du Plan**  
   L'app génère un ou plusieurs plans personalisés jusqu'à chaque date d'épreuve (minimum 8 semaines par plan). 
   - Si 1 épreuve : L'utilisateur voit la structure hebdomadaire et peut prévisualiser les 2 premières semaines.
   - Si plusieurs épreuves : L'app montre le calendrier complet avec tous les plans enchaînés (phase récup entre chaque épreuve).

4. **Acceptation du Plan**  
   L'utilisateur confirme le/les plan(s) ou demande des ajustements (p. ex., moins de jours/semaine, plus de focus trail).

5. **Première Semaine**  
   L'app suggère les séances de la première semaine du premier plan. L'utilisateur est encouragé à enregistrer sa première course pour démarrer la boucle de feedback.

---

### Parcours 2 : Cycle d'Entraînement Hebdomadaire

1. **Revue Hebdomadaire**  
   Chaque dimanche (configurable), l'app affiche la semaine à venir : séances détaillées par type (facile 8 km, tempo 6 km, longue 16 km, renforcement 45 min, natation 30 min, etc.).

2. **Mise à Jour Contextuelle (Optionnelle)**  
   L'utilisateur peut signaler des contraintes : 
   - "En déplacement lundi-mercredi (running route seulement)"
   - "Cheville légèrement douloureuse, prendre facile"
   - "Nouvel endroit, routes inconnues"
   - "La salle sera fermée"

3. **Ajustement du Plan**  
   L'app modifie la semaine : remplace les activités indisponibles, réduit le volume si blessure signalée, adapte l'intensité si fatigue détectée.

4. **Exécution Quotidienne**  
   L'utilisateur enregistre chaque séance post-course : distance, temps, RPE (facile/moyen/difficile), notes ("me sentais fort", "vent fou", "genou a tiqué au km 5").

5. **Enregistrement Complet**  
   L'app enregistre les données et met à jour le modèle de performance rolling.

---

### Parcours 4 : Gestion Épreuves Multiples

**Scénario :** Un coureur planifie un semi-marathon en juin, puis un marathon en octobre. L'app gère les deux cycles automatiquement.

1. **Création Calendrier**  
   L'utilisateur ajoute ses 2 épreuves lors du setup ou via "Add Race". L'app les ordonne par date.

2. **Génération Plans Enchaînés**  
   - Plan 1 : Semaine 1 → 16 semaines → Semi-marathon juin (distance 21 km)
   - Phase transition : 2 semaines de récupération/régénération légère
   - Plan 2 : Semaine 1 → 12 semaines → Marathon octobre (distance 42 km)

3. **Affichage Calendrier**  
   Le dashboard montre : "Plan 1 en cours (10 semaines restantes) → Semi-marathon 15 juin → Transition → Plan 2 commence 22 juin (14 semaines) → Marathon 12 octobre"

4. **Transition Automatique**  
   Après la 1ère épreuve, l'app propose automatiquement une phase de récupération (jours de repos, cross-training léger) avant le plan suivant.

5. **Adaptation Cross-Plans**  
   Les données de la 1ère épreuve (performance, fitness level final) informent la génération du 2e plan pour une progression optimale.

**Scénario :** La vitesse de l'utilisateur a baissé de 8% sur 2 semaines (signe précoce de surentraînement ou fatigue). L'app détecte cela via l'historique de performance.

1. **Détection**  
   L'app compare la vitesse de la semaine actuelle à la baseline ; signale un signal de fatigue.

2. **Logique de Décision**  
   L'algorithme considère : La progression est-elle saine ? Y a-t-il des contraintes signalées par l'utilisateur ? Pics de volume récent ?

3. **Options d'Ajustement**  
   L'app peut : ajouter un jour de récupération supplémentaire, réduire la distance de la longue distance la semaine prochaine, baisser l'intensité sur la séance tempo, ou suggérer de repousser la date de la course d'une semaine.

4. **Notification**  
   L'utilisateur voit : "Nous avons détecté des signaux de fatigue. Voici votre semaine ajustée pour vous aider à récupérer." L'utilisateur peut accepter ou passer outre.

---

## 5. Fonctionnalités Principales & Priorisation

### 5.1 Incontournables (Scope MVP)

**Profil Utilisateur & Setup**  
Capturer âge, niveau d'expérience, course ciblée (distance, date), disponibilité hebdomadaire, préférence terrain, historique de blessures. Générer un plan initial de 8–12 semaines.

**Vue du Plan Hebdomadaire**  
Afficher la semaine à venir avec toutes les séances (running, cross-training). Étiquetage clair du type de séance (facile, tempo, longue, renforcement, natation, etc.), distance/durée, et indices d'intensité.

**Enregistrement de Séance**  
Formulaire post-course : distance (km), temps (minutes), RPE (facile/moyen/difficile), champ notes, gain d'altitude.

**Contraintes Contextuelles**  
L'utilisateur peut signaler des contraintes chaque semaine (maladie, voyage, limites d'équipement, contraintes de temps) et le plan s'adapte.

**Logique d'Adaptation de Base**  
Ajustement du plan hebdomadaire en fonction de : performance rolling (tendance d'allure), cohérence RPE, fatigue signalée ou contraintes de l'utilisateur. Modifier durées, distances, ou types de séances.

**Dashboard Simple**  
Afficher semaine actuelle, résumé semaine dernière (séances enregistrées, cohérence %), compte à rebours de la course, aperçu semaine prochaine.

**Date de Course Flexible**  
Permettre à l'utilisateur de repousser la date de course ciblée si nécessaire (p. ex., à cause d'une blessure ou progression lente).

**Bascule Route vs. Trail**  
Permettre aux utilisateurs de spécifier préférence route ou trail pour chaque séance.

**Types de Cross-Training**  
Supporter renforcement, natation, cyclisme, marche dans le plan. Enregistrement de séance pour chaque (décrire ce qui a été fait, durée, RPE).

**Calendrier d'Épreuves Multiples**  
Permettre aux utilisateurs de planifier 2–5 épreuves dans leur calendrier d'entraînement. L'app génère automatiquement :
- Un plan de préparation pour chaque épreuve (jusqu'à la date cible)
- Une phase de transition/récupération entre les épreuves
- Un affichage calendrier clair montrant tous les plans enchaînés

**Validation Durée Minimum**  
Si une épreuve est à <8 semaines, l'app avertit l'utilisateur que c'est trop court pour une préparation optimale et suggère d'ajuster la date ou de modifier le volume.

---

### 5.2 Sympathique (v1.1+)

**Intégration Zone Cardiaque**  
Tirer les données HR des wearables connectés (Garmin, Apple Watch) ; montrer distribution de zone post-course.

**Métriques Avancées**  
Estimation VO2 max, visualisation progression d'allure, indice fatigue/disponibilité.

**Modèles de Workout**  
Permettre aux utilisateurs de sauvegarder structures de séance favorites et les réutiliser sur différents plans.

**Semaine Affûtage**  
Les 2 dernières semaines avant la course avec conseils le jour-J et guidance de pace.

**Tips Vidéo/Photo**  
Courtes vidéos in-app montrant bonne forme de course, exercices de renforcement, conseils nutrition.

**Fonctionnalités Communautaires**  
Partager workouts, voir comment font les coureurs similaires, fonctionnalités sociales légères.

**Intégration Strava**  
Importer les courses enregistrées ailleurs ; sync données bidirectionnelle.

---

### 5.3 Futur (Post-MVP)

**Périodisation Multi-Sport**  
Support pour training triathlon ou autres événements multi-sport avec planning intégré.

**Modèle Prévention de Blessures**  
Alertes prédictives basées sur charge d'entraînement, données ROM, ou forces externes.

**Coaching Alimenté par IA**  
Feedback temps réel pendant les courses via audio cues de l'app.

**Adaptation Basée Météo**  
Auto-ajustement basé sur prévisions (chaleur, pluie, températures extrêmes).

**Tracking Nutrition & Sommeil**  
Intégration plus profonde avec données sommeil/nutrition pour informer signaux récupération.

---

## 6. Modèle de Données & Entités Clés

| **Entité** | **Champs** |
|---|---|
| **User** | id, age, experience_level, injury_history, timezone, preferences (notification_time, units_km_vs_mi) |
| **Race** | id, user_id, name, distance_km, target_date, status (planned, active, completed), order (1, 2, 3...) |
| **Plan** | id, user_id, race_id, start_date, end_date (= race.target_date), duration_weeks (calculated, min 8), phase (prep, recovery, transition), weeks (array) |
| **Week** | id, plan_id, week_number, sessions (array), adjustments_made (boolean), adjustment_reason (string) |
| **Session** | id, week_id, type (easy_run, tempo_run, long_run, strength, swim, bike, hike), prescribed_distance_km, prescribed_duration_min, target_intensity, notes, session_date, road_or_trail |
| **SessionLog** | id, session_id, user_id, distance_km, duration_min, rpe (easy/moderate/hard), user_notes, elevation_gain_m, timestamp, pace_kmh (calculated) |
| **UserConstraint** | id, user_id, week_id, constraint_type (illness, travel, equipment_limit, time_limit), description, duration_days, affected_sessions (array) |
| **AdaptationLog** | id, plan_id, week_id, trigger_reason (pace_drop, rpe_high, user_signal, other), changes_made (array), timestamp |

---

## 7. Métriques de Succès & KPIs

### Engagement Utilisateur

- **Cohérence enregistrement de séances**  
  Cible : >75% des séances planifiées enregistrées hebdomadairement

- **Engagement vue plan hebdomadaire**  
  Cible : 90%+ des utilisateurs reviewent le plan chaque semaine

- **Rétention app**  
  Cible : >60% à 12 semaines

### Résultat d'Entraînement

- **Taux de complétion course**  
  Cible : >70% des utilisateurs avec date de course fixée participent à l'événement

- **Progression d'allure**  
  Cible : amélioration moyenne 3–5% du baseline à la course

- **Évitement de blessures**  
  Cible : <5% des utilisateurs rapportent nouvelles blessures pendant le plan

### Adoption de Fonctionnalités

- **Signalisation de contraintes**  
  Cible : >40% des utilisateurs signalent des contraintes au moins une fois en 12 semaines

- **Complétion cross-training**  
  Cible : >60% des séances cross-training prescrites enregistrées

### Satisfaction Utilisateur

- **Score NPS post-plan ou satisfaction**  
  Cible : >7/10

- **Feedback sur qualité adaptation**  
  Cible : >80% trouvent les ajustements utiles ou neutres

---

## 8. Roadmap de Développement

### Phase 1 : MVP (Semaines 1–8)

- [ ] Onboarding & setup du profil utilisateur + épreuve cible (minimum 8 semaines)
- [ ] Moteur de génération de plan jusqu'à date d'épreuve (structures hebdomadaires statiques)
- [ ] Validation : alerte si <8 semaines de préparation
- [ ] Enregistrement de séance (distance, temps, RPE, notes, altitude)
- [ ] Input de contexte hebdomadaire (signalisation de contraintes)
- [ ] Logique d'adaptation de base (performance + contraintes → modifications de séances)
- [ ] Dashboard : semaine actuelle, résumé semaine dernière, compte à rebours épreuve
- [ ] Support 1 épreuve par plan

### Phase 2 : Polish & Validation (Semaines 9–12)

- [ ] Test interne avec 5–10 coureurs beta
- [ ] Refinement UX basé sur feedback
- [ ] Fonctionnalité date d'épreuve flexible
- [ ] Préférence route/trail par séance
- [ ] **Calendrier d'épreuves multiples** (2–5 épreuves planifiées)
- [ ] Gestion automatique phases transition/récupération entre épreuves

### Phase 3 : v1.1 (Semaines 13–16)

- [ ] Intégration zone cardiaque (import Garmin, Apple Watch)
- [ ] Métriques avancées (VO2 max, graphes charge hebdomadaire)
- [ ] Intégration Strava
- [ ] Test externe avec 20–30 utilisateurs
- [ ] Affichage calendrier annuel avec tous les plans enchaînés

### Phase 4+ : Futur (Mois 5+)

- [ ] Fonctionnalités communautaires / sociales
- [ ] Périodisation multi-sport (prep triathlon)
- [ ] Modèle prédiction blessures
- [ ] Stratégie monétisation (freemium, tiers premium)

---

## 9. Questions Ouvertes & Assumptions

### Questions à Résoudre

**Fréquence d'Adaptation**  
L'app doit-elle s'adapter chaque semaine, ou pourrait-elle s'adapter en milieu de semaine si les données le justifient ?  
*Décision : Commencer hebdomadaire ; revisiter après tests MVP.*

**Algorithme de Génération du Plan**  
Quelle méthodologie d'entraînement sous-tend le plan ? (p. ex., polarisé 80/20, Maffetone, structure périodisée ?)  
*Décision : Reporter design algo détaillé après entretiens utilisateurs.*

**Pondération du Cross-Training**  
Comment une séance de renforcement compte-t-elle dans la "fatigue" comparée à une course ?  
*Décision : Commencer simple avec RPE ; raffiner post-MVP.*

**Flexibilité Date de Course**  
Jusqu'où pouvons-nous repousser une date de course sans briser la confiance utilisateur ?  
*Décision : Par défaut max 2 semaines ; revisiter après feedback utilisateur.*

**Timeline Intégration Wearable**  
Les données HR/wearable sont-elles critiques pour MVP, ou sympathique à avoir ?  
*Décision : Reporter à v1.1 ; s'appuyer sur RPE dans MVP.*

**Gestion Épreuves Multiples**  
Faut-il supporter 2–5 épreuves dès le MVP, ou en MVP+1 ? Comment gérer les phases de transition/récupération entre les épreuves ?  
*Décision : Support 1 épreuve en MVP ; calendrier multi-épreuves en Phase 2 (semaines 9-12).*

**Phase Récupération Entre Épreuves**  
Quelle durée minimale de "repos" avant de commencer un nouveau plan ? Comment l'app suggère-t-elle la progression vers la prochaine épreuve ?  
*Décision : Durée minimum 1-2 semaines ; à valider avec testeurs beta.*

**Modèle de Monétisation**  
Freemium avec plans d'entraînement premium ? Subscription-only ? Exploration post-MVP.  
*Décision : Phase d'exploration ; reporter post-MVP.*

---

### Assumptions Clés

- Les utilisateurs cibles sont motivés, coureurs intermédiaires avec habitudes d'entraînement cohérentes.
- Les utilisateurs enregistreront les séances honnêtement (distance, temps, RPE) sans friction excessive.
- L'adaptation modifiant <20% du volume hebdomadaire est perçue comme utile, pas restrictive.
- La qualité initiale de génération du plan importe plus que l'adaptation parfaite temps réel ; les utilisateurs feront confiance après 2–3 semaines de succès.
- Le cross-training est supportif mais pas le moteur principal ; le running reste le focus.
- Les utilisateurs ont accès à équipement de base (téléphone, montre/timer) mais pas forcément wearables.
- La plupart des utilisateurs cibles auront au moins 1 épreuve planifiée ; environ 30-40% en auront 2-3 dans leur calendrier annuel.
- Un plan jusqu'à la date d'épreuve est plus motivant qu'un plan "standard" car l'objectif est concret et varié en durée.

---

## 10. Critères de Succès MVP

L'MVP est considéré comme successful si :

✅ 5–10 testeurs beta complètent un plan jusqu'à leur date d'épreuve (minimum 8 semaines) et rapportent satisfaction >7/10

✅ Taux enregistrement de séances >70% ; les utilisateurs trouvent le processus rapide et non-intrusif

✅ Les utilisateurs perçoivent au moins 2–3 adaptations de plan significatives pendant leur cycle de préparation

✅ Aucun bug critique ; l'app reste stable à travers un cycle d'entraînement complet jusqu'à l'épreuve

✅ Feedback positif sur intégration cross-training et cohérence du plan

✅ Au moins 60% des utilisateurs avec date d'épreuve fixée participent à l'événement ou rapportent disponibilité améliorée

✅ La gestion calendrier d'épreuves multiples fonctionne sans bug (si implémentée en MVP)

---

## Notes Finales

Ce PRD est un **document vivant**. Il évoluera à mesure que nous collectons du feedback utilisateur et validons les assumptions.

**Questions ou feedback ?** Partagez-les avec l'équipe produit pour itération collaborative.

---

**Créé :** 23 Mars 2026  
**Prochaine Revision :** Post-MVP Testing (Semaine 10)
