import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from current working directory, server folder, and root folder
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const sanitizeMongoUri = (uri) => {
  if (!uri) return "mongodb://127.0.0.1:27017/manage_data_panel";
  let cleaned = uri.trim();
  // Strip accidental duplicate key prefix (e.g. MONGODB_URI=mongodb...)
  if (cleaned.startsWith("MONGODB_URI=")) {
    cleaned = cleaned.replace(/^MONGODB_URI=\s*/, "");
  }
  // Strip enclosing quotes if present
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned || "mongodb://127.0.0.1:27017/manage_data_panel";
};

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: sanitizeMongoUri(process.env.MONGODB_URI),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development"
};

