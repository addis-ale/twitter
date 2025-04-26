import { BadRequestException } from "../exceptions/badRequestException.js";
import { ErrorCodes } from "../exceptions/root.js";
import Notification from "../models/notification.js";

export const getNotifications = async (req, res) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ to: userId }).populate([
    {
      path: "from",
      select: "username profileImg",
    },
  ]);
  await Notification.updateMany(
    { to: userId },
    {
      read: true,
    },
    { new: true }
  );
  res.status(200).json({ success: true, data: notifications });
};
export const deleteNotifications = async (req, res) => {
  const userId = req.user._id;
  await Notification.deleteMany({ to: userId });
  res
    .status(200)
    .json({ success: true, message: "Notifications deleted successfully!" });
};
export const deleteNotification = async (req, res, next) => {
  const { id } = req.params;
  const notification = await Notification.findById(id);
  if (req.user._id.toString() !== notification.to.toString()) {
    return next(
      new BadRequestException(
        "Unauthorized to delete this notification!",
        ErrorCodes.USER_NOT_FOUND
      )
    );
  }
  await Notification.findByIdAndDelete(id);
  res
    .status(200)
    .json({ success: true, message: "Notification deleted successfully!" });
};
