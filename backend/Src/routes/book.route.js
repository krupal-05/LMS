import { Router } from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
} from "../controllers/book.controller.js"
import { verifyeJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add-book").post(verifyeJWT,verifyAdmin,upload.single("cover"),createBook)
router.route("/get-all-Books").get(getAllBooks)
router.route("/get-book/:id").get(getBookById)
router.route("/update-book/:id").patch(verifyeJWT,verifyAdmin,upload.single("cover"),updateBook);
router.route("/delete-book/:id").delete(verifyeJWT,verifyAdmin,deleteBook);

export default router
