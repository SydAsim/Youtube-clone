import { Router } from "express";
import {
    getSubscribedChannels,
    toggleSubscription,
    getUserChannelSubscribers

}from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

// 1️ Toggle subscription to a channel (subscribe/unsubscribe)
router.route("/c/:channelId")
    .post(toggleSubscription)

// 2️ Get all channels a user has subscribed to
router.route("/subscribed/:subscriberId")
    .get(getSubscribedChannels)

// 3️ Get all subscribers of a particular channel
router.route("/u/:channelId")
    .get(getUserChannelSubscribers)

export default router