// require('dotenv').config({path : './env'})  //As early as possible in your application, 
// import and configure dotenv but in breaks code consistancy so 
import dotenv from "dotenv"
import connetDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
    path:'./.env'
})  //also confing package.json

connetDB()
.then(()=>{
     app.listen(process.env.PORT || 8000 , ()=> {
        console.log(`Server is Running at ${process.env.PORT}`);
        
     }) 
}
)
.catch( (err)=>{
    console.log("Db connection failed" ,err);
}
)





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