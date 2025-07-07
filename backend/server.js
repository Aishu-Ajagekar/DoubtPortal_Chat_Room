const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const dbConnect = require("./config/db");
const Message = require("./models/Message");
const User = require("./models/User");

dotenv.config();
dbConnect();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/topics", require("./routes/topicRoutes"));
app.use("/api/v1/messages", require("./routes/messageRoutes"));

app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

const connectedMentors = new Map();      // socket.id -> mentorId
const connectedStudents = new Map();     // socket.id -> studentId
const pendingRequests = new Map();       // mentorId -> [{ studentId, studentName }]

const getMentorSocketById = (mentorId) => {
  for (const [socketId, id] of connectedMentors.entries()) {
    if (id === mentorId) return socketId;
  }
  return null;
};

const getStudentSocketById = (studentId) => {
  for (const [socketId, id] of connectedStudents.entries()) {
    if (id === studentId) return socketId;
  }
  return null;
};

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // 🎓 Student joins
  socket.on("student-online", (studentId) => {
    connectedStudents.set(socket.id, studentId);
    console.log("🎓 Student online:", studentId);
  });

  // 👨‍🏫 Mentor joins
  socket.on("mentor-online", async (mentorId) => {
    connectedMentors.set(socket.id, mentorId);
    await User.findByIdAndUpdate(mentorId, { status: "online" });
    io.emit("mentor-status-updated", { mentorId, status: "online" });
    console.log("✅ Mentor online:", mentorId);

    // 🔁 Send any pending chat requests
    const pending = pendingRequests.get(mentorId);
    if (pending && pending.length > 0) {
      console.log("📬 Sending pending chat requests...");
      for (const req of pending) {
        socket.emit("chat-request-received", {
          studentId: req.studentId,
          studentName: req.studentName,
          mentorId,
        });
      }
      pendingRequests.delete(mentorId);
    }
  });

  // 📩 Student initiates chat request
  socket.on("chat-request", ({ studentId, mentorId, studentName }) => {
    const mentorSocketId = getMentorSocketById(mentorId);
    if (mentorSocketId) {
      io.to(mentorSocketId).emit("chat-request-received", {
        studentId,
        studentName,
        mentorId,
      });
      console.log("📩 Sent to mentor:", studentName);
    } else {
      console.log("📥 Mentor offline. Queuing request...");
      if (!pendingRequests.has(mentorId)) {
        pendingRequests.set(mentorId, []);
      }
      pendingRequests.get(mentorId).push({ studentId, studentName });
    }
  });

  // ✅ Mentor accepts chat request
  socket.on("chat-request-accepted", ({ mentorId, studentId }) => {
    const studentSocketId = getStudentSocketById(studentId);
    const topicId = `${mentorId}_${studentId}`;
    if (studentSocketId) {
      io.to(studentSocketId).emit("chat-request-accepted", { mentorId, topicId });
    }
    const mentorSocketId = getMentorSocketById(mentorId);
    if (mentorSocketId) {
      io.to(mentorSocketId).emit("open-chat-room", { topicId });
    }
  });

  // ❌ Mentor rejects chat request
  socket.on("chat-request-rejected", ({ mentorId, studentId }) => {
    const studentSocketId = getStudentSocketById(studentId);
    if (studentSocketId) {
      io.to(studentSocketId).emit("chat-request-rejected");
    }
  });

  // ❎ Manual logout (handled via socket event from frontend)
  socket.on("mentor-offline", async (mentorId) => {
    await User.findByIdAndUpdate(mentorId, { status: "offline" });
    io.emit("mentor-status-updated", { mentorId, status: "offline" });
    console.log("🔴 Mentor manually logged out:", mentorId);
  });

  // ❎ Disconnect (tab close or reload)
  socket.on("disconnect", async () => {
    const mentorId = connectedMentors.get(socket.id);
    const studentId = connectedStudents.get(socket.id);

    if (mentorId) {
      await User.findByIdAndUpdate(mentorId, { status: "offline" });
      io.emit("mentor-status-updated", { mentorId, status: "offline" });
      connectedMentors.delete(socket.id);
      console.log("🔴 Mentor disconnected:", mentorId);
    }

    if (studentId) {
      connectedStudents.delete(socket.id);
      console.log("🔴 Student disconnected:", studentId);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
