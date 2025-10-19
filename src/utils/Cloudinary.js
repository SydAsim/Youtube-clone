import {v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadonCloudinary = async(localfilepath)=>{
    try {
        if(!localfilepath) return null;
        const response = await cloudinary.uploader.upload(localfilepath,{resource_type:"auto"})
        fs.unlink(localfilepath)
        return response
        
    } catch (error) {
        console.log("❌Cloudinary upload failed " ,error);
        fs.unlink(localfilepath)
        return null   
    }
}

export {uploadonCloudinary}