const sample = require("./data.js");
const mongoose = require("mongoose");
const Listing = require("../models/listings.js");
require('dotenv').config({ path: '../.env' });

const MongoURI = process.env.MONGO_URI ;

// async function main() {
//     // await mongoose.connect("mongodb://localhost:27017/explore_it");
//     await mongoose.connect("mongodb://127.0.0.1:27017/explore_it");
// }

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function main() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(MongoURI, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch(err) {
        console.log("Database connection failed:", err.message);
    }
}

main()
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((err) => {
        console.log(err);
    })

const initDB = async () => {
    await Listing.deleteMany({});
    sample.data = sample.data.map((obj)=>{
        obj.owner = "68a4236b15148d1cf3a597c4" ;
        return obj ;
    }) ;
    Listing.insertMany(sample.data)
        .then((data) => {
            console.log("sucessful", data);
        })
        .catch((err) => {
            console.log(err);
        });
    console.log("data initialized") ;
}

initDB() ;
