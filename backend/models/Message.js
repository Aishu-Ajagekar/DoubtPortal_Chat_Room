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
    content: { type: String, required: true },
    from: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      role: { type: String, enum: ["mentor", "student"], required: true },
    },
    to: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      role: { type: String, enum: ["mentor", "student"], required: true },
    },
  },
  { timestamps: true }
);

// const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    // topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    customId: {
      type: String,
      required: true
    },
    topicId: {
      type: String,
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [messageSchema],
    // 'mentor' or 'student'
  },
  { timestamps: true }
);

// ✅ Validate roles before saving chat
// const User = require('./User');
// const Topic = require("./Topic");

// chatSchema.pre("save", async function (next) {
//   const topic = await Topic.findById(this.topicId)

//   if(!topic){
//     return next(new Error("Invalid Topic Selected"));
//   }
//   const studentUser = await User.findById(this.student);
//   const mentorUser = await User.findById(this.mentor);

//   if (!studentUser || studentUser.role !== "student") {
//     return next(new Error("Invalid student role for student field"));
//   }

//   if (!mentorUser || mentorUser.role !== "mentor") {
//     return next(new Error("Invalid mentor role for mentor field"));
//   }

//   next();
// });

module.exports = mongoose.model("Message", chatSchema);
