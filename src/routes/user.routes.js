import {loginUser, logoutUser, registerUser} from "../controllers/user.controller.js"
import {upload} from '../middlewares/multer.middleware.js'
import { Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
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


router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT , logoutUser)

export default router
