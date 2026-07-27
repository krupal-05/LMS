import { Router } from "express";
import { getNotifications, markAsRead, sendOverdueReminders } from "../controllers/notification.controller.js";
import { verifyeJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/").get(verifyeJWT, getNotifications);
router.route("/read/:id").post(verifyeJWT, markAsRead);
router.route("/send-reminders").post(verifyeJWT, verifyAdmin, sendOverdueReminders);

export default router;
