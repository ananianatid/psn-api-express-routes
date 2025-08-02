# 🎮 PSN API Express Routes

Une API Express complète pour interagir avec l'API PlayStation Network (PSN) de manière simple et sécurisée.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Endpoints](#-endpoints)
- [Authentification](#-authentification)
- [Exemples d'utilisation](#-exemples-dutilisation)
- [Structure du projet](#-structure-du-projet)
- [Développement](#-développement)
- [Contribuer](#-contribuer)
- [Licence](#-licence)

## ✨ Fonctionnalités

- 🔐 **Authentification sécurisée** avec tokens NPSSO
- 👤 **Gestion des profils utilisateurs** (recherche par nom ou ID)
- 🏆 **Système de trophées complet** (trophées de jeux, groupes, gains)
- 🎮 **Informations de jeux** (récemment joués, bibliothèque)
- 👥 **Gestion des amis** et présence en ligne
- 🔍 **Recherche universelle** d'utilisateurs et de contenu
- 📱 **Gestion des appareils** connectés
- 🌍 **Support multilingue** et régional

## 🔧 Prérequis

- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**
- Un **compte PlayStation Network** avec accès à l'API
- **Token NPSSO** pour l'authentification

## 🚀 Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/psn-api-express-routes.git
   cd psn-api-express-routes
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp .env.example .env
   # Éditer le fichier .env avec vos paramètres
   ```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Configuration du serveur
PORT=3000
NODE_ENV=development

# Configuration PSN
PSN_CLIENT_ID=votre_client_id
PSN_CLIENT_SECRET=votre_client_secret

# Configuration de la base de données (optionnel)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=psn_api
DB_USER=root
DB_PASSWORD=votre_mot_de_passe

# JWT Secret (pour l'authentification)
JWT_SECRET=votre_jwt_secret_super_securise
```

## 🎯 Utilisation

### Démarrage du serveur

**Mode développement :**
```bash
npm run dev
```

**Mode production :**
```bash
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

### Test de l'API

```bash
# Test de la route principale
curl http://localhost:3000/

# Test d'une route utilisateur (avec token NPSSO)
curl -X POST http://localhost:3000/api/users/profile/username/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "votre_username",
    "npsso": "votre_token_npsso"
  }'
```

## 📡 Endpoints

### 🏠 Route principale
- `GET /` - Page d'accueil de l'API

### 👤 Utilisateurs (`/api/users/`)

#### Profils utilisateurs
- `POST /users/profile/username/` - Profil par nom d'utilisateur
- `POST /users/profile/account/` - Profil par ID de compte
- `POST /users/shareable-link` - Lien partageable du profil

#### Informations utilisateur
- `POST /users/friends` - Liste des amis
- `POST /users/presence` - Présence basique
- `POST /users/recently-played` - Jeux récemment joués
- `POST /users/played-games` - Tous les jeux joués
- `POST /users/region/` - Région de l'utilisateur
- `POST /users/devices` - Appareils du compte

### 🏆 Trophées de titres (`/api/trophies/`)

- `POST /trophies/title/` - Trophées d'un titre spécifique
- `POST /trophies/title/groups` - Groupes de trophées d'un titre

### 🎖️ Trophées utilisateur (`/api/users/`)

- `POST /users/trophy-groups/` - Gains de groupes de trophées
- `POST /users/titles` - Titres d'un utilisateur
- `POST /users/trophies/earned` - Trophées gagnés pour un titre
- `POST /users/trophy-summary` - Résumé du profil trophées
- `POST /users/trophies/specific-titles` - Trophées pour des titres spécifiques

### 🔍 Recherche (`/api/search/`)

- `POST /search/universal` - Recherche universelle

## 🔐 Authentification

### Obtenir un token NPSSO

1. **Connectez-vous à votre compte PSN** sur [playstation.com](https://playstation.com)
2. **Ouvrez les outils de développement** (F12)
3. **Allez dans l'onglet Application/Storage**
4. **Recherchez le cookie `npsso`**
5. **Copiez la valeur du token**

### Utilisation du token

Tous les endpoints nécessitent un token NPSSO dans le corps de la requête :

```json
{
  "npsso": "votre_token_npsso",
  "accountId": "me",
  "options": {
    "includeTrophies": true
  }
}
```

## 📝 Exemples d'utilisation

### Récupérer le profil d'un utilisateur

```bash
curl -X POST http://localhost:3000/api/users/profile/username/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ana_tide",
    "options": {
      "includeTrophies": true,
      "includePresence": true
    },
    "npsso": "votre_token_npsso"
  }'
```

### Récupérer les trophées d'un jeu

```bash
curl -X POST http://localhost:3000/api/trophies/title/ \
  -H "Content-Type: application/json" \
  -d '{
    "npCommunicationId": "NPWR20188_00",
    "trophyGroupId": "all",
    "options": {
      "npServiceName": "trophy",
      "limit": 50,
      "offset": 0
    },
    "npsso": "votre_token_npsso"
  }'
```

### Rechercher un utilisateur

```bash
curl -X POST http://localhost:3000/api/search/universal \
  -H "Content-Type: application/json" \
  -d '{
    "searchTerm": "ana_tide",
    "domain": "SocialAllAccounts",
    "npsso": "votre_token_npsso"
  }'
```

### Récupérer les jeux récemment joués

```bash
curl -X POST http://localhost:3000/api/users/recently-played \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "me",
    "options": {
      "limit": 5,
      "offset": 0
    },
    "npsso": "votre_token_npsso"
  }'
```

## 📁 Structure du projet

```
psn-api-express-routes/
├── app.js                          # Point d'entrée de l'application
├── package.json                    # Dépendances et scripts
├── README.md                       # Documentation
├── .env.example                    # Exemple de configuration
├── Insomnia_2025-08-02.yaml       # Collection Insomnia pour les tests
└── src/
    └── routes/
        ├── authentication.js       # Routes d'authentification
        ├── users.js               # Routes utilisateurs
        ├── titleTrophies.js       # Routes trophées de titres
        ├── userTrophies.js        # Routes trophées utilisateur
        └── universalSearch.js     # Routes de recherche
```

## 🛠️ Développement

### Scripts disponibles

```bash
# Démarrage en mode développement
npm run dev

# Démarrage en mode production
npm start

# Tests
npm test
```

### Ajouter une nouvelle route

1. **Créer un nouveau fichier** dans `src/routes/`
2. **Importer les fonctions PSN** nécessaires
3. **Définir les routes** avec validation des paramètres
4. **Ajouter la route** dans `app.js`

Exemple :

```javascript
const express = require('express');
const router = express.Router();
const { getProfileFromUserName, exchangeNpssoForAccessCode, exchangeAccessCodeForAuthTokens } = require('psn-api');

router.post('/nouvelle-route', async (req, res) => {
  try {
    const { npsso, parametres } = req.body;
    
    if (!npsso) {
      return res.status(400).json({ error: "Token NPSSO requis" });
    }

    const accessCode = await exchangeNpssoForAccessCode(npsso);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);
    
    // Votre logique ici
    
    res.status(200).json({ message: "Succès", data: resultat });
  } catch (error) {
    res.status(500).json({ error: "Erreur", details: error.message });
  }
});

