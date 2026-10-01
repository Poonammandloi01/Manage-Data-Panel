import app from "../server/app.js";
import { connectDB } from "../server/config/db.js";

/**
 * Serverless function entry point for Vercel deployment
 */
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
