const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updateUserXp,
    deleteUser
} = require('../controllers/controller_users');
const {loginUser} = require('../controllers/controller_auth');

router.get('/', getUsers);              // GET /users
router.get('/:id', getUserById);        // GET /users/:id
router.post('/', createUser);           // POST /users
router.patch('/:id', updateUser);         // PATCH /users/:id
router.patch('/:id/xp', updateUserXp);         // PATCH /users/:id/xp
router.delete('/:id', deleteUser);      // DELETE /users/:id
router.post('/login', loginUser);       // POST /users/login

module.exports = router;
