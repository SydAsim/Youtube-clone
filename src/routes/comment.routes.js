import { Router } from "express";
import { getVideoComments , deleteComment, updateComment,addComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT) // we are declaring all the routes
// must be using verfiyJWT middleware to verify


//it means For the same endpoint /api/comments/:videoId, 
// if the request method is GET, run getVideoComments, if it’s POST, run addComment.
router.route("/:videoId").get(getVideoComments).post(addComment)
router.route("/c/:commentId").patch(updateComment).delete(deleteComment)

export default router