# Guide d'Installation et de Lancement du Projet Yessi-Yessi

Ce document décrit les étapes nécessaires pour cloner, installer et lancer l'intégralité du projet Yessi-Yessi (backend et frontend) sur un poste de développement.

## 1. Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

- **[Node.js](https://nodejs.org/) (Version LTS recommandée)** : Inclut `npm`, le gestionnaire de paquets Node.
- **[Git](https://git-scm.com/)** : Pour le versionnement du code.
- Un éditeur de code, comme **[VS Code](https://code.visualstudio.com/)**.
- Un compte **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** pour la base de données.

## 2. Structure du Projet : Point Crucial

Le projet est organisé en deux parties distinctes, chacune avec ses propres dépendances :

- **`/backend`**: Le serveur Node.js (API, logique métier).
- **`/frontend`**: L'application mobile React Native (Expo).

⚠️ **IMPORTANT :** Chaque dossier (`backend` et `frontend`) possède son propre fichier `package.json` et son propre dossier `node_modules`. Vous devez **toujours** vous assurer d'être dans le bon dossier dans votre terminal avant de lancer une commande `npm`.

## 3. Installation et Lancement

Suivez ces étapes dans l'ordre.

### Étape A : Cloner le Dépôt

Ouvrez un terminal et placez-vous dans le répertoire où vous souhaitez stocker le projet, puis exécutez :

```bash
git clone <URL_DU_DEPOT_GIT>
cd YBB # ou le nom du dossier créé
```

### Étape B : Configuration du Backend

1.  **Naviguez dans le dossier du backend :**

    ```bash
    cd backend
    ```

2.  **Installez les dépendances :**

    ```bash
    npm install
    ```

3.  **Créez le fichier d'environnement :**

    - Créez un fichier nommé `.env` à la racine du dossier `backend`.
    - Remplissez-le avec les variables nécessaires. Ces clés ne doivent jamais être partagées sur Git.

    ```env
    # Port sur lequel le serveur écoutera
    PORT=8081

    # Votre chaîne de connexion MongoDB Atlas
    MONGO_URI="mongodb+srv://<user>:<password>@cluster...mongodb.net/yourDatabaseName?retryWrites=true&w=majority"

    # Une chaîne de caractères longue et aléatoire pour signer les tokens
    JWT_SECRET="VOTRE_SECRET_TRES_LONG_ET_ALEATOIRE_ICI"
    ```

4.  **Lancez le serveur backend :**
    ```bash
    npm start
    ```
    Si tout se passe bien, vous devriez voir un message indiquant que le serveur est connecté à la base de données et écoute sur le port 8081.

### Étape C : Configuration du Frontend

Ouvrez un **nouveau terminal** pour cette étape, en laissant le terminal du backend tourner.

1.  **Naviguez dans le dossier du frontend depuis la racine du projet :**

    ```bash
    cd frontend
    ```

2.  **Installez les dépendances :**

    ```bash
    npm install
    ```

3.  **Configurez l'adresse IP de l'API :**

    - Il est probable que vous deviez configurer l'adresse IP locale de votre machine (celle sur laquelle tourne le backend) pour que l'application mobile puisse s'y connecter.
    - Ouvrez le fichier `frontend/src/api/config.js` (ou un fichier similaire) et assurez-vous que l'URL de l'API pointe vers l'IP correcte (ex: `http://192.168.1.XX:8081`).

4.  **Lancez le client de développement Expo :**
    ```bash
    npx expo start
    ```
    Un QR code va s'afficher. Scannez-le avec l'application "Expo Go" sur votre téléphone (Android ou iOS) pour lancer l'application. Votre téléphone et votre ordinateur doivent être sur le **même réseau Wi-Fi**.

## 4. Compilation d'un "Development Build" (Pour Appareil Physique)

Si vous avez besoin de tester des fonctionnalités natives non supportées par Expo Go (comme les notifications push), vous devez compiler une application `.apk` (Android) ou `.ipa` (iOS).

1.  **Assurez-vous que toutes les dépendances sont installées :**
    ```bash
    # Depuis le dossier /frontend
    npm install
    ```
2.  **(Première fois uniquement) Installez le client de développement :**
    ```bash
    # Depuis le dossier /frontend
    npx expo install expo-dev-client
    ```
3.  **Lancez la compilation via le script NPM :**
    - Nous avons ajouté un script pour fiabiliser cette commande.
    - Assurez-vous que vos identifiants (`google-services.json`) sont correctement configurés sur EAS.
    ```bash
    # Depuis le dossier /frontend
    npm run eas-build:dev
    ```

---

_Ce document doit être mis à jour si une nouvelle dépendance ou une nouvelle étape de configuration est ajoutée._
