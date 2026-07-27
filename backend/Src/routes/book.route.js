import { Router } from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getLibraryStats
} from "../controllers/book.controller.js";
import {
  requestBook,
  approveIssue,
  rejectIssue,
  returnBook,
  payFine,
  waiveFine,
  getMyIssuedBooks,
  getAllIssuedBooks
} from "../controllers/issebook.controller.js";
import { verifyeJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public Stats
router.route("/stats").get(getLibraryStats);

// Book CRUD
router.route("/add-book").post(verifyeJWT, verifyAdmin, upload.single("cover"), createBook);
router.route("/get-all-Books").get(getAllBooks);
router.route("/get-book/:id").get(getBookById);
router.route("/update-book/:id").patch(verifyeJWT, verifyAdmin, upload.single("cover"), updateBook);
router.route("/delete-book/:id").delete(verifyeJWT, verifyAdmin, deleteBook);

// Issue / Request Book routes
router.route("/request/:id").post(verifyeJWT, requestBook);
router.route("/approve/:id").post(verifyeJWT, verifyAdmin, approveIssue);
router.route("/reject/:id").post(verifyeJWT, verifyAdmin, rejectIssue);
router.route("/return/:id").post(verifyeJWT, verifyAdmin, returnBook);
router.route("/pay-fine/:id").post(verifyeJWT, payFine);
router.route("/waive-fine/:id").post(verifyeJWT, verifyAdmin, waiveFine);
router.route("/my-issues").get(verifyeJWT, getMyIssuedBooks);
router.route("/all-issues").get(verifyeJWT, verifyAdmin, getAllIssuedBooks);

export default router;
