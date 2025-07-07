const JWT = require("jsonwebtoken");
const userModel = require("../models/User");

// Middleware to check JWT token
exports.requireSignIn = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access Denied. No token provided." });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.userId, role: decoded.role }; // ✅ fix here
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Check if user is mentor
exports.isMentor = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user || user.role !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Mentor access only",
      });
    }
    next();
  } catch (error) {
    console.error("Mentor check error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking mentor access",
      error: error.message,
    });
  }
};
