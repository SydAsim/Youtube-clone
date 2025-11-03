import mongoose ,{ isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {asynchandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {uploadonCloudinary} from "../utils/Cloudinary.js"





const publishAVideo = asynchandler(async(req ,res)=>{
const {title,description} = req.body
const owner = req.user?._id

if(!owner){
    throw new ApiError(400 , "You must be login or Register to upload video")
}

if(!title){
    throw new ApiError(400 , "Video title  is requiured")
}



const videoLocalFilePath = req.files?.videoFile[0]?.path
const thumbnailLocalFilePath = req.files?.thumbnail[0]?.path

if(!videoLocalFilePath || !thumbnailLocalFilePath){
    throw new ApiError(400 , "vidoeFile and thumbnail is required")
}
// console.log(req.files);


const videoUpload = await uploadonCloudinary(videoLocalFilePath)
const thumbnailUpload = await uploadonCloudinary(thumbnailLocalFilePath)

if(!videoUpload || !thumbnailUpload){
    throw new ApiError(400 , "video upload failed to Cloudinary ")
}


const publishedVideo  = await Video.create({
    videoFile : videoUpload.url,
    thumbnail : thumbnailUpload.url,
    title,
    description,
    duration : videoUpload.duration || 0,
    isPublished : true,
    owner
})

return res
.status(201)
.json(new ApiResponse(200 , publishedVideo ,"VideoPublised Successfully"))

})




const updateVideo = asynchandler(async(req ,res)=>{
    const {videoId} = req.params
    const owner  = req.user?._id
    const {title , description} =req.body

    if(!title && !description && !req.files?.thumbnail?.[0]) {
        throw new ApiError(400 , "title or description or required")
    }
   
  //1 find is video exist 
  const video = await Video.findById(videoId)
  if(!video) {
    throw new ApiError(400 , "Video is not available")
  }


  //2 validate
  if(video.owner.toString() !== owner.toString()){
    throw new ApiError(400 ,"You are not authorized to update this video")
  }



//   3 has user upload the thumbnail or not lets check

let thumbnailurl = video.thumbnail //we’re initializing a variable thumbnailUrl with the current thumbnail URL from the existing video document.
const thumbnailLocalFilePath = req.files?.thumbnail?.[0]?.path
  

if(thumbnailLocalFilePath){
    const thumbnail = await uploadonCloudinary(thumbnailLocalFilePath)

    if(!thumbnail?.url){
    throw new ApiError(400 ,"Thumbnail upload on Cloudinary failed")
  }
  thumbnailurl = thumbnail.url // replace the new with old one
  }

  if (!isValidObjectId(videoId)) {
  throw new ApiError(400, "Invalid video ID");
}

 
  //4 update
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId ,
    {
        $set:{                                       //Normally, the spread operator copies all properties of an object into another.
            ...(title && {title}),                   //If title exists → update it. 
            ...(description && {description}),       //If desccription exists → update it.
            ...(thumbnailurl && {thumbnail: thumbnailurl})  // if thumbnail exist update it

        }
    },
    {new : true}
  )

  return res 
  .status(200)
  .json(new ApiResponse(200 , updatedVideo , "Video Update Successfully"))

})






const deleteVideo = asynchandler(async(req, res)=>{
    const {videoId} = req.params
    const owner = req.user._id

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400 , "video does not exist")
    }

    if(video.owner.toString() !== owner.toString()){
        throw new ApiError(400 , "You are not authorized to ")
    }

    await Video.findByIdAndDelete(videoId)

    return res
    .status(200)
    .json(new ApiResponse(200 , {} , "vidoe deleted  successfully"))
})


const getVideoById = asynchandler(async(req,res)=>{
   const {videoId} = req.params

   const video = await Video.findById(videoId)
   if(!video){
    throw new ApiError(400 , "video does not Exsit")
   }


   return res
   .status(200) 
   .json(new ApiResponse(200 , video , "Video fetech by id Successfully"))
})


const togglePublishStatus = asynchandler(async(req , res)=>{
    const {videoId} = req.params
    
    const video = await Video.findById(videoId)

    if (video.owner.toString() !== req.user._id.toString()) {
  throw new ApiError(403, "You are not authorized to change publish status");
}

    if(!video){
        throw new ApiError(400 , "video deos not Exists")
    }

   
    // if(video.isPublished === true){
    //     video.isPublished = false
    // }else{
    //     video.isPublished = true
    // }
    video.isPublished = !video.isPublished;
    await video.save()

    return res
    .status(200)
    .json(new ApiResponse(200 , video.isPublished  , "toggletrue"))


})





const getAllVideos = asynchandler(async (req, res) => {
  const owner = req.user?._id;

  // Check if owner exists
  if (!owner) {
    throw new ApiError(400, "Owner does not exist");
  }

  // Fetch only published videos of this specific owner
  const publishedVideos = await Video.find({
    owner,
    isPublished: true,
  });

  // If no videos found
  if (publishedVideos.length === 0) {
    return res.status(200).json(new ApiResponse(200 , [] ,"No published videos found for this user"))
  }

  // Send response
  return res.status(200).json({
    success: true,
    count: publishedVideos.length,
    data: publishedVideos,
  });
});





export{
    publishAVideo,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getVideoById,
    getAllVideos
}

// without spread operator in update  we can also write it like that
// const updates = {};
// if (title) updates.title = title;
// if (description) updates.description = description;
// if (thumbnailUrl) updates.thumbnail = thumbnailUrl;

// await Video.findByIdAndUpdate(videoId, { $set: updates });
// The trick here: conditional property inclusion
// Now look at this:
// ...(title && { title })
// If title exists (truthy), then { title } is { title: "some value" }
// The spread operator ... then spreads this property into the $set object.
// ✅ Example:
// const title = "New video"
// const obj = {
//   ...(title && { title })
// }
// console.log(obj) // { title: "New video" }
// But if title doesn’t exist:
// const title = ""
// const obj = {
//   ...(title && { title })
// }
// console.log(obj) // {}   <-- nothing added

// So, it conditionally adds a property only if the variable exists.