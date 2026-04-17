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

router.get('/', getFilters);                                           // GET /filters
router.get('/:id', getFilterById);                                     // GET /filters/:id
router.post('/', requireRole(1), createFilter);                 // POST /filters
router.delete('/:id', requireRole(1), deleteFilter);            // DELETE /filters/:id

module.exports = router;
