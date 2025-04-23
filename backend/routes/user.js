import { Router } from "express";
import {
  followUnfollowUser,
  getSuggestedUser,
  getUserProfile,
  updateUser,
} from "../controllers/user.js";
import { errorHandler } from "../errorHandler.js";
import { authMiddleware } from "../middleware/auth.js";

const userRoute = Router();
userRoute.get("/profile/:username", errorHandler(getUserProfile));
userRoute.post("/follow/:id", authMiddleware, errorHandler(followUnfollowUser));
userRoute.get("/suggested", authMiddleware, errorHandler(getSuggestedUser));
userRoute.post("/update", authMiddleware, errorHandler(updateUser));

export default userRoute;
