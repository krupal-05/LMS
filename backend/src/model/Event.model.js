import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true
        },
        date: {
            type: String,
            required: [true, "Date is required"]
        },
        time: {
            type: String,
            default: "10:00 AM - 4:00 PM"
        },
        location: {
            type: String,
            default: "Central Library Auditorium"
        },
        category: {
            type: String,
            default: "Workshop",
            trim: true
        },
        image: {
            type: String,
            default: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop"
        },
        speaker: {
            type: String,
            default: "Guest Speaker"
        }
    },
    { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
