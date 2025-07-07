import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from "../../utils/socket"; // connected io()
import { useParams } from "react-router-dom";

const StudentChat = () => {
  const { topicId } = useParams();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const chatEndRef = useRef(null);

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // Auto scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  // Fetch Topics
  useEffect(() => {
    const fetchTopics = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/topics/get-all-topics`,
        {
          headers: { Authorization: token },
        }
      );
      setTopics(res.data.topics);
    };
    fetchTopics();
  }, []);

  // Join room + listen for events
  useEffect(() => {
    if (!selectedTopic) return;

    socket.emit("join-room", selectedTopic);

    socket.on("receive-message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on("typing", ({ senderName }) => {
      setTypingUser(senderName);
      setTimeout(() => setTypingUser(null), 2000);
    });

    const fetchMessages = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/messages/${selectedTopic}`,
        {
          headers: { Authorization: token },
        }
      );
      setChat(res.data.messages);
    };
    fetchMessages();

    return () => {
      socket.off("receive-message");
      socket.off("typing");
    };
  }, [selectedTopic]);

  // Handle typing
  const handleChange = (e) => {
    setMsg(e.target.value);
    console.log("👨‍🎓 Emitting typing from student...");
    socket.emit("typing", {
      room: selectedTopic,
      senderName: name,
    });
  };

  const sendMessage = () => {
    if (!msg.trim()) return;

    socket.emit("send-message", {
      room: selectedTopic,
      message: msg,
      senderName: name,
      senderRole: role,
    });

    setMsg("");
  };

  return (
    <div className="container py-5">
      <h3 className="mb-4">🧠 Select a Topic</h3>

      <select
        className="form-select mb-3"
        onChange={(e) => setSelectedTopic(e.target.value)}
        value={selectedTopic}
      >
        <option value="">-- Select a Subject Room --</option>
        {topics.map((topic) => (
          <option key={topic._id} value={topic._id}>
            {topic.name}
          </option>
        ))}
      </select>

      {selectedTopic && (
        <>
          <div
            className="border rounded p-3 mb-3"
            style={{ height: "500px", overflowY: "auto" }}
          >
            {chat.map((m, idx) => (
              <div
                key={idx}
                className={`mb-2 d-flex ${
                  m.senderRole === role && m.senderName === name
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  className={`p-2 rounded shadow-sm ${
                    m.senderRole === role && m.senderName === name
                      ? "bg-primary text-white"
                      : "bg-light text-dark"
                  }`}
                  style={{ maxWidth: "75%" }}
                >
                  <div className="fw-bold small mb-1">
                    {m.senderName} ({m.senderRole})
                  </div>
                  <div>{m.content}</div>
                </div>
              </div>
            ))}

            {/* ✨ Typing Indicator */}
            {typingUser && (
              <div className="d-flex align-items-center gap-2 text-muted small ps-2">
                {typingUser} is typing
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="d-flex">
            <input
              className="form-control me-2"
              value={msg}
              onChange={handleChange}
              placeholder="Type message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentChat;
