const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return next(new Error("email & password fields are required"));
  }

  try {
    // check if user exists or not
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400);
      return next(new Error("User does not exists"));
    }

    const match = await bcryptjs.compare(password, user.password);

    if (!match) {
      res.status(400);
      return next(
        new Error("Invalid credentials, please try again with correct password")
      );
    }

    const token = generateToken(user._id);

    res.cookie("access_token", token).status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    return next(error);
  }
};

const signupUser = async (req, res, next) => {
  const { name, email, password, img } = req.body;

  if (!name || !email || !password || !img) {
    res.status(400);
    return next(new Error("name, email, password & img fields are required"));
  }

  try {
    // check if user already exists
    const exists = await User.findOne({ email });

    if (exists) {
      res.status(400);
      return next(new Error("Email already in use"));
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      img,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.cookie("access_token", token).status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    return next(error);
  }
};

const googleAuth = async (req, res, next) => {
  const { name, email, img } = req.body;
  try {
    // check if user exists or not
    const user = await User.findOne({ email });

    if (user) {
      const token = generateToken(user._id);

      res.cookie("access_token", token).status(200).json({
        success: true,
        user,
      });
    } else {
      // Create new user from Google Provider
      const newUserFromGoogle = await User.create({
        name,
        email,
        img,
        fromGoogle: true,
      });
      const token = generateToken(newUserFromGoogle._id);

      res.cookie("access_token", token).status(200).json({
        success: true,
        user: newUserFromGoogle,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400);
    return next(error);
  }
};

module.exports = {
  loginUser,
  signupUser,
  googleAuth,
};
