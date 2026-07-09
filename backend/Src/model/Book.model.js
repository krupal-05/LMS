import mongoose from "mongoose";
import { Schema } from "mongoose";

const bookSchema = new Schema({
   title :{
      type:String,
      required : [true,"Book Title required  "],
      trim:true
    },
    description:{
      type:String,
      trim: true

    },
    cover: {
      url: String,
      public_id: String,
    },
    category:{
      type:String,
      lowercase: true,
      trim: true,
    },
    author:{
      
      type:String,
      lowercase: true,
      trim: true
    },
    copies:{
      type:Number,
      required: true
    },
    availableCopies:{
      type:Number,
      required: true
    },
    isbn:{
      type:String,
      trim :true,
      unique:true,
      required:true
    }

  }, { timestamps: true });
/**
  book_title
  auth
  cover
  copies 
  isbn
  */


export const Book = mongoose.model("Book", bookSchema);
