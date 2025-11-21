import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/asyncHandler.js"
import { User } from '../models/user.model.js'
import { uploadonCloudinary } from '../utils/Cloudinary.js'
import jwt from 'jsonwebtoken'
import { upload } from "../middlewares/multer.middleware.js"
import mongoose from "mongoose"
import crypto from "crypto"


const generateAccessandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, error?.message || "Somthing went worng while generating access and refreshToken")

    }

}

const registerUser = asynchandler(async (req, res) => {
    //get user details from the front-end 
    // validation - not empty 
    // check if the user already exists  : username , email
    // check for images , check for avatar 
    // upload them to cloudinary 
    // create user object (in mongodb we send data through objects) - create entry in db 
    // remove password and refresh token field from the reponse 
    // check for user creation 
    // return response 

    const { fullname, email, username, password } = req.body
    // console.log("username is " , username)

    //1: Validation all field must be filled
    if ([fullname, email, username, password]
        .some(field => field?.trim() == "")) {
        throw new ApiError(400, "All fields are required")
    }

    //2: Check if the User Already Existed or not in DB
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with Username or email already exist")
    }

    // 3:Check if the user has upload Avatar and coverImage or not
    // You’re checking if files exist
    //When the request hits your backend, multer automatically:
    //Reads the uploaded files
    //Stores them in the defined folder (./public/temp)
    //Adds info to req.files, such as:
    //     console.log("req.files:", req.files);
    // console.log("req.body:", req.body);

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // parrellel Uplaod on Cloudinary
    const [avatar, coverImage] = await Promise.all([
        uploadonCloudinary(avatarLocalPath),
        uploadonCloudinary(coverImageLocalPath)
    ]);

    // const avatar = await uploadonCloudinary(avatarLocalPath)
    // const coverImage = await uploadonCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatarr upload failed . Please try again")
    }

    // 4: create User object in mongodb
    const createdUser = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar: avatar.secure_url,
        coverImage: coverImage?.secure_url || ""
    })

    // 5:Confirm that is User registered or not 
    // const createdUser = await User.findById(user._id).select(
    //     "-password  -refreshToken"
    // )
    //ℹ️ we dont to Search for the user again and we can ignore the extra db call 

    createdUser.password = undefined,          // You can safely skip the extra query and just remove fields in-memory:
        createdUser.refreshToken = undefined


    if (!createdUser) {
        throw new ApiError(500, "Somthing went wrong while Registering User")
    }

    // 6:return response 
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    )

})


const loginUser = asynchandler(async (req, res) => {
    // req->body->data
    // username or email 
    // find in db either username or email or whatever you have asked the user to enter
    // checkpass
    // access and refreshToken

    const { email, username, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(400, "username doesnot  exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Password is not Correct")
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true, // Always use secure in production
        sameSite: 'none', // Required for cross-domain cookies
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: '/' // Ensure cookie is available on all paths
    }

    const refreshOptions = {
        ...options,
        maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, refreshOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User loggedIn SuccessFully"
            )
        )

})


const logoutUser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    )
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
    }

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})




const refreshAccessToken = asynchandler(async (req, res) => {
    const incomingRefreshToken = req.body?.refreshToken || req.cookies?.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(400, "unautorized request")
    }

    try {
        const dedcodeToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(dedcodeToken?._id)

        if (!user) {
            throw new ApiError(400, "Invalid refreshToken")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(400, "RefereshToken is Expired")
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/'
        }

        const refreshOptions = {
            ...options,
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
        }

        const { accessToken, refreshToken: newrefreshToken } = await generateAccessandRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, refreshOptions)
            .json(
                new ApiResponse(200, { accessToken, refreshToken: newrefreshToken }, "accessToken  Refreshed")
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized request")

    }
})


const changePassword = asynchandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req?.user._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Password incorrect")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asynchandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched Successfully"))
})


const updateAccountDetails = asynchandler(async (req, res) => {
    const { email, fullname } = req.body

    if (!email || !fullname) {
        new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname: fullname,
                email
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account Updated Successfully"))
})



const updateUserAvatar = asynchandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadonCloudinary(avatarLocalPath)
    if (!avatar.secure_url) {
        throw new ApiError(400, "Error while uploading avatar")
    }

    const user = await User.findByIdAndUpdate(

        req.user?._id,

        {
            $set: { avatar: avatar.secure_url }
        },

        { new: true }
    ).select("-password")



    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar or CoverImage updated Successfully"))

})




