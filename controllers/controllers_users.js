// Données en mémoire (remplace par une DB plus tard)
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// Récupérer tous les utilisateurs
const getUsers = (req, res) => {
  res.json(users);
};

// Récupérer un utilisateur par id
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  res.json(user);
};

// Créer un utilisateur
const createUser = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Le nom est requis' });

  const newUser = { id: users.length + 1, name };
  users.push(newUser);
  res.status(201).json(newUser);
};

// Modifier un utilisateur
const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Le nom est requis' });

  user.name = name;
  res.json(user);
};

// Supprimer un utilisateur
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ message: 'Utilisateur non trouvé' });

  users.splice(index, 1);
  res.status(204).send(); // 204 = No Content
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
