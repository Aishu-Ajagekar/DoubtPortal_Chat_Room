const Message = require("../models/Message");
// const Topic = require("../models/Topic");

// GET all messages for a specific topic
// exports.getMessagesByTopic = async (req, res) => {
// try {
//   const { topicId } = req.params;

//   const topic = await Topic.findOne({ name: topicId });

//   if (!topic) {
//     return res.status(404).json({
//       success: false,
//       message: "Topic not found",
//     });
//   }

//   const messages = await Message.find({ topic: topic._id })
//   .sort({
//     createdAt: 1,
//   })
//   .populate("topic", "name");
//   const topicName = messages[0]?.topic?.name;
//   console.log("messages :", messages);

//   console.log("mssg:", messages);

//   res.status(200).json({
//     success: true,
//     message: "Messages fetched successfully",
//     messages,
//     topicName: "",
//   });
// } catch (err) {
//   console.error("❌ Error fetching messages:", err.message);
//   res.status(500).json({
//     success: false,
//     message: "Failed to fetch messages",
//     error: err.message,
//   });
// }
// };

/*
payload should contain below param

{
  id: this will we get from FE
  mentorid
  studentId
  message: 
  from:
  to:
}

*/
exports.getMessagesByTopic = async (req, res) => {
  const { topicId: roomId } = req.params;

  try {
    //   const topic = await Topic.findOne({ name: topicId });

    // if (!topic) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Topic not found",
    //   });
    // }

    // const messages = await Message.findOneAndUpdate(
    //   { _id: topicId, mentor: mentorId, student: studentId },
    //   { $setOnInsert: { topic: topicId, mentor: mentorId, student: studentId, messages: [] } },
    //   { new: true, upsert: true }
    // );
    // return messages;
    let fetchedRoom = await Message.findById(roomId);

    if (!fetchedRoom) {
      const [studentId = "", mentorId = "", topicId = ""] = roomId.split("#");

      fetchedRoom = await Message.create({
        _id: roomId,
        topicId,
        student: studentId,
        mentor: mentorId,
        messages: [],
      });
    }
    return res.status(200).json({
      fetchedRoom
    });
  } catch (err) {
    console.log("Error while fetching topic id : ", roomId);
    console.log("Error message", err.message);
  }
};
