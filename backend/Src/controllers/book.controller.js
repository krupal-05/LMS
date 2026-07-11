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

  const books = await Book.find().sort({createdAt : -1});
    return res
    .status(200)
    .json(new ApiResponse(200,books,"Books sent Successfully"))
})
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
  //check all fnd  
  //check caover  
  // change than upload
  const{ title,copies,author }=req.body
  if(
    !title?.trim() &&
    !copies &&
    !author?.trim() 
  ) throw new ApiError(400,"Minimun One Field require")
  const {id} = req.params
  const book=await Book.findById(id)
  if(!book) throw new ApiError(404,"Book is not found")

  if(req?.file?.path)
    {
      const coverLocalPath = req.file?.path
      const uploadCover = await uploadCloud(coverLocalPath)
      if(!uploadCover) throw new ApiError(400,"cover image is not uploaded")
      book.cover = uploadCover?.url
    }
  
  if(title) book.title = title
  if(copies) book.copies = copies
  if(author) book.author = author

  await book.save()

  return res
  .status(200)
  .json(new ApiResponse(200,book,"Book Updated SuccessFully"))

});
const deleteBook = asyncHandler(async (req, res) => {

  const {id} =req.params
  const book = await Book.findByIdAndDelete(id)

  if(!book) throw new ApiError(400,"Book is not deleted")

  return res
  .status(200)
  .json( new ApiResponse(200,{},"Book Deleted successfully"))

});

export {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
}