const express = require('express');
const router = express.Router();
const {
  getAllNotations,
  getNotationByUserAndRecipe,
  createNotation,
  deleteNotation,
  updateNotation,
  getAverageRatingByRecipeId,
  getCommentsByRecipeId
} = require('../controllers/controller_notation');

router.get('/', getAllNotations); // GET /notations
router.get('/user/:id_user/recipe/:id_recipe', getNotationByUserAndRecipe); // GET /notations/user/:id_user/recipe/:id_recipe
router.post('/', createNotation); // POST /notations
router.delete('/user/:id_user/recipe/:id_recipe', deleteNotation); // DELETE /notations/user/:id_user/recipe/:id_recipe
router.put('/user/:id_user/recipe/:id_recipe', updateNotation); // PUT /notations/user/:id_user/recipe/:id_recipe
router.get('/recipe/:id_recipe/average', getAverageRatingByRecipeId); // GET /notations/recipe/:id_recipe/average
router.get('/recipe/:id_recipe/comments', getCommentsByRecipeId); // GET /notations/recipe/:id_recipe/comments

module.exports = router;