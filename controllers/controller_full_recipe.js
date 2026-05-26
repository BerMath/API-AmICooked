const updateFullRecipe = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const id = parseInt(req.params.id);
        const {
            name,
            description,
            cooking_time,
            preparation_time,
            difficulty,
            XP_winnable,
            id_picture,
            ingredients,
        } = req.body;

        if (!name) {
            return res.status(400).json({message: 'A name is required'});
        }

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({message: 'At least one ingredient is required'});
        }

        const ingredientNames = ingredients.map(i => i.name?.trim().toLowerCase());
        const uniqueNames = new Set(ingredientNames);
        if (uniqueNames.size !== ingredientNames.length) {
            return res.status(400).json({message: 'Duplicate ingredients in request'});
        }

        for (const ingredient of ingredients) {
            if (!ingredient.name?.trim()) {
                return res.status(400).json({message: 'Each ingredient must have a name'});
            }
            if (ingredient.quantity !== undefined && (isNaN(ingredient.quantity) || ingredient.quantity <= 0)) {
                return res.status(400).json({
                    message: `Invalid quantity for ingredient "${ingredient.name}" (must be a positive number)`,
                });
            }
        }

        const [[existingRecipe]] = await connection.query(
            'SELECT id FROM Recipe WHERE id = ?',
            [id]
        );

        if (!existingRecipe) {
            return res.status(404).json({message: 'Recipe not found'});
        }

        await connection.query(
            `UPDATE Recipe
             SET name = ?,
                 description = ?,
                 cooking_time = ?,
                 preparation_time = ?,
                 difficulty       = ?,
                 XP_winnable      = ?,
                 id_picture       = ?
             WHERE id = ?`,
            [
                name,
                description || null,
                cooking_time || null,
                preparation_time || null,
                difficulty || null,
                XP_winnable ?? 100,
                id_picture || null,
                id,
            ]
        );

        await connection.query(
            'DELETE FROM RecipeIngredient WHERE id_recipe = ?',
            [id]
        );

        const linkedIngredients = [];

        for (const ingredient of ingredients) {
            const ingName = ingredient.name.trim();
            const category = ingredient.category || null;
            const quantity = ingredient.quantity || null;
            const unit = ingredient.unit || null;

            const [[existing]] = await connection.query(
                'SELECT id, name, category FROM Ingredient WHERE name = ?',
                [ingName]
            );

            let id_ingredient;

            if (existing) {
                id_ingredient = existing.id;
            } else {
                const [ingResult] = await connection.query(
                    'INSERT INTO Ingredient (name, category) VALUES (?, ?)',
                    [ingName, category]
                );
                id_ingredient = ingResult.insertId;
            }

            await connection.query(
                'INSERT INTO RecipeIngredient (id_recipe, id_ingredient, quantity, unit) VALUES (?, ?, ?, ?)',
                [id, id_ingredient, quantity, unit]
            );

            linkedIngredients.push({id_ingredient, name: ingName, category, quantity, unit});
        }

        await connection.commit();

        res.json({
            id,
            name,
            description: description || null,
            cooking_time: cooking_time || null,
            preparation_time: preparation_time || null,
            difficulty: difficulty || null,
            XP_winnable: XP_winnable ?? 100,
            id_picture: id_picture || null,
            ingredients: linkedIngredients,
        });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    } finally {
        connection.release();
    }
};
const createFullRecipe = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const {
            name,
            description,
            cooking_time,
            preparation_time,
            difficulty,
            XP_winnable,
            id_picture,
            id_user,
            ingredients,
        } = req.body;

        if (!name) {
            return res.status(400).json({message: 'A name is required'});
        }

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({message: 'At least one ingredient is required'});
        }

        const ingredientNames = ingredients.map(i => i.name?.trim().toLowerCase());
        const uniqueNames = new Set(ingredientNames);
        if (uniqueNames.size !== ingredientNames.length) {
            return res.status(400).json({message: 'Duplicate ingredients in request'});
        }

        for (const ingredient of ingredients) {
            if (!ingredient.name?.trim()) {
                return res.status(400).json({message: 'Each ingredient must have a name'});
            }
            if (ingredient.quantity !== undefined && (isNaN(ingredient.quantity) || ingredient.quantity <= 0)) {
                return res.status(400).json({
                    message: `Invalid quantity for ingredient "${ingredient.name}" (must be a positive number)`,
                });
            }
        }

        const recipeQuery = `
            INSERT INTO Recipe
            (name, description, cooking_time, preparation_time, difficulty, XP_winnable, id_picture, id_user)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [recipeResult] = await connection.query(recipeQuery, [
            name,
            description || null,
            cooking_time || null,
            preparation_time || null,
            difficulty || null,
            XP_winnable ?? 100,
            id_picture || null,
            id_user || null,
        ]);

        const id_recipe = recipeResult.insertId;

        const linkedIngredients = [];

        for (const ingredient of ingredients) {
            const ingName = ingredient.name.trim();
            const category = ingredient.category || null;
            const quantity = ingredient.quantity || null;
            const unit = ingredient.unit || null;

            const [[existing]] = await connection.query(
                'SELECT id, name, category FROM Ingredient WHERE name = ?',
                [ingName]
            );

            let id_ingredient;

            if (existing) {
                id_ingredient = existing.id;
            } else {
                const [ingResult] = await connection.query(
                    'INSERT INTO Ingredient (name, category) VALUES (?, ?)',
                    [ingName, category]
                );
                id_ingredient = ingResult.insertId;
            }

            await connection.query(
                'INSERT INTO RecipeIngredient (id_recipe, id_ingredient, quantity, unit) VALUES (?, ?, ?, ?)',
                [id_recipe, id_ingredient, quantity, unit]
            );

            linkedIngredients.push({
                id_ingredient,
                name: ingName,
                category,
                quantity,
                unit,
            });
        }

        await connection.commit();

        res.status(201).json({
            id: id_recipe,
            name,
            description: description || null,
            cooking_time: cooking_time || null,
            preparation_time: preparation_time || null,
            difficulty: difficulty || null,
            XP_winnable: XP_winnable ?? 100,
            id_picture: id_picture || null,
            id_user: id_user || null,
            ingredients: linkedIngredients,
        });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    } finally {
        connection.release();
    }
};

module.exports = {
    createFullRecipe,
    updateFullRecipe
}