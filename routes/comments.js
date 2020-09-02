const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campgrounds");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// COMMENT ROUTES
// =======================================================

// comment NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground });
    }
  });
});
// Comment CREATE
router.post("/", middleware.isLoggedIn, (req, res) => {
  // lookup for campground
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      req.flash("error", "Something went wrong!");
      res.redirect("/campgrounds");
    } else {
      // create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // add username & id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          // connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          // redirect to campground show page
          req.flash("success", "Comment added successfuly");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// Commment EDIT
router.get(
  "/:comment_id/edit",
  middleware.checkCampgroundOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        req.flash("error", "Something went wrong");
        res.redirect("back");
      } else {
        res.render("comments/edit", {
          campground_id: req.params.id,
          comment: foundComment,
        });
      }
    });
  }
);

// Comment UPDATE
router.put("/:comment_id", middleware.checkCampgroundOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect("back");
      } else {
        req.flash("success", "Comment deleted");
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});

// Comment DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
