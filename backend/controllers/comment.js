const Comment = require("../models/Comment");
const Video = require("../models/Video");

const addComment = async (req, res, next) => {
  const { videoId, description } = req.body;
  if (!videoId || !description) {
    res.status(400);
    return next(new Error("videoId & description fields are required"));
  }
  try {
    const comment = await Comment.create({
      videoId,
      description,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findOne({ _id: commentId });

    if (!comment) {
      res.status(400);
      return next(new Error("Comment does not exists"));
    }

    const video = await Video.findOne({ _id: comment.videoId });

    if (req.user._id === comment.userId || req.user._id === video.userId) {
      await Comment.findByIdAndDelete(commentId);
      res.status(200).json({
        success: true,
        message: "Comment has been deleted",
      });
    } else {
      res.status(400);
      return next(new Error("You can delete only your comment"));
    }
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  const { videoId } = req.params;
  try {
    const comments = await Comment.find({ videoId });
    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  deleteComment,
  getComments,
};
