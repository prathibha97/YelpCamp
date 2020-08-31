const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');

// passport config
app.use(
  require("express-session")({
    secret: "my name is prathibha",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.use('/',indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen("3000", (req, res) => {
  console.log("YelpCamp Server has started");
});
