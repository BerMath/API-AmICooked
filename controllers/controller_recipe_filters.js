const {pool: db} = require('../config/database');

const getRecipeFilterByRecipeId = async (req, res) => {
    try {
        const recipeId = parseInt(req.params.id);
        if (Number.isNaN(recipeId)) {
            return res.status(400).json({message: 'Invalid recipe id'});
        }

        const result = await db.query(`SELECT *
                                                FROM recipe_filtres
                                                WHERE id_recipe = $1`, [recipeId]);
        const recipeFilters = result.rows;
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
        const {id_filter} = req.body;
        const id_recipe = parseInt(req.params.id);
        if (Number.isNaN(id_recipe) || !id_filter) {
            return res.status(400).json({message: 'Recipe id or filter id missing'});
        }

        const query = 'INSERT INTO recipe_filtres(id_recipe, id_filter) VALUES ($1, $2) RETURNING id_recipe, id_filter';
        const result = await db.query(query, [id_recipe, id_filter]);

        if (!result.rows.length) {
            return res.status(404).json({message: 'No filters found for this recipe'});
        }

        const newRecipeFilter = result.rows[0];

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
        const result = await db.query(`DELETE
                                         FROM recipe_filtres
                                         WHERE id_recipe = $1
                                           AND id_filter = $2`, [id_recipe, id_filter]);

        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Recipe filter Not Found'});
        }

        return res.status(204).send({message: 'Recipe filter Deleted'});
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