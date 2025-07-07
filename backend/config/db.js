const mongoose = require("mongoose");
require('dotenv').config({path:__dirname + "/../.env"})
// require("dotenv").config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB is connected..");
  } catch (error) {
    console.log("MongoDB connection is failed..", error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;
