 const express = require('express');
  const router = express.Router();
  const {
    getRecipes,
    getRecipeById,
    createRecipe,
    timeRecipe,
    updateRecipe,
    deleteRecipe
  } = require('../controllers/controller_recipes');

  router.get('/', getRecipes);         // GET /recipes
  router.get('/:id', getRecipeById);   // GET /recipes/:id
  router.post('/', createRecipe);      // POST /recipes
  router.post('/:id/time', timeRecipe); // POST /recipes/:id/time
  router.put('/:id', updateRecipe);    // PUT /recipes/:id
  router.delete('/:id', deleteRecipe); // DELETE /recipes/:id


  module.exports = router; 