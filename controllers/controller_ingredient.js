const { pool: db } = require('../config/database');

// Récupérer tous les ingrédients
const getAllIngredients = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM ingredient');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getIngredientById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await db.query('SELECT * FROM ingredient WHERE id = $1', [id]);
    const ingredients = result.rows;

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
    const result = await db.query('SELECT * FROM ingredient WHERE name = $1', [name]);
    const ingredients = result.rows;

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
    const result = await db.query('SELECT * FROM ingredient WHERE category = $1', [category]);
    const ingredients = result.rows;

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

    const result = await db.query(
      'INSERT INTO ingredient (name, category) VALUES ($1, $2) RETURNING id',
      [name, category || null]
    );

    res.status(201).json({ message: 'Ingredient created', id: result.rows[0].id, name, category });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(409).json({ message: 'This ingredient already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const deleteIngredient = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await db.query('DELETE FROM ingredient WHERE id = $1', [id]);

    if (result.rowCount === 0) {
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

    const result = await db.query(
      'UPDATE ingredient SET name = $1, category = $2 WHERE id = $3',
      [name, category || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    res.json({ message: 'Ingredient updated successfully', id, name, category });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
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