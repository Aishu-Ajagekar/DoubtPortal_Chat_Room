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
  "MERN Full Stack": [
    { id: "1a2b3c4d-mern-react", name: "React" },
    { id: "2b3c4d5e-mern-node", name: "Node.js" },
    { id: "3c4d5e6f-mern-mongo", name: "MongoDB" },
    { id: "4d5e6f7g-mern-express", name: "Express" },
  ],
  "Python Full Stack": [
    { id: "5e6f7g8h-python-django", name: "Django" },
    { id: "6f7g8h9i-python-flask", name: "Flask" },
    { id: "7g8h9i0j-python-postgres", name: "PostgreSQL" },
  ],
  "Java Full Stack": [
    { id: "8h9i0j1k-java-spring", name: "Spring Boot" },
    { id: "9i0j1k2l-java-hibernate", name: "Hibernate" },
    { id: "0j1k2l3m-java-mysql", name: "MySQL" },
  ]
};

  const topics = courseTopics[course];
  if (!topics) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json({ topics });
};
