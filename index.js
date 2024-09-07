const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const Reviews = require("./models/reviews.js");
const path= require("path");
const  methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");


app.engine('ejs',ejsMate);
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({ extended : true }));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

async function main() {
    await mongoose.connect("mongodb://localhost:27017/explore_it");
}

main()
.then(()=>{
    console.log("Connected to Database");
})
.catch((err)=>{
    console.log(err.message);
})

app.listen("8080",(req,res)=>{
    console.log("Connected to port 8080");
})

app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.get("/listings",wrapAsync(async (req,res)=>{
    let allListings= await Listing.find();
    res.render("listings.ejs",{allListings});
}));

app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
});

app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let place= await Listing.findById(id);
    res.render("edit.ejs",{place});
}));

app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.delete("/listings/:id/reviews/:reviewId",wrapAsync (async(req,res)=>{
    let {id,reviewId} = req.params;
    await Reviews.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{ $pull : { reviews : reviewId } });
    res.redirect(`/listings/${id}`);
}));

app.patch("/listings/:id",wrapAsync (async (req,res,next)=>{

    let {id} = req.params;
    let node = req.body;
    console.log(node.List);
    await Listing.findByIdAndUpdate(id,node.List)
    // .then((resolve)=>{
    //     console.log(resolve);
    // })
    // .catch((err)=>{
    //     console.log(err);
    // });
    res.redirect(`/listings/${id}`) ;

}));

//show route:-
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let place= await Listing.findById(id).populate("reviews");
    res.render("show.ejs",{place});
}));

app.post("/listings",async (req,res,next)=>{
    try{
    let {title,description,image,price,location,country} = req.body;
    await Listing.insertMany([{
        title:title,
        description:description,
        image : image,
        price : price,
        location : location,
        country : country,
    }])
    // .then((resolve)=>{
    //     console.log(resolve);
    // })
    // .catch((err)=>{
    //     // console.log(err);
    //     next(err);
    // });
    res.redirect("/listings");
    }
    catch(err){
        next(err);
    }
});

app.post("/listings/:id/reviews",wrapAsync( async (req,res)=>{
        let {id} = req.params;
        let listing = await Listing.findById(id);
        let newReview = new Reviews(req.body.review);
        listing.reviews.push(newReview);
        await newReview.save() ;
        await listing.save() ;
        res.redirect(`/listings/${id}`);
}));

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found !"));
// });

app.use((err,req, res, next) => {
    // console.error(err.stack);
    let {statusCode=500,message="Unexpected Error"} = err;
    console.log(err.message);
    res.render("error.ejs",{err});
    // res.status(statusCode).send(message);
});
