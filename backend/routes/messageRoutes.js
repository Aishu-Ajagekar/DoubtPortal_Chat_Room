const express = require("express");
const router = express.Router();
const { getMessagesByTopic } = require("../controllers/messageController");
const { requireSignIn } = require("../middlewares/authMiddleware");

// GET /api/messages/:topicId
router.get("/:topicId", requireSignIn, getMessagesByTopic);



module.exports = router;
