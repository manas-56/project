const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  console.log('🔌 Connecting to MongoDB...');
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("❌ MONGO_URI not found in environment variables.");
  }

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
  });

  console.log('✅ MongoDB connected successfully.');
};

module.exports = { connectDB };
