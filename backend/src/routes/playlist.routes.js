import { Router } from "express";
import {
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideofromPlaylist,
    getPlaylistbyId,
    getUserPlaylists,
} from "../controllers/playlist.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route("/").post(createPlaylist)

router
      .route("/:playlistId") //on playlistId give me these routes
      .get(getPlaylistbyId)
      .patch(updatePlaylist)
      .delete(deletePlaylist)

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").patch(removeVideofromPlaylist)

router.route("/user/:userId").get(getUserPlaylists)

export default router