const updateUsercoverImage = asynchandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, "CoverImage is required")
    }

    const coverImage = await uploadonCloudinary(coverImageLocalPath)
    if (!coverImage.secure_url) {
        throw new ApiError(400, "CoverImage Upload failed")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.secure_url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "CoverImage updaet Succesfully"))

})




// when you open /@syedasimbacha on the frontend.
// So, you don’t just want their username and email —
// you want their:
// profile info (fullname, avatar, coverImage)
// number of subscribers
// number of channels they have subscribed to
// whether the currently logged-in user is subscribed to this channel


// “Hey MongoDB, take each user from the users collection,
// and go to the subscriptions collection — find all documents
// where the subscriptions.channel field matches this user’s _id.

const getUserChannelProfile = asynchandler(async (req, res) => {
    const { username } = req.params // router.get("/users/:username", getUserChannelProfile);
    //  console.log("Requested username:", req.params.username);

    if (!username.trim()) {
        throw new ApiError(400, "Username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()  // match means find compare  equlant to sql query User.findOne({ username: username.toLowerCase() })
            }


        },
        {
            $lookup: {                    //---Finding who subscribed to this user  $lookup joins two collections (like SQL JOIN).
                from: "subscriptions", // from: "subscriptions" → we’re joining with the subscriptions collection. the collection to look inside
                localField: "_id",      // -- our current user’s _id
                foreignField: "channel", // match that _id with this field inside subscriptions 
                as: "subscribers"       //store the matching results in a new array called subscribers
            }
        },
        {   // reverse of the first $lookup 
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        // the users  Schema now has SubscribersCount and ChannelSubscribedToCount 
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                subscribeTo: {
                    $size: "$subscribedTo"
                },

                isSubscribed: {
                    $cond: {
                        if: {
                            $and: [
                                { $ne: [req.user?._id, null] }, // Check if user is logged in
                                { $in: [req.user?._id, "$subscribers.subscriber"] }
                            ]
                        },
                        then: true,
                        else: false
                    }
                }
            }

        },
        {
            $project: {
                fullname: 1,
                email: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,
                subscriberCount: 1,
                isSubscribed: 1,
                subscribeTo: 1

            }
        }

    ])
    if (!channel?.length) {
        throw new ApiError(400, "Channel does not exsit")

    }

    return res
        .status(200)
        .json(new ApiResponse(200, channel[0], "User channel Profile fetched successfully "))

})

const getUserWatchHistory = asynchandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: { // cause all the data of the current user will come that includes the email coverImage password etc so can add Project
                                        username: 1,
                                        fullname: 1,
                                        avatar: 1
                                    }
                                }


                            ]

                        }
                    }
                    ,
                    {
                        //just for the ease of front we should just override the owner forntend will get owner object and from that he can owner. he can get the values
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]


            }

        }
    ])


    return res
        .status(200)
        .json(new ApiResponse(200, user[0].watchHistory || [], "User WatchedHistory Fetched Succesfully"))
})




// FORGOT PASSWORD - Send reset email
const forgotPassword = asynchandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        // Don't reveal if user exists or not (security)
        return res.status(200).json(
            new ApiResponse(200, {}, "If email exists, password reset link has been sent")
        );
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    try {
        // Send email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const { sendEmail, getPasswordResetEmailHTML } = await import('../utils/sendEmail.js');
            
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request - YouTube Clone',
                html: getPasswordResetEmailHTML(resetUrl, user.username)
            });

            console.log('✅ Password reset email sent to:', user.email);
        } else {
            // Development mode - log URL to console
            console.log('📧 Email not configured. Password Reset URL:', resetUrl);
            console.log('⚠️  To enable emails, add EMAIL_USER and EMAIL_PASS to .env');
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                process.env.NODE_ENV === 'development' ? { resetUrl } : {}, // Show URL only in dev
                "Password reset link has been sent to your email"
            )
        );
    } catch (error) {
        // If email fails, clear the reset token
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        console.error('Email sending failed:', error);
        throw new ApiError(500, "Failed to send password reset email. Please try again later.");
    }
});

// RESET PASSWORD - Verify token and update password
const resetPassword = asynchandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters");
    }

    // Hash the token from URL
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset successful")
    );
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUsercoverImage,
    getUserChannelProfile,
    getUserWatchHistory,
    forgotPassword,
    resetPassword,

}