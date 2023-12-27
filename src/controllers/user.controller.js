import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import User from "../modles/user.model.js";
import uploadOnCloudnary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

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

  {
    // get user details from frontend
    const { username, fullName, email, password } = req.body;
    // console.log(`Email :- ${email} \n Password :- ${password}`)
    console.log(req.body);
  }

  {
    // validation - not empty any field
    if (
      [username, fullName, email, password].some((entries) =>
        entries.length === 0 ? true : false
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }
  }

  {
    //check if user already exist - using "email" or "username"
    let existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new ApiError(409, "User already exists with the same credientials");
    }
  }

  {
    //check for images , check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const backgroundLocalPath = req.files?.background[0]?.path;
    //req.files is a method provided by multer . read about it in the multer github page.
    console.log(req.files);
    // checking if user has uploaded the avatar or not because it is a required field in the model
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is requied");
    }
  }

  {
    //upload them to cloudinary - save the url
    const avatar = await uploadOnCloudnary(avatarLocalPath);
    const coverImg = await uploadOnCloudnary(backgroundLocalPath);

    if (!avatar) {
      throw new ApiError(400, "Avatar file is requied");
    }
  }

  {
    //create user object - create entry in db
    const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImg: coverImg?.url || "",
      password,
      username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (createdUser) {
      throw new ApiError(
        500,
        "Server error :- Something went wrong while registering the user"
      );
    }
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
