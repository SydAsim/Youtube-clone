import { Router } from "express";
import {
  publishAVideo,
  deleteVideo,
  updateVideo,
  togglePublishStatus,
  getVideoById,
  getAllVideos,
  searchVideos
} from "../controllers/video.controller.js";
import { verifyJWT, verifyJWTOptional } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"
import { uploadLimiter } from "../middlewares/rateLimiter.middleware.js"

const router = Router()

// ============================================
// SPECIFIC ROUTES FIRST (before /:videoId)
// ============================================

router.get("/test", (req, res) => {
  res.json({ success: true, message: "Video routes are working!" });
});

// Get all videos
router.get("/", getAllVideos);

// Upload video (protected)
router.post("/",
  verifyJWT,
  uploadLimiter,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  publishAVideo
);

router.get("/search", (req, res, next) => {
  next();
}, searchVideos);

// Toggle publish status (protected)
router.patch("/toggle/publish/:videoId", verifyJWT, togglePublishStatus);

// ============================================
// DYNAMIC ROUTES LAST (/:videoId)
// ============================================

// Single video operations
router.route("/:videoId")
  .get(verifyJWTOptional, getVideoById)  // Get video by ID (public but tracks history if logged in)
  .delete(verifyJWT, deleteVideo)  // Delete video (protected)
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo);  // Update video (protected)

export default router