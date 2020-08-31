const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Campground = require("./models/campgrounds");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("Landing");
});

// CAMPGROUND ROUTES

// INDEX - Show all campgrounds
app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - add new campground toDB
app.post("/campgrounds", (req, res) => {
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

//add new comment
app.get("/campgrounds/:id/comments/new", (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground });
    }
  });
});

app.listen("3000", (req, res) => {
  console.log("YelpCamp Server has started");
});
