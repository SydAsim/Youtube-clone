// require('dotenv').config({path : './env'})  //As early as possible in your application, 
// import and configure dotenv but in breaks code consistancy so 
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";

// Load environment variables early
dotenv.config({ path: './.env' });

// Connect to MongoDB and then start the server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    const HOST = '0.0.0.0'; // <- important for Fly

    const server = app.listen(PORT, HOST, () => {
      console.log(`Server is running at http://${HOST}:${PORT}`);
    });

    server.on('error', (err) => {
      console.error('Server failed to start:', err);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1); // Exit process if DB fails
  });





// index.js → server bootstrap
// Load .env variables early.
// Connect to database.
// Start the server with app.listen(PORT).
// Handle global errors like DB connection failure.













// /*import express from "express"
// const app = express()
// ;(async()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/{DB_NAME}`)
//        app.on("error",(error)=>{
//         console.log("there is an error in mongodb" ,error);
//         throw error
//        })

//        app.listen(process.env.PORT ,()=>{
//         console.log(`app is listening on PORT: ${process.env.PORT}`);
        
//        })


//     } catch (error) {
//         console.log("Db_connection failed",error);
//         throw error 
        
//     }
// })()
//     */