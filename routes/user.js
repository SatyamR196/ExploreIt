const express = require("express") ;
const router = express.Router({mergeParams : true});
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport") ;
const {saveRedirectUrl} = require("../utils/loggedIn.js") ;

router.get("/signUp",(req,res)=>{
    res.render("signUp.ejs")
}) ;

router.post("/signUp",wrapAsync(async (req,res)=>{
    try{
        let {username,email,password} = req.body ;
        const newUser = new User({username,email}) ;
        const registeredUser = await User.register(newUser,password) ;
        console.log(registeredUser) ;
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err) ;
            }
            req.flash("success","SignUp Successful! Welcome to Explore It!");
            res.redirect("/listings") ;
        })
        // req.flash("success","SignUp Successful! Welcome to Explore It!");
        // res.redirect("/login") ;
    }catch(err){
        req.flash("error",err.message) ;
        res.redirect("/signUp") ;
    }
}))

router.get("/login",(req,res)=>{
    res.render("login.ejs")
}) ;

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureFlash : true,failureRedirect : "/login"}),wrapAsync(async (req,res)=>{
    req.flash("success","Welcome Back, "+req.user.username+"!") ;
    res.redirect(res.locals.redirectUrl || "/listings") ;
    // console.log(res.locals.redirectUrl) ;
    // res.redirect("/listings") ;
}))

router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err) ;
        }
        req.flash("success","You have been logged out!") ;
        res.redirect("/login") ;
    })
})


module.exports = router ;
