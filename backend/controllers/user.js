import { BadRequestException } from "../exceptions/badRequestException.js";
import { ErrorCodes } from "../exceptions/root.js";
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
    res.status(200).json("Unfollowed successfully!");
  } else {
    await User.findByIdAndUpdate(id, {
      $push: { followers: currentUser._id },
    });
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: id },
    });
    res.status(200).json("Followed successfully!");

    // TODO: send notification
  }
};
