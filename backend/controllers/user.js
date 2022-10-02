const User = require("../models/User");
const Video = require("../models/Video");

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  if (id === req.user._id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        success: true,
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  } else {
    res.status(401);
    return next(new Error("You can update only your account!"));
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  if (id === req.user._id) {
    try {
      await User.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "User has been deleted.",
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  } else {
    res.status(401);
    return next(new Error("You can delete only your account!"));
  }
};

const getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const subscribeUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $push: { subscribedUsers: req.params.id },
    });

    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });

    res.status(200).json({
      success: true,
      message: "Subscription successfull",
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const unsubscribeUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { subscribedUsers: req.params.id },
    });

    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });

    res.status(200).json({
      success: true,
      message: "Unsubscription successfull",
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const likeVideo = async (req, res, next) => {
  const videoId = req.params.videoId;
  const userId = req.user._id;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    });

    res.status(200).json({
      success: true,
      message: "Video has been liked!",
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const dislikeVideo = async (req, res, next) => {
  const videoId = req.params.videoId;
  const userId = req.user._id;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    });

    res.status(200).json({
      success: true,
      message: "Video has been disliked.",
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getUser,
  subscribeUser,
  unsubscribeUser,
  likeVideo,
  dislikeVideo,
};
