import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../model/User.Model.js"


export const verifyeJWT = asyncHandler(async(req,res,next)=>{
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token) throw new ApiError(400,"UnAurthorized request")
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN)
        console.log(decodedToken);
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        console.log(user);
        
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()


  } catch (error) {
  console.log(error);
  throw new ApiError(401, error?.message || "Invalid access token");

  }
})