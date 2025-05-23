import { Router } from "express";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePost,
} from "../controllers/post.js";
import { authMiddleware } from "../middleware/auth.js";
import { errorHandler } from "../errorHandler.js";

const postRoute = Router();
postRoute.get("/all", authMiddleware, errorHandler(getAllPosts));
postRoute.get("/following", authMiddleware, errorHandler(getFollowingPosts));
postRoute.get("/user/:username", authMiddleware, errorHandler(getUserPosts));
postRoute.post("/create", authMiddleware, errorHandler(createPost));
postRoute.post("/comment/:id", authMiddleware, commentOnPost);
postRoute.post("/like/:id", authMiddleware, errorHandler(likeUnlikePost));
postRoute.get("/likes/:id", authMiddleware, errorHandler(getLikedPosts));
postRoute.delete("/:id", authMiddleware, errorHandler(deletePost));
export default postRoute;
