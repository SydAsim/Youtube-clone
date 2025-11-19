import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";


//  GET CHANNEL STATS

const getChannelStats = asynchandler(async (req, res) => {
  const channelId = req.user?._id; // channel = logged in user

  if (!channelId || !mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid or missing channel ID");
  }

  // 1️ Total videos uploaded
  const totalVideos = await Video.countDocuments({ owner: channelId });

  // 2️ Total subscribers
  const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

  // 3️ Total likes (on all channel videos)
  // Find all videos owned by this channel This gives us a list of only the video IDs belonging 
  // to that channel (since .select("_id") limits fields for efficiency).
  const channelVideos = await Video.find({ owner: channelId }).select("_id");
  const videoIds = channelVideos.map((v) => v._id); // Extract the array of IDs
  // then . Count how many likes exist on any of these videos
  const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });
  // “Find all videos this channel has uploaded → grab their IDs → count how many Like documents reference those IDs.”


  // 4️ Total views
  const totalViewsAgg = await Video.aggregate([
    {
      $match:
        { owner: new mongoose.Types.ObjectId(channelId) } //This filters all the Video documents to only those where the owner field matches the given channelId.
    },
    { $group: { _id: null, totalViews: { $sum: "$views" } } }, // Here we group all matched documents together (that’s why _id: null — meaning one single group for all results).Then we sum up the views field of all those videos.
  ]);

  const totalViews = totalViewsAgg[0]?.totalViews || 0;
  //   The result of aggregation is an array, so we grab the first element ([0]) and safely access its totalViews value (using optional chaining ?.).
  // If no videos exist, it defaults to 0.


  return res
    .status(200)
    .json(
      new ApiResponse(200, {
        totalVideos,
        totalSubscribers,
        totalLikes,
        totalViews,
      },
        "Channel stats fetched successfully")
    );
});



//  GET CHANNEL VIDEOS

const getChannelVideos = asynchandler(async (req, res) => {
  const channelId = req.user?._id;

  if (!channelId || !mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid or missing channel ID");
  }

  const videos = await Video.find({ owner: channelId })
    .sort({ createdAt: -1 }) // newest first
    .select("title thumbnail views likes createdAt videoFile duration isPublished");

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});


//  GET HOME FEED (PUBLIC)

const getHomeFeed = asynchandler(async (req, res) => {
  // Get all published videos for home feed
  const videos = await Video.find({ isPublished: true })
    .sort({ createdAt: -1 }) // newest first
    .populate("owner", "username fullName avatar")
    .select("title thumbnail views createdAt videoFile duration");

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Home feed fetched successfully"));
});

export {
  getChannelStats,
  getChannelVideos,
  getHomeFeed,
};
