const sample = require("./data.js");
const mongoose = require("mongoose");
const Listing = require("../models/listings.js");

async function main() {
    await mongoose.connect("mongodb://localhost:27017/explore_it");
}

main()
.then(()=>{
    console.log("Connected to Database");
})
.catch((err)=>{
    console.log(err);
})

Listing.insertMany(sample.data)
.then((data)=>{
    console.log("sucessful",data);
})
.catch((err)=>{
    console.log(err);
});