import express from "express";
import { v2 as cloudinary } from "cloudinary";
import rootRoute from "./routes/root.js";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import { errorMiddleware } from "./middleware/middleware.js";
import cookieParser from "cookie-parser";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", rootRoute);
app.use(errorMiddleware);
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  connectDb();
  console.log(`app is running on ${PORT}`);
});
