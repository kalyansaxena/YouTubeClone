const User = require("../models/User");
const Video = require("../models/Video");

const addVideo = async (req, res, next) => {
  const { title, description, imgUrl, videoUrl } = req.body;

  if (!title || !description || !imgUrl || !videoUrl) {
    res.status(400);
    return next(
      new Error("title, description, imgUrl & videoUrl fields are required")
    );
  }

  try {
    const video = await Video.create({
      userId: req.user._id,
      title,
      description,
      imgUrl,
      videoUrl,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      video,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    return next(error);
  }
};

const updateVideo = async (req, res, next) => {
  const { videoId } = req.params;
  try {
    const video = await Video.findById(videoId);

    if (!video) {
      res.status(400);
      return next(new Error("Video does not exists"));
    }

    if (req.user._id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        updatedVideo,
      });
    } else {
      res.status(401);
      return next(new Error("You can update only your video!"));
    }
  } catch (error) {
    console.log(error);
    res.status(400);
    return next(error);
  }
};

const deleteVideo = async (req, res, next) => {
  const { videoId } = req.params;
  try {
    const video = await Video.findById(videoId);

    if (!video) {
      res.status(400);
      return next(new Error("Video does not exists"));
    }

    if (req.user._id === video.userId) {
      await Video.findByIdAndDelete(videoId);

      res.status(200).json({
        success: true,
        message: "Video deletion successfull",
      });
    } else {
      res.status(401);
      return next(new Error("You can only delete your video!"));
    }
  } catch (error) {
    console.log(error);
    res.status(400);
    return next(error);
  }
};

const getVideo = async (req, res, next) => {
  const { videoId } = req.params;
  try {
    const video = await Video.findById(videoId);

    if (!video) {
      res.status(400);
      return next(new Error("Video does not exists"));
    }

    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    return next(error);
  }
};

const addView = async (req, res, next) => {
  const { videoId } = req.params;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $inc: { views: 1 },
    });
    res.status(200).json({
      success: true,
      message: "The view has been increased!",
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    return next(error);
  }
};

const randomVideos = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);

    if (!videos) {
      res.status(400);
      return next(new Error("Error fetching videos"));
    }

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    return next(error);
  }
};

const trendingVideos = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });

    if (!videos) {
      res.status(400);
      return next(new Error("Error fetching trending videos"));
    }

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    return next(error);
  }
};

const subscribedVideos = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map((channelId) => {
        return Video.find({ userId: channelId });
      })
    );

    res.status(200).json({
      success: true,
      videos: list.flat().sort((a, b) => b.createdAt - a.createdAt),
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    return next(error);
  }
};

const getVideosByTags = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);

    if (!videos) {
      res.status(400);
      return next(new Error("Error fetching videos by tags"));
    }

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    return next(error);
  }
};

const getVideosBySearch = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(20);

    if (!videos) {
      res.status(400);
      return next(new Error("Error fetching videos by tags"));
    }

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    return next(error);
  }
};

module.exports = {
  addVideo,
  addView,
  updateVideo,
  deleteVideo,
  getVideo,
  getVideosByTags,
  getVideosBySearch,
  randomVideos,
  trendingVideos,
  subscribedVideos,
};
