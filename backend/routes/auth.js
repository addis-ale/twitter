import { Router } from "express";
import { signup } from "../controllers/auth.js";
import { errorHandler } from "../errorHandler.js";

const authRoute = Router();
authRoute.post("/signup", errorHandler(signup));
export default authRoute;
