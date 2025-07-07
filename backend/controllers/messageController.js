const Message = require("../models/Message");

// GET all messages for a specific topic
exports.getMessagesByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const messages = await Message.find({ topic: topicId }).sort({
      createdAt: 1,
    }).populate("topic","name");

    console.log("mssg:" ,messages);

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
      topicName:messages[0]?.topic?.name||""
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
