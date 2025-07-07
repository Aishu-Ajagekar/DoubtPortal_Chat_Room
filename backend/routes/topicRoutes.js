const express = require("express");
const router = express.Router();
const { createTopic, getAllTopics, getTopicsByCourse } = require("../controllers/topicController");
const {  requireSignIn , isMentor } = require("../middlewares/authMiddleware");

router.post("/create", requireSignIn, isMentor, createTopic);
router.get("/get-all-topics", requireSignIn , getAllTopics);
router.get("/:course",requireSignIn, getTopicsByCourse);


module.exports = router;
