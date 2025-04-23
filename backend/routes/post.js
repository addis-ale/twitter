import { Router } from "express";
import { commentOnPost, createPost, deletePost } from "../controllers/post.js";
import { authMiddleware } from "../middleware/auth.js";

const postRoute = Router();
postRoute.post("/create", authMiddleware, createPost);
postRoute.post("/comment/:id", authMiddleware, commentOnPost);
postRoute.delete("/:id", authMiddleware, deletePost);
export default postRoute;
