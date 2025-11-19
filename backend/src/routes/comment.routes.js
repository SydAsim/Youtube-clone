import { Router } from "express";
import { getVideoComments, deleteComment, updateComment, addComment } from "../controllers/comment.controller.js";
import { verifyJWT, verifyJWTOptional } from "../middlewares/auth.middleware.js"

const router = Router()

// Public route - anyone can view comments
router.route("/:videoId").get(verifyJWTOptional, getVideoComments)

// Protected routes - must be logged in
router.route("/:videoId").post(verifyJWT, addComment)  // Must be logged in to add comment
router.route("/c/:commentId")
    .patch(verifyJWT, updateComment)  // Must be logged in to update
    .delete(verifyJWT, deleteComment)  // Must be logged in to delete

export default router