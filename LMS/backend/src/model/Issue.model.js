
import mongoose from "mongoose";
import { Schema } from "mongoose";

const issueSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ["pending", "approved", "returned", "rejected"],
    default: "pending"
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  fineAmount: {
    type: Number,
    default: 0
  },
  fineStatus: {
    type: String,
    enum: ["unpaid", "paid", "waived"],
    default: "unpaid"
  }
}, { timestamps: true });

export const IssueBooks = mongoose.model("issueBooks", issueSchema)