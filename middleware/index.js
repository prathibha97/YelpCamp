// all middleware goes here

const Campground = require('../models/campgrounds');
const Comment = require('../models/comment');
const middlewareObj ={};

// middleware
 middlewareObj.isLoggedIn=function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

  module.exports=middlewareObj;