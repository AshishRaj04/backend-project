import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide your username."],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      unique: true,
      required: [true, "Password is required"],
      minlength: 8,
    },
    refreshToken: {
      type: String,
    },
    avatar: {
      true: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url
    },
    watchHistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
