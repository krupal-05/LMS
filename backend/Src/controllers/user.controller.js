import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../model/User.Model.js";
import { uploadCloud } from "../services/cloudinary.service.js";

const generateAccessAndReFreshToken = asyncHandler(async (user_id) => {
  try {
    const user = await User.findById(User_id);
    const accessToken = User.generateAccessToken();
    const refreshtoken = User.generatereFreshToken();

    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: true });

    return { accessToken, refreshtoken };
  } catch (error) {
    throw new ApiError(402, "keys are not genrated ");
  }
});

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
  console.log(avatar);

  if (!avatar) throw new ApiError(500, "failed to upload avatar ");

  console.log("this model is  ready upload on DB");

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
    "-password -refreshtoken",
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
  console.log(req.body)

  if (!email?.trim() || !password?.trim()) throw new ApiError(400, "Enter valid Email Or Password");

  const user = await User.findOne({email});
  if (!user) throw new ApiError(404, "User dose not exist");

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  console.log(isPasswordCorrect , " and ", password )
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid user credintials");

  const { accessToken, refreshtoken } = await generateAccessAndReFreshToken(user.id);

  const loggedUser = await User.findById(user.id).select("-password -refreshtoken")
  
  const option = {
    httpOnly:true,
    secure: true
  }

  return res
  .status(201)
  .cookie("accessToken" ,accessToken,option)
  .cookie("refreshtoken",refreshtoken,option)
  .json(
    new ApiResponse(
      201,
      { 
        loggedUser , accessToken,refreshtoken
      },
      "User Loginm successfully"
    ));
});

export { registerUser, login };
