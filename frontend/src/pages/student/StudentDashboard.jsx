import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const courses = ["MERN Full Stack", "Python Full Stack", "Java Full Stack"];

  // Fetch topics when course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchTopicsForCourse(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchTopicsForCourse = async (course) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/topics/${course}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setTopics(res.data.topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const handleTopicClick = (topic) => {
    navigate("/mentor/mentor-list");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Welcome to the Student Dashboard 🎓</h2>

      {/* Course Cards */}
      {!selectedCourse ? (
        <>
          <h5>Select a Course:</h5>
          <div className="row">
            {courses.map((course, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <div
                  className="card shadow-sm p-3 text-center rounded-4"
                  onClick={() => setSelectedCourse(course)}
                  style={{ cursor: "pointer" }}
                >
                  <h5>{course}</h5>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h5 className="mb-3">
            Topics for <span className="text-primary">{selectedCourse}</span>
          </h5>
          <div className="row">
            {topics.length > 0 ? (
              topics.map((topic, index) => (
                <div className="col-md-4 mb-3" key={index}>
                  <div
                    className="card shadow-sm p-3 text-center rounded-4"
                    onClick={() => handleTopicClick(topic)}
                    style={{ cursor: "pointer" }}
                  >
                    <h6>{topic}</h6>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted">No topics found for this course.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
