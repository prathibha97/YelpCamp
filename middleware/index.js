// all middleware goes here

const Campground = require("../models/campgrounds");
const Comment = require("../models/comment");
const middlewareObj = {};

// middleware

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  // is user logged in
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        res.redirect("back");
      } else {
        // doed user own the campground
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  // is user logged in
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        // does user own the campground?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
          // otherwise redirect
        } else {
          res.redirect("back");
        }
      }
    });
    // if not, redirect
  } else {
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = middlewareObj;
