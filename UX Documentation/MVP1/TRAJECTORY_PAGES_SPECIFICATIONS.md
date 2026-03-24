# TRAJECTORY - Fonctionnalités des Pages (MVP1)

## 1. Dashboard (`/`)

**Objectif**: Vue d'ensemble du plan d'entraînement et statut actuel

**Contenu principal**:
- **En-tête**: Logo Trajectory + date actuelle
- **Carte objectif race**: 
  - Affiche race active (nom, date, distance, jours restants, objectif temps)
  - Barre de progression du plan (%)
  - Design gradient bleu avec icônes
- **Plan d'entraînement 2-3 semaines**:
  - Liste des séances avec:
    - Emoji type (🏃 run, 💪 strength, 🚴 cycling, etc.)
    - Titre + jour + date
    - Distance/durée, allure cible, RPE prévu
    - Badge status: À faire / Complété / Ajusté
  - Clickable sur chaque session pour voir détails complets
  - Sections par semaine
- **Sidebar droit**:
  - **Stats semaine**: X/Y séances complétées, kilométrage semaine/objectif
  - **Actions rapides**: Logger une session, Ajouter objectif, Voir météo
  - **Aperçu prochaines séances**: 3 prochaines avec heures + types

**Interactions**:
- Click sur une session → affiche détails (description, conseil, bouton logger)
- Bouton "Logger une session" → navigate à `/logger`
- Bouton "Ajouter un objectif" → navigate à `/create-objective`

---

## 2. Logger une Séance (`/logger`)

**Objectif**: Enregistrer les données réelles d'une séance complétée

**Formulaire principal**:
- **Titre** (pré-rempli du plan, éditable) - pour recherches futures
- **Distance** (km) - input number avec calcul auto allure
- **Durée** (MM:SS format) - pour calcul allure
- **RPE** (1-10) - slider interactif avec feedback:
  - 1-3: 💚 Facile
  - 4-6: 🟡 Modéré
  - 7-8: 🟠 Dur
  - 9-10: ❤️ Très difficile
- **Élévation** (m) - optionnel
- **Conditions météo** (multi-select):
  - ☀️ Ensoleillé
  - ☁️ Nuageux
  - 🌧️ Pluie
  - 💨 Venteux
  - 🔥 Chaud
  - ❄️ Froid
- **Sensation globale** (4 options emoji):
  - 😫 Pas bien
  - 😐 Correct
  - 😊 Bien
  - 🔥 Excellent
- **Notes libres** (optionnel) - douleurs, observations, améliorations

**Calculs automatiques**:
- Allure moyenne (min/km) = durée / distance
- Affichage temps d'effort estimé vs prévu

**Actions**:
- Bouton "Sauver" → valide les champs requis
- Sauve dans l'historique des séances loggées
- Affiche success message avec checkmark
- Auto-redirection dashboard après 2s

---

## 3. Créer Objectif Race (`/create-objective`)

**Objectif**: Ajouter une nouvelle course objectif pour générer un plan d'entraînement

**Flow 3 étapes**:

### Étape 1: Sélection distance
- 4 cards cliquables:
  - 🏃 **10K** - "Course courte" - typiquement 45-60 min
  - 🏃‍♂️ **Semi-Marathon** - "Distance classique" - typiquement 1h30-2h30
  - 🏁 **Marathon** - "L'ultime" - typiquement 3h-5h
  - ⛰️ **Trail/Custom** - "Distance personnalisée" - permet de rentrer distance custom en km
- Chaque card affiche description et durée prep estimée
- Navigation: continuer vers étape 2

### Étape 2: Détails de la course
- **Nom race** (required) - ex: "Semi-Marathon de Montpellier"
- **Date** (required) - affiche automatiquement jours restants
- **Distance** (si custom) - en km
- **Objectif de temps** (optionnel) - ex: "1h45" ou "sub-4h"
- **Dénivelé** (optionnel) - en m, important pour trails
- **Notes & Motivation** (optionnel) - pourquoi cette course, conditions spéciales
- Info box: explique que plan sera min 8 semaines avant la course
- Navigation: retour ou continuer vers étape 3

### Étape 3: Résumé & Confirmation
- **Carte résumé gradient**: affiche tous les détails visuellement
  - Nom race (gros)
  - Distance, Date, Jours restants, Objectif temps (si applicable)
  - Dénivelé (si applicable)
- **Section "Plan d'entraînement"**: checklist des caractéristiques
  - ✅ Durée: min 8 semaines
  - ✅ Adaptatif: s'ajuste chaque semaine selon performances
  - ✅ Inclut renforcement + activités croisées
  - ✅ Intègre dénivelé si fourni
- **Section "À savoir"**: points importants
  - Plan commence 8 semaines avant
  - Peut gérer plusieurs objectifs
  - Peut modifier à tout moment
- Boutons: "Modifier" (retour étape 2) ou "Créer l'objectif"

**Actions**:
- Créer la race dans la liste
- Appeler Claude pour générer plan adaptatif
- Rediriger vers dashboard

