import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../model/User.Model.js";
import { uploadCloud } from "../services/cloudinary.service.js";
import jwt from "jsonwebtoken";

const generateAccessAndreFreshToken = async (user_id) => {
  try {
    const user = await User.findById(user_id);
    const accessToken = user.generateAccessToken();
    console.log(accessToken)
    const reFreshToken = user.generatereFreshToken();
    console.log(reFreshToken)

    user.reFreshToken = reFreshToken;
    await user.save({ validateBeforeSave: true });

    return { accessToken, reFreshToken };
  } catch (error) {
    throw new ApiError(402, "keys are not genrated ");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get user info form frontend
  // check velidation
  //check it is allready exist
  // chenck avatar and benner
  // upload avtatr and benner on cloudinary
  // register user on DB
  // check responce
  // remove password and refresh tocken
  // check user is created
  // retun  responce

  // get data from frontend
  const { firstName, lastName, email, contact, password, role } =
    req.body || {};

  // console.log(req.files);

  // validation
  if (
    !firstName?.trim() ||
    !lastName?.trim() ||
    !email?.trim() ||
    !contact?.trim() ||
    !password?.trim()
  )
    throw new ApiError(400, "All required fields must be provided");

  //check it is allready exist
  const existUser = await User.findOne({ email });

  if (existUser) throw new ApiError(409, "User of allready exist");

  // check avtar path
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // check path if here or not
  if (!avatarLocalPath) throw new ApiError(406, "Avatar file is required");

  // upload on cloudinary
  const avatar = await uploadCloud(avatarLocalPath);
  if (!avatar) throw new ApiError(500, "failed to upload avatar ");


  //upload user on db

  const user = await User.create({
    firstName,
    lastName,
    email,
    contact,
    password,
    avatar: avatar.url,
  });

  console.log("this model is uploaded On DB ");

  // remove password and refresh token
  const createduser = await User.findById(user._id).select(
    "-password -reFreshToken",
  );
  // if user is not register on  db
  if (!createduser) throw new ApiError(500, "user is not registered on db");

  return res
    .status(201)
    .json(new ApiResponse(201, createduser, "User registrared Successfully"));
});
const login = asyncHandler(async (req, res) => {
  //destructure data
  //velidation
  //serch on DB
  // match password
  // give refresh and access token

  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) throw new ApiError(400, "Enter valid Email Or Password");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User dose not exist");

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid user credintials");

  const { accessToken, reFreshToken } = await generateAccessAndreFreshToken(user.id);


  const loggedUser = await User.findById(user.id).select("-password -reFreshToken")

  const option = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(201)
    .cookie("accessToken", accessToken, option)
    .cookie("reFreshToken", reFreshToken, option)
    .json(
      new ApiResponse(
        201,
        {
          loggedUser, accessToken, reFreshToken
        },
        "User Login successfully"
      ));
});
const logout = asyncHandler(async (req,res) => {
  //id find 
  //remove refresh token

  await User.findByIdAndUpdate(
    req.user._id, 
    {
      $unset:{
        reFreshToken : 1
      }
    },
    {
      returnDocument: "after"
    }
  )

    const option = {
    httpOnly: true,
    secure: true
  }


  return res
  .status(200)
  .clearCookie("accessToken",option)
  .clearCookie("reFreshToken",option)
  .json(new ApiResponse(200,{},"user Logged out SuccessFully"))
});
const reNewAccessToken = asyncHandler(async (req,res)=>{
    //take reFresh token fron user 
    //velidate token 
    //verify from DB
    // genrate token and sent them with responce 

    const incomingReFreshToken = req.cookies?.reFreshToken || req.body.reFreshToken;
    if(!incomingReFreshToken) throw new ApiError(401,"Unauthorized Request");

    try {
          const decodedToken = jwt.verify(incomingReFreshToken , process.env.REFRESH_SECRET_TOKEN)
                console.log(" token is decoded ");
      
          const user = await User.findById(decodedToken._id)
          if(!user) throw new ApiError(401,"Unauthorized Request")
      
          if(decodedToken !== user.reFreshToken) throw new ApiError(401,"refresh token is used or Expired")
          
          const{accessToken , reFreshToken} = await generateAccessAndreFreshToken(user._id);
        
        
          const option = {
            httpOnly: true,
            secure: true
          }
         
          return res
          .status(200)
          .cookie("accessToken",accessToken,option)
          .cookie("reFreshToken", reFreshToken,option )
          .json(new ApiResponse(201,"Access token Renew Successfully "))
      
    } catch (error) {
      throw new ApiError(401, error?.message || "invalid Refresh token")
    }

});
const getCurrentUser = asyncHandler(async (req,res)=>{
  return res
  .status(201)
  .json(new ApiResponse(200,req.user,"Current user fetched successfully"))
});
const changePassword = asyncHandler(async(req,res)=>{
  const {oldPassword,newPassword}=req.body
  if(!oldPassword?.trim() || !newPassword?.trim()) throw new ApiError(401,"Enter Both Password");

  if(oldPassword === newPassword)throw new ApiError(400, "New password must be different from the old password")

  const user = await User.findById(req.user._id);
  if(!user) throw new ApiError(404,"unauthorized request")

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect) throw new ApiError(401,"invalid oldPassword")
       user.password = newPassword;
      await user.save()
return res
.status(200)
.json(new ApiResponse(200,{},"Password Updated SuccessFully"))
});
const UpdatedAccountDetails = asyncHandler(async(req,res)=>{
    const {firstName,lastName,contact} = req.body
    if (
    !firstName?.trim() &&
    !lastName?.trim() &&
    !contact 
  )
    throw new ApiError(400, "All required fields must be provided");

    const user = await User.findById(req.user._id);
    if(!user) throw new ApiError(400,"Bad Request request")
    
    if(firstName) user.firstName = firstName
    if(lastName) user.lastName = lastName
    if(contact) user.contact = contact
    await user.save()

    const updatedUser = await User.findById(user._id).select("-password -reFreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200,updatedUser,"Details updated Successfully"))
});
const updateAvtar = asyncHandler(async(req,res)=>{
    const localAvtar = req.file?.path
    if(!localAvtar) throw new ApiError(400,"image is not uploaded")

    const uploadedAvatar  = await uploadCloud(localAvtar);
    if(!uploadedAvatar ) throw new ApiError(400,"img is not uploaded on Cloudinary")

    const user = await User.findById(req.user?._id)
    if(!user) throw new ApiError(400,"Unauthorized request");

    // await cloudinary.uploader.destroy(user.avatarPublicId)
    user.avatar = uploadedAvatar ?.url
    await user.save()

    const updatedUser = await User.findById(user._id).select("-password -reFreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200,updatedUser,"Details updated Successfully"))
});
export { 
  registerUser, 
  login ,
  logout,
  reNewAccessToken , 
  getCurrentUser ,
  changePassword ,
  UpdatedAccountDetails,
  updateAvtar
};
