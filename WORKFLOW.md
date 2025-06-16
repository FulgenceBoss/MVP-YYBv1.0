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

### Étape 4 : Test et Validation Rigoureux

- **Action :** Effectuer des tests pour valider que l'implémentation fonctionne comme attendu.
- **Principe fondamental :** "Aucun code n'est considéré comme terminé sans preuve de son bon fonctionnement." Cette validation peut être un appel d'API réussi, une capture d'écran de l'interface utilisateur, ou une confirmation du comportement attendu.
- **Objectif :** S'assurer que la nouvelle fonctionnalité ne casse rien et remplit son rôle. Les tests peuvent inclure :
  - **Tests Backend :** Appels d'API via `curl` ou un client API (Postman).
  - **Tests Frontend :** Vérification du rendu visuel et des interactions sur un simulateur/appareil.
  - **Tests d'Intégration :** S'assurer que le frontend et le backend communiquent correctement.

### Étape 5 : Finalisation et Sauvegarde

- **Principe fondamental :** "On ne sauvegarde que du code testé et validé."
- **Action 1 (Suivi de projet) :** Une fois la validation réussie, mettre à jour le statut de la tâche avec `task-master set-status --id=<ID_TACHE> --status=done`.
- **Action 2 (Sauvegarde Git) :** Créer un commit local clair encapsulant la fonctionnalité validée, puis pousser ce commit sur le dépôt GitHub.
- **Action 3 (Documentation) :** Mettre à jour le fichier `REF-YESSI-MVP.txt` pour consigner les progrès réalisés.

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

---

## Règle d'Or du Débogage : La Méthode des "Logs Numérotés"

Face à un bug persistant ou un comportement inexpliqué (ex: une action qui ne se déclenche pas, un "gel" de l'application), la méthode de débogage suivante est **obligatoire** et doit être appliquée **systématiquement** avant de formuler des hypothèses complexes.

**Principe Fondamental :** Transformer l'exécution du code en une histoire lisible pour identifier précisément la ligne qui échoue.

### Processus en 3 Étapes

1.  **Identifier la Fonction Suspecte :**

    - Repérer la fonction qui est censée s'exécuter lorsque le bug se produit (ex: `handleLogin`, `onPressSave`, `verifyOtp`).

2.  **Instrumenter le Code avec des Logs Numérotés :**

    - Placer des `console.log()` numérotés et descriptifs au début de la fonction et avant/après chaque étape critique (appel `dispatch`, requête API, boucle, condition complexe).
    - **Exemple Concret (`SignUpScreen.js`) :**

      ```javascript
      const handleReceiveCode = async () => {
        console.log("[DEBUG] 1. Entrée dans la fonction.");
        if (!isValid) return;

        console.log("[DEBUG] 3. Avant dispatch.");
        dispatch(setLoading(true));
        console.log("[DEBUG] 4. Après dispatch.");

        try {
          console.log("[DEBUG] 5. Avant appel API.");
          await api.post(...);
          console.log("[DEBUG] 6. Après appel API.");
        } catch (err) {
          console.log("[DEBUG] 7. ERREUR CATCH:", err);
        } finally {
          console.log("[DEBUG] 8. Bloc FINALLY.");
        }
      };
      ```

3.  **Analyser la Séquence :**
    - Lancer l'action dans l'application et observer le terminal.
    - La **dernière ligne de log qui s'affiche** indique la section de code qui s'est exécutée avec succès. Le bug se trouve **immédiatement après**, sur la ligne qui aurait dû produire le log suivant.
    - Cette information factuelle doit guider la correction, évitant les hypothèses hasardeuses.

**Post-Débogage :** Une fois le bug résolu et validé, il est impératif de **retirer tous les logs de débogage** pour maintenir un code propre.
