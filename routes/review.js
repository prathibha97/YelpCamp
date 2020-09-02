const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campgrounds');