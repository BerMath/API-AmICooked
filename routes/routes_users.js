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

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 */
router.post('/login', loginUser);               // POST /users/login

/**
 * @swagger
 * /users/refresh:
 *   post:
 *     summary: Refresh user token
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post('/refresh', refreshUserToken);      // POST /users/refresh

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout a user
 *     responses:
 *       200:
 *         description: User logged out
 */
router.post('/logout', logoutUser);             // POST /users/logout

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/', createUser);                                                          // POST /users

router.use(requireAuth);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', getUsers);                                                // GET /users

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: User not found
 */
router.get('/:id', getUserById);                                          // GET /users/:id

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated
 */
router.patch('/:id', requireRoleOrSameUser(2), updateUser);        // PATCH /users/:id

/**
 * @swagger
 * /users/{id}/xp:
 *   patch:
 *     summary: Update user XP
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User XP updated
 */
router.patch('/:id/xp', requireRoleOrSameUser(2), updateUserXp);   // PATCH /users/:id/xp

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/:id', requireRoleOrSameUser(2), deleteUser);       // DELETE /users/:id

/**
 * @swagger
 * /users/{id}/picture:
 *   get:
 *     summary: Retrieve profile picture for a user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User profile picture
 */
router.get('/:id/picture', getProfilePicture);      // GET /users/:id/picture

/**
 * @swagger
 * /users/{id}/picture:
 *   post:
 *     summary: Upload profile picture for a user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               img_blob:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Picture uploaded
 */
router.post('/:id/picture', handleProfilePicture);  // POST /users/:id/picture

/**
 * @swagger
 * /users/{id}/promote:
 *   patch:
 *     summary: Promote a user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User promoted
 */
router.patch('/:id/promote', requireAuth, requireRole(2), promoteUser); // PATCH /users/:id/promote

/**
 * @swagger
 * /users/{id}/demote:
 *   patch:
 *     summary: Demote a user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User demoted
 */
router.patch('/:id/demote', requireAuth, requireRole(2), demoteUser); // PATCH /users/:id/demote

module.exports = router;
