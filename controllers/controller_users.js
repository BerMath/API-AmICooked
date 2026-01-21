const { promisePool:  db } = require('../config/database');

// Récupérer tous les utilisateurs
const getUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM Users');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer un utilisateur par id
const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [users] = await db. query('SELECT * FROM Users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Créer un utilisateur
const createUser = async (req, res) => {
  try {
    const { id, username, email, XP, LVL, created_at, updated_at, password } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'Le nom est requis' });
    }
    
    const query = 'INSERT INTO Users (id, username, email, created_at, updated_at, password) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [id,username, email, created_at || null, updated_at || null, password]);
    
    const newUser = {
      id: result.insertId,
      username: username,
      email:  email,
      created_at: created_at,
      updated_at: updated_at || null,
      password: password,
    };
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    
    // Gérer les erreurs de duplicata d'email
    if (error. code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Cet email existe déjà' });
    }
    
    res.status(500).json({ message: 'Erreur serveur', error:  error.message });
  }
};

// Modifier un utilisateur
const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { username, email, password } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'Le nom est requis' });
    }
    
    const query = 'UPDATE Users SET username = ?, email = ?, password = ? WHERE id = ?';
    const [result] = await db.query(query, [username, email, password || null, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Récupérer l'utilisateur mis à jour
    const [users] = await db. query('SELECT * FROM Users WHERE id = ?', [id]);
    res.json(users[0]);
  } catch (error) {
    console.error(error);
    
    // Gérer les erreurs de duplicata d'email
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Cet email existe déjà' });
    }
    
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [result] = await db.query('DELETE FROM Users WHERE id = ? ', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.status(204).send(); // 204 = No Content
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
};