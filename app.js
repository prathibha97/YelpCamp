const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Campground = require("./models/campgrounds");
const Comment = require("./models/comment");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");

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

app.get("/", (req, res) => {
  res.render("Landing");
});

// CAMPGROUND ROUTES
// ==================================================

// INDEX - Show all campgrounds
app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - add new campground toDB
app.post("/campgrounds", isLoggedIn, (req, res) => {
  // get data from form and add to camgrounds array
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const newCampground = { name: name, image: image, description: description };

  //   create new campground to save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

// NEW - Show form to add new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// SHOW - show more info on one campground
app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

// COMMENT ROUTES
// =======================================================

//add new comment
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground });
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
  // lookup for campground
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          // redirect to campground show page
          res.redirect("/campgrounds/" + campground.id);
        }
      });
    }
  });
});

// AUTH Routes
// ==============================================================

// Show register form
app.get("/register", (req, res) => {
  res.render("register");
});

// signup logic
app.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }

    passport.authenticate("local")(req, res, () => {
      res.redirect("/campgrounds");
    });
  });
});

// show login form

app.get("/login", (req, res) => {
  res.render("login");
});

// handling login logic
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

// logout
app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/campgrounds");
});

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen("3000", (req, res) => {
  console.log("YelpCamp Server has started");
});
