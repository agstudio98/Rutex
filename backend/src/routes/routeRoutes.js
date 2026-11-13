const express = require('express');
const router = express.Router();
const {
  createRouteSession,
  getRouteSessionById,
  updateRouteStatus,
  getUserActiveSession,
} = require('../controllers/routeController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createRouteSession);
router.get('/active/current', protect, getUserActiveSession);
router.get('/:id', protect, getRouteSessionById);
router.patch('/:id/status', protect, updateRouteStatus);

module.exports = router;
