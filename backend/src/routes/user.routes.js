import {changePassword, getCurrentUser, getUserChannelProfile, getUserWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUsercoverImage, forgotPassword, resetPassword} from "../controllers/user.controller.js"
import {upload} from '../middlewares/multer.middleware.js'
import { Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authLimiter } from "../middlewares/rateLimiter.middleware.js"

const router = Router()

router.route("/register").post(
    authLimiter,
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        },
        
    ]),registerUser)

    // more routes like login change pass etc will also be wrtten here


router.route("/login").post(authLimiter, loginUser)

router.route("/logout").post(verifyJWT , logoutUser)

router.route("/accessrefreshtoken").post(refreshAccessToken)

router.route("/changepassword").post(verifyJWT , changePassword)

router.route("/getCurrentUser").get(verifyJWT , getCurrentUser)

router.route("/updateAccountDetails").patch(verifyJWT , updateAccountDetails)

router.route("/updateUserAvatar").patch(verifyJWT , upload.single("avatar") , updateUserAvatar)

router.route("/updateUsercoverImage").patch(verifyJWT , upload.single("coverImage") , updateUsercoverImage)

router.route("/c/:username").get(getUserChannelProfile) // Public route - anyone can view channels

router.route("/history").get(verifyJWT , getUserWatchHistory)

// Password reset routes
router.route("/forgot-password").post(authLimiter, forgotPassword)
router.route("/reset-password/:token").post(resetPassword)

export default router
