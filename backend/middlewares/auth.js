const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.cookies.access_token;

    if (!token) {
      res.status(401);
      return next(new Error("Not authorized, no token"));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user id from token and assign to req
    req.user = { _id: decoded._id };
    next();
  } catch (error) {
    res.status(401);
    return next(new Error("Not authorized"));
  }
};

module.exports = protect;
