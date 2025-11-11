import mongoose ,{ isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {View} from "../models/view.model.js"
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



const videoLocalFilePath = req.files?.videoFile?.[0]?.path;
const thumbnailLocalFilePath = req.files?.thumbnail?.[0]?.path;


if(!videoLocalFilePath || !thumbnailLocalFilePath){
    throw new ApiError(400 , "vidoeFile and thumbnail is required")
}
// console.log(req.files);


const videoUpload = await uploadonCloudinary(videoLocalFilePath)
const thumbnailUpload = await uploadonCloudinary(thumbnailLocalFilePath)

if(!videoUpload || !thumbnailUpload){
    throw new ApiError(400 , "video upload failed to Cloudinary ")
}

// Extract duration from Cloudinary response
// Cloudinary returns duration in seconds for video files
const videoDuration = videoUpload.duration || 0;
console.log('Cloudinary video upload response:', {
    duration: videoDuration,
    format: videoUpload.format,
    resource_type: videoUpload.resource_type
});

const publishedVideo  = await Video.create({
    videoFile : videoUpload.url,
    thumbnail : thumbnailUpload.url,
    title,
    description,
    duration : Math.round(videoDuration), // Round to nearest second
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
   const userId = req.user?._id // May be undefined if not logged in
   const ipAddress = req.ip || req.connection.remoteAddress

   // Populate owner information for video display
   const video = await Video.findById(videoId).populate('owner', 'username fullname avatar')
   
   if(!video){
    throw new ApiError(400 , "video does not Exist")
   }

   // Increment view count logic
   let shouldIncrementView = true

   // 1. Don't count if user is viewing their own video
   if(userId && video.owner._id.toString() === userId.toString()) {
     shouldIncrementView = false
   }

   // 2. Check if this user/IP has already viewed this video
   if(shouldIncrementView) {
     try {
       // Try to create a view record
       if(userId) {
         // For logged-in users
         try {
           await View.create({ video: videoId, viewer: userId })
           
           // Only add to watch history if view was successfully created
           await User.findByIdAndUpdate(
             userId,
             {
               $addToSet: { watchHistory: videoId } // $addToSet prevents duplicates
             }
           ).catch(err => console.error('Watch history update failed:', err))
           
           // Increment view count only on first view
           video.views = (video.views || 0) + 1
           await video.save()
         } catch (viewError) {
           // If duplicate view (already viewed), don't increment or add to history
           if(viewError.code !== 11000) {
             console.error('Error creating view record:', viewError)
           }
         }
       } else {
         // For anonymous users (by IP)
         try {
           await View.create({ video: videoId, ipAddress })
           video.views = (video.views || 0) + 1
           await video.save()
         } catch (viewError) {
           if(viewError.code !== 11000) {
             console.error('Error creating view record:', viewError)
           }
         }
       }
     } catch (error) {
       console.error('Error in view tracking:', error)
     }
   }

   return res
   .status(200) 
   .json(new ApiResponse(200 , video , "Video fetched by id Successfully"))
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
  try {
    // Fetch all published videos with owner information
    // No authentication required - anyone can view published videos
    const publishedVideos = await Video.find({
      isPublished: true,
    })
    .populate('owner', 'username fullname avatar')
    .sort({ createdAt: -1 }); // Most recent first

    // If no videos found
    if (!publishedVideos || publishedVideos.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], "No published videos found"))
    }

    // Send response
    return res.status(200).json(new ApiResponse(200, publishedVideos, "Videos fetched successfully"));
  } catch (error) {
    console.error('Error fetching all videos:', error);
    throw new ApiError(500, "Failed to fetch videos");
  }
});


const searchVideos = asynchandler(async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;

    console.log('=== SEARCH REQUEST ===');
    console.log('Query:', query);
    console.log('Page:', page);
    console.log('Limit:', limit);

    if (!query || query.trim() === '') {
      console.log('Empty query received');
      return res.status(400).json(
        new ApiResponse(400, null, "Search query is required")
      );
    }

    // Simple regex search
    const searchQuery = {
      isPublished: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    console.log('Search query:', JSON.stringify(searchQuery));

    // Execute search
    const videos = await Video.find(searchQuery)
      .populate('owner', 'username fullname avatar')
      .select('title thumbnail views createdAt owner videoFile duration')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalResults = await Video.countDocuments(searchQuery);

    console.log(`Found ${totalResults} results, returning ${videos.length} videos`);

    return res.status(200).json(
      new ApiResponse(200, {
        videos,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalResults / parseInt(limit)),
          totalResults,
          limit: parseInt(limit)
        }
      }, "Search results fetched successfully")
    );
  } catch (error) {
    console.error('=== SEARCH ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json(
      new ApiResponse(500, null, error.message || "Failed to search videos")
    );
  }
});





export{
    publishAVideo,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getVideoById,
    getAllVideos,
    searchVideos
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