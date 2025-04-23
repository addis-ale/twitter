import { Router } from "express";
import { createPost } from "../controllers/post.js";
import { authMiddleware } from "../middleware/auth.js";

const postRoute = Router();
postRoute.post("/create", authMiddleware, createPost);
export default postRoute;
