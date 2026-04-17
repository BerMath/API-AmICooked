const express = require('express');
const router = express.Router();
const {
    getAllRecipeIngredients,
    getRecipeIngredientsByRecipeId,
    getRecipeIngredientsByIngredientId,
    addRecipeIngredient,
    deleteRecipeIngredient,
    updateRecipeIngredient
} = require('../controllers/controller_recipe_ingredient');
const {requireAuth} = require("../middleware/auth.middleware");

router.use(requireAuth);

router.get('/', getAllRecipeIngredients);                        // GET /recipe-ingredients
router.get('/recipe/:id_recipe', getRecipeIngredientsByRecipeId); // GET /recipe-ingredients/recipe/:id_recipe
router.get('/ingredient/:id_ingredient', getRecipeIngredientsByIngredientId); // GET /recipe-ingredients/ingredient/:id_ingredient
router.post('/', addRecipeIngredient);                                        // POST /recipe-ingredients
router.delete('/:id_recipe/:id_ingredient', deleteRecipeIngredient);          // DELETE /recipe-ingredients/:id_recipe/:id_ingredient
router.put('/:id_recipe/:id_ingredient', updateRecipeIngredient);             // PUT /recipe-ingredients/:id_recipe/:id_ingredient

module.exports = router;