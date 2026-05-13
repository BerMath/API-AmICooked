const express = require('express');
const router = express.Router();
const {
  getAllFavorites,
  getFavoritesByUserId,
  addFavorite,
  deleteFavorite
} = require('../controllers/controller_favory');
const {requireAuth} = require("../middleware/auth.middleware");

router.use(requireAuth);

/**
 * @swagger
 * /favory:
 *   get:
 *     summary: Retrieve all favorites
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: A list of favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', getAllFavorites);                        // GET /favorites

/**
 * @swagger
 * /favory/user/{id_user}:
 *   get:
 *     summary: Retrieve favorites by user ID
 *     tags: [Favorites]
 *     parameters:
 *       - name: id_user
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of favorites for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/user/:id_user', getFavoritesByUserId);      // GET /favorites/user/:id_user

/**
 * @swagger
 * /favory:
 *   post:
 *     summary: Add a favorite
 *     tags: [Favorites]
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
 *     responses:
 *       201:
 *         description: Favorite added
 */
router.post('/', addFavorite);                           // POST /favorites

/**
 * @swagger
 * /favory/{id_user}/{id_recipe}:
 *   delete:
 *     summary: Delete a favorite
 *     tags: [Favorites]
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
 *     responses:
 *       200:
 *         description: Favorite deleted
 */
router.delete('/:id_user/:id_recipe', deleteFavorite);   // DELETE /favorites/:id_user/:id_recipe

module.exports = router;
