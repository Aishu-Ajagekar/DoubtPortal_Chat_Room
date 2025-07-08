import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserGraduate,
  FaBook,
} from "react-icons/fa";
import axios from "axios";
import "../../public/css/Register.css"; // optional if styling separately
import Swal from "sweetalert2";

function RegisterCard() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    course: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        formData
      );
      // alert("Registered successfully! Please login.");
      Swal.fire(
        "Success",
        "Registered successfully! Please login.!",
        "success"
      );
      window.location.href = "/login";
    } catch (err) {
      // alert(err.response?.data?.message || "Registration failed");
      Swal.fire(
        "Error",
        err.response?.data?.message || "Registration failed",
        "error"
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="register-card shadow-lg rounded p-4 bg-white"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <h3 className="text-center mb-4">📝 Create Account</h3>
        <form onSubmit={handleRegister}>
          <div className="form-group mb-3">
            <label>Name</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaUser />
              </span>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaEnvelope />
              </span>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter email"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaLock />
              </span>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group mb-4">
            <label>Role</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaUserGraduate />
              </span>
              <select
                name="role"
                className="form-select"
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>
          </div>

          <div className="form-group mb-3">
            <label>Choose Course</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaBook />
              </span>
              <select
                name="course"
                className="form-select"
                onChange={handleChange}
                required
              >
                <option value="">-- Select a course --</option>
                <option value="python">Python Full Stack</option>
                <option value="mern">MERN Full Stack</option>
                <option value="java">Java Full Stack</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100 fw-bold">
            Register
          </button>
        </form>
        <p className="text-center mt-3 small">
          Already registered? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterCard;
