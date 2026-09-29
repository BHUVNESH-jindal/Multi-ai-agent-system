const mongoose = require('mongoose');

async function connectDB() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/multi_agent_platform';
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[db] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[db] MongoDB Connection Error: ${error.message}`);
    throw error;
  }
}

module.exports = connectDB;
