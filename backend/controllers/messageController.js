const Message = require("../models/Message");
const Topic = require("../models/Topic");

// GET all messages for a specific topic
exports.getMessagesByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await Topic.findOne({ name: topicId });
    
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }
    
    const messages = await Message.find({ topic: topic._id })
    .sort({
      createdAt: 1,
    })
    .populate("topic", "name");
    const topicName = messages[0]?.topic?.name;
    console.log("messages :", messages);

    console.log("mssg:", messages);

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
      topicName: "",
    });
  } catch (err) {
    console.error("❌ Error fetching messages:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: err.message,
    });
  }
};
