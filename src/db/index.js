import mongoose from "mongoose";
import { DB_NAME } from "../Constants.js";

const connectDB = async () => {
  try {
    // console.log("Loaded URI:", process.env.MONGODB_URI);

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(`DB connected successfully!
     Hosted at: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(" DB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;

