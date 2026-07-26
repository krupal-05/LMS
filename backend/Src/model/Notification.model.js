import mongoose from "mongoose";
import { Schema } from "mongoose";

const notificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["info", "alert", "success"],
        default: "info"
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);
