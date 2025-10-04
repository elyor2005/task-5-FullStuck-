import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI environment variable");
}

// Use global cache to avoid multiple connections in dev
const globalWithMongoose = globalThis as unknown as {
  mongooseCache?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  const cache = globalWithMongoose.mongooseCache!;

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    // ✅ Add non-null assertion (!) because we've already checked for undefined
    cache.promise = mongoose.connect(MONGODB_URI!).then((m) => m);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
