import mongoose from "mongoose";

const videoSchama = new mongoose.Schema(
  {
    videoFile: {
      type: String,  //cloudinary url
      required:true,
    },
    thumbnail: {
      type: String,   //cloudinary url
      required:true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required:true
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, //cloudinary url
      require: true,
    },
    views: {
      type: Number,
      default : 0 ,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default : true
    },
  },
  { timestamps: true }
);

export const Video = mongoose.model("Video", videoSchama);
