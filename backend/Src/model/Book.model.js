import mongoose from "mongoose";
import { Schema } from "mongoose";

const bookSchema = new Schema({}, { timestamps: true });
/**
  book_title
  auth
  cover
  copys
  isbn
  */

export const Book = mongoose.model("Book", bookSchema);
