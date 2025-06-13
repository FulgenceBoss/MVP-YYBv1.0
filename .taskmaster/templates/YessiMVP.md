MVP - YESSI-YESSI BANK

Application Mobile d'Épargne Automatisée pour l'Afrique

DESCRIPTION GÉNÉRALE DU PROJET
Yessi-Yessi Bank est une application mobile d'épargne automatisée conçue spécifiquement pour les populations africaines, inspirée des pratiques traditionnelles d'épargne communautaire. L'application permet aux utilisateurs d'épargner automatiquement de petits montants quotidiens (100 à 10,000 FCFA) via l'intégration avec les services de mobile money, transformant les micro-dépenses en capital significatif sur le long terme.

PROBLÈME RÉSOLU
En Afrique, de nombreuses personnes dépensent inconsciemment de petites sommes quotidiennes sans réaliser l'impact cumulatif. Épargner 100 FCFA par jour représente 7,665,000 FCFA sur une année - une somme considérable pour les ménages africains. Cependant, les systèmes d'épargne traditionnels sont soit inaccessibles (banques), soit informels et risqués (épargne à domicile ou chez des tiers).

💡 SOLUTION PROPOSÉE
Une application mobile ultra-accessible qui :
Automatise l'épargne : Prélèvements automatiques quotidiens ou hebdomadaires selon les préférences
S'intègre au mobile money : Utilise les portefeuilles électroniques existants (MTN Money, Orange Money, etc.)
Reste flexible : Montants ajustables, pauses possibles, objectifs personnalisables
Éduque financièrement : Modules d'apprentissage gamifiés en langues locales
Crée de la communauté : Tontines digitales et défis d'épargne entre proches

👥 MARCHÉ CIBLE
Cible Primaire :
Jeunes adultes africains (18-35 ans)
Revenus modestes mais réguliers
Utilisateurs de mobile money
Non-bancarisés ou sous-bancarisés
Cible Secondaire :
Femmes entrepreneures et commerçantes
Étudiants et jeunes professionnels
Familles souhaitant épargner pour l'éducation des enfants
Marché Géographique :
Phase 1 : Gabon (Libreville)
Phase 2 : Afrique Centrale (Cameroun, Congo, RCA)
Phase 3 : Afrique de l'Ouest et de l'Est

🎯 OBJECTIF FINAL MVP
Créer une application fonctionnelle permettant à un utilisateur gabonais de configurer une épargne quotidienne automatique de 100-5000 FCFA via son mobile money, avec une interface si simple qu'il peut l'utiliser sans formation préalable. L'app doit être stable, sécurisée et prête pour des tests avec 100 utilisateurs pilotes à Libreville.
Priorité absolue : SIMPLICITÉ et FIABILITÉ over SOPHISTICATION

🔧 FONCTIONNALITÉS CORE À DÉVELOPPER

1. SYSTÈME D'AUTHENTIFICATION SIMPLE

- Inscription avec numéro de téléphone uniquement
- Vérification par SMS (OTP)
- Création PIN 4 chiffres
- Connexion via PIN uniquement
- Pas de mot de passe complexe
- Récupération compte via SMS

2. INTERFACE ULTRA-SIMPLE
   ÉCRANS OBLIGATOIRES :
   ├── Écran d'accueil/Inscription
   ├── Écran principal (dashboard)
   ├── Écran configuration épargne
   ├── Écran historique épargne
   ├── Écran paramètres de base
   └── Écran aide/support

DESIGN REQUIS :

- Interface minimaliste avec gros boutons
- Police grande taille (16sp minimum)
- Couleurs contrastées pour visibilité
- Icônes universelles compréhensibles
- Maximum 3 actions par écran
- Navigation par onglets simples

3. ÉPARGNE AUTOMATIQUE QUOTIDIENNE
   FONCTIONNALITÉS :
   ├── Sélection montant épargne quotidienne :
   │ ├── 100 FCFA
   │ ├── 500 FCFA  
   │ ├── 1000 FCFA
   │ ├── 2000 FCFA
   │ └── 5000 FCFA (maximum MVP)
   ├── Heure de prélèvement configurable (par défaut 20h00)
   ├── Prélèvement automatique quotidien
   ├── Gestion échecs de paiement (retry automatique)
   ├── Possibilité de pause temporaire (max 7 jours)
   └── Historique des transactions

LOGIQUE MÉTIER :

- Prélèvement quotidien automatique
- En cas d'échec : retry après 2h, puis 4h, puis abandon
- Notification d'échec à l'utilisateur
- Compteur de jours d'épargne réussis
- Calcul automatique total épargné

4. INTÉGRATION MOBILE MONEY DE BASE
   INTÉGRATION REQUISE :

- MTN Mobile Money (Gabon) - PRIORITÉ 1
- Orange Money (Gabon) - Si possible dans les délais

FONCTIONNALITÉS MOBILE MONEY :
├── Connexion portefeuille mobile money
├── Vérification solde avant prélèvement  
├── Exécution transaction épargne
├── Confirmation de transaction
└── Gestion des erreurs de paiement

API REQUIREMENTS :

- Utiliser APIs officielles des opérateurs
- Transactions sécurisées avec chiffrement
- Gestion timeout et retry automatique
- Logs détaillés pour debugging

5. NOTIFICATIONS DE RAPPEL
   TYPES DE NOTIFICATIONS :
   ├── Notification quotidienne de rappel (19h30)
   ├── Confirmation de prélèvement réussi
   ├── Alerte échec de prélèvement
   ├── Résumé hebdomadaire d'épargne
   └── Encouragements motivationnels

PARAMÈTRES :

- Notifications activées par défaut
- Possibilité de désactiver
- Heure de rappel configurable
- Messages en français simple

STACK TECHNIQUE CHOISI

- **Frontend :**

  - **Framework :** React Native (avec Expo SDK 51)
  - **Gestion d'état :** Redux Toolkit
  - **Navigation :** React Navigation
  - **Requêtes API :** Axios
  - **Stockage sécurisé :** Expo SecureStore (pour les jetons JWT)

- **Backend :**

  - **Framework :** Node.js avec Express.js
  - **Base de données :** MongoDB (via Mongoose ODM)
  - **Authentification :** JWT (JSON Web Tokens)
  - **Middleware principaux :**
    - `cors` : pour la gestion des autorisations cross-origin.
    - `helmet` : pour la sécurisation des en-têtes HTTP.
    - `morgan` : pour le logging des requêtes HTTP.
    - `express-rate-limit` : pour la prévention des attaques par force brute.

- **Base de Données :**
  - **Type :** NoSQL
  - **Service :** MongoDB (probablement via un service cloud comme MongoDB Atlas)
  - **ORM / ODM :** Mongoose
