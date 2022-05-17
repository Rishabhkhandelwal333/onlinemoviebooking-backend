const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter movie name"]
    },
    // pic:{
    //     type:String,
    //     required:[true,"please enter movie picture"]
    // },
    description:{
        type:String,
        required:[true,"please enter movie description"]
    },
    price:{
        type:Number,
        required:[true,"please enter movie description"],
        maxLength:[8,"Cannot exceed more than 8"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true

            }
        }
    ],
    genre:{
        type:String,
        required:[true,"Please enter genre "]

    },
    seats:{
        type:Number,
        required:[true,"Please enter seats "],
        maxLength:[3,"Cannot exceed more than 3"],
        default:1

    },
    numOfReviews:{
        type:Number,
        default:0
        
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true,
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true,
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Movie",movieSchema) 