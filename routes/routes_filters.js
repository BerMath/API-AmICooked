const express = require('express');
const router = express.Router();
const {
    getFilters,
    getFilterById,
    createFilter,
    deleteFilter
} = require('../controllers/controller_filters');
const {requireAuth, requireRole} = require("../middleware/auth.middleware");

router.use(requireAuth);

/**
 * @swagger
 * /filters:
 *   get:
 *     summary: Retrieve all filters
 *     tags: [Filters]
 *     responses:
 *       200:
 *         description: A list of filters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', getFilters);                                           // GET /filters

/**
 * @swagger
 * /filters/{id}:
 *   get:
 *     summary: Retrieve a filter by ID
 *     tags: [Filters]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single filter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Filter not found
 */
router.get('/:id', getFilterById);                                     // GET /filters/:id

/**
 * @swagger
 * /filters:
 *   post:
 *     summary: Create a new filter
 *     tags: [Filters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Filter created
 */
router.post('/', requireRole(1), createFilter);                 // POST /filters

/**
 * @swagger
 * /filters/{id}:
 *   delete:
 *     summary: Delete a filter
 *     tags: [Filters]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filter deleted
 */
router.delete('/:id', requireRole(1), deleteFilter);            // DELETE /filters/:id

module.exports = router;
