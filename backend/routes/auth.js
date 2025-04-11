import { Router } from "express";
import { login, signup } from "../controllers/auth.js";
import { errorHandler } from "../errorHandler.js";

const authRoute = Router();
authRoute.post("/signup", errorHandler(signup));
authRoute.post("/login", errorHandler(login));
export default authRoute;
