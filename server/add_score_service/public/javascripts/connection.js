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
    await mongoose.connect(MONGO_URI);
    console.log("Connection Successful!");
  } catch {
    console.log("Connection Failed!");
  }
};

module.exports.connection = connection;
