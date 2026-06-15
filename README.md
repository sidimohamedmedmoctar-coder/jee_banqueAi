# Rapport de Projet — Architecture JEE

---

<div align="center">

## Université : EMSI
### Filière : Génie Informatique — 4DSIM Groupe 1

---

| | |
|---|---|
| **Étudiant** | Mohamed Mahmoud Sid Mhamed |
| **Professeur** | Mohamed Youssfi |
| **Matière** | Architecture JEE et Frameworks |
| **Année universitaire** | 2025 – 2026 |

---

# 🏦 Banque AI
## Application de Gestion Bancaire avec Agent Intelligent (RAG)

*Application full-stack développée avec Spring Boot 3 (backend) et Angular 19 (frontend)*

</div>

---

## Table des matières

1. [Introduction](#1-introduction)
2. [Architecture du projet](#2-architecture-du-projet)
3. [Technologies utilisées](#3-technologies-utilisées)
4. [Fonctionnalités réalisées](#4-fonctionnalités-réalisées)
5. [Captures d'écran](#5-captures-décran)
6. [Installation et lancement](#6-installation-et-lancement)
7. [Configuration](#7-configuration)
8. [Comptes par défaut et gestion des rôles](#8-comptes-par-défaut-et-gestion-des-rôles)
9. [Endpoints REST](#9-endpoints-rest)
10. [Chatbot RAG et Bot Telegram](#10-chatbot-rag-et-bot-telegram)
11. [Conclusion](#11-conclusion)

---

## 1. Introduction

Ce projet a été réalisé dans le cadre du cours **Architecture JEE et Frameworks** dispensé à l'**EMSI**. Il consiste en une application bancaire intelligente nommée **Banque AI**, qui intègre les technologies modernes de développement web et d'intelligence artificielle.

L'application permet la gestion complète de clients bancaires, de leurs comptes et des opérations financières, avec une couche de sécurité JWT, un système d'audit trail, et un **agent IA conversationnel** basé sur l'architecture **RAG (Retrieval-Augmented Generation)**.

### Objectifs pédagogiques couverts

- Mise en œuvre d'une architecture **JEE multi-couches** (Entities, Repositories, Services, REST Controllers)
- Sécurisation avec **Spring Security + JWT**
- Gestion des rôles et contrôle d'accès granulaire
- Intégration d'une **IA générative** (OpenAI GPT-4o-mini + Spring AI)
- Développement d'un frontend **Angular 19** avec guards et change detection
- Traçabilité complète via **Spring Data JPA Auditing**
- Communication via **API REST** documentée avec **Swagger/OpenAPI**

---

## 2. Architecture du projet

```
banque-ai/
├── backend/
│   └── digital-banking/                  # Spring Boot 3.5
│       ├── entities/                     # Customer, BankAccount, AccountOperation, AppUser, AppRole
│       ├── repositories/                 # Spring Data JPA Repositories
│       ├── services/                     # BankAccountService, AccountService, UserService
│       ├── web/                          # REST Controllers (Customer, BankAccount, Auth, Dashboard, Chatbot)
│       ├── security/                     # JWT Filter, SecurityConfig, AppUser, AppRole
│       ├── chatbot/                      # RagIndexingService, ChatbotService, TelegramBotService
│       ├── config/                       # AuditingConfig, DataInitializerRunner
│       └── dtos/                         # DTOs avec champs audit (createdBy, updatedBy…)
│
└── frontend/
    └── ebanking-front/                   # Angular 19
        ├── components/                   # Dashboard, Customers, Accounts, Users, Chatbot, EditCustomer…
        ├── services/                     # CustomerService, AccountsService, AuthService
        ├── guards/                       # AuthenticationGuard, AdminGuard
        └── model/                        # Customer, AccountDetails, BankAccountDTO…
```

### Flux de données

```
Angular (HTTP + JWT)  ──►  Spring Security Filter  ──►  REST Controller
                                                              │
                                                              ▼
                                                       Service Layer
                                                              │
                                                   ┌──────────┴──────────┐
                                                   ▼                     ▼
                                            JPA Repository          RAG / OpenAI
                                                   │
                                                   ▼
                                            H2 Database (fichier)
```

---

## 3. Technologies utilisées

| Couche | Technologies |
|--------|-------------|
| **Backend** | Spring Boot 3.5, Spring Data JPA, Spring Security, JWT (jjwt) |
| **Base de données** | H2 fichier persistant (dev) — facilement migrable vers MySQL |
| **IA Générative** | Spring AI, OpenAI GPT-4o-mini, text-embedding-3-small, VectorStore |
| **Bot Telegram** | Telegram Bots API (`telegrambots-spring-boot-starter`) |
| **Audit** | Spring Data JPA Auditing (`@CreatedBy`, `@CreatedDate`, `@LastModifiedBy`, `@LastModifiedDate`) |
| **Frontend** | Angular 19, Bootstrap 5, Chart.js (ng2-charts), zone.js |
| **API Docs** | SpringDoc OpenAPI 2 (Swagger UI) |
| **Sécurité** | Spring Security, JWT, Angular Guards (AuthGuard, AdminGuard) |
| **Build** | Maven 3.9, Node.js 20 / npm |

---

## 4. Fonctionnalités réalisées

### 4.1 Gestion des clients
- Lister et rechercher des clients par nom
- Créer, **modifier** et supprimer des clients (ADMIN uniquement)
- **Audit trail complet** : chaque enregistrement tracke l'utilisateur authentifié (`createdBy`, `updatedBy`, `createdAt`, `updatedAt`)

### 4.2 Gestion des comptes bancaires
- Deux types : **Compte Courant (CA)** avec découvert, **Compte Épargne (SA)** avec taux d'intérêt
- Création de comptes directement depuis la fiche client (ADMIN)
- Consultation du solde, statut, et historique paginé des opérations

### 4.3 Opérations bancaires
- **Débit**, **Crédit**, **Virement** entre comptes
- Chaque opération enregistre l'utilisateur authentifié (`Done by`)

### 4.4 Sécurité JWT et contrôle d'accès
- Authentification par JWT avec persistance dans `localStorage`
- Deux rôles : `USER` (lecture) et `ADMIN` (gestion complète)
- **Guards Angular** : routes `/admin/*` protégées, boutons conditionnels selon le rôle
- Changement de mot de passe sécurisé

### 4.5 Gestion des utilisateurs (ADMIN)
- Lister tous les utilisateurs avec leurs rôles
- Promouvoir / rétrograder un utilisateur (ajouter / retirer le rôle ADMIN)
- Créer et supprimer des utilisateurs

### 4.6 Dashboard analytique
- Statistiques globales : nombre de clients, comptes, opérations, solde total
- **Graphiques interactifs** (Chart.js) :
  - Répartition Courants / Épargne (camembert)
  - Opérations par mois — Débit vs Crédit (barres)
  - Évolution mensuelle crédit/débit (courbes)
  - Top 5 clients par solde (barres horizontales)

### 4.7 Chatbot IA (RAG)
- Basé sur **Spring AI** + **OpenAI GPT-4o-mini**
- Données bancaires indexées dans un **VectorStore** (embeddings `text-embedding-3-small`)
- Répond aux questions sur les clients, comptes et opérations en langage naturel
- Widget flottant accessible depuis toutes les pages

### 4.8 Bot Telegram
- Connecté au même moteur RAG que le chatbot web
- Commande `/start` pour l'accueil, puis questions libres en langage naturel

---

## 5. Captures d'écran

### 5.1 Tableau de bord (Dashboard)

Le tableau de bord affiche les statistiques globales de la banque en temps réel : nombre de clients, comptes, opérations et solde total. Deux graphiques permettent de visualiser la répartition des types de comptes (camembert) et l'évolution mensuelle des opérations (barres).

![Tableau de bord — statistiques et graphiques](./screenshots/image-1781559216229.png)

---

### 5.2 Gestion des clients avec audit trail

La liste des clients affiche, pour chaque enregistrement, l'utilisateur qui l'a créé (`Created by`) ainsi que la date de création (`Created at`). Les boutons **Edit** et **Delete** ne sont visibles que pour les utilisateurs ayant le rôle ADMIN.

![Gestion des clients — audit trail et contrôle d'accès](./screenshots/image-1781559268897.png)

---

### 5.3 Création d'un nouveau client

Formulaire de création de client (accessible ADMIN uniquement). Les données saisies sont automatiquement associées à l'utilisateur connecté via Spring Data JPA Auditing.

![Formulaire de création d'un client](./screenshots/image-1781559280084.png)

---

### 5.4 Consultation des opérations d'un compte

Interface de recherche et consultation de l'historique des opérations bancaires d'un compte. La recherche s'effectue par identifiant de compte. Chaque opération affiche l'utilisateur qui l'a réalisée (`Done by`).

![Consultation des opérations bancaires](./screenshots/image-1781559275199.png)

---

### 5.5 Gestion des utilisateurs et des rôles

Page de gestion des utilisateurs (ADMIN uniquement). Affiche tous les comptes avec leurs rôles. Permet de promouvoir un utilisateur au rôle ADMIN ou de le rétrograder.

![Gestion des utilisateurs et des rôles](./screenshots/image-1781559284437.png)

---

### 5.6 Changement de mot de passe

Formulaire sécurisé de changement de mot de passe. Accessible à tous les utilisateurs authentifiés (USER et ADMIN). Requiert la saisie de l'ancien mot de passe pour validation.

![Formulaire de changement de mot de passe](./screenshots/image-1781559293528.png)

---

### 5.7 Chatbot IA (Assistant Bancaire)

Widget de chatbot flottant intégré dans toutes les pages de l'application. Basé sur l'architecture RAG, il répond aux questions sur les clients, comptes et opérations en langage naturel grâce à OpenAI GPT-4o-mini.

![Chatbot IA — Assistant Bancaire](./screenshots/image-1781559297706.png)

---

## 6. Installation et lancement

### Prérequis

- Java 21+
- Maven 3.9+
- Node.js 20+ / npm
- Clé API OpenAI (modèles `gpt-4o-mini` + `text-embedding-3-small`)
- (Optionnel) Token bot Telegram

### 6.1 Backend

```bash
cd backend/digital-banking

# Créer le fichier .env (ne jamais commiter)
# Exemple de contenu :
#   OPENAI_API_KEY=sk-proj-...
#   TELEGRAM_ENABLED=true
#   TELEGRAM_BOT_TOKEN=123456789:ABC...
#   TELEGRAM_BOT_USERNAME=mon_bot

mvn spring-boot:run
```

| Service | URL |
|---------|-----|
| API REST | http://localhost:8085 |
| Swagger UI | http://localhost:8085/swagger-ui.html |
| Console H2 | http://localhost:8085/h2-console |

### 6.2 Frontend

```bash
cd frontend/ebanking-front
npm install
ng serve -o
```

Application disponible sur **http://localhost:4200**

---

## 7. Configuration

### `backend/digital-banking/.env` (ne jamais commiter)

```env
# Clé OpenAI — OBLIGATOIRE
OPENAI_API_KEY=sk-proj-...

# Bot Telegram — optionnel
TELEGRAM_ENABLED=true
TELEGRAM_BOT_TOKEN=<token-fourni-par-BotFather>
TELEGRAM_BOT_USERNAME=<username_bot>
```

> **Important :** Ce fichier est listé dans `.gitignore` et ne doit jamais être poussé sur le dépôt. La clé OpenAI est toujours lue depuis la variable d'environnement `OPENAI_API_KEY`.

---

## 8. Comptes par défaut et gestion des rôles

| Username | Mot de passe | Rôles |
|----------|-------------|-------|
| `admin`  | `12345`     | ADMIN + USER |
| `user1`  | `12345`     | USER |
| `user2`  | `12345`     | USER |

### Matrice des droits

| Fonctionnalité | USER | ADMIN |
|----------------|:----:|:-----:|
| Dashboard analytique | ✅ | ✅ |
| Voir la liste des clients | ✅ | ✅ |
| Créer / Modifier / Supprimer un client | ❌ | ✅ |
| Voir les comptes d'un client | ✅ | ✅ |
| Créer un compte bancaire (Courant / Épargne) | ❌ | ✅ |
| Effectuer des opérations (débit / crédit / virement) | ✅ | ✅ |
| Gestion des utilisateurs et des rôles | ❌ | ✅ |
| Changer son mot de passe | ✅ | ✅ |
| Chatbot IA | ✅ | ✅ |

---

## 9. Endpoints REST

| Méthode | URL | Description | Rôle |
|---------|-----|-------------|------|
| `POST` | `/auth/login` | Authentification → JWT | Public |
| `GET` | `/customers` | Liste des clients | USER+ |
| `POST` | `/customers` | Créer un client | ADMIN |
| `PUT` | `/customers/{id}` | Modifier un client | ADMIN |
| `DELETE` | `/customers/{id}` | Supprimer un client | ADMIN |
| `GET` | `/accounts/customer/{id}` | Comptes d'un client | USER+ |
| `POST` | `/accounts/current` | Créer un compte courant | ADMIN |
| `POST` | `/accounts/saving` | Créer un compte épargne | ADMIN |
| `GET` | `/accounts/{id}/pageOperations` | Historique paginé | USER+ |
| `POST` | `/accounts/debit` | Débiter un compte | USER+ |
| `POST` | `/accounts/credit` | Créditer un compte | USER+ |
| `POST` | `/accounts/transfer` | Virement entre comptes | USER+ |
| `GET` | `/dashboard/stats` | Statistiques globales | USER+ |
| `POST` | `/chatbot/ask` | Question au chatbot IA | USER+ |
| `GET` | `/users` | Liste des utilisateurs | ADMIN |
| `POST` | `/users` | Créer un utilisateur | ADMIN |
| `PUT` | `/users/{username}/roles` | Modifier les rôles | ADMIN |

---

## 10. Chatbot RAG et Bot Telegram

### Architecture RAG

Le chatbot utilise l'architecture **RAG (Retrieval-Augmented Generation)** en quatre étapes :

1. **Indexation** : Au démarrage, `RagIndexingService` indexe tous les clients, comptes et opérations dans un **VectorStore** via les embeddings OpenAI (`text-embedding-3-small`)
2. **Recherche sémantique** : À chaque question, `QuestionAnswerAdvisor` récupère les 4 documents les plus pertinents
3. **Augmentation** : Ces documents sont injectés comme contexte dans le prompt envoyé à `GPT-4o-mini`
4. **Génération** : Le modèle répond **uniquement** à partir des données bancaires réelles indexées

### Exemples de questions

- *"Quel est le solde du client Mohamed ?"*
- *"Quels comptes appartiennent à Imane ?"*
- *"Liste les opérations de débit du mois de mai."*

### Bot Telegram

Le bot Telegram est connecté au même moteur RAG. Après configuration dans `.env` :
- `/start` → message de bienvenue personnalisé
- Toute question en langage naturel → réponse via le moteur RAG

---

## 11. Conclusion

Ce projet a permis de mettre en pratique l'ensemble des concepts abordés dans le cours **Architecture JEE** :

- **Couches applicatives** : séparation claire entre entités, repositories, services et contrôleurs REST
- **Sécurité enterprise** : authentification stateless JWT, contrôle d'accès par rôles côté backend et frontend
- **Traçabilité** : audit trail automatique via Spring Data JPA Auditing
- **Intelligence artificielle** : intégration d'un agent RAG avec Spring AI et OpenAI pour répondre à des questions métier en langage naturel
- **Frontend moderne** : Angular 19 avec routing guards, change detection et graphiques interactifs

L'application constitue un socle complet et extensible, facilement migrable vers une base de données MySQL en production et déployable sur une infrastructure cloud.

---

<div align="center">

*Projet réalisé à l'EMSI — 4DSIM Groupe 1 — Année universitaire 2025-2026*

*Étudiant : Mohamed Mahmoud Sid Mhamed | Professeur : Mohamed Youssfi*

</div>
