import { Router } from "express";
import authRoute from "./auth.js";

const rootRoute = Router();
rootRoute.use("/auth", authRoute);
export default rootRoute;
