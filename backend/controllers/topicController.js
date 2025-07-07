const Topic = require("../models/Topic");

exports.createTopic = async (req, res) => {
  try {
    const { name, createdBy } = req.body;
    const topic = await Topic.create({ name, createdBy });
    res.status(201).json({
      success: true,
      topic,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create topic" });
  }
};

exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().populate("createdBy", "name");
    res.status(200).json({ success: true, topics });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch topics" });
  }
};


exports.getTopicsByCourse = (req, res) => {
  const { course } = req.params;

  const courseTopics = {
    "MERN Full Stack": ["React", "Node.js", "MongoDB", "Express"],
    "Python Full Stack": ["Django", "Flask", "PostgreSQL"],
    "Java Full Stack": ["Spring Boot", "Hibernate", "MySQL"]
  };

  const topics = courseTopics[course];
  if (!topics) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json({ topics });
};
