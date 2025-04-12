const express = require('express');
const {
  getAllStocks,
  getStockBySymbol,
  getStockInsights
} = require('../controllers/stockController');

const router = express.Router();

// Get all stocks for the sidebar
router.get('/', getAllStocks);

// Get detailed data for a specific stock
router.get('/:symbol', getStockBySymbol);

// Get insights for a specific stock
router.get('/:symbol/insights', getStockInsights);

module.exports = router;