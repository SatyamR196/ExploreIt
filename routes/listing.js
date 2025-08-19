const express = require('express') ;
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const {isLoggedIn, isOwner} = require("../utils/loggedIn.js") ;

router.get("/",wrapAsync(async (req,res)=>{
    let allListings= await Listing.find();
    res.render("listings.ejs",{allListings});
}));

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("new.ejs");
});

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let place= await Listing.findById(id);
    res.render("edit.ejs",{place});
}));

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{

    let {id} = req.params;
    await Listing.findByIdAndDelete(id) ;
    req.flash("success","Listing Deleted!") ;
    res.redirect("/listings");
}));

router.patch("/:id",isLoggedIn,isOwner,wrapAsync (async (req,res,next)=>{

    let {id} = req.params;
    let node = req.body;
    // console.log(node.List);
    await Listing.findByIdAndUpdate(id,node.List);
    req.flash("success","Listing Updated!") ;
    res.redirect(`/listings/${id}`) ;

}));

//show route:-
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let place= await Listing.findById(id).populate({path : "reviews" , populate : { path : "auther"}})
    .populate("owner");
    console.log(place) ;
    res.render("show.ejs",{place});
}));

router.post("/",isLoggedIn,wrapAsync(async (req,res,next)=>{
    const listingData = req.body;
    await Listing.insertMany([{
        title: listingData.title,
        description: listingData.description,
        image: listingData.image,
        price: listingData.price,
        location: listingData.location,
        country: listingData.country,
        owner: req.user._id,
    }]);
    req.flash("success","New Listing Created!") ;
    res.redirect("/listings");
}));



module.exports = router ;