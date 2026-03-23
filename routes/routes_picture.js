const express = require('express');
const router = express.Router();
const multerUploadConf = require('../uploads/upload');
const {
  getAllPictures,
  getPictureById,
  getPicturesByType,
  addPicture,
  updatePicture,
  deletePicture,
  uploadProfilPicture
} = require('../controllers/controller_picture');

router.get('/', getAllPictures);
router.get('/:id', getPictureById);
router.get('/type/:type', getPicturesByType);
router.post('/', addPicture);
router.put('/:id', updatePicture);
router.delete('/:id', deletePicture);

// router.use('/upload/profile/:userId', (req, res) => {
//   console.log('files:', req.files);
//   console.log('body:', req.body);
//   res.json({ files: req.files, body: req.body });
// });

// router.post('/upload/profile/:userId', multerUploadConf.any(), (req, res) => {
//   console.log('files:', req.files);
//   console.log('body:', req.body);
//   res.json({ files: req.files, body: req.body });
// });

router.post('/upload/profile/:userId', multerUploadConf.single("avatar"), uploadProfilPicture);

module.exports = router;
