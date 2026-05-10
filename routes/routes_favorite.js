const express = require('express');
const router = express.Router();
const {
    getAllFavorites,
    getFavoritesByUserId,
    addFavorite,
    deleteFavorite,
    getIfUserHasRecipeAsFavorite
} = require('../controllers/controller_favorite');
const {requireAuth} = require("../middleware/auth.middleware");

router.use(requireAuth);

router.get('/', getAllFavorites);                                   // GET /favorites
router.get('/user/:id_user', getFavoritesByUserId);                 // GET /favorites/user/:id_user
router.post('/', addFavorite);                                      // POST /favorites
router.delete('/:id_user/:id_recipe', deleteFavorite);              // DELETE /favorites/:id_user/:id_recipe
router.get('/:id_recipe/:id_user', getIfUserHasRecipeAsFavorite);   // GET /favorites/:id_recipe/:id_user

module.exports = router;
