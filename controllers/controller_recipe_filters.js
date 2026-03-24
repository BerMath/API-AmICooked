const {promisePool: db} = require('../config/database');

const getRecipeFilterByRecipeId = async (req, res) => {
    try {
        const recipeId = parseInt(req.params.id);
        if (Number.isNaN(recipeId)) {
            return res.status(400).json({message: 'Invalid recipe id'});
        }

        const [recipeFilters] = await db.query(`SELECT *
                                                FROM RecipeFiltres
                                                WHERE id_recipe = ?`, [recipeId]);
        if (recipeFilters.length === 0) {
            return res.status(404).json({message: 'No filters found for this recipe'});
        }
        res.json(recipeFilters);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

const createRecipeFilter = async (req, res) => {
    try {
        const id_filter = req.body;
        const id_recipe = parseInt(req.params.id);
        if (!id_recipe || !id_filter) {
            return res.status(400).json({message: 'Recipe id not found'});
        }

        const query = 'INSERT INTO RecipeFiltres(id_recipes, id_filters) VALUES (?,?)';
        const [result] = await db.query(query, [id_recipe, id_filter]);

        const newRecipeFilter = {
            id_recipe: id_recipe,
            id_filter: id_filter,
        };

        res.status(201).json(newRecipeFilter);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

const deleteRecipeFilter = async (req, res) => {
    try {
        const id_recipe = parseInt(req.params.id_recipe);
        const id_filter = parseInt(req.params.id_filter);
        const [result] = await db.query(`DELETE
                                         FROM RecipeFiltres
                                         WHERE id_recipe = ?
                                           AND id_filter = ?`, [id_recipe, id_filter]);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'Recipe filter Not Found'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

module.exports = {
    getRecipeFilterByRecipeId,
    createRecipeFilter,
    deleteRecipeFilter,
}