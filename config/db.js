const mongoose = require("mongoose");

async function connectToMongoDb(url) {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

module.exports = { connectToMongoDb };
