/*import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaCircle, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

const MentorList = () => {
  const [mentors, setMentors] = useState([]);
  const navigate = useNavigate();
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/mentors`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setMentors(res.data.mentors);
      } catch (err) {
        console.error("Error fetching mentors", err);
         Swal.fire("Error", "Failed to load mentor list", "error");
      }
    };

    fetchMentors();

    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL);
    }

    socketRef.current.on("mentor-status-updated", ({ mentorId, status }) => {
      setMentors((prevMentors) =>
        prevMentors.map((mentor) =>
          mentor._id === mentorId ? { ...mentor, status } : mentor
        )
      );
    });

    return () => {
      if (socketRef.current) {
        // socketRef.current.off("mentor-status-updated");
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleViewProfile = (mentorId) => {
    navigate(`/mentor-profile/${mentorId}`);
  };

  const handleChatNow = (mentorId) => {
    const studentId = localStorage.getItem("userId");
    const studentName = localStorage.getItem("name");

    if (!studentId || !studentName) {
      return Swal.fire("Error", "Student info not found. Please login again.", "error");
    }

    socketRef.current.emit("chat-request", {
      studentId,
      studentName,
      mentorId,
    });

    Swal.fire("Request Sent!", "Mentor will be notified.", "success");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">👨‍🏫 Mentor List</h2>
      <div className="row">
        {mentors.length > 0 ? (
          mentors.map((mentor) => (
            <div className="col-md-4" key={mentor._id}>
              <div className="card mb-4 shadow-sm rounded-4 border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <FaUserTie size={24} className="me-2 text-primary" />
                    <h5 className="mb-0">{mentor.name}</h5>
                  </div>
                  <p className="mb-1">
                    <strong>Email:</strong> {mentor.email}
                  </p>
                  <p className="mb-3">
                    <strong>Status:</strong>{" "}
                    {mentor.status === "online" && (
                      <span className="text-success fw-bold">
                        <FaCircle size={10} className="me-1" /> Online
                      </span>
                    )}
                    {mentor.status === "busy" && (
                      <span className="text-warning fw-bold">
                        <FaCircle size={10} className="me-1" /> Busy
                      </span>
                    )}
                    {mentor.status === "offline" && (
                      <span className="text-danger fw-bold">
                        <FaCircle size={10} className="me-1" /> Offline
                      </span>
                    )}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleViewProfile(mentor._id)}
                    >
                      View Profile
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleChatNow(mentor._id)} // ✅ FIXED HERE
                    >
                      Chat Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-muted">No mentors found.</div>
        )}
      </div>
    </div>
  );
};

export default MentorList; */

/*import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaCircle, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

const MentorList = () => {
  const [mentors, setMentors] = useState([]);
  const navigate = useNavigate();
  const socketRef = useRef(null);

useEffect(() => {
  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/mentors`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMentors(res.data.mentors);
    } catch (err) {
      console.error("Error fetching mentors", err);
      Swal.fire("Error", "Failed to load mentor list", "error");
    }
  };

  fetchMentors();

  if (!socketRef.current) {
    socketRef.current = io(import.meta.env.VITE_API_URL);
  }

  // 🔁 Already present
  socketRef.current.on("mentor-status-updated", ({ mentorId, status }) => {
    setMentors((prevMentors) =>
      prevMentors.map((mentor) =>
        mentor._id === mentorId ? { ...mentor, status } : mentor
      )
    );

     const statusLabel =
      status === "online"
        ? "🟢 Online"
        : status === "busy"
        ? "🟠 Busy"
        : "🔴 Offline";

    const mentor = mentors.find((m) => m._id === mentorId);

    if (mentor) {
      Swal.fire({
        title: "Mentor Status Changed",
        text: `${mentor.name} is now ${statusLabel}`,
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });

  // 🔥 ADD THIS BLOCK
  socketRef.current.on("chat-request-accepted", ({ topicId }) => {
    console.log("✅ Chat request accepted, navigating to:", topicId);
    navigate(`/student/chat/${topicId}`);
  });

  return () => {
    if (socketRef.current) {
       socketRef.current.off("mentor-status-updated");
      socketRef.current.disconnect();
    }
  };
}, []);


  const handleViewProfile = (mentorId) => {
    navigate(`/mentor-profile/${mentorId}`);
  };

  const handleChatNow = (mentorId) => {
    const studentId = localStorage.getItem("userId");
    const studentName = localStorage.getItem("name");

    if (!studentId || !studentName) {
      return Swal.fire("Error", "Student info not found. Please login again.", "error");
    }

    socketRef.current.emit("chat-request", {
      studentId,
      studentName,
      mentorId,
    });

    Swal.fire("Request Sent!", "Mentor will be notified.", "success");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">👨‍🏫 Mentor List</h2>
      <div className="row">
        {mentors.length > 0 ? (
          mentors.map((mentor) => (
            <div className="col-md-4" key={mentor._id}>
              <div className="card mb-4 shadow-sm rounded-4 border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <FaUserTie size={24} className="me-2 text-primary" />
                    <h5 className="mb-0">{mentor.name}</h5>
                  </div>
                  <p className="mb-1">
                    <strong>Email:</strong> {mentor.email}
                  </p>
                  <p className="mb-3">
                    <strong>Status:</strong>{" "}
                    {mentor.status === "online" && (
                      <span className="text-success fw-bold">
                        <FaCircle size={10} className="me-1" /> Online
                      </span>
                    )}
                    {mentor.status === "busy" && (
                      <span className="text-warning fw-bold">
                        <FaCircle size={10} className="me-1" /> Busy
                      </span>
                    )}
                    {mentor.status === "offline" && (
                      <span className="text-danger fw-bold">
                        <FaCircle size={10} className="me-1" /> Offline
                      </span>
                    )}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleViewProfile(mentor._id)}
                    >
                      View Profile
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleChatNow(mentor._id)} // ✅ FIXED HERE
                    >
                      Chat Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-muted">No mentors found.</div>
        )}
      </div>
    </div>
  );
};

export default MentorList;
*/

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaCircle, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { useMentor } from "../../context/MentorContext";
import { useTopic } from "../../context/TopicContent";

