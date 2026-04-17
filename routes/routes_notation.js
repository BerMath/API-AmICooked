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

router.get('/', getAllNotations);                                                                           // GET /notation
router.get('/user/:id_user', getNotationByIdUser);                                                          // GET /notation/user/:id_user
router.get('/recipe/:id_recipe', getNotationByIdRecipe);                                                    // GET /notation/recipe/:id_recipe
router.post('/', addNotation);                                                                              // POST /notation
router.delete('/:id/:id_recipe', requireRoleOrSameUser(1), deleteNotation);                          // DELETE /notation/:id_user/:id_recipe
router.put('/:id_user/:id_recipe', sameUser, updateNotation);                                                         // PUT /notation/:id_user/:id_recipe
router.get('/recipe/:id_recipe/average', getAverageRatingByRecipeId);                                       // GET /notation/recipe/:id_recipe/average
router.get('/recipe/:id_recipe/comments', getCommentsByRecipeId);                                           // GET /notation/recipe/:id_recipe/comments

module.exports = router;