const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectWithTimeout = (uri) => mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
});

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction && !uri) {
      console.error('❌ MONGODB_URI/MONGO_URI environment variable is missing in production. Connection failed.');
      process.exit(1);
    }

    if ((process.env.USE_MEMORY_DB === 'true' && !isProduction) || (!uri && !isProduction)) {
      console.log('Starting in-memory MongoDB server...');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('In-memory MongoDB started at', uri);
    }

    const conn = await connectWithTimeout(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    
    // Database Connection Audit
    const maskedUri = uri ? uri.replace(/\/\/[^@]+@/, '//******@') : 'in-memory';
    console.log(`📡 MongoDB Connection URI (masked): ${maskedUri}`);
    console.log(`🗄️  Active Database Name: ${conn.connection.name}`);

    return { conn, isMemory: !!mongoServer };
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);

    const isProduction = process.env.NODE_ENV === 'production';
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (isProduction || uri) {
      console.error('❌ MongoDB connection failed. Crashing server to prevent silent data loss.');
      process.exit(1);
    }

    if (!mongoServer) {
      console.log('No MongoDB URI provided. Falling back to in-memory DB...');
      try {
        mongoServer = await MongoMemoryServer.create();
        const memoryUri = mongoServer.getUri();
        const conn = await connectWithTimeout(memoryUri);
        console.log(`In-memory MongoDB connected at ${memoryUri}`);
        return { conn, isMemory: true };
      } catch (memErr) {
        console.error(`In-memory DB error: ${memErr.message}`);
        process.exit(1);
      }
    }

    process.exit(1);
  }
};

module.exports = connectDB;
