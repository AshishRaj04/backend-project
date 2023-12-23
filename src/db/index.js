import mongoose from "mongoose";
import { exit } from "process";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      "\n Connected to MongoDB successfully !! DB HOST " +
        connectionInstance.connection.host
    );
    
  } catch (error) {
    console.log("Mongoose connection FAILED: ", error);
    exit(1);
  }
};

export default connectDB;
