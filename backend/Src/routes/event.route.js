import { Router } from "express";
import { getEvents, createEvent, deleteEvent } from "../controllers/event.controller.js";
import { verifyeJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// Public route to get events
router.route("/").get(getEvents);

// Admin protected routes
router.route("/create").post(verifyeJWT, verifyAdmin, createEvent);
router.route("/delete/:id").delete(verifyeJWT, verifyAdmin, deleteEvent);

export default router;
