const express = require("express");
const { loginUser, signupUser, googleAuth } = require("../controllers/auth");

const router = express.Router();

// Login Route
router.post("/login", loginUser);

// Signup Route
router.post("/signup", signupUser);

// SIGN WITH GOOGLE
router.post("/google", googleAuth);

module.exports = router;