module.exports = router;
```

## 🧪 Tests

### Avec Insomnia

1. **Importer la collection** `Insomnia_2025-08-02.yaml`
2. **Configurer l'environnement** avec votre token NPSSO
3. **Tester les endpoints** individuellement

### Avec curl

```bash
# Test de la route principale
curl http://localhost:3000/

# Test avec authentification
curl -X POST http://localhost:3000/api/users/profile/username/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","npsso":"votre_token"}'
```

## 🤝 Contribuer

1. **Fork le projet**
2. **Créer une branche** (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commiter les changements** (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. **Pousser vers la branche** (`git push origin feature/nouvelle-fonctionnalite`)
5. **Créer une Pull Request**

### Guidelines

- **Documenter** toutes les nouvelles routes
- **Ajouter des tests** pour les nouvelles fonctionnalités
- **Suivre les conventions** de nommage existantes
- **Valider les paramètres** d'entrée

## 📄 Licence

Ce projet est sous licence ISC. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

### Problèmes courants

**Erreur 401 - Non autorisé**
- Vérifiez que votre token NPSSO est valide
- Assurez-vous que le token n'a pas expiré

**Erreur 400 - Paramètres manquants**
- Vérifiez que tous les paramètres requis sont fournis
- Consultez la documentation des endpoints

**Erreur 500 - Erreur serveur**
- Vérifiez les logs du serveur
- Assurez-vous que l'API PSN est accessible

### Ressources utiles

- [Documentation PSN API](https://github.com/tustin/psn-api)
- [PlayStation Network](https://playstation.com)
- [Node.js Documentation](https://nodejs.org/docs)

---

**Développé avec ❤️ pour la communauté PlayStation**

*N'oubliez pas de remplacer `votre_token_npsso` par votre véritable token NPSSO dans tous les exemples.*
