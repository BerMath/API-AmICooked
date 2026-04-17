const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updateUserXp,
    deleteUser, promoteUser, demoteUser
} = require('../controllers/controller_users');
const {loginUser, refreshUserToken, logoutUser} = require('../controllers/controller_auth');
const {getProfilePicture, handleProfilePicture} = require("../controllers/controller_picture");
const {requireAuth, requireRole, requireRoleOrSameUser} = require('../middleware/auth.middleware');

router.post('/login', loginUser);               // POST /users/login
router.post('/refresh', refreshUserToken);      // POST /users/refresh
router.post('/logout', logoutUser);             // POST /users/logout

router.post('/', createUser);                                                          // POST /users

router.use(requireAuth);
router.get('/', getUsers);                                                // GET /users
router.get('/:id', getUserById);                                          // GET /users/:id
router.patch('/:id', requireRoleOrSameUser(2), updateUser);        // PATCH /users/:id
router.patch('/:id/xp', requireRoleOrSameUser(2), updateUserXp);   // PATCH /users/:id/xp
router.delete('/:id', requireRoleOrSameUser(2), deleteUser);       // DELETE /users/:id

router.get('/:id/picture', getProfilePicture);      // GET /users/:id/picture
router.post('/:id/picture', handleProfilePicture);  // POST /users/:id/picture

router.patch('/:id/promote', requireAuth, requireRole(2), promoteUser); // PATCH /users/:id/promote
router.patch('/:id/demote', requireAuth, requireRole(2), demoteUser); // PATCH /users/:id/promote

module.exports = router;
