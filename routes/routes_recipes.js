const express = require('express');
const router = express.Router();
const {
    getRecipes,
    getRecipeById,
    createRecipe,
    timeRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeByUserId
} = require('../controllers/controller_recipes');
const {
    getRecipeFilterByRecipeId,
    createRecipeFilter,
    deleteRecipeFilter
} = require('../controllers/controller_recipe_filters');
const {getRecipePicture, handleRecipePicture} = require("../controllers/controller_picture");
const {requireAuth} = require("../middleware/auth.middleware");

router.use(requireAuth);

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Retrieve all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: A list of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', getRecipes);                                                // GET /recipes

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Retrieve a recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single recipe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Recipe not found
 */
router.get('/:id', getRecipeById);                                          // GET /recipes/:id

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               cooking_time:
 *                 type: integer
 *               preparation_time:
 *                 type: integer
 *               difficulty:
 *                 type: string
 *               XP_winnable:
 *                 type: integer
 *               id_picture:
 *                 type: integer
 *               id_user:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Recipe created
 */
router.post('/', createRecipe);                                             // POST /recipes

/**
 * @swagger
 * /recipes/{id}/time:
 *   post:
 *     summary: Time a recipe
 *     tags: [Recipes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recipe timed
 */
router.post('/:id/time', timeRecipe);                                       // POST /recipes/:id/time

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: Update a recipe
 *     tags: [Recipes]
 *     parameters:
 *       - name: id
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
 *         description: Recipe updated
 */
router.put('/:id', updateRecipe);                                           // PUT /recipes/:id

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     tags: [Recipes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recipe deleted
 */
router.delete('/:id', deleteRecipe);                                        // DELETE /recipes/:id

/**
 * @swagger
 * /recipes/user/{id}:
 *   get:
 *     summary: Retrieve recipes by user ID
 *     tags: [Recipes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of recipes by user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/user/:id', getRecipeByUserId);                                 // GET /recipes/user/:id

/**
 * @swagger
 * /recipes/{id}/filters:
 *   get:
 *     summary: Retrieve filters for a recipe
 *     tags: [Recipes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of filters for the recipe
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/:id/filters', getRecipeFilterByRecipeId)                       // GET /recipes/:id/filters

/**
 * @swagger
 * /recipes/{id}/filters:
 *   post:
 *     summary: Add a filter to a recipe
 *     tags: [Recipes]
 *     parameters:
 *       - name: id
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
 *       201:
 *         description: Filter added to recipe
 */
router.post('/:id/filters', createRecipeFilter);                            // POST /recipes/:id/filters

/**
 * @swagger
 * /recipes/{id_recipe}/filters/{id_filter}:
 *   delete:
 *     summary: Remove a filter from a recipe
 *     tags: [Recipes]
 *     parameters:
 *       - name: id_recipe
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: id_filter
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filter removed from recipe
 */
router.delete('/:id_recipe/filters/:id_filter', deleteRecipeFilter);        // DELETE /recipes/:id_recipe/filters/:id_filter

/**
 * @swagger
 * /recipes/{id}/picture:
 *   get:
 *     summary: Retrieve picture for a recipe
 *     tags: [Recipes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recipe picture
 */
router.get('/:id/picture', getRecipePicture);                               // GET /recipes/:id/picture

/**
 * @swagger
 * /recipes/{id}/picture:
 *   post:
 *     summary: Upload picture for a recipe
 *     tags: [Recipes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               img_blob:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Picture uploaded
 */
router.post('/:id/picture', handleRecipePicture);                           // POST /recipes/:id/picture

module.exports = router;