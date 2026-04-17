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
const {
    getRecipeFilterByRecipeId,
    createRecipeFilter,
    deleteRecipeFilter
} = require('../controllers/controller_recipe_filters');
const {getRecipePicture, handleRecipePicture} = require("../controllers/controller_picture");
const {requireAuth, requireRoleOrSameUser} = require("../middleware/auth.middleware");

router.use(requireAuth);

router.get('/', getRecipes);                                                // GET /recipes
router.get('/:id', getRecipeById);                                          // GET /recipes/:id
router.post('/', createRecipe);                                             // POST /recipes
router.post('/:id/time', timeRecipe);                                       // POST /recipes/:id/time
router.put('/:id', updateRecipe);                                           // PUT /recipes/:id
router.delete('/:id', deleteRecipe);                                        // DELETE /recipes/:id

router.get('/:id/filters', getRecipeFilterByRecipeId)                       // GET /recipes/:id/filters
router.post('/:id/filters', createRecipeFilter);                            // POST /recipes/:id/filters
router.delete('/:id_recipe/filters/:id_filter', deleteRecipeFilter);        // DELETE /recipes/:id_recipe/filters/:id_filter

router.get('/:id/picture', getRecipePicture);                               // GET /recipes/:id/picture
router.post('/:id/picture', handleRecipePicture);                           // POST /recipes/:id/picture

module.exports = router;