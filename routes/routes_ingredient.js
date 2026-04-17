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

router.get('/', getAllIngredients);                        // GET /ingredients
router.get('/:id', getIngredientById);                     // GET /ingredients/:id
router.get('/name/:name', getIngredientByName);           // GET /ingredients/name/:name
router.get('/category/:category', getIngredientByCategory); // GET /ingredients/category/:category
router.post('/', createIngredient);                        // POST /ingredients
router.delete('/:id', deleteIngredient);                  // DELETE /ingredients/:id
router.put('/:id', updateIngredient);                     // PUT /ingredients/:id

module.exports = router;
