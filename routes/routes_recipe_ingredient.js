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

/**
 * @swagger
 * /recipe_ingredient:
 *   get:
 *     summary: Retrieve all recipe ingredients
 *     tags: [Recipe Ingredient]
 *     responses:
 *       200:
 *         description: A list of recipe ingredients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', getAllRecipeIngredients);                        // GET /recipe-ingredients

/**
 * @swagger
 * /recipe_ingredient/recipes/{id_recipe}:
 *   get:
 *     summary: Retrieve recipe ingredients by recipe ID
 *     tags: [Recipe Ingredient]
 *     parameters:
 *       - name: id_recipe
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of ingredients for the recipe
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/recipes/:id_recipe', getRecipeIngredientsByRecipeId); // GET /recipe-ingredients/recipes/:id_recipe

/**
 * @swagger
 * /recipe_ingredient/ingredients/{id_ingredient}:
 *   get:
 *     summary: Retrieve recipe ingredients by ingredient ID
 *     tags: [Recipe Ingredient]
 *     parameters:
 *       - name: id_ingredient
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of recipes using the ingredient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/ingredients/:id_ingredient', getRecipeIngredientsByIngredientId); // GET /recipe-ingredients/ingredients/:id_ingredient

/**
 * @swagger
 * /recipe_ingredient:
 *   post:
 *     summary: Add a recipe ingredient
 *     tags: [Recipe Ingredient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_recipe:
 *                 type: integer
 *               id_ingredient:
 *                 type: integer
 *               quantity:
 *                 type: string
 *     responses:
 *       201:
 *         description: Recipe ingredient added
 */
router.post('/', addRecipeIngredient);                                        // POST /recipe-ingredients

/**
 * @swagger
 * /recipe_ingredient/recipes/{id_recipe}/ingredients/{id_ingredient}:
 *   delete:
 *     summary: Delete a recipe ingredient
 *     tags: [Recipe Ingredient]
 *     parameters:
 *       - name: id_recipe
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: id_ingredient
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recipe ingredient deleted
 */
router.delete('/recipes/:id_recipe/ingredients/:id_ingredient', deleteRecipeIngredient);          // DELETE /recipe-ingredients/recipes/:id_recipe/ingredients/:id_ingredient

/**
 * @swagger
 * /recipe_ingredient/recipes/{id_recipe}/ingredients/{id_ingredient}:
 *   put:
 *     summary: Update a recipe ingredient
 *     tags: [Recipe Ingredient]
 *     parameters:
 *       - name: id_recipe
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: id_ingredient
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Recipe ingredient updated
 */
router.put('/recipes/:id_recipe/ingredients/:id_ingredient', updateRecipeIngredient);             // PUT /recipe-ingredients/recipes/:id_recipe/ingredients/:id_ingredient

module.exports = router;