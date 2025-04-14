import { Router } from "express";
import {
  followUnfollowUser,
  getSuggestedUser,
  getUserProfile,
} from "../controllers/user.js";
import { errorHandler } from "../errorHandler.js";
import { authMiddleware } from "../middleware/auth.js";

const userRoute = Router();
userRoute.get("/profile/:username", errorHandler(getUserProfile));
userRoute.post("/follow/:id", authMiddleware, errorHandler(followUnfollowUser));
userRoute.get("/suggested", authMiddleware, errorHandler(getSuggestedUser));

export default userRoute;
