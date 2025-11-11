import mongoose, { isValidObjectId } from "mongoose"
import { PlayList } from "../models/playlist.model.js"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import { asynchandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const createPlaylist = asynchandler(async(req ,res)=>{
    const {name , description} = req.body
    const owner = req.user._id

    if(!name|| name.trim() === ""){
        throw new ApiError(400 , "Name is required to create Playlist")
    }
    // const normalizeName = name.trim().toLowerCase() //“Normalization” means cleaning or standardizing input data before saving it to the database.
    // No need of Extra checks if we are using router.use(verifyJWt) got it
    // if(!owner){
    //     throw new ApiError(400 , "Your cannot create Playlist login First")
    // }

    const createdPlaylist = await PlayList.create({
        name  : name.trim(),
        description,
        videos : [],
        owner : owner
    })

    return res
    .status(200)
    .json(new ApiResponse(200  , createdPlaylist , "playlist created Successfully"))

})



const updatePlaylist = asynchandler(async(req, res)=>{
    // but for update we have to check that who is updating is this the owener or not 
    const {name , description} = req.body
    const owner = req.user._id
    const {playlistId} = req.params

    if (!name && !description) {
    throw new ApiError(400, "No fields provided to update");
}

    const existedplaylist = await PlayList.findById(playlistId)

    if(!existedplaylist){
        throw new ApiError(400 ,"playlist does not exist")
    }

    if(existedplaylist.owner.toString() !== owner.toString()){
        throw new ApiError(400 , "You  are not the owner of the playlist")
    }

    const updatedplaylist = await PlayList.findByIdAndUpdate(
        playlistId,
        {$set : {name : name?.trim() ,description : description?.trim()}},
        {new : true}
    )

return res 
.status(200)
.json(new ApiResponse(200 , updatedplaylist, "playlist updated SuccessFully"))

})


const deletePlaylist = asynchandler(async(req,res)=>{
    const{playlistId} = req.params
    const owner = req.user._id

    const playlistexist = await  PlayList.findById(playlistId)
    
    if(!playlistexist){
        throw new ApiError(400 , "playlist does not Exist")
    }

    if(playlistexist.owner.toString() !== owner.toString()){
        throw new ApiError(400 , "you cannot delete the Playlist you'r not an owner")
    }

    await PlayList.findByIdAndDelete(playlistId)

    return res
    .status(200)
    .json(new ApiResponse(200 , {} , "PlayList Deleted SuccessFUlly"))

})




const addVideoToPlaylist = asynchandler(async(req ,res)=>{
    const {videoId ,playlistId} = req.params
    
    const owner = req.user._id

    const video = await Video.findById(videoId)

    const playListexists = await PlayList.findById(playlistId)


    if(playListexists.owner.toString() !== owner.toString()){
        throw new ApiError(400 , "You are not an owner to add video")
    }

    if(!video || !playListexists){
        throw new ApiError(400  , "You cannot add the video to playlist")
    }

    if(playListexists.videos.includes(video._id)){
        throw new ApiError (400 , "Vidoe already Exists")
    }


    const addedvideo = await PlayList.findByIdAndUpdate(
        playlistId , 
        {$push :{videos : video._id }},
        {new : true}
    ) 

    return res
    .status(200)
    .json(new ApiResponse(200 , addedvideo , "Video Successfully added to playlist"))

})

const removeVideofromPlaylist = asynchandler(async(req ,res)=>{
    const {videoId ,playlistId} = req.params
    
    const owner = req.user._id

    const video = await Video.findById(videoId)

    const playListexists = await PlayList.findById(playlistId)


    if(playListexists.owner.toString() !== owner.toString()){
        throw new ApiError(400 , "You are not an owner to add video")
    }

    if(!video || !playListexists){
        throw new ApiError(400  , "You cannot add the video to playlist")
    }

     const deletedvideo =  await PlayList.findByIdAndUpdate(
        playlistId , 
        {$pull :{videos : video._id }},
        {new : true}
    ) 

    return res
    .status(200)
    .json(new ApiResponse(200 , deletedvideo , "Video Successfully added to playlist"))


})

const getPlaylistbyId = asynchandler(async(req, res)=>{
    const {playlistId} = req.params
    
    const isplaylistexist = await PlayList.findById(playlistId)

    if(!isplaylistexist){
        throw new ApiError(400 , "playlist does not Exist")
    }
    return res
    .status(200)
    .json(new ApiResponse(200 ,isplaylistexist, "here is your playList" ))

})

const getUserPlaylists = asynchandler(async(req, res)=>{
    const {userId} = req.params

    const userExists = await User.findById(userId)
    if(!userExists){
        throw new ApiError(400 , "user is not registor in DB ")
    }

    const userPlayLists = await PlayList.find({owner : userId}) // find all playlists owned by a particular user, so   query by the owner field


    return res
    .status(200)
    .json(new ApiResponse(200 , userPlayLists , "users play list fetched successfully"))

})

export{
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideofromPlaylist,
    getPlaylistbyId,
    getUserPlaylists,

}