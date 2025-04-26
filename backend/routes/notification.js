import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  deleteNotification,
  deleteNotifications,
  getNotifications,
} from "../controllers/notification.js";
import { errorHandler } from "../errorHandler.js";

const notificationRoute = Router();
notificationRoute.get("/", authMiddleware, errorHandler(getNotifications));
notificationRoute.delete(
  "/",
  authMiddleware,
  errorHandler(deleteNotifications)
);
notificationRoute.delete(
  "/:id",
  authMiddleware,
  errorHandler(deleteNotification)
);
export default notificationRoute;
