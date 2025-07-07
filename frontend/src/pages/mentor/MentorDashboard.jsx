// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";

// import { io } from "socket.io-client";

// const socket = io(import.meta.env.VITE_API_URL);

// const MentorDashboard = () => {
//   const [topics, setTopics] = useState([]);
//   const [newTopic, setNewTopic] = useState("");

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//   const mentorId = localStorage.getItem("userId");
//   if (mentorId) {
//     console.log("🚀 Emitting mentor-online:", mentorId);
//     socket.emit("mentor-online", mentorId);
//   }

//   return () => {
//     socket.disconnect(); // disconnect when tab closed
//   };
// }, []);

//   // Fetch topics
//   const fetchTopics = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/v1/topics/get-all-topics`,
//         {
//           headers: {
//             Authorization: token,
//           },
//         }
//       );
//       setTopics(res.data.topics);
//     } catch (err) {
//       console.error("Error fetching topics:", err);
//       Swal.fire("Error", "Failed to fetch topics", "error");
//     }
//   };

//   // Create a topic
//   const handleCreateTopic = async () => {
//     if (!newTopic.trim()) {
//       return Swal.fire("Oops!", "Please enter a topic name", "warning");
//     }

//     try {
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/v1/topics/create`,
//         { name: newTopic },
//         {
//           headers: {
//             Authorization: token,
//           },
//         }
//       );

//       Swal.fire("Success!", "Topic created successfully", "success");
//       setNewTopic("");
//       fetchTopics(); // Refresh list
//     } catch (err) {
//       Swal.fire(
//         "Error",
//         err.response?.data?.message || "Creation failed",
//         "error"
//       );
//     }
//   };

//   useEffect(() => {
//     fetchTopics();
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h3 className="text-center mb-4">🎓 Mentor Dashboard</h3>

//       {/* Create Room Section */}
//       <div className="card p-4 shadow-sm mb-5">
//         <h5>Create New Subject Room</h5>
//         <div className="input-group">
//           <input
//             type="text"
//             value={newTopic}
//             onChange={(e) => setNewTopic(e.target.value)}
//             placeholder="Enter topic (e.g., DBMS, Java)"
//             className="form-control"
//           />
//           <button className="btn btn-success" onClick={handleCreateTopic}>
//             ➕ Create
//           </button>
//         </div>
//       </div>

//       {/* Topic List as Cards */}
//       <div className="row">
//         {Array.isArray(topics) && topics.length > 0 ? (
//           topics.map((topic) => (
//             <div className="col-md-4" key={topic._id}>
//               <div className="card shadow-sm mb-4 p-3">
//                 <h5 className="card-title text-primary">{topic.name}</h5>
//                 <button
//                   className="btn btn-outline-primary mt-2"
//                   onClick={() => (window.location.href = `/chat/${topic._id}`)}
//                 >
//                   🔗 Join Room
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center text-muted">No topics created yet.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MentorDashboard;

import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import socket from "../../utils/socket"; // ✅ shared instance

const MentorDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const mentorId = localStorage.getItem("userId");
    if (!mentorId) return;

    // ✅ Notify server that this mentor is online
    console.log("📡 Emitting mentor-online for:", mentorId);

    // Wait until socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("mentor-online", mentorId);

    // 🧼 Clean previous listeners before adding new one
    socket.off("chat-request-received");

    // ✅ Listen for incoming student chat request
    socket.on("chat-request-received", ({ studentId, studentName }) => {
      console.log("📩 Received request from student:", studentName);

      Swal.fire({
        icon: "info",
        title: "New Chat Request",
        html: `<strong>${studentName}</strong> wants to chat with you.`,
        showCancelButton: true,
        confirmButtonText: "✅ Accept",
        cancelButtonText: "❌ Reject",
      }).then((result) => {
        if (result.isConfirmed) {
          // ✅ Notify student of acceptance
          socket.emit("chat-request-accepted", {
            mentorId,
            studentId,
          });

          const topicId = `${mentorId}_${studentId}`;
          // const topicId = res.data.topicId;
          navigate(`/chat/${topicId}`);
        } else {
          // ❌ Notify student of rejection
          socket.emit("chat-request-rejected", {
            mentorId,
            studentId,
          });
        }
      });
    });

    return () => {
      socket.off("chat-request-received");
    };
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">👨‍🏫 Mentor Dashboard</h2>
      <p className="text-center text-muted mt-3">
        You are <strong>online</strong>. Waiting for student requests...
      </p>
    </div>
  );
};

export default MentorDashboard;
