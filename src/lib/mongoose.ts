import mongoose from "mongoose";

declare global {
  var mongoose: { conn: any; promise: any } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Initialize connection cache
const mongooseCache = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) global.mongoose = mongooseCache;

// More aggressive timeouts to fail faster
const options = {
  serverSelectionTimeoutMS: 3000, // 3 seconds
  connectTimeoutMS: 5000,         // 5 seconds
  socketTimeoutMS: 10000,         // 10 seconds
  maxPoolSize: 10,
  bufferCommands: false,          // Disable buffering to fail fast
  autoIndex: false,               // Don't build indexes on startup
};

// Track connection status for faster response
let isConnected = false;

export async function connectDB(retries = 1) {
  // If we're already connected, return immediately
  if (isConnected && mongooseCache.conn) {
    return mongooseCache.conn;
  }

  // Clear any stale connections
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    mongooseCache.conn = mongoose.connection;
    return mongooseCache.conn;
  } else if (mongoose.connection.readyState !== 0) {
    // If in a connecting/disconnecting state, reset
    await mongoose.connection.close();
    mongooseCache.promise = null;
    mongooseCache.conn = null;
  }

  // Wait for an in-progress connection with timeout
  if (mongooseCache.promise) {
    try {
      // Add a timeout to the promise wait
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Connection wait timeout")), 3000);
      });
      mongooseCache.conn = await Promise.race([
        mongooseCache.promise,
        timeoutPromise
      ]);
      isConnected = true;
      return mongooseCache.conn;
    } catch (error) {
      // Reset on failure
      mongooseCache.promise = null;
      mongooseCache.conn = null;
      
      if (retries <= 0) {
        throw new Error(`MongoDB connection timed out`);
      }
    }
  }

  try {
    // Create new connection with explicit timeout
    const connectPromise = mongoose.connect(MONGODB_URI, options);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Connection timeout")), 5000);
    });
    
    mongooseCache.promise = connectPromise;
    mongooseCache.conn = await Promise.race([connectPromise, timeoutPromise]);
    isConnected = true;
    return mongooseCache.conn;
  } catch (error) {
    // Clean up after failure
    mongooseCache.promise = null;
    mongooseCache.conn = null;
    
    if (retries <= 0) {
      throw new Error(`Failed to connect to MongoDB - session operations will fail`);
    }
    
    // Minimal retry with short backoff
    await new Promise(resolve => setTimeout(resolve, 500));
    return connectDB(retries - 1);
  }
}
