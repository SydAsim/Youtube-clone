import express from "express"
import cookieParser from "cookie-parser" // Basically to perform the CRUD Operations on users credentials(access and refreshTokens)
import cors from "cors"


const app = express()

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))
// we can also specify that on which to allow from the front end vite etc

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, // urlencoded handles the username or any search words into special characters like   spaceing etc %20
    limit: "20kb"
}))
app.use(express.static("public")) // static store images files etc in ur own server 
app.use(cookieParser())



// import user routes 
import userRouter from "./routes/user.routes.js"
import commentRouter from "./routes/comment.routes.js"
import tweetRouter from "./routes/tweets.routes.js"
import videoRouter from "./routes/video.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import likeRouter from "./routes/like.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import  healthcheckRouter from "./routes/healthcheck.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
// use below route for users related routes regestor login etc 
app.use("/api/v1/users" , userRouter)

app.use("/api/v1/comments" , commentRouter)

app.use("/api/v1/tweets" , tweetRouter)

app.use("/api/v1/videos" , videoRouter)

app.use("/api/v1/playlist" ,playlistRouter)

app.use("/api/v1/likes" ,likeRouter)

app.use("/api/v1/subscriptions" , subscriptionRouter)

app.use("/api/v1/healthcheck" , healthcheckRouter)

app.use("/api/v1/dashboard" , dashboardRouter)




app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});



export { app } 