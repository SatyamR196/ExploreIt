// This file exports essential middlewares
const Listing = require("../models/listings.js");
const Reviews = require("../models/reviews.js");

// MiddleWare to check user is authenticated
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You need to be logged in to access this page!");
        return res.redirect("/login");
    }
    next();
};

const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

const isOwner = async (req,res,next) =>{
    let {id} = req.params ;
    let listing = await Listing.findById(id) ;
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission!") ;
        return res.redirect(`/listings/${id}`) ;
    }
    next() ;
}

const isReviewAuther = async (req,res,next) =>{
    let {id,reviewId} = req.params ;
    let review = await Reviews.findById(reviewId) ;
    if(!review.auther.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to delete this review!") ;
        return res.redirect(`/listings/${id}`) ;
    }
    next() ;
}


module.exports = {
    isLoggedIn,
    saveRedirectUrl,
    isOwner,
    isReviewAuther

};
