import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import socket from "../utils/socket";


function Navbar({theme , setTheme}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
  const role = localStorage.getItem("role");

  if (role === "mentor") {
    const mentorId = localStorage.getItem("userId");
    if (mentorId) {
      socket.emit("mentor-offline", mentorId); // ✅ Notify backend
    }
  }

  localStorage.clear();
  navigate("/login");
};


  const handleLinkClick = () => {
    const navbar = document.querySelector(".navbar-collapse");
    const toggler = document.querySelector(".navbar-toggler");
    if (navbar?.classList.contains("show")) {
      toggler?.click();
    }
  };

  return (
    <nav
      className={`navbar sticky-top navbar-expand-lg ${
        theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-primary"
      } px-4 shadow`}
    >
      <Link
        className="navbar-brand fw-bold text-white"
        to="/"
        onClick={handleLinkClick}
      >
        💬 <span style={{ letterSpacing: "1px" }}>DoubtPortal</span>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="collapse navbar-collapse justify-content-between"
        id="navbarNav"
      >
        {/* Center Menu */}
        <ul className="navbar-nav mx-auto gap-3 text-center">
          <li className="nav-item">
            <Link
              className="nav-link text-white fw-semibold"
              to="/"
              onClick={handleLinkClick}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-white fw-semibold"
              to="/about"
              onClick={handleLinkClick}
            >
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-white fw-semibold"
              to="/contact"
              onClick={handleLinkClick}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Right Side */}
        <ul className="navbar-nav ms-auto gap-3 align-items-center">
          {/* Theme Toggle */}
          <li className="nav-item">
            <button
              className={`btn btn-sm ${
                theme === "dark" ? "btn-light" : "btn-dark"
              }`}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </li>

          {!token && (
            <>
              <li className="nav-item">
                <Link
                  className="nav-link text-white fw-semibold"
                  to="/login"
                  onClick={handleLinkClick}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white fw-semibold"
                  to="/register"
                  onClick={handleLinkClick}
                >
                  Register
                </Link>
              </li>
            </>
          )}

          {token && role === "student" && (
            <li className="nav-item">
              <Link
                className="nav-link text-white"
                to="/student/chat"
                onClick={handleLinkClick}
              >
                🎓 Student Chat
              </Link>
            </li>
          )}

          {token && role === "mentor" && (
            <li className="nav-item">
              <Link
                className="nav-link text-white"
                to="/mentor/dashboard"
                onClick={handleLinkClick}
              >
                👨‍🏫 Mentor Dashboard
              </Link>
            </li>
          )}

          {token && (
            <>
              <li className="nav-item text-white fw-semibold">Hi, {name}</li>
              <li className="nav-item">
                <button
                  className="btn btn-sm btn-light ms-1"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
