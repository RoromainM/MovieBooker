# MovieBooker

MovieBooker est une application de réservation de films développée avec Nest.js, Next.js et Prisma. Cette application permet aux utilisateurs de réserver des créneaux horaires pour regarder des films, avec une interface moderne et une expérience utilisateur fluide.

## Accès à l'application

- **API Backend** : [https://movie-booker-vkil.onrender.com/api](https://movie-booker-vkil.onrender.com/api)
- **Frontend** : [https://roro-moviebooking.netlify.app/](https://roro-moviebooking.netlify.app/)

## Fonctionnalités

- 🎬 Consultation des films à l'affiche via l'API TMDB
- 👤 Authentification des utilisateurs (inscription/connexion)
- 📅 Réservation de créneaux horaires pour les films
- 🚫 Vérification des conflits de réservation
- 📱 Interface responsive
- 🔒 Sécurité avec JWT

## Stack Technique

### Backend
- Nest.js
- Prisma ORM
- PostgreSQL
- Jest (Tests)
- Swagger (Documentation API)

### Frontend
- Next.js 13
- Tailwind CSS
- TypeScript
- Axios

## Prérequis

- Node.js (v14+)
- npm ou yarn
- PostgreSQL
- Clé API TMDB

## Installation

1. Cloner le projet
```bash
git clone <repository-url>
cd MovieBooker
```

2. Installation des dépendances (Backend)
```bash
cd back
npm install
```

3. Installation des dépendances (Frontend)
```bash
cd front
npm install
```

4. Configuration des variables d'environnement

Backend (.env):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/moviebooker"
JWT_SECRET="votre-secret-jwt"
TMDB_API_KEY="votre-clé-api-tmdb"
```

Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_TMDB_API_KEY="votre-clé-api-tmdb"
```

5. Initialisation de la base de données
```bash
cd back
npx prisma migrate dev
```

## Lancement

1. Backend
```bash
cd back
npm run start:dev
```

2. Frontend
```bash
cd front
npm run dev
```

## Tests

### Backend
```bash
cd back
npm run test
```

### Frontend
```bash
cd front
npm run test
```

## Structure du Projet

```
MovieBooker/
├── back/                 # Backend Nest.js
│   ├── src/
│   │   ├── auth/        # Authentication
│   │   ├── movies/      # Films
│   │   ├── reservation/ # Réservations
│   │   └── user/        # Utilisateurs
│   └── prisma/          # Schéma base de données
└── front/               # Frontend Next.js
    ├── app/            # Pages et routing
    ├── components/     # Composants React
    └── services/       # Services API
```

## Fonctionnalités Principales

### Gestion des Films
- Liste des films à l'affiche
- Détails des films
- Recherche de films

### Réservations
- Création de réservation
- Vérification des disponibilités
- Gestion des conflits horaires
- Historique des réservations

### Authentification
- Inscription
- Connexion
- Protection des routes
- Gestion des tokens JWT

## Licence

MIT License
