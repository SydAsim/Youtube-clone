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
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

// ============================================
// SPECIFIC ROUTES FIRST (before /:videoId)
// ============================================

// Test endpoint
router.get("/test", (req, res) => {
  console.log('✅ TEST ROUTE HIT');
  res.json({ success: true, message: "Video routes are working!" });
});

// Get all videos
router.get("/", getAllVideos);

// Upload video (protected)
router.post("/",
    verifyJWT,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    publishAVideo
);

// Search videos (public) - MUST be before /:videoId
router.get("/search", (req, res, next) => {
  console.log('🔍 SEARCH ROUTE HIT - Query:', req.query.query);
  next();
}, searchVideos);

// Toggle publish status (protected)
router.patch("/toggle/publish/:videoId", verifyJWT, togglePublishStatus);

// ============================================
// DYNAMIC ROUTES LAST (/:videoId)
// ============================================

// Single video operations
router.route("/:videoId")
    .get(getVideoById)  // Get video by ID (public)
    .delete(verifyJWT, deleteVideo)  // Delete video (protected)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo);  // Update video (protected)

export  default router