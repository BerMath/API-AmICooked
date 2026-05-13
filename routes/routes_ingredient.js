const express = require('express');
const router = express.Router();
const {
  getAllIngredients,
  getIngredientById,
  getIngredientByName,
  getIngredientByCategory,
  createIngredient,
  deleteIngredient,
  updateIngredient
} = require('../controllers/controller_ingredient');
const {requireAuth} = require("../middleware/auth.middleware");

router.use(requireAuth);

/**
 * @swagger
 * /ingredient:
 *   get:
 *     summary: Retrieve all ingredients
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: A list of ingredients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', getAllIngredients);                        // GET /ingredients

/**
 * @swagger
 * /ingredient/{id}:
 *   get:
 *     summary: Retrieve an ingredient by ID
 *     tags: [Ingredients]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single ingredient
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Ingredient not found
 */
router.get('/:id', getIngredientById);                     // GET /ingredients/:id

/**
 * @swagger
 * /ingredient/name/{name}:
 *   get:
 *     summary: Retrieve ingredients by name
 *     tags: [Ingredients]
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of ingredients matching the name
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/name/:name', getIngredientByName);           // GET /ingredients/name/:name

/**
 * @swagger
 * /ingredient/category/{category}:
 *   get:
 *     summary: Retrieve ingredients by category
 *     tags: [Ingredients]
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of ingredients in the category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/category/:category', getIngredientByCategory); // GET /ingredients/category/:category

/**
 * @swagger
 * /ingredient:
 *   post:
 *     summary: Create a new ingredient
 *     tags: [Ingredients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ingredient created
 */
router.post('/', createIngredient);                        // POST /ingredients

/**
 * @swagger
 * /ingredient/{id}:
 *   delete:
 *     summary: Delete an ingredient
 *     tags: [Ingredients]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ingredient deleted
 */
router.delete('/:id', deleteIngredient);                  // DELETE /ingredients/:id

/**
 * @swagger
 * /ingredient/{id}:
 *   put:
 *     summary: Update an ingredient
 *     tags: [Ingredients]
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
 *         description: Ingredient updated
 */
router.put('/:id', updateIngredient);                     // PUT /ingredients/:id

module.exports = router;
