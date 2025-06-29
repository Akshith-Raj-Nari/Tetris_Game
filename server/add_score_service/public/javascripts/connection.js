const mongoose = require("mongoose");
const env = require("dotenv");
env.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}

const connection = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connection Successful!");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
  }
};

module.exports = { connection };
