const mongoose= require("mongoose");
const Schema = mongoose.Schema ;

const reviewSchema = new mongoose.Schema({
    rating : {
        type: Number,
        required : [true,"Giving Rating is compulsury"],
        min: [1,"Rating must be from 1 to 5"],
        max: [5,"Rating must be from 1 to 5"]
    },
    comment:{
        type: String,
        required: true,
    },
    created_at:{
        type: Date,
        default: new Date()
    },
    auther :{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Reviews = mongoose.model("Reviews",reviewSchema);
module.exports = Reviews;