import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { uploadCloud } from "../services/cloudinary.service.js";
import { Book } from "../model/Book.model.js";
import ApiResponse from"../utils/ApiResponse.js"

const createBook = asyncHandler(async (req,res)=>{
  // destrutch
  //validation
  //localpath for bookcover
  //upload on clouldinary
  //get link 
  // check if book is exist 
  // make book model 
  // upload on mongodb 
  // sent responce 
  const {title ,description,category,author,copies,isbn} = req.body || {};
  
  if(
    !title?.trim() ||
    !description?.trim() ||
    !category?.trim() ||
    !author?.trim() ||
    !copies||
    !isbn?.trim() 
  ) throw new ApiError(400,"All field are required");


    const existingBook = await Book.findOne({isbn})
    if(existingBook) throw new ApiError(400,"book is allready Exist")

  //cover
   const coverLocalPath = req.file?.path
   if(!coverLocalPath) throw new ApiError(400,"Cover img is require")
  
    const uploadcover = await uploadCloud(coverLocalPath)
    if(!uploadcover) throw new ApiError(500,"faild to upload on cloudinery")

    const cover = uploadcover?.url

    const book = await Book.create({
      title,
      description,
      category,
      cover,
      author,
      copies,
      availableCopies: copies,
      isbn
    })
    console.log(book)

    const addedBook = await Book.findById(book._id)
    if(!addedBook) throw new ApiError(500, "Failed to create book")
    
    return res
    .status(201)
    .json(new ApiResponse(201,addedBook,"book is SuccessFully added in DB"))
})
const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, books, "Books fetched successfully"));
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
  const { id } = req.params;

  const {
    title,
    description,
    category,
    author,
    copies,
    isbn,
  } = req.body;

  const book = await Book.findById(id);

  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  if (title) book.title = title;
  if (description) book.description = description;
  if (category) book.category = category;
  if (author) book.author = author;
  if (isbn) book.isbn = isbn;

  if (copies) {
    const issuedBooks = book.copies - book.availableCopies;

    book.copies = copies;
    book.availableCopies = copies - issuedBooks;
  }

  if (req.file?.path) {
    const uploadedCover = await uploadCloud(req.file.path);

    if (!uploadedCover) {
      throw new ApiError(500, "Failed to upload cover");
    }

    // Later:
    // await cloudinary.uploader.destroy(book.coverPublicId);

    book.cover = uploadedCover.url;
  }

  await book.save();

  return res
    .status(200)
    .json(new ApiResponse(200, book, "Book updated successfully"));
});
const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await Book.findById(id);

  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  // Later:
  // await cloudinary.uploader.destroy(book.coverPublicId);

  await Book.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Book deleted successfully"));
});

export {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
}