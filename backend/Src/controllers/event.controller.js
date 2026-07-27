import { Event } from "../model/Event.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";


const getEvents = asyncHandler(async (req, res) => {
    let events = await Event.find().sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, events, "Library events fetched successfully from MongoDB"));
});

const createEvent = asyncHandler(async (req, res) => {
    const { title, description, date, time, location, category, image, speaker } = req.body || {};

    if (!title?.trim() || !description?.trim() || !date?.trim()) {
        throw new ApiError(400, "Title, Description, and Date are required");
    }

    const event = await Event.create({
        title,
        description,
        date,
        time: time || "10:00 AM - 4:00 PM",
        location: location || "Central Library Auditorium",
        category: category || "Workshop",
        image: image || "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop",
        speaker: speaker || "Guest Speaker"
    });

    return res
        .status(201)
        .json(new ApiResponse(201, event, "Library event created successfully in MongoDB"));
});

const deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) throw new ApiError(404, "Event not found");

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Event deleted successfully from MongoDB"));
});

export { getEvents, createEvent, deleteEvent };
