import mongoose from "mongoose";
import { DB_NAME } from "../Constants.js";

const connetDB = async()=>{
    try {
        console.log("Loaded URI:", process.env.MONGODB_URI);

       const connectionInstance =
       await mongoose.connect(`{proccess.env.MONGODB_URI}/{DB_NAME}`)

       console.log(`The Db is successfully connected 
        DB hosted at : ${connectionInstance.connection.host}`);
       

    } catch (error) {
        console.log("Dbconnection failed" ,error);
        process.exit(1)
    }
}

export default connetDB