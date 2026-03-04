const express = require('express');
const router = express.Router();
const {
  getAllPictures,
  getPictureById,
  getPicturesByType,
  addPicture,
  updatePicture,
  deletePicture
} = require('../controllers/controller_picture');

router.get('/', getAllPictures);              // GET /pictures
router.get('/:id', getPictureById);           // GET /pictures/:id
router.get('/type/:type', getPicturesByType); // GET /pictures/type/:type
router.post('/', addPicture);                 // POST /pictures
router.put('/:id', updatePicture);            // PUT /pictures/:id
router.delete('/:id', deletePicture);         // DELETE /pictures/:id

module.exports = router;
