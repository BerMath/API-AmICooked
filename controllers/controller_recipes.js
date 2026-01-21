const { promisePool:  db } = require('../config/database');

// Récupérer toutes les Recipes
const getRecipes = async (req, res) => {
  try {
    const [recipes] = await db.query('SELECT * FROM Recipe');
    
    /*// Parser les ingredients JSON
    const formattedRecipes = recipes.map(recipe => ({
      ... recipe,
      ingredients: JSON.parse(recipe.ingredients)
    }));*/
    
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Récupérer une Recipe par id
const getRecipeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [recipes] = await db.query('SELECT * FROM Recipe WHERE id = ?', [id]);
    
    if (recipes.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const recipe = recipes[0];
    recipe.ingredients = JSON.parse(recipe.ingredients);
    
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Créer une Recipe
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
      created_at,
      updated_at
    } = req.body;

    // Vérifications
    if (!name) {
      return res.status(400).json({ message: 'A name is required' });
    }

    // Requête INSERT
    const query = `
      INSERT INTO Recipe 
      (name, description, cooking_time, preparation_time, difficulty, XP_winnable, id_picture, id_user, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      name,
      description || null,
      cooking_time || null,
      preparation_time || null,
      difficulty || null,
      XP_winnable || null,
      id_picture || null,
      id_user || null,
      created_at || null,
      updated_at || null
    ]);

    // Construire l'objet renvoyé
    const newRecipe = {
      id: result.insertId,
      name,
      description: description || null,
      cooking_time: cooking_time || null,
      preparation_time: preparation_time || null,
      difficulty: difficulty || null,
      XP_winnable: XP_winnable || null,
      id_picture: id_picture || null,
      id_user: id_user || null,
    };

    res.status(201).json(newRecipe);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Ajouter du temps de préparation à une Recipe
const timeRecipe = async (req, res) => {
  try {
    const id = parseInt(req.params. id);
    const { time } = req.body;
    
    if (!time) {
      return res.status(400).json({ message: 'Time is required' });
    }
    
    const [result] = await db.query('UPDATE Recipe SET time = ? WHERE id = ?', [time, id]);
    
    if (result. affectedRows === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Récupérer la Recipe mise à jour
    const [recipes] = await db.query('SELECT * FROM Recipe WHERE id = ?', [id]);
    const recipe = recipes[0];
    recipe.ingredients = JSON.parse(recipe.ingredients);
    
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Modifier une Recipe
const updateRecipe = async (req, res) => {
  try {
    const id = parseInt(req.params. id);
    const { title, ingredients, instructions } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const query = 'UPDATE Recipe SET title = ?, ingredients = ?, instructions = ? WHERE id = ?';
    const [result] = await db.query(query, [title, JSON.stringify(ingredients), instructions, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Récupérer la Recipe mise à jour
    const [recipes] = await db.query('SELECT * FROM Recipe WHERE id = ?', [id]);
    const recipe = recipes[0];
    recipe. ingredients = JSON.parse(recipe. ingredients);
    
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Supprimer une Recipe
const deleteRecipe = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [result] = await db.query('DELETE FROM Recipe WHERE id = ? ', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.status(204).send(); // 204 = No Content
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module. exports = { 
  getRecipes, 
  getRecipeById, 
  createRecipe, 
  timeRecipe, 
  updateRecipe, 
  deleteRecipe 
};