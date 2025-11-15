const express = require('express');
const router = express.Router();
const {
  getAllDustbins,
  getDustbinById,
  getNearbyDustbins,
  getDustbinsByCategory,
  createDustbin,
  updateDustbin,
  deleteDustbin
} = require('../controllers/dustbinController');

// GET /api/dustbins - Get all dustbins
router.get('/', getAllDustbins);

// GET /api/dustbins/nearby - Get nearby dustbins
router.get('/nearby', getNearbyDustbins);

// GET /api/dustbins/category/:category - Get dustbins by waste category
router.get('/category/:category', getDustbinsByCategory);

// GET /api/dustbins/:id - Get dustbin by ID
router.get('/:id', getDustbinById);

// POST /api/dustbins - Create new dustbin
router.post('/', createDustbin);

// PUT /api/dustbins/:id - Update dustbin
router.put('/:id', updateDustbin);

// DELETE /api/dustbins/:id - Delete dustbin
router.delete('/:id', deleteDustbin);

module.exports = router;