import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI environment variable");
}

const globalCache = globalThis as unknown as {
  mongooseConn?: typeof mongoose;
  mongoosePromise?: Promise<typeof mongoose>;
};

export async function connectDB() {
  if (globalCache.mongooseConn) return globalCache.mongooseConn;

  if (!globalCache.mongoosePromise) {
    // ✅ Type assertion fixes TypeScript error
    globalCache.mongoosePromise = mongoose.connect(MONGODB_URI as string);
  }

  globalCache.mongooseConn = await globalCache.mongoosePromise;
  return globalCache.mongooseConn;
}
