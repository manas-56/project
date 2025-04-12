const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Stock = require('./models/stock.model.js');
const { connectDB } = require('./lib/db.js');

// Load environment variables
dotenv.config();

async function processCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
        trim: true
      }))
      .on('data', (data) => {
        const stockData = {
          date: new Date(data.Date || data.date),
          series: data.Series || data.series || '',
          prevClose: parseFloat(data.Prev_Close || data['Prev Close'] || data.prevClose || 0),
          open: parseFloat(data.Open || data.open || 0),
          high: parseFloat(data.High || data.high || 0),
          low: parseFloat(data.Low || data.low || 0),
          last: parseFloat(data.Last || data.last || 0),
          close: parseFloat(data.Close || data.close || 0),
          vwap: parseFloat(data.VWAP || data.vwap || 0),
          volume: parseInt(data.Volume || data.volume || 0),
          turnover: parseFloat(data.Turnover || data.turnover || 0),
          trades: parseInt(data.Trades || data.trades || 0),
          deliverableVolume: parseInt(data.Deliverable_Volume || data['Deliverable Volume'] || data.deliverableVolume || 0),
          percentDeliverable: parseFloat(data.Perc_Deliverable || data['% Deliverable'] || data.percentDeliverable || 0)
        };
        results.push(stockData);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function importCSVFilesToDB() {
  try {
    await connectDB();
    console.log('Starting to import stock data...');

    const dataFolderPath = path.join(process.cwd(), 'data');
    const files = fs.readdirSync(dataFolderPath).filter(file => file.endsWith('.csv'));

    let totalImported = 0;

    for (const file of files) {
      const filePath = path.join(dataFolderPath, file);
      const symbol = path.basename(file, '.csv');
      console.log(`Processing file: ${file} for symbol: ${symbol}`);

      const stockData = await processCSVFile(filePath);
      console.log(`Found ${stockData.length} records in ${file}`);

      if (stockData.length > 0) {
        const result = await Stock.findOneAndUpdate(
          { symbol: symbol },
          {
            symbol: symbol,
            $push: { data: { $each: stockData } }
          },
          { upsert: true, new: true }
        );

        console.log(`Successfully imported data for ${symbol}. Total records: ${result.data.length}`);
        totalImported += stockData.length;
      }
    }

    console.log(`Stock data import completed successfully. Total records imported: ${totalImported}`);
  } catch (error) {
    console.error('Error importing stock data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

importCSVFilesToDB();
