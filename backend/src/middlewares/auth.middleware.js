import { ApiError } from "../utils/ApiErrors.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asynchandler(async(req,res , next)=>{
    try {
        // Hey, I’m a logged-in user, here’s my token as proof
        // The one who bears (carries) this token is authorized.
        const token = req.cookies?.accessToken ||
         req.header("Authorization")?.replace("Bearer " , "")


         if(!token) {
            throw new ApiError(400 , "Unauthorized Request")
         }

        const decodedToken = jwt.verify(token  , process.env.ACCESS_TOKEN_SECRET) 

        const user = await User.findById(decodedToken?._id).select(
            "-password  -refreshToken"
        )

        if(!user){
            throw new ApiError(400 , "invalid Access TOken")
        }
        
        req.user = user 
        next()
    } catch (error) {
        throw new ApiError(400 ,error?.message || "Invalid Acess Token")
        
    }

})