import { ApiError } from "../utils/ApiErrors.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asynchandler(async (req, res, next) => {
    try {
        // Hey, I'm a logged-in user, here's my token as proof
        // The one who bears (carries) this token is authorized.
        const token = req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "")


        if (!token) {
            throw new ApiError(401, "Unauthorized Request - No token provided")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select(
            "-password  -refreshToken"
        )

        if (!user) {
            throw new ApiError(401, "Invalid Access Token - User not found")
        }

        req.user = user
        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid Access Token")
        }
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Access Token Expired")
        }
        throw new ApiError(401, error?.message || "Unauthorized")
    }

})

export const verifyJWTOptional = asynchandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return next()
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select(
            "-password  -refreshToken"
        )

        if (user) {
            req.user = user
        }
        next()
    } catch (error) {
        // If token is invalid, just proceed as guest
        next()
    }
})
