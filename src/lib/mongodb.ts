// import mongoose from "mongoose";

// let isConnected = false; // track connection state

// export async function connectDB() {
//   if (isConnected) {
//     console.log("⚡ Already connected to MongoDB");
//     return;
//   }

//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
//       dbName: "testdb", // change if you want a custom DB name
//     });

//     isConnected = true;
//     console.log("✅ MongoDB Connected:", conn.connection.host);
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error);
//     throw error;
//   }
// }

// src/lib/mongodb.ts
import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongooseCache as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
if (!cached) {
  cached = { conn: null, promise: null };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).mongooseCache = cached;
}

/**
 * connectDB - connect to MongoDB with caching to prevent multiple connections in dev
 * important: call this before using models
 */
export async function connectDB() {
  if (cached!.conn) return cached!.conn;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in env");
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(process.env.MONGODB_URI).then((m) => m);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
