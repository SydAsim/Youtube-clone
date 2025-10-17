import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type:String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
        unique:true
    },

    email:{
        type:String,
        required: true,
        lowercase: true,
        unique:true,
        trim: true
    },

    fullname:{
        type:String,
        required:true,
        index:true,
        trim:true,
    },
    
    avatar : {
        type: String,// cloudinary upload url
        required:true,
    },
    coverimage:{
        type: String,
    },

    password :{
        type:String,
        required: [true , "Password is required"],
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }

    ],

    refreshToken : {
        type:String
    }
},

{timestamps:true}
)


// next is a callback function provided by Mongoose middleware system.
// It’s just a function parameter that Mongoose injects into your middleware.
// You could technically name it anything, like: done etc

userSchema.pre("save", async function(next){
if (!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password, 10) // salting rounds 10
 next()

})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password)   
}


userSchema.methods.generateAccessToken = function ()
{
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            password:this.password
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function ()
{
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}









export const User = mongoose.model("User" ,userSchema)