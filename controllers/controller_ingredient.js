const { promisePool } = require('../config/database');

// Récupérer tous les ingrédients
const getAllIngredients = async (req, res) => {
  try {
    const [ingredients] = await promisePool.query('SELECT * FROM Ingredient');
    res.json(ingredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getIngredientById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [ingredients] = await promisePool.query('SELECT * FROM Ingredient WHERE id = ?', [id]);

    if (ingredients.length === 0) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    res.json(ingredients[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getIngredientByName = async (req, res) => {
  try {
    const name = req.params.name;
    const [ingredients] = await promisePool.query('SELECT * FROM Ingredient WHERE name = ?', [name]);

    if (ingredients.length === 0) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    res.json(ingredients[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getIngredientByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const [ingredients] = await promisePool.query('SELECT * FROM Ingredient WHERE category = ?', [category]);

    if (ingredients.length === 0) {
      return res.status(404).json({ message: 'No ingredients found for this category' });
    }
    res.json(ingredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Créer un ingrédient
const createIngredient = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const [result] = await promisePool.query(
      'INSERT INTO Ingredient (name, category) VALUES (?, ?)',
      [name, category || null]
    );

    res.status(201).json({ message: 'Ingredient created', id: result.insertId, name, category });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This ingredient already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const deleteIngredient = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [result] = await promisePool.query('DELETE FROM Ingredient WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    res.json({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateIngredient = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, category } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const [result] = await promisePool.query(
      'UPDATE Ingredient SET name = ?, category = ? WHERE id = ?',
      [name, category || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    res.json({ message: 'Ingredient updated successfully', id, name, category });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This ingredient already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllIngredients,
  getIngredientById,
  getIngredientByName,
  getIngredientByCategory,
  createIngredient,
  deleteIngredient,
  updateIngredient
};