const express = require('express');
const app = express();
require('dotenv').config();
const { testConnection } = require('./config/database');

// Middleware
app. use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const recipesRoutes = require('./routes/routes_recipes');
const usersRoutes = require('./routes/routes_users');

app.use('/recipes', recipesRoutes);
app.use('/users', usersRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'API AmICooked fonctionne! ',
    endpoints: {
      recipes: '/recipes',
      users: '/users'
    }
  });
});

// Démarrer le serveur seulement après connexion à MySQL
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Impossible de démarrer le serveur:', error);
    process.exit(1);
  }
};

startServer();