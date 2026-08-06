import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { uploadCloud } from "../services/cloudinary.service.js";
import { Book } from "../model/Book.model.js";
import { User } from "../model/User.Model.js";
import { IssueBooks } from "../model/Issue.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const createBook = asyncHandler(async (req, res) => {
  const { title, description, category, author, copies, isbn } = req.body || {};

  if (
    !title?.trim() ||
    !description?.trim() ||
    !category?.trim() ||
    !author?.trim() ||
    !copies ||
    !isbn?.trim()
  ) throw new ApiError(400, "All field are required");

  const existingBook = await Book.findOne({ isbn });
  if (existingBook) throw new ApiError(400, "book is allready Exist");

  const coverLocalPath = req.file?.path;
  if (!coverLocalPath) throw new ApiError(400, "Cover img is require");

  const uploadcover = await uploadCloud(coverLocalPath);
  if (!uploadcover) throw new ApiError(500, "faild to upload on cloudinery");

  const book = await Book.create({
    title,
    description,
    category,
    cover: {
      url: uploadcover?.url || "",
      public_id: uploadcover?.public_id || ""
    },
    author,
    copies,
    availableCopies: copies,
    isbn
  });

  const addedBook = await Book.findById(book._id);
  if (!addedBook) throw new ApiError(500, "Failed to create book");

  return res
    .status(201)
    .json(new ApiResponse(201, addedBook, "book is SuccessFully added in DB"));
});

const getAllBooks = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 12));
  const skip = (page - 1) * limit;

  const { search, category, sortBy = "createdAt", order = "desc" } = req.query;

  const query = {};

  if (category && category !== "all") {
    query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    query.$or = [
      { title: searchRegex },
      { author: searchRegex },
      { isbn: searchRegex },
      { category: searchRegex }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = order === "asc" ? 1 : -1;

  const [books, totalBooks] = await Promise.all([
    Book.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
    Book.countDocuments(query)
  ]);

  const totalPages = Math.ceil(totalBooks / limit) || 1;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        books,
        pagination: {
          totalBooks,
          currentPage: page,
          totalPages,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      },
      "Books fetched successfully"
    )
  );
});

const getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await Book.findById(id);

  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, book, "Book fetched successfully"));
});

const updateBook = asyncHandler(async (req, res) => {
  const { title, copies, author } = req.body;
  if (!title?.trim() && !copies && !author?.trim())
    throw new ApiError(400, "Minimun One Field require");

  const { id } = req.params;
  const book = await Book.findById(id);
  if (!book) throw new ApiError(404, "Book is not found");

  if (req?.file?.path) {
    const coverLocalPath = req.file?.path;
    const uploadCover = await uploadCloud(coverLocalPath);
    if (!uploadCover) throw new ApiError(400, "cover image is not uploaded");
    book.cover = {
      url: uploadCover?.url || "",
      public_id: uploadCover?.public_id || ""
    };
  }

  if (title) book.title = title;
  if (copies) book.copies = copies;
  if (author) book.author = author;

  await book.save();

  return res
    .status(200)
    .json(new ApiResponse(200, book, "Book Updated SuccessFully"));
});

const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByIdAndDelete(id);

  if (!book) throw new ApiError(400, "Book is not deleted");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Book Deleted successfully"));
});

const getLibraryStats = asyncHandler(async (req, res) => {
  const [totalBooks, totalMembers, activeBorrows, completedBorrows] = await Promise.all([
    Book.countDocuments(),
    User.countDocuments({ role: "student" }),
    IssueBooks.countDocuments({ status: "approved" }),
    IssueBooks.countDocuments({ status: "returned" })
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalBooks,
        totalMembers,
        activeBorrows,
        completedBorrows
      },
      "Library real-time stats fetched successfully"
    )
  );
});

export {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getLibraryStats
};