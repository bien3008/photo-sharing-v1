const mongoose = require("mongoose");
require("dotenv").config();

// Attempt to connect to provided DB_URL; on failure (dev) fall back to in-memory MongoDB
async function dbConnect() {
  const tryConnect = async (url) => {
    try {
      await mongoose.connect(url, { autoIndex: true });
      return true;
    } catch (err) {
      return err;
    }
  };

  if (process.env.DB_URL) {
    const r = await tryConnect(process.env.DB_URL);
    if (r === true) {
      console.log("Successfully connected to MongoDB Atlas!");
      return;
    }
    console.error("Unable to connect to MongoDB Atlas!", r && r.message ? r.message : r);
  } else {
    console.warn("No DB_URL provided in environment.");
  }

  // If running in production, do not fall back silently
  const allowFallback = process.env.USE_IN_MEMORY_DB === "true" || process.env.NODE_ENV !== "production";
  if (!allowFallback) {
    throw new Error("No working MongoDB connection and in-memory fallback disabled");
  }

  // Lazy-load mongodb-memory-server to avoid adding it in production
  try {
    console.log("Starting in-memory MongoDB server as a fallback for development/testing...");
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.DB_URL = uri;
    await mongoose.connect(uri, { autoIndex: true });
    console.log("Connected to in-memory MongoDB.");
  } catch (err) {
    console.error("Failed to start in-memory MongoDB:", err && err.message ? err.message : err);
    throw err;
  }
}

module.exports = dbConnect;
