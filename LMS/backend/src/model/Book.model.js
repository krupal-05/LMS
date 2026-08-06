import mongoose from "mongoose";
import { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Book Title required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    cover: {
      url: String,
      public_id: String,
    },
    category: {
      type: String,
      lowercase: true,
      trim: true,
    },
    author: {
      type: String,
      lowercase: true,
      trim: true,
    },
    copies: {
      type: Number,
      required: true,
    },
    availableCopies: {
      type: Number,
      required: true,
    },
    isbn: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for ultra-fast query execution over thousands of book records
bookSchema.index({ category: 1 });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ title: "text", author: "text", isbn: "text" });

export const Book = mongoose.model("Book", bookSchema);
