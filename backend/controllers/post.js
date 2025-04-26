import { v2 as cloudinary } from "cloudinary";
import { BadRequestException } from "../exceptions/badRequestException.js";
import { ErrorCodes } from "../exceptions/root.js";
import Post from "../models/post.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";

export const createPost = async (req, res, next) => {
  const { text } = req.body;
  let { img } = req.body;

  const userId = req.user._id.toString();
  if (!text && !img) {
    return next(
      new BadRequestException(
        "Post must have text or image",
        ErrorCodes.INVALID_REQUEST
      )
    );
  }
  if (img) {
    const imgPostResponse = await cloudinary.uploader.upload(img);
    img = imgPostResponse.secure_url;
  }
  const newPost = new Post({
    user: userId,
    text,
    img,
  });
  await newPost.save();
  res.status(201).json({ success: true, data: newPost });
};
export const deletePost = async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    return next(
      new BadRequestException("Post not found!", ErrorCodes.INVALID_REQUEST)
    );
  }
  if (post.user.toString() !== req.user._id.toString()) {
    return next(
      new BadRequestException("Unauthorized", ErrorCodes.INVALID_CREDENTIAL)
    );
  }
  if (post.img) {
    await cloudinary.uploader.destroy(post.img.split("/").pop().split(".")[0]);
  }
  await Post.findByIdAndDelete(post._id);
  res
    .status(200)
    .json({ success: true, message: "Post deleted successfully!" });
};
export const commentOnPost = async (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user._id;
  if (!text) {
    return next(
      new BadRequestException(
        "Text field is required",
        ErrorCodes.INVALID_REQUEST
      )
    );
  }
  const post = await Post.findById(id);
  if (!post) {
    return next(
      new BadRequestException("Post not found!", ErrorCodes.INVALID_REQUEST)
    );
  }
  const comment = { user: userId, text };
  post.comments.push(comment);
  console.log(post);
  await post.save();
  res.status(200).json({ success: true, data: post });
};
export const likeUnlikePost = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const post = await Post.findById(id);

  if (!post) {
    return next(
      new BadRequestException("Post not found!", ErrorCodes.INVALID_REQUEST)
    );
  }
  const theUserLiked = post.likes.some(
    (lid) => lid.toString() === userId.toString()
  );

  if (theUserLiked) {
    await Post.findByIdAndUpdate(id, { $pull: { likes: userId } });
    await User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { likedPosts: post._id } }
    );
    res
      .status(200)
      .json({ success: true, message: "post unliked successfully!" });
  } else {
    await Post.findByIdAndUpdate(id, { $push: { likes: userId } });
    await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { likedPosts: post._id } }
    );
    res
      .status(200)
      .json({ success: true, message: "post liked successfully!" });
    const newNotification = new Notification({
      from: userId,
      to: post.user,
      type: "like",
    });
    await newNotification.save();
  }
};
export const getAllPosts = async (req, res, next) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate([
      { path: "user", select: "-password" },
      { path: "comments", populate: [{ path: "user", select: "-password" }] },
    ]);
  if (posts.lenth === 0) {
    return res.status(200).json({
      success: true,
      data: [],
    });
  }
  res.status(200).json({ success: true, data: posts });
};
export const getLikedPosts = async (req, res, next) => {
  const { id: userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return next(
      new BadRequestException("User not found!", ErrorCodes.USER_NOT_FOUND)
    );
  }
  const likedPosts = await Post.find({
    _id: { $in: user.likedPosts },
  }).populate([
    { path: "user", select: "-password" },
    {
      path: "comments",
      populate: [
        {
          path: "user",
          select: "-password",
        },
      ],
    },
  ]);
  res.status(200).json({
    success: true,
    data: likedPosts,
  });
};
export const getFollowingPosts = async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    return next(
      new BadRequestException("User not found", ErrorCodes.USER_NOT_FOUND)
    );
  }
  const following = user.following;
  const followingPosts = await Post.find({ user: { $in: following } })
    .sort({
      createdAt: -1,
    })
    .populate([
      { path: "user", select: "-password" },
      { path: "comments", populate: [{ path: "user", select: "-1" }] },
    ]);
  res.status(200).json({ success: true, data: followingPosts });
};
export const getUserPosts = async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    return next(
      new BadRequestException("User not found!", ErrorCodes.USER_NOT_FOUND)
    );
  }
  const posts = await Post.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate([
      {
        path: "user",
        select: "-password",
      },
      {
        path: "comments",
        populate: [
          {
            path: "user",
            select: "-password",
          },
        ],
      },
    ]);
  res.status(200).json({ success: true, data: posts });
};
