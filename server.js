const express = require('express');
const app = express();
require('dotenv').config();
const { testConnection } = require('./config/database');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const recipesRoutes = require('./routes/routes_recipes');
const usersRoutes = require('./routes/routes_users');
const filterRoutes = require('./routes/routes_filters');

app.use('/users', usersRoutes);
app.use('/recipes', recipesRoutes);
app.use('/filters', filterRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the Am I Cooked? API!',
    endpoints: {
      recipes: '/recipes',
      users: '/users',
      ingredients: '/ingredients',
      pictures: '/pictures',
      filters: '/filters'
    }
  });
});

// Démarrer le serveur seulement après connexion à MySQL
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
    process.exit(1);
  }
};

startServer();