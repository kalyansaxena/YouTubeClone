const express = require("express");
const {
  updateUser,
  deleteUser,
  getUser,
  subscribeUser,
  unsubscribeUser,
  likeVideo,
  dislikeVideo,
} = require("../controllers/user");
const protect = require("../middlewares/auth");

const router = express.Router();

// update a user
router.put("/:id", protect, updateUser);

// delete a user
router.delete("/:id", protect, deleteUser);

// get a user
router.get("/:id", getUser);

// subscribe a user
router.put("/sub/:id", protect, subscribeUser);

// unsubscribe a user
router.put("/unsub/:id", protect, unsubscribeUser);

// like a video
router.put("/like/:videoId", protect, likeVideo);

// dislike a video
router.put("/dislike/:videoId", protect, dislikeVideo);

module.exports = router;
