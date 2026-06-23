# Guide complet — Intégration d'un assistant IA dans CleanWave

> Ce guide est rédigé pour un **débutant**. Chaque étape explique **pourquoi** on fait quelque chose, pas seulement **comment**.

---

## Table des matières

1. [Principes de fonctionnement](#1-principes-de-fonctionnement)
2. [Choisir un fournisseur d'API](#2-choisir-un-fournisseur-dapi)
3. [Créer les clés API](#3-créer-les-clés-api)
4. [Installation côté backend Node.js](#4-installation-côté-backend-nodejs)
5. [Implémentation de l'API chat](#5-implémentation-de-lapi-chat)
6. [Sécurisation des clés](#6-sécurisation-des-clés)
7. [Connexion avec React Native](#7-connexion-avec-react-native)
8. [Écran de chat mobile](#8-écran-de-chat-mobile)
9. [Gestion des conversations](#9-gestion-des-conversations)
10. [Exemples de code commentés](#10-exemples-de-code-commentés)
11. [Tests](#11-tests)
12. [Déploiement](#12-déploiement)

---

## 1. Principes de fonctionnement

### Qu'est-ce qu'un assistant IA ?

Un assistant IA est un programme qui **comprend du texte** et **génère une réponse** en langage naturel. Dans CleanWave, il répond aux questions des citoyens sur :

- comment signaler un dépôt ;
- où trouver un point de dépôt ;
- les horaires de collecte ;
- le système de primes.

### Architecture simplifiée

```
Utilisateur (app mobile)
        │
        │  "Quand passe le camion à Akwa ?"
        ▼
React Native (écran Chat)
        │
        │  POST /api/v1/chat/message  + JWT
        ▼
Backend Node.js (Express)
        │
        │  1. Vérifie l'utilisateur
        │  2. Charge l'historique (table chat_messages)
        │  3. Appelle OpenAI avec le contexte
        │  4. Sauvegarde la réponse
        ▼
API OpenAI (ou autre)
        │
        │  Réponse générée
        ▼
Backend → App → Affichage à l'utilisateur
```

### Règle d'or

**La clé API ne doit JAMAIS être dans l'application mobile.** Elle reste **uniquement sur le serveur** (fichier `.env`).

---

## 2. Choisir un fournisseur d'API

| Fournisseur | Avantages | Inconvénients |
|-------------|-----------|---------------|
| **OpenAI** (GPT-4o mini) | Documentation excellente, réponses de qualité | Payant, compte requis |
| **Google Gemini** | Gratuit en faible volume | API parfois moins stable |
| **Anthropic Claude** | Très bon en français | Moins d'exemples Node.js |
| **Réponses locales (actuel)** | Gratuit, sans clé | Pas vraiment intelligent |

**Recommandation pour débuter :** OpenAI **GPT-4o mini** — bon rapport qualité/prix pour un chatbot d'aide.

---

## 3. Créer les clés API

### OpenAI

1. Allez sur [platform.openai.com](https://platform.openai.com)
2. Créez un compte et vérifiez votre email
3. Menu **API keys** → **Create new secret key**
4. Copiez la clé (format `sk-proj-...`) — elle ne s'affichera qu'une fois
5. Ajoutez un moyen de paiement dans **Billing** (facturation à l'usage)

### Dans votre projet

Ouvrez `cleanwave-backend/.env` et ajoutez :

```env
OPENAI_API_KEY=sk-proj-VOTRE_CLE_ICI
OPENAI_MODEL=gpt-4o-mini
```

---

## 4. Installation côté backend Node.js

Dans le dossier `cleanwave-backend` :

```bash
npm install openai
```

Le package officiel `openai` gère les appels HTTP vers l'API OpenAI.

---

## 5. Implémentation de l'API chat

### Fichier à modifier

`cleanwave-backend/src/modules/chat/chat.service.js`

### Logique à implémenter

1. Recevoir le message de l'utilisateur
2. Sauvegarder en base (`role: 'user'`)
3. Charger les 10 derniers messages pour le contexte
4. Construire un **prompt système** décrivant CleanWave
5. Appeler OpenAI
6. Sauvegarder la réponse (`role: 'assistant'`)
7. Retourner la réponse au frontend

### Prompt système recommandé

```javascript
const SYSTEM_PROMPT = `
Tu es l'assistant CleanWave, une application camerounaise de gestion des déchets.
Tu réponds en français, de manière simple et bienveillante.
Tu peux aider sur : signalements, points de dépôt, plannings de collecte, primes.
Si tu ne sais pas, oriente l'utilisateur vers le menu correspondant de l'app.
Ne invente jamais d'horaires ou d'adresses précises.
`.trim();
```

---

## 6. Sécurisation des clés

### À faire

- Stocker `OPENAI_API_KEY` dans `.env` (jamais dans Git)
- Vérifier que `.env` est dans `.gitignore`
- Utiliser `authenticate` sur toutes les routes `/chat`
- Limiter le nombre de messages par minute (rate limiting déjà présent dans `app.js`)

### À ne jamais faire

- Mettre la clé dans `CleanWave/src/...`
- Commiter `.env` sur GitHub
- Exposer la clé dans les logs console

### Variables d'environnement en production

Sur Render, Railway ou VPS : configurez `OPENAI_API_KEY` dans le panneau **Environment Variables**, pas dans le code.

---

## 7. Connexion avec React Native

### Couche API existante

Le frontend appelle déjà le backend via :

- `CleanWave/src/api/apiClient.js` — client HTTP avec JWT
- `CleanWave/src/api/chatApi.js` — fonctions chat

### Exemple d'appel

```javascript
// chatApi.js
import { apiGet, apiPost, apiDelete } from './apiClient';

export const getChatHistory = () => apiGet('/chat/history');

export const sendChatMessage = (contenu) =>
  apiPost('/chat/message', { contenu });

export const clearChatHistory = () => apiDelete('/chat/history');
```

### Configuration de l'URL backend

Dans `apiClient.js`, pour le développement local :

```javascript
const API_BASE_URL = 'http://10.0.2.2:3001/api/v1'; // Émulateur Android
// ou 'http://localhost:3001/api/v1' pour iOS simulateur
// ou l'IP de votre PC pour un téléphone physique
```

---

## 8. Écran de chat mobile

### Composants nécessaires

| Composant | Rôle |
|-----------|------|
| `FlatList` | Affiche la liste des messages |
| `TextInput` | Zone de saisie |
| `TouchableOpacity` | Bouton Envoyer |
| `ActivityIndicator` | Indicateur de chargement |

### Flux utilisateur

1. Ouverture de l'écran → `getChatHistory()`
2. Saisie d'un message → `sendChatMessage(texte)`
3. Ajout optimiste du message utilisateur dans la liste
4. Réception de la réponse → ajout du message assistant
5. Scroll automatique vers le bas

### Différenciation visuelle

- Messages **utilisateur** : alignés à droite, fond vert (`#3AB795`)
- Messages **assistant** : alignés à gauche, fond gris clair

---

## 9. Gestion des conversations

### Modèle Prisma (déjà en place)

```prisma
model ChatMessage {
  id         BigInt   @id @default(autoincrement())
  user_id    String   @db.Uuid
  role       String   // 'user' | 'assistant'
  contenu    String   @db.Text
  created_at DateTime @default(now())
}
```

### Routes API disponibles

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/v1/chat/history` | Historique de l'utilisateur |
| POST | `/api/v1/chat/message` | Envoyer un message |
| DELETE | `/api/v1/chat/history` | Effacer l'historique |

### Amélioration future : sessions

Pour plusieurs conversations, ajoutez une table `ChatSession` avec un `session_id` lié aux messages.

---

## 10. Exemples de code commentés

### Backend — chat.service.js avec OpenAI

```javascript
const OpenAI = require('openai');
const prisma = require('../../lib/prisma');

// Client OpenAI — lit OPENAI_API_KEY depuis process.env
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const SYSTEM_PROMPT = `Tu es l'assistant CleanWave...`;

const sendMessage = async (userId, contenu) => {
  // 1. Sauvegarder le message utilisateur
  await prisma.chatMessage.create({
    data: { user_id: userId, role: 'user', contenu },
  });

  // 2. Charger l'historique récent (contexte)
  const history = await prisma.chatMessage.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'asc' },
    take: 20,
  });

  let reponseBot;

  if (openai) {
    // 3. Appel OpenAI avec historique
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.contenu,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    reponseBot = completion.choices[0].message.content;
  } else {
    // Fallback si pas de clé API
    reponseBot = genererReponseChatbot(contenu);
  }

  // 4. Sauvegarder la réponse
  const messageBot = await prisma.chatMessage.create({
    data: { user_id: userId, role: 'assistant', contenu: reponseBot },
  });

  return messageBot;
};
```

### Frontend — envoi d'un message

```javascript
const [messages, setMessages] = useState([]);
const [input, setInput] = useState('');
const [loading, setLoading] = useState(false);

const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { role: 'user', contenu: input, id: Date.now() };
  setMessages((prev) => [...prev, userMessage]);
  setInput('');
  setLoading(true);

  try {
    const response = await sendChatMessage(input);
    const botMessage = response.data.message;
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    Alert.alert('Erreur', 'Impossible d\'envoyer le message.');
  } finally {
    setLoading(false);
  }
};
```

---

## 11. Tests

### Test manuel backend (curl)

```bash
# 1. Obtenir un token JWT via Supabase (connexion app ou Postman)
# 2. Envoyer un message
curl -X POST http://localhost:3001/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_JWT" \
  -d '{"contenu":"Comment signaler un dépôt ?"}'
```

### Checklist de tests

- [ ] Message envoyé sans token → erreur 401
- [ ] Message valide → réponse assistant en JSON
- [ ] Historique rechargé après redémarrage de l'app
- [ ] Effacement de l'historique fonctionne
- [ ] Sans `OPENAI_API_KEY` → fallback local (pas de crash)
- [ ] Réponses en français cohérentes

### Test mobile

1. Lancez le backend : `npm run dev`
2. Lancez Expo : `npx expo start`
3. Connectez-vous en citoyen
4. Ouvrez l'onglet Chat
5. Posez : « Comment consulter le planning de mon quartier ? »

---

## 12. Déploiement

### Backend

1. Hébergez sur Render, Railway ou un VPS
2. Configurez les variables :
   - `DATABASE_URL`, `DIRECT_URL`
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`, `OPENAI_MODEL`
3. Exécutez `npx prisma db push` sur la base de production
4. Vérifiez `GET /api/v1/health`

### Frontend

1. Mettez à jour `API_BASE_URL` dans `apiClient.js` avec l'URL HTTPS du backend
2. Build Expo : `eas build` pour Android/iOS
3. Testez le chat en conditions réelles (réseau mobile)

### Coûts OpenAI estimés

GPT-4o mini : environ **0,15 $ / million de tokens entrée**. Pour 1000 conversations courtes/mois, comptez **moins de 2 $/mois**.

---

## Résumé des fichiers à toucher

| Fichier | Action |
|---------|--------|
| `cleanwave-backend/.env` | Ajouter `OPENAI_API_KEY` |
| `cleanwave-backend/package.json` | Ajouter dépendance `openai` |
| `cleanwave-backend/src/modules/chat/chat.service.js` | Brancher OpenAI |
| `CleanWave/src/api/chatApi.js` | Appels API (déjà prévu) |
| `CleanWave/src/screens/dashboard/ChatScreen.js` | Interface utilisateur |

---

## Prochaine étape concrète

1. Créez votre clé OpenAI
2. Ajoutez-la dans `.env`
3. Installez `openai` : `npm install openai`
4. Remplacez `genererReponseChatbot` par l'appel OpenAI (section 10)
5. Testez avec curl puis depuis l'app mobile

Bon développement ! 🌊
