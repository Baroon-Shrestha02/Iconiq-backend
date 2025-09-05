const mongoose = require("mongoose");

const mongoDB_URI =
  process.env.URI ||
  "mongodb+srv://baroon:baroon123@cluster0.zxa2opf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const database = async () => {
  try {
    await mongoose.connect(mongoDB_URI);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
};

module.exports = { database };
