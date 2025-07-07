const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "mentor"],
    default: "student",
  },
  course: {
    type: String,
    enum: ["python", "java", "mern"],
    required: true,
  },
  status: {
    type: String,
    enum: ["offline", "online", "busy"],
    default: "offline",
  },

  currentRoom: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
