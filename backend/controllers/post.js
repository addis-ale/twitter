import { v2 as cloudinary } from "cloudinary";
import { BadRequestException } from "../exceptions/badRequestException.js";
import { ErrorCodes } from "../exceptions/root.js";
import Post from "../models/post.js";

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
