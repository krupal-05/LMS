import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyeJWT } from "../middlewares/auth.middleware.js";

// import controllers
import {
  registerUser,
  login,
  logout,
  reNewAccessToken,
  getCurrentUser,
  changePassword,
  UpdatedAccountDetails,
  updateAvtar
} from "../controllers/user.controller.js";


const router = Router();


router.route("/register").post(upload.fields([
  {
    name: "avatar",
    maxCount: 1
  }

])
  , registerUser
);
router.route("/login").post(login)
router.route("/logout").post(verifyeJWT, logout)
router.route("/refresh-token").post(reNewAccessToken)
router.route("/me").get(verifyeJWT, getCurrentUser)

//update DATA  
router.route("/change-password").patch(verifyeJWT, changePassword)
router.route("/update-profile").patch(verifyeJWT, UpdatedAccountDetails)
router.route("/avtar").patch(verifyeJWT, updateAvtar)



export default router;
