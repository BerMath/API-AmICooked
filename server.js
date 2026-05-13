const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const multer = require('multer');
require('dotenv').config();
const { testConnection } = require('./config/database');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuration: store files in memory, accept single file with key "img_blob"
const upload = multer({ storage: multer.memoryStorage() });

// Routes
const recipesRoutes = require('./routes/routes_recipes');
const usersRoutes = require('./routes/routes_users');
const filterRoutes = require('./routes/routes_filters');
const favoryRoutes = require('./routes/routes_favory');
const ingredientRoutes = require('./routes/routes_ingredient');
const recipeIngredientRoutes = require('./routes/routes_recipe_ingredient');
const notationRoutes = require('./routes/routes_notation');
const pictureRoutes = require('./routes/routes_picture');

app.use('/users', upload.single('img_blob'), usersRoutes);
app.use('/recipes', upload.single('img_blob'), recipesRoutes);
app.use('/filters', filterRoutes);
app.use('/favory', favoryRoutes);
app.use('/ingredient', ingredientRoutes);
app.use('/recipe_ingredient', recipeIngredientRoutes);
app.use('/notation', notationRoutes);
app.use('/pictures', upload.single('img_blob'), pictureRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the Am I Cooked? API!',
    endpoints: {
      recipes: '/recipes',
      users: '/users',
      ingredient: '/ingredient',
      pictures: '/pictures',
      filters: '/filters',
      favory: '/favory',
      recipe_ingredient: '/recipe_ingredient',
      notation: '/notation'
    }
  });
});

// Start the server only when the connexion to the MySQL db is successful
const PORT = process.env.PORT || 3000;

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Am I Cooked ? API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: 'http://localhost:' + PORT,
      },
    ],
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


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