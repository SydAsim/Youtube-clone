import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getChannelStats,
    getChannelVideos,
    getHomeFeed
}
from "../controllers/dashboard.controller.js"

const router = Router()

router.route("/home").get(getHomeFeed)

router.use(verifyJWT)

router.route("/status").get(getChannelStats)
router.route("/video").get(getChannelVideos)


export default router