const express = require("express");
const {
  addVideo,
  addView,
  deleteVideo,
  getVideo,
  getVideosByTags,
  getVideosBySearch,
  randomVideos,
  subscribedVideos,
  trendingVideos,
  updateVideo,
} = require("../controllers/video");
const protect = require("../middlewares/auth");

const router = express.Router();

router.post("/", protect, addVideo);
router.put("/:videoId", protect, updateVideo);
router.delete("/:videoId", protect, deleteVideo);
router.get("/trending", trendingVideos);
router.get("/random", randomVideos);
router.get("/tags", getVideosByTags);
router.get("/search", getVideosBySearch);
router.get("/sub", protect, subscribedVideos);
router.get("/:videoId", getVideo);
router.put("/view/:videoId", addView);

module.exports = router;
