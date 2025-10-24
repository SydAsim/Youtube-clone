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
    coverImage:{
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
    this.password = await bcrypt.hash(this.password, 10) // salting rounds 10
 next()

})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password)   
}



// The user's details (like id, email, and username) already exist in the database.
// We include some of them in the JWT payload to identify the user when verifying the token later.
//But we’re not “checking” them in this function — we’re embedding them in the token payload so
//that when the client sends this token later, the backend can verify who the user is without re-checking the database every time.
userSchema.methods.generateAccessToken = function ()
{
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
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