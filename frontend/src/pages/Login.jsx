import React, { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import "../../public/css/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function LoginCard({ theme }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        formData
      );

      // Save to localStorage
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      Swal.fire("Success", "Login successful!", "success");

      // Redirect based on role
      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "mentor") {
        navigate("/mentor");
      } else {
        navigate("/");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Login failed",
        "error"
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className={`login-card shadow-lg rounded ${
          theme === "dark" ? "dark" : "light"
        }`}
      >
        <h3 className="text-center mb-4">🔐 Welcome Back</h3>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label>Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaUser />
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
          <div className="form-group mb-4">
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
          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Login
          </button>
        </form>
        <p className="text-center mt-3 small">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default LoginCard;
