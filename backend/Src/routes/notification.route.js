import { Router } from "express";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";
import { verifyeJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyeJWT, getNotifications);
router.route("/read/:id").post(verifyeJWT, markAsRead);

export default router;
