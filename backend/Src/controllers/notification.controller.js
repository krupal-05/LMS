import { Notification } from "../model/Notification.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req?.user?._id })
        .sort({ createdAt: -1 })
        .limit(30);

    return res
        .status(200)
        .json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
});

const markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notif = await Notification.findOne({ _id: id, user: req?.user?._id });
    if (!notif) throw new ApiError(404, "Notification not found");

    notif.read = true;
    await notif.save();

    return res
        .status(200)
        .json(new ApiResponse(200, notif, "Notification marked as read"));
});

export { getNotifications, markAsRead };
