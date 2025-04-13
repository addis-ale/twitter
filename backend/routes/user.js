import { Router } from "express";
import { followUnfollowUser, getUserProfile } from "../controllers/user.js";
import { errorHandler } from "../errorHandler.js";
import { authMiddleware } from "../middleware/auth.js";

const userRoute = Router();
userRoute.get("/profile/:username", errorHandler(getUserProfile));
userRoute.post("/follow/:id", authMiddleware, errorHandler(followUnfollowUser));

export default userRoute;
