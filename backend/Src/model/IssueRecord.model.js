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
    type: Date,
    required: true
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
  }
}, { timestamps: true });