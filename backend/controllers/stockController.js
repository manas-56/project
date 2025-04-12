const Stock = require('../models/Stock');

// Get all stocks (for sidebar display)
const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({}, 'symbol name data');
    
    // Process data to get the most recent price for each stock
    const processed = stocks.map(stock => {
      const latestData = stock.data?.[stock.data.length - 1];
      return {
        symbol: stock.symbol,
        name: stock.name,
        lastClose: latestData?.close ?? null,
      };
    });
    
    res.status(200).json(processed);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ message: 'Error fetching stocks', error: error.message });
  }
};

// Get a single stock by symbol
const getStockBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    
    res.status(200).json(stock);
  } catch (error) {
    console.error(`Error fetching stock ${req.params.symbol}:`, error);
    res.status(500).json({ message: 'Error fetching stock', error: error.message });
  }
};

// Get insights for a specific stock
const getStockInsights = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Find the stock
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    
    // Generate basic insights (can be enhanced with ML/technical analysis)
    const data = stock.data || [];
    let insights = { symbol, trends: [] };
    
    if (data.length > 0) {
      // Calculate simple moving averages
      const recentData = data.slice(-30); // Last 30 data points
      
      // Calculate 7-day average
      if (recentData.length >= 7) {
        const avg7Day = recentData.slice(-7).reduce((sum, item) => sum + item.close, 0) / 7;
        insights.trends.push({
          type: '7-day average',
          value: avg7Day.toFixed(2)
        });
      }
      
      // Calculate 30-day average if available
      if (recentData.length >= 30) {
        const avg30Day = recentData.reduce((sum, item) => sum + item.close, 0) / 30;
        insights.trends.push({
          type: '30-day average',
          value: avg30Day.toFixed(2)
        });
      }
      
      // Add volume trend
      if (recentData.length >= 7) {
        const avgVolume = recentData.slice(-7).reduce((sum, item) => sum + item.volume, 0) / 7;
        insights.trends.push({
          type: 'Average 7-day volume',
          value: Math.round(avgVolume).toLocaleString()
        });
      }
      
      // Basic recommendation based on recent performance
      if (recentData.length >= 10) {
        const latest = recentData[recentData.length - 1];
        const tenDaysAgo = recentData[recentData.length - 10];
        
        if (latest.close > tenDaysAgo.close) {
          const percentGain = ((latest.close - tenDaysAgo.close) / tenDaysAgo.close) * 100;
          insights.recommendation = {
            action: percentGain > 5 ? 'Hold' : 'Buy',
            reason: `Stock has gained ${percentGain.toFixed(2)}% in the last 10 trading days.`
          };
        } else {
          const percentLoss = ((tenDaysAgo.close - latest.close) / tenDaysAgo.close) * 100;
          insights.recommendation = {
            action: percentLoss > 8 ? 'Buy' : 'Hold',
            reason: `Stock has lost ${percentLoss.toFixed(2)}% in the last 10 trading days.`
          };
        }
      }
    }
    
    res.status(200).json(insights);
  } catch (error) {
    console.error(`Error generating insights for ${req.params.symbol}:`, error);
    res.status(500).json({ message: 'Error generating insights', error: error.message });
  }
};

module.exports = {
  getAllStocks,
  getStockBySymbol,
  getStockInsights
};