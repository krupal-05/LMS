import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Book } from "../model/Book.model.js";
import { IssueBooks } from "../model/Issue.model.js";
import { Notification } from "../model/Notification.model.js";

const requestBook = asyncHandler(async (req, res) => {
  const { id } = req.params

  const book = await Book.findById(id);
  if (!book) throw new ApiError(404, "Book is not found")

  if (book.availableCopies <= 0) throw new ApiError(400, "Book is not Available ")

  const existingIssue = await IssueBooks.findOne({
    user: req.user?._id,
    book: book?._id,
    status: {
      $in: ["pending", "approved"]
    }
  })
  if (existingIssue) throw new ApiError(400, "Book is allready requested")

  const issued = await IssueBooks.create({
    user: req?.user?._id,
    book: book?._id,
    status: "pending"
  });

  await Notification.create({
    user: req?.user?._id,
    message: `Your request for book "${book.title}" was submitted successfully. Waiting for admin approval.`,
    type: "info"
  });

  return res
    .status(201)
    .json(new ApiResponse(201, issued, "Book request sent successfully"))
})

const approveIssue = asyncHandler(async (req, res) => {
  const { id } = req.params

  const issue = await IssueBooks.findById(id);
  if (!issue) throw new ApiError(404, "Issue request not found");

  const book = await Book.findById(issue.book);
  if (!book) throw new ApiError(404, "Book is not found")

  if (issue.status !== "pending") throw new ApiError(400, "Only pending requests can be approved.")

  if (book.availableCopies <= 0) throw new ApiError(400, "Book is not Available")
  book.availableCopies--

  await book.save()

  issue.status = "approved"
  issue.approvedBy = req?.user?._id
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  issue.issueDate = new Date();
  issue.dueDate = dueDate;
  await issue.save()

  await Notification.create({
    user: issue.user,
    message: `Your borrow request for book "${book.title}" has been approved. Please collect it.`,
    type: "success"
  });

  return res
    .status(200)
    .json(new ApiResponse(200, issue, "Book approved successfully"));
});

const rejectIssue = asyncHandler(async (req, res) => {
  const { id } = req.params

  const issue = await IssueBooks.findById(id);
  if (!issue) throw new ApiError(404, "Issue request not found");

  if (issue.status !== "pending") throw new ApiError(400, "Only pending requests can be reject.")

  issue.status = "rejected"
  await issue.save()

  const book = await Book.findById(issue.book);
  await Notification.create({
    user: issue.user,
    message: `Your borrow request for book "${book.title || 'requested book'}" has been rejected.`,
    type: "alert"
  });

  return res
    .status(200)
    .json(new ApiResponse(200, issue, "Book request rejected"));
});

const returnBook = asyncHandler(async (req, res) => {
  const { id } = req.params
  const issue = await IssueBooks.findById(id);
  if (!issue) throw new ApiError(404, "Issue request not found");

  const book = await Book.findById(issue.book);
  if (!book) throw new ApiError(404, "Book is not found")

  if (issue.status !== "approved") throw new ApiError(400, "Only approved issue requests can be returned.")

  if (book.availableCopies >= book.copies) throw new ApiError(400, "Available copies cannot exceed total copies.")
  book.availableCopies++

  await book.save()

  const returnDate = new Date();
  const dueDate = new Date(issue.dueDate);
  let fine = 0;

  if (returnDate > dueDate) {
    const timeDiff = returnDate.getTime() - dueDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    fine = daysDiff * 5; // ₹5 per day
  }

  issue.status = "returned";
  issue.returnDate = returnDate;
  issue.fineAmount = fine;
  issue.fineStatus = fine > 0 ? "unpaid" : "paid";

  await issue.save()

  if (fine > 0) {
    await Notification.create({
      user: issue.user,
      message: `Book "${book.title}" was marked as returned. An overdue fine of ₹${fine} has been generated.`,
      type: "alert"
    });
  } else {
    await Notification.create({
      user: issue.user,
      message: `Book "${book.title}" was marked as returned successfully. Thank you!`,
      type: "success"
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, issue, "Book returned successfully"));
});

const payFine = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const issue = await IssueBooks.findById(id).populate("book");
  if (!issue) throw new ApiError(404, "Issue record not found");

  issue.fineStatus = "paid";
  await issue.save();

  await Notification.create({
    user: issue.user,
    message: `Your fine of ₹${issue.fineAmount} for book "${issue.book?.title}" has been paid successfully.`,
    type: "success"
  });

  return res
    .status(200)
    .json(new ApiResponse(200, issue, "Fine paid successfully"));
});

const waiveFine = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const issue = await IssueBooks.findById(id).populate("book");
  if (!issue) throw new ApiError(404, "Issue record not found");

  issue.fineStatus = "waived";
  await issue.save();

  await Notification.create({
    user: issue.user,
    message: `Your fine of ₹${issue.fineAmount} for book "${issue.book?.title}" has been waived by the admin.`,
    type: "info"
  });

  return res
    .status(200)
    .json(new ApiResponse(200, issue, "Fine waived successfully"));
});

const getMyIssuedBooks = asyncHandler(async (req, res) => {
  const books = await IssueBooks.find({ user: req?.user?._id }).populate("book");
  if (books.length === 0) throw new ApiError(404, "your Issue request not found");

  return res
    .status(200)
    .json(new ApiResponse(200, books, "My issued books fetched successfully. "))
});

const getAllIssuedBooks = asyncHandler(async (req, res) => {
  const issues = await IssueBooks.find()
    .populate("user", "fullName email")
    .populate("book", "title author cover category")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, issues, "All issued books fetched successfully."))
});

export {
  requestBook,
  approveIssue,
  rejectIssue,
  returnBook,
  payFine,
  waiveFine,
  getMyIssuedBooks,
  getAllIssuedBooks
};