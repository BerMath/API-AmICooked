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

router.get('/', getAllPictures);              // GET /pictures
router.get('/:id', getPictureById);           // GET /pictures/:id
router.post('/', addPicture);                 // POST /pictures
router.put('/:id', updatePicture);            // PUT /pictures/:id
router.delete('/:id', deletePicture);         // DELETE /pictures/:id

module.exports = router;
