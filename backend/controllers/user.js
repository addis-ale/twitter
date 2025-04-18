import { v2 as cloudinary } from "cloudinary";
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
    return next(
      new BadRequestException(
        "You can`t follow yourself!",
        ErrorCodes.INVALID_REQUEST
      )
    );
  }

  const userToModify = await User.findById(id);
  if (!userToModify) {
    return next(
      new BadRequestException("User not Found", ErrorCodes.USER_NOT_FOUND)
    );
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
export const updateUser = async (req, res, next) => {
  const { fullName, username, bio, link, newPassword, currentPassword } =
    req.body;
  const { profileImg, coverImg } = req.body;
  let user = req.user;
  if ((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
    return next(
      new BadRequestException(
        "Please provide both new password and current password",
        ErrorCodes.INVALID_REQUEST
      )
    );
  }
  if (newPassword && currentPassword) {
    const isMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!isMatch) {
      return next(
        new BadRequestException(
          "Your password is incorrect",
          ErrorCodes.INVALID_CREDENTIAL
        )
      );
    }
    if (newPassword.lenth < 6) {
      return next(
        new BadRequestException(
          "new password must be atleast 6 characters!",
          ErrorCodes.INVALID_REQUEST
        )
      );
    }
    //update the password
    user.password = bcrypt.hashSync(newPassword, 10);
    //update coverImg and profileImg
  }
  if (profileImg) {
    if (user.profileImg) {
      const imgId = user.profileImg.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    const uploadResponse = await cloudinary.uploader.upload(profileImg);
    profileImg = uploadResponse.secure_url;
  }
  if (coverImg) {
    if (user.coverImg) {
      const imgId = await user.coverImg.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    const uploadResponse = await cloudinary.uploader.upload(coverImg);
    coverImg = uploadResponse.secure_url;
  }
  user.fullName = fullName || user.fullName;
  user.username = username || user.username;
  user.bio = bio || user.bio;
  user.link = link || user.link;
  user.email = email || user.email;
  user.profileImg = profileImg || user.profileImg;
  user.coverImg = coverImg || user.coverImg;
  user = await user.save();
  const { password, ...userData } = user;
  return res.status(200).json({ success: true, data: userData });
};
