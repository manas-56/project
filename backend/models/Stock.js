const mongoose = require('mongoose');

const stockDataSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  series: { type: String },
  prevClose: { type: Number },
  open: { type: Number },
  high: { type: Number },
  low: { type: Number },
  last: { type: Number },
  close: { type: Number },
  vwap: { type: Number },
  volume: { type: Number },
  turnover: { type: Number },
  trades: { type: Number },
  deliverableVolume: { type: Number },
  percentDeliverable: { type: Number }
}, { _id: false });

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  data: [stockDataSchema],
  latestPrice: { type: Number, default: 0 },
  latestChange: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for faster lookups
stockSchema.index({ symbol: 1 });

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;