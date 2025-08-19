const express = require("express") ;
const router = express.Router({mergeParams : true});
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const Reviews = require("../models/reviews.js");
const { isLoggedIn, isOwner, isReviewAuther } = require("../utils/loggedIn.js");

// Post review route
router.post("/",isLoggedIn,wrapAsync( async (req,res)=>{
        let {id} = req.params;
        let listing = await Listing.findById(id);
        let newReview = new Reviews(req.body.review);
        newReview.auther = req.user._id ;
        listing.reviews.push(newReview);
        await newReview.save() ;
        await listing.save() ;
        req.flash("success","Review Posted!") ;
        res.redirect(`/listings/${id}`);
}));

// Delete post route
router.delete("/:reviewId",isLoggedIn,isReviewAuther,wrapAsync (async(req,res)=>{
    let {id,reviewId} = req.params;
    await Reviews.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{ $pull : { reviews : reviewId } });
    req.flash("success","Review Deleted!") ;
    res.redirect(`/listings/${id}`);
}));



module.exports = router ;

