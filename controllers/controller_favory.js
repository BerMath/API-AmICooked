const { promisePool : db } = require('../config/database');


const getAllFavorites = async (req, res) => {
  try {
    const [favorites] = await db.query('SELECT * FROM Favory');
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getFavoritesByUserId = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);
    const [favorites] = await db.query('SELECT * FROM Favory WHERE id_user = ?', [id_user]);

    if (favorites.length === 0) {
      return res.status(404).json({ message: 'No favorites found for this user' });
    }
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const addFavorite = async (req, res) => {
  try {
    const { id_user, id_recipe } = req.body;

    if (!id_user || !id_recipe) {
      return res.status(400).json({ message: 'id_user and id_recipe are required' });
    }

    await db.query('INSERT INTO Favory (id_user, id_recipe) VALUES (?, ?)', [id_user, id_recipe]);
    res.status(201).json({ message: 'Favorite added successfully', id_user, id_recipe });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This recipe is already in favorites' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const deleteFavorite = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);
    const id_recipe = parseInt(req.params.id_recipe);

    const [result] = await db.query('DELETE FROM Favory WHERE id_user = ? AND id_recipe = ?', [id_user, id_recipe]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    res.json({ message: 'Favorite deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllFavorites,
  getFavoritesByUserId,
  addFavorite,
  deleteFavorite
};