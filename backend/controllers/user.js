import { BadRequestException } from "../exceptions/badRequestException.js";
import { ErrorCodes } from "../exceptions/root.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";

export const getUserProfile = async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ username }).select("-password");
  if (!user) {
    return next(
      new BadRequestException("No user Found!", ErrorCodes.USER_NOT_FOUND)
    );
  }
  res.status(200).json({
    success: true,
    data: user,
  });
};
export const followUnfollowUser = async (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.user;

  if (currentUser._id.toString() === id) {
    return res.status(400).json("You can't follow yourself!");
  }

  const userToModify = await User.findById(id);
  if (!userToModify) {
    return res.status(404).json("User not found!");
  }

  const isFollowing = currentUser.following.some(
    (fid) => fid.toString() === id
  );

  if (isFollowing) {
    await User.findByIdAndUpdate(id, {
      $pull: { followers: currentUser._id },
    });
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: id },
    });
    //TODO: return the id

    res.status(200).json("Unfollowed successfully!");
  } else {
    await User.findByIdAndUpdate(id, {
      $push: { followers: currentUser._id },
    });
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: id },
    });
    const newNotification = new Notification({
      from: currentUser._id,
      to: id,
      type: "follow",
    });
    await newNotification.save();
    //TODO: return the id
    res.status(200).json("Followed successfully!");
  }
};
export const getSuggestedUser = async (req, res, next) => {
  const userId = req.user._id;

  const userFollowedByMe = await User.findById(userId).select("following");

  const users = await User.aggregate([
    {
      $match: { _id: { $ne: userId } },
    },
    {
      $sample: { size: 10 },
    },
  ]);

  const filteredUsers = users.filter(
    (user) => !userFollowedByMe.following.includes(user._id.toString())
  );

  const suggestedUsers = filteredUsers.slice(0, 4).map((user) => {
    delete user.password;
    return user;
  });

  res.status(200).json({ success: true, data: suggestedUsers });
};
