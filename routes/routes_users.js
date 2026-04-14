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
const {loginUser, refreshUserToken, logoutUser} = require('../controllers/controller_auth');
const {getProfilePicture, createProfilePicture} = require("../controllers/controller_picture");

router.post('/login', loginUser);               // POST /users/login
router.post('/refresh', refreshUserToken);      // POST /users/refresh
router.post('/logout', logoutUser);             // POST /users/logout

router.get('/', getUsers);                      // GET /users
router.get('/:id', getUserById);                // GET /users/:id
router.post('/', createUser);                   // POST /users
router.patch('/:id', updateUser);               // PATCH /users/:id
router.patch('/:id/xp', updateUserXp);          // PATCH /users/:id/xp
router.delete('/:id', deleteUser);              // DELETE /users/:id

router.get('/:id/picture', getProfilePicture);      // GET /users/:id/picture
router.post('/:id/picture', createProfilePicture);  // POST /users/:id/picture

module.exports = router;
