const { promisePool:  db } = require('../config/database');

// Récupérer toutes les recettes
const getRecipes = async (req, res) => {
  try {
    const [recipes] = await db.query('SELECT * FROM recipes');
    
    // Parser les ingredients JSON
    const formattedRecipes = recipes.map(recipe => ({
      ... recipe,
      ingredients: JSON. parse(recipe.ingredients)
    }));
    
    res.json(formattedRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer une recette par id
const getRecipeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [recipes] = await db.query('SELECT * FROM recipes WHERE id = ?', [id]);
    
    if (recipes.length === 0) {
      return res.status(404).json({ message: 'Recette non trouvée' });
    }
    
    const recipe = recipes[0];
    recipe.ingredients = JSON.parse(recipe.ingredients);
    
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Créer une recette
const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    // Vérifier que ingredients est un tableau
    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'Les ingrédients doivent être un tableau' });
    }
    
    const query = 'INSERT INTO recipes (title, ingredients, instructions) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [title, JSON.stringify(ingredients), instructions]);
    
    const newRecipe = {
      id:  result.insertId,
      title,
      ingredients,
      instructions
    };
    
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Ajouter du temps de préparation à une recette
const timeRecipe = async (req, res) => {
  try {
    const id = parseInt(req.params. id);
    const { time } = req.body;
    
    if (!time) {
      return res.status(400).json({ message: 'Le temps est requis' });
    }
    
    const [result] = await db.query('UPDATE recipes SET time = ? WHERE id = ?', [time, id]);
    
    if (result. affectedRows === 0) {
      return res.status(404).json({ message: 'Recette non trouvée' });
    }
    
    // Récupérer la recette mise à jour
    const [recipes] = await db.query('SELECT * FROM recipes WHERE id = ?', [id]);
    const recipe = recipes[0];
    recipe.ingredients = JSON.parse(recipe.ingredients);
    
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Modifier une recette
const updateRecipe = async (req, res) => {
  try {
    const id = parseInt(req.params. id);
    const { title, ingredients, instructions } = req.body;
    
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'Les ingrédients doivent être un tableau' });
    }
    
    const query = 'UPDATE recipes SET title = ?, ingredients = ?, instructions = ? WHERE id = ?';
    const [result] = await db.query(query, [title, JSON.stringify(ingredients), instructions, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Recette non trouvée' });
    }
    
    // Récupérer la recette mise à jour
    const [recipes] = await db.query('SELECT * FROM recipes WHERE id = ?', [id]);
    const recipe = recipes[0];
    recipe. ingredients = JSON.parse(recipe. ingredients);
    
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une recette
const deleteRecipe = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [result] = await db.query('DELETE FROM recipes WHERE id = ? ', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Recette non trouvée' });
    }
    
    res.status(204).send(); // 204 = No Content
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
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