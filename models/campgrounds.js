const mongoose = require("mongoose");
const Comment = require('./comment');
mongoose.connect("mongodb://localhost/yelp_camp_2020", {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});
// Mongoose Schema setup

const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Comment,
    },
  ],
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: String,
  },
  createdAt:{type:Date, default:Date.now}
});

module.exports = mongoose.model("Campground", campgroundSchema);
