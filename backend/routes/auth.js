import { Router } from "express";
import { getMe, login, logOut, signup } from "../controllers/auth.js";
import { errorHandler } from "../errorHandler.js";
import { authMiddleware } from "../middleware/auth.js";

const authRoute = Router();
authRoute.post("/signup", errorHandler(signup));
authRoute.post("/login", errorHandler(login));
authRoute.post("/logout", errorHandler(logOut));
authRoute.get("/me", authMiddleware, errorHandler(getMe));

export default authRoute;
