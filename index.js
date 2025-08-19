const express = require("express");
const app = express();
const session = require('express-session')
const MongoStore = require('connect-mongo');
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const flash = require("connect-flash");
// For Authentication
const User = require("./models/users.js");
const passport = require("passport");
const localStrategy = require("passport-local");
require('dotenv').config()

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", (err) => {
    console.log("Session store error:", err.message);
})

app.use(session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,

    }
}))

app.use(flash());

// For Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// const MongoURL = "mongodb://127.0.0.1:27017/explore_it" ;
const MongoURI = process.env.MONGO_URI;

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
        console.log(err.message);
    })

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/test", (req, res) => {
    console.log(req.session);
    req.session.name = "Delta";
    if (req.session.count) req.session.count += 1;
    else req.session.count = 1;

    res.send(`<h1>Hello World : ${req.session.count}</h1>`)
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found !"));
});

app.use((err, req, res, next) => {
    // console.error(err.stack);
    let { statusCode = 500, message = "Unexpected Error" } = err;
    // console.log(err.message);
    res.render("error.ejs", { err });
    // res.status(statusCode).send(message);
});

app.listen("8080", (req, res) => {
    console.log("Connected to port 8080");
})