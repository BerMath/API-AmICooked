const { promisePool: db } = require('../config/database');


const getAllNotations = async (req, res) => {
  try {
    const [notations] = await db.query('SELECT * FROM Notation');
    res.json(notations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getNotationByIdUser = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);
    const [notations] = await db.query('SELECT * FROM Notation WHERE id_user = ?', [id_user]);

    if (notations.length === 0) {
      return res.status(404).json({ message: 'No notations found for this user' });
    }
    res.json(notations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getNotationByIdRecipe = async (req, res) => {
  try {
    const id_recipe = parseInt(req.params.id_recipe);
    const [notations] = await db.query('SELECT * FROM Notation WHERE id_recipe = ?', [id_recipe]);

    if (notations.length === 0) {
      return res.status(404).json({ message: 'No notations found for this recipe' });
    }
    res.json(notations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const addNotation = async (req, res) => {
  try {
    const { id_user, id_recipe, rating, comment } = req.body;

    if (!id_user || !id_recipe || !rating) {
      return res.status(400).json({ message: 'id_user, id_recipe and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    await db.query(
      'INSERT INTO Notation (id_user, id_recipe, rating, comment) VALUES (?, ?, ?, ?)',
      [id_user, id_recipe, rating, comment || null]
    );
    res.status(201).json({ message: 'Notation added successfully', id_user, id_recipe, rating, comment });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This user has already rated this recipe' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const deleteNotation = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);
    const id_recipe = parseInt(req.params.id_recipe);

    const [result] = await db.query('DELETE FROM Notation WHERE id_user = ? AND id_recipe = ?', [id_user, id_recipe]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notation not found' });
    }
    res.json({ message: 'Notation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const updateNotation = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);
    const id_recipe = parseInt(req.params.id_recipe);
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const [result] = await db.query(
      'UPDATE Notation SET rating = ?, comment = ?, updated_at = NOW() WHERE id_user = ? AND id_recipe = ?',
      [rating, comment || null, id_user, id_recipe]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notation not found' });
    }
    res.json({ message: 'Notation updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getAverageRatingByRecipeId = async (req, res) => {
  try {
    const id_recipe = parseInt(req.params.id_recipe);
    const [result] = await db.query('SELECT AVG(rating) AS average_rating FROM Notation WHERE id_recipe = ?', [id_recipe]);

    if (result.length === 0 || result[0].average_rating === null) {
      return res.status(404).json({ message: 'No ratings found for this recipe' });
    }
    res.json({ average_rating: parseFloat(result[0].average_rating).toFixed(1) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getCommentsByRecipeId = async (req, res) => {
  try {
    const id_recipe = parseInt(req.params.id_recipe);
    const [comments] = await db.query(
      'SELECT id_user, comment, rating, created_at FROM Notation WHERE id_recipe = ? AND comment IS NOT NULL',
      [id_recipe]
    );

    if (comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this recipe' });
    }
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllNotations,
  getNotationByIdUser,
  getNotationByIdRecipe,
  addNotation,
  deleteNotation,
  updateNotation,
  getAverageRatingByRecipeId,
  getCommentsByRecipeId
};