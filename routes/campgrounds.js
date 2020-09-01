// CAMPGROUND ROUTES
// ==================================================
const express = require("express");
const router = express.Router();
const Campground = require("../models/campgrounds");

// INDEX - Show all campgrounds
router.get("/", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - add new campground toDB
router.post("/", isLoggedIn, (req, res) => {
  // get data from form and add to camgrounds array
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const author = {
    id:req.user._id,
    username:req.user.username,
  };
  const newCampground = { name: name, image: image, description: description, author:author};

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
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

// SHOW - show more info on one campground
router.get("/:id", (req, res) => {
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

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
