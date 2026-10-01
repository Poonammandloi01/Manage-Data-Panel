import app from "./app.js";
import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start HTTP Server
  const server = app.listen(config.port, () => {
    console.log(`🚀 Server running in ${config.nodeEnv} mode on http://localhost:${config.port}`);
    console.log(`🩺 Health check available at: http://localhost:${config.port}/api/health`);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.error(`💥 Unhandled Rejection: ${err.message}`);
    // Close server & exit process if critical
  });
};

startServer();
