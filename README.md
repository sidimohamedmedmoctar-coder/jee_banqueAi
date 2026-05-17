# Banque AI — Projet JEE

Projet de gestion bancaire full-stack basé sur Java EE (Spring Boot) pour le backend et Angular pour le frontend, avec intégration d'intelligence artificielle.

## Architecture

```
banque-ai/
├── backend/      # API REST — Spring Boot (Java EE)
├── frontend/     # Application web — Angular
└── docs/         # Documentation technique et fonctionnelle
```

| Couche          | Technologie           | Rôle                                      |
|-----------------|-----------------------|-------------------------------------------|
| Backend         | Spring Boot 3 / JPA   | API REST, logique métier, base de données |
| Frontend        | Angular               | Interface utilisateur                     |
| Base de données | PostgreSQL / MySQL    | Persistance des données                   |
| IA              | API externe / modèle  | Analyse et recommandations bancaires      |

## Comment lancer le projet

### Prérequis

- Java 17+
- Node.js 18+ et npm
- Maven 3.8+
- PostgreSQL (ou MySQL)

### Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

L'API sera disponible sur `http://localhost:8080`.

### Frontend (Angular)

```bash
cd frontend
npm install
ng serve
```

L'application sera disponible sur `http://localhost:4200`.

### Variables d'environnement

Copier le fichier `.env.example` en `.env` à la racine du `backend/` et renseigner les valeurs :

```
DB_URL=jdbc:postgresql://localhost:5432/banque_ai
DB_USERNAME=postgres
DB_PASSWORD=secret
```
