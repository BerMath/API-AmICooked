const { promisePool: db } = require('../config/database');

// Récupérer toutes les images
const getAllPictures = async (req, res) => {
  try {
    const [pictures] = await db.query('SELECT * FROM Picture');
    res.json(pictures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Récupérer une image par id
const getPictureById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [pictures] = await db.query('SELECT * FROM Picture WHERE id = ?', [id]);

    if (pictures.length === 0) {
      return res.status(404).json({ message: 'Picture not found' });
    }
    res.json(pictures[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Récupérer les images par type (recipe, step, profile)
const getPicturesByType = async (req, res) => {
  try {
    const type = req.params.type;
    const [pictures] = await db.query('SELECT * FROM Picture WHERE type = ?', [type]);

    if (pictures.length === 0) {
      return res.status(404).json({ message: 'No pictures found for this type' });
    }
    res.json(pictures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Ajouter une image
const addPicture = async (req, res) => {
  try {
    const { url, type, alt_text } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const [result] = await db.query(
      'INSERT INTO Picture (url, type, alt_text) VALUES (?, ?, ?)',
      [url, type || null, alt_text || null]
    );

    res.status(201).json({ message: 'Picture added successfully', id: result.insertId, url, type, alt_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Modifier une image
const updatePicture = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { url, type, alt_text } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const [result] = await db.query(
      'UPDATE Picture SET url = ?, type = ?, alt_text = ? WHERE id = ?',
      [url, type || null, alt_text || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Picture not found' });
    }
    res.json({ message: 'Picture updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Supprimer une image
const deletePicture = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [result] = await db.query('DELETE FROM Picture WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Picture not found' });
    }
    res.json({ message: 'Picture deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllPictures,
  getPictureById,
  getPicturesByType,
  addPicture,
  updatePicture,
  deletePicture
};

