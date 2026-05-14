const express = require('express');
const router = express.Router();
const {
  getAllNotations,
  getNotationByIdUser,
  getNotationByIdRecipe,
  addNotation,
  deleteNotation,
  updateNotation,
  getAverageRatingByRecipeId,
  getCommentsByRecipeId
} = require('../controllers/controller_notation');
const {requireAuth, requireRoleOrSameUser, sameUser} = require("../middleware/auth.middleware");

router.use(requireAuth);

/**
 * @swagger
 * /notation:
 *   get:
 *     summary: Retrieve all notations
 *     tags: [Notation]
 *     responses:
 *       200:
 *         description: A list of notations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', getAllNotations);                                                                           // GET /notation

/**
 * @swagger
 * /notation/users/{id_user}:
 *   get:
 *     summary: Retrieve notations by user ID
 *     tags: [Notation]
 *     parameters:
 *       - name: id_user
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of notations for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/users/:id_user', getNotationByIdUser);                                                         // GET /notation/users/:id_user

/**
 * @swagger
 * /notation/recipes/{id_recipe}:
 *   get:
 *     summary: Retrieve notations by recipe ID
 *     tags: [Notation]
 *     parameters:
 *       - name: id_recipe
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of notations for the recipe
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/recipes/:id_recipe', getNotationByIdRecipe);                                                   // GET /notation/recipes/:id_recipe

/**
 * @swagger
 * /notation:
 *   post:
 *     summary: Add a notation
 *     tags: [Notation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_user:
 *                 type: integer
 *               id_recipe:
 *                 type: integer
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notation added
 */
router.post('/', addNotation);                                                                              // POST /notation

/**
 * @swagger
 * /notation/{id}/recipes/{id_recipe}:
 *   delete:
 *     summary: Delete a notation
 *     tags: [Notation]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: id_recipe
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notation deleted
 */
router.delete('/:id/recipes/:id_recipe', requireRoleOrSameUser(1), deleteNotation);                  // DELETE /notation/:id_user/recipes/:id_recipe

/**
 * @swagger
 * /notation/users/{id_user}/recipes{id_recipe}:
 *   put:
 *     summary: Update a notation
 *     tags: [Notation]
 *     parameters:
 *       - name: id_user
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: id_recipe
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
 *         description: Notation updated
 */
router.put('/users/:id_user/recipes/:id_recipe', sameUser, updateNotation);                                 // PUT /notation/:id_user/:id_recipe

/**
 * @swagger
 * /notation/recipes/{id_recipe}/average:
 *   get:
 *     summary: Get average rating for a recipe
 *     tags: [Notation]
 *     parameters:
 *       - name: id_recipe
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Average rating
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/recipes/:id_recipe/average', getAverageRatingByRecipeId);                                      // GET /notation/recipes/:id_recipe/average

/**
 * @swagger
 * /notation/recipes/{id_recipe}/comments:
 *   get:
 *     summary: Get comments for a recipe
 *     tags: [Notation]
 *     parameters:
 *       - name: id_recipe
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/recipes/:id_recipe/comments', getCommentsByRecipeId);                                          // GET /notation/recipes/:id_recipe/comments

module.exports = router;