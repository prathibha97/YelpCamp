const express = require("express");
const { Router } = require("express");
const app = express();

app.set("view engine", "ejs");

let campgrounds = [
  {
    name: "Salmon Creek",
    image:
      "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350",
  },
  {
    name: "Granite Hill",
    image:
      "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350",
  },
  {
    name: "Cloud's Rest",
    image:
      "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&h=350",
  },
];

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  res.render("campgrounds", {campgrounds:campgrounds});
});

app.listen("3000", (req, res) => {
  console.log("Server started on port 3000");
});
