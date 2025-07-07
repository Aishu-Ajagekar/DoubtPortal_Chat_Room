import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentChat from "./pages/student/StudentChat";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import Navbar from "./components/Navbar";
import ChatRoom from "./components/ChatRoom";
import MentorList from "./pages/mentor/MentorList";
import StudentDashboard from "./pages/student/StudentDashboard";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-mode" : "light-mode";
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <>
      <Router>
        <Navbar theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/" element={<Register theme={theme} />} />
          <Route path="/register" element={<Register theme={theme} />} />
          <Route path="/login" element={<Login theme={theme} />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student/chat/:topicId" element={<StudentChat theme={theme} />} />
          <Route path="/mentor" element={<MentorDashboard theme={theme} />} />
          <Route path="/mentor/mentor-list" element={<MentorList />} />
           {/* <Route path="/chat/:topicId" element={<StudentChat />} /> */}
           <Route path="/chat/:topicId" element={<ChatRoom />} />
          {/* <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentChat />
            </ProtectedRoute>
          }
        /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
