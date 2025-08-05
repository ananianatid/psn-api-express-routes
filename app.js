// Import du module Express
const express = require('express');

// Import des routes
const usersRoutes = require('./src/routes/users');
const titleTrophiesRoutes = require('./src/routes/titleTrophies');
const userTrophiesRoutes = require('./src/routes/userTrophies');
const universalSearchRoutes = require('./src/routes/universalSearch');

// Création d'une instance d'application Express
const app = express()

// Définition du port d'écoute (compatible cPanel)
const port = process.env.PORT || 3000;

// Middleware pour parser les requêtes avec un corps en JSON
app.use(express.json());

// Définition de la route principale (index)
app.get('/', (req, res) => {
  res.status(200).json({ message: "🚀 Bienvenue sur psn-api express routes !" });
});

// Utilisation des routes utilisateurs
app.use('/api', usersRoutes);

// Utilisation des routes de trophées de titre
app.use('/api', titleTrophiesRoutes);

// Utilisation des routes de trophées utilisateur
app.use('/api', userTrophiesRoutes);

// Utilisation des routes de recherche universelle
app.use('/api', universalSearchRoutes);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`✅ Serveur démarré et à l'écoute sur http://localhost:${port}`);
});