---

## 4. Setup Séance Personnalisée (`/add-session`)

**Objectif**: Ajouter une séance en dehors du plan adaptatif ou en supplément

**Flow 4 étapes**:

### Étape 1: Type de séance
- 6 cards cliquables:
  - 🏃 **Course** - "Sortie, tempo, fractionné, trail"
  - 🚴 **Vélo** - "Route, VTT, gravel"
  - 💪 **Force** - "Musculation, circuit"
  - 🏊 **Natation** - "Piscine, eau libre"
  - 🧗 **Cross-training** - "Yoga, HIIT, escalade"
  - 😴 **Repos actif** - "Marche, étirement, récupération"
- Chaque card affiche emoji, label, description, exemples de séances
- Navigation: continuer vers étape 2

### Étape 2: Planning & Paramètres
- **Toggle "Séance récurrente?"**:
  - **Si OUI**: Sélection du jour semaine (7 buttons Lun-Dim)
    - Avec option "Récurrent jusqu'à" date (optionnel = infini)
  - **Si NON**: Input date pour one-time session
- **Nom séance** (optionnel) - pour retrouver plus tard
- **Durée estimée** (optionnel) - en minutes
- Navigation: retour ou continuer vers étape 3

### Étape 3: Programme de la séance
- **4 options à choisir**:

  1. **✨ Séance libre**
     - Pas de programme défini
     - Juste un créneau vide au planning
     - À logger après exécution
  
  2. **📝 Programme personnalisé**
     - Textarea: utilisateur fournit son propre programme
     - Exemple placeholder: "5 km échauffement, 5×2km à allure 10K, 2 km retour au calme"
     - Sauve tel quel
  
  3. **💡 Générer avec Claude**
     - Textarea: utilisateur décrit ses envies
     - Exemple placeholder: "Séance de force pour les jambes, 45 min, niveau intermédiaire"
     - Bouton "Générer avec Claude" → appelle API
     - Affiche programme généré à relire
  
  4. **🎯 Proposition intelligente** ⭐
     - Claude propose automatiquement basé sur:
       - Plan actuel et phase d'entraînement
       - Performances des 7 derniers jours (RPE, ressentis)
       - Jours restants avant race
       - Historique séances similaires
     - Affiche card amber avec:
       - Nom séance proposée + durée
       - Programme détaillé
       - Section "Pourquoi?" avec 3-4 bullets expliquant le choix
     - 3 boutons: "Accepter", "Voir alternatives", "Modifier"

- **Notes optionnelles** (tous les modes):
  - Matériel nécessaire, lieux, conditions spéciales

- Navigation: retour ou continuer vers étape 4

### Étape 4: Résumé & Confirmation
- **Carte résumé gradient**: affiche tous les détails
  - Emoji + type de séance
  - Nom si custom
  - Quand (jour ou date)
  - Durée
  - Si récurrent: "Chaque [jour]"
- **Section "Programme"** (si applicable):
  - Badge source: "Généré par Claude" / "Proposition Claude" / "Personnalisé"
  - Affiche le programme complet
- **Section "À savoir"**: checklist
  - ✅ Apparaîtra au planning
  - ✅ Pourras la logger après
  - ✅ S'intègre à l'historique
  - ✅ Si récurrent: se répète chaque [jour]
- Boutons: "Modifier" (retour étape 3) ou "Créer la séance"

**Actions**:
- Créer la séance custom
- Sauver programme si applicable
- Rediriger vers dashboard

---

## 5. Météo & Suggestions (`/weather`)

**Objectif**: Voir météo 2 semaines et suggestions intelligentes pour adapter les séances

**Section 1: Alertes & Suggestions au top**
- Cards pour chaque alerte active:
  - Emoji + titre + message court
  - Exemple: 🌧️ "Pluie modérée" - "Entre 14h et 20h. Prévois un gilet imperméable"
  - Expandable (click) → affiche suggestions détaillées:
    - Pluie? → liste: gilet imperméable, considère séance indoor, prépare séchage après
    - Vent? → liste: travail stabilité, option indoor, protège yeux
    - UV élevé? → liste: crème solaire SPF50+, hydratation accrue, départ tôt
    - Froid? → liste: couches appropriées, protections extrémités

**Section 2: Timeline 2 semaines**
- Pour chaque jour (card cliquable):
  - **En-tête jour**:
    - Nom jour (Lundi, etc.) + date
    - Icône météo (☀️ ☁️ 🌧️) + température
    - Min / Max
  
  - **Grille 5 colonnes** (détails météo):
    - 💧 Humidité %
    - 💨 Vent km/h
    - ⚠️ Rafales km/h
    - 👁️ Visibilité km
    - ☀️ UV Index
  
  - **Séances du jour** (si applicable):
    - Emoji type + nom séance + heure + distance/durée
    - **Badge status couleur**:
      - ✅ Idéales (vert)
      - 🟢 Acceptables (bleu)
      - 🟠 Difficiles (amber)
      - ❌ Mauvaises (rouge)
    - **Suggestion météo** si applicable:
      - Ex: "Crème solaire recommandée (UV index 6)"
      - Ex: "Pluie prévue - apporte un imperméable"
    - **Bouton verrouiller** 🔒:
      - Toggle: séance verrouillée = pas adaptable
      - Affiche "🔒 Verrouillée — pas d'adaptation même si météo change"
    - **Boutons actions** (si pas verrouillée):
      - "Adapter" → Claude propose variante
      - "Indoor alternative" → propose équivalent indoor

