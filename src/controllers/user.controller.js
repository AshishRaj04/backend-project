import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../modles/user.model.js";
import { uploadOnCloudnary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(500, "Internal server error");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty any field
  //check if user already exist - using "email" or "username"
  //check for images , check for avatar
  //upload them to cloudinary - save the url
  //create user object - create entry in db
  //remove password and refresh token field from response
  //check for user response
  //return response

  // get user details from frontend
  const { username, fullName, email, password } = req.body;
  // console.log(`Email :- ${email} \n Password :- ${password}`)
  console.log(req.body);

  // validation - not empty any field
  if (
    [username, fullName, email, password].some((entries) =>
      entries.length === 0 ? true : false
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //check if user already exist - using "email" or "username"
  let existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, "User already exists with the same credientials");
  }

  //check for images , check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    res.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  //req.files is a method provided by multer . read about it in the multer github page.
  console.log(req.files);
  // checking if user has uploaded the avatar or not because it is a required field in the model
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is requied");
  }

  //upload them to cloudinary - save the url
  const avatar = await uploadOnCloudnary(avatarLocalPath);
  const coverImg = await uploadOnCloudnary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is requied // cloudinary");
  }

  //create user object - create entry in db
  const user = await User.create({
    fullName,
    email,
    avatar: avatar.url,
    coverImg: coverImg?.url || "",
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Server error :- Something went wrong while registering the user"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req.body -> data
  //username or email
  //find the user
  //password check
  //access and refresh token
  //send cookie
  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "username or email is required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!existingUser) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await createdUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existingUser._id
  );

  const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );

  // this option object make sure that the cookie is not modifiable from the frontend but only through the server
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("Access Token", accessToken, option)
    .cookie("Refresh Token", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          existingUser: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
 await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option);
});

export { registerUser, loginUser, logoutUser };
