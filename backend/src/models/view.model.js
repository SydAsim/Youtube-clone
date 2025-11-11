import mongoose, { Schema } from "mongoose";

/**
 * VIEW MODEL
 * Tracks which users have viewed which videos
 * Prevents duplicate view counting
 */
const viewSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    viewer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for non-logged-in users
    },
    ipAddress: {
      type: String,
      required: false, // Track IP for non-logged-in users
    },
  },
  { timestamps: true }
);

// Compound index to ensure one view per user per video
viewSchema.index({ video: 1, viewer: 1 }, { unique: true, sparse: true });
viewSchema.index({ video: 1, ipAddress: 1 }, { unique: true, sparse: true });

export const View = mongoose.model("View", viewSchema);
