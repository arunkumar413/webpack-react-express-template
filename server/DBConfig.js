const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI

async function connectDB() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected");
}

module.exports = {
  connectDB,
  MONGODB_URI,
};
