import mongoose from "mongoose";
import { asynchandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"

const getVideoComments = asynchandler(async (req, res) => {
    const { videoId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const userId = req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const videoExists = await Video.findById(videoId);
    if (!videoExists) {
        throw new ApiError(404, "Video does not exist");
    }

    const aggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                owner: {
                    $first: "$owner"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [userId || null, "$likes.likedby"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                likesCount: 1,
                isLiked: 1,
                owner: {
                    username: 1,
                    avatar: 1,
                    _id: 1
                }
            }
        }
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const comments = await Comment.aggregatePaginate(aggregate, options);

    return res
        .status(200)
        .json(new ApiResponse(200, comments.docs, "Video comments fetched successfully"));
});

const addComment = asynchandler(async (req, res) => {
    const { videoId } = req.params // get video id 
    const { content } = req.body

    const owner = req.user._id  //using the authenticated user from middleware. as it you already verified the user in JWT middleware (req.user exists only for valid users).

    if (!content || content.trim() === "") {
        throw new ApiError(400, "comment content is required")
    }

    // check video in db as well extra check
    const videoExists = await Video.findById(videoId)
    if (!videoExists) {
        throw new ApiError(400, "Video does not exist in db")
    }


    const comment = await Comment.create({
        owner,
        video: videoId,
        content
    })

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment made scuccessfully"))

})

const updateComment = asynchandler(async (req, res) => {
    const { content } = req.body
    const { commentId } = req.params

    // 1 check is comment available
    if (!content || content.trim() === "") {
        throw new ApiError(400, "content is required")
    }

    // 2 find comment in DB 
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(400, "Comment does not exists")
    }

    // 3 Authorization if the loggedIn User is the comment owner
    // from this we will know 2 things owner and is the User logged in or not
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "You can not edit Comments login first")
    }

    //4  Update 
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $set: { content: content } },
        { new: true }

    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment Updated SuccessFully"))

})

const deleteComment = asynchandler(async (req, res) => {
    const { commentId } = req.params

    // 2 check is the user owner of the comment 
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(400, "Comment do not exist")
    }

    // 2 authorize user that can he delete
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment")
    }


    // 3 delete the comment
    await Comment.findByIdAndDelete(commentId)

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment Deleted SuccessFully"))

})

export {
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
}