# 🌊 CleanWave — Documentation Complète du Projet

> Rédigée pour un développeur débutant. Chaque concept est expliqué simplement.

---

## 1. Présentation du projet

### Qu'est-ce que CleanWave ?

CleanWave est une **application mobile de gestion des déchets au Cameroun**.
Elle met en relation trois types d'acteurs :

| Acteur | Rôle |
|--------|------|
| **Citoyen** | Signale les dépôts sauvages, consulte les plannings |
| **Collecteur** | Prend en charge les signalements, gère les collectes |
| **Partenaire** | ONG/Entreprise qui planifie des tournées de collecte |
| **Admin** | Gère tous les utilisateurs et le contenu |

### Fonctionnalités de l'application

- ♻️ **Signalement** — Photographier et géolocaliser un dépôt sauvage
- 🗺️ **Carte** — Voir les points de dépôt autorisés autour de soi
- 🚛 **Planning** — Consulter les horaires de collecte dans son quartier
- 🏅 **Gamification** — Système de points et classement pour motiver
- 💬 **Chatbot** — Assistant IA pour répondre aux questions
- 👤 **Multi-rôles** — Interface adaptée selon le type d'utilisateur

---

## 2. Architecture générale

```
┌─────────────────────────────────────────────────────────────────┐
│                      ARCHITECTURE CLEANWAVE                      │
│                                                                   │
│  📱 FRONTEND (React Native + Expo)                               │
│     L'application sur le téléphone de l'utilisateur              │
│     Dossier : CleanWave/                                         │
│                          │                                        │
│                          │ HTTP/HTTPS (Internet)                  │
│                          ▼                                        │
│  🖥️  BACKEND (Node.js + Express + Prisma)                        │
│     Le serveur qui traite les données                             │
│     Dossier : cleanwave-backend/                                 │
│                          │                                        │
│                          │ PostgreSQL                             │
│                          ▼                                        │
│  🗄️  BASE DE DONNÉES (Supabase)                                  │
│     Les données stockées dans le cloud                            │
│     Hébergé sur : supabase.co                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Structure complète du projet

### 3.1 Frontend — `CleanWave/`

```
CleanWave/
├── App.js                          ← Point d'entrée (1er fichier exécuté)
├── index.js                        ← Enregistrement Expo (ne pas modifier)
├── app.json                        ← Config Expo (nom de l'app, icônes...)
├── package.json                    ← Liste des dépendances NPM
│
└── src/                            ← Tout le code source
    ├── api/                        ← [NOUVEAU] Couche d'appels au backend
    │   ├── apiClient.js            ← Client HTTP (ajoute le JWT automatiquement)
    │   ├── authApi.js              ← Appels auth (sync profil, get me)
    │   ├── signalementsApi.js      ← Appels signalements
    │   ├── depotsApi.js            ← Appels dépôts
    │   ├── planningsApi.js         ← Appels plannings
    │   └── chatApi.js              ← Appels chatbot
    │
    ├── constants/
    │   └── theme.js                ← Couleurs, polices, espacements
    │
    ├── context/
    │   └── AuthContext.js          ← État global de connexion
    │
    ├── lib/
    │   └── supabase.js             ← Client Supabase (auth uniquement)
    │
    ├── navigation/
    │   ├── RootNavigator.js        ← Routeur principal (selon rôle)
    │   ├── AppNavigator.js         ← Navigation publique
    │   ├── CitoyenNavigator.js     ← Navigation citoyen
    │   ├── CollecteurNavigator.js  ← Navigation collecteur
    │   ├── PartenaireNavigator.js  ← Navigation partenaire
    │   └── AdminNavigator.js       ← Navigation admin
    │
    ├── screens/
    │   ├── auth/
    │   │   ├── AuthScreen.js       ← Connexion + Inscription (animé)
    │   │   ├── LoginScreen.js      ← Connexion standalone
    │   │   └── RegisterScreen.js   ← Inscription standalone
    │   ├── dashboard/
    │   │   ├── DashboardCitoyen.js
    │   │   ├── DashboardCollecteur.js
    │   │   ├── DashboardPartenaire.js
    │   │   ├── DashboardAdmin.js
    │   │   └── CitoyenScreens.js   ← Sous-écrans du citoyen
    │   └── home/
    │       └── HomeScreen.js       ← Page d'accueil publique
    │
    └── components/
        ├── DashboardLayout.js      ← Layout commun des dashboards
        ├── FeatureCard.js          ← Carte de fonctionnalité
        ├── SectionTitle.js         ← Titre de section
        ├── StatItem.js             ← Statistique affichée
        └── TestimonialCard.js      ← Témoignage utilisateur
```

### 3.2 Backend — `cleanwave-backend/`

```
cleanwave-backend/
├── .env                            ← Variables secrètes (ne jamais commiter !)
├── .env.example                    ← Modèle des variables
├── .gitignore                      ← Fichiers à ignorer par Git
├── package.json                    ← Dépendances NPM du backend
│
├── prisma/
│   └── schema.prisma               ← Structure de la base de données
│
└── src/
    ├── server.js                   ← Démarre le serveur (port 3001)
    ├── app.js                      ← Configure Express (routes, sécurité...)
    │
    ├── lib/
    │   ├── prisma.js               ← Client Prisma (connexion BDD)
    │   └── supabase.js             ← Client Supabase (vérification JWT)
    │
    ├── middleware/
    │   ├── auth.middleware.js       ← Vérifie les tokens JWT
    │   └── error.middleware.js      ← Gestion globale des erreurs
    │
    └── modules/                    ← Organisation par fonctionnalité
        ├── auth/
        │   ├── auth.routes.js      ← URLs disponibles
        │   ├── auth.controller.js  ← Traite les requêtes HTTP
        │   └── auth.service.js     ← Logique métier
        ├── users/
        │   ├── users.routes.js
        │   ├── users.controller.js
        │   └── users.service.js
        ├── signalements/
        │   ├── signalements.routes.js
        │   ├── signalements.controller.js
        │   └── signalements.service.js
        ├── depots/
        │   ├── depots.routes.js
        │   ├── depots.controller.js
        │   └── depots.service.js
        ├── plannings/
        │   ├── plannings.routes.js
        │   ├── plannings.controller.js
        │   └── plannings.service.js
        └── chat/
            ├── chat.routes.js
            ├── chat.controller.js
            └── chat.service.js
```

---

## 4. Explication détaillée de chaque fichier clé

### `cleanwave-backend/src/server.js`
**Rôle** : Démarrer le serveur HTTP.
**Quand exécuté** : En premier, quand tu lances `npm run dev`.
**Comment modifier** : Changer le port dans `.env` (variable `PORT`).

### `cleanwave-backend/src/app.js`
**Rôle** : Configurer Express (sécurité, routes, middlewares).
**Quand exécuté** : Appelé par `server.js` au démarrage.
**Comment modifier** : Pour ajouter un nouveau groupe de routes, importer le fichier de routes et ajouter `app.use('/api/v1/nouveau', nouveauRoutes)`.

### `cleanwave-backend/src/middleware/auth.middleware.js`
**Rôle** : Protéger les routes — vérifier que l'utilisateur est connecté.
**Quand exécuté** : Avant chaque route protégée.
**Erreurs à éviter** : Ne jamais oublier d'ajouter `authenticate` aux routes sensibles.

### `cleanwave-backend/prisma/schema.prisma`
**Rôle** : Décrire la structure des tables Supabase pour Prisma.
**Quand exécuté** : Lors de `prisma generate` — génère le client JavaScript.
**Comment modifier** : Si tu ajoutes une colonne en BDD, l'ajouter ici, puis relancer `npx prisma generate`.

### `CleanWave/src/api/apiClient.js`
**Rôle** : Toutes les requêtes HTTP vers le backend passent par ici.
**Quand exécuté** : À chaque appel API depuis l'app mobile.
**Comment modifier** : Changer `API_BASE_URL` pour pointer vers le backend en production.

---

## 5. Communication Frontend ↔ Backend

### Flux complet d'un signalement

```
👤 UTILISATEUR
   │ Prend une photo d'un dépôt sauvage
   │ Appuie sur "Envoyer"
   ▼
📱 REACT NATIVE (CleanWave/src/api/signalementsApi.js)
   │ createSignalement({ localisation, photo, lat, lng, description })
   │ → apiPost('/signalements', data)
   ▼
📱 REACT NATIVE (CleanWave/src/api/apiClient.js)
   │ Récupère le token JWT depuis Supabase
   │ Ajoute le header : Authorization: Bearer <token>
   │ Envoie la requête HTTP POST
   ▼
🌐 INTERNET (HTTP)
   ▼
🖥️ EXPRESS BACKEND (cleanwave-backend/src/app.js)
   │ Reçoit la requête sur POST /api/v1/signalements
   ▼
🔐 MIDDLEWARE AUTH (src/middleware/auth.middleware.js)
   │ Lit le token JWT dans le header
   │ Demande à Supabase : "Ce token est-il valide ?"
   │ Si OUI → charge le profil utilisateur
   │ Si NON → retourne 401 Unauthorized
   ▼
📋 CONTROLLER (src/modules/signalements/signalements.controller.js)
   │ Vérifie que les champs requis sont présents
   │ Vérifie que l'utilisateur a le droit de créer (rôle 'citoyen')
   │ Appelle le service
   ▼
⚙️  SERVICE (src/modules/signalements/signalements.service.js)
   │ Contient la logique métier :
   │   - etat = 'en_attente' (automatiquement)
   │   - date_signalement = maintenant
   │ Appelle Prisma
   ▼
🔷 PRISMA ORM (src/lib/prisma.js)
   │ Traduit en SQL :
   │ INSERT INTO signalements (user_id, localisation, ...)
   │ VALUES ('uuid-...', 'Quartier X', ...)
   ▼
🗄️  SUPABASE POSTGRESQL
   │ Exécute la requête SQL
   │ Vérifie les politiques RLS
   │ Retourne l'enregistrement créé
   ▼
🔷 PRISMA → SERVICE → CONTROLLER
   │ Retourne l'objet JSON
   ▼
🖥️  EXPRESS → HTTP 201 Created
   │ { success: true, data: { signalement: { id: 42, ... } } }
   ▼
📱 REACT NATIVE
   │ Reçoit la réponse
   │ Affiche "Signalement créé avec succès ! ✅"
   ▼
👤 UTILISATEUR voit la confirmation
```

---

## 6. Guide de démarrage rapide

### Démarrer le backend
```bash
# 1. Aller dans le dossier backend
cd cleanwave-backend

# 2. Lancer le serveur en mode développement
npm run dev

# 3. Vérifier que ça marche
# Ouvre http://localhost:3001/api/v1/health dans ton navigateur
```

### Démarrer le frontend
```bash
# 1. Aller dans le dossier frontend
cd CleanWave

# 2. Lancer l'application
npx expo start --clear
```

### ⚠️ Étape obligatoire avant d'utiliser le backend

Tu dois remplir le fichier `cleanwave-backend/.env` avec tes vraies valeurs :

1. Va sur **dashboard.supabase.com**
2. Sélectionne ton projet `rnvyezzhdtbqodrecrpv`
3. `Settings → Database → Connection string → Transaction pooler`
4. Copie l'URL et remplace `[MOT_DE_PASSE_DB]`
5. `Settings → API → service_role key`
6. Copie et remplace `[TA_SERVICE_ROLE_KEY_ICI]`

---

## 7. Guide de maintenance

### Ajouter une nouvelle table en base de données

1. **Créer la table dans Supabase Dashboard** (Table Editor)
2. **Mettre à jour `prisma/schema.prisma`** — ajouter le nouveau modèle
3. **Regénérer le client Prisma** :
   ```bash
   cd cleanwave-backend
   npx prisma generate
   ```
4. **Créer le module backend** (routes + controller + service)
5. **Enregistrer dans `app.js`** : `app.use('/api/v1/nouveau', nouveauRoutes)`
6. **Créer le fichier API frontend** dans `CleanWave/src/api/`

### Ajouter une nouvelle page React Native

1. Créer le fichier dans `CleanWave/src/screens/[dossier]/NouvelEcran.js`
2. L'importer dans le navigateur concerné (`CitoyenNavigator.js`, etc.)
3. Ajouter la route : `<Stack.Screen name="NouvelEcran" component={NouvelEcran} />`

### Modifier le schéma Prisma

```bash
# Après avoir modifié prisma/schema.prisma
npx prisma generate   # Régénère le client
npx prisma studio     # Ouvre une interface pour voir la BDD
```

### Déployer le backend (exemple Railway)

1. Créer un compte sur [railway.app](https://railway.app)
2. Connecter ton dépôt GitHub
3. Sélectionner le dossier `cleanwave-backend`
4. Ajouter les variables d'environnement (copier depuis `.env`)
5. Railway détecte automatiquement Node.js et déploie
6. Mettre à jour `API_BASE_URL` dans `apiClient.js` avec l'URL Railway

---

## 8. Guide spécial débutant — Les concepts expliqués

### 🎨 Frontend
Le **frontend** c'est **ce que l'utilisateur voit et touche**.
C'est l'application sur son téléphone.
Dans CleanWave, le frontend est fait avec **React Native** + **Expo**.
React Native permet de créer des applications pour iOS et Android avec du JavaScript.

### 🖥️ Backend
Le **backend** c'est **la partie invisible qui traite les données**.
C'est un serveur qui tourne sur un ordinateur (ou dans le cloud).
Il reçoit des demandes du téléphone, les traite, et renvoie des résultats.
Dans CleanWave, le backend est fait avec **Node.js** + **Express**.

### 🔗 API REST
Une **API** (Application Programming Interface) c'est un **contrat de communication**.
Le téléphone demande des données à l'URL `/api/v1/signalements`.
Le serveur répond avec les signalements au format JSON.
**REST** c'est un ensemble de règles pour organiser ces URLs logiquement.

### ⚡ Express
**Express** c'est un outil pour créer des serveurs en Node.js.
C'est comme un **système de tuyauterie** : les requêtes HTTP arrivent, passent dans des middlewares, et arrivent dans les bonnes routes.

```javascript
// Exemple simple
app.get('/bonjour', (req, res) => {
    res.json({ message: 'Bonjour !' });
});
```

### 🔷 Prisma
**Prisma** est un **ORM** (Object-Relational Mapper).
Il traduit du JavaScript en SQL automatiquement.

```javascript
// Au lieu d'écrire du SQL :
// SELECT * FROM signalements WHERE user_id = '...'

// Avec Prisma, tu écris du JavaScript :
const signalements = await prisma.signalement.findMany({
    where: { user_id: userId }
});
```

Prisma est **plus sûr** que le SQL brut (évite les injections SQL).
Il est **plus lisible** et **moins sujet aux erreurs de typo**.

### 🗄️ ORM
Un **ORM** (Object Relational Mapper) fait le **pont entre le code et la base de données**.
Côté code : tu manipules des objets JavaScript (`{ id: 1, nom: "Jean" }`)
Côté BDD : c'est une ligne dans une table SQL
L'ORM s'occupe de la traduction dans les deux sens.

### ☁️ Supabase
**Supabase** est une **base de données dans le cloud** + des outils prêts à l'emploi.
Il fournit :
- PostgreSQL (base de données relationnelle)
- Authentification (inscription, connexion, Google...)
- Storage (stockage de fichiers/photos)
- RLS (Row Level Security — sécurité par ligne)

Tu n'as pas besoin de gérer un serveur de base de données toi-même.

### 🔐 Authentification
L'**authentification** c'est le processus de **vérifier l'identité** d'un utilisateur.
Étape 1 : L'utilisateur entre email + mot de passe
Étape 2 : Supabase vérifie si c'est correct
Étape 3 : Si oui, Supabase donne un "token JWT" (comme un badge d'accès)
Étape 4 : L'app garde ce token et l'envoie à chaque requête

### 🎫 JWT (JSON Web Token)
Un **JWT** c'est comme un **badge d'accès numérique**.
Il contient des infos encodées (qui tu es, quand ça expire).
Il est signé cryptographiquement — impossible à falsifier.
Le backend vérifie ce badge à chaque requête pour savoir qui tu es.

### 🔑 Variables d'environnement
Les **variables d'environnement** sont des **paramètres secrets** qu'on ne veut pas mettre dans le code.
Exemples : mots de passe, clés API, URL de la base de données.
On les stocke dans un fichier `.env` qui n'est PAS committé sur Git.
Le code y accède via `process.env.NOM_DE_LA_VARIABLE`.

```javascript
// Dans .env (secret, jamais commité) :
DATABASE_URL="postgresql://..."

// Dans le code :
const url = process.env.DATABASE_URL;
```

---

## 9. Guide de reprise sans assistance IA

### Comment comprendre le code

1. **Commence par le fichier d'entrée** : `App.js` → `RootNavigator.js`
2. **Suit le flux d'un rôle** : ex. connecte-toi en tant que citoyen, regarde `CitoyenNavigator.js` → `DashboardCitoyen.js`
3. **Pour comprendre un appel API** : cherche dans `src/api/`, puis le module correspondant dans le backend

### Comment déboguer

**Frontend (React Native) :**
```bash
# Les logs apparaissent dans le terminal où expo est lancé
# Ou dans le navigateur (onglet Console) si tu utilises le mode web
npx expo start --clear
```

**Backend (Express) :**
```bash
# Les logs apparaissent dans le terminal où le backend est lancé
# Chaque requête est affichée avec Morgan (méthode, URL, statut)
npm run dev
```

**Base de données (Prisma Studio) :**
```bash
# Interface graphique pour voir la BDD
cd cleanwave-backend
npx prisma studio
# Ouvre http://localhost:5555 dans ton navigateur
```

### Comment ajouter une fonctionnalité

Exemple : Ajouter un système de "j'aime" sur les signalements.

1. **BDD** : Créer une table `likes` dans Supabase Dashboard
2. **Prisma** : Ajouter le modèle dans `schema.prisma`, lancer `prisma generate`
3. **Backend** : Créer `src/modules/likes/` avec routes + controller + service
4. **Backend** : Enregistrer dans `app.js`
5. **Frontend** : Créer `src/api/likesApi.js`
6. **Frontend** : Utiliser dans le composant voulu

### Comment rechercher un bug

1. **Lire le message d'erreur** : il dit souvent exactement le problème
2. **Chercher dans les logs** : frontend (expo terminal) et backend (npm dev terminal)
3. **Vérifier les variables d'environnement** : le `.env` est-il bien rempli ?
4. **Tester l'API directement** : utilise l'extension VS Code "Thunder Client" ou Postman
5. **Vérifier la connexion BDD** : teste avec `npx prisma studio`

### Comment documenter les changements

1. **Commenter le code** : expliquer le POURQUOI, pas le QUOI
   ```javascript
   // Mauvais commentaire :
   // Incrémente i
   i++;

   // Bon commentaire :
   // On incrémente pour passer au signalement suivant dans la liste
   i++;
   ```
2. **Mettre à jour ce fichier** si tu ajoutes une fonctionnalité majeure
3. **Utiliser des commits Git clairs** :
   ```bash
   git add .
   git commit -m "feat: ajouter le système de like sur les signalements"
   ```

---

## 10. URLs de référence importantes

| Service | URL | Usage |
|---------|-----|-------|
| Backend local | `http://localhost:3001/api/v1/health` | Vérifier que le backend tourne |
| Prisma Studio | `http://localhost:5555` | Voir la BDD en interface graphique |
| Supabase Dashboard | `https://supabase.com/dashboard` | Gérer la BDD et l'auth |
| Frontend Expo | `http://localhost:8081` | App web en développement |

---

## 11. Commandes de développement

```bash
# ──────────────── BACKEND ────────────────
cd cleanwave-backend

npm run dev          # Démarrer le backend (mode développement)
npm start            # Démarrer le backend (mode production)
npx prisma generate  # Régénérer le client Prisma après modif schema
npx prisma studio    # Interface graphique de la BDD

# ──────────────── FRONTEND ────────────────
cd CleanWave

npx expo start       # Démarrer l'app
npx expo start --clear  # Démarrer avec cache vidé (si problèmes)
npx expo start --web    # Mode navigateur web uniquement
```

---

*Documentation générée le 16 juin 2026 — CleanWave v1.0.0*
