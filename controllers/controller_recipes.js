const {pool: db} = require('../config/database');

const getRecipes = async (req, res) => {
    try {
        let recipes = await db.query('SELECT * FROM recipe');

        await Promise.all(recipes.map(async (recipe) => {
            recipe.recipe_picture = "";
            recipe.ingredients = []
            const recipePicture = await db.query(
                'SELECT * FROM picture INNER JOIN recipe_picture ON picture.id = recipe_picture.id_picture WHERE recipe_picture.id_recipe = $1',
                [recipe.id]
            );
            if (recipePicture[0] !== undefined) {
                recipe.recipe_picture = recipePicture[0];
            }
            const recipeIngredients = await db.query(
                'SELECT ingredient.id, ingredient.name, recipe_ingredient.quantity, recipe_ingredient.unit FROM ingredient INNER JOIN RecipeIngredient ON Ingredient.id = RecipeIngredient.id_ingredient');
            if (recipeIngredients.length > 0) {
                recipe.ingredients = recipeIngredients.rows;
            }
        }));

        res.json(recipes.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

const getRecipeById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.query('SELECT * FROM recipe WHERE id = $1', [id]);
        const recipes = result.rows;

        if (recipes.length === 0) {
            return res.status(404).json({message: 'Recipe not found'});
        }

        const recipe = recipes[0];
        recipe.recipe_picture = "";
        recipe.ingredients = []

        const [recipePicture] = await db.query(
            'SELECT picture.img_blob FROM picture INNER JOIN recipe_picture ON picture.id = recipe_picture.id_picture WHERE recipe_picture.id_recipe = $1',
            [recipe.id]
        );

        if (recipePicture[0] !== undefined) {
            recipe.recipe_picture = recipePicture[0].img_blob;
        }

        const [recipeIngredients] = await db.query(
            'SELECT Ingredient.id, Ingredient.name, RecipeIngredient.quantity, RecipeIngredient.unit FROM Ingredient INNER JOIN RecipeIngredient ON Ingredient.id = RecipeIngredient.id_ingredient');
        if (recipeIngredients.length > 0) {
            recipe.ingredients = recipeIngredients;
        }

        res.json(recipe[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};
const createRecipe = async (req, res) => {
    try {
        const {
            name,
            description,
            cooking_time,
            preparation_time,
            difficulty,
            XP_winnable,
            id_picture,
            id_user,
        } = req.body;

        if (!name) {
            return res.status(400).json({message: 'A name is required'});
        }

        const query = `
            INSERT INTO recipe
            (name, description, cooking_time, preparation_time, difficulty, XP_winnable, id_picture, id_user)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
        `;

        const result = await db.query(query, [
            name,
            description || null,
            cooking_time || null,
            preparation_time || null,
            difficulty || null,
            XP_winnable ?? 100,
            id_picture || null,
            id_user,
        ]);

        const newRecipe = {
            id: result.rows[0].id,
            name,
            description: description || null,
            cooking_time: cooking_time || null,
            preparation_time: preparation_time || null,
            difficulty: difficulty || null,
            XP_winnable: XP_winnable ?? 100,
            id_picture: id_picture || null,
            id_user: id_user || null,
        };

        res.status(201).json(newRecipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

const timeRecipe = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const {time} = req.body;

        if (!time) {
            return res.status(400).json({message: 'Time is required'});
        }

        const result = await db.query('UPDATE recipe SET time = $1 WHERE id = $2', [time, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Recipe not found'});
        }

        const result2 = await db.query('SELECT * FROM recipe WHERE id = $1', [id]);
        const recipe = result2.rows[0];
        recipe.ingredients = JSON.parse(recipe.ingredients);

        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

const updateRecipe = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const {
            name,
            description,
            cooking_time,
            preparation_time,
            difficulty,
            XP_winnable,
            id_picture,
        } = req.body;

        if (!name) {
            return res.status(400).json({message: 'A name is required'});
        }

        const query = 'UPDATE recipe SET name = $1, description = $2, cooking_time = $3, preparation_time = $4, difficulty =$5, XP_winnable = $6, id_picture= $7 WHERE id = $8';
        const result = await db.query(query, [name,
            description || null,
            cooking_time || null,
            preparation_time || null,
            difficulty || null,
            XP_winnable ?? 100,
            id_picture || null,
            id,]);

        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Recipe not found'});
        }

        const result2 = await db.query('SELECT * FROM recipe WHERE id = $1', [id]);
        const recipe = result2.rows[0];

        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

const deleteRecipe = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.query('DELETE FROM recipe WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Recipe not found'});
        }

        res.status(204).send(); // 204 = No Content
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

const getRecipeByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (!userId) {
            return res.status(400).json({message: 'User id is required'});
        }
        const query = 'SELECT * FROM recipe WHERE id_user = $1';
        const result = await db.query(query, [userId]);

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};


module.exports = {
    getRecipes,
    getRecipeById,
    createRecipe,
    timeRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeByUserId
};