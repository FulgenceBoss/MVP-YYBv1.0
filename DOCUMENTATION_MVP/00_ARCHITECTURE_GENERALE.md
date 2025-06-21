# Architecture Générale de Yessi-Yessi

Ce document offre une vue d'ensemble de l'architecture technique du projet Yessi-Yessi. Son but est de comprendre rapidement comment les différentes parties du système interagissent.

## Schéma d'Architecture Simplifié

Le projet suit une architecture client-serveur classique, composée de trois blocs principaux :

```
+--------------------------------+       +--------------------------------+       +-------------------------+
|                                |       |                                |       |                         |
|    CLIENT (Frontend)           |       |      SERVEUR (Backend)         |       |    BASE DE DONNÉES      |
|                                |       |                                |       |                         |
|   - React Native (Expo)        |       |   - Node.js / Express.js       |       |   - MongoDB             |
|   - Gestion d'état (Redux)     |------>|   - API RESTful                |------>|   - Collections :       |
|   - Navigation (React Nav)     |       |   - Logique métier             |       |     * users           |
|   - Communication (Axios)      |       |   - Service CRON (épargne)     |       |     * transactions    |
|                                |       |                                |       |     * ...             |
+--------------------------------+       +--------------------------------+       +-------------------------+
```

## Description des Composants

### 1. Le Frontend (Dossier `/frontend`)

- **Rôle :** C'est l'application mobile avec laquelle l'utilisateur interagit. Elle est responsable de toute l'interface graphique (UI) et de l'expérience utilisateur (UX).
- **Technologie :** Construite avec **React Native** et l'écosystème **Expo**. Cela permet de développer pour iOS et Android à partir d'une seule base de code.
- **Responsabilités Clés :**
  - Afficher les écrans (Connexion, Tableau de Bord, Configuration, etc.).
  - Capturer les entrées de l'utilisateur (formulaire d'inscription, sélection du montant d'épargne).
  - Communiquer avec le backend via des appels à l'API REST pour récupérer des données (solde, historique) ou envoyer des commandes (s'inscrire, configurer l'épargne).
  - Gérer l'état de l'application (qui est connecté, quel est le solde actuel) à l'aide de **Redux Toolkit**.

### 2. Le Backend (Dossier `/backend`)

- **Rôle :** C'est le cerveau de l'application. Il est invisible pour l'utilisateur mais exécute toute la logique métier et gère les données.
- **Technologie :** Construit avec **Node.js** et le framework **Express.js**. C'est un serveur JavaScript qui expose une API REST.
- **Responsabilités Clés :**
  - **Exposer une API REST :** Fournir des points d'accès (endpoints) sécurisés que le frontend peut appeler (ex: `/api/auth/login`, `/api/savings/configure`).
  - **Gérer la logique métier :** Valider les données, gérer l'authentification des utilisateurs (création de compte, connexion via JWT), traiter les demandes d'épargne.
  - **Communiquer avec la base de données :** C'est le seul composant qui a le droit de lire ou d'écrire dans la base de données. Il utilise **Mongoose** pour modéliser les données.
  - **Exécuter des tâches planifiées :** Un service **CRON** est responsable de déclencher le processus d'épargne automatique chaque jour à l'heure définie par l'utilisateur.

### 3. La Base de Données

- **Rôle :** Assurer la persistance des données. C'est ici que toutes les informations sont stockées de manière durable.
- **Technologie :** **MongoDB**, une base de données NoSQL, hébergée sur le service cloud **MongoDB Atlas**.
- **Responsabilités Clés :**
  - Stocker les informations des utilisateurs (profil, PIN haché, configuration d'épargne).
  - Enregistrer chaque transaction d'épargne (date, montant, statut).
  - Garder une trace de l'historique des activités.

## Flux de Données Typique (Exemple : Connexion)

1.  **Frontend :** L'utilisateur saisit son numéro de téléphone et son PIN, puis appuie sur "Se connecter".
2.  **Frontend :** L'application envoie une requête `POST` à l'endpoint `/api/auth/login` du backend, avec les identifiants dans le corps de la requête.
3.  **Backend :** Le serveur reçoit la requête. Il cherche l'utilisateur dans la base de données et compare le PIN fourni avec le PIN haché stocké.
4.  **Backend & DB :** Le serveur interroge la collection `users` dans MongoDB pour trouver le bon document.
5.  **Backend :** Si les identifiants sont corrects, le serveur génère un **JSON Web Token (JWT)**.
6.  **Backend :** Le serveur renvoie une réponse de succès (200 OK) au frontend, avec le JWT.
7.  **Frontend :** L'application reçoit le JWT, le stocke de manière sécurisée (`Expo SecureStore`), et redirige l'utilisateur vers le tableau de bord.
