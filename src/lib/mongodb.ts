import mongoose, { Mongoose } from "mongoose";

declare global {
  // Ensures global caching works across reloads in Next.js
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: Mongoose | null; promise: Promise<Mongoose> | null } | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with caching to avoid multiple connections during dev
 */
export async function connectDB(): Promise<Mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined in environment variables");
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => mongoose);
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    throw error;
  }

  return cached!.conn;
}
