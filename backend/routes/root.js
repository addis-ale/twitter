import { Router } from "express";
import authRoute from "./auth.js";
import userRoute from "./user.js";
import postRoute from "./post.js";

const rootRoute = Router();
rootRoute.use("/auth", authRoute);
rootRoute.use("/user", userRoute);
rootRoute.use("/post", postRoute);
export default rootRoute;
