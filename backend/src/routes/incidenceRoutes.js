const express = require('express');
const router = express.Router();
const {
  createIncidence,
  getNearbyIncidences,
  getAllIncidences,
} = require('../controllers/incidenceController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getAllIncidences);
router.get('/nearby', getNearbyIncidences);
router.post('/', protect, createIncidence);

module.exports = router;
