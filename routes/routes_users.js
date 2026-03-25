const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/controller_users');
const {loginUser} = require('../controllers/controller_auth');

router.get('/', getUsers);              // GET /users
router.get('/:id', getUserById);        // GET /users/:id
router.post('/', createUser);           // POST /users
router.put('/:id', updateUser);         // PUT /users/:id
router.delete('/:id', deleteUser);      // DELETE /users/:id
router.post('/login', loginUser);       // POST /users/login

module.exports = router;