const MentorList = () => {
  const [mentors, setMentors] = useState([]);
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const { mentorId, setMentorId } = useMentor();
  const { topicId } = useTopic();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/mentors`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setMentors(res.data.mentors);
      } catch (err) {
        console.error("Error fetching mentors", err);
        Swal.fire("Error", "Failed to load mentor list", "error");
      }
    };

    fetchMentors();

    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL);
    }

    // ✅ Listen for live mentor status updates
    socketRef.current.on("mentor-status-updated", ({ mentorId, status }) => {
      setMentors((prevMentors) => {
        const updatedMentors = prevMentors.map((mentor) =>
          mentor._id === mentorId ? { ...mentor, status } : mentor
        );

        // ✅ Find mentor using updated list
        const mentor = updatedMentors.find((m) => m._id === mentorId);

        if (mentor) {
          const statusLabel =
            status === "online"
              ? "🟢 Online"
              : status === "busy"
              ? "🟠 Busy"
              : "🔴 Offline";

          Swal.fire({
            title: "Mentor Status Changed",
            text: `${mentor.name} is now ${statusLabel}`,
            icon: "info",
            timer: 2000,
            showConfirmButton: false,
          });
        }

        return updatedMentors;
      });
    });

    // ✅ Navigate to chat when mentor accepts
    socketRef.current.on("chat-request-accepted", ({ mentorId }) => {
      console.log("✅ Chat request accepted, navigating to:", topicId);
      setMentorId(mentorId);
      console.log(topicId)
      const roomId = `${localStorage.getItem("userId")}#${mentorId}#${topicId}`;
      console.log(roomId)
      navigate(`/student/chat/${roomId}`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("mentor-status-updated");
        socketRef.current.off("chat-request-accepted");
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleViewProfile = (mentorId) => {
    navigate(`/mentor-profile/${mentorId}`);
  };

  const handleChatNow = (mentorId) => {
    const studentId = localStorage.getItem("userId");
    const studentName = localStorage.getItem("name");
    setMentorId(mentorId);
    const roomId = `${localStorage.getItem("userId")}#${mentorId}#${topicId}`;
          console.log(roomId)

    if (!studentId || !studentName) {
      return Swal.fire(
        "Error",
        "Student info not found. Please login again.",
        "error"
      );
    }

    if (!socketRef.current || !socketRef.current.connected) {
      socketRef.current = io(import.meta.env.VITE_API_URL);
      socketRef.current.on("connect", () => {
        console.log("🔗 Student socket connected:", socketRef.current.id);

        socketRef.current.emit("student-online", studentId); // ✅ Send this
        console.log(roomId)
        socketRef.current.emit("chat-request", {
          studentId,
          "studentName": roomId,
          mentorId,
          topicId
        });

        Swal.fire("Request Sent!", "Mentor will be notified.", "success");
      });
    } else {
      console.log("📤 Emitting chat-request from student:", studentName);
      socketRef.current.emit("student-online", studentId); // ✅ Send this
      socketRef.current.emit("chat-request", {
        studentId,
        "studentName": roomId,
        mentorId,
      });

      Swal.fire("Request Sent!", "Mentor will be notified.", "success");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">👨‍🏫 Mentor List</h2>
      <div className="row">
        {mentors.length > 0 ? (
          mentors.map((mentor) => (
            <div className="col-md-4" key={mentor._id}>
              <div className="card mb-4 shadow-sm rounded-4 border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <FaUserTie size={24} className="me-2 text-primary" />
                    <h5 className="mb-0">{mentor.name}</h5>
                  </div>
                  <p className="mb-1">
                    <strong>Email:</strong> {mentor.email}
                  </p>
                  <p className="mb-3">
                    <strong>Status:</strong>{" "}
                    {mentor.status === "online" && (
                      <span className="text-success fw-bold">
                        <FaCircle size={10} className="me-1" /> Online
                      </span>
                    )}
                    {mentor.status === "busy" && (
                      <span className="text-warning fw-bold">
                        <FaCircle size={10} className="me-1" /> Busy
                      </span>
                    )}
                    {mentor.status === "offline" && (
                      <span className="text-danger fw-bold">
                        <FaCircle size={10} className="me-1" /> Offline
                      </span>
                    )}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleViewProfile(mentor._id)}
                    >
                      View Profile
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleChatNow(mentor._id)}
                    >
                      Chat Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-muted">No mentors found.</div>
        )}
      </div>
    </div>
  );
};

export default MentorList;
