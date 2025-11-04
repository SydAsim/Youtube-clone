import mongoose, {Schema, Types} from "mongoose";

const likeSchema = new Schema (
    {
        comment:{
            type : Schema.Types.ObjectId,
            ref : "Comment"
        },
        video:{
                type : Schema.Types.ObjectId,
                ref : "Video"
        },

        likedby : { 
            type : Schema.Types.ObjectId,
            ref: "User"
        },

        tweet :{
            type: Schema.Types.ObjectId,
            ref : "Tweet"
        }

    },{timestamps : true}
)


// ✅ Prevent duplicate likes by the same user on same video
likeSchema.index({ video: 1, user: 1 }, { unique: true });

export const Like = mongoose.model("Like" , likeSchema)