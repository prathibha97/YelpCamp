const express = require("express");
const { Router } = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  res.render("campgrounds");
});

app.listen("3000", (req, res) => {
  console.log("Server started on port 3000");
});
