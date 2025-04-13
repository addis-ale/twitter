import express from "express";
import rootRoute from "./routes/root.js";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import { errorMiddleware } from "./middleware/middleware.js";
import cookieParser from "cookie-parser";
dotenv.config();
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
