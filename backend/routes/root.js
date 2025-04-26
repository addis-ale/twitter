import { Router } from "express";
import authRoute from "./auth.js";
import userRoute from "./user.js";
import postRoute from "./post.js";
import notificationRoute from "./notification.js";

const rootRoute = Router();
rootRoute.use("/auth", authRoute);
rootRoute.use("/user", userRoute);
rootRoute.use("/post", postRoute);
rootRoute.use("/notifications", notificationRoute);
export default rootRoute;