**Data**:
- Fetch Open-Meteo pour les 14 prochains jours
- Affiche alertes pour conditions difficiles (vent > 15 km/h, pluie, UV > 5)

---

## 6. Profil & Zones d'Entraînement (`/profile`)

**Objectif**: Paramètres perso, zones d'entraînement calculées, temps de référence

### Section 1: Données personnelles
- **Mode lecture**: Grid affichant
  - Nom, Âge, Poids, Taille, VMA, Expérience
  - FC Repos (bpm), FC Max (bpm)
- **Bouton "Éditer"** en haut droit
- **Mode édition**: inputs pour tous les champs
  - Boutons "Annuler" et "Sauver"

### Section 2: Zones d'entraînement
- **5 cards gradient** (Z1 à Z5) non-éditables:
  - **Chaque card affiche**:
    - Nom zone + description (ex: "Récupération - Très facile, conversation aisée")
    - % d'effort (50-60%, 60-70%, etc.)
    - Plage FC (bpm) - calculée auto basée sur FC rest/max
    - Allure estimée (min/km)
    - Zone ID (Z1, Z2, etc.)
  - Calculées automatiquement avec formule Karvonen
  - Info box: explique comment zones sont calculées

### Section 3: Temps de référence ⭐
- **Liste des temps enregistrés**:
  - Chaque temps affiche:
    - Emoji type (🏃 🏃‍♂️ 🚴 🏊)
    - Nom séance + lieu + date
    - **Temps réalisé** (gros, bleu) ex: 40:15
    - **Allure calculée** auto (min/km) ex: 4:01
    - Grille: Distance, Dénivelé (si applicable), Type
    - Boutons: Éditer, Supprimer
  
- **Formulaire "Ajouter"** (toggle ou modal):
  - **Nom** (optionnel) - ex: "Mon 10K perso"
  - **Type** (required) - dropdown: Course / Trail / Vélo / Natation
  - **Distance** (required, km) - ex: 10
  - **Temps** (required) - format MM:SS ou HH:MM:SS, ex: 40:15 ou 1:52:30
  - **Dénivelé** (optionnel, m) - ex: 800
  - **Date** (required) - quand réalisé
  - **Lieu** (select from locations)
  - Boutons: Annuler, Ajouter
  - Calcule allure auto une fois distance + temps remplis
  
- **Info box**: Comment Claude utilise ces données
  - ✅ Calibre les allures d'entraînement en zones
  - ✅ Propose difficulté réaliste des séances
  - ✅ Track progression au fil du temps
  - ✅ Adapte objectifs de vitesse pour courses

### Section 4: Préférences d'entraînement
- **Durée min/max des séances** (inputs)
  - Ex: 30 min — 120 min
  - Seront respectées dans les séances générées
- **Jours d'entraînement par semaine** (dropdown)
  - Options: 3, 4, 5, 6 jours
- **Types de séances préférés** (multi-select buttons)
  - 🏃 Course
  - 🚴 Vélo
  - 💪 Force
  - 🏊 Natation
- **Timezone** (dropdown)
  - Pour affichages horaires corrects
- Bouton "Sauver les préférences"

### Section 5: Mes lieux d'entraînement
- **Lisez des lieux enregistrés** (cards):
  - 🗺️ Nom du lieu
  - Élévation (m)
  - Badge "Par défaut" sur location active
  - Boutons: "Par défaut" (changer active), "Éditer"
- **Bouton "+ Ajouter un lieu"** (en bas)
  - Modal/formulaire:
    - Nom lieu (required)
    - Latitude/Longitude (pour météo)
    - Élévation (optionnel)
    - Boutons: Annuler, Ajouter

---

## Résumé Fonctionnalités par Page

| Page | Fonctionnalités clés |
|------|----------------------|
| Dashboard | Affiche plan 2-3 semaines, race active, stats semaine, actions rapides |
| Logger | Enregistre distance/durée/RPE/conditions/notes, calcule allure, sauve historique |
| Create Objective | Flow 3 étapes: distance, détails, résumé → crée race objectif |
| Add Session | Flow 4 étapes: type, planning, programme (4 options), résumé → crée séance custom |
| Weather | Affiche météo 2 semaines, alertes avec suggestions, verrouille/adapte séances |
| Profile | Édite données perso, affiche zones auto-calculées, gère temps de référence, préférences, lieux |

---

**Bon développement! 🚀**
