const express = require('express');
const router = express.Router();
const {
  getAllPictures,
  getPictureById,
  addPicture,
  updatePicture,
  deletePicture
} = require('../controllers/controller_picture');
const {requireAuth} = require("../middleware/auth.middleware");

router.use(requireAuth);

/**
 * @swagger
 * /pictures:
 *   get:
 *     summary: Retrieve all pictures
 *     tags: [Picture]
 *     responses:
 *       200:
 *         description: A list of pictures
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', getAllPictures);              // GET /pictures

/**
 * @swagger
 * /pictures/{id}:
 *   get:
 *     summary: Retrieve a picture by ID
 *     tags: [Picture]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single picture
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Picture not found
 */
router.get('/:id', getPictureById);           // GET /pictures/:id

/**
 * @swagger
 * /pictures:
 *   post:
 *     summary: Add a picture
 *     tags: [Picture]
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
 *       201:
 *         description: Picture added
 */
router.post('/', addPicture);                 // POST /pictures

/**
 * @swagger
 * /pictures/{id}:
 *   put:
 *     summary: Update a picture
 *     tags: [Picture]
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
 *         description: Picture updated
 */
router.put('/:id', updatePicture);            // PUT /pictures/:id

/**
 * @swagger
 * /pictures/{id}:
 *   delete:
 *     summary: Delete a picture
 *     tags: [Picture]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Picture deleted
 */
router.delete('/:id', deletePicture);         // DELETE /pictures/:id

module.exports = router;
