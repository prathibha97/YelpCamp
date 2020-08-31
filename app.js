const express = require("express");
const Mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const { Mongoose } = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));

Mongoose.connect("mongodb://localhost/yelp_camp_2020", {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

// Mongoose Schema setup
const campgroundSchema = new Mongoose.Schema({
  name: String,
  image: String,
  decsription: String,
});

const Campground = Mongoose.model("Campground", campgroundSchema);

app.set("view engine", "ejs");

// let campgrounds = [
//   {
//     name: "salmon Creek",
//     image:
//       "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350",
//   },
//   {
//     name: "Granite Hill",
//     image:
//       "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&h=350",
//   },
//   {
//     name: "Mountain Goats Rest",
//     image:
//       "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350",
//   },
// ];

app.get("/", (req, res) => {
  res.render("Landing");
});

app.get("/campgrounds", (req, res) => {
  Campground.findById({}, (err, allCampgrounds) => {
    if (er) {
      console.log(err);
    } else {
      res.render("campgrounds", { campgrounds: allCampgrounds });
    }
  });
});

app.post("/campgrounds", (req, res) => {
  // get data from form and add to camgrounds array
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.decsription;
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

app.get("/campgrounds/new", (req, res) => {
  res.render("new.ejs");
});

app.listen("3000", (req, res) => {
  console.log("YelpCamp Server has started");
});
