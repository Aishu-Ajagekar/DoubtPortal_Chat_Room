const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllMentors,
} = require("../controllers/authController");

const { requireSignIn } = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/mentors",requireSignIn , getAllMentors);



module.exports = router;
