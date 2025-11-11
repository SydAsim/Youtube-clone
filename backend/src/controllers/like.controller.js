import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {asynchandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiErrors.js"
import {User} from "../models/user.model.js"
import {Video} from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Comment } from "../models/comment.model.js"

const toggleVideoLike = asynchandler(async(req,res)=>{
    const {videoId} = req.params
    const userId   = req.user._id
     

    if(!userId){
        throw new ApiError(400 , "You cannot Like video Login or Register first")
    }
    
    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400 , "invalid video id")
    }

    const videoexist  = await Video.exists({_id: videoId}) // exists is faster that findbyid
    if(!videoexist){
        throw new ApiError(400 , "Video does not exist")
    }


    // check if user have liked videos or not 
    const existingLike = await Like.findOne({video :videoId , likedby : userId})

    if(existingLike){
        // unlike remove it 
        await existingLike.deleteOne()  // deletes that exact doc or model level Like.deleteOne({video :videoId , likedby : userId})
        return res.status(200).json(new ApiResponse(200 , {},"unliked Video  successfully"))
    }
    

    const newLike = await Like.create({
        video : videoId ,
        likedby : userId
        
})
    return res 
    .status(200)
    .json(new ApiResponse(200 , newLike, "Video Liked Successfully" ))

})





const toggleCommentLike = asynchandler(async (req , res)=>{
    const {commentId} = req.params
    const userId = req.user._id

    if(!userId){
        throw new ApiError(400 , "login to like comment")
    }

    if(!mongoose.isValidObjectId(commentId)){
        throw new ApiError(400 , "invalidObjectId")
    }

    // now check in db 
    const  commentExist = await Comment.exists({_id : commentId})
    if(!commentExist){
        throw new ApiError(400 , "Comment does not exist")
    }

    //now check is comment liked or not 
    const isCommentLiked = await Like.findOne({comment : commentId , likedby : userId})
    if(isCommentLiked){
        //unlike
        await isCommentLiked.deleteOne()
        return res.status(200).json(new ApiResponse (200 ,{} , "comment unliked successfully"))
    }

    const commentliked = await Like.create({
        comment : commentId , 
        likedby : userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200 , commentliked , "comment Liked Successfully"))

})

const toggleTweetLike = asynchandler (async(req,res)=>{
    const {tweetId} = req.params
    const userId = req.user._id

    // 1 check user login or not
    if(!userId){
        throw new ApiResponse(400 , "login or Reg  first")
    }

    //2 check the tweet validmongooseid
    if(!mongoose.isValidObjectId(tweetId)){
        throw new ApiError(400 , "invalid tweetId")
    }

    //3 if it passes the valid mongoose id then it should call the db
    const istweetexist = await Tweet.exists({_id : tweetId})
    if(!istweetexist){
        throw new ApiError (400 , "Tweet does not exist")
    }

    //4 now if tweet exsit find is it liked by the user or not
    const islikedtweet = await Like.findOne({tweet : tweetId  , likedby : userId})
    //unlike the tweet
    if(islikedtweet){
        await Like.deleteOne(islikedtweet)
        return res .status(200).json(new ApiResponse(200 , {} ,"tweet unliked Successfully"))
    }

    //5 now actually if the tweet is not liked let the user like the tweet 
    const likedtweet = await Like.create({
        tweet : tweetId ,
        likedby : userId 
    })

    return res
    .status(200)
    .json(new ApiResponse(200  , likedtweet , "Tweet has been liked Successfully"))

})



const getLikedVideos = asynchandler(async(req,res)=>{
    
    const userId = req.user._id
   if(!userId){
    throw new ApiError(400 , "you need to login/reg first")
   }

   const likedVideos = await Like.find({
    likedby : userId,
    video : {$ne : null}          //Only include documents where video is not equal to null
    })
    .populate({
      path: 'video',
      populate: {
        path: 'owner',
        select: 'username fullname avatar'
      }
    })           //Populate video and its owner information
    .select("-__v   -likedby")  //-__v → removes the version key that Mongoose adds automatically. -likedby → hides the likedby field (you already know who liked them — the current user)
    // so query means Find all Like documents where the likedby user is the current user and the video field is not null. Then, replace the video ID with the full video document and remove extra fields//

   if(!likedVideos.length){
    throw new ApiError(400 , "you have not liked any video yet")
   }

   return res
   .status(200)
   .json(new ApiResponse(200 , likedVideos , "Curr user liked videos fetched Successfully"))

})



export{

toggleCommentLike ,
toggleTweetLike ,
toggleVideoLike ,
getLikedVideos,
}



// What mongoose.isValidObjectId() actually does
// It does not connect to the database or fetch anything.
// so ❌❌ no extra db call just validator 
// Think of it as a quick syntax validator — it only verifies whether the provided string looks like a legitimate ObjectId (24 hex characters, etc.).

// Example:
// mongoose.isValidObjectId(value) is a purely local check —
// it does NOT query the database or check if that document exists.

// It only verifies whether the given value could be a valid MongoDB ObjectId, meaning it checks:

// ✅ The value is a string or ObjectId instance.

// ✅ It is exactly 24 hexadecimal characters (0–9, a–f).

// ✅ It can be converted into a valid ObjectId without throwing an error.

// 🧠 Example
// import mongoose from "mongoose";

// mongoose.isValidObjectId("64e9c03d2a51a0f246e7d01a"); // ✅ true
// mongoose.isValidObjectId("12345");                    // ❌ false
// mongoose.isValidObjectId("not-an-id");                // ❌ false
// mongoose.isValidObjectId({ owner: "64e9..." });       // ❌ false
// mongoose.isValidObjectId(new mongoose.Types.ObjectId()); // ✅ true