import { Router } from "express";
import authRoute from "./auth.js";
import userRoute from "./user.js";

const rootRoute = Router();
rootRoute.use("/auth", authRoute);
rootRoute.use("/user", userRoute);
export default rootRoute;
