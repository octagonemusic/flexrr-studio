import mongoose from "mongoose";

declare global {
  var mongoose: { conn: any; promise: any } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const mongooseCache = cached as { conn: any; promise: any };

export async function connectDB(retries = 3) {
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  // If there's an existing connection attempt, wait for it
  if (mongooseCache.promise) {
    try {
      mongooseCache.conn = await mongooseCache.promise;
      return mongooseCache.conn;
    } catch (error) {
      // If the existing promise failed, clear it so we can retry
      mongooseCache.promise = null;
      console.error("MongoDB connection failed:", error);

      // If no retries left, throw the error
      if (retries <= 0) {
        throw new Error(
          `MongoDB connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }

      // Otherwise retry with one fewer retry
      return connectDB(retries - 1);
    }
  }

  // Set connection options with timeouts
  const options = {
    serverSelectionTimeoutMS: 5000, // Timeout for server selection
    connectTimeoutMS: 10000, // Timeout for initial connection
    socketTimeoutMS: 45000, // Timeout for operations on the socket
    autoIndex: true, // Build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
  };

  try {
    // Create new connection promise
    mongooseCache.promise = mongoose.connect(MONGODB_URI, options);
    mongooseCache.conn = await mongooseCache.promise;

    console.log("MongoDB connected successfully");
    return mongooseCache.conn;
  } catch (error) {
    // Clear promise on error
    mongooseCache.promise = null;
    console.error("MongoDB connection error:", error);

    // If no retries left, throw the error
    if (retries <= 0) {
      throw new Error(
        `Failed to connect to MongoDB after retries: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    // Otherwise retry with exponential backoff
    const backoffMs = Math.pow(2, 3 - retries) * 1000;
    console.log(`Retrying MongoDB connection in ${backoffMs}ms...`);
    await new Promise((resolve) => setTimeout(resolve, backoffMs));

    return connectDB(retries - 1);
  }
}
