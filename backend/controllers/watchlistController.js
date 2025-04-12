// controllers/watchlistController.js
const User = require('../models/User');
const Stock = require('../models/Stock');

// Get user's watchlist with detailed stock information
const getWatchlist = async (req, res) => {
  try {
    const userId = req.session.user?.id || req.user._id;
    
    // Find user and populate with watchlist symbols
    const user = await User.findById(userId).select('watchlist');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If watchlist is empty, return empty array
    if (!user.watchlist || user.watchlist.length === 0) {
      return res.status(200).json({ watchlist: [] });
    }
    
    // Extract symbols from user's watchlist
    const symbols = user.watchlist.map(item => item.symbol);
    
    // Fetch stock details for the watchlist symbols
    const stocks = await Stock.find({ symbol: { $in: symbols } })
      .select('symbol name latestPrice latestChange lastUpdated');
    
    // Map the stock data to the watchlist format
    const watchlistWithDetails = stocks.map(stock => ({
      _id: stock._id,
      symbol: stock.symbol,
      name: stock.name,
      price: stock.latestPrice,
      change: stock.latestChange,
      lastUpdated: stock.lastUpdated
    }));
    
    res.status(200).json({ 
      watchlist: watchlistWithDetails
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Add stock to watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { symbol } = req.body;
    const userId = req.session.user?.id || req.user._id;
    
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    
    // Check if stock exists in database
    const stock = await Stock.findOne({ symbol });
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if stock already exists in watchlist
    const stockExists = user.watchlist.some(item => item.symbol === symbol);
    
    if (stockExists) {
      return res.status(400).json({ message: 'Stock already in watchlist' });
    }
    
    // Add stock to watchlist
    user.watchlist.push({
      symbol,
      addedAt: Date.now()
    });
    
    await user.save();
    
    // Return the complete stock information
    res.status(200).json({ 
      message: 'Stock added to watchlist',
      stock: {
        _id: stock._id,
        symbol: stock.symbol,
        name: stock.name,
        price: stock.latestPrice,
        change: stock.latestChange,
        lastUpdated: stock.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Remove stock from watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const { symbol } = req.params;
    const userId = req.session.user?.id || req.user._id;
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if stock exists in watchlist
    const stockIndex = user.watchlist.findIndex(item => item.symbol === symbol);
    
    if (stockIndex === -1) {
      return res.status(404).json({ message: 'Stock not found in watchlist' });
    }
    
    // Remove stock from watchlist
    user.watchlist.splice(stockIndex, 1);
    
    await user.save();
    
    res.status(200).json({ 
      message: 'Stock removed from watchlist'
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
};