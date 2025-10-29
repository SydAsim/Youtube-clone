import {asynchandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"

const getVideoComments = asynchandler(async (req, res) => {
  const { videoId } = req.params;
  const { limit = 10, cursor } = req.query; // cursor = last comment ID from client cursor is expected to be the _id of the last comment the client saw (used for cursor-based pagination).

  // 1️ Check if video exists (optional if already handled elsewhere)
  const videoExists = await Video.findById(videoId);
  if (!videoExists) {
    throw new ApiError(404, "Video does not exist");
  }

  // 2️ Build query Constructs a Mongo/Mongoose query object:
  const query = { video: videoId };
  if (cursor) {
    query._id = { $lt: cursor }; // fetch comments older than last seen
  }

  // 3️ Fetch comments
  const comments = await Comment.find(query)
    .sort({ _id: -1 }) // newest first
    .limit(Number(limit) + 1) // fetch one extra to detect next page
    .populate("owner", "username avatar");

  // 4️ Handle pagination cursor
  const hasNextPage = comments.length > limit;
  const nextCursor = hasNextPage ? comments[limit - 1]._id : null;

  if (hasNextPage) comments.pop(); // remove extra record

  // 5️ Send response
  return res.status(200).json(
    new ApiResponse(200, {
      comments,
      nextCursor,
      hasNextPage,
    }, "Video comments fetched successfully")
  );
});




const addComment = asynchandler(async(req,res)=>{
    const {videoId} = req.params // get video id 
    const {content} = req.body 

    const owner = req.user._id  //using the authenticated user from middleware. as it you already verified the user in JWT middleware (req.user exists only for valid users).

    if(!content || content.trim() === ""){
        throw new ApiError(400 , "comment content is required")
    }
    
    // check video in db as well extra check
    const videoExists = await Video.findById(videoId)
    if(!videoExists){
        throw new ApiError (400  , "Video does not exist in db")
    }


    const comment = await Comment.create({
        owner ,
        video : videoId,
        content
    })
    
    return res
    .status(200) 
    .json(new ApiResponse(200 ,comment,"Comment made scuccessfully"))

})





const updateComment = asynchandler(async (req ,res)=>{
    const {content} = req.body
    const {commentId} = req.params
   
    // 1 check is comment available
    if(!content || content.trim() === "" ){
        throw new ApiError(400 , "content is required")
    }

    // 2 find comment in DB 
    const comment = await Comment.findById(commentId)
        if(!comment){
            throw new ApiError(400 , "Comment does not exists")
        }
        
    // 3 Authorization if the loggedIn User is the comment owner
    // from this we will know 2 things owner and is the User logged in or not
    if (comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(400 , "You can not edit Comments login first")
    }
 
    //4  Update 
    const updatedComment  = await Comment.findByIdAndUpdate (
        commentId ,
        {$set:{content : content}},
        {new : true}

    )
    
    return res
    .status(200)
    .json(new ApiResponse(200 , updatedComment , "Comment Updated SuccessFully"))

})

const deleteComment = asynchandler(async (req, res)=>{
    const {commentId} = req.params

    // 2 check is the user owner of the comment 
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(400 , "Comment do not exist")
    }

    // 2 authorize user that can he delete
    if(comment.owner.toString()!== req.user._id.toString()){
        throw new ApiError (403 , "You are not authorized to delete this comment")
    }
 

    // 3 delete the comment
    await Comment.findByIdAndDelete(commentId)

    return res
    .status(200)
    .json(new ApiResponse(200 ,{} ,"Comment Deleted SuccessFully"))

})





export {
    addComment ,
    updateComment,
    deleteComment,
    getVideoComments
}