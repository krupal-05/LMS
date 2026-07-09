  import ApiError from "../utils/ApiError"
  import asyncHandler from "../utils/asyncHandler"

  export const verifyAdmin = asyncHandler(async (req,res,next)=>{
    
  if(req?.user?.role !== "admin" ) throw new ApiError(403,"Forbidden");

  next()

  })
  