const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

// Register Controller
exports.registerUser = async (req, res) => {
  const { name, email, password, role, course } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      course,
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error("Registration error:", err); // 👈 helpful for debugging
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

// Login Controller
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        course: user.course,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Get all mentors with online status
exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor" }).select("name email status");

    res.status(200).json({ mentors });
  } catch (err) {
    console.error("Error fetching mentors:", err);
    res.status(500).json({ message: "Failed to load mentor list" });
  }
};

