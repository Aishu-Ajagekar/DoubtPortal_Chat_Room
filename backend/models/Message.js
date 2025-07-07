// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//   sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
//   content: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Message", messageSchema);


const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    content: { type: String, required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, required: true }, // 'mentor' or 'student'
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

