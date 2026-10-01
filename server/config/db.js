import mongoose from "mongoose";
import { config } from "./env.js";

/**
 * Connect to MongoDB database with connection caching for serverless environments
 */
export const connectDB = async () => {
  // If already connected, reuse active connection
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    if (!config.mongoUri) {
      console.warn("⚠️ MONGODB_URI is not defined in environment variables.");
      return;
    }

    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Do not terminate process in serverless (Vercel) environment
    if (config.nodeEnv === "production" && !process.env.VERCEL) {
      process.exit(1);
    }
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});
