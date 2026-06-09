import mongoose from "mongoose";
import { Schema } from "mongoose";

 const bookSchema = new Schema({},{ timestamps : true});
 


export const Book = mongoose.model("Book",bookSchema)