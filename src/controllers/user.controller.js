import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asynchandler.js"
import {User} from '../models/user.model.js'
import {uploadonCloudinary} from '../utils/Cloudinary.js'


const registerUser = asynchandler(async(req,res)=>{
    //get user details from the front-end 
    // validation - not empty 
    // check if the user already exists  : username , email
    // check for images , check for avatar 
    // upload them to cloudinary 
    // create user object (in mongodb we send data through objects) - create entry in db 
    // remove password and refresh token field from the reponse 
    // check for user creation 
    // return response 

    const {fullname , email , username ,password } = req.body
    console.log("username is " , username)

    //1: Validation all field must be filled
    if([fullname,email,username,password]
        .some(field=>field?.trim()==""))
        {
            throw new ApiError("All fields are required")
        }
    
    //2: Check if the User Already Existed or not in DB
    const existedUser = await User.findOne({
        $or:[{email} , {username}]
    }) 
    if(existedUser){
        throw new ApiError(409 ,"User with Username or email already exist")
    }

    // 3:Check if the user has upload Avatar and coverImage or not
    // You’re checking if files exist
    //When the request hits your backend, multer automatically:
    //Reads the uploaded files
    //Stores them in the defined folder (./public/temp)
    //Adds info to req.files, such as:
//     console.log("req.files:", req.files);
// console.log("req.body:", req.body);

    const avatarLocalPath = req.files.avatar[0]?.path
    const coverImageLocalPath = req.files.coverImage[0]?.path

    if(!avatarLocalPath) {
        throw new ApiError(400 ,"Avatar file is required")
    }

//parrellel Uplaod on Cloudinary
//  const [avatar, coverImage] = await Promise.all([
//   uploadonCloudinary(avatarLocalPath),
//   uploadonCloudinary(coverImageLocalPath)
// ]);

    const avatar = await uploadonCloudinary(avatarLocalPath)
    const coverImage = await uploadonCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400 , "Avatarr upload failed . Please try again")
    }

    // 4: create User object in mongodb
    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar:avatar.url,
        coverImage: coverImage?.url || ""
    })

    // 5:Confirm that is User registered or not 
    const createdUser = await User.findById(user._id).select(
        "-password  -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Somthing went wrong while Registering User")
    }

    // 6:return response 
    return res.status(201).json(
        new ApiResponse(createdUser, "User regsitered Successfully")
    )

})

export {
    registerUser,

}