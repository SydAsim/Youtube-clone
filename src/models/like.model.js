import mongoose, {Schema, Types} from "mongoose";

const likeSchema = new Schema (
    {
        comments:{
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