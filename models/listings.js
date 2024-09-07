const mongoose = require("mongoose");
const Reviews = require("./reviews");

const listSchema = new mongoose.Schema({
    title :{ 
        type : String,
        required : true,
        maxLength : 40
    },
    description : String,
    image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2023/05/22/10/49/houses-8010401_1280.jpg",
        set: (v) => (v === "" ? "https://cdn.pixabay.com/photo/2023/05/22/10/49/houses-8010401_1280.jpg" : v),
    },
    price:{
        type : Number,
        required : true,
    },
    location:{
        type : String,
        required : true,
    },
    country : {
        type : String,
        required : true,
    },
    reviews: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Reviews"
        }
    ]
});

listSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Reviews.deleteMany({ _id : { $in : listing.reviews }});
    }
});

const Listing = mongoose.model("Listing",listSchema);
module.exports = Listing;