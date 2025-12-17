const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware pour lire le JSON
app.use(express.json());

// Import des routes
const usersRouter = require('../routes/routes_users');
app.use('/users', usersRouter);

const recipesRouter = require('../routes/routes_recipes');
app.use('/recipes', recipesRouter);

// Route de base
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Users!');
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
