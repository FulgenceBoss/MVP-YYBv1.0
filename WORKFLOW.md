# WORKFLOW DE DÉVELOPPEMENT - PROJET YESSI-YESSI

Ce document définit le processus itératif que nous suivons pour le développement du MVP de Yessi-Yessi. Chaque cycle de développement pour une nouvelle fonctionnalité doit respecter les étapes suivantes pour garantir la qualité, la clarté et la traçabilité.

---

## Principes Directeurs Avant Chaque Cycle

Avant d'entamer la boucle de développement en 6 étapes, chaque nouvelle phase de travail doit commencer par la validation des points suivants pour garantir l'alignement, la qualité et la vision à long terme du projet.

1.  **CONTEXTE BREF**

    - **Action :** Commencer chaque session par un rappel concis de notre mission.
    - **Exemple :** "Nous développons Yessi-Yessi Bank, une application d'épargne automatique pour le Gabon, visant à rendre l'épargne simple et accessible."

2.  **RÉFÉRENCE AU TRAVAIL PRÉCÉDENT**

    - **Action :** Se référer systématiquement au document `@REF-YESSI-MVP.txt` pour identifier l'état exact du développement et les derniers points de blocage.
    - **Exemple :** "Dans la session précédente, nous avons finalisé les endpoints d'authentification. L'état actuel montre un blocage sur la connectivité entre l'app et le serveur local. Nous reprenons à partir de là."

3.  **OBJECTIF PRÉCIS DE LA SESSION**

    - **Action :** Définir et communiquer clairement l'objectif de la tâche à venir en se basant sur la planification (`task-master next`).
    - **Exemple :** "Aujourd'hui, nous allons implémenter le module de connexion (`LoginScreen`) et le connecter au service d'authentification Redux."

4.  **SPÉCIFICATIONS DÉTAILLÉES**

    - **Action :** Détailler les spécifications techniques de la tâche : champs de formulaire, validation des données, gestion des états (chargement, succès, erreur), et comment l'UI/UX doit réagir.

5.  **EXIGENCE DE QUALITÉ DU CODE**

    - **Principe fondamental :** "Toujours produire un code COMPLET et fonctionnel avec une gestion d'erreurs robuste." Chaque fonction doit anticiper les cas d'échec et y répondre de manière appropriée (messages à l'utilisateur, logs, etc.).

6.  **COHÉRENCE ET INTÉGRATION**

    - **Principe fondamental :** "TOUJOURS s'assurer que chaque nouveau morceau de code s'intègre PARFAITEMENT avec les modules précédents." Cela implique de respecter les conventions de nommage, d'utiliser les services partagés (comme le client Axios) et de ne pas dupliquer la logique.

7.  **VALIDATION DE LA FAISABILITÉ ("Production Ready")**
    - **Question clé :** Avant de marquer une tâche comme terminée, se poser la question : "Ce code est-il réellement déployable en production pour 100 utilisateurs ?"
    - **Critères :** Cela inclut la performance (pas de boucles inutiles, requêtes optimisées), la sécurité (validation des entrées, pas de données sensibles exposées) et la scalabilité de l'approche choisie.

---

## La Boucle de Développement en 6 Étapes

### Étape 1 : Identification de la Prochaine Tâche

- **Action :** Utiliser la commande `task-master next` ou consulter le fichier `tasks.json`.
- **Objectif :** Identifier la prochaine tâche prioritaire à développer, en se basant sur les dépendances et l'ordre logique défini dans notre plan.

### Étape 2 : Planification de l'Approche

- **Action :** Discussion et définition de la stratégie d'implémentation pour la tâche identifiée.
- **Objectif :** S'accorder sur le "comment". Quels fichiers seront créés/modifiés ? Quelle logique sera implémentée ? Quels sont les points d'attention ?

### Étape 3 : Implémentation du Code

- **Action :** Écriture du code (backend ou frontend) nécessaire pour réaliser la tâche.
- **Objectif :** Produire un code propre, commenté lorsque nécessaire, et respectant l'architecture et les conventions établies.

### Étape 4 : Test et Validation

- **Action :** Effectuer des tests pour valider que l'implémentation fonctionne comme attendu.
- **Objectif :** S'assurer que la nouvelle fonctionnalité ne casse rien et remplit son rôle. Les tests peuvent inclure :
  - **Tests Backend :** Appels d'API via `curl` ou un client API (Postman).
  - **Tests Frontend :** Vérification du rendu visuel et des interactions sur un simulateur/appareil.
  - **Tests d'Intégration :** S'assurer que le frontend et le backend communiquent correctement.
- **Débogage de Connectivité :** En cas d'échec de communication (erreurs réseau, CORS, etc.), vérifier les adresses IP, les ports, les configurations de pare-feu et utiliser des outils comme le tunnel d'Expo si nécessaire.

### Étape 5 : Mise à Jour du Suivi de Projet

- **Action :** Utiliser la commande `task-master set-status --id=<ID_TACHE> --status=done`.
- **Objectif :** Mettre à jour officiellement le statut de la tâche terminée. Cela nous permet d'avoir une vision claire et en temps réel de l'avancement du projet.

### Étape 6 : Sauvegarde et Synchronisation

- **Principe fondamental :** "Toute tâche validée et terminée DOIT être sauvegardée."
- **Action :** Créer un commit local pour encapsuler les changements, puis pousser ce commit sur le dépôt GitHub.
- **Objectif :** Garantir qu'aucune progression ne soit perdue et que le travail de l'équipe soit synchronisé.
- **Commandes Types :**
  1.  `git add .`
  2.  `git commit -m "feat(module): Ajout de la fonctionnalité X"`
  3.  `git push origin master`

### Étape 7 : Documentation de l'Avancement

- **Action :** Mettre à jour le fichier `REF-YESSI-MVP.txt`.
- **Objectif :** Consigner les progrès réalisés dans notre document de référence. Mettre à jour les sections "CODE PRÊT" et, si nécessaire, "PROBLÈMES IDENTIFIÉS".

---

Ce cycle recommence ensuite pour la tâche suivante. Le respect de ce processus est la clé pour un développement structuré et un succès prédictible.

---

## Règle de Fin de Session

**Principe fondamental :** Aucune session de développement ne se termine sans une mise à jour claire de l'état du projet.

- **Action obligatoire avant chaque pause ou fin de session :**
  1.  **Revue des validations :** S'assurer que tous les développements de la session qui ont été validés (tests backend, UI fonctionnelle, etc.) sont bien consignés dans la section "CODE PRÊT" du fichier `@REF-YESSI-MVP.txt`.
  2.  **Mise à jour de l'état actuel :** Documenter avec précision dans la section "ÉTAT ACTUEL DU DÉVELOPPEMENT" du même fichier :
      - L'objectif qui était en cours.
      - Le dernier problème rencontré (s'il y en a un).
      - Le diagnostic ou les hypothèses sur sa cause.
      - La prochaine action prévue pour la reprise.

**Objectif :** Garantir que chaque nouvelle session puisse démarrer instantanément avec une compréhension parfaite du contexte, sans perte d'information.
