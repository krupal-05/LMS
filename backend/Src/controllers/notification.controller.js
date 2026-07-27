import { Notification } from "../model/Notification.model.js";
import { IssueBooks } from "../model/Issue.model.js";
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

const sendOverdueReminders = asyncHandler(async (req, res) => {
    const activeIssues = await IssueBooks.find({ status: "approved" }).populate("book user");
    let count = 0;

    const now = new Date();

    for (const issue of activeIssues) {
        if (!issue.dueDate || !issue.user) continue;

        const diffTime = new Date(issue.dueDate).getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

        if (diffDays <= 2) {
            const message = diffDays < 0
                ? `URGENT: Your borrowed book "${issue.book?.title || 'Book'}" is ${Math.abs(diffDays)} days overdue! Fine rate is ₹5/day.`
                : `REMINDER: Your borrowed book "${issue.book?.title || 'Book'}" is due in ${diffDays} day(s) on ${new Date(issue.dueDate).toLocaleDateString()}.`;

            await Notification.create({
                user: issue.user._id,
                message,
                type: diffDays < 0 ? "alert" : "info"
            });
            count++;
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { remindersSent: count }, `${count} automated overdue alerts created successfully`));
});

export { getNotifications, markAsRead, sendOverdueReminders };
