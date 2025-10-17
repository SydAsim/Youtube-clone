// require('dotenv').config({path : './env'})  //As early as possible in your application, 
// import and configure dotenv but in breaks code consistancy so 
import dotenv from "dotenv"
import connetDB from "./db/index.js";

dotenv.config({
    path:'./.env'
})  //also confing package.json

connetDB()











/*import express from "express"
const app = express()
;(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/{DB_NAME}`)
       app.on("error",(error)=>{
        console.log("there is an error in mongodb" ,error);
        throw error
       })

       app.listen(process.env.PORT ,()=>{
        console.log(`app is listening on PORT: ${process.env.PORT}`);
        
       })


    } catch (error) {
        console.log("Db_connection failed",error);
        throw error 
        
    }
})()
    */