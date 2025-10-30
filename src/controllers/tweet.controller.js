import { Tweet } from "../models/tweet.model.js";
import {User} from "../models/user.model.js"
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";

// create tweet 
// update tweet 
// delet tweet 
// get alltweet

const createTweet = asynchandler(async (req, res)=>{
    const {content} = req.body
    const owner = req.user._id

    if(!content || content.trim() === ""){
        throw new ApiError(400 ,"The content does not exist")
    }

    const createtweet = await Tweet.create({content , owner})

    await createtweet.populate("owner" , "username avatar")

    return res
    .status(200)
    .json(new ApiResponse (200 , createtweet , "Tweet created Successfully"))

})

const updatedTweet= asynchandler(async(req,res)=>{
    const {content} = req.body
    
    const {tweetId} = req.params
   
    // 1 does content exists or not
    if(!content || content.trim() === "" ){
        throw new ApiError( 400 ,"content does not exist")
    }

    // 2  check tweet in db
    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(400 , "tweet does not exist")
    }

    // 3 authorize the owner
    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(400  , "You cannot udpate the tweet")
    }
    
    // 4 allow update
    const updateTweet = await Tweet.findByIdAndUpdate(
        tweetId ,
        {$set: {content}},
        {new : true}
    ).populate("owner" , "username avatar")

    return res
    .status(200)
    .json(new ApiResponse (200 , updateTweet , "tweet updated successfully"))

})

const deleteTweet = asynchandler(async(req ,res)=>{
    const {tweetId} = req.params

    // find 
    const tweet = await Tweet.findById(tweetId)


    if(!tweet){
        throw new ApiError(400 , "tweet do not exist")
    }

    // authorize
    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(400 , "you are not allowed to tweet")
    }

    // delete
    await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(200)
    .json(new ApiResponse(200 , {} ,"Tweet deleted Successfully"))
})




const getUserTweets = asynchandler(async(req,res)=>{
    const {userId} = req.params

    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(400 , "user does not exist")
    }


    const tweets = await Tweet.find({owner : userId})
    .populate("owner" , "username  avatar")
    .sort({createdAt : -1})

    return res
    .status(200)
    .json(new ApiResponse (200 , tweets , "Tweets fetched Successfully"))

})




export {
     createTweet,
     updatedTweet,
     deleteTweet,
     getUserTweets,

}