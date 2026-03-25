const express = require('express');
const router = express.Router();
const {
    getFilters,
    getFilterById,
    createFilter,
    deleteFilter
} = require('../controllers/controller_filters');

router.get('/', getFilters);         // GET /filters
router.get('/:id', getFilterById);   // GET /filters/:id
router.post('/', createFilter);      // POST /filters
router.delete('/:id', deleteFilter);          // DELETE /filters/:id

module.exports = router;
