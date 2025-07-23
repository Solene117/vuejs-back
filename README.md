# VueJS Backend

Un serveur backend en Node.js/TypeScript pour gérer les produits, commandes, utilisateurs et autres entités.

## Prérequis

- Node.js (v14.x ou plus récent)
- npm ou yarn
- Base de données (selon la configuration dans `src/config/db.ts`)

## Installation

1. Cloner ce dépôt :
```
git clone <url-du-dépôt>
cd vuejs-back
```

2. Installer les dépendances :
```
npm install
```

## Configuration

1. Vérifier la configuration de la base de données dans `src/config/db.ts`
2. Variables d'environnement nécessaires:
    - PORT => Port d'éxecution de l'application
    - MONGO_URI => URL base de données MongoDB
    - JWT_SECRET => Passphrase pour JWT

## Démarrage du serveur

### Mode développement
```
npm run dev
```

### Mode production
```
npm run build
npm start
```

## Structure du projet

- `src/config/` - Fichiers de configuration
- `src/controllers/` - Contrôleurs pour gérer la logique métier
- `src/middleware/` - Middleware pour l'authentification et autres fonctionnalités
- `src/models/` - Modèles de données
- `src/routes/` - Routes API
- `src/server.ts` - Point d'entrée du serveur

## API Endpoints

L'application expose les API suivantes :

- `/api/users` - Gestion des utilisateurs
- `/api/products` - Gestion des produits
- `/api/orders` - Gestion des commandes
- `/api/categories` - Gestion des catégories
- `/api/units` - Gestion des unités
- `/api/currencies` - Gestion des devises
- `/api/billing-frequency` - Gestion des fréquences de facturation

## Authentification

L'application utilise un système d'authentification via middleware. Voir `src/middleware/auth.ts` pour plus de détails.