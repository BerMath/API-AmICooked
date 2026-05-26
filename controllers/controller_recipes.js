const {promisePool: db} = require('../config/database');

const getRecipes = async (req, res) => {
    try {
        let [recipes] = await db.query('SELECT * FROM Recipe');

        await Promise.all(recipes.map(async (recipe) => {
            recipe.recipe_picture = "";
            const [recipePicture] = await db.query(
                'SELECT * FROM Picture INNER JOIN RecipePicture ON Picture.id = RecipePicture.id_picture WHERE RecipePicture.id_recipe = ?',
                [recipe.id]
            );
            if (recipePicture[0] !== undefined) {
                recipe.recipe_picture = recipePicture[0];
            }
        }));

        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

const getRecipeById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [recipes] = await db.query('SELECT * FROM Recipe WHERE id = ?', [id]);

        if (recipes.length === 0) {
            return res.status(404).json({message: 'Recipe not found'});
        }

        const recipe = recipes[0];
        recipe.recipe_picture = "";

        const [recipePicture] = await db.query(
            'SELECT Picture.img_blob FROM Picture INNER JOIN RecipePicture ON Picture.id = RecipePicture.id_picture WHERE RecipePicture.id_recipe = ?',
            [recipe.id]
        );

        if (recipePicture[0] !== undefined) {
            recipe.recipe_picture = recipePicture[0].img_blob;
        }

        res.json(recipe);
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
            INSERT INTO Recipe
            (name, description, cooking_time, preparation_time, difficulty, XP_winnable, id_picture, id_user)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            name,
            description || null,
            cooking_time || null,
            preparation_time || null,
            difficulty || null,
            XP_winnable ?? 100,
            id_picture || null,
            id_user || null,
        ]);

        const newRecipe = {
            id: result.insertId,
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

        const [result] = await db.query('UPDATE Recipe SET time = ? WHERE id = ?', [time, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'Recipe not found'});
        }

        const [recipes] = await db.query('SELECT * FROM Recipe WHERE id = ?', [id]);
        res.json(recipes[0]);
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

        const query = `
            UPDATE Recipe
            SET name             = ?,
                description      = ?,
                cooking_time     = ?,
                preparation_time = ?,
                difficulty       = ?,
                XP_winnable      = ?,
                id_picture       = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [
            name,
            description || null,
            cooking_time || null,
            preparation_time || null,
            difficulty || null,
            XP_winnable ?? 100,
            id_picture || null,
            id,
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'Recipe not found'});
        }

        const [recipes] = await db.query('SELECT * FROM Recipe WHERE id = ?', [id]);
        res.json(recipes[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

const deleteRecipe = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [result] = await db.query('DELETE FROM Recipe WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
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

        const [result] = await db.query('SELECT * FROM Recipe WHERE id_user = ?', [userId]);
        res.status(200).json(result);
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