import express from "express"
import cookieParser from "cookie-parser" // Basically to perform the CRUD Operations on users credentials(access and refreshTokens)
import cors from "cors"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true 
    
}))
// we can also specify that on which to allow from the front end vite etc

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true  // urlencoded handles the username or any search words into special characters like   spaceing etc %20
    ,limit: "20kb"
}))
app.use(express.static("public")) // static store images files etc in ur own server 
app.use(cookieParser())



// import user routes 
import userRouter from "./routes/user.routes.js"
// use below route for user registeration
app.use("/api/v1/users" , userRouter)

export { app } 