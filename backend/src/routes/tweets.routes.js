import { Router } from "express";
import {
    getUserTweets,
    createTweet,
    updatedTweet,
    deleteTweet,
    getAllTweets
} from "../controllers/tweet.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route("/").post(createTweet).get(getAllTweets)
router.route("/user/:userId").get(getUserTweets)
router.route("/:tweetId").patch(updatedTweet).delete(deleteTweet)

export default router

