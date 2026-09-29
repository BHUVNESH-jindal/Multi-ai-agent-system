require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5001;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[server] Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('[server] MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

start();
