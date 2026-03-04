const { promisePool } = require('../config/database');

const getAllRecipeIngredients = async (req, res) => {
  try {
    const [recipeIngredients] = await promisePool.query('SELECT * FROM RecipeIngredient');
    res.json(recipeIngredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getRecipeIngredientsByRecipeId = async (req, res) => {
  try {
    const id_recipe = parseInt(req.params.id_recipe);
    const [recipeIngredients] = await promisePool.query('SELECT * FROM RecipeIngredient WHERE id_recipe = ?', [id_recipe]);

    if (recipeIngredients.length === 0) {
      return res.status(404).json({ message: 'No ingredients found for this recipe' });
    }
    res.json(recipeIngredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getRecipeIngredientsByIngredientId = async (req, res) => {
    try {
        const id_ingredient = parseInt(req.params.id_ingredient);
        const [recipeIngredients] = await promisePool.query('SELECT * FROM RecipeIngredient WHERE id_ingredient = ?', [id_ingredient]);

        if (recipeIngredients.length === 0) {
            return res.status(404).json({ message: 'No recipes found for this ingredient' });
        }
        res.json(recipeIngredients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addRecipeIngredient = async (req, res) => {
    try {
        const { id_recipe, id_ingredient, quantity, unit } = req.body;

        if (!id_recipe || !id_ingredient) {
            return res.status(400).json({ message: 'id_recipe and id_ingredient are required' });
        }

        await promisePool.query('INSERT INTO RecipeIngredient (id_recipe, id_ingredient, quantity, unit) VALUES (?, ?, ?, ?)', [id_recipe, id_ingredient, quantity || null, unit || null]);
        res.status(201).json({ message: 'Recipe ingredient added successfully', id_recipe, id_ingredient, quantity, unit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteRecipeIngredient = async (req, res) => {
    try {
        const id_recipe = parseInt(req.params.id_recipe);
        const id_ingredient = parseInt(req.params.id_ingredient);

        const [result] = await promisePool.query('DELETE FROM RecipeIngredient WHERE id_recipe = ? AND id_ingredient = ?', [id_recipe, id_ingredient]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe ingredient not found' });
        }
        res.json({ message: 'Recipe ingredient deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateRecipeIngredient = async (req, res) => {
    try {
        const id_recipe = parseInt(req.params.id_recipe);
        const id_ingredient = parseInt(req.params.id_ingredient);
        const { new_id_recipe, new_id_ingredient } = req.body;

        if (!new_id_recipe || !new_id_ingredient) {
            return res.status(400).json({ message: 'new_id_recipe and new_id_ingredient are required' });
        }

        const [result] = await promisePool.query('UPDATE RecipeIngredient SET id_recipe = ?, id_ingredient = ? WHERE id_recipe = ? AND id_ingredient = ?', [new_id_recipe, new_id_ingredient, id_recipe, id_ingredient]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe ingredient not found' });
        }
        res.json({ message: 'Recipe ingredient updated successfully', new_id_recipe, new_id_ingredient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllRecipeIngredients,
    getRecipeIngredientsByRecipeId,
    getRecipeIngredientsByIngredientId,
    addRecipeIngredient,
    deleteRecipeIngredient,
    updateRecipeIngredient
};