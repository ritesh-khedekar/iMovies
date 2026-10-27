const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies';

  try {
    // Attempt connecting to the configured MONGO_URI with a 2-second timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`Standard MongoDB connection to ${uri} failed (${err.message}).`);
    console.log('Starting persistent local MongoDB instance...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const dbPath = path.resolve(__dirname, '../data/db');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          port: 27017,
          dbName: 'imovies',
          dbPath: dbPath,
          storageEngine: 'wiredTiger',
        },
        binary: {
          arch: 'x64',
          version: '7.0.14',
        },
      });

      const memoryUri = mongoMemoryServer.getUri().replace(/\/$/, '') + '/imovies';
      const conn = await mongoose.connect(memoryUri, { dbName: 'imovies' });
      console.log(`Local MongoDB Started and Connected: ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.warn(`Could not bind to port 27017 (${memErr.message}), starting on random port...`);
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create({
          instance: {
            dbName: 'imovies',
          },
          binary: {
            arch: 'x64',
            version: '7.0.14',
          },
        });
        const memoryUri = mongoMemoryServer.getUri().replace(/\/$/, '') + '/imovies';
        const conn = await mongoose.connect(memoryUri, { dbName: 'imovies' });
        console.log(`Embedded MongoDB Connected: ${memoryUri}`);
        return conn;
      } catch (fatalErr) {
        console.error(`Failed to start embedded MongoDB: ${fatalErr.message}`);
        process.exit(1);
      }
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
};

module.exports = { connectDB, disconnectDB };
