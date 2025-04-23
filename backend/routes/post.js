import { Router } from "express";
import { createPost, deletePost } from "../controllers/post.js";
import { authMiddleware } from "../middleware/auth.js";

const postRoute = Router();
postRoute.post("/create", authMiddleware, createPost);
postRoute.delete("/:id", authMiddleware, deletePost);
export default postRoute;
