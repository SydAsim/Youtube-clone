import mongoose ,{isValidObjectId} from "mongoose"
import {Subscription} from "../models/subscription.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/asyncHandler.js"


const toggleSubscription = asynchandler(async (req, res) => {
    const {channelId} = req.params
    const subscriberId =  req.user._id

    if(!subscriberId){
        throw new ApiError(400 , "You need to be logged in to subsribe")
    }

    if(!mongoose.isValidObjectId(channelId)){
        throw new ApiError(400 , "Invalid channel id")
    }

    const channel = await User.exists({_id:channelId})
    if(!channel){
        throw new ApiError(400 , "Channel does not Exist")
    }

    const isSubscribed = await Subscription.findOne({subscriber : subscriberId , channel : channelId })
    if(isSubscribed){
        await Subscription.deleteOne({subscriber : subscriberId , channel : channelId })
        return res .status(200).json(new ApiResponse(200 , {} ,"Unsubscribed SuccessFully"))
    }

    const newSub = await Subscription.create({
        channel : channelId,
        subscriber : subscriberId
       
})

    return res
    .status(200)
    .json(new ApiResponse(200 ,
        {
        count: 1,
        data : newSub,
        }
        ,
        "You have subscribed Successfully"))
        
})




// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchandler(async (req, res) => {
    const {channelId} = req.params
     if(!mongoose.isValidObjectId(channelId)){
        throw new ApiError(400 , "Invalid  channel id ")
    }

    const ischannelExists = await User.exists({ _id : channelId})
    if(!ischannelExists){
        throw new ApiError(400 , "channel does not exists")
    }

     const subscribers = await Subscription
    .find({channel : channelId })
    .populate("subscriber" , "username  avatar email")
    

    return res
   .status(200)
   .json(new ApiResponse(200  ,{count:subscribers.length , data:subscribers}  ,  "Subscribers of individual Channel fetched Successfully"))



})

// controller to return channel list to which user has subscribed
// give me subscriber id so that i can find which channels he has subscribed too 
const getSubscribedChannels = asynchandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!mongoose.isValidObjectId(subscriberId)){
        throw new ApiError(400 , "Invalid  subscriber id ")
    }
    const isSubscriberExists = await User.exists({ _id : subscriberId})
    if(!isSubscriberExists){
        throw new ApiError(400 , "Subscriber does not exists")
    }

    const findSubscriber = await Subscription
    .find({subscriber : subscriberId})
    .populate("channel" , "username  avatar email")

    return res
   .status(200)
   .json(new ApiResponse(200  ,findSubscriber  || [],  "Subscribed Channels fetched Successfully"))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}