const express = require("express");
const {
  getComments,
  addComment,
  deleteComment,
} = require("../controllers/comment");
const protect = require("../middlewares/auth");

const router = express.Router();

router.post("/", protect, addComment);
router.delete("/:commentId", protect, deleteComment);
router.get("/:videoId", getComments);

module.exports = router;
