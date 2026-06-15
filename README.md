# 🏦 Banque AI — Application de Gestion Bancaire avec Agent IA

Application full-stack de gestion de comptes bancaires basée sur un agent IA (RAG + Chatbot), développée avec **Spring Boot 3** (backend) et **Angular 19** (frontend).

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Technologies utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation et lancement](#-installation-et-lancement)
- [Configuration](#-configuration)
- [Comptes par défaut](#-comptes-par-défaut)
- [Endpoints REST principaux](#-endpoints-rest-principaux)
- [Chatbot RAG](#-chatbot-rag)
- [Bot Telegram](#-bot-telegram)

---

## ✅ Fonctionnalités

### Gestion des clients
- Lister, rechercher, créer, **modifier** et supprimer des clients
- Audit trail : chaque enregistrement tracke l'utilisateur authentifié (`createdBy`, `updatedBy`, `createdAt`, `updatedAt`)

### Gestion des comptes bancaires
- Deux types de comptes : **Compte Courant (CA)** et **Compte Épargne (SA)**
- Création de comptes directement depuis la fiche client
- Consultation du solde, statut, détails et historique paginé des opérations

### Opérations bancaires
- **Débit**, **Crédit**, **Virement** entre comptes
- Chaque opération enregistre l'utilisateur authentifié (`Done by`)

### Sécurité (Spring Security + JWT)
- Authentification par JWT (JSON Web Token)
- Deux rôles : `USER` (lecture seule) et `ADMIN` (gestion complète)
- Guards Angular : routes admin protégées, boutons conditionnels selon le rôle
- Changement de mot de passe
- Persistance de session via `localStorage` avec vérification d'expiration

### Dashboard Analytics
- Statistiques globales (nombre de clients, comptes, opérations, solde total)
- Graphiques interactifs avec **Chart.js** :
  - Répartition comptes courants / épargne (camembert)
  - Opérations par mois — débit vs crédit (barres)
  - Évolution mensuelle crédit/débit (courbes)
  - Top 5 clients par solde total (barres horizontales)

### Chatbot IA (RAG)
- Basé sur **Spring AI** + **OpenAI GPT-4o-mini**
- Architecture RAG (Retrieval-Augmented Generation) : données bancaires indexées dans un VectorStore
- Répond aux questions sur les clients, comptes et opérations en langage naturel
- Widget flottant intégré dans toutes les pages de l'application Angular

### Bot Telegram
- Bot Telegram connecté au même moteur RAG
- Commande `/start` pour l'accueil personnalisé
- Répond aux questions bancaires en langage naturel depuis Telegram

---

## 🏗 Architecture

```
banque-ai/
├── backend/
│   └── digital-banking/          # Spring Boot 3
│       ├── entities/             # Customer, BankAccount, AccountOperation…
│       ├── repositories/         # Spring Data JPA
│       ├── services/             # BankAccountService, AccountService…
│       ├── web/                  # REST Controllers + Swagger
│       ├── security/             # JWT, AppUser, AppRole, Spring Security
│       ├── chatbot/              # RAG, ChatbotService, TelegramBotService
│       ├── config/               # AuditingConfig, DataInitializerRunner…
│       └── dtos/                 # DTOs incluant les champs audit
│
└── frontend/
    └── ebanking-front/           # Angular 19
        ├── components/           # Customers, Accounts, Dashboard, Chatbot…
        ├── services/             # CustomerService, AccountsService, AuthService…
        ├── guards/               # AuthenticationGuard, AdminGuard
        └── model/                # Customer, AccountDetails, BankAccountDTO…
```

---

## 🛠 Technologies utilisées

| Couche | Technologies |
|--------|-------------|
| **Backend** | Spring Boot 3.5, Spring Data JPA, Spring Security, JWT |
| **Base de données** | H2 fichier persistant (dev) / MySQL (prod) |
| **IA** | Spring AI, OpenAI GPT-4o-mini, text-embedding-3-small |
| **Bot** | Telegram Bots API (`telegrambots-spring-boot-starter`) |
| **Frontend** | Angular 19, Bootstrap 5, Chart.js (ng2-charts) |
| **API Docs** | SpringDoc OpenAPI (Swagger UI) |
| **Build** | Maven 3, Node.js 20 / npm |

---

## 📦 Prérequis

- Java 21+
- Maven 3.9+
- Node.js 20+ / npm
- Clé API OpenAI (modèles `gpt-4o-mini` + `text-embedding-3-small`)
- (Optionnel) Token bot Telegram

---

## 🚀 Installation et lancement

### 1. Backend

```bash
cd backend/digital-banking

# Créer le fichier .env (NE JAMAIS commiter ce fichier)
# Ajouter votre clé OpenAI :
# OPENAI_API_KEY=sk-proj-...

mvn spring-boot:run
```

- Backend : **http://localhost:8085**
- Swagger UI : **http://localhost:8085/swagger-ui.html**
- Console H2 : **http://localhost:8085/h2-console**

### 2. Frontend

```bash
cd frontend/ebanking-front
npm install
ng serve -o
```

- Application : **http://localhost:4200**

---

## ⚙️ Configuration

### `backend/digital-banking/.env`

```env
# Clé OpenAI — OBLIGATOIRE (ne jamais commiter)
OPENAI_API_KEY=sk-proj-...

# Bot Telegram — optionnel
# Créer un bot via @BotFather sur Telegram, puis :
# TELEGRAM_ENABLED=true
# TELEGRAM_BOT_TOKEN=123456789:ABC-DEF...
# TELEGRAM_BOT_USERNAME=mon_banque_bot
```

---

## 👤 Comptes par défaut

| Username | Mot de passe | Rôle |
|----------|-------------|------|
| `admin`  | `12345`     | ADMIN + USER |
| `user1`  | `12345`     | USER |
| `user2`  | `12345`     | USER |

### Différences USER vs ADMIN

| Fonctionnalité | USER | ADMIN |
|----------------|------|-------|
| Dashboard | ✅ | ✅ |
| Voir les clients | ✅ | ✅ |
| Créer / Modifier / Supprimer un client | ❌ | ✅ |
| Créer un compte bancaire | ❌ | ✅ |
| Opérations (débit/crédit/virement) | ✅ | ✅ |
| Gestion des utilisateurs | ❌ | ✅ |
| Changer mot de passe | ✅ | ✅ |
| Chatbot IA | ✅ | ✅ |

---

## 📊 Endpoints REST principaux

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/auth/login` | Authentification → JWT |
| GET | `/customers` | Liste des clients |
| POST | `/customers` | Créer un client |
| PUT | `/customers/{id}` | Modifier un client |
| DELETE | `/customers/{id}` | Supprimer un client |
| GET | `/accounts/customer/{id}` | Comptes d'un client |
| POST | `/accounts/current` | Créer un compte courant |
| POST | `/accounts/saving` | Créer un compte épargne |
| GET | `/accounts/{id}/pageOperations` | Historique paginé |
| POST | `/accounts/debit` | Débiter un compte |
| POST | `/accounts/credit` | Créditer un compte |
| POST | `/accounts/transfer` | Virement entre comptes |
| GET | `/dashboard/stats` | Statistiques globales |
| POST | `/chatbot/ask` | Question au chatbot IA |

---

## 🤖 Chatbot RAG

Le chatbot utilise l'architecture **RAG (Retrieval-Augmented Generation)** :

1. Au démarrage, `RagIndexingService` indexe tous les clients, comptes et opérations dans un **VectorStore** (via embeddings OpenAI `text-embedding-3-small`)
2. À chaque question, le `QuestionAnswerAdvisor` récupère les 4 documents les plus pertinents
3. Ces documents sont injectés comme contexte dans le prompt envoyé à `GPT-4o-mini`
4. Le modèle répond **uniquement** à partir de ce contexte bancaire réel

**Exemples de questions :**
- *"Quel est le solde du client Mohamed ?"*
- *"Quels comptes appartiennent à Hassan ?"*
- *"Liste les opérations de débit du mois dernier."*

---

## 📱 Bot Telegram

### Activation

1. Ouvrir Telegram → rechercher `@BotFather`
2. Envoyer `/newbot` → suivre les instructions
3. Copier le token fourni dans `.env` :
   ```env
   TELEGRAM_ENABLED=true
   TELEGRAM_BOT_TOKEN=<votre-token>
   TELEGRAM_BOT_USERNAME=<username_bot>
   ```
4. Redémarrer le backend

### Utilisation

- `/start` → message de bienvenue
- Toute question bancaire → réponse via le moteur RAG

---

*Projet réalisé dans le cadre du cours Architecture JEE et Frameworks — ENSET 2025*